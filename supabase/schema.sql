-- Tabulky pro ETF dvojčata. Spusť jednou v Supabase: SQL Editor → New query → vlož celý soubor → Run.
-- Skript jde pustit znovu, nic nesmaže.
--
-- Zapisuje jen serverless funkce v api/ secret klíčem (sb_secret_…, role service_role, ta RLS obchází).
-- Prohlížeč se Supabase nemluví. Anonymní ani přihlášená role (publishable klíč) nesmí nic číst ani
-- zapisovat: RLS je zapnuté, žádná politika neexistuje a práva jsou odebraná.

-- Kontakty: e-mail, souhlas, čas souhlasu a verze úvodu z ?v=. Nic víc: žádná IP, prohlížeč ani ID návštěvy.
create table if not exists public.leads (
  id          bigint      generated always as identity primary key,
  email       text        not null unique
                          check (char_length(email) between 3 and 254 and email = lower(email) and email like '%_@_%'),
  souhlas     boolean     not null check (souhlas),
  souhlas_cas timestamptz not null default now(),
  varianta    text        not null default 'vychozi' check (varianta in ('vychozi', 'dvojce', 'zacatek'))
);

-- Anonymní události z cesty návštěvníka. Bez e-mailu; ID návštěvy žije jen v paměti jednoho načtení stránky.
-- Čas se ukládá jen na celé hodiny, aby nešlo událost „odeslano“ spárovat s řádkem v leads podle času.
create table if not exists public.events (
  id        bigint      generated always as identity primary key,
  navsteva  uuid        not null,
  udalost   text        not null check (udalost in (
              'prichod', 'scroll', 'otoceni_listku', 'vyzva_zobrazena', 'cta', 'formular_otevren',
              'formular_zacatek', 'odeslani_pokus', 'odeslani_chyba', 'odeslano', 'tahak_otevren', 'sdileni')),
  varianta  text        not null check (varianta in ('vychozi', 'dvojce', 'zacatek')),
  detail    text        check (detail ~ '^[A-Za-z0-9_:.-]{1,40}$'),
  cas       timestamptz not null default date_trunc('hour', now())
);

create index if not exists events_udalost_varianta on public.events (udalost, varianta);
create index if not exists events_navsteva on public.events (navsteva);

-- Row Level Security bez jediné politiky: přes API (publishable klíč) nejde nic přečíst ani zapsat.
alter table public.leads  enable row level security;
alter table public.events enable row level security;
revoke all on table public.leads, public.events from anon, authenticated;

-- Serverless funkce (secret klíč = role service_role): zápis a čtení pro keep-alive.
grant select, insert on table public.leads, public.events to service_role;
