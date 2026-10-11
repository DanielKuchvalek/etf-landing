-- Trychtýř po krocích zvlášť pro každou verzi úvodu (?v=): příchod → otočení lístku → otevření formuláře → odeslání.
-- Spusť v Supabase: SQL Editor → vlož celý soubor → Run. Pak kdykoli: select * from analytika.trychtyr;
--
-- Pohled je ve vlastním schématu „analytika“, které Supabase API nevystavuje, a běží s právy toho, kdo
-- se ptá (security_invoker). Přes publishable klíč ho tedy nikdo nepřečte.
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

create or replace view analytika.trychtyr with (security_invoker = true) as
with navstevy as (
  select
    varianta,
    navsteva,
    bool_or(udalost = 'prichod')          as prichod,
    bool_or(udalost = 'otoceni_listku')   as otoceni,
    bool_or(udalost in ('formular_otevren', 'formular_zacatek')) as formular
  from public.events
  where navsteva is not null
  group by varianta, navsteva
),
souhrn as (
  select
    varianta,
    count(*) filter (where prichod)                          as prichod,
    count(*) filter (where otoceni)                          as otoceni,
    count(*) filter (where formular)                         as formular,
    count(*) filter (where prichod and otoceni)              as otoceni_p,
    count(*) filter (where prichod and otoceni and formular) as formular_p
  from navstevy
  group by varianta
),
kontakty as (
  select varianta, count(*) as odeslani from public.leads group by varianta
),
kroky as (
  select v.varianta, k.poradi, k.krok, k.navstev, k.navstev_postupne, k.predchozi, coalesce(s.prichod, 0) as prichod
  from (values ('vychozi'), ('dvojce'), ('zacatek')) as v(varianta)
  left join souhrn s using (varianta)
  left join kontakty c using (varianta)
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
  round(100.0 * navstev / nullif(prichod, 0), 1) as pct_z_prichodu,
  round(100.0 * coalesce(navstev_postupne, navstev) / nullif(predchozi, 0), 1) as pct_z_predchoziho
from kroky
order by varianta, poradi;

-- Kolikrát se formulář úspěšně odeslal, včetně opakovaného e-mailu (události bez ID návštěvy):
-- select varianta, count(*) as odeslani from public.events where udalost = 'odeslano' group by varianta;
