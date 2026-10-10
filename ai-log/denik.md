# Deník práce s AI

Doplňuje exporty konverzací (`/export`), které nezachytí celý průběh práce subagentů. Podklad pro sekci „Jak jsem pracoval s AI“ v README.

## Formát záznamu

### RRRR-MM-DD – krok

- **Zadání pro AI / agenta:** …
- **Kontrola výstupu:** …
- **Kde se AI spletla a jak se na to přišlo:** …

## Záznamy

### 2026-10-10 – výzkum PRIIPs a data o ETF

- **Zadání pro AI:** ověřit z primárních zdrojů (EUR-Lex, ČNB, ESMA, brokeři), proč Čech nekoupí americké ETF; vybrat 6–8 ETF z NYSE / NYSE Arca, burzu ověřit u emitenta; ke každému najít UCITS obdobu; vše uložit do `data/etf.json` se zdrojem a datem. Bez subagentů, jedna konverzace.
- **Kontrola výstupu:**
  - data z webů emitentů vytáhl skript (bez ručního přepisování),
  - kontrolní skript ověřil, že každý údaj má zdroj a datum a null jen s poznámkou,
  - ISINy prošly kontrolou kontrolní číslice,
  - všech 42 zdrojových URL vrací HTTP 200.
- **Kde se AI spletla nebo by se spletla:**
  - Odhadnuté ID produktové stránky Vanguard UK (9679) vedlo na FTSE All-World, ne na S&P 500. Přišlo se na to podle ISINu na stránce; správná ID se pak dohledala.
  - VTI se dnes jmenuje „Vanguard Morningstar Total Stock Market ETF“ a sleduje index Morningstar. Z paměti by AI uvedla jiný název a index; opravilo se díky čtení přímo z API Vanguardu.
  - Regex na index u SDY selhal, protože JSON v HTML byl escapovaný. Kontrolní výpis skriptu to zachytil („index: nenalezeno“).
  - Volba hlavní burzy u UCITS fondu AGG nejdřív vybrala mexickou burzu (první v seznamu). Zjistilo se to při čtení souhrnu a pravidlo se změnilo na Xetra EUR → LSE USD.
  - Původní předpoklad „PRIIPs = zákaz“ byl příliš zjednodušený: ČNB připouští execution-only bez KID a XTB má VOO.US jako stránku ETF. Zapsáno jako výhrada v `data/README.md`.

### 2026-10-10 – ověření brokerů a stavba stránky

- **Zadání pro AI:**
  - ověřit dostupnost 7 dvojčat u Trading 212, Degiro a Fio ze stránek brokerů,
  - postavit `public/index.html` podle `texty.md` a `design.md`,
  - odeslání a měření zatím jen do konzole,
  - otestovat na 375 px a v Lighthouse.
- **Kontrola výstupu:**
  - dostupnost u brokerů se do `etf.json` zapsala skriptem z uložených stránek; tabulku v `data/README.md` porovnal skript s daty,
  - čísla na stránce (výsledky, karty, zdroje) porovnal skript s `etf.json`,
  - automatický test v headless Chrome na 375 px (60 kontrol): varianty úvodu, všech 7 výsledků, chybové hlášky formuláře, panel, lišta, měření a to, že e-mail se nikdy neodešle s ID návštěvy,
  - Lighthouse v mobilním režimu,
  - snímky obrazovky, prohlédnuté očima.
- **Kde se AI spletla a jak se na to přišlo:**
  - Zkratka `padding` u hlavičky, úvodu a patičky přepsala boční okraje, takže text se lepil na kraj. Ukázal to první snímek obrazovky.
  - Lišta dole se neukazovala, protože `scroll-padding-top` nechal posledních 12 px úvodu ve výřezu. Zjistil to automatický test; řešením je pozorovat výběr ETF s okrajem 15 %.
  - Hledání na Trading 212 přes vyhledávací pole hlásilo „NENALEZENO“, protože se stránka po prvním hledání přenačetla a pak ji zablokovala ochrana proti botům. Kdyby se výsledek vzal vážně, vyšlo by, že fondy u Trading 212 nejsou. Správná data byla v seznamu nástrojů vloženém ve stránce.
  - Formulář „Seznam ETF“ na fio.cz nevracel nic ani pro fond, který v seznamu prokazatelně je. Proto se Fio zapsalo jako neověřené, ne jako „nenabízí“.

### 2026-10-10 – tahák, opravy po testu na iPhonu, skripty v repu

- **Zadání pro AI:**
  - opravit nálezy z testu na skutečném iPhonu (dělal ho člověk),
  - vytvořit PDF tahák ze zdroje v repu, postup nákupu podle nápověd XTB a Trading 212,
  - přesunout testy do repa,
  - před předěláním designu nejdřív poslat plán.
- **Kontrola výstupu:**
  - test stránky (66 kontrol),
  - `check_page.py`,
  - `check_pdf.py` (text PDF proti `etf.json`),
  - stránky PDF převedené na obrázky a prohlédnuté očima,
  - seznam vložených písem v PDF.
- **Kde se AI spletla a jak se na to přišlo:**
  - Nápověda XTB na `/int/` platí pro klienty mimo EU (uvádí účet v USD a jiné platební metody). Kdyby se použila, postup pro Čechy by byl špatně. Přišlo se na to podle textu „For Non UK/EU Residents“; kroky jsou z české nápovědy.
  - Systémové písmo macOS se do PDF nevloží, Chrome tak použil Arial s dopočítaným tučným řezem. Ukázal to výpis vložených písem; PDF teď používá Helvetica Neue.
  - Papírové pozadí v PDF končilo u okrajů stránky jako obdélník a karty párů byly tak velké, že se na stranu vešly jen dvě. Obojí ukázaly obrázky stránek.
  - V textu kroku byl překlep („podle tahu“) a v návrhu zásad tvar s rodem („udělil(a)“). Obojí se našlo při čtení výstupu.
  - Po změně poděkování hledal test poděkování ve slotu, který se teď nahrazuje celý. Selhání testu ukázalo, že je potřeba upravit selektory, ne stránku.
