# Reklama A „Dvojče“

**Úhel:** VOO zná každý, kdo o ETF něco viděl na YouTube nebo TikToku. Když ho pak broker nenabízí, je to frustrace, kterou reklama pojmenuje a hned vyřeší.
**Pro koho:** 25–40 let, o ETF už ví, možná zkoušeli koupit.
**Formát:** Meta, mobil, statický obrázek 4 : 5 a 9 : 16 (viz [README](README.md)).
**Odkaz:** `?v=dvojce&utm_content=a-dvojce`

## Texty

- **Primární text:**
  > Broker ti nenabídl VOO? Není to chyba. Americká ETF ti broker v Česku často nenabídne, evropská dvojčata ano.
  >
  > K VOO a dalším 6 ETF jsme je dohledali a ověřili u správců fondů. Najdi to svoje jedním klepnutím.

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

- **H1:** Broker ti nenabídl VOO? Není to chyba.
- Pod ním hned výběr ETF, VOO je mezi prvními.
- Plné znění je v [texty.md](../texty.md), sekce 1, verze A.

## Proč háček nic absolutního netvrdí

XTB má VOO.US na webu jako stránku ETF, ne CFD (`[d: VOO › original_u_xtb_cz]`), a ČNB připouští execution-only bez KID. Proto netvrdíme, že VOO koupit nejde. Říkáme jen, že ho broker často nenabídne, a to platí i v případě, že ho XTB prodává.
