# Reklama B „Poplatky“

**Úhel:** Lidé, kteří ETF ještě neřeší, často nevědí, kolik platí za fond, do kterého spoří. Reklama jim ukáže konkrétní, ověřené číslo a pozve je k porovnání.
**Pro koho:** 25–40 let, ETF zatím neřeší.
**Formát:** Meta, mobil, statický obrázek 4 : 5 a 9 : 16 (viz [README](README.md)).
**Odkaz:** `?v=poplatky&utm_content=b-poplatky`

## Verze B1: jen ověřená data (doporučuju)

- **Primární text:**
  > Kolik platíš za svůj fond? Evropský fond na americké akcie si bere 3 Kč ročně z každých 10 000 Kč.
  >
  > Podívej se na 7 ETF, která koupíš z Česka, a jejich poplatky vedle sebe. Zdarma, bez registrace.

  Zdroje a výpočet:
  - SXR4 `[d: VTI › ucits_obdoba.ter = 0,03]`, `[výpočet: 0,03 × 100 = 3 Kč]`
  - koupíš z Česka: `[d: * › ucits_obdoba.kde_koupit.xtb_cz]`
  - „bez registrace“: srovnání na stránce je bez e-mailu, e-mail chceme jen za tahák
- **Nadpis:** Fond za 3 Kč ročně z 10 000 Kč
- **Popis:** 7 ETF · poplatky vedle sebe
- **Tlačítko:** Zjistit víc

### Obrázek

**Feed 4 : 5**

- Přes půl plochy obří číslo **3 Kč**.
- Pod ním: „ročně z každých 10 000 Kč“.
- Dole drobně: „Roční poplatek fondu SXR4 (TER 0,03 %). Poplatky brokera zvlášť.“
- Nic dalšího.

**Stories a Reels 9 : 16:** stejný obsah, číslo uprostřed výšky, text mimo okraje s ovládáním.

## Verze B2: tvůj úhel „kolik tě to stojí za 20 let“

Tohle číslo z dat samo nevyjde. Potřebuje tři rozhodnutí:

1. **Kolik měsíčně** (předpoklad, např. 2 000 Kč).
2. **Zhodnocení.** Jakýkoli výnos je odhad. Nejbezpečnější je počítat s 0 % a napsat to. Jinak jde o simulaci budoucí výkonnosti, kterou by měl posoudit právník.
3. **S čím srovnáváme.** Aby číslo bolelo, potřebuje srovnání s dražším fondem. Jeho poplatek musí mít zdroj, např. průběžné náklady z KID konkrétního fondu. `[TODO]` Z hlavy nedoplňovat.

**Ilustrace z ověřených dat**

Předpoklady: 2 000 Kč měsíčně po 20 let (celkem vloženo 480 000 Kč), 0 % zhodnocení, poplatek strhávaný měsíčně z aktuálního zůstatku. Spočítáno skriptem.

| Poplatek fondu (TER) | Fond | Zaplaceno na poplatcích za 20 let |
|---|---|---|
| 0,03 % | SXR4 | 1 443 Kč |
| 0,07 % | VUAA | 3 358 Kč |
| 0,14 % | VWCE | 6 686 Kč |
| 0,35 % | SPYD | 16 485 Kč |
| `[TODO]` | srovnávací fond se zdrojem | `[TODO]` |

Bez srovnání jsou čísla malá a „za 20 let“ nezabere. Proto doporučuju B1, dokud nemáme zdroj pro srovnávací fond.

## Navazující úvod stránky

- **H1:** Fond na americké akcie za 3 Kč ročně z každých 10 000 Kč
- **Podnadpis:** vysvětlí, že jde o SXR4, dvojče VTI, a pozve k porovnání ostatních.
- Plné znění je v [texty.md](../texty.md), sekce 1, verze B.

**Pozor na návaznost:** lidé z reklamy B tickery jako VOO neznají. Proto mají tlačítka výběru u tickeru i popis („VOO · S&P 500“) a podnadpis verze B vysvětluje, co dvojčata jsou.
