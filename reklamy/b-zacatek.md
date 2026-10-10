# Reklama B „Začátek“

**Úhel:** nejistota. Začátečník ví, že by měl začít investovat, ale neví, kterým ETF, a bojí se, že vybere špatně. Reklama slibuje přehled, ne doporučení.
**Pro koho:** 25–40 let, s ETF teprve začínají, konkrétní fond zatím nehledají.
**Proti reklamě A testuje jinou motivaci:** nejistotu místo zklamání z brokera.
**Formát:** Meta, mobil, statický obrázek 4 : 5 a 9 : 16 (viz [README](README.md)).
**Odkaz:** `?v=zacatek&utm_content=b-zacatek`

## Texty

- **Primární text:**
  > Nevíš, kterým ETF začít? Tady je 7 známých fondů z USA: co v nich je, kolik stojí a jejich evropské verze, které si koupíš z Česka.
  >
  > Žádné doporučování, jen přehled s daty ověřenými u správců fondů.

  Zdroje: `[d: * › typ]`, `[d: * › ter]`, `[d: * › ucits_obdoba.kde_koupit]`, `[d: meta.overeno_dne]`.
- **Nadpis:** 7 známých ETF na jednom místě
- **Popis:** Co v nich je, kolik stojí, kde koupit
- **Tlačítko:** Zjistit víc

**Dvě změny oproti původnímu znění:**

- „7 nejznámějších“ → „7 známých“: nejvyšší stupeň neumíme doložit, SDY je výrazně menší než ostatní (`[d: SDY › velikost_fondu]`).
- „které z nich si koupíš z Česka“ → „jejich evropské verze, které si koupíš z Česka“: původní znění naznačuje, že některé americké originály koupit jde. Na stránce přitom ukazujeme právě jejich evropská dvojčata.

## Obrázek

**Feed 4 : 5** (design „Tahák v sešitě“)

- Čtverečkovaný papír, nahoře modrou propiskou: „Kterým ETF začít?“
- Pod tím úhledný seznam 7 typů s tickery:
  - S&P 500 · VOO
  - celé USA · VTI
  - celý svět · VT
  - rozvíjející se trhy · VWO
  - dividendy · SDY
  - technologie · VGT
  - dluhopisy · AGG

  `[d: * › typ]`
- Žádný řádek není zakroužkovaný ani označený jako „nejlepší“, nic nedoporučujeme.
- Dole jeden řádek: „Co v nich je a kde je koupíš z Česka“.

**Stories a Reels 9 : 16:** stejný seznam, větší písmo, text mimo okraje s ovládáním (`[TODO]` přesné zóny podle Meta).

## Navazující úvod stránky

- **H1:** Nevíš, kterým ETF začít?
- **Podnadpis:** 7 známých fondů z USA, co v nich je, kolik stojí a evropské verze, které si koupíš z Česka.
- Drobně pod tím: „Nic ti nedoporučujeme, jen ukazujeme, co existuje.“
- Plné znění je v [texty.md](../texty.md), sekce 1, verze B.

## Pozor

- **Slib „kterým začít“ svádí k doporučení.** Stránka ani tahák nesmí říkat „začni tímhle“. Odpovídáme přehledem, ne radou. Na tohle by se měl podívat i právník spolu s ostatními texty.
- **Lidé z reklamy B tickery neznají.** Proto mají tlačítka výběru u tickeru i popis („VOO · S&P 500“).
