# Data o ETF

[`etf.json`](etf.json) obsahuje 7 ETF z NYSE Arca a ke každému jeho evropskou UCITS obdobu. Každý údaj má `hodnota`, `zdroj` (URL), `k_datu` (ke kterému dni údaj platí podle zdroje, `null` = zdroj datum neuvádí) a `overeno` (kdy byl zdroj přečten). Co se ověřit nepodařilo, je `null` s poznámkou. Vše ověřeno 10. 10. 2026.

## Proč ke každému ETF hledáme UCITS obdobu (PRIIPs)

**Potvrzeno, s výhradou:** český drobný investor si americké ETF u běžného brokera v EU nekoupí, ale nezakazuje to přímo zákon. Blokují to brokeři, protože americké fondy nemají sdělení klíčových informací (KID).

- **Nařízení PRIIPs (EU) č. 1286/2014**, české znění:
  - čl. 5 odst. 1: tvůrce produktu musí před nabízením retailovým investorům vypracovat KID a zveřejnit ho na svém webu,
  - čl. 13 odst. 1: kdo produkt prodává nebo k němu radí, musí KID retailovému investorovi poskytnout předtím, než je smlouva závazná,
  - čl. 4 bod 6: retailový investor = neprofesionální zákazník podle MiFID II.
  - Zdroj: [EUR-Lex, CELEX 32014R1286](https://eur-lex.europa.eu/legal-content/CS/TXT/?uri=CELEX:32014R1286). Text jsem četl přes [API Úřadu pro publikace EU](http://publications.europa.eu/resource/celex/32014R1286), protože EUR-Lex automatické stažení blokuje.
- **Americké fondy KID nemají.** Na dokumentovém serveru Vanguardu existuje KID pro irský [VUAA](https://fund-docs.vanguard.com/ie00bfmxxd54_priipskid_en.pdf), ale na stejné adrese pro [VOO](https://fund-docs.vanguard.com/us9229083632_priipskid_en.pdf) (ani pro VTI a VT) server vrací 403. To dokládá jen, že tam KID není, ne že neexistuje vůbec.
- **Praxe brokerů:**
  - [Lynx](https://www.lynxbroker.com/service/products-and-regulations/regulations/key-information-document/) (má český web [lynxbroker.cz](https://www.lynxbroker.cz/)) píše výslovně: americká ETF si retailový klient nekoupí, pokud není profesionální klient. Existující pozice může držet a prodat.
  - XTB nabízí VTI, VT, VWO, VGT a AGG českým klientům jen jako CFD, tedy derivát, ne vlastnictví fondu. Odkazy jsou v `etf.json` v poli `original_u_xtb_cz`.
- **Výhrada: výklad ČNB.** [Q&A ČNB k PRIIPs](https://www.cnb.cz/cs/dohled-financni-trh/legislativni-zakladna/stanoviska-k-regulaci-financniho-trhu/RS2018-12) (22. 10. 2018, otázka B.2) říká, že broker, který jen provádí pokyny z podnětu klienta (execution-only) a produkt sám nenabízí ani k němu neradí, povinnost z čl. 13 odst. 1 nemá. Česká legislativa tedy prostor nechává, záleží na brokerovi. [Fio](https://fio.cz/akcie-investice/etf/vypis-etf) o sobě uvádí, že ETF nenabízí a jen zpřístupňuje trhy.

**Co z toho plyne pro texty stránky:** psát „u většiny brokerů si americké ETF jako drobný investor nekoupíš“, ne „zákon to zakazuje“.

## Výběr

| Americké ETF | Typ | UCITS obdoba (burza, ticker) | Stejný index? |
|---|---|---|---|
| VOO | S&P 500 | Vanguard S&P 500 UCITS Acc (Xetra, VUAA) | ano |
| VTI | celý americký trh | iShares MSCI USA UCITS Acc (Xetra, SXR4) | ne, MSCI USA má výrazně méně titulů |
| VT | celý svět | Vanguard FTSE All-World UCITS Acc (Xetra, VWCE) | ne, FTSE All-World je bez malých firem |
| VWO | rozvíjející se trhy | Vanguard FTSE Emerging Markets UCITS Acc (Xetra, VFEA) | ne, FTSE Emerging je bez malých firem |
| SDY | dividendové akcie | SPDR S&P U.S. Dividend Aristocrats UCITS Dist (Xetra, SPYD) | ano |
| VGT | technologie | iShares S&P 500 Information Technology Sector UCITS Acc (Xetra, QDVE) | ne, jen technologické firmy z S&P 500 |
| AGG | americké dluhopisy | iShares US Aggregate Bond UCITS Acc (London Stock Exchange, IUAA, USD) | ano |

Všech 7 UCITS fondů má na českém webu XTB stránku „Investujte do ETF …“ (skutečné ETF, ne CFD). SPYD má navíc u emitenta Česko v seznamu zemí registrace.

**Proč ne jiné fondy:**

- QQQ se obchoduje na Nasdaqu, takže podle zadání vypadl.
- SPY a IVV by zdvojily S&P 500.
- SCHD: web Schwabu vrátil 403, údaje nešlo ověřit u emitenta.
- VYM: jeho UCITS sourozenec od Vanguardu (FTSE All-World High Dividend Yield) je globální, ne americký.

## Jak se data získávala

- Jen weby emitentů (Vanguard USA a UK, iShares USA a UK, State Street) a produktové stránky XTB. Žádné agregátory ani blogy.
- U Vanguardu USA jsou zdrojem JSON endpointy `investor.vanguard.com/vmf/api/…`, ze kterých se plní produktová stránka. Burza je z textu stránky („listed for trading on NYSE Arca“).
- Hodnoty vytáhl skript, ručně se nic nepřepisovalo.
- Kontroly:
  - všech 42 zdrojových URL vrací HTTP 200,
  - každý z 155 údajů má zdroj a datum ověření,
  - všechny ISINy mají platnou kontrolní číslici.

## Co se ověřit nepodařilo (TODO)

- **Dostupnost u jiných brokerů než XTB** (Fio, Trading 212, Degiro, IBKR, Portu). V `etf.json` je `null`.
- **VOO u XTB:** XTB má VOO.US jako stránku ETF (ne CFD) s ISIN fondu. Z veřejné stránky nejde zjistit, jestli nákup povolí retailovému klientovi. Je to v rozporu s ostatními americkými ETF, které XTB nabízí jen jako CFD.
- **Fio:** jestli u Fio jde americké ETF jako retailový klient koupit. Seznam ETF na webu Fio je zastaralý (obsahuje dávno zrušené fondy) a nic nedokazuje.
- **Přesná UCITS obdoba VTI** (celý americký trh včetně malých firem) se nenašla. iShares MSCI USA je nejbližší náhrada.
- **SDY u XTB:** stránka pro SDY.US se nenašla.
- **Datum u TER:** většina webů emitentů ho neuvádí (`k_datu: null`). Stránky Vanguard UK neuvádějí datum ani u velikosti fondu.
- **Nestáhnuté primární zdroje:**
  - FAQ Interactive Brokers k PRIIPs je JavaScriptová aplikace,
  - Q&A Joint Committee ESAs k PRIIPs jsem neprošel,
  - tiskové zprávy Rady EU a Evropského parlamentu k Retail Investment Strategy blokují automatické stažení. Podle výsledků vyhledávání padla předběžná dohoda v 12/2025 a změny PRIIPs se mají uplatnit až 18 měsíců po vstupu v platnost, takže k 10/2026 se stav nemění. Neověřeno z primárního zdroje.
- **Nařízení PRIIPs:** četl jsem původní znění z roku 2014, konsolidované znění se pozdějšími změnami ne.
- **Výkonnost fondů** se zatím nesbírala. Zadání ji pro tento krok nevyžadovalo; před použitím na stránce bude potřeba období, měna a zdroj.
