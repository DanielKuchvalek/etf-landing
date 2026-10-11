-- Trychtýř po krocích zvlášť pro každou verzi úvodu (?v=): příchod → otočení lístku → otevření formuláře → odeslání.
-- Spusť v Supabase: SQL Editor → vlož celý soubor → Run. Pak kdykoli: select * from analytika.trychtyr;
--
-- Pohled je ve vlastním schématu „analytika“, které Supabase API nevystavuje, a běží s právy toho, kdo
-- se ptá (security_invoker). Přes publishable klíč ho tedy nikdo nepřečte.
--
-- Sloupce:
--   navstev            kolik návštěv krok udělalo (v libovolném pořadí; formulář jde otevřít i bez otočení lístku)
--                      „otevření formuláře“ = rozbalení nebo panel (formular_otevren), nebo první klepnutí do
--                      formuláře v sekci Tahák, který je vidět pořád a neotvírá se (formular_zacatek)
--   navstev_postupne   kolik návštěv udělalo tenhle krok i všechny předchozí
--   pct_z_prichodu     navstev / návštěvy s příchodem
--   pct_z_predchoziho  navstev_postupne / navstev_postupne předchozího kroku

create schema if not exists analytika;
revoke all on schema analytika from anon, authenticated;

create or replace view analytika.trychtyr with (security_invoker = true) as
with navstevy as (
  select
    varianta,
    navsteva,
    bool_or(udalost = 'prichod')          as prichod,
    bool_or(udalost = 'otoceni_listku')   as otoceni,
    bool_or(udalost in ('formular_otevren', 'formular_zacatek')) as formular,
    bool_or(udalost = 'odeslano')         as odeslani
  from public.events
  group by varianta, navsteva
),
souhrn as (
  select
    varianta,
    count(*) filter (where prichod)                                    as prichod,
    count(*) filter (where otoceni)                                    as otoceni,
    count(*) filter (where formular)                                   as formular,
    count(*) filter (where odeslani)                                   as odeslani,
    count(*) filter (where prichod and otoceni)                        as otoceni_p,
    count(*) filter (where prichod and otoceni and formular)           as formular_p,
    count(*) filter (where prichod and otoceni and formular and odeslani) as odeslani_p
  from navstevy
  group by varianta
),
kroky as (
  select s.varianta, k.poradi, k.krok, k.navstev, k.navstev_postupne, s.prichod
  from souhrn s
  cross join lateral (values
    (1, 'příchod',            s.prichod,  s.prichod),
    (2, 'otočení lístku',     s.otoceni,  s.otoceni_p),
    (3, 'otevření formuláře', s.formular, s.formular_p),
    (4, 'odeslání',           s.odeslani, s.odeslani_p)
  ) as k(poradi, krok, navstev, navstev_postupne)
)
select
  varianta,
  poradi,
  krok,
  navstev,
  navstev_postupne,
  round(100.0 * navstev / nullif(prichod, 0), 1) as pct_z_prichodu,
  round(100.0 * navstev_postupne
        / nullif(lag(navstev_postupne) over (partition by varianta order by poradi), 0), 1) as pct_z_predchoziho
from kroky
order by varianta, poradi;

-- Kontrola proti tabulce kontaktů (opakovaný e-mail se uloží jen jednou, proto může být kontaktů méně než odeslání):
-- select varianta, count(*) as kontaktu from public.leads group by varianta order by varianta;
