# CLAUDE.md

Pravidla pro práci na tomto projektu. Platí pro každou session i pro subagenty. Když subagentovi zadáváš úkol, pošli mu i pravidla, která se ho týkají.

## Projekt

Landing page do výběrového řízení. Celé zadání je v `ZADANI.md` (zadání B; jen lokálně, je v `.gitignore`), odevzdání 16. 10. 2026.

- **Co:** srovnání ETF obchodovaných na NYSE pro českého drobného investora. Spíš mladší lidé, přicházejí z placené reklamy na Instagramu nebo Facebooku na mobilu a stránce dají pár sekund.
- **Účel:** lead magnet. Návštěvník dostane hodnotu a výměnou nechá kontakt. Měřítko: dala by se na stránku zítra pustit reklama?
- **Stack:** čisté HTML + CSS + vanilla JS, bez frameworků a bez build kroku · Vercel (statika + serverless funkce v `api/`) · Supabase (PostgreSQL) pro kontakty, zápis jen ze serverless funkce.
- **Jazyk stránky:** čeština.

## Struktura

Navržená struktura. Složky vznikají, až jsou potřeba.

```
public/        web – jediná složka, kterou Vercel servíruje
  index.html   celá stránka; CSS a JS jsou inline (jeden požadavek)
  tahak.pdf    lead magnet, generovaný (needitovat ručně)
  favicon.*, apple-touch-icon.png, og.png   ikony a obrázek pro sdílení, generuje scripts/obrazky.mjs
  ochrana-osobnich-udaju.html   návrh zásad (musí schválit právník)
api/           serverless funkce: lead.js (formulář), event.js (měření), token.js (token proti botům), keepalive.js (cron);
               společný kód v _lib.js (soubory s _ Vercel nenasadí jako funkce)
tahak/         zdroj PDF taháku (tahak.html), generuje scripts/pdf.mjs
scripts/       testy, Lighthouse, snímky obrazovky, generování PDF (návod v scripts/README.md)
docs/screenshots/  snímky obrazovky před a po úpravách
docs/*.md      bezpečnost, testování, nasazení a návrh souhlasu a zásad pro Clientelo (z README, aby šlo přečíst za 5 minut)
data/          podklady k údajům o ETF: hodnota, zdroj (URL), datum
supabase/      SQL: schema.sql (tabulky, RLS, limity, funkce), funnel.sql (trychtýř podle verzí úvodu)
reklamy/       obě verze reklamy (texty a vizuály)
ai-log/        exporty konverzací z Claude Code (/export) a deník práce s AI
README.md      dokumentace pro hodnotitele
texty.md       všechny texty stránky s odkazy na data, ze kterých vycházejí
tahak.md       osnova PDF taháku a co pro něj chybí
design.md      návrhy směru designu
.env.example   názvy proměnných prostředí bez hodnot
package.json   jen "type": "module" pro funkce v api/ (bez závislostí)
vercel.json    výstupní složka public/, region fra1, denní cron
```

`public/` nastav ve `vercel.json` explicitně jako výstupní složku, aby se omylem neservíroval celý kořen repa (`ai-log/`, `supabase/`, `CLAUDE.md`). Novou složku v kořeni nezakládej bez domluvy. Když se struktura změní, uprav tuhle sekci.

## Rozhodnutí

Už rozhodnuté, neotevírej znovu. Když narazíš na důvod rozhodnutí změnit, napiš mi ho.

- **NYSE = NYSE i NYSE Arca.** Fondy obchodované hlavně na Nasdaqu (např. QQQ) vynecháváme. Proč: většina amerických ETF je na NYSE Arca, která patří pod NYSE Group.
- **Ke každému ETF z NYSE i evropská UCITS obdoba,** kterou si Čech opravdu koupí. Proč: brokeři v EU drobným investorům americké ETF kvůli PRIIPs (chybí KID) často neprodají a stránka nesmí slibovat něco, co návštěvník nemůže udělat. Ověřeno 10. 10. 2026, výhrady a zdroje jsou v `data/README.md`. V textech piš „u většiny brokerů si to nekoupíš“, ne „zakazuje to zákon“.
- **Tykáme.** Proč: cílovka jsou spíš mladší lidé z Instagramu a Facebooku, vykání by tam působilo strojeně.
- **Kontakt = jen e-mail,** žádný telefon. Proč: zadání chce co nejméně polí a e-mail stačí k doručení toho, co slibujeme.
- **Konverze = návštěva → odeslaný formulář.** Proč: oba konce trychtýře změříme vlastním měřením, bez dat z reklamního systému.
- **Měření: vlastní pseudonymní eventy do Supabase (ID návštěvy je náhodné, ale není to anonymní údaj), žádné GA4, pixel ani cookie lišta.** Stránka posílá eventy (příchod, hloubka scrollu, otočení lístku, zobrazení výzvy, otevření a odeslání formuláře, otevření taháku, sdílení) přes `/api/event`, kontakt přes `/api/lead`. ID návštěvy žije jen v paměti po dobu jednoho načtení stránky; nic se neukládá do prohlížeče (žádné cookies, `localStorage` ani `sessionStorage`). Trychtýř se počítá SQL dotazem. Proč: GA4 by potřebovalo souhlas a cookie lišta na mobilu zdržuje a ubírá konverze.
- **ID návštěvy se nikdy nespojuje s e-mailem.** Neukládej ho do tabulky kontaktů a neposílej ho spolu s e-mailem. Proč: z pseudonymních eventů by se staly údaje přímo spojené s e-mailem. Před ostrou kampaní posoudí měření právník (poznámka je v README).
- **Události od odeslání formuláře dál jsou bez ID návštěvy** (`odeslani_pokus`, `odeslani_chyba`, `odeslano`, `tahak_otevren`, `sdileni`; seznam je v `api/_lib.js` a hlídá ho i databáze). Verze úvodu se ukládá ke kontaktu, trychtýř počítá odeslání z tabulky kontaktů a čas událostí je jen na minuty. Proč: podle událostí s ID návštěvy kolem odeslání by šlo poznat, která návštěva kontakt odeslala. V textech netvrdíme, že spárování je nemožné.
- **Koncept stránky: „dvojčata“.** Návštěvník klepne na americké ETF a uvidí jeho evropskou UCITS obdobu. Lead magnet je PDF tahák; o e-mail žádáme po prvním výsledku a tlačítkem pořád vidět dole. Detaily (cílovka, pořadí sekcí, proč) jsou v README, texty v `texty.md`, reklamy v `reklamy/`. Proč: stavíme na ověřeném faktu, který návštěvník jinde snadno nenajde.
- **Název stránky: ETF dvojčata.** Design: směr B „Tahák v sešitě“ z `design.md`, čistě a důvěryhodně, nesmí působit dětsky (pravidla jsou v `design.md`).
- **Nic absolutního netvrdíme.** Nepíšeme „VOO nekoupíš“, ale „broker ti ho často nenabídne“. Proč: XTB má VOO.US jako ETF a ČNB připouští execution-only bez KID.
- **Reklamy:** A „Dvojče“ (zklamání z brokera) a B „Začátek“ (nejistota). Úvod stránky se mění podle `?v=dvojce` / `?v=zacatek`. Proč: testujeme dvě motivace a úvod musí navazovat na slib reklamy.
- **Formulář se otevírá na místě:** pod lístky (výzva se ukáže po prvním otočení), nebo jako panel ze spodního tlačítka, nikdy odkazem dolů. Proč: méně kroků, návštěvník neztratí kontext.
- **Brokery na stránce jmenujeme jen s ověřenou dostupností** (zdroj a datum v `data/etf.json`). Proč: jeden jmenovaný broker by vypadal jako jeho reklama.
- **Správce osobních údajů na živém demu: Daniel Kuchválek** (kontakt@test.cz). Účel je jen ukázka do výběrového řízení, žádné e-maily se neposílají, kontakty se smažou nejpozději 31. 12. 2026. Proč: Clientelo o ukázce neví a data jsou na účtu autora, takže uvádět ho jako správce by nebyla pravda. Zásady na `public/ochrana-osobnich-udaju.html` platí pro demo a nemají žádná otevřená místa. Návrh souhlasu a zásad pro ostrou verzi pod Clientelem je v `docs/navrh-pro-clientelo.md`.
- **Text souhlasu a jeho verze jsou v `api/_lib.js` (`SOUHLAS`).** Verze se ukládá ke kontaktu (`leads.souhlas_verze`). Při změně textu změň i verzi.
- **Supabase projekt v EU regionu.** Proč: ukládáme e-maily českých návštěvníků a databáze má být blízko funkcím ve Frankfurtu.
- **Denní keep-alive přes Vercel cron.** Proč: bezplatný Supabase projekt se po čase bez aktivity pozastaví a hodnotitel může stránku otevřít až za dva týdny.
- **Vercel funkce v regionu `fra1` (Frankfurt).** Proč: kratší odezva pro české návštěvníky i k databázi v EU.

## Pravidla

### 1. Mobile-first a rychlost

Návštěvník přichází z reklamy na mobilu, často na mobilních datech. Každý kilobajt a každý request navíc stojí konverze.

- CSS piš od nejužšího displeje (360 px), širší layouty přidávej přes `min-width` media queries. Kontroluj na 360 px, ne na desktopu.
- Žádné frameworky, UI knihovny, knihovny na grafy ani animace. Každá nová závislost, i jediný skript z CDN, jen po mém souhlasu a se zdůvodněním, proč to bez ní nejde.
- JavaScriptu minimum: jen interaktivní prvky a odeslání formuláře. Obsah první obrazovky musí být vidět i bez JS.
- Žádné skripty třetích stran, ani měřicí (měříme vlastním řešením, viz Rozhodnutí).
- Obrázky: WebP nebo AVIF, v rozměru, v jakém se zobrazují, s `width` a `height` v HTML (žádné poskakování layoutu). Pod první obrazovkou `loading="lazy"`. Ikony jako inline SVG.
- Fonty: přednostně systémové. Webový font jen self-hostovaný WOFF2 se subsetem latin-ext (kvůli češtině), nejvýš 2 řezy, `font-display: swap`, hlavní řez přes `preload`.
- Cílové hodnoty (Lighthouse, mobilní režim): Performance ≥ 95, LCP < 2,5 s, CLS < 0,1. První načtení do 200 kB přenesených dat, z toho JS do 20 kB. Když je něco nad limitem, řekni to a navrhni, co ubrat.

### 2. Žádná vymyšlená data

Stránka mluví o penězích. Jedno vymyšlené číslo zničí důvěryhodnost celé stránky.

- Každý údaj o ETF (ticker, emitent, burza, TER, velikost fondu, výkonnost, počet titulů, dividendová politika…) musí mít zdroj (konkrétní URL, přednostně web emitenta) a datum, ke kterému platí. Zapisuj je do `data/`.
- Údaj, který nemáš ověřený z konkrétního zdroje, označ `TODO` a nech prázdný. Neodhaduj, nedoplňuj z paměti, nepiš „přibližně“.
- Na stránce je u dat vidět zdroj a datum.
- U výkonnosti vždy uveď období a měnu (USD, nebo CZK) a upozornění, že minulá výkonnost nezaručuje budoucí.
- Totéž platí pro čísla mimo ETF: benchmarky konverzí, ceny a limity služeb, kurzy, daně, regulace. Buď zdroj, nebo `TODO`. Kde zadání chce odhad (očekávaná konverze), označ ho jako odhad a ukaž, z čeho vychází.
- Když se zdroje rozcházejí, nevybírej mezi nimi a napiš mi oba údaje.

### 3. Klíče a osobní údaje

- URL a klíče k Supabase jsou jen v proměnných prostředí: na Vercelu v Environment Variables, lokálně v `.env.local` (je v `.gitignore`). Do repa patří jen `.env.example` s názvy proměnných bez hodnot.
- Secret klíč (`sb_secret_…`, role service_role) obchází RLS. Používá se výhradně v `api/` (proměnná `SUPABASE_SECRET_KEY`, posílá se v hlavičce `apikey`): nikdy v `public/`, nikdy v odpovědi API, nikdy v logu. Starý JWT klíč `service_role` Supabase do konce roku 2026 ruší, proto ho nepoužíváme.
- Prohlížeč se Supabase nemluví vůbec, data posílá jen na `/api/…`. Tabulka s kontakty má zapnuté RLS a žádné veřejné politiky.
- Serverless funkce validuje vstup sama (nespoléhá na validaci ve formuláři) a má ochranu proti botům, aspoň honeypot pole.
- Nikdy nevypisuj obsah `.env.local` ani hodnoty klíčů (`cat`, `echo`, logy). Výstup by skončil v exportu konverzace ve veřejném `ai-log/`.
- Před každým commitem projdi `git diff --cached`, jestli v něm není klíč, token nebo skutečný e-mail.

### 4. Texty

- Přirozená čeština, jakou by napsal člověk, který sám investuje a vysvětluje to kamarádovi. Krátké věty a krátké odstavce, čte se na mobilu za pár sekund.
- Žádné generické fráze typu „objevte svět investic“, „investujte chytře“, „vaše finanční budoucnost“, „odemkněte potenciál“, „v dnešní době“, „jednoduše a rychle“. Každá věta musí říct něco konkrétního: číslo, srovnání, co návštěvník získá.
- Odborné pojmy (ETF, TER) vysvětli při prvním výskytu jednou větou, nebo je nepoužívej.
- Neslibuj výnosy a nedávej investiční doporučení typu „kupte X“. Stránka srovnává a vysvětluje.
- Tykáme, přirozeně a bez podbízení.
- Tykání bez rodu: ve 2. osobě nepoužívej minulý čas ani tvary s rodem („hledal jsi“, „sám“, „připravený“). Piš přítomný čas a rozkazovací způsob („hledáš“, „vyber“). Text musí sedět na ženy i muže.
- Česká typografie: desetinná čárka (0,03 %), mezera mezi tisíci (10 000 Kč), nezlomitelná mezera mezi číslem a jednotkou a za jednopísmennými předložkami a spojkami (v, k, s, z, o, u, a, i), uvozovky „…“, pomlčka – s mezerami místo spojovníku.

### 5. Commity

- Po každém dokončeném kroku malý commit. Jeden commit = jedna logická změna.
- Zpráva česky a popisná: první řádek do ~70 znaků říká, co se změnilo (např. „Přidat kalkulačku poplatků pro tři ETF“), v těle případně proč.
- Přidávej konkrétní soubory (`git add <soubor>`), ne `git add -A`, ať se do commitu nedostane nic navíc.
- Necommituj nefunkční stav. Push jen na můj pokyn.
- Historie commitů je součást odevzdání. Nepřepisuj ji: žádný `rebase`, `--amend` ani force push u commitů, které už jsou na GitHubu.

### 6. Než řekneš „hotovo“

- Ověř to: spusť, otestuj, podívej se na výsledek. Pak mi napiš, jak: jaký příkaz nebo postup a co vyšlo.
- Co ověřit podle typu změny:
  - stránka: spustit lokálně, projít na šířce 360 px, konzole bez chyb
  - rychlost: Lighthouse v mobilním režimu proti cílovým hodnotám z bodu 1
  - formulář: odeslat testovací kontakt a dohledat řádek v Supabase; zkusit chybné vstupy a nedostupnou databázi
  - měření: každá událost z cesty návštěvníka opravdu dorazí
  - data: každá hodnota na stránce má zdroj a datum v `data/`
- Co ověřit nejde (chybí přístup, nástroj…), napiš rovnou a neoznačuj to za hotové.

### 7. Nejasnosti a rozhodnutí

- Když v zadání nebo v pokynech narazíš na nejasnost, neodhaduj a zeptej se.
- Rozhodnutí i se zdůvodněním zapisuj průběžně do README: technická do sekce „Technická rozhodnutí“, výklad zadání do „Nejasnosti v zadání a moje rozhodnutí“.

### 8. AI log

- Exporty konverzací (`/export`) patří do `ai-log/`, pojmenované `RRRR-MM-DD-NN-tema.txt`. Před commitem je zkontroluj na klíče a osobní údaje.
- Export nezachytí celý průběh práce subagentů. Proto do `ai-log/denik.md` průběžně zapisuj, jaké zadání agent dostal, jak proběhla kontrola jeho výstupu a kde se AI spletla. Z toho vznikne sekce README „Jak jsem pracoval s AI“.
