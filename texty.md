# Texty stránky

Všechny texty landing page v pořadí sekcí. Tykáme, bez rodu (žádné „hledal jsi“, „sám“). Při implementaci doplň českou typografii: nezlomitelné mezery za jednopísmennými předložkami, mezi číslem a jednotkou (`3 Kč`, `0,07 %`) a v tisících (`10 000`).

## Jak číst odkazy na zdroje

| Značka | Význam |
|---|---|
| `[d: VOO › ucits_obdoba.ter]` | `data/etf.json`, položka s tickerem VOO, pole `ucits_obdoba.ter` → `hodnota` |
| `[d: * › …]` | totéž pole u všech 7 položek |
| `[d: meta.overeno_dne]` | datum ověření dat (2026-10-10) |
| `[r: PRIIPs]` | tvrzení doložené v `data/README.md`, sekce „Proč ke každému ETF hledáme UCITS obdobu“ |
| `[výpočet: …]` | odvozeno z dat, vzorec je uvedený |
| `[TODO …]` | chybí podklad, nedoplňovat z hlavy |
| `[ROZHODNOUT …]` | potřebuju tvoje rozhodnutí |

Částka „Kč z každých 10 000 Kč“ je vždy `[výpočet: TER v % × 100]`, např. 0,07 % → 7 Kč. Je to jen roční poplatek fondu, bez poplatků brokera a směny měn.

---

## 0. Titulek a náhled pro sdílení

- **`<title>`:** Evropská dvojčata amerických ETF | ETF dvojčata
- **Meta description a OG popis:** VOO, VT a dalších 5 ETF z USA ti broker v Česku často nenabídne. Najdi jejich evropská dvojčata, která koupíš.
  `[r: PRIIPs]` `[d: * › ucits_obdoba.kde_koupit.xtb_cz]`
- **Obrázek pro sdílení (og:image, 1200×630, `public/og.png`, generuje `scripts/obrazky.mjs`):**
  - vlevo: logo, nadpis „Najdi evropské dvojče k VOO, VT a dalším ETF z USA“ (fix na „dvojče“), podnadpis „Americká ti broker často nenabídne, evropská ano.“
  - vpravo: přeškrtnuté VOO → lístek s dvojčetem VUAA v kroužku, „✓ koupíš u XTB, Trading 212“, „7 Kč ročně z 10 000 Kč“, „VOO: 3 Kč“, pod ním „Data od správců fondů, ověřeno 10. 10. 2026“. Čísla a brokery skript bere z `data/etf.json`. `[d: VOO › ucits_obdoba.ter]` `[d: VOO › ter]` `[d: VOO › ucits_obdoba.kde_koupit]`
  - alt: ETF dvojčata: k americkému VOO jeho evropské dvojče VUAA, u kterých brokerů ho koupíš a kolik stojí.

---

## 1. Úvod a „Najdi dvojče“

Nadpis a podnadpis se mění podle parametru v URL (viz `reklamy/README.md`). Zbytek stránky je pro všechny stejný.

### Výchozí verze (bez parametru, organická návštěva)

- **H1:** Najdi evropské dvojče k VOO, VT a dalším ETF z USA
- **Podnadpis (jedna věta):** Americká ti broker často nenabídne, evropská ano.
- **Fixem přetažené slovo v H1:** dvojče
  `[r: PRIIPs]` `[d: * › ucits_obdoba.kde_koupit]`

### Verze A „Dvojče“ (`?v=dvojce`)

- **H1:** Broker ti nenabídl VOO? Není to chyba.
- **Podnadpis (jedna věta):** Tady je jeho evropské dvojče a 6 dalších.
- **Fixem přetažené v H1:** Není to chyba.
  `[r: PRIIPs]` `[d: * › ucits_obdoba.kde_koupit]`
- Háček platí, i kdyby VOO některý broker prodával: netvrdíme, že VOO koupit nejde.

### Verze B „Začátek“ (`?v=zacatek`)

- **H1:** Nevíš, kterým ETF začít?
- **Podnadpis (jedna věta):** 7 známých fondů z USA a co v nich je.
- **Fixem přetažené v H1:** začít
  `[d: * › typ]` `[d: * › ter]` `[d: * › ucits_obdoba.kde_koupit]`
- **Drobně pod podnadpisem:** Nic ti nedoporučujeme, jen ukazujeme, co existuje.
- „7 známých“ místo „7 nejznámějších“: nejvyšší stupeň neumíme doložit (SDY je výrazně menší než ostatní, `[d: SDY › velikost_fondu]`).

### Výběr ETF: lístky z taháku (pro všechny verze)

- **Popisek:** Které ETF tě zajímá?
- **Nápověda vedle popisku:** Klepni a lístek otoč.
- **Lístky (7).** Klepnutí lístek otočí, otočený je vždy jen jeden a druhé klepnutí ho vrátí. Bez JS jsou lístky odkazy na karty párů.

| Přední strana | Zadní strana: štítek | Dvojče (v kroužku) | Kde koupit | Poplatek |
|---|---|---|---|---|
| VOO · S&P 500 | dvojče · stejný index | VUAA | ✓ XTB, Trading 212 | 7 Kč ročně z 10 000 Kč |
| VTI · celé USA | obdoba · podobný index | SXR4 | ✓ XTB, Trading 212, Degiro | 3 Kč ročně z 10 000 Kč |
| VT · celý svět | dvojče · podobný index | VWCE | ✓ XTB, Trading 212, Degiro | 14 Kč ročně z 10 000 Kč |
| VWO · rozvíjející se trhy | dvojče · podobný index | VFEA | ✓ XTB, Trading 212 | 17 Kč ročně z 10 000 Kč |
| SDY · dividendy | dvojče · stejný index | SPYD | ✓ XTB, Trading 212 | 35 Kč ročně z 10 000 Kč |
| VGT · technologie | dvojče · podobný index | QDVE | ✓ XTB, Trading 212, Degiro | 15 Kč ročně z 10 000 Kč |
| AGG · dluhopisy | dvojče · stejný index | IUAA | ✓ XTB, Trading 212 | 25 Kč ročně z 10 000 Kč |

  `[d: * › typ]` `[d: * › ucits_obdoba.rozdil_oproti_originalu]` `[d: * › ucits_obdoba.burza.ticker]` `[d: * › ucits_obdoba.kde_koupit]` `[výpočet: TER × 100 = Kč z 10 000 Kč, d: * › ucits_obdoba.ter]`
- **Po prvním otočení se pod lístky objeví výzva:**
  - tlačítko: Chci tahák se všemi 7 dvojčaty. Formulář se rozbalí na místě.
  - pod ním: ISINy, poplatky a postup nákupu krok za krokem. PDF hned a zdarma.
- **Pod výběrem:** Data přímo od správců fondů, ověřeno 10. 10. 2026
  `[d: meta.overeno_dne]`

---

## 2. Výsledek a výzva k taháku

Podrobnosti k otočenému lístku se objeví pod lístky a výzvou, bez přechodu na jinou stránku a bez posunu stránky.

### Šablona podrobností

1. **Nadpis:** Evropské dvojče {originál} je {ticker dvojčete} (u VTI „Nejbližší evropská obdoba“)
2. **Přeškrtnutý originál → dvojče v kroužku** (ručně kreslená šipka a kroužek)
3. **Celý název dvojčete** `[d: X › ucits_obdoba.nazev]`
4. **Kde koupit:** zeleně „✓ Ověřili jsme ho u …“, pak „Hledej ticker …“
5. **Poplatek:** tučně „N Kč ročně z každých 10 000 Kč“, za tím TER v % a originál
6. **Index:** odznak „Stejný index“, nebo „Podobný, ne stejný“, a rozdíl
7. **Dividendy** (u AGG Výnosy)

U „Kde koupit“ jmenujeme všechny brokery, u kterých jsme dostupnost ověřili na jejich webu (`[d: X › ucits_obdoba.kde_koupit]`). Poplatek nikde nezvýrazňujeme žlutě.

### VOO → VUAA

- **Evropské dvojče VOO je VUAA**
- Vanguard S&P 500 UCITS ETF (USD) Accumulating `[d: VOO › ucits_obdoba.nazev]`
- Stejný index: S&P 500. `[d: VOO › index]` `[d: VOO › ucits_obdoba.index]` `[d: VOO › ucits_obdoba.rozdil_oproti_originalu]`
- Poplatek **7 Kč ročně z každých 10 000 Kč** (0,07 %). VOO má 0,03 % (3 Kč). `[d: VOO › ucits_obdoba.ter]` `[d: VOO › ter]`
- Dividendy nevyplácí, investuje je zpátky do fondu. VOO je vyplácí čtvrtletně. `[d: VOO › ucits_obdoba.dividendova_politika]` `[d: VOO › dividendova_politika]`
- ✓ Ověřili jsme ho u XTB a Trading 212. Hledej ticker VUAA, v eurech. `[d: VOO › ucits_obdoba.burza]` `[d: VOO › ucits_obdoba.kde_koupit.xtb_cz]` `[d: VOO › ucits_obdoba.kde_koupit.trading212]`

### VTI → SXR4

- **Nejbližší evropská obdoba VTI je SXR4**
  (Ne „dvojče“: přesnou obdobu celého amerického trhu jsme nenašli.)
- iShares MSCI USA UCITS ETF (Acc) `[d: VTI › ucits_obdoba.nazev]`
- Podobný, ne stejný index. SXR4 sleduje MSCI USA a drží 515 titulů, VTI celý americký trh s 3 507 akciemi. Přesné dvojče celého trhu jsme mezi evropskými fondy nenašli. `[d: VTI › ucits_obdoba.index]` `[d: VTI › ucits_obdoba.pocet_titulu]` `[d: VTI › index]` `[d: VTI › pocet_titulu]` `[d: VTI › ucits_obdoba.rozdil_oproti_originalu]`
- Poplatek **3 Kč ročně z každých 10 000 Kč** (0,03 %). Stejně jako u VTI. `[d: VTI › ucits_obdoba.ter]` `[d: VTI › ter]`
- Dividendy nevyplácí, investuje je zpátky do fondu. VTI je vyplácí čtvrtletně. `[d: VTI › ucits_obdoba.dividendova_politika]` `[d: VTI › dividendova_politika]`
- ✓ Ověřili jsme ho u XTB, Trading 212 a Degira. Hledej ticker SXR4, v eurech. `[d: VTI › ucits_obdoba.burza]` `[d: VTI › ucits_obdoba.kde_koupit.xtb_cz]` `[d: VTI › ucits_obdoba.kde_koupit.trading212]` `[d: VTI › ucits_obdoba.kde_koupit.degiro]`

### VT → VWCE

- **Evropské dvojče VT je VWCE**
- Vanguard FTSE All-World UCITS ETF (USD) Accumulating `[d: VT › ucits_obdoba.nazev]`
- Podobný, ne stejný index. VWCE sleduje FTSE All-World, tedy velké a střední firmy z celého světa (3 784 akcií). VT sleduje širší FTSE Global All Cap (10 088 akcií). `[d: VT › ucits_obdoba.index]` `[d: VT › ucits_obdoba.pocet_titulu]` `[d: VT › index]` `[d: VT › pocet_titulu]` `[d: VT › ucits_obdoba.rozdil_oproti_originalu]` (popis „velké a střední firmy“ je z cíle fondu na stránce Vanguardu)
- Poplatek **14 Kč ročně z každých 10 000 Kč** (0,14 %). VT má 0,06 % (6 Kč). `[d: VT › ucits_obdoba.ter]` `[d: VT › ter]`
- Dividendy nevyplácí, investuje je zpátky do fondu. VT je vyplácí čtvrtletně. `[d: VT › ucits_obdoba.dividendova_politika]` `[d: VT › dividendova_politika]`
- ✓ Ověřili jsme ho u XTB, Trading 212 a Degira. Hledej ticker VWCE, v eurech. `[d: VT › ucits_obdoba.burza]` `[d: VT › ucits_obdoba.kde_koupit.xtb_cz]` `[d: VT › ucits_obdoba.kde_koupit.trading212]` `[d: VT › ucits_obdoba.kde_koupit.degiro]`

### VWO → VFEA

- **Evropské dvojče VWO je VFEA**
- Vanguard FTSE Emerging Markets UCITS ETF (USD) Accumulating `[d: VWO › ucits_obdoba.nazev]`
- Podobný, ne stejný index. VFEA sleduje FTSE Emerging, tedy velké a střední firmy z rozvíjejících se trhů (2 306 akcií). VWO sleduje širší index (6 348 akcií). `[d: VWO › ucits_obdoba.index]` `[d: VWO › ucits_obdoba.pocet_titulu]` `[d: VWO › pocet_titulu]` `[d: VWO › ucits_obdoba.rozdil_oproti_originalu]`
- Poplatek **17 Kč ročně z každých 10 000 Kč** (0,17 %). VWO má 0,06 % (6 Kč). `[d: VWO › ucits_obdoba.ter]` `[d: VWO › ter]`
- Dividendy nevyplácí, investuje je zpátky do fondu. VWO je vyplácí čtvrtletně. `[d: VWO › ucits_obdoba.dividendova_politika]` `[d: VWO › dividendova_politika]`
- ✓ Ověřili jsme ho u XTB a Trading 212. Hledej ticker VFEA, v eurech. `[d: VWO › ucits_obdoba.burza]` `[d: VWO › ucits_obdoba.kde_koupit.xtb_cz]` `[d: VWO › ucits_obdoba.kde_koupit.trading212]`

### SDY → SPYD

- **Evropské dvojče SDY je SPYD**
- State Street SPDR S&P U.S. Dividend Aristocrats UCITS ETF (Dist) `[d: SDY › ucits_obdoba.nazev]` (bez značek ®)
- Stejný index: S&P High Yield Dividend Aristocrats, tedy firmy, které dlouhodobě zvyšují dividendu. `[d: SDY › index]` `[d: SDY › ucits_obdoba.index]` `[d: SDY › typ]` (popis indexu je ze stránky SDY u State Street)
- Poplatek **35 Kč ročně z každých 10 000 Kč** (0,35 %). Stejně jako u SDY. `[d: SDY › ucits_obdoba.ter]` `[d: SDY › ter]`
- Dividendy vyplácí čtvrtletně, stejně jako SDY. `[d: SDY › ucits_obdoba.dividendova_politika]` `[d: SDY › dividendova_politika]`
- ✓ Ověřili jsme ho u XTB a Trading 212. Hledej ticker SPYD, v eurech. `[d: SDY › ucits_obdoba.burza]` `[d: SDY › ucits_obdoba.kde_koupit.xtb_cz]` `[d: SDY › ucits_obdoba.kde_koupit.trading212]`

### VGT → QDVE

- **Evropské dvojče VGT je QDVE**
- iShares S&P 500 Information Technology Sector UCITS ETF (Acc) `[d: VGT › ucits_obdoba.nazev]`
- Podobný, ne stejný index. QDVE drží jen technologické firmy z indexu S&P 500 (75 titulů), VGT širší výběr (318 akcií). `[d: VGT › ucits_obdoba.index]` `[d: VGT › ucits_obdoba.pocet_titulu]` `[d: VGT › pocet_titulu]` `[d: VGT › ucits_obdoba.rozdil_oproti_originalu]`
- Poplatek **15 Kč ročně z každých 10 000 Kč** (0,15 %). VGT má 0,09 % (9 Kč). `[d: VGT › ucits_obdoba.ter]` `[d: VGT › ter]`
- Dividendy nevyplácí, investuje je zpátky do fondu. VGT je vyplácí čtvrtletně. `[d: VGT › ucits_obdoba.dividendova_politika]` `[d: VGT › dividendova_politika]`
- ✓ Ověřili jsme ho u XTB, Trading 212 a Degira. Hledej ticker QDVE, v eurech. `[d: VGT › ucits_obdoba.burza]` `[d: VGT › ucits_obdoba.kde_koupit.xtb_cz]` `[d: VGT › ucits_obdoba.kde_koupit.trading212]` `[d: VGT › ucits_obdoba.kde_koupit.degiro]`

### AGG → IUAA

- **Evropské dvojče AGG je IUAA**
- iShares US Aggregate Bond UCITS ETF (Acc) `[d: AGG › ucits_obdoba.nazev]`
- Stejný index: Bloomberg US Aggregate Bond, tedy americké dluhopisy. `[d: AGG › index]` `[d: AGG › ucits_obdoba.index]` `[d: AGG › typ]`
- Poplatek **25 Kč ročně z každých 10 000 Kč** (0,25 %). AGG má 0,03 % (3 Kč). `[d: AGG › ucits_obdoba.ter]` `[d: AGG › ter]`
- Výnosy nevyplácí, investuje je zpátky do fondu. AGG je vyplácí měsíčně. `[d: AGG › ucits_obdoba.dividendova_politika]` `[d: AGG › dividendova_politika]`
- ✓ Ověřili jsme ho u XTB a Trading 212. Hledej ticker IUAA, v dolarech. `[d: AGG › ucits_obdoba.burza]` `[d: AGG › ucits_obdoba.kde_koupit.xtb_cz]` `[d: AGG › ucits_obdoba.kde_koupit.trading212]`

---

## 3. Všech 7 párů

- **H2:** Všech 7 párů na jednom místě
- **Podnadpis:** Přeškrtnutý americký originál, vedle evropské dvojče, které koupíš z Česka. Poplatek je roční poplatek fondu.
- **Karty:** žlutým fixem je zvýrazněné „✓ koupíš u …“, poplatek je bez zvýraznění a v korunách. `[d: * › ucits_obdoba.kde_koupit]` `[výpočet: TER × 100]` `[d: * › ter]` `[d: * › ucits_obdoba.rozdil_oproti_originalu]`

| Karta | Zvýrazněné | Poplatek | Pod tím |
|---|---|---|---|
| ~~VOO~~ → VUAA | ✓ koupíš u XTB, Trading 212 | 7 Kč ročně z 10 000 Kč (VOO: 3 Kč) | S&P 500 · stejný index |
| ~~VTI~~ → SXR4 | ✓ koupíš u XTB, Trading 212, Degiro | 3 Kč ročně z 10 000 Kč (VTI: 3 Kč) | celé USA · podobný index |
| ~~VT~~ → VWCE | ✓ koupíš u XTB, Trading 212, Degiro | 14 Kč ročně z 10 000 Kč (VT: 6 Kč) | celý svět · podobný index |
| ~~VWO~~ → VFEA | ✓ koupíš u XTB, Trading 212 | 17 Kč ročně z 10 000 Kč (VWO: 6 Kč) | rozvíjející se trhy · podobný index |
| ~~SDY~~ → SPYD | ✓ koupíš u XTB, Trading 212 | 35 Kč ročně z 10 000 Kč (SDY: 35 Kč) | dividendy · stejný index |
| ~~VGT~~ → QDVE | ✓ koupíš u XTB, Trading 212, Degiro | 15 Kč ročně z 10 000 Kč (VGT: 9 Kč) | technologie · podobný index |
| ~~AGG~~ → IUAA | ✓ koupíš u XTB, Trading 212 | 25 Kč ročně z 10 000 Kč (AGG: 3 Kč) | dluhopisy · stejný index |

- **Tlačítko pod kartami:** Chci tahák s ISINy a postupem nákupu. Otevře formulář v panelu na místě, nepřeskakuje dolů.

---

## 4. Proč ti broker americká ETF často nenabídne

- **H2:** Proč ti broker americká ETF často nenabídne
- **Text:** Fondy, které se v EU prodávají drobným investorům, potřebují dokument s klíčovými informacemi (KID). Americké fondy jako VOO ho nevydávají, a tak je brokeři často nenabízejí, nebo jen jako CFD. To je derivát, se kterým fond samotný nevlastníš. Evropská dvojčata KID mají, takže je koupíš normálně.
  `[r: PRIIPs]` (čl. 5 odst. 1 a čl. 13 odst. 1 nařízení PRIIPs; Lynx; XTB nabízí americké originály kromě VOO jen jako CFD: `[d: * › original_u_xtb_cz]`; KID pro VOO na serveru Vanguardu není)
  - „Často“, ne „vždy“: XTB má VOO.US jako stránku ETF a ČNB připouští execution-only bez KID.

---

## 5. Odkud máme data

- **H2:** Odkud máme data
- **Text:** Všechno jsme vzali přímo z webů správců fondů (Vanguard, iShares, State Street). Kde koupit, jsme ověřili na webech brokerů (XTB, Trading 212, Degiro). Stav k 10. 10. 2026.
  `[d: meta.overeno_dne]` `[d: meta.brokeri_overeno_dne]` `[d: * › *.zdroj]`
- **Text:** Poplatky i velikost fondů se mění. Před nákupem si je zkontroluj v dokumentu KID u svého brokera.
- **Rozbalovací odkaz:** Zdroje ke každému údaji
  Seznam: u každého páru odkaz na stránku originálu a dvojčete u správce. `[d: * › nazev.zdroj]` `[d: * › ucits_obdoba.nazev.zdroj]`
- **Upozornění (zvýrazněný blok):** Nejde o investiční doporučení. Ukazujeme, jaké fondy existují a kolik stojí, co koupíš, je tvoje rozhodnutí. Hodnota investice může klesnout a zpátky můžeš dostat méně, než vložíš.
- **Kdo za stránkou stojí:** Stránku provozuje Clientelo Czech s.r.o. (předpoklad, viz README).

---

## 6. Formulář

- **H2:** Tahák: 7 ETF z NYSE a jejich dvojčata, která koupíš z Česka
- **Co v něm je:**
  - ISIN a ticker všech 7 dvojčat. Zkopíruješ je rovnou do aplikace brokera. `[d: * › ucits_obdoba.isin]` `[d: * › ucits_obdoba.burza]`
  - Poplatky originálů a dvojčat vedle sebe. `[d: * › ter]` `[d: * › ucits_obdoba.ter]`
  - Postup nákupu u XTB a Trading 212 krok za krokem. (Podle nápověd brokerů, viz tahak.md.)
- **Náhled taháku nad odrážkami:** horní část titulní strany PDF, pootočená o 1,5° a dole rozmazaná. Generuje ji `scripts/pdf.mjs` z PDF.
  - alt: Náhled první strany taháku: sedm párů ETF, u každého fajfka, kde ho koupíš, a poplatek v korunách.
- **Pole:**
  - popisek: Tvůj e-mail
  - placeholder: jmeno@email.cz
- **Souhlas (zaškrtávací pole):** Souhlasím, že mi Clientelo Czech s.r.o. bude posílat e-maily o investování do ETF. Odhlásit se můžu kdykoli.
  - odkaz: Jak nakládáme s osobními údaji → `public/ochrana-osobnich-udaju.html` (návrh, musí schválit právník)
  - `[ROZHODNOUT + právník: smí být stažení taháku podmíněné souhlasem s marketingovými e-maily? Pokud ne, souhlas bude dobrovolný a tahák dostane každý, kdo vyplní e-mail.]`
- **Pořadí:** pole, hned pod ním tlačítko, pak souhlas a text pod ním. Tlačítko je co nejvýš, aby ho na mobilu nezakryla klávesnice s lištou návrhů e-mailů. Odeslat jde i modrou klávesou „Odeslat“ na klávesnici (`enterkeyhint="send"`), se stejnou kontrolou souhlasu.
- **Tlačítko:** Získat tahák
- **Tlačítko při odesílání:** Odesílám…
- **Pod tlačítkem:** Tahák otevřeš hned po odeslání, na e-mail čekat nemusíš.
- **Skryté pole proti botům:** popisek jen pro čtečky obrazovky: „Toto pole nech prázdné“

### Chybové hlášky

| Situace | Text |
|---|---|
| prázdný e-mail | Napiš svůj e-mail. |
| neplatný e-mail | Tenhle e-mail nevypadá správně. Zkontroluj ho. |
| nezaškrtnutý souhlas | Zaškrtni prosím souhlas. (Závisí na rozhodnutí výše.) |
| chyba serveru | Něco se pokazilo u nás. Zkus to prosím za chvíli znovu. |
| bez internetu | Vypadá to, že nejde internet. Zkontroluj připojení a zkus to znovu. |
| doména nepřijímá poštu (bez MX) | Na tuhle adresu nejde poslat e-mail. Zkontroluj, jestli v ní není překlep. |
| jednorázová adresa | Jednorázové e-mailové adresy nebereme. Napiš prosím svůj běžný e-mail. |
| moc pokusů z jedné IP (30 za hodinu) | Z tohohle připojení přišlo moc pokusů za sebou. Zkus to prosím za hodinu. |
| e-mail už máme (není chyba) | Žádná hláška, stejné poděkování jako u nového e-mailu. Jinak by formulář prozradil, kdo už je v databázi. |

### Poděkování (nahradí celý blok s formulářem: kartu v sekci, výzvu pod lístky i obsah panelu)

- **Nahoře velká zelená fajfka**
- **H2:** Hotovo, tahák je tvůj.
- **Tlačítko (černé, přes celou šířku):** Otevřít tahák. Otevře PDF v nové kartě, poděkování zůstane. PDF se samo nestahuje: Safari na iPhonu zpracuje stažení jinak než Chrome (dialog, nebo otevření místo stránky), tak má každý stejné tlačítko a text nic neslibuje.
- **První krok (rámeček):** **První krok:** v taháku najdi dvojče fondu, který tě zajímá, a na straně „Jak koupit“ projdi kroky pro svého brokera. (Strana „Jak koupit“ je v PDF, viz tahak.md.)
- **Sdílení:**
  - text: **Znáš někoho, kdo taky marně hledá VOO?** Pošli mu odkaz na tuhle stránku.
  - tlačítko (žluté): Poslat odkaz kamarádovi. Otevře nativní sdílení telefonu (Web Share API).
  - bez nativního sdílení se odkaz zkopíruje: „Odkaz je zkopírovaný. Vlož ho kamarádovi do zprávy.“
  - bez schránky (např. stránka přes http) se ukáže pole s odkazem: „Zkopíruj si odkaz:“
  - sdílený odkaz má `?ref=sdileni`, takže příchody od kamarádů jdou v měření poznat
  - text sdílení: Americká ETF ti broker v Česku často nenabídne. Tady jsou jejich evropská dvojčata.

---

## Tlačítko pořád vidět dole (mobil)

- **Text:** Tahák zdarma: všech 7 dvojčat
- **Tlačítko (žluté):** Chci tahák. Otevře panel s formulářem.
- **Kdy je lišta vidět:** až když jsou lístky mimo obrazovku (nepřekrývá je) a zrovna není vidět výzva ani formulář.
- **Panel:**
  - nadpis: Tahák: 7 ETF z NYSE a jejich dvojčata, která koupíš z Česka
  - pod ním: ISINy, poplatky a postup nákupu krok za krokem. PDF hned a zdarma.
  - zavírací tlačítko „×“ s popiskem pro čtečky „Zavřít“
- **Chování:**
  - objeví se, až jsou lístky mimo obrazovku,
  - schová se, když je na obrazovce výzva pod lístky nebo formulář,
  - po odeslání zmizí.

---

## 7. FAQ

- **H2:** Časté otázky
- **Je to zdarma?**
  Ano. Srovnání i tahák jsou zdarma. Chceme jen tvůj e-mail.
- **Co uděláte s mým e-mailem?**
  Uloží ho Clientelo Czech s.r.o. a bude ti posílat e-maily o investování do ETF, jak stojí v souhlasu. Odhlásit se můžeš kdykoli, odkaz bude v každém e-mailu. Podrobnosti najdeš v zásadách ochrany osobních údajů.
  `[TODO: obsah a frekvenci e-mailů musí potvrdit správce; odkaz na odhlášení v každém e-mailu musí umět e-mailový nástroj]`
- **Je dvojče úplně stejné jako originál?**
  U VOO, SDY a AGG sleduje dvojče stejný index. U VTI, VT, VWO a VGT je index podobný, ne stejný. Rozdíl vždycky píšeme u výsledku.
  `[d: * › ucits_obdoba.rozdil_oproti_originalu]`
- **Dá se VOO někde koupit?**
  Někdy ano. Když tě broker vede jako profesionálního klienta, KID nepotřebuje. A ČNB připouští, že broker, který jen provádí tvoje pokyny a nic ti nenabízí ani nedoporučuje, KID dávat nemusí. Běžný broker ti ale americké ETF často nenabídne.
  `[r: PRIIPs]` (výklad ČNB, Q&A B.2; Lynx o profesionálních klientech)
- **Radíte mi, co koupit?**
  Ne. Ukazujeme, co existuje a kolik to stojí. Rozhodnutí je na tobě.

---

## Patička

- Data: weby správců fondů a brokerů, ověřeno 10. 10. 2026. `[d: meta.overeno_dne]`
- Nejde o investiční doporučení ani nabídku investičního nástroje. Investování nese riziko.
- Provozovatel: Clientelo Czech s.r.o. · Zásady ochrany osobních údajů (odkaz na návrh)
- Nenápadně, menším písmem: Ukázkové řešení do výběrového řízení. (Spolu s `noindex` zůstane, dokud stránku Clientelo nepřevezme.)

---

## Rozhodnutí (10. 10. 2026)

- **Tlačítko:** „Chci tahák se všemi 7 dvojčaty“.
- **Brokeři:** jmenujeme všechny, u kterých se dostupnost podaří ověřit na jejich webu.
- **VOO zůstává hlavním příkladem.** Háček je formulovaný tak, aby platil, i kdyby VOO některý broker prodával.
- **Název stránky:** ETF dvojčata.
- **Formulář** se otevírá na místě: pod lístky, nebo jako panel ze spodního tlačítka či tlačítka pod kartami.

## Stále otevřené

1. Smí být tahák podmíněný souhlasem s marketingovými e-maily? Na právníka, zatím placeholder.
2. Co a jak často budeme posílat e-mailem (FAQ). Rozhodne správce.
