# Dva směry designu

Oba jsou mobile-first a lehké: barvy a vzory čistě v CSS, žádné fotky, nejvýš jedno webové písmo. Oba se vyhýbají tomu, podle čeho se pozná výchozí výstup AI:

- fialovomodré přechody a „skleněné“ karty,
- emoji jako ikony,
- fotky usměvavých lidí s telefonem,
- tři stejné karty s ikonou a centrovaný úvod v písmu Inter.

Vybraný směr převezmou i obrázky reklam.

## A: Odjezdová tabule

**Nápad:** dvojče jako přestup. Stránka vypadá jako nádražní tabule odjezdů: „VOO → VUAA“ se čte jako spoj, burza jako nástupiště.

- **Barvy:**
  - pozadí téměř černé `#121212`,
  - text teplá bílá `#F1EDE4`,
  - akcent tlumená jantarová `#FFB000`, jen pro tickery a čísla poplatků,
  - doplňková šedá `#8A8578`,
  - „stejný index“ jantarový rámeček, „podobný“ šedý.
- **Písmo:**
  - tickery a čísla v systémovém neproporcionálním písmu (`ui-monospace, SFMono-Regular, Menlo, Consolas`), 0 kB,
  - nadpisy v úzkém tučném grotesku, např. Barlow Condensed (self-hostovaný WOFF2). `[TODO]` ověřit češtinu a velikost souboru,
  - běžný text v `system-ui`.
- **Prvky:**
  - výběr ETF jako řádky tabule (ticker vlevo, popis vpravo),
  - výsledek jako „přestup“ s krátkým překlopením znaků, vypnutým při `prefers-reduced-motion`,
  - karty 7 párů jako jízdní řád.
- **Dojem:** věcný nástroj pro lidi, kteří už ví, co hledají. Sedí na reklamu A.
- **Riziko:** tmavé finanční stránky snadno připomínají krypto. Proto jen jedna tlumená barva, žádné záře ani neon.

## B: Tahák v sešitě

**Nápad:** stránka jako školní tahák, a lead magnet se tak i jmenuje. Kamarád ti to nakreslil na papír: čtverečkovaný sešit, modrá propiska, zvýrazňovač.

- **Barvy:**
  - papír `#FFFDF5` s jemnou čtverečkovanou mřížkou `#E4E9F2` (CSS gradient, 0 kB),
  - text `#1A1A1A`,
  - modrá propiska `#1E3FA8` pro šipky, popisky a odkazy,
  - zvýrazňovač `#FFE45C` pod čísly poplatků,
  - červená korektura `#D7263D` jen na přeškrtnuté „VOO“.
- **Písmo:**
  - `system-ui` na text, nadpisy tučně,
  - pokud chceme výraznější nadpisy, jeden řez Archivo ExtraBold (WOFF2). `[TODO]` ověřit češtinu,
  - ručně psané poznámky (šipky, zakroužkování) jako inline SVG, ne rukopisným písmem: to bývá těžké a často bez české diakritiky.
- **Prvky:**
  - výsledek jako kartička taháku: červeně přeškrtnuté VOO, modrá šipka, VUAA podtržené zvýrazňovačem,
  - karty 7 párů jako řádky v sešitě,
  - tlačítko dole jako přilepený papírek.
- **Dojem:** přátelský a srozumitelný, ubírá strach, že člověk něco pokazí. Světlé pozadí se dobře čte i venku na slunci. Sedí na obě reklamy, víc na B.
- **Riziko:** může působit dětsky. Proto tabulky a čísla zůstávají čisté a přesné, žádné kliparty ani komiksové písmo.

## Doporučení

**B.** Navazuje na název taháku, vychází z české školní zkušenosti (tahák zná každý), zvýrazňovač přirozeně táhne oko k poplatkům a světlé pozadí je bezpečnější pro důvěru u začátečníků. A je originálnější, ale užší: sedí hlavně na lidi, kteří už VOO znají.

## Vybráno: B „Tahák v sešitě“ (10. 10. 2026)

U peněz to nesmí působit dětsky. Hravé jsou jen ozdoby, čísla, zdroje a upozornění zůstávají rovné a čisté.

**Po testu na iPhonu (první verze působila „jako od AI“) byl směr zpřísněn:**

- **Barvy:**
  - modrá zmizela úplně,
  - inkoustově černá `#141414` pro text, okraje a hlavní tlačítka,
  - papír `#FFFDF5` s jemnou mřížkou,
  - žlutý fix `#FFE45C`,
  - zelená fajfka `#177A41`,
  - červená `#C62F3B` jen na přeškrtnutí originálu.
- **Žlutý fix** je hlavní prvek:
  - nepravidelný tah (inline SVG) přes klíčová slova v nadpisech a přes „koupíš u …“ na kartách párů,
  - nikdy přes poplatek, aby oko jako první nevidělo „dvojče je dražší“.
- **Lístky z taháku** místo tlačítek výběru:
  - pootočené nejvýš o 1,5°, páska jen u každého druhého,
  - klepnutí lístek otočí (CSS 3D, 0,45 s),
  - vzadu je dvojče v ručně kresleném kroužku, zelená „✓ kde koupit“, poplatek v Kč a štítek stejný/podobný index,
  - při `prefers-reduced-motion` se lístek neotáčí, jen se vymění obsah.
- **Ručně kreslené prvky:** šipka, kroužek, fajfka. Všechno malá inline SVG, žádné písmo navíc.
- **Tlačítka:** hlavní černá, spodní lišta žlutá.
- **Formulář:** nad formulářem je náhled titulní strany taháku, pootočený o 1,5° a dole rozmazaný. Generuje se z PDF.
- **Písmo:** jen systémové, bez rukopisných a komiksových písem.
- **Čísla:** `font-variant-numeric: tabular-nums`, vždy s jednotkou, poplatky lidsky („7 Kč ročně z 10 000 Kč“).
- **Klid:**
  - hodně místa,
  - jedna hlavní akce na obrazovce,
  - animace krátké a vypnuté při `prefers-reduced-motion`.
