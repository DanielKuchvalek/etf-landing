-- Trychtýř po krocích zvlášť pro každou verzi úvodu (?v=): příchod → otočení lístku → otevření formuláře → odeslání.
-- Spusť v Supabase: SQL Editor → vlož celý soubor → Run (jde spustit znovu). Pak kdykoli:
--   select * from analytika.trychtyr;                                   -- za celou dobu
--   select * from analytika.trychtyr_od('2026-10-16 00:00+02');          -- jen od spuštění kampaně
--
-- Funkce a pohled jsou ve vlastním schématu „analytika“, které Supabase API nevystavuje, a běží s právy toho, kdo
-- se ptá (security invoker). Přes publishable klíč je tedy nikdo nepřečte.
--
-- Trychtýř je agregovaný: kroky 1–3 podle návštěv (událostí s ID návštěvy), odeslání podle kontaktů. Jde z něj
-- vyčíst, kolik návštěv kterým krokem prošlo a jaký podíl odeslal formulář, zvlášť podle verze úvodu. Nejde z něj
-- vyčíst, jestli odesílající návštěva předtím otočila lístek (záměrně, kontakt nejde spárovat s návštěvou).
--
-- Kroky 1–3 se počítají z událostí podle ID návštěvy. Odeslání se počítá z tabulky kontaktů podle verze úvodu
-- uložené u kontaktu: události od odeslání dál záměrně nemají ID návštěvy, aby kontakt nešel spárovat s návštěvou.
-- Proto u odeslání není „postupně“ (nejde zjistit, které předchozí kroky odesílající návštěva udělala).
-- Opakovaný e-mail se uloží jen jednou, odeslání jsou tedy nové kontakty.
--
-- Sloupce:
--   navstev            kroky 1–3: kolik návštěv krok udělalo (v libovolném pořadí; formulář jde otevřít i bez otočení
--                      lístku). „Otevření formuláře“ = rozbalení nebo panel (formular_otevren), nebo první klepnutí do
--                      formuláře v sekci Tahák, který je vidět pořád a neotvírá se (formular_zacatek).
--                      Krok 4: kolik nových kontaktů s touhle verzí úvodu přibylo.
--   navstev_postupne   kolik návštěv udělalo tenhle krok i všechny předchozí (u odeslání prázdné, viz výše)
--   pct_z_prichodu     navstev / návštěvy s příchodem
--   pct_z_predchoziho  kroky 2–3: navstev_postupne / navstev_postupne předchozího kroku;
--                      krok 4: nové kontakty / návštěvy, které otevřely formulář

create schema if not exists analytika;
revoke all on schema analytika from anon, authenticated;

-- Trychtýř od zadaného okamžiku (události podle času události, kontakty podle času souhlasu).
create or replace function analytika.trychtyr_od(p_od timestamptz)
returns table (varianta text, poradi integer, krok text, navstev bigint, navstev_postupne bigint,
               pct_z_prichodu numeric, pct_z_predchoziho numeric)
language sql stable security invoker set search_path = '' as $$
with navstevy as (
  select
    e.varianta,
    e.navsteva,
    bool_or(e.udalost = 'prichod')          as prichod,
    bool_or(e.udalost = 'otoceni_listku')   as otoceni,
    bool_or(e.udalost in ('formular_otevren', 'formular_zacatek')) as formular
  from public.events e
  where e.navsteva is not null and e.cas >= p_od
  group by e.varianta, e.navsteva
),
souhrn as (
  select
    n.varianta,
    count(*) filter (where n.prichod)                              as prichod,
    count(*) filter (where n.otoceni)                              as otoceni,
    count(*) filter (where n.formular)                             as formular,
    count(*) filter (where n.prichod and n.otoceni)                as otoceni_p,
    count(*) filter (where n.prichod and n.otoceni and n.formular) as formular_p
  from navstevy n
  group by n.varianta
),
kontakty as (
  select l.varianta, count(*) as odeslani from public.leads l where l.souhlas_cas >= p_od group by l.varianta
),
kroky as (
  select v.varianta, k.poradi, k.krok, k.navstev, k.navstev_postupne, k.predchozi, coalesce(s.prichod, 0) as prichod
  from (values ('vychozi'), ('dvojce'), ('zacatek')) as v(varianta)
  left join souhrn s on s.varianta = v.varianta
  left join kontakty c on c.varianta = v.varianta
  cross join lateral (values
    (1, 'příchod',            coalesce(s.prichod, 0),   coalesce(s.prichod, 0),    null::bigint),
    (2, 'otočení lístku',     coalesce(s.otoceni, 0),   coalesce(s.otoceni_p, 0),  coalesce(s.prichod, 0)),
    (3, 'otevření formuláře', coalesce(s.formular, 0),  coalesce(s.formular_p, 0), coalesce(s.otoceni_p, 0)),
    (4, 'odeslání',           coalesce(c.odeslani, 0),  null::bigint,              coalesce(s.formular, 0))
  ) as k(poradi, krok, navstev, navstev_postupne, predchozi)
)
select
  varianta,
  poradi,
  krok,
  navstev,
  navstev_postupne,
  round(100.0 * navstev / nullif(prichod, 0), 1),
  round(100.0 * coalesce(navstev_postupne, navstev) / nullif(predchozi, 0), 1)
from kroky
order by varianta, poradi;
$$;
revoke all on function analytika.trychtyr_od(timestamptz) from public, anon, authenticated;

-- Za celou dobu (stejné sloupce jako dřív). Starší verze pohledu se nahradí.
drop view if exists analytika.trychtyr;
create view analytika.trychtyr with (security_invoker = true) as
  select * from analytika.trychtyr_od('-infinity');

-- Kolikrát se formulář úspěšně odeslal, včetně opakovaného e-mailu (události bez ID návštěvy):
-- select varianta, count(*) as odeslani from public.events where udalost = 'odeslano' group by varianta;
-- Příchody podle reklamy (detail příchodu je utm_source:utm_campaign:utm_content):
-- select detail, count(*) from public.events where udalost = 'prichod' group by detail order by 2 desc;
