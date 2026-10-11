-- Tabulky a funkce pro ETF dvojčata. Spusť v Supabase: SQL Editor → New query → vlož celý soubor → Run.
-- Skript jde pustit znovu, nic nesmaže. Testuje ho scripts/test-db.mjs na skutečném Postgresu (PGlite).
--
-- Zapisují jen serverless funkce v api/ secret klíčem (sb_secret_…, role service_role) a jen přes funkce
-- uloz_kontakt, uloz_udalost a uklid. Prohlížeč se Supabase nemluví. Anonymní ani přihlášená role
-- (publishable klíč) nesmí nic číst, zapisovat ani volat: RLS bez politik a odebraná práva.

-- Nové tabulky a funkce v public nedostanou anon a authenticated automaticky žádná práva
-- (Supabase je jinak přiděluje výchozími právy).
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
alter default privileges in schema public revoke execute on functions from public, anon, authenticated;

-- Kontakty: e-mail, souhlas, čas souhlasu a verze úvodu z ?v= (podle ní trychtýř počítá odeslání, viz funnel.sql).
-- Nic víc: žádná IP, prohlížeč ani ID návštěvy. Klíč je náhodné UUID, ne pořadové číslo (podle pořadí zápisu
-- by šel kontakt řadit k událostem).
create table if not exists public.leads (
  id          uuid        primary key default gen_random_uuid(),
  email       text        not null unique
                          check (char_length(email) between 6 and 254 and email = lower(email)
                                 and email ~ '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z0-9-]{2,}$'),
  souhlas     boolean     not null check (souhlas),
  souhlas_cas timestamptz not null default now(),
  varianta    text        not null default 'vychozi' check (varianta in ('vychozi', 'dvojce', 'zacatek'))
);
-- Verze textu souhlasu, se kterým člověk souhlasil (text i verze jsou v api/_lib.js, SOUHLAS). Přidané 11. 10. 2026:
-- na starší databázi ho doplní tenhle příkaz, řádky z doby před verzováním dostanou 'bez-verze'.
alter table public.leads add column if not exists souhlas_verze text not null default 'bez-verze'
  check (souhlas_verze ~ '^[a-z0-9-]{1,40}$');

-- Anonymní události z cesty návštěvníka. Bez e-mailu; ID návštěvy žije jen v paměti jednoho načtení stránky.
-- Události od odeslání formuláře dál (pokus, chyba, odeslání, otevření taháku, sdílení) jsou vždy bez ID návštěvy,
-- aby nešlo poznat, která návštěva kontakt odeslala. Čas jen na celé minuty a klíč náhodný (viz README, Měření).
create table if not exists public.events (
  id        uuid        primary key default gen_random_uuid(),
  navsteva  uuid,
  udalost   text        not null check (udalost in (
              'prichod', 'scroll', 'otoceni_listku', 'vyzva_zobrazena', 'cta', 'formular_otevren',
              'formular_zacatek', 'odeslani_pokus', 'odeslani_chyba', 'odeslano', 'tahak_otevren', 'sdileni')),
  varianta  text        not null check (varianta in ('vychozi', 'dvojce', 'zacatek')),
  detail    text        check (detail ~ '^[A-Za-z0-9_:.-]{1,40}$'),
  cas       timestamptz not null default date_trunc('minute', now()),
  check ((navsteva is null) = (udalost in ('odeslani_pokus', 'odeslani_chyba', 'odeslano', 'tahak_otevren', 'sdileni')))
);
create index if not exists events_udalost_varianta on public.events (udalost, varianta);
create index if not exists events_navsteva on public.events (navsteva);

-- Počítadla pro omezení pokusů. Klíč je HMAC z IP adresy, endpointu a hodiny s tajnou solí
-- (počítá ho api/_lib.js), takže tu žádná IP adresa není a klíče z různých hodin nejdou spojit.
create table if not exists public.limity (
  klic  text        not null check (klic ~ '^[0-9a-f]{32}$'),
  okno  timestamptz not null,
  pocet integer     not null,
  primary key (klic, okno)
);

alter table public.leads  enable row level security;
alter table public.events enable row level security;
alter table public.limity enable row level security;
revoke all on table public.leads, public.events, public.limity from anon, authenticated;
-- Práva pro service_role výslovně, nespoléhají na automatická práva Supabase (projekt s vypnutým
-- „Automatically expose new tables“ je nedává). Přesně to, co potřebují funkce níž; sekvence nejsou (klíče jsou uuid).
grant usage on schema public to service_role;
grant select, insert on table public.leads, public.events to service_role;
grant select, insert, update, delete on table public.limity to service_role;

-- Započítá pokus v aktuální hodině a vrátí, jestli je ještě v limitu.
create or replace function public.zapocitej(p_klic text, p_max integer)
returns boolean language sql security invoker set search_path = '' as $$
  insert into public.limity as l (klic, okno, pocet) values (p_klic, date_trunc('hour', now()), 1)
  on conflict (klic, okno) do update set pocet = l.pocet + 1
  returning l.pocet <= p_max;
$$;

-- Kontakt: nejvýš 30 pokusů za hodinu z jedné IP (sdílená IP mobilních operátorů, viz README). Vrací 'novy', 'duplicita' (e-mail už je, nic se nemění)
-- nebo 'limit'. Starší verze funkce bez verze souhlasu se nahradí (jinak by volání se třemi argumenty bylo nejednoznačné).
drop function if exists public.uloz_kontakt(text, text, text);
create or replace function public.uloz_kontakt(p_klic text, p_email text, p_varianta text, p_souhlas_verze text default 'bez-verze')
returns text language plpgsql security invoker set search_path = '' as $$
begin
  if not public.zapocitej(p_klic, 30) then return 'limit'; end if;
  insert into public.leads (email, souhlas, varianta, souhlas_verze) values (p_email, true, p_varianta, p_souhlas_verze)
  on conflict (email) do nothing;
  if found then return 'novy'; end if;
  return 'duplicita';
end $$;

-- Událost: nejvýš 600 za hodinu z jedné IP a 100 na jednu návštěvu (události bez ID návštěvy hlídá jen limit IP).
-- Vrací 'ok' nebo 'limit'.
create or replace function public.uloz_udalost(p_klic text, p_navsteva uuid, p_udalost text, p_varianta text, p_detail text)
returns text language plpgsql security invoker set search_path = '' as $$
begin
  if not public.zapocitej(p_klic, 600) then return 'limit'; end if;
  if p_navsteva is not null and (select count(*) from public.events where navsteva = p_navsteva) >= 100 then
    return 'limit';
  end if;
  insert into public.events (navsteva, udalost, varianta, detail) values (p_navsteva, p_udalost, p_varianta, p_detail);
  return 'ok';
end $$;

-- Úklid počítadel starších než 2 dny. Volá ho denní cron (/api/keepalive), takže je to zároveň aktivita v databázi.
create or replace function public.uklid()
returns integer language sql security invoker set search_path = '' as $$
  with smazane as (delete from public.limity where okno < now() - interval '2 days' returning 1)
  select count(*)::integer from smazane;
$$;

revoke all on function public.zapocitej(text, integer), public.uloz_kontakt(text, text, text, text),
  public.uloz_udalost(text, uuid, text, text, text), public.uklid() from public, anon, authenticated;
grant execute on function public.zapocitej(text, integer), public.uloz_kontakt(text, text, text, text),
  public.uloz_udalost(text, uuid, text, text, text), public.uklid() to service_role;
