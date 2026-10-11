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

### 2026-10-10 – předělání designu podle testu na iPhonu

- **Zadání pro AI:**
  - nejdřív poslat plán a teprve po schválení stavět,
  - lístky s otočením, žlutý fix, zelená fajfka, bez modré,
  - náhled taháku generovaný z PDF,
  - nic absolutního v textech,
  - testy, Lighthouse a snímky před a po.
- **Kontrola výstupu:**
  - test stránky (75 kontrol, nově otočení lístků, pootočení nejvýš 2°, reduced motion, náhled),
  - `check_page.py` rozšířený o lístky a karty a ověřený podvrženou chybou (dvě úmyslné chyby nahlásil),
  - Lighthouse u všech tří verzí úvodu,
  - snímky prohlédnuté očima.
- **Kde se AI spletla a jak se na to přišlo:**
  - AI ve svém plánu sama navrhla podnadpis „Americké ti broker nenabídne, evropské ano.“, tedy absolutní tvrzení proti dohodě. Chytil to člověk.
  - Ručně kreslený kroužek byl moc těsný a přetínal písmena. Ukázal to snímek.
  - Po prvním otočení se ukázala spodní lišta a překryla třetí řadu lístků, takže klepnutí na SDY a VGT trefilo lištu. Zjistil to automatický test; teď se lišta ukáže, až jsou lístky mimo obrazovku. Skutečná vada UX, ne testu.
  - „Trading 212“ se zalamovalo mezi slovem a číslem. Ukázal to snímek; doplněná nezlomitelná mezera.
  - Test po stažení PDF neukončil proces. Doplněný explicitní konec.

### 2026-10-11 – opravy po druhém testu na iPhonu, příprava Supabase a Vercelu

- **Zadání pro AI:**
  - nejdřív napsat příčinu chyby s klávesnicí na iPhonu, pak opravit a otestovat ve WebKitu (Playwright, iPhone 13 a SE) se simulovanou klávesnicí,
  - zjistit 404 u PDF, zápis PDF přes dočasný soubor, poděkování nesmí slibovat stažení,
  - poděkování s tlačítkem, prvním krokem a sdílením (měřené),
  - zásady: IČO a sídlo z ARES, místo žlutých TODO „doplní správce“,
  - favicon, obrázek pro sdílení, `color-scheme`, přístupnost panelu, šířka 320 px,
  - schéma Supabase, trychtýř, funkce v `api/` s testy na podvrženou databázi, `vercel.json`, návod.
- **Kontrola výstupu:**
  - test ve WebKitu (72 kontrol) se dvěma modely klávesnice (iOS: zmenšený visualViewport, Android: zmenšené okno) a snímky s nakreslenou klávesnicí,
  - test funkcí s podvrženou databází (54 kontrol),
  - test stránky v Chromu (109 kontrol), nově porovnává odeslané události s tím, co server uložil, a zkouší výpadek databáze,
  - při přegenerování PDF 170 požadavků na soubor, všechny 200 a celý soubor,
  - u nových kontrol ověřeno, že na staré verzi stránky selžou (přetékání lístků na 320 px),
  - snímky, obrázek pro sdílení a zásady prohlédnuté očima, Lighthouse.
- **Kde se AI spletla a jak se na to přišlo:**
  - Chybu s klávesnicí zavedla AI sama v předchozí verzi: panel `position: fixed` u spodku a fokus do pole hned po `showModal()` během animace. Headless Chrome klávesnici nemá, takže to žádný test neukázal. Našel to člověk na iPhonu.
  - Kontrola šířky hlídala jen vodorovné přetečení, takže nezachytila, že na 320 px rub lístku se třemi brokery přetéká svisle přes další řadu. AI na to přišla při prohlížení snímků z 320 px a doplnila svislou kontrolu.
  - Headless WebKit nerespektuje `backface-visibility`, takže všechny lístky ukazovaly zrcadlově rub. Na iPhonu to podle člověka fungovalo. Odhalil to snímek z WebKitu; stránka má teď pojistku přes `visibility`.
  - Test měření po přechodu na skutečné požadavky nezachytil odeslání kontaktu: Puppeteer u `fetch`, jehož tělo stránka nečte, nevyvolá `requestfinished`. Test teď čte událost `response`.
  - Testovací adresa na skutečné doméně (seznam.cz) mohla patřit skutečnému člověku. Při kontrole diffu před commitem ji AI nahradila adresou na vyhrazené doméně `example.com`.
  - Adresu `etf-dvojcata.vercel.app` AI chtěla použít pro `og:image`, ale kontrola ukázala, že ji už používá cizí projekt. Zvolila volnou `etf-dvojcata-clientelo` a zapsala to do návodu.
  - Příčinu 404 u PDF se nepodařilo zjistit. AI to neoznačila za vyřešené: zapsala, co vyloučila, a přidala diagnostiku do lokálního serveru.

### 2026-10-11 – otočení lístku ve WebKitu, formulář nad lištou návrhů, bezpečnost a ochrana proti spamu

- **Zadání pro AI:**
  - nejdřív napsat příčinu nefunkčního otočení lístku (test člověka na iPhonu, Chrome na iOS), pak opravit a ověřit snímky v průběhu animace ve WebKitu,
  - tlačítko formuláře nad klávesnici i s lištou návrhů e-mailů, odeslání modrou klávesou,
  - vypsat dostupné skilly a ty na bezpečnost a review použít; projít celý projekt, přidat ochranu proti spamu (rychlost odeslání, limity s hashem IP, jednorázové domény, MX), bezpečnostní hlavičky, testy na všechno,
  - noindex a poznámka „Ukázkové řešení“ v patičce, doména etf-dvojcata-demo, ověřit v dokumentaci Supabase, co je aktivita proti uspání.
- **Kontrola výstupu:**
  - příčina otočení změřená ve WebKitu (úhel z matice transformace po 100 ms), nový test kontroluje každý snímek průběhu a na staré verzi by selhal (zrcadlový nebo prázdný lístek),
  - nová kontrola „pole a tlačítko nad lištou návrhů“ ověřená na staré verzi formuláře (selhala) i na nové (prošla),
  - skilly `security-review` (s podúkolem podle jeho postupu) a `code-review`; jejich nálezy AI ověřila v kódu, falešný poplach (typografie) zapsala jako falešný,
  - SQL testované na skutečném Postgresu (PGlite) včetně výchozích práv Supabase; lokální server používá stejnou databázi a stejné hlavičky jako Vercel,
  - CSP ověřená tím, že podstrčený skript se nespustí, a Lighthouse bez chyb v konzoli.
- **Kde se AI spletla a jak se na to přišlo:**
  - Otočení lístku rozbila „pojistka“, kterou AI přidala v předchozím kroku kvůli headless WebKitu: přepínala strany podle času, ne podle úhlu. Test kontroloval jen konečný stav, takže chybu našel až člověk na telefonu.
  - AI tvrdila v README, že zaokrouhlení času na hodiny zabrání spárovat kontakt s návštěvou. Review ukázal, že to nepravda (pořadová čísla, pořadí zápisu). Opraveno na náhodná UUID a tvrzení přepsané na pravdivé, včetně toho, co vyřešit nejde.
  - AI ve svém předchozím počtu uvedla 45 kontrol databáze, skutečně jich je 44. Přišlo se na to při kontrole výstupu před commitem.
  - Klepnutí v testech míjela tlačítka, protože fokus stránku ještě plynule posouval. Šlo o chybu testu, ne stránky; test teď čeká na doběhnutí posunu.
  - Review hlásil chybějící nezlomitelné mezery v textech z JS. Kontrola znaků ukázala, že tam jsou (jako znak, ne `&nbsp;`), takže falešný poplach.

### 2026-10-11 – dotažení před nasazením: JS, limity, MX, párování, README, kontrola repa

- **Zadání pro AI** (připravené v plánovacím chatu na claude.ai):
  - JS pod limit 20 kB bez ztráty funkcí,
  - limit kontaktů z jedné IP na 30 za hodinu (CGNAT),
  - ověřit fail-open a krátký timeout u kontroly MX a přidat test,
  - podle rozhodnutí člověka: odeslání bez ID návštěvy, varianta u kontaktu, čas událostí na minuty, trychtýř odeslání z kontaktů, pravdivý popis v README i zásadách,
  - zdroj, datum a „Není to investiční doporučení“ u lístků,
  - README pro hodnotitele: shrnutí, vyzkoušení za 2 minuty, konverze po krocích, obchodní pohled, tři A/B hypotézy s počtem návštěv, práce s AI, revize celého textu,
  - kontrola historie gitu a ai-log, checklist nasazení, commit po každém bodu, push na konci.
- **Kontrola výstupu:**
  - každý bod commitnutý zvlášť až po testech: API 127, databáze 57, Chrome 127 a WebKit 81 kontrol,
  - nové kontroly:
    - velikost JS,
    - záložní UUID bez `crypto.randomUUID`,
    - 30. a 31. pokus,
    - šest druhů chyb DNS, timeout 1 s a zrušený časovač,
    - události bez ID návštěvy (funkce, databáze i prohlížeč),
    - trychtýř z kontaktů,
    - razítko u lístků,
  - kontrola MX ověřená i proti skutečnému DNS (20 ms, `example.com` s null MX správně odmítnutá),
  - benchmarky jen z ověřených stránek (Unbounce, LocaliQ). WordStream vrátil 403, proto čísla z LocaliQ (stejná firma),
  - v README skript ověřil všechny odkazy na nadpisy a soubory a že nezůstalo TODO,
  - celá historie gitu prohledaná na klíče, `.env` a `ZADANI.md` (nic) a ai-log na e-maily. Výstup byl jen maskovaný, aby se adresy nedostaly do exportu.
- **Kde se AI spletla a jak se na to přišlo:**
  - **Kontrola MX odmítala doménu bez MX záznamu,** i když pošta jde podle RFC 5321 na adresu domény (implicitní MX). Navíc časovač timeoutu zůstával běžet. AI to našla, když ověřovala fail-open, o který člověk požádal.
  - **Limit 10 kontaktů za hodinu AI v README označila za „málo pravděpodobný“ problém** pro skutečné lidi. Člověk upozornil na sdílené IP mobilních operátorů (CGNAT).
  - **Chrome test po zkrácení JS selhal na klepnutí na souhlas.** AI nejdřív pustila test se starou verzí stránky: selhal taky, takže chyba nebyla ve změně. Příčinu našla záznamem událostí: puppeteer před klepnutím posouval stránku a se `scroll-behavior: smooth` klepl vedle. Test teď prvek nejdřív okamžitě vystředí.
  - **Rozhodnutí „odeslání bez ID návštěvy“ by samo nestačilo:** pokus bez chyby nebo otevřený tahák s ID návštěvy prozradí totéž. AI proto bez ID posílá i pokus, chybu, otevření taháku a sdílení a v reportu to řekla člověku.
  - **Automatická bezpečnostní kontrola commitu označila riziko deanonymizace v `schema.sql`.** Šlo o zbytkové párování při malém provozu (pořadí zápisu, minuta), které README popisuje. AI k němu doplnila i zúžení podle místa formuláře v události odeslání.
  - **Razítko pod lístky tvrdilo „Data přímo od správců fondů“,** ale lístky ukazují i dostupnost u brokerů, a ta je z webů brokerů. Opraveno spolu s doplněním „Není to investiční doporučení“.
  - **`reklamy/README.md` tvrdilo, že se `utm_content` ukládá k událostem.** Neukládá, verzi nese `?v=`. Přišlo se na to při revizi README.
  - **V nesledovaném exportu `03` bylo 11 testovacích adres na skutečných doménách** z minulého kola (adresy, které AI dřív nahradila v kódu). Před commitem nahrazené za `@example.com`. V historii gitu na GitHubu zůstávají dvě podobné adresy (deník a test), historie se nepřepisuje.

### 2026-10-11 – nasazení, kontrola živé stránky, obrázky reklam

- **Zadání pro AI:**
  - ověřit živou stránku jen čtením, bez formuláře a bez zápisu do databáze,
  - Lighthouse proti živé adrese, README ve stavu „nasazeno“,
  - snímky z iPhonu 13, revize README očima hodnotitele,
  - obrázky obou reklam (feed a Stories/Reels) generované z HTML,
  - Android jako známé omezení.
- **Kontrola výstupu:**
  - `scripts/check-live.mjs`: 22 kontrol na živé adrese, v prohlížeči blokuje všechny požadavky na `/api/`, takže se neuložila ani událost příchodu (ověřeno počtem zablokovaných požadavků),
  - Lighthouse s `--blocked-url-patterns=*/api/*` ze stejného důvodu,
  - snímky a obrázky reklam prohlédnuté očima, u Stories skript ověřuje, že text je v bezpečné zóně,
  - odkazy a obrázky v README a v `reklamy/` ověřené skriptem.
- **Kde se AI spletla nebo co musela opravit:**
  - První snímek otočeného lístku měl nahoře useknutý řádek textu. Přišlo se na to při prohlížení, snímek je přefocený.
  - Na prvních obrázcích reklam byla šipka a kroužek vedle velkého písma moc tenké. Pootočení lístku v reklamě B navíc zvedalo tickery vpravo nad jejich řádek. Obojí ukázal náhled, opraveno.
  - Bezpečné zóny Stories a Reels se nepodařilo ověřit v oficiální dokumentaci Meta. Návody třetích stran se rozcházejí (dole 250–670 px). AI zvolila 270/450 px a v README nechala kontrolu v náhledu Ads Manageru, místo aby čísla vydávala za ověřená.
  - Popis reklamy B chtěl „modrou propisku“, ale modrá ze vzhledu stránky vypadla. Obrázek drží styl stránky a popis je opravený.
