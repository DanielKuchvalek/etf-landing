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

Hotové obrázky: [b-zacatek-feed.png](b-zacatek-feed.png) (1080 × 1350) a [b-zacatek-stories.png](b-zacatek-stories.png) (1080 × 1920), generuje je [scripts/reklamy.mjs](../scripts/reklamy.mjs) z HTML ve stylu stránky. Seznam typů a tickerů bere ze stejných lístků jako stránka.

**Feed 4 : 5** (design „Tahák v sešitě“)

- Čtverečkovaný papír, nahoře „Kterým ETF začít?“ jako nadpis stránky se žlutým fixem na „začít“. Původně „modrou propiskou“; modrá ze vzhledu stránky vypadla (`design.md`), tak ani reklama ji nemá.
- Pod tím úhledný seznam 7 typů s tickery:
  - S&P 500 · VOO
  - celé USA · VTI
  - celý svět · VT
  - rozvíjející se trhy · VWO
  - dividendy · SDY
  - technologie · VGT
  - dluhopisy · AGG

  `[d: * › typ]`
- U každého tickeru „→ ?“ (otazník se žlutým fixem): dvojčata reklama záměrně neukazuje, odpověď je v taháku a na stránce.
- Žádný řádek není zakroužkovaný ani označený jako „nejlepší“, nic nedoporučujeme.
- Pod seznamem: „Co v nich je a kde je koupíš z Česka“.
- **Nabídka dole** (lístek s páskou, „Tahák zdarma“ se žlutým fixem): „Tahák zdarma: ISINy a postup nákupu →“. Slibuje jen to, co PDF přidává navíc ke stránce (dvojčata stránka ukáže zdarma), stejně jako výzva na stránce („Chci tahák s postupem nákupu“, „PDF hned a zdarma“).
- **Pod ní nenápadně:** „Není investiční doporučení.“

**Stories a Reels 9 : 16:** stejný obsah, větší písmo, rozložený do celé bezpečné výšky (nabídka dole nad zónou ovládání), text je mimo horních 270 px, dolních 450 px a 65 px po stranách (ovládání Instagramu a Facebooku; skript to kontroluje). Oficiální zóny Meta jsem neověřil, jen z návodů třetích stran, které se rozcházejí (dole 250–670 px), proto před spuštěním zkontrolovat v náhledu Ads Manageru.

## Navazující úvod stránky

- **H1:** Nevíš, kterým ETF začít?
- **Podnadpis:** 7 známých fondů z USA, co v nich je, kolik stojí a evropské verze, které si koupíš z Česka.
- Drobně pod tím: „Nic ti nedoporučujeme, jen ukazujeme, co existuje.“
- Plné znění je v [texty.md](../texty.md), sekce 1, verze B.

## Pozor

- **Slib „kterým začít“ svádí k doporučení.** Stránka ani tahák nesmí říkat „začni tímhle“. Odpovídáme přehledem, ne radou. Na tohle by se měl podívat i právník spolu s ostatními texty.
- **Lidé z reklamy B tickery neznají.** Proto mají tlačítka výběru u tickeru i popis („VOO · S&P 500“).
