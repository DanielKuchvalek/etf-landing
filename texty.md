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

- **`<title>`:** Evropská dvojčata amerických ETF | `[TODO název stránky]`
- **Meta description a OG popis:** VOO, VT a dalších 5 ETF z USA ti většina brokerů v Česku neprodá. Najdi jejich evropská dvojčata, která koupíš.
  `[r: PRIIPs]` `[d: * › ucits_obdoba.kde_koupit.xtb_cz]`

---

## 1. Úvod a „Najdi dvojče“

Nadpis a podnadpis se mění podle parametru v URL (viz `reklamy/README.md`). Zbytek stránky je pro všechny stejný.

### Výchozí verze (bez parametru, organická návštěva)

- **H1:** Najdi evropské dvojče k VOO, VT a dalším ETF z USA
- **Podnadpis:** Americká ETF ti většina brokerů v Česku neprodá. Jejich evropská dvojčata koupíš normálně.
  `[r: PRIIPs]` `[d: * › ucits_obdoba.kde_koupit.xtb_cz]`

### Verze A „Dvojče“ (`?v=dvojce`)

- **H1:** Chceš VOO a broker ho nenabízí? Má evropské dvojče.
- **Podnadpis:** Americká ETF ti většina brokerů v Česku neprodá. Dvojče se stejným nebo podobným indexem koupíš normálně.
  `[r: PRIIPs]` `[d: * › ucits_obdoba.rozdil_oproti_originalu]` `[d: * › ucits_obdoba.kde_koupit.xtb_cz]`

### Verze B „Poplatky“ (`?v=poplatky`)

- **H1:** Fond na americké akcie za 3 Kč ročně z každých 10 000 Kč
  `[d: VTI › ucits_obdoba.ter = 0,03]` `[výpočet: 0,03 × 100 = 3 Kč]`
- **Podnadpis:** Tolik si bere SXR4, evropské dvojče amerického VTI. Podívej se, kolik stojí dvojčata VOO, VT a dalších – všechna koupíš z Česka.
  `[d: VTI › ucits_obdoba.burza.ticker = SXR4]` `[d: * › ucits_obdoba.kde_koupit.xtb_cz]`
- **Drobně pod podnadpisem:** Jde o roční poplatek fondu (TER). Poplatky brokera a za směnu měny platíš zvlášť.

### Výběr ETF (pro všechny verze)

- **Popisek:** Které ETF tě zajímá?
- **Tlačítka (7):** `[d: * › typ]`
  - VOO · S&P 500
  - VTI · celé USA
  - VT · celý svět
  - VWO · rozvíjející se trhy
  - SDY · dividendy
  - VGT · technologie
  - AGG · dluhopisy
- **Pod výběrem:** Data přímo od správců fondů, ověřeno 10. 10. 2026
  `[d: meta.overeno_dne]`

---

## 2. Výsledek a výzva k taháku

Výsledek se objeví hned pod výběrem, bez přechodu na jinou stránku.

### Šablona výsledku

1. **Nadpis:** Evropské dvojče {originál} je {ticker dvojčete}
2. **Celý název dvojčete** `[d: X › ucits_obdoba.nazev]`
3. **Index:** shoda, nebo rozdíl
4. **Poplatek:** dvojče vs. originál
5. **Dividendy**
6. **Kde koupit**
7. **Tlačítko:**
   - tvoje znění: „Pošli mi tahák se všemi 7 dvojčaty“
   - můj návrh: **„Chci tahák se všemi 7 dvojčaty“**. Tahák se stáhne hned, nic neposíláme, a „Pošli mi“ by slibovalo e-mail. `[ROZHODNOUT]`
8. **Pod tlačítkem:** ISINy, poplatky a postup nákupu krok za krokem. PDF hned a zdarma.

U řádku „Kde koupit“ je „Nabízí ho třeba XTB.“ XTB je jediný broker, u kterého jsme dostupnost ověřili. `[ROZHODNOUT: jmenovat brokera na stránce? Pokud je zákazník kampaně sám broker, je to problém. Bez jména zůstane jen burza a ticker.]`

### VOO → VUAA

- **Evropské dvojče VOO je VUAA**
- Vanguard S&P 500 UCITS ETF (USD) Accumulating `[d: VOO › ucits_obdoba.nazev]`
- Stejný index: S&P 500. `[d: VOO › index]` `[d: VOO › ucits_obdoba.index]` `[d: VOO › ucits_obdoba.rozdil_oproti_originalu]`
- Poplatek 0,07 % ročně, tedy 7 Kč z každých 10 000 Kč. VOO má 0,03 % (3 Kč). `[d: VOO › ucits_obdoba.ter]` `[d: VOO › ter]`
- Dividendy nevyplácí, investuje je zpátky do fondu. VOO je vyplácí čtvrtletně. `[d: VOO › ucits_obdoba.dividendova_politika]` `[d: VOO › dividendova_politika]`
- Koupíš na burze Deutsche Börse pod tickerem VUAA, v eurech. Nabízí ho třeba XTB. `[d: VOO › ucits_obdoba.burza]` `[d: VOO › ucits_obdoba.kde_koupit.xtb_cz]`

### VTI → SXR4

- **Nejbližší evropská obdoba VTI je SXR4**
  (Ne „dvojče“: přesnou obdobu celého amerického trhu jsme nenašli.)
- iShares MSCI USA UCITS ETF (Acc) `[d: VTI › ucits_obdoba.nazev]`
- Podobný, ne stejný index. SXR4 sleduje MSCI USA a drží 515 titulů, VTI celý americký trh s 3 507 akciemi. Přesné dvojče celého trhu jsme mezi evropskými fondy nenašli. `[d: VTI › ucits_obdoba.index]` `[d: VTI › ucits_obdoba.pocet_titulu]` `[d: VTI › index]` `[d: VTI › pocet_titulu]` `[d: VTI › ucits_obdoba.rozdil_oproti_originalu]`
- Poplatek 0,03 % ročně, tedy 3 Kč z každých 10 000 Kč. Stejně jako u VTI. `[d: VTI › ucits_obdoba.ter]` `[d: VTI › ter]`
- Dividendy nevyplácí, investuje je zpátky do fondu. VTI je vyplácí čtvrtletně. `[d: VTI › ucits_obdoba.dividendova_politika]` `[d: VTI › dividendova_politika]`
- Koupíš na burze Deutsche Börse (Xetra) pod tickerem SXR4, v eurech. Nabízí ho třeba XTB. `[d: VTI › ucits_obdoba.burza]` `[d: VTI › ucits_obdoba.kde_koupit.xtb_cz]`

### VT → VWCE

- **Evropské dvojče VT je VWCE**
- Vanguard FTSE All-World UCITS ETF (USD) Accumulating `[d: VT › ucits_obdoba.nazev]`
- Podobný, ne stejný index. VWCE sleduje FTSE All-World, tedy velké a střední firmy z celého světa (3 784 akcií). VT sleduje širší FTSE Global All Cap (10 088 akcií). `[d: VT › ucits_obdoba.index]` `[d: VT › ucits_obdoba.pocet_titulu]` `[d: VT › index]` `[d: VT › pocet_titulu]` `[d: VT › ucits_obdoba.rozdil_oproti_originalu]` (popis „velké a střední firmy“ je z cíle fondu na stránce Vanguardu)
- Poplatek 0,14 % ročně, tedy 14 Kč z každých 10 000 Kč. VT má 0,06 % (6 Kč). `[d: VT › ucits_obdoba.ter]` `[d: VT › ter]`
- Dividendy nevyplácí, investuje je zpátky do fondu. VT je vyplácí čtvrtletně. `[d: VT › ucits_obdoba.dividendova_politika]` `[d: VT › dividendova_politika]`
- Koupíš na burze Deutsche Börse pod tickerem VWCE, v eurech. Nabízí ho třeba XTB. `[d: VT › ucits_obdoba.burza]` `[d: VT › ucits_obdoba.kde_koupit.xtb_cz]`

### VWO → VFEA

- **Evropské dvojče VWO je VFEA**
- Vanguard FTSE Emerging Markets UCITS ETF (USD) Accumulating `[d: VWO › ucits_obdoba.nazev]`
- Podobný, ne stejný index. VFEA sleduje FTSE Emerging, tedy velké a střední firmy z rozvíjejících se trhů (2 306 akcií). VWO sleduje širší index (6 348 akcií). `[d: VWO › ucits_obdoba.index]` `[d: VWO › ucits_obdoba.pocet_titulu]` `[d: VWO › pocet_titulu]` `[d: VWO › ucits_obdoba.rozdil_oproti_originalu]`
- Poplatek 0,17 % ročně, tedy 17 Kč z každých 10 000 Kč. VWO má 0,06 % (6 Kč). `[d: VWO › ucits_obdoba.ter]` `[d: VWO › ter]`
- Dividendy nevyplácí, investuje je zpátky do fondu. VWO je vyplácí čtvrtletně. `[d: VWO › ucits_obdoba.dividendova_politika]` `[d: VWO › dividendova_politika]`
- Koupíš na burze Deutsche Börse pod tickerem VFEA, v eurech. Nabízí ho třeba XTB. `[d: VWO › ucits_obdoba.burza]` `[d: VWO › ucits_obdoba.kde_koupit.xtb_cz]`

### SDY → SPYD

- **Evropské dvojče SDY je SPYD**
- State Street SPDR S&P U.S. Dividend Aristocrats UCITS ETF (Dist) `[d: SDY › ucits_obdoba.nazev]` (bez značek ®)
- Stejný index: S&P High Yield Dividend Aristocrats, tedy firmy, které dlouhodobě zvyšují dividendu. `[d: SDY › index]` `[d: SDY › ucits_obdoba.index]` `[d: SDY › typ]` (popis indexu je ze stránky SDY u State Street)
- Poplatek 0,35 % ročně, tedy 35 Kč z každých 10 000 Kč. Stejně jako u SDY. `[d: SDY › ucits_obdoba.ter]` `[d: SDY › ter]`
- Dividendy vyplácí čtvrtletně, stejně jako SDY. `[d: SDY › ucits_obdoba.dividendova_politika]` `[d: SDY › dividendova_politika]`
- Koupíš na burze Deutsche Börse pod tickerem SPYD, v eurech. Nabízí ho třeba XTB. `[d: SDY › ucits_obdoba.burza]` `[d: SDY › ucits_obdoba.kde_koupit.xtb_cz]`

### VGT → QDVE

- **Evropské dvojče VGT je QDVE**
- iShares S&P 500 Information Technology Sector UCITS ETF (Acc) `[d: VGT › ucits_obdoba.nazev]`
- Podobný, ne stejný index. QDVE drží jen technologické firmy z indexu S&P 500 (75 titulů), VGT širší výběr (318 akcií). `[d: VGT › ucits_obdoba.index]` `[d: VGT › ucits_obdoba.pocet_titulu]` `[d: VGT › pocet_titulu]` `[d: VGT › ucits_obdoba.rozdil_oproti_originalu]`
- Poplatek 0,15 % ročně, tedy 15 Kč z každých 10 000 Kč. VGT má 0,09 % (9 Kč). `[d: VGT › ucits_obdoba.ter]` `[d: VGT › ter]`
- Dividendy nevyplácí, investuje je zpátky do fondu. VGT je vyplácí čtvrtletně. `[d: VGT › ucits_obdoba.dividendova_politika]` `[d: VGT › dividendova_politika]`
- Koupíš na burze Deutsche Börse (Xetra) pod tickerem QDVE, v eurech. Nabízí ho třeba XTB. `[d: VGT › ucits_obdoba.burza]` `[d: VGT › ucits_obdoba.kde_koupit.xtb_cz]`

### AGG → IUAA

- **Evropské dvojče AGG je IUAA**
- iShares US Aggregate Bond UCITS ETF (Acc) `[d: AGG › ucits_obdoba.nazev]`
- Stejný index: Bloomberg US Aggregate Bond, tedy americké dluhopisy. `[d: AGG › index]` `[d: AGG › ucits_obdoba.index]` `[d: AGG › typ]`
- Poplatek 0,25 % ročně, tedy 25 Kč z každých 10 000 Kč. AGG má 0,03 % (3 Kč). `[d: AGG › ucits_obdoba.ter]` `[d: AGG › ter]`
- Výnosy nevyplácí, investuje je zpátky do fondu. AGG je vyplácí měsíčně. `[d: AGG › ucits_obdoba.dividendova_politika]` `[d: AGG › dividendova_politika]`
- Koupíš na londýnské burze pod tickerem IUAA, v dolarech. Nabízí ho třeba XTB. `[d: AGG › ucits_obdoba.burza]` `[d: AGG › ucits_obdoba.kde_koupit.xtb_cz]`

---

## 3. Všech 7 párů

- **H2:** Všech 7 párů na jednom místě
- **Podnadpis:** Vlevo americký originál, vpravo evropské dvojče, které koupíš z Česka. Čísla jsou roční poplatek fondu.
- **Karty:** `[d: * › ucits_obdoba.burza.ticker]` `[d: * › typ]` `[d: * › ucits_obdoba.rozdil_oproti_originalu]` `[d: * › ter]` `[d: * › ucits_obdoba.ter]`

| Karta | Typ | Index | Poplatek |
|---|---|---|---|
| VOO → VUAA | S&P 500 | stejný | 0,03 % → 0,07 % |
| VTI → SXR4 | celé USA | podobný | 0,03 % → 0,03 % |
| VT → VWCE | celý svět | podobný | 0,06 % → 0,14 % |
| VWO → VFEA | rozvíjející se trhy | podobný | 0,06 % → 0,17 % |
| SDY → SPYD | dividendy | stejný | 0,35 % → 0,35 % |
| VGT → QDVE | technologie | podobný | 0,09 % → 0,15 % |
| AGG → IUAA | dluhopisy | stejný | 0,03 % → 0,25 % |

- **Tlačítko pod kartami:** Chci tahák s ISINy a postupem nákupu

---

## 4. Proč americká ETF nekoupíš

- **H2:** Proč americká ETF v Česku většinou nekoupíš
- **Text:** Fondy, které se v EU prodávají drobným investorům, potřebují dokument s klíčovými informacemi (KID). Americké fondy jako VOO ho nevydávají, a tak ti je většina brokerů neprodá, nanejvýš jako CFD. To je derivát, se kterým fond samotný nevlastníš. Evropská dvojčata KID mají, takže je koupíš normálně.
  `[r: PRIIPs]` (čl. 5 odst. 1 a čl. 13 odst. 1 nařízení PRIIPs; Lynx; XTB nabízí americké originály jen jako CFD: `[d: * › original_u_xtb_cz]`)
  - `[TODO]` „Většina brokerů“ zatím stojí na Lynxu a XTB. Doplnit Fio, Trading 212 a Degiro, ať tvrzení obstojí.
  - `[TODO]` Ověřit VOO u XTB: XTB má VOO.US jako stránku ETF, ne CFD (`[d: VOO › original_u_xtb_cz]`). Pokud ho XTB retailu prodá, vyměnit příklad VOO za VT.

---

## 5. Odkud máme data

- **H2:** Odkud máme data
- **Text:** Všechno jsme vzali přímo z webů správců fondů (Vanguard, iShares, State Street). Kde koupit, jsme ověřili na webu XTB. Stav k 10. 10. 2026.
  `[d: meta.overeno_dne]` `[d: * › *.zdroj]`
- **Text:** Poplatky i velikost fondů se mění. Před nákupem si je zkontroluj v dokumentu KID u svého brokera.
- **Rozbalovací odkaz:** Zdroje ke každému údaji
  Seznam: u každého páru odkaz na stránku originálu a dvojčete u správce. `[d: * › nazev.zdroj]` `[d: * › ucits_obdoba.nazev.zdroj]`
- **Upozornění (zvýrazněný blok):** Nejde o investiční doporučení. Ukazujeme, jaké fondy existují a kolik stojí, co koupíš, je tvoje rozhodnutí. Hodnota investice může klesnout a zpátky můžeš dostat méně, než vložíš.
- **Kdo za stránkou stojí:** Stránku provozuje [TODO správce: Clientelo].

---

## 6. Formulář

- **H2:** Tahák: 7 ETF z NYSE a jejich dvojčata, která koupíš z Česka
- **Co v něm je:**
  - ISIN a ticker všech 7 dvojčat. Zkopíruješ je rovnou do aplikace brokera. `[d: * › ucits_obdoba.isin]` `[d: * › ucits_obdoba.burza]`
  - Poplatky originálů a dvojčat vedle sebe. `[d: * › ter]` `[d: * › ucits_obdoba.ter]`
  - Postup nákupu krok za krokem. `[TODO: obsah zatím není ověřený, viz tahak.md]`
- **Pole:**
  - popisek: Tvůj e-mail
  - placeholder: jmeno@email.cz
- **Souhlas (zaškrtávací pole):** Souhlasím, že mi [TODO správce: Clientelo] bude posílat e-maily o investování do ETF. Odhlásit se můžu kdykoli.
  - odkaz: Jak nakládáme s osobními údaji `[TODO stránka se zásadami]`
  - `[ROZHODNOUT + právník: smí být stažení taháku podmíněné souhlasem s marketingovými e-maily? Pokud ne, souhlas bude dobrovolný a tahák dostane každý, kdo vyplní e-mail.]`
- **Tlačítko:** Stáhnout tahák
- **Tlačítko při odesílání:** Odesílám…
- **Pod tlačítkem:** PDF se stáhne hned. Na e-mail čekat nemusíš.
- **Skryté pole proti botům:** popisek jen pro čtečky obrazovky: „Toto pole nech prázdné“

### Chybové hlášky

| Situace | Text |
|---|---|
| prázdný e-mail | Napiš svůj e-mail. |
| neplatný e-mail | Tenhle e-mail nevypadá správně. Zkontroluj ho. |
| nezaškrtnutý souhlas | Zaškrtni prosím souhlas. (Závisí na rozhodnutí výše.) |
| chyba serveru | Něco se pokazilo u nás. Zkus to prosím za chvíli znovu. |
| bez internetu | Vypadá to, že nejde internet. Zkontroluj připojení a zkus to znovu. |
| e-mail už máme (není chyba) | Tenhle e-mail už u nás máme. Tahák se ti stahuje. |

### Poděkování (nahradí formulář)

- **H2:** Hotovo, tahák se ti stahuje.
- **Text:** Nestahuje se? Stáhni ho tady. (odkaz na PDF)
- **Text:** Co dál: otevři tahák a začni krokem 1.
- **Volitelné sdílení:**
  - text: Znáš někoho, kdo taky marně hledá VOO? Pošli odkaz dál.
  - tlačítko: Sdílet odkaz

---

## Tlačítko pořád vidět dole (mobil)

- **Text:** Tahák zdarma: všech 7 dvojčat
- **Tlačítko:** Chci tahák
- **Chování:**
  - objeví se po prvním výsledku „Najdi dvojče“ nebo po odscrollování pod úvod,
  - schová se, když je na obrazovce formulář,
  - po odeslání zmizí.

---

## 7. FAQ

- **Je to zdarma?**
  Ano. Srovnání i tahák jsou zdarma. Chceme jen tvůj e-mail.
- **Co uděláte s mým e-mailem?**
  Uloží ho [TODO správce: Clientelo] a bude ti posílat [TODO: co a jak často]. Odhlásit se můžeš jedním klikem v každém e-mailu. Podrobnosti najdeš v zásadách ochrany osobních údajů.
  `[TODO: obsah e-mailů, frekvenci a odhlášení musí potvrdit správce; „jedním klikem“ slibujeme jen, pokud to e-mailový nástroj umí]`
- **Je dvojče úplně stejné jako originál?**
  U VOO, SDY a AGG sleduje dvojče stejný index. U VTI, VT, VWO a VGT je index podobný, ne stejný. Rozdíl vždycky píšeme u výsledku.
  `[d: * › ucits_obdoba.rozdil_oproti_originalu]`
- **Opravdu VOO nikde nekoupím?**
  Výjimky jsou. Když tě broker vede jako profesionálního klienta, KID nepotřebuje. A ČNB připouští, že broker, který jen provádí tvoje pokyny a nic ti nenabízí ani nedoporučuje, KID dávat nemusí. Běžně ti ale broker americké ETF nenabídne.
  `[r: PRIIPs]` (výklad ČNB, Q&A B.2; Lynx o profesionálních klientech)
- **Radíte mi, co koupit?**
  Ne. Ukazujeme, co existuje a kolik to stojí. Rozhodnutí je na tobě.

---

## Patička

- Data: weby správců fondů a XTB, ověřeno 10. 10. 2026. `[d: meta.overeno_dne]`
- Nejde o investiční doporučení ani nabídku investičního nástroje. Investování nese riziko.
- Provozovatel: [TODO správce: Clientelo] · Zásady ochrany osobních údajů `[TODO stránka]` · Kontakt `[TODO]`

---

## Otevřená rozhodnutí v textech

1. Text tlačítka: „Pošli mi tahák…“ (tvoje), nebo „Chci tahák…“ (můj návrh, protože se nic neposílá).
2. Jmenovat na stránce XTB, nebo ukázat jen burzu a ticker.
3. Smí být tahák podmíněný souhlasem s marketingovými e-maily? (Na právníka.)
4. VOO jako hlavní příklad zůstává, jen pokud se potvrdí, že ho XTB retailu neprodá.
5. Název stránky (do `<title>` a patičky).
6. Co a jak často budeme posílat e-mailem (FAQ).
