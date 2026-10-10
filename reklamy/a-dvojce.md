# Reklama A „Dvojče“

**Úhel:** VOO zná každý, kdo o ETF něco viděl na YouTube nebo TikToku. Když ho pak broker nenabízí, je to frustrace, kterou reklama pojmenuje a hned vyřeší.
**Pro koho:** 25–40 let, o ETF už ví, možná zkoušeli koupit.
**Formát:** Meta, mobil, statický obrázek 4 : 5 a 9 : 16 (viz [README](README.md)).
**Odkaz:** `?v=dvojce&utm_content=a-dvojce`

## Texty

- **Primární text:**
  > Chceš VOO, ale broker ho nenabízí? Americká ETF ti většina brokerů v Česku neprodá.
  >
  > Jejich evropská dvojčata ano. K VOO a dalším 6 ETF jsme je dohledali a ověřili u správců fondů. Najdi to svoje jedním klepnutím.

  Zdroje: `[r: PRIIPs]` (`data/README.md`), dvojčata `[d: * › ucits_obdoba]`, ověření `[d: meta.overeno_dne]`.
- **Nadpis:** Najdi evropské dvojče k VOO
- **Popis:** 7 ETF · data od správců fondů
- **Tlačítko:** Zjistit víc

## Obrázek

**Feed 4 : 5**

- Nahoře velký ticker **VOO**, pod ním šipka dolů a ještě větší **VUAA** v akcentní barvě zvoleného designu.
- Pod VUAA jeden řádek: „evropské dvojče · koupíš z Česka“.
- Dole drobně: „Stejný index S&P 500“. `[d: VOO › ucits_obdoba.rozdil_oproti_originalu]`
- Žádní lidé s telefonem, žádná loga, žádné rozhraní brokera. Na obrázku nejvýš tři krátké řádky textu.

**Stories a Reels 9 : 16**

- Stejný obsah, VOO a VUAA nad sebou, víc vzduchu.
- Text držet mimo horní a dolní okraj, kde Instagram překrývá ovládání (`[TODO]` přesné zóny podle Meta).

## Navazující úvod stránky

- **H1:** Chceš VOO a broker ho nenabízí? Má evropské dvojče.
- Pod ním hned výběr ETF, VOO je mezi prvními.
- Plné znění je v [texty.md](../texty.md), sekce 1, verze A.

## Riziko, které musíme ověřit před spuštěním

XTB má VOO.US na svém webu jako stránku ETF, ne CFD (`[d: VOO › original_u_xtb_cz]`). Pokud ho XTB prodá i retailovým klientům, je háček této reklamy pro jeho klienty nepravdivý. Tedy:

- **Ověřit v aplikaci XTB** s retailovým účtem, jestli jde VOO.US koupit.
- **Pokud ano**, vyměnit VOO za VT (u XTB jen jako CFD, `[d: VT › original_u_xtb_cz]`). Primární text pak: „Chceš VT, ale broker ho nenabízí? …“, obrázek VT → VWCE.
- **„Většina brokerů“** zatím stojí na Lynxu a XTB. Doplnit aspoň Fio, Trading 212 a Degiro.
