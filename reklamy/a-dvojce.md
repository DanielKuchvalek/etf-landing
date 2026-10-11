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

Hotové obrázky: [a-dvojce-feed.png](a-dvojce-feed.png) (1080 × 1350) a [a-dvojce-stories.png](a-dvojce-stories.png) (1080 × 1920), generuje je [scripts/reklamy.mjs](../scripts/reklamy.mjs) z HTML ve stylu stránky. Ticker dvojčete a „Stejný index S&P 500“ bere z `data/etf.json`. Navíc je nahoře malý název „ETF dvojčata“, stejný jako na stránce, aby návštěvník poznal, kam přišel.

**Feed 4 : 5**

- **Hook nahoře:** otázka z primárního textu „Broker ti nenabídl VOO?“ a pod ní menší „Není to chyba.“ se žlutým fixem. Je to nejvýraznější text po VUAA. Bez něj by nebylo jasné, proč je VOO přeškrtnuté.
- Pod tím **VOO** přeškrtnuté jako na stránce, šipka dolů a největší **VUAA** v kroužku a se žlutým fixem na lístku s páskou.
- Na lístku: „evropské dvojče · v nabídce brokerů v Česku“ (dřív „koupíš z Česka“; ověřený máme jen veřejný seznam produktů brokera), pod ním drobně „Stejný index S&P 500“. `[d: VOO › ucits_obdoba.rozdil_oproti_originalu]`
- **Nabídka dole** (lístek s páskou, „Tahák zdarma“ se žlutým fixem): „Tahák zdarma: ISINy a postup nákupu →“. Slibuje jen to, co PDF přidává navíc ke stránce (dvojčata stránka ukáže zdarma), stejně jako výzva na stránce („Chci tahák s postupem nákupu“, „PDF hned a zdarma“).
- **Pod ní nenápadně:** „Není investiční doporučení.“
- Žádní lidé s telefonem, žádná loga, žádné rozhraní brokera. Původně „nejvýš tři řádky textu“; hook a nabídka přibyly, protože bez nich byla reklama moc strohá (zpětná vazba 11. 10. 2026).

**Stories a Reels 9 : 16**

- Stejný obsah, větší písmo a rozložený do celé bezpečné výšky: hook nahoře, VOO → VUAA uprostřed, nabídka dole nad zónou ovládání.
- Text je mimo horních 270 px, dolních 450 px a 65 px po stranách (ovládání Instagramu a Facebooku; skript to kontroluje). Oficiální zóny Meta jsem neověřil, jen z návodů třetích stran, které se rozcházejí (dole 250–670 px), proto před spuštěním zkontrolovat v náhledu Ads Manageru.

## Navazující úvod stránky

- **H1:** Broker ti nenabídl VOO? Není to chyba.
- Pod ním hned výběr ETF, VOO je mezi prvními.
- Plné znění je v [texty.md](../texty.md), sekce 1, verze A.

## Proč háček nic absolutního netvrdí

Premisa je ověřená: v aplikaci XTB (český účet, 12. 10. 2026) hledání „VOO.US“ nic nenajde a „VOO“ najde jen jiný fond (VOOL.DE), viz [snímky](../docs/screenshots/xtb-voo-us.png) a [druhý](../docs/screenshots/xtb-voo.png) (`[d: VOO › original_u_xtb_cz]`). Veřejná stránka xtb.com/cz/etf/voo-us je generovaná automaticky a nákup nedokládá. Přesto netvrdíme, že VOO koupit nejde: ČNB připouští execution-only bez KID a profesionální klient ho koupit může. Říkáme jen, že ho broker často nenabídne.
