# Reklama B „Začátek“

**Úhel:** nejistota. Začátečník ví, že by měl začít investovat, ale nezná fondy a bojí se, že vybere špatně. Reklama slibuje přehled známých fondů a jejich evropských verzí, ne doporučení.
**Pro koho:** 25–40 let, s ETF teprve začínají, konkrétní fond zatím nehledají.
**Proti reklamě A testuje jinou motivaci:** nejistotu místo zklamání z brokera.
**Formát:** Meta, mobil, statický obrázek 4 : 5 a 9 : 16 (viz [README](README.md)).
**Odkaz:** `?v=zacatek&utm_content=b-zacatek`

## Texty

- **Primární text:**
  > Začínáš s ETF? Tady je 7 známých fondů z USA: co v nich je, kolik stojí a jejich evropské verze, které najdeš v nabídce brokerů v Česku.
  >
  > Žádné doporučování, jen přehled s daty ověřenými u správců fondů. Tahák s ISINy a postupem nákupu krok za krokem je zdarma.

  Zdroje: `[d: * › typ]`, `[d: * › ter]`, `[d: * › ucits_obdoba.kde_koupit]`, `[d: meta.overeno_dne]`.
- **Nadpis:** 7 známých ETF a jejich evropské verze
- **Popis:** Co v nich je a u kterých brokerů je najdeš
- **Tlačítko:** Zjistit víc

**Změny oproti dřívějším zněním:**

- „7 nejznámějších“ → „7 známých“: nejvyšší stupeň neumíme doložit, SDY je výrazně menší než ostatní (`[d: SDY › velikost_fondu]`).
- „Nevíš, kterým ETF začít?“ s dvojčaty schovanými za „→ ?“ → „Začínáš s ETF?“ s dvojčaty přímo v seznamu (11. 10. 2026, po nezávislé kontrole): stránka dvojčata ukáže zdarma, takže reklama, která je schovávala, slibovala něco jiného, než stránka dá. Otázka „kterým začít“ navíc sváděla k doporučení.
- „které si koupíš z Česka“ → „které najdeš v nabídce brokerů v Česku“: ověřený máme jen veřejný seznam produktů brokera, ne nákup v konkrétním účtu.

## Obrázek

Hotové obrázky: [b-zacatek-feed.png](b-zacatek-feed.png) (1080 × 1350) a [b-zacatek-stories.png](b-zacatek-stories.png) (1080 × 1920), generuje je [scripts/reklamy.mjs](../scripts/reklamy.mjs) z HTML ve stylu stránky. Seznam typů a tickerů bere ze stejných lístků jako stránka, dvojčata z `data/etf.json`.

**Feed 4 : 5** (design „Tahák v sešitě“)

- Nahoře „Začínáš s ETF?“ (žlutý fix na „ETF“) a pod tím „7 známých fondů z USA a jejich evropské verze“.
- Lístek se seznamem 7 typů, originál → evropská verze (`[d: * › typ]`, `[d: * › ucits_obdoba.burza]`):
  - S&P 500 · VOO → VUAA
  - celé USA · VTI → SXR4
  - celý svět · VT → VWCE
  - rozvíjející se trhy · VWO → VFEA
  - dividendy · SDY → SPYD
  - technologie · VGT → QDVE
  - dluhopisy · AGG → IUAA
- Žádný řádek není zakroužkovaný ani označený jako „nejlepší“, nic nedoporučujeme.
- Pod seznamem: „Co v nich je a u kterých brokerů je najdeš“.
- **Nabídka dole** (lístek s páskou, „Tahák zdarma“ se žlutým fixem): „Tahák zdarma: ISINy a postup nákupu →“. Slibuje jen to, co PDF přidává ke stránce.
- **Pod ní nenápadně:** „Není investiční doporučení.“

**Stories a Reels 9 : 16:** stejný obsah, rozložený do celé bezpečné výšky (nabídka dole nad zónou ovládání), text je mimo horních 270 px, dolních 450 px a 65 px po stranách (ovládání Instagramu a Facebooku; skript to kontroluje). Oficiální zóny Meta jsem neověřil, jen z návodů třetích stran, které se rozcházejí (dole 250–670 px), proto před spuštěním zkontrolovat v náhledu Ads Manageru.

## Navazující úvod stránky

- **H1:** Začínáš s ETF? (fix na „ETF“)
- **Podnadpis:** 7 známých fondů z USA a jejich evropské verze. Klepni na lístek a uvidíš dvojče.
- Drobně pod tím: „Nic ti nedoporučujeme, jen ukazujeme, co existuje.“
- Pod tím u všech verzí: „Tahák zdarma v PDF: ISINy a postup nákupu krok za krokem.“
- Plné znění je v [texty.md](../texty.md), sekce 1, verze B.

## Pozor

- **Stránka ani tahák nesmí říkat „začni tímhle“.** Odpovídáme přehledem, ne radou. Na texty by se měl podívat i právník.
- **Lidé z reklamy B tickery neznají.** Proto mají tlačítka výběru u tickeru i popis („VOO · S&P 500“).
