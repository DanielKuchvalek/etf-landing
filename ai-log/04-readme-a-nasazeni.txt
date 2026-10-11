
⏺ Hotovo. Design je předělaný podle plánu i s oběma tvými úpravami, ve 7
  commitech.

  Co je hotové

  - Absolutní tvrzení:
    - Stránka, reklamy i PDF už měly všude „často“.
    - Absolutní formulace zbyly jen v dokumentaci (README, data/README.md,
      CLAUDE.md, jeden nadpis v texty.md), opravil jsem je.
    - Věta v PDF „když ti broker americké ETF nenabídne“ je podmínka, ne
      tvrzení, tu jsem nechal.
    - Podnadpis je teď tvůj: „Americká ti broker často nenabídne, evropská ano.“
  - Úvod ve všech třech verzích má slova přetažená fixem a jednovětý podnadpis:
    - výchozí: fix na „dvojče“,
    - ?v=dvojce: fix na „Není to chyba.“, podnadpis „Tady je jeho evropské
      dvojče a 6 dalších.“,
    - ?v=zacatek: fix na „začít“, podnadpis „7 známých fondů z USA a co v nich
      je.“ a pod ním poznámka, že nic nedoporučujeme.
  - Lístky:
    - pootočené nejvýš o 1,5°, páska jen u každého druhého a v tlumené barvě,
    - po klepnutí se otočí a ukážou dvojče v kroužku, zelenou fajfku s brokery,
      poplatek v Kč a štítek „stejný / podobný index“,
    - otočení se měří (otoceni_listku), stejně jako zobrazení výzvy
      (vyzva_zobrazena),
    - po prvním otočení se pod lístky objeví výzva k taháku.
  - Karty párů mají žlutě zvýrazněné „✓ koupíš u …“. Poplatek je bez zvýraznění
    v Kč, spočítaný z TER v etf.json.
  - Náhled taháku u formuláře generuje node scripts/pdf.mjs z PDF (WebP, 24 kB,
    načte se až u formuláře).
  - Modrá zmizela úplně. Hlavní tlačítka jsou černá, spodní lišta žlutá.

  Jedna moje úprava navíc: spodní lišta se teď ukáže až ve chvíli, kdy lístky
  zmizí z obrazovky. Test ukázal, že po prvním otočení překrývala třetí řadu
  lístků a klepnutí na SDY a VGT trefilo lištu. Výzva je stejně hned pod lístky.

  Výsledky

  - Lighthouse (mobil, lokálně): 100 ve všech čtyřech kategoriích u výchozí
    verze, ?v=dvojce i ?v=zacatek. LCP 1,0 s, CLS 0, TBT 0–10 ms. Stránka má po
    gzipu 13,6 kB, z toho JS 3,8 kB, plus náhled 24 kB.
  - Test stránky: 75 z 75 kontrol prošlo. Nově kontroluje otočení všech lístků i
    zpět, pootočení nejvýš 2°, prefers-reduced-motion, náhled taháku a měření.
  - Kontrola stránky proti datům (rozšířená o lístky a karty) prošla. Že opravdu
    chytá chyby, jsem ověřil dvěma podvrženými chybami. Kontroly dat a PDF také
    prošly.
  - Snímky „po“ jsou v docs/screenshots/po-*.png: úvod ve všech třech verzích,
    otočený lístek, karty párů, formulář s náhledem a poděkování. V README je
    tabulka před a po.

  Na co se podívej na iPhonu

  - Otáčení lístků v Safari. Testoval jsem jen v Chrome a 3D otočení se v Safari
    občas chová jinak (prosvítá zadní strana, bliká).
  - Podnadpis „Americká ti broker často nenabídne, evropská ano.“ se na šířce
    375 px zalomí do dvou řádků. Na jeden řádek by se vešel jen s písmem menším
    než 15 px. Pokud vadí, můžu ho zkrátit, třeba na „Americká ti broker často
    nenabídne.“

  Stránku si pustíš stejně jako minule: HOST=0.0.0.0 ./scripts/serve.sh a na
  telefonu http://<IP Macu>:8737.

❯ /compact
  ⎿  Compacted PreCompact [node "${CLAUDE_PLUGIN_ROOT}/hooks/precompact.mjs"]
     completed successfully: {}
  ⎿  Read design.md (88 lines)
  ⎿  Read scripts/screenshots.mjs (53 lines)
  ⎿  Read ../../../private/tmp/claude-501/-Users-daniel-etfLanding/65a1b1d0-4c48
     -4b63-b5fe-0203afe326c3/scratchpad/tools/look.mjs (34 lines)
  ⎿  Referenced file public/index.html
  ⎿  Read scripts/pdf.mjs (62 lines)

⏺ Task "Start local static server for the page" still running in background
  ⎿  Skills restored (anthropic-skills:mobile-native)

⏺ Background shell command didn't finish before the previous session ended

❯ Ahoj, navazujeme. Přečti si nejdřív CLAUDE.md, README.md a ai-log/denik.md,
  ať víš, kde jsme.

  Stránku jsem testoval na skutečném iPhonu v Safari. Design je o hodně lepší a
  lístky fungují dobře. Ale našel jsem chyby, které se v Chromu neukázaly, a
  chci teď stránku dotáhnout tak, aby se na ni dala opravdu zítra pustit
  reklama. Pořadí je podle důležitosti.

  1) FORMULÁŘ NA IPHONU (nejdůležitější, tady se rozhoduje o konverzi)
  Když v panelu ze spodní lišty klepnu do pole na e-mail a otevře se
  klávesnice:
  - panel odskočí nahoru a jeho nadpis zajede pod horní lištu telefonu,
  - pole na e-mail zmizí pod klávesnicí a lištou nad ní, takže nevidím, co
  píšu,
  - pod panelem prosvítá obsah stránky a vypadá to rozbitě.
  Nejdřív mi napiš, co je podle tebe příčina (pozice fixed, visualViewport,
  výška 100vh, scroll na pozadí...), a teprve pak to oprav. Chci, aby po
  klepnutí do pole bylo vždycky vidět: nadpis panelu, pole s tím, co píšu,
  souhlas a tlačítko odeslat, nebo aspoň pole a tlačítko, když se všechno
  nevejde. Pozadí se pod otevřeným panelem nesmí posouvat. Zavření panelu vrátí
  stránku tam, kde byla. Totéž zkontroluj u formuláře otevřeného na místě pod
  výsledkem.
  Testuj to v enginu WebKit (Playwright s emulací iPhonu, třeba iPhone 13 a
  iPhone SE), ne jen v Chromu, a nasimuluj zmenšení viewportu klávesnicí. Do
  README napiš, co jde otestovat automaticky a co jen na reálném telefonu.

  2) STAŽENÍ PDF
  V logu serveru mám při mém testu "GET /tahak.pdf" s odpovědí 404 (10. 10. ve
  12:07:02, HEAD těsně předtím vrátil 200). Zjisti proč. Jestli to bylo tím, že
  se PDF zrovna přegenerovávalo, napiš to, a zajisti, aby generování nejdřív
  zapsalo dočasný soubor a pak ho přejmenovalo. Ověř taky, jak se stažení chová
  v Safari na iPhonu (atribut download tam nefunguje, PDF se otevře v
  prohlížeči) a podle toho uprav text v poděkování, ať neslibuje něco, co se
  nestane.

  3) PODĚKOVÁNÍ PO ODESLÁNÍ
  Teď je trochu prázdné. Udělej z něj chvíli, která má hodnotu:
  - jasné tlačítko "Otevřít tahák" (ne jen odkaz v textu),
  - jedna věta, co udělat jako první krok,
  - možnost poslat stránku kamarádovi přes nativní sdílení (Web Share API, s
  náhradou kopírováním odkazu), protože každé sdílení je další potenciální
  kontakt. Sdílení měř jako událost.

  4) ZÁSADY OCHRANY OSOBNÍCH ÚDAJŮ
  Je tam moc žlutých TODO a hodnotitel to uvidí. IČO a sídlo Clientelo Czech
  s.r.o. jsou veřejné, doplň je z ARES nebo z obchodního rejstříku i se
  zdrojem. Region Supabase bude EU Frankfurt (eu-central-1), ten doplň taky. Co
  opravdu nevíme (kontaktní e-mail, e-mailová služba, otázky pro právníka),
  nech na stránce jako nenápadné "doplní správce", ne jako svítivé žluté bloky,
  a všechny tyhle otevřené body sepiš do README do sekce "Před spuštěním
  kampaně".

  5) DROBNOSTI
  - favicon (teď 404) a obrázek pro náhled při sdílení (og:image, 1200×630, ve
  stylu stránky, generovaný skriptem),
  - nastav color-scheme light, ať iOS v tmavém režimu nic nepřebarví,
  - panel s formulářem: zaměření klávesnicí, zavření klávesou Esc, aria-modal a
  po zavření vrácení fokusu na tlačítko, které ho otevřelo,
  - zkontroluj šířku 320 px (iPhone SE první generace), ať tam nic nepřetéká.

  6) PŘÍPRAVA NA SUPABASE A VERCEL
  Projekty založím, až budeš hotový s body 1–5. Mezitím připrav všechno, aby
  stačilo jen zadat klíče:
  - supabase/schema.sql: tabulka leads (e-mail, souhlas, čas souhlasu, varianta
  reklamy z ?v=, nic víc) a tabulka events (ID návštěvy, název události,
  varianta, čas, bez e-mailu), s Row Level Security, aby anonymní klíč nemohl
  nic číst,
  - supabase/funnel.sql: dotaz nebo view na trychtýř po krocích (příchod →
  otočení lístku → otevření formuláře → odeslání) zvlášť pro každou variantu,
  - api/lead.js a api/event.js s validací, honeypotem a omezením velikosti
  požadavku, zápis service klíčem jen na serveru,
  - vercel.json (výstupní složka public, region fra1, denní cron proti uspání
  Supabase),
  - návod v README krok za krokem, co mám naklikat v Supabase a ve Vercelu,
  včetně názvů proměnných prostředí.
  Napiš testy na funkce s podvrženou databází, ať je ověříš i bez skutečných
  klíčů.

  Po každém bodu commit. Na konci pusť všechny testy, Lighthouse na mobil a
  udělej nové snímky do docs/screenshots/, hlavně panel s otevřenou klávesnicí
  ve WebKitu. Pak mi napiš:
  - co přesně bylo příčinou chyby s klávesnicí a co jsi změnil,
  - co jsi ověřil automaticky, a co musím na iPhonu zkontrolovat já (konkrétní
  seznam kroků),
  - jestli se něco z toho nepodařilo nebo by šlo udělat líp.

⏺ Začnu tím, že si přečtu README, deník a současný stav kódu formuláře a panelu.

  Read 3 files, ran 1 shell command (ctrl+o to expand)

⏺ Přečteno. Než začnu opravovat, podívám se na log serveru kvůli 404 a na
  testovací skripty.

  Ran 1 shell command (ctrl+o to expand)

⏺ Log z mé strany neexistuje, takže čas 12:07:02 porovnám s tím, co jsem v tu
  chvíli dělal (záznam konverzace má časová razítka).

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ V 12:07:02 jsem nic nedělal, poslední příkaz skončil v 12:03:24, takže to
  nebylo přegenerování PDF. Teď zjistím, který server naslouchal na portu 8000.

  Ran 1 shell command (ctrl+o to expand)

⏺ PHP na portu 8000 je jiný projekt (Sportlyzer), běží od dnešního rána. Telefon
  tedy musel jít přes serve.sh (Python, port 8737). Zjistím, kdy se PDF
  naposledy měnilo nebo přepisovalo.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ PDF se naposledy zapsalo v 11:45:31, tedy 22 minut před chybou, takže
  přegenerování to nebylo. Zkusím chybu zopakovat ve WebKitu. Nejdřív
  nainstaluji Playwright, který jsi pro WebKit chtěl.

  Ran 1 shell command (ctrl+o to expand)

⏺ Použiju Playwright 1.63.0 (z 4. 9.). Verze 1.64.0 vyšla teprve před 4 dny.
  WebKit stáhnu do scripts/node_modules, aby nic neleželo mimo repo.

⏺ Bash(npm install --no-audit --no-fund --save-dev --save-exact
      playwright@1.63.0 2>&1 | tail -2 && PLAYWRIGHT_BROWSERS_PATH=0 npx
      playwright install webkit 2>&1 | tai…)
  ⎿  Updated scripts/package-lock.json (+30 -0)
       7        "name": "etf-dvojcata-scripts",
       8        "devDependencies": {
       9          "lighthouse": "13.5.0",
      10 +        "playwright": "1.63.0",                                
      11          "puppeteer-core": "25.13.0"
      12        }
      13      },
     ...
      1125          "url": "https://github.com/sponsors/sindresorhus"
      1126        }
      1127      },
      1128 +    "node_modules/playwright": {                             
      1129 +      "version": "1.63.0",                                   
      1130 +      "resolved": "https://registry.npmjs.org/playwright/-/pl
           +aywright-1.63.0.tgz",                                        
      1131 +      "integrity": "sha512-+7ziBLidS4NaNCdt57SUDT+wYmmd5fmiQe
           +jUic/kb+YsYSCPyOOE9sebzMjNmQrsnNpDJqd4WHvV/8lfKfUDUg==",     
      1132 +      "dev": true,                                           
      1133 +      "license": "Apache-2.0",                               
      1134 +      "dependencies": {                                      
      1135 +        "playwright-core": "1.63.0"                          
      1136 +      },                                                     
      1137 +      "bin": {                                               
      1138 +        "playwright": "cli.js"                               
      1139 +      },                                                     
      1140 +      "engines": {                                           
      1141 +        "node": ">=20"                                       
      1142 +      }                                                      
      1143 +    },                                                       
      1144 +    "node_modules/playwright-core": {                        
      1145 +      "version": "1.63.0",                                   
      1146 +      "resolved": "https://registry.npmjs.org/playwright-core
           +/-/playwright-core-1.63.0.tgz",                              
      1147 +      "integrity": "sha512-rYCsBF/M5HjUch52bbtVONEFjv6Xu8sm8h
           +72dNlR5bzIE1fvC/bxgspzkjSfU+MweEMmPM8KJebG6nnyxo5mCg==",     
      1148 +      "dev": true,                                           
      1149 +      "license": "Apache-2.0",                               
      1150 +      "bin": {                                               
      1151 +        "playwright-core": "cli.js"                          
      1152 +      },                                                     
      1153 +      "engines": {                                           
      1154 +        "node": ">=20"                                       
      1155 +      }                                                      
      1156 +    },                                                       
      1157      "node_modules/puppeteer-core": {
     … 2 more lines (ctrl+o to expand)
  ⎿  Updated scripts/package.json (+1 -0)
      11    },
      12    "devDependencies": {
      13      "lighthouse": "13.5.0",
      14 +    "playwright": "1.63.0",                                    
      15      "puppeteer-core": "25.13.0"
      16    }
      17  }
  ⎿  (timeout 10m)

  Ran 1 shell command (ctrl+o to expand)

⏺ WebKit běží. Pustím lokální server a ve WebKitu změřím současný panel s
  nasimulovanou klávesnicí, ať diagnóza nestojí jen na teorii.

  Made 1 scratchpad edit +33, called plugin:context-mode:context-mode, ran 1 shell command (ctrl+o to expand)

⏺ Diagnóza ve WebKitu (iPhone 13, klávesnice nasimulovaná podle modelu iOS)
  potvrzuje, co jsem čekal. Než začnu opravovat, tady je příčina:

  Příčina chyby s klávesnicí v panelu

  1. iOS při otevření klávesnice nezmenší layout viewport, zmenší jen visual
     viewport.
     - Panel je position: fixed (modální <dialog>) přilepený ke spodku layout
       viewportu, takže jeho spodní část zůstane pod klávesnicí.
     - Ve WebKitu na iPhonu 13 zabírá panel výšku 245–664 px. Pole na e-mail je
       na 411 px, tlačítko na 556–608 px, ale s klávesnicí je vidět jen zhruba
       horních 330 px.
     - interactive-widget=resizes-content v meta viewport funguje jen v Chromu
       na Androidu. 92dvh reaguje na lišty Safari, ne na klávesnici.
  2. Aby bylo pole vidět, iOS posune visual viewport a stránku. Pevný panel i
     jeho ztmavené pozadí se posunou s ním:
     - nadpis vyjede nad viditelnou oblast pod horní lištu,
     - pod panelem se objeví pruh stránky,
     - overflow: hidden na <html> tohle posouvání v iOS nezastaví.
  3. JS dává fokus do pole hned po showModal(), kdy ještě běží animace vyjetí
     panelu. WebKit test to potvrdil: v okamžiku fokusu animace běží. Když se
     klávesnice otevře hned, iOS počítá posun z pozice, kde panel ještě nedojel,
     a pole pak skončí pod klávesnicí.
  4. Pozadí není zamčené. iOS ho může posunout prstem i automaticky k poli,
     takže po zavření panelu je stránka jinde, než byla.

  Co změním

  - Pozadí zamknu přes body { position: fixed; top: -scrollY }. Dokument pak
    nejde posunout vůbec a po zavření panelu vrátím přesnou pozici.
  - Panel budu umisťovat podle visualViewport: spodek panelu sedí na horní hraně
    klávesnice a výška je nejvýš viditelná výška. S otevřenou klávesnicí se
    panel zhustí a posune svůj obsah tak, aby bylo vidět pole i tlačítko (a
    nadpis, když se vejde).
  - Na dotykových zařízeních nebudu dávat fokus do pole automaticky, fokus půjde
    na nadpis panelu.
  - Formuláře na místě po otevření klávesnice posunou stránku tak, aby pole i
    tlačítko byly nad klávesnicí. Spodní lišta se schová, kdykoli je ve
    formuláři fokus.

  Teď to implementuji.

  Read 1 file, ran 1 shell command (ctrl+o to expand)

⏺ Diagnóza je hotová, pustím se do opravy: CSS panelu, zamčení pozadí a
  umisťování podle visualViewport.

⏺ Update(public/index.html)
  ⎿  Added 11 lines, removed 2 lines
      134  .bar{position:fixed;right:0;bottom:0;left:0;z-index:10;padding
           :10px 16px calc(10px + env(safe-area-inset-bottom,0px));border
           -top:1.5px solid var(--ink);background:var(--card);animation:u
           p .2s var(--ease)}
      135  .bar-in{display:flex;align-items:center;gap:12px;max-width:40r
           em;margin:0 auto}
      136  .bar p{flex:1;margin:0;font-size:.9375rem;font-weight:700;line
           -height:1.25}
      137 -dialog.sheet{width:100%;max-width:40rem;max-height:92vh;max-he
          -ight:92dvh;margin:auto auto 0;padding:0;border:0;border-top:2p
          -x solid var(--ink);border-radius:14px 14px 0 0;background:var(
          ---card);color:var(--ink);overscroll-behavior:contain}         
      137 +/* Panel: výšku a odsazení zespodu nastavuje JS podle visualVi
          +ewport (iOS při klávesnici nezmenší layout viewport).         
      138 +   Pozadí se zamyká přes body.zamceno, overflow:hidden na html
          + iOS nestačí. */                                              
      139 +body.zamceno{position:fixed;right:0;left:0;width:100%}        
      140 +dialog.sheet{width:100%;max-width:40rem;max-height:92vh;max-he
          +ight:92dvh;margin:auto auto 0;padding:0;border:0;border-top:2p
          +x solid var(--ink);border-radius:14px 14px 0 0;background:var(
          +--card);color:var(--ink);overflow-y:auto;overscroll-behavior:c
          +ontain}                                                       
      141  dialog.sheet[open]{animation:up .22s var(--ease)}
      139 -dialog.sheet::backdrop{background:rgb(20 20 20 / .45)}        
      142 +dialog.sheet::backdrop{background:rgb(20 20 20 / .55)}        
      143  .sheet-in{position:relative;padding:20px 16px calc(20px + env(
           safe-area-inset-bottom,0px))}
      144  .sheet-in h2{font-size:1.25rem;padding-right:40px}
      145 +.sheet-in h2:focus{outline:none}                              
      146  .sheet-close{position:absolute;top:6px;right:6px;width:44px;he
           ight:44px;border:0;background:none;color:var(--ink);font-size:
           1.75rem;line-height:1;cursor:pointer;touch-action:manipulation
           }
      147 +/* otevřená klávesnice: panel se zhustí, aby se nad klávesnici
          + vešlo pole, souhlas i tlačítko */                            
      148 +dialog.sheet.kb .sheet-in{padding-block:12px}                 
      149 +dialog.sheet.kb h2{font-size:1.0625rem;margin-bottom:.2em}    
      150 +dialog.sheet.kb [data-host]>.small,dialog.sheet.kb .lead-form>
          +.small{display:none}                                          
      151 +dialog.sheet.kb .lead-form{gap:10px;margin-top:8px}           
      152  @keyframes up{from{transform:translateY(100%)}}
      153  /* patička */
      154  .foot{padding-block:48px 120px;font-size:.8125rem;color:var(--
           ink-2)}

⏺ Update(public/index.html)  ⎿  Added 1 line, removed 1 line
      432    <div class="sheet-in">
      433      <button class="sheet-close" type="button" aria-label="Zavř
           ít" data-zavri>×</button>
      434      <div data-host>
      435 -    <h2 id="panel-nadpis">Tahák: 7&nbsp;ETF z&nbsp;NYSE a&nbsp
          -;jejich dvojčata, která koupíš z&nbsp;Česka</h2>              
      435 +    <h2 id="panel-nadpis" tabindex="-1">Tahák: 7&nbsp;ETF z&nb
          +sp;NYSE a&nbsp;jejich dvojčata, která koupíš z&nbsp;Česka</h2>
      436      <p class="small">ISINy, poplatky a&nbsp;postup nákupu krok
            za krokem. PDF hned a&nbsp;zdarma.</p>
      437      <div class="form-slot" data-slot="lista"></div>
      438      </div>

⏺ Teď JS: lišta, umístění panelu, zamčení pozadí a viditelnost pole nad
  klávesnicí.

⏺ Update(public/index.html)
  ⎿  Added 2 lines, removed 1 line
      502    var dialog = doc.getElementById('panel');
      503    var heroOut = false;
      504    var done = false;
      505 +  var typing = false;                                         
      506    var blockers = new Set();
      507    function updateBar() {
      507 -    bar.hidden = !(!done && heroOut && blockers.size === 0 && 
          -!dialog.open);                                                
      508 +    bar.hidden = !(!done && heroOut && blockers.size === 0 && 
          +!dialog.open && !typing);                                     
      509    }
      510    if ('IntersectionObserver' in window) {
      511      new IntersectionObserver(function (en) {

⏺ Update(public/index.html)
  ⎿  Added 87 lines, removed 4 lines
      627      form.elements.email.focus();
      628    });
      629  
      630 -  function openSheet(zdroj) {                                 
      630 +  /* Klávesnice na iPhonu: iOS nezmenší layout viewport, jen v
          +isual viewport. Pevně umístěný panel                          
      631 +     by zůstal pod klávesnicí a iOS by kvůli poli posouval str
          +ánku i panel. Proto:                                          
      632 +     - pozadí zamkneme přes position: fixed (dokument pak nejd
          +e posunout) a po zavření vrátíme pozici,                      
      633 +     - spodek panelu posadíme na horní hranu klávesnice a výšk
          +u omezíme na viditelnou část,                                 
      634 +     - po otevření klávesnice posuneme panel nebo stránku tak,
          + aby bylo vidět pole i tlačítko. */                           
      635 +  var vv = window.visualViewport;                             
      636 +  var coarse = window.matchMedia('(pointer: coarse)').matches;
      637 +  var baseH = vv ? vv.height : window.innerHeight;            
      638 +  var lockY = 0;                                              
      639 +  var opener = null;                                          
      640 +  function isTextField(el) { return !!el && el.tagName === 'IN
          +PUT' && el.type !== 'checkbox'; }                             
      641 +  function keyboardOpen() { return !!vv && isTextField(doc.act
          +iveElement) && vv.height < baseH - 120; }                     
      642 +  function jumpBy(dy) {                                       
      643 +    var html = doc.documentElement;                           
      644 +    html.style.scrollBehavior = 'auto';                       
      645 +    window.scrollBy(0, dy);                                   
      646 +    html.style.scrollBehavior = '';                           
      647 +  }                                                           
      648 +  function lockPage() {                                       
      649 +    lockY = window.scrollY;                                   
      650 +    doc.body.style.top = -lockY + 'px';                       
      651 +    doc.body.classList.add('zamceno');                        
      652 +  }                                                           
      653 +  function unlockPage() {                                     
      654 +    doc.body.classList.remove('zamceno');                     
      655 +    doc.body.style.top = '';                                  
      656 +    jumpBy(lockY - window.scrollY);                           
      657 +  }                                                           
      658 +  function fitSheet() {                                       
      659 +    if (!dialog.open) return;                                 
      660 +    var s = dialog.style;                                     
      661 +    var kb = keyboardOpen();                                  
      662 +    dialog.classList.toggle('kb', kb);                        
      663 +    if (!vv || Math.abs(vv.scale - 1) > 0.01) { s.marginBottom
          + = s.maxHeight = ''; return; }                                
      664 +    s.marginBottom = Math.max(0, window.innerHeight - vv.heigh
          +t - vv.offsetTop) + 'px';                                     
      665 +    s.maxHeight = Math.round(kb ? vv.height - 8 : vv.height * 
          +0.92) + 'px';                                                 
      666 +  }                                                           
      667 +  /* Pole s fokusem a tlačítko odeslat mají být nad klávesnicí
          +; když se nevejdou obě, má přednost pole. */                  
      668 +  function keepFormVisible() {                                
      669 +    var a = doc.activeElement;                                
      670 +    var form = a && a.closest && a.closest('.lead-form');     
      671 +    if (!form || !keyboardOpen()) return;                     
      672 +    var field = (a.closest('.field, .consent') || a).getBoundi
          +ngClientRect();                                               
      673 +    var btn = form.querySelector('[type=submit]').getBoundingC
          +lientRect();                                                  
      674 +    var inSheet = dialog.contains(form);                      
      675 +    var viewTop = inSheet ? dialog.getBoundingClientRect().top
          + : vv.offsetTop;                                              
      676 +    var viewH = inSheet ? dialog.clientHeight : vv.height;    
      677 +    var need = btn.bottom + 12 - (viewTop + viewH);           
      678 +    var room = field.top - 8 - viewTop;                       
      679 +    var dy = need > 0 ? Math.min(need, room) : Math.min(0, roo
          +m);                                                           
      680 +    if (Math.abs(dy) < 1) return;                             
      681 +    if (inSheet) dialog.scrollTop += dy; else jumpBy(dy);     
      682 +  }                                                           
      683 +  if (vv) {                                                   
      684 +    vv.addEventListener('resize', function () {               
      685 +      if (!isTextField(doc.activeElement)) baseH = vv.height; 
      686 +      fitSheet();                                             
      687 +      requestAnimationFrame(keepFormVisible);                 
      688 +    });                                                       
      689 +    vv.addEventListener('scroll', fitSheet);                  
      690 +  }                                                           
      691 +  doc.addEventListener('focusin', function (e) {              
      692 +    typing = isTextField(e.target);                           
      693 +    updateBar();                                              
      694 +    fitSheet();                                               
      695 +    if (keyboardOpen()) requestAnimationFrame(keepFormVisible)
          +;                                                             
      696 +  });                                                         
      697 +  doc.addEventListener('focusout', function () {              
      698 +    setTimeout(function () { typing = isTextField(doc.activeEl
          +ement); updateBar(); fitSheet(); }, 0);                       
      699 +  });                                                         
      700 +                                                              
      701 +  function openSheet(zdroj, el) {                             
      702      track('cta', { zdroj: zdroj });
      703      if (done) return;
      704      if (typeof dialog.showModal !== 'function') {
     ...
      706        return;
      707      }
      708      var form = mount('lista', zdroj);
      709 +    opener = el;                                              
      710 +    lockPage();                                               
      711      dialog.showModal();
      712 +    dialog.scrollTop = 0;                                     
      713 +    fitSheet();                                               
      714      updateBar();
      715      track('formular_otevren', { zdroj: zdroj });
      641 -    form.elements.email.focus();                              
      716 +    // Na dotykovém displeji fokus na nadpis: klávesnice nevys
          +kočí během animace panelu. S myší rovnou do pole.             
      717 +    (coarse ? dialog.querySelector('h2') || form.elements.emai
          +l : form.elements.email).focus({ preventScroll: true });      
      718    }
      719    doc.querySelectorAll('[data-otevri="lista"], [data-otevri="k
           arty"]').forEach(function (el) {
      644 -    el.addEventListener('click', function (e) { e.preventDefau
          -lt(); openSheet(el.getAttribute('data-otevri')); });          
      720 +    el.addEventListener('click', function (e) { e.preventDefau
          +lt(); openSheet(el.getAttribute('data-otevri'), el); });      
      721    });
      722    dialog.querySelector('[data-zavri]').addEventListener('click
           ', function () { dialog.close(); });
      723    dialog.addEventListener('click', function (e) { if (e.target
            === dialog) dialog.close(); });
      648 -  dialog.addEventListener('close', updateBar);                
      724 +  dialog.addEventListener('close', function () {              
      725 +    dialog.classList.remove('kb');                            
      726 +    dialog.style.marginBottom = dialog.style.maxHeight = '';  
      727 +    unlockPage();                                             
      728 +    updateBar();                                              
      729 +    if (opener && opener.getClientRects().length) opener.focus
          +({ preventScroll: true });                                    
      730 +    opener = null;                                            
      731 +  });                                                         
      732  
      733    /* Po odeslání: poděkování nahradí celý blok s formulářem a 
           stáhne se PDF. */
      734    function finish(submitted) {

⏺ Zúžím pravidlo pro zhuštění layoutu při otevřené klávesnici tak, aby platilo
  pro každý formulář, ne jen pro panel – na 320 px se jinak nevejdou pole,
  souhlas a tlačítko. Popisek pole skryji jen vizuálně, aby ho čtečka obrazovky
  stále přečetla.

⏺ Update(public/index.html)
  ⎿  Added 7 lines, removed 3 lines
      144  .sheet-in h2{font-size:1.25rem;padding-right:40px}
      145  .sheet-in h2:focus{outline:none}
      146  .sheet-close{position:absolute;top:6px;right:6px;width:44px;he
           ight:44px;border:0;background:none;color:var(--ink);font-size:
           1.75rem;line-height:1;cursor:pointer;touch-action:manipulation
           }
      147 -/* otevřená klávesnice: panel se zhustí, aby se nad klávesnici
          - vešlo pole, souhlas i tlačítko */                            
      147 +/* otevřená klávesnice: formulář (a panel) se zhustí, aby se n
          +ad klávesnici vešlo pole, souhlas i tlačítko;                 
      148 +   popisek pole zůstává pro čtečky */                         
      149 +.lead-form.kb{gap:10px}                                       
      150 +.lead-form.kb .field-label{position:absolute;width:1px;height:
          +1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}  
      151 +.lead-form.kb>.small{display:none}                            
      152  dialog.sheet.kb .sheet-in{padding-block:12px}
      153  dialog.sheet.kb h2{font-size:1.0625rem;margin-bottom:.2em}
      150 -dialog.sheet.kb [data-host]>.small,dialog.sheet.kb .lead-form>
          -.small{display:none}                                          
      151 -dialog.sheet.kb .lead-form{gap:10px;margin-top:8px}           
      154 +dialog.sheet.kb [data-host]>.small{display:none}              
      155 +dialog.sheet.kb .lead-form{margin-top:8px}                    
      156  @keyframes up{from{transform:translateY(100%)}}
      157  /* patička */
      158  .foot{padding-block:48px 120px;font-size:.8125rem;color:var(--
           ink-2)}

⏺ Update(public/index.html)
  ⎿  Added 1 line, removed 1 line
      393      </ul>
      394      <div class="form-slot" data-slot="sekce">
      395        <form class="lead-form" action="/api/lead" method="post"
            novalidate>
      396 -        <label class="field">Tvůj e-mail                      
      396 +        <label class="field"><span class="field-label">Tvůj e-
          +mail</span>                                                   
      397            <input type="email" name="email" autocomplete="email
           " inputmode="email" autocapitalize="none" spellcheck="false" e
           nterkeyhint="send" placeholder="jmeno@email.cz" required>
      398          </label>
      399          <label class="consent">

⏺ Update(public/index.html)
  ⎿  Added 4 lines, removed 2 lines
      660      jumpBy(lockY - window.scrollY);
      661    }
      662    function fitSheet() {
      663 +    var kb = keyboardOpen();                                  
      664 +    var a = doc.activeElement;                                
      665 +    doc.querySelectorAll('.lead-form').forEach(function (f) { 
          +f.classList.toggle('kb', kb && f.contains(a)); });            
      666 +    dialog.classList.toggle('kb', kb && dialog.contains(a));  
      667      if (!dialog.open) return;
      668      var s = dialog.style;
      665 -    var kb = keyboardOpen();                                  
      666 -    dialog.classList.toggle('kb', kb);                        
      669      if (!vv || Math.abs(vv.scale - 1) > 0.01) { s.marginBottom
            = s.maxHeight = ''; return; }
      670      s.marginBottom = Math.max(0, window.innerHeight - vv.heigh
           t - vv.offsetTop) + 'px';
      671      s.maxHeight = Math.round(kb ? vv.height - 8 : vv.height * 
           0.92) + 'px';

⏺ Teď test ve WebKitu s emulací iPhonu a simulovanou klávesnicí:
  scripts/test-webkit.mjs.

⏺ Write(scripts/test-webkit.mjs)
  ⎿  Wrote 200 lines to scripts/test-webkit.mjs
      1 // Formuláře a klávesnice ve WebKitu (Playwright) s emulací iPhon
      2 // Použití: node test-webkit.mjs [URL]   (server viz serve.sh; We
        bKit nainstaluje `npm run webkit`)
      4 // Softwarovou klávesnici emulátor nemá, proto ji simulujeme dvěm
      5 // - model iOS: layout viewport zůstane, zmenší se jen visualView
        port (podvržená výška + událost resize)
        croll),
      7 // - model Androidu (interactive-widget=resizes-content): zmenší
      8 // Skutečné chování Safari na iPhonu (vlastní posouvání k poli, l
      9 import { BASE_URL, s
     … +266 lines (ctrl+o to expand)

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Mobilní WebKit v Playwrightu nepodporuje kolečko myši. Nahradím ho posunutím,
  které dělá iOS sám: scrollIntoView na prvek v pozadí.

⏺ Bash(python3 - <<'EOF'
      p='test-webkit.mjs'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated scripts/test-webkit.mjs (+2 -2)
       6  //   a iOS posune viditelnou oblast k poli (offsetTop + událost
           scroll),
       7  // - model Androidu (interactive-widget=resizes-content): zmenš
          í se celé okno.
       8  // Skutečné chování Safari na iPhonu (vlastní posouvání k poli,
           lišta nad klávesnicí) to nenahradí, viz README.
       9 +// page.evaluate / $eval jsou API Playwrightu (spouští funkci v
         + prohlížeči), ne JS eval().                                    
      10  import { BASE_URL, sleep } from './lib/browser.mjs';
      11  
      12  process.env.PLAYWRIGHT_BROWSERS_PATH ??= '0';
     ...
       99        check(`${tag}: fokus na nadpisu panelu, klávesnice nevys
           kočí během animace`, focus === 'panel-nadpis', focus);
      100  
      101        // pozadí je zamčené: ani programové posunutí, ani koleč
           ko ho nepohne
      101 -      await page.evaluate(() => window.scrollTo(0, 99999));   
      102 -      await page.mouse.wheel(0, 600);                         
      102 +      await page.evaluate(() => { window.scrollTo(0, 99999); w
          +indow.scrollBy(0, -600); document.getElementById('faq').scroll
          +IntoView(); });                                               
      103        await sleep(200);
      104        check(`${tag}: pozadí pod panelem se neposune`, (await p
           aryTop()) === p0, `${p0} → ${await paryTop()}`);
      105  

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Zbývá opravit jednu chybu – po zavření se fokus nevrací na tlačítko, protože
  příznak „píše do pole“ se nuluje se zpožděním. Při zavření panelu ho teď
  vynuluji okamžitě.

⏺ Update(public/index.html)
  ⎿  Added 1 line
      731      dialog.classList.remove('kb');
      732      dialog.style.marginBottom = dialog.style.maxHeight = '';
      733      unlockPage();
      734 +    typing = false;                                           
      735      updateBar();
      736      if (opener && opener.getClientRects().length) opener.focus
           ({ preventScroll: true });
      737      opener = null;

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Testy ve WebKitu prošly. Podívám se na snímky panelu s klávesnicí, jestli to i
  vypadá dobře.

  Read 3 files (ctrl+o to expand)

⏺ Panel a formulář s klávesnicí jsou v pořádku, ale lístek AGG se zobrazuje
  zrcadlově převrácený, přitom otočený není. Ověřím, jestli je to chyba stránky,
  nebo jen tohoto WebKitu.

  Made 1 scratchpad edit +21, read 2 files, called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Zjišťuji, že headless WebKit nerespektuje backface-visibility: hidden, protože
  ji podporuje jen přes hardwarové skládání vrstev (proto to funguje na
  iPhonu). Doplním proto pojistku, která přepne viditelnost líce/rubu přesně v
  půlce otočení (a okamžitě při prefers-reduced-motion).

⏺ Update(public/index.html)
  ⎿  Added 6 lines, removed 2 lines
      48  .listek[aria-pressed="true"] .listek-in{transform:rotateY(180de
          g)}
      49  .listek:active .lice{transform:scale(.98)}
      50  .listek:active .rub{transform:rotateY(180deg) scale(.98)}
      51 -.lice,.rub{position:absolute;inset:0;display:flex;flex-directio
         -n:column;padding:12px;border:1.5px solid var(--ink);border-radi
         -us:6px;background:var(--card);-webkit-backface-visibility:hidde
         -n;backface-visibility:hidden;box-shadow:2px 3px 0 rgba(20,20,20
         -,.08);transition:transform .1s var(--ease)}                    
      52 -.rub{transform:rotateY(180deg);padding:9px 11px}               
      51 +/* backface-visibility WebKit respektuje jen při hardwarovém sk
         +ládání vrstev; pojistka: líc a rub se přepnou                  
      52 +   viditelností v půlce otočení (lístek je v tu chvíli z boku) 
         +*/                                                             
      53 +.lice,.rub{position:absolute;inset:0;display:flex;flex-directio
         +n:column;padding:12px;border:1.5px solid var(--ink);border-radi
         +us:6px;background:var(--card);-webkit-backface-visibility:hidde
         +n;backface-visibility:hidden;box-shadow:2px 3px 0 rgba(20,20,20
         +,.08);transition:transform .1s var(--ease),visibility 0s .22s} 
      54 +.rub{transform:rotateY(180deg);padding:9px 11px;visibility:hidd
         +en}                                                            
      55 +.listek[aria-pressed="true"] .rub{visibility:visible}          
      56 +.listek[aria-pressed="true"] .lice{visibility:hidden}          
      57  .lice .tk{font-size:1.625rem;line-height:1.1}
      58  .lice .co{font-size:.875rem;color:var(--ink-2);margin-top:2px}
      59  .lice .otoc{margin-top:auto;align-self:flex-end;font-size:.75re
          m;color:var(--ink-2)}

  Read 1 file, called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Lístky ve WebKitu jsou opravené (rub už neprosvítá). Teď doplním tuhle
  kontrolu do WebKit testu, pustím i původní test v Chromu a commitnu bod 1.

⏺ Update(scripts/test-webkit.mjs)
  ⎿  Added 3 lines
      184        await page.goto(BASE, { waitUntil: 'load' });
      185        await page.tap('.listek[data-etf="VWO"]');
      186        await sleep(550);
      187 +      // rub neotočených lístků nesmí prosvítat (headless WebK
          +it nerespektuje backface-visibility)                          
      188 +      const faces = await page.$$eval('.listek', (ls) => ls.ma
          +p((l) => `${l.dataset.etf}:${getComputedStyle(l.querySelector(
          +'.lice')).visibility[0]}${getComputedStyle(l.querySelector('.r
          +ub')).visibility[0]}`));                                      
      189 +      check(`${tag}: viditelný jen líc, u otočeného jen rub`, 
          +faces.every((f) => f.startsWith('VWO') ? f.endsWith('hv') : f.
          +endsWith('vh')), faces.join(' '));                            
      190        const over = await page.evaluate(() => {
      191          const W = document.documentElement.clientWidth;
      192          const wide = [...document.querySelectorAll('body *')].
           filter((el) => { const b = el.getBoundingClientRect(); return 
           b.width && (b.right > W + 0.5 || b.left < -0.5) && !el.closest
           ('.hp, svg, [hidden], .listek'); });

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Chrome test čekal fokus v poli. Na dotykovém displeji je teď záměrně na
  nadpisu panelu, takže upravím očekávání testu, ne stránku.

⏺ Bash(python3 - <<'EOF'
      p='test-page.mjs'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated scripts/package.json (+3 -1)
       7      "test": "node test-page.mjs",
       8      "shots": "node screenshots.mjs",
       9      "lighthouse": "node lighthouse.mjs",
      10 -    "pdf": "node pdf.mjs"                                      
      10 +    "pdf": "node pdf.mjs",                                     
      11 +    "webkit": "PLAYWRIGHT_BROWSERS_PATH=0 playwright install we
         +bkit",                                                         
      12 +    "test:webkit": "node test-webkit.mjs"                      
      13    },
      14    "devDependencies": {
      15      "lighthouse": "13.5.0",
  ⎿  Updated scripts/test-page.mjs (+2 -2)
      143      await sleep(400);
      144      check('panel s formulářem otevřený', await page.$eval('#pa
           nel', (d) => d.open));
      145      check('lišta schovaná při otevřeném panelu', !(await visib
           le(page, '#lista')));
      146 -    const af = await page.evaluate(() => document.activeElemen
          -t.name);                                                      
      147 -    check('fokus v poli e-mail v panelu', af === 'email', af);
      146 +    const af = await page.evaluate(() => document.activeElemen
          +t.id);                                                        
      147 +    check('fokus na nadpisu panelu (dotyk: klávesnice nevyskoč
          +í během animace)', af === 'panel-nadpis', af);                
      148      await page.tap('#panel [data-zavri]');
      149      await sleep(300);
      150      check('panel zavřený křížkem', !(await page.$eval('#panel'
           , (d) => d.open)));
  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Testy prošly. Do README doplním, co jde otestovat automaticky a co jen na
  telefonu. Pak commit bodu 1.

⏺ Update(README.md)
  ⎿  Added 29 lines
       88  - **Denní keep-alive přes Vercel cron.** Bezplatný Supabase pr
           ojekt se po čase bez aktivity pozastaví a formulář musí fungov
           at, i když stránku někdo otevře až za dva týdny.
       89  - **Serverless funkce v regionu `fra1` (Frankfurt).** Kratší o
           dezva pro české návštěvníky i k databázi v EU.
       90  
       91 +## Testování: co automaticky a co jen na telefonu             
       92 +                                                              
       93 +Skripty a návod jsou ve [scripts/](scripts/README.md). Všechny
          + vracejí nenulový kód, když něco neprojde.                    
       94 +                                                              
       95 +**Automaticky:**                                              
       96 +                                                              
       97 +- **Chrome (headless, 375 px, dotyk):** výběr ETF a otočení vš
          +ech lístků, chybové hlášky formuláře, odeslání, panel, lišta d
          +ole, měření (každá událost a že e-mail nikdy nejde s ID návště
          +vy), `prefers-reduced-motion`.                                
       98 +- **WebKit, tedy engine Safari (Playwright, emulace iPhonu 13,
          + iPhonu SE 3. generace a iPhonu SE 1. generace s šířkou 320 px
          +):** panel a formuláře na místě s otevřenou klávesnicí. Emulát
          +or softwarovou klávesnici nemá, proto ji test simuluje dvěma z
          +působy:                                                       
       99 +  - jako iOS: layout viewport zůstane, zmenší se jen `visualVi
          +ewport` a viditelná oblast se posune k poli,                  
      100 +  - jako Android: zmenší se celé okno.                        
      101 +                                                              
      102 +  Kontroluje, že:                                             
      103 +  - nad klávesnicí je vidět nadpis panelu, pole, souhlas i tla
          +čítko; na 320 px aspoň pole, souhlas a tlačítko,              
      104 +  - pozadí se pod panelem nepohne,                            
      105 +  - po zavření se stránka vrátí na stejné místo a fokus na tla
          +čítko, které panel otevřelo,                                  
      106 +  - nic nepřetéká do šířky.                                   
      107 +                                                              
      108 +  Viditelnou výšku nad klávesnicí (328 px na iPhonu 13, 343 px
          + na SE, 244 px na 320 px) jsme odhadli pesimisticky, nenaměřil
          +i.                                                            
      109 +- **Lighthouse (mobil), data proti zdrojům, čísla na stránce p
          +roti datům, text PDF proti datům.**                           
      110 +                                                              
      111 +**Jen na skutečném telefonu:**                                
      112 +                                                              
      113 +- skutečná klávesnice iOS: její výška, lišta nad ní (šipky, Ho
          +tovo, automatické doplnění e-mailu) a to, jak Safari sám posou
          +vá stránku k poli,                                            
      114 +- plynulost otočení lístků (3D na grafickém čipu; headless Web
          +Kit ho kreslí bez něj, proto stránka má pojistku, aby neprosví
          +tal rub),                                                     
      115 +- otevření a uložení PDF v Safari,                            
      116 +- nativní sdílení a kopírování odkazu,                        
      117 +- výřez displeje a domovský indikátor (safe area), tmavý režim
          + iOS,                                                         
      118 +- dotyková odezva a gumové dotažení stránky.                  
      119 +                                                              
      120  ## Nejasnosti v zadání a moje rozhodnutí
      121  
      122  - **„ETF obchodované na NYSE“:** beru NYSE i NYSE Arca, fondy 
           obchodované hlavně na Nasdaqu (např. QQQ) vynechávám. Většina 
           amerických ETF je kotovaná na NYSE Arca, která patří pod NYSE 
           Group.

⏺ Bash(cd /Users/daniel/etfLanding && python3 - <<'EOF'
      p='scripts/README.md'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated scripts/README.md (+7 -0)
      11  
      12  Používá nainstalovaný Google Chrome. Jinou cestu nastavíš promě
          nnou `CHROME_PATH`.
      13  
      14 +Test ve WebKitu (engine Safari) potřebuje Playwright a jeho Web
         +Kit. Ten se stáhne do `scripts/node_modules`:                  
      15 +                                                               
      16 +```                                                            
      17 +npm run webkit                                                 
      18 +```                                                            
      19 +                                                               
      20  ## Po každé změně
      21  
      22  V jednom terminálu spusť server:
     ...
      32  python3 scripts/check_page.py      # čísla na stránce odpovídaj
          í data/etf.json
      33  cd scripts
      34  node test-page.mjs                 # interakce na 375 px: výběr
           ETF, formuláře, panel, měření
      35 +node test-webkit.mjs               # WebKit, iPhone 13 / SE / S
         +E 320 px: formuláře se simulovanou klávesnicí                  
      36  node lighthouse.mjs                # Lighthouse (mobil) pro vše
          chny verze úvodu
      37  node screenshots.mjs po            # snímky do docs/screenshots
          /po-*.png
      38  node pdf.mjs                       # vygeneruje public/tahak.pd
          f z tahak/tahak.html a data/etf.json

⏺ V diffu nejsou klíče ani skutečné e-maily (zachytil se jen zástupný text
  jmeno@email.cz). Commituji bod 1.

  Ran 1 shell command (ctrl+o to expand)

⏺ Bod 1 je v commitu 07ab0e2. Teď bod 2, stažení PDF. Zkusím 404 zopakovat:
  projdu odeslání formuláře ve WebKitu a v Chromu a podívám se do logu serveru.

  Made 1 scratchpad edit +26, called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Chybu se nepodařilo zopakovat – WebKit i Chrome úspěšně dostávají 200 na HEAD
  i GET a stažení proběhne, přičemž podle časů to nesouvisí s přegenerováním
  PDF. Teď se podívám, co o chování atributu download na iOS Safari říkají data
  MDN.

  Ran 1 shell command (ctrl+o to expand)

⏺ Z MDN vidím, že atribut download je v Safari na iOS podporován od verze 13,
  ale přesné chování na iPhonu (dialog vs. otevření v prohlížeči) nelze bez
  telefonu ověřit, takže automatické stahování vůbec nepoužiji. Nyní provedu
  atomický zápis v pdf.mjs.

  Ran 2 shell commands (ctrl+o to expand)

⏺ Úvodní strana taháku odkazuje na stranu „Jak koupit“. Na ni naváže věta s
  prvním krokem v poděkování. Teď atomický zápis PDF a náhledu.

⏺ Bash(python3 - <<'EOF'
      p='scripts/pdf.mjs'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated .gitignore (+3 -0)
      29  
      30  # Výstupy testovacích skriptů (Lighthouse JSON apod.)
      31  scripts/out/
      32 +                                                               
      33 +# dočasné soubory při generování PDF a náhledu (scripts/pdf.mjs
         +)                                                              
      34 +public/**/.*.tmp-*                                             
  ⎿  Updated scripts/pdf.mjs (+17 -5)
       1  // Vygeneruje public/tahak.pdf ze zdroje tahak/tahak.html a dat
           data/etf.json (headless Chrome)
       2  // a náhled první strany public/img/tahak-nahled.webp pro formu
          lář (potřebuje macOS kvůli PDFKit).
       3  // Použití: node pdf.mjs   (po každé změně dat nebo taháku)
       4 -import { readFileSync, statSync, writeFileSync, mkdirSync, mkdt
         -empSync, rmSync } from 'node:fs';                              
       4 +import { readFileSync, statSync, writeFileSync, renameSync, mkd
         +irSync, mkdtempSync, rmSync } from 'node:fs';                  
       5  import { execFileSync } from 'node:child_process';
       6  import { tmpdir } from 'node:os';
       7  import { fileURLToPath, pathToFileURL } from 'node:url';
       8 -import { dirname, join } from 'node:path';                     
       8 +import { basename, dirname, join } from 'node:path';           
       9  import { launch } from './lib/browser.mjs';
      10  
      11  const PREVIEW_W = 480;
     ...
      15  const data = JSON.parse(readFileSync(join(root, 'data', 'etf.js
          on'), 'utf8'));
      16  const out = join(root, 'public', 'tahak.pdf');
      17  
      18 +// Zápis přes dočasný soubor ve stejné složce a přejmenování (n
         +a stejném disku atomické):                                     
      19 +// běžící server tak nikdy neuvidí chybějící ani napůl zapsaný 
         +soubor.                                                        
      20 +function writeAtomic(path, data) {                             
      21 +  const tmp = join(dirname(path), `.${basename(path)}.tmp-${pro
         +cess.pid}`);                                                   
      22 +  try {                                                        
      23 +    writeFileSync(tmp, data);                                  
      24 +    renameSync(tmp, path);                                     
      25 +  } finally {                                                  
      26 +    rmSync(tmp, { force: true });                              
      27 +  }                                                            
      28 +}                                                              
      29 +                                                               
      30  const browser = await launch();
      31  try {
      32    const page = await browser.newPage();
     ...
      34    await page.evaluateOnNewDocument((d) => { window.ETF_DATA = d
          ; }, data);
      35    await page.goto(pathToFileURL(join(root, 'tahak', 'tahak.html
          ')).href, { waitUntil: 'load' });
      36    await page.waitForSelector('body[data-ready="1"]', { timeout:
           10000 });
      25 -  await page.pdf({                                             
      26 -    path: out,                                                 
      37 +  const pdf = await page.pdf({                                 
      38      format: 'A5',
      39      printBackground: true,
      40      preferCSSPageSize: true,
     … 15 more lines (ctrl+o to expand)

  Searched for 1 pattern, read 1 file (ctrl+o to expand)

⏺ Upravím stránku: automatické stažení pryč, texty tlačítka a poděkování nebudou
  slibovat stahování.

⏺ Bash(python3 - <<'EOF'
      def edit(p, pairs):…)
  ⎿  Updated README.md (+1 -1)
      33  
      34  **Formulář:** jen e-mail a souhlas se zpracováním. Žádné jméno 
          ani telefon.
      35  
      36 -**Po odeslání:** poděkování a okamžité stažení PDF, nikdo neček
         -á na e-mail. Rozeslání taháku e-mailem doplníme, jen pokud zbud
         -e čas.                                                         
      36 +**Po odeslání:** poděkování s tlačítkem „Otevřít tahák“, nikdo 
         +nečeká na e-mail. PDF se samo nestahuje: Safari na iPhonu zprac
         +uje stažení jinak než Chrome (podle uživatele PDF otevře místo 
         +stránky), takže by poděkování slibovalo něco, co se nestane, a 
         +návštěvník by odešel ze stránky dřív, než uvidí sdílení. Rozesl
         +ání taháku e-mailem doplníme, jen pokud zbude čas.             
      37  
      38  Texty všech částí jsou v [texty.md](texty.md).
      39  
  ⎿  Updated public/index.html (+6 -15)
      406          </label>
      407          <div class="hp" aria-hidden="true"><label>Toto pole ne
           ch prázdné <input type="text" name="web" tabindex="-1" autocom
           plete="off"></label></div>
      408          <p class="form-error" role="alert" hidden></p>
      409 -        <button class="btn" type="submit">Stáhnout tahák</butt
          -on>                                                           
      410 -        <p class="small">PDF se stáhne hned. Na e-mail čekat n
          -emusíš.</p>                                                   
      409 +        <button class="btn" type="submit">Získat tahák</button
          +>                                                             
      410 +        <p class="small">Tahák otevřeš hned po odeslání, na e-
          +mail čekat nemusíš.</p>                                       
      411        </form>
      412      </div>
      413    </div>
     ...
      450  <template id="dekujeme">
      451    <div class="thanks" tabindex="-1">
      452      <svg class="velka" viewBox="0 0 20 20" aria-hidden="true">
           <use href="#fajfka"/></svg>
      453 -    <h3>Hotovo, tahák se ti stahuje.</h3>                     
      454 -    <p>Nestahuje se? <a href="/tahak.pdf" download="tahak-etf-
          -dvojcata.pdf">Stáhni ho tady.</a></p>                         
      453 +    <h3>Hotovo, tahák je tvůj.</h3>                           
      454 +    <p><a href="/tahak.pdf" target="_blank" rel="noopener">Ote
          +vřít tahák (PDF)</a></p>                                      
      455      <p>Co dál: otevři tahák a&nbsp;začni krokem 1.</p>
      456      <div class="share" hidden>
      457        <p class="small">Znáš někoho, kdo taky marně hledá VOO? 
           Pošli odkaz dál.</p>
     ...
      469    var utm = {};
      470    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].
           forEach(function (k) { if (qs.get(k)) utm[k] = qs.get(k); });
      471    var visitId = window.crypto && crypto.randomUUID ? crypto.ra
           ndomUUID() : Date.now().toString(36) + Math.random().toString(
           36).slice(2);
      472 -  var PDF = '/tahak.pdf';                                     
      472  
      473    /* Měření: zatím jen do konzole, později navigator.sendBeaco
           n na /api/udalost.
      474       ID návštěvy žije jen v paměti tohoto načtení stránky a ni
           kdy se neposílá s e-mailem. */
     ...
      740      opener = null;
      741    });
      742  
      744 -  /* Po odeslání: poděkování nahradí celý blok s formulářem a 
          -stáhne se PDF. */                                             
      743 +  /* Po odeslání: poděkování nahradí celý blok s formulářem. P
          +DF se nestahuje samo: Safari na iPhonu                        
      744 +     atribut download zpracuje jinak než Chrome, tak má každý 
          +stejné tlačítko „Otevřít tahák“. */                           
      745    function finish(submitted) {
      746      if (done) return;
      747      done = true;
     ...
      763      });
      764      updateBar();
      765      if (focusTarget) focusTarget.focus();
      766 -    fetch(PDF, { method: 'HEAD' }).then(function (r) {        
     … 11 more lines (ctrl+o to expand)
  ⎿  Updated tahak.md (+1 -1)
       5  
       6  **Stav (10. 10. 2026):** PDF existuje: `public/tahak.pdf`, 8 st
          ran A5. Zdrojem je `tahak/tahak.html`, údaje o fondech se při g
          enerování berou z `data/etf.json`. Přegenerování: `cd scripts &
          & node pdf.mjs`, kontrola proti datům: `python3 scripts/check_p
          df.py`. Postup nákupu je napsaný podle veřejných nápověd XTB (č
          eská) a Trading 212 (anglická), se zdrojem u každého kroku.
       7  
       8 -**Formát:** PDF se stahuje hned po odeslání formuláře, takže ho
         - většina lidí otevře na mobilu.                                
       8 +**Formát:** PDF je k otevření hned po odeslání formuláře (tlačí
         +tko v poděkování), takže ho většina lidí otevře na mobilu.     
       9  
      10  - Sazba v jednom sloupci, velké písmo, tabulky úzké nebo rozděl
          ené na karty. Klasická dvousloupcová A4 by se na telefonu špatn
          ě četla.
      11  - Jen text, tabulky a jednoduchá grafika, žádné fotky, aby PDF 
          bylo malé a stáhlo se rychle.
  ⎿  Updated texty.md (+5 -5)
      218  - **Souhlas (zaškrtávací pole):** Souhlasím, že mi Clientelo C
           zech s.r.o. bude posílat e-maily o investování do ETF. Odhlási
           t se můžu kdykoli.
      219    - odkaz: Jak nakládáme s osobními údaji → `public/ochrana-os
           obnich-udaju.html` (návrh, musí schválit právník)
      220    - `[ROZHODNOUT + právník: smí být stažení taháku podmíněné s
           ouhlasem s marketingovými e-maily? Pokud ne, souhlas bude dobr
           ovolný a tahák dostane každý, kdo vyplní e-mail.]`
      221 -- **Tlačítko:** Stáhnout tahák                                
      221 +- **Tlačítko:** Získat tahák                                  
      222  - **Tlačítko při odesílání:** Odesílám…
      223 -- **Pod tlačítkem:** PDF se stáhne hned. Na e-mail čekat nemus
          -íš.                                                           
      223 +- **Pod tlačítkem:** Tahák otevřeš hned po odeslání, na e-mail
          + čekat nemusíš.                                               
      224  - **Skryté pole proti botům:** popisek jen pro čtečky obrazovk
           y: „Toto pole nech prázdné“
      225  
      226  ### Chybové hlášky
     ...
      232  | nezaškrtnutý souhlas | Zaškrtni prosím souhlas. (Závisí na r
           ozhodnutí výše.) |
      233  | chyba serveru | Něco se pokazilo u nás. Zkus to prosím za ch
           víli znovu. |
      234  | bez internetu | Vypadá to, že nejde internet. Zkontroluj při
           pojení a zkus to znovu. |
      235 -| e-mail už máme (není chyba) | Tenhle e-mail už u nás máme. T
          -ahák se ti stahuje. |                                         
      235 +| e-mail už máme (není chyba) | Žádná hláška, stejné poděkován
          +í jako u nového e-mailu. Jinak by formulář prozradil, kdo už j
          +e v databázi. |                                               
      236  
      237  ### Poděkování (nahradí celý blok s formulářem: kartu v sekci,
            výzvu pod lístky i obsah panelu)
      238  
      239  - **Nahoře velká zelená fajfka**
      240 -- **H2:** Hotovo, tahák se ti stahuje.                        
      241 -- **Text:** Nestahuje se? Stáhni ho tady. (odkaz na PDF)      
      240 +- **H2:** Hotovo, tahák je tvůj.                              
      241 +- **Odkaz:** Otevřít tahák (PDF). PDF se samo nestahuje: Safar
          +i na iPhonu zpracuje stažení jinak než Chrome (dialog, nebo ot
          +evření místo stránky), tak má každý stejné tlačítko a text nic
          + neslibuje.                                                   
      242  - **Text:** Co dál: otevři tahák a začni krokem 1.
      243  - **Volitelné sdílení:**
      244    - text: Znáš někoho, kdo taky marně hledá VOO? Pošli odkaz d
           ál.

⏺ Upravím README formulaci a testy: nový text poděkování a kontrolu, že se po
  odeslání PDF samo nestahuje.

⏺ Bash(python3 - <<'EOF'
      def edit(p, pairs, count=1):…)
  ⎿  Updated README.md (+1 -1)
      33  
      34  **Formulář:** jen e-mail a souhlas se zpracováním. Žádné jméno 
          ani telefon.
      35  
      36 -**Po odeslání:** poděkování s tlačítkem „Otevřít tahák“, nikdo 
         -nečeká na e-mail. PDF se samo nestahuje: Safari na iPhonu zprac
         -uje stažení jinak než Chrome (podle uživatele PDF otevře místo 
         -stránky), takže by poděkování slibovalo něco, co se nestane, a 
         -návštěvník by odešel ze stránky dřív, než uvidí sdílení. Rozesl
         -ání taháku e-mailem doplníme, jen pokud zbude čas.             
      36 +**Po odeslání:** poděkování s tlačítkem „Otevřít tahák“, nikdo 
         +nečeká na e-mail. PDF se samo nestahuje: Safari na iPhonu zprac
         +uje stažení jinak než Chrome (při testu na iPhonu se PDF otevře
         +lo v prohlížeči místo stránky), takže by poděkování slibovalo n
         +ěco, co se nestane, a návštěvník by odešel ze stránky dřív, než
         + uvidí sdílení. Rozeslání taháku e-mailem doplníme, jen pokud z
         +bude čas.                                                      
      37  
      38  Texty všech částí jsou v [texty.md](texty.md).
      39  
  ⎿  Updated scripts/test-page.mjs (+7 -4)
      18    });
      19    page.on('pageerror', (e) => logs.push({ type: 'pageerror', te
          xt: e.message, args: [] }));
      20    page.on('response', (r) => { if (r.status() >= 400) logs.push
          ({ type: 'http', text: `${r.status()} ${new URL(r.url()).pathna
          me}`, args: [] }); });
      21 +  page.on('request', (r) => logs.push({ type: 'req', text: `${r
         +.method()} ${new URL(r.url()).pathname}`, args: [] }));        
      22    await page.goto(BASE + query, { waitUntil: 'networkidle0' });
      23    return { page, logs };
      24  }
     ...
      111      const busy = await text(page, `${F} [type=submit]`);
      112      check('tlačítko při odesílání', busy === 'Odesílám…', busy
           );
      113      await sleep(900);
      113 -    check('poděkování po odeslání', ((await text(page, '#vyber
          --cta .thanks h3')) || '') === 'Hotovo, tahák se ti stahuje.');
      114 +    check('poděkování po odeslání', ((await text(page, '#vyber
          +-cta .thanks h3')) || '') === 'Hotovo, tahák je tvůj.');      
      115      check('všechny formuláře nahrazené poděkováním', (await pa
           ge.$$('.lead-form')).length === 0);
      116      check('poděkování nahradilo celou kartu v sekci (žádné odr
           ážky)', (await page.$$('#tahak .form-card ul, #tahak .form-car
           d .lead-form')).length === 0 && !!(await page.$('#tahak .form-
           card .thanks')));
      117      check('poděkování nahradilo výzvu pod lístky', (await page
           .$$('#vyber-cta [data-otevri], #vyber-cta > .small, #vyber-cta
            .lead-form')).length === 0);
     ...
      125      check('měření: nikde e-mail', !JSON.stringify(evs).include
           s('@'));
      126      const names = evs.map((e) => e.udalost);
      127      for (const n of ['prichod', 'otoceni_listku', 'vyzva_zobra
           zena', 'cta', 'formular_otevren', 'formular_zacatek', 'odeslan
           i_pokus', 'odeslani_chyba', 'odeslano']) check(`měření: událos
           t ${n}`, names.includes(n));
      128 +    check('po odeslání se PDF samo nestahuje', !logs.some((l) 
          +=> l.type === 'req' && l.text.endsWith('/tahak.pdf')));       
      129 +    const link = await page.$eval('#vyber-cta .thanks a[href$=
          +"tahak.pdf"]', (a) => `${a.getAttribute('href')} ${a.target}`)
          +.catch(() => null);                                           
      130 +    check('poděkování: odkaz „Otevřít tahák“ do nové karty', l
          +ink === '/tahak.pdf _blank', String(link));                   
      131      const pdf = await page.evaluate(() => fetch('/tahak.pdf', 
           { method: 'HEAD' }).then((r) => `${r.status} ${r.headers.get('
           content-type')}`));
      132      check('tahák PDF je dostupný', pdf.startsWith('200') && pd
           f.includes('pdf'), pdf);
      129 -    check('žádné varování o chybějícím PDF', !logs.some((l) =>
          - l.type === 'warn' && l.text.includes('PDF zatím neexistuje'))
          -);                                                            
      133      const overflow = await page.evaluate(() => document.docume
           ntElement.scrollWidth - window.innerWidth);
      134      check('bez vodorovného přetečení (s výsledkem)', overflow 
           === 0, `${overflow}px`);
      135      check('bez chyb v konzoli', !realErrors(logs).length, real
           Errors(logs).map((l) => l.text).join(' | '));
     ...
      162      await page.tap(`${F} input[name=consent]`);
      163      await page.tap(`${F} [type=submit]`);
      164      await sleep(900);
      162 -    check('odeslání z panelu → poděkování', ((await text(page,
          - '#panel .thanks h3')) || '') === 'Hotovo, tahák se ti stahuje
          -.');                                                          
      165 +    check('odeslání z panelu → poděkování', ((await text(page,
          + '#panel .thanks h3')) || '') === 'Hotovo, tahák je tvůj.');  
      166      const ev = events(logs).filter((e) => e.udalost === 'odesl
           ano');
      167      check('měření: odeslano se zdrojem karty', ev.length === 1
            && ev[0].zdroj === 'karty', JSON.stringify(ev));
      168      await page.keyboard.press('Escape');
     ...
      208      await page.evaluate((F) => { document.querySelector(`${F} 
           input[name=consent]`).checked = true; }, F);
      209      await page.evaluate((F) => document.querySelector(F).reque
           stSubmit(), F);
      210      await sleep(300);
      208 -    check('bot: poděkování se ukáže', ((await text(page, '#tah
          -ak .form-card .thanks h3')) || '') === 'Hotovo, tahák se ti st
          -ahuje.');                                                     
      211 +    check('bot: poděkování se ukáže', ((await text(page, '#tah
          +ak .form-card .thanks h3')) || '') === 'Hotovo, tahák je tvůj.
          +');                                                           
     … 3 more lines (ctrl+o to expand)

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Testy prošly. Ověřím, že při přegenerování server PDF nikdy „neztratí“: během
  běhu pdf.mjs budu PDF pořád dokola stahovat.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Během přegenerování proběhlo 170 požadavků na PDF a všechny vrátily 200 s
  celým souborem. Commituji bod 2.

  Ran 1 shell command (ctrl+o to expand)

⏺ Bod 2 je v commitu 5ffecc3. Teď bod 3, poděkování: velké tlačítko „Otevřít
  tahák“, první krok a sdílení s náhradou kopírováním, obojí měřené.

⏺ Update(public/index.html)
  ⎿  Added 6 lines, removed 5 lines
      451    <div class="thanks" tabindex="-1">
      452      <svg class="velka" viewBox="0 0 20 20" aria-hidden="true">
           <use href="#fajfka"/></svg>
      453      <h3>Hotovo, tahák je tvůj.</h3>
      454 -    <p><a href="/tahak.pdf" target="_blank" rel="noopener">Ote
          -vřít tahák (PDF)</a></p>                                      
      455 -    <p>Co dál: otevři tahák a&nbsp;začni krokem 1.</p>        
      456 -    <div class="share" hidden>                                
      457 -      <p class="small">Znáš někoho, kdo taky marně hledá VOO? 
          -Pošli odkaz dál.</p>                                          
      458 -      <button class="btn btn-yellow" type="button" data-sdilej
          ->Sdílet odkaz</button>                                        
      454 +    <a class="btn" href="/tahak.pdf" target="_blank" rel="noop
          +ener" data-tahak>Otevřít tahák</a>                            
      455 +    <p class="krok"><b>První krok:</b> v&nbsp;taháku najdi dvo
          +jče fondu, který tě zajímá, a&nbsp;na straně „Jak koupit“ proj
          +di kroky pro svého brokera.</p>                               
      456 +    <div class="share">                                       
      457 +      <p><b>Znáš někoho, kdo taky marně hledá VOO?</b> Pošli m
          +u odkaz na tuhle stránku.</p>                                 
      458 +      <button class="btn btn-yellow" type="button" data-sdilej
          +>Poslat odkaz kamarádovi</button>                             
      459 +      <p class="small" role="status" data-sdileni-stav></p>   
      460      </div>
      461    </div>
      462  </template>

⏺ Update(public/index.html)
  ⎿  Added 7 lines, removed 1 line
      133  .thanks:focus{outline:none}
      134  .thanks .velka{width:56px;height:56px;color:var(--ok);margin:0
            auto 6px;display:block}
      135  .thanks h3{font-size:1.25rem}
      136 -.thanks p:last-child{margin:0}                                
      136 +.thanks .btn{width:100%}                                      
      137 +.krok{margin:14px 0 0;padding:12px 14px;border:1.5px dashed va
          +r(--ink-2);border-radius:6px;font-size:.9375rem;text-align:lef
          +t}                                                            
      138 +.share{margin-top:18px;padding-top:16px;border-top:1px dashed 
          +var(--line)}                                                  
      139 +.share p{margin:0 0 10px}                                     
      140 +.share .small{margin:8px 0 0}                                 
      141 +.share .small:empty{display:none}                             
      142 +.share-url{width:100%;min-height:44px;margin-top:8px;padding:8
          +px 10px;border:1.5px solid var(--ink);border-radius:8px;backgr
          +ound:#fff;color:var(--ink);font:inherit;font-size:16px}       
      143  /* lišta dole a panel */
      144  .bar{position:fixed;right:0;bottom:0;left:0;z-index:10;padding
           :10px 16px calc(10px + env(safe-area-inset-bottom,0px));border
           -top:1.5px solid var(--ink);background:var(--card);animation:u
           p .2s var(--ease)}
      145  .bar-in{display:flex;align-items:center;gap:12px;max-width:40r
           em;margin:0 auto}

⏺ Teď JS poděkování: měření otevření taháku, sdílení a náhrada kopírováním.

  Read 1 file (ctrl+o to expand)

⏺ Update(public/index.html)
  ⎿  Added 39 lines, removed 8 lines
      757      var focusTarget;
      758      doc.querySelectorAll('[data-host]').forEach(function (host
           ) {
      759        var t = thanksTpl.content.firstElementChild.cloneNode(tr
           ue);
      760 -      var share = t.querySelector('.share');                  
      761 -      if (navigator.share) {                                  
      762 -        share.hidden = false;                                 
      763 -        share.querySelector('button').addEventListener('click'
          -, function () {                                               
      764 -          track('sdileni', {});                               
      765 -          navigator.share({ title: doc.title, url: location.or
          -igin + location.pathname }).catch(function () {});            
      766 -        });                                                   
      767 -      }                                                       
      760 +      var kde = dialog.contains(host) ? 'panel' : host.id === 
          +'vyber-cta' ? 'listky' : 'sekce';                             
      761 +      if (kde === 'panel') t.querySelector('h3').id = 'panel-n
          +adpis'; // dialog má aria-labelledby                          
      762 +      t.querySelector('[data-tahak]').addEventListener('click'
          +, function () { track('tahak_otevren', { zdroj: kde }); });   
      763 +      t.querySelector('[data-sdilej]').addEventListener('click
          +', function () { share(t.querySelector('[data-sdileni-stav]'))
          +; });                                                         
      764        host.replaceChildren(t);
      765        if (host === submittedHost) focusTarget = t;
      766      });
      767      updateBar();
      768      if (focusTarget) focusTarget.focus();
      769    }
      770 +                                                              
      771 +  /* Sdílení: nativní nabídka telefonu, jinak zkopírovat odkaz
          +. Každé sdílení je další možný kontakt, proto ho měříme. */   
      772 +  var SHARE_URL = location.origin + location.pathname + '?ref=
          +sdileni';                                                     
      773 +  function share(status) {                                    
      774 +    if (navigator.share) {                                    
      775 +      navigator.share({ title: 'ETF dvojčata', text: 'Americká
          + ETF ti broker v Česku často nenabídne. Tady jsou jejich evrop
          +ská dvojčata.', url: SHARE_URL }).then(function () {          
      776 +        track('sdileni', { zpusob: 'nativni' });              
      777 +      }, function (e) {                                       
      778 +        if (e && e.name === 'AbortError') return track('sdilen
          +i', { zpusob: 'zruseno' });                                   
      779 +        copyLink(status);                                     
      780 +      });                                                     
      781 +      return;                                                 
      782 +    }                                                         
      783 +    copyLink(status);                                         
      784 +  }                                                           
      785 +  function copyLink(status) {                                 
      786 +    function copied() {                                       
      787 +      status.textContent = 'Odkaz je zkopírovaný. Vlož ho kama
          +rádovi do zprávy.';                                           
      788 +      track('sdileni', { zpusob: 'kopie' });                  
      789 +    }                                                         
      790 +    function manual() {                                       
      791 +      // bez schránky (např. stránka přes http v lokální síti)
          +: odkaz k ručnímu zkopírování                                 
      792 +      var input = status.parentNode.querySelector('.share-url'
          +) || doc.createElement('input');                              
      793 +      input.className = 'share-url';                          
      794 +      input.readOnly = true;                                  
      795 +      input.value = SHARE_URL;                                
      796 +      input.setAttribute('aria-label', 'Odkaz na stránku');   
      797 +      status.textContent = 'Zkopíruj si odkaz:';              
      798 +      status.after(input);                                    
      799 +      input.select();                                         
      800 +      track('sdileni', { zpusob: 'rucne' });                  
      801 +    }                                                         
      802 +    if (navigator.clipboard && window.isSecureContext) navigat
          +or.clipboard.writeText(SHARE_URL).then(copied, manual);       
      803 +    else manual();                                            
      804 +  }                                                           
      805  })();
      806  </script>
      807  </body>

⏺ Bash(python3 - <<'EOF'
      p='public/index.html'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated public/index.html (+1 -1)
      494      return new Promise(function (resolve) { setTimeout(resolve
           , 400); });
      495    }
      496  
      497 -  track('prichod', { sirka: window.innerWidth });             
      497 +  track('prichod', { sirka: window.innerWidth, ref: qs.get('re
          +f') === 'sdileni' ? 'sdileni' : '' });                        
      498  
      499    /* Hloubka scrollu: 25, 50, 75 a 100 %, každá jednou. */
      500    var marks = [25, 50, 75, 100];
⏺ Do testu v Chromu přidám poděkování: otevření taháku, sdílení (nativní,
  zrušené, kopie, ruční kopie) a příchod přes sdílený odkaz.

⏺ Bash(python3 - <<'EOF'
      p='scripts/test-page.mjs'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated scripts/test-page.mjs (+46 -1)
       9  
      10  const browser = await launch();
      11  
      12 -async function open(query = '') {                              
      12 +async function open(query = '', before = null) {               
      13    const page = await mobilePage(browser);
      14 +  if (before) await page.evaluateOnNewDocument(before);        
      15    const logs = [];
      16    page.on('console', async (m) => {
      17      const args = await Promise.all(m.args().map((a) => a.jsonVa
          lue().catch(() => null)));
     ...
      200      await page.close();
      201    }
      202  
      203 +  // 8) Poděkování: tlačítko na tahák, první krok, sdílení (na
          +tivní, zrušené, kopie, ruční kopie)                           
      204 +  const SHARE = {                                             
      205 +    nativni: () => { navigator.share = () => Promise.resolve()
          +; },                                                          
      206 +    zruseno: () => { navigator.share = () => Promise.reject(ne
          +w DOMException('zrušeno', 'AbortError')); },                  
      207 +    kopie: () => { delete Navigator.prototype.share; Object.de
          +fineProperty(navigator, 'clipboard', { value: { writeText: () 
          +=> Promise.resolve() } }); },                                 
      208 +    rucne: () => { delete Navigator.prototype.share; Object.de
          +fineProperty(navigator, 'clipboard', { value: undefined }); },
      209 +  };                                                          
      210 +  for (const [mode, before] of Object.entries(SHARE)) {       
      211 +    const { page, logs } = await open('', before);            
      212 +    const F = '[data-slot="sekce"] .lead-form';               
      213 +    await page.type(`${F} input[name=email]`, 'eva@example.com
          +');                                                           
      214 +    await page.tap(`${F} input[name=consent]`);               
      215 +    await page.tap(`${F} [type=submit]`);                     
      216 +    await sleep(700);                                         
      217 +    const T = '#tahak .thanks';                               
      218 +    if (mode === 'nativni') {                                 
      219 +      const btn = await page.$eval(`${T} [data-tahak]`, (a) =>
          + `${a.textContent}|${a.className}|${a.getAttribute('href')}|${
          +a.target}`).catch(() => null);                                
      220 +      check('poděkování: tlačítko „Otevřít tahák“', btn === 'O
          +tevřít tahák|btn|/tahak.pdf|_blank', String(btn));            
      221 +      check('poděkování: věta s prvním krokem', ((await text(p
          +age, `${T} .krok`)) || '').startsWith('První krok:'));        
      222 +      await page.evaluate(() => document.addEventListener('cli
          +ck', (e) => { if (e.target.closest('[data-tahak]')) e.preventD
          +efault(); }));                                                
      223 +      await page.tap(`${T} [data-tahak]`);                    
      224 +      await sleep(100);                                       
      225 +      const op = events(logs).filter((e) => e.udalost === 'tah
          +ak_otevren');                                                 
      226 +      check('měření: otevření taháku', op.length === 1 && op[0
          +].zdroj === 'sekce', JSON.stringify(op));                     
      227 +    }                                                         
      228 +    await page.tap(`${T} [data-sdilej]`);                     
      229 +    await sleep(300);                                         
     … 20 more lines (ctrl+o to expand)

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Testy prošly (90 kontrol). Podívám se, jak poděkování vypadá ve WebKitu na 390
  a 320 px.

  Made 1 scratchpad edit +21, read 1 file, called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Poděkování vypadá dobře i na 320 px. Doplním texty a README a commitnu bod 3.

⏺ Bash(python3 - <<'EOF'
      def edit(p, pairs):…)
  ⎿  Updated README.md (+1 -1)
      33  
      34  **Formulář:** jen e-mail a souhlas se zpracováním. Žádné jméno 
          ani telefon.
      35  
      36 -**Po odeslání:** poděkování s tlačítkem „Otevřít tahák“, nikdo 
         -nečeká na e-mail. PDF se samo nestahuje: Safari na iPhonu zprac
         -uje stažení jinak než Chrome (při testu na iPhonu se PDF otevře
         -lo v prohlížeči místo stránky), takže by poděkování slibovalo n
         -ěco, co se nestane, a návštěvník by odešel ze stránky dřív, než
         - uvidí sdílení. Rozeslání taháku e-mailem doplníme, jen pokud z
         -bude čas.                                                      
      36 +**Po odeslání:** poděkování s tlačítkem „Otevřít tahák“, nikdo 
         +nečeká na e-mail. Pod ním je jedna věta s prvním krokem a tlačí
         +tko „Poslat odkaz kamarádovi“ (nativní sdílení telefonu, jinak 
         +zkopírování odkazu). Každé sdílení je další možný kontakt, prot
         +o ho měříme a sdílený odkaz má `?ref=sdileni`. PDF se samo nest
         +ahuje: Safari na iPhonu zpracuje stažení jinak než Chrome (při 
         +testu na iPhonu se PDF otevřelo v prohlížeči místo stránky), ta
         +kže by poděkování slibovalo něco, co se nestane, a návštěvník b
         +y odešel ze stránky dřív, než uvidí sdílení. Rozeslání taháku e
         +-mailem doplníme, jen pokud zbude čas.                         
      37  
      38  Texty všech částí jsou v [texty.md](texty.md).
      39  
  ⎿  Updated texty.md (+9 -5)
      238  
      239  - **Nahoře velká zelená fajfka**
      240  - **H2:** Hotovo, tahák je tvůj.
      241 -- **Odkaz:** Otevřít tahák (PDF). PDF se samo nestahuje: Safar
          -i na iPhonu zpracuje stažení jinak než Chrome (dialog, nebo ot
          -evření místo stránky), tak má každý stejné tlačítko a text nic
          - neslibuje.                                                   
      242 -- **Text:** Co dál: otevři tahák a začni krokem 1.            
      243 -- **Volitelné sdílení:**                                      
      244 -  - text: Znáš někoho, kdo taky marně hledá VOO? Pošli odkaz d
          -ál.                                                           
      245 -  - tlačítko: Sdílet odkaz                                    
      241 +- **Tlačítko (černé, přes celou šířku):** Otevřít tahák. Otevř
          +e PDF v nové kartě, poděkování zůstane. PDF se samo nestahuje:
          + Safari na iPhonu zpracuje stažení jinak než Chrome (dialog, n
          +ebo otevření místo stránky), tak má každý stejné tlačítko a te
          +xt nic neslibuje.                                             
      242 +- **První krok (rámeček):** **První krok:** v taháku najdi dvo
          +jče fondu, který tě zajímá, a na straně „Jak koupit“ projdi kr
          +oky pro svého brokera. (Strana „Jak koupit“ je v PDF, viz taha
          +k.md.)                                                        
      243 +- **Sdílení:**                                                
      244 +  - text: **Znáš někoho, kdo taky marně hledá VOO?** Pošli mu 
          +odkaz na tuhle stránku.                                       
      245 +  - tlačítko (žluté): Poslat odkaz kamarádovi. Otevře nativní 
          +sdílení telefonu (Web Share API).                             
      246 +  - bez nativního sdílení se odkaz zkopíruje: „Odkaz je zkopír
          +ovaný. Vlož ho kamarádovi do zprávy.“                         
      247 +  - bez schránky (např. stránka přes http) se ukáže pole s odk
          +azem: „Zkopíruj si odkaz:“                                    
      248 +  - sdílený odkaz má `?ref=sdileni`, takže příchody od kamarád
          +ů jdou v měření poznat                                        
      249 +  - text sdílení: Americká ETF ti broker v Česku často nenabíd
          +ne. Tady jsou jejich evropská dvojčata.                       
      250  
      251  ---
      252  

⏺ Bod 3 je v commitu da23330. Teď bod 4, zásady ochrany osobních údajů. Nejdřív
  IČO a sídlo z ARES.

  Ran 1 shell command (ctrl+o to expand)

⏺ ARES vrátil jeden záznam – Clientelo Czech s.r.o., IČO 22193456, sídlo
  Platnéřská 90/13, Praha 1, vznik 24. 10. 2024. Nyní dohledám spisovou značku z
  veřejného rejstříku.

  Ran 1 shell command (ctrl+o to expand)

⏺ Spisová značka je C 412348 u Městského soudu v Praze, záznam je aktivní. Teď
  si přečtu návrh zásad.

  Read 1 file (ctrl+o to expand)

⏺ Přepíšu návrh zásad: doplním ověřené údaje o správci a regionu Supabase, žluté
  TODO bloky nahradím nenápadným „doplní správce“ a popíšu měření podle
  aktuálního stavu (sdílení, otevření taháku).

⏺ Write(public/ochrana-osobnich-udaju.html)
  ⎿  Added 27 lines, removed 20 lines
       6  <title>Ochrana osobních údajů (návrh) | ETF dvojčata</title>
       7  <meta name="robots" content="noindex">
       8  <meta name="theme-color" content="#FFFDF5">
       9 -<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://
         -www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' h
         -eight='32' rx='7' fill='%231A1A1A'/%3E%3Cpath d='M7 21h8M17 21h
         -8' stroke='%23FFE45C' stroke-width='3' stroke-linecap='round'/%
         -3E%3Cpath d='M8 10h6M18 10h6' stroke='%23fff' stroke-width='3' 
         -stroke-linecap='round'/%3E%3C/svg%3E">                         
       9 +<meta name="color-scheme" content="only light">                
      10 +<link rel="icon" href="/favicon.svg" type="image/svg+xml">     
      11 +<link rel="icon" href="/favicon.ico" sizes="32x32">            
      12 +<link rel="apple-touch-icon" href="/apple-touch-icon.png">     
      13  <style>
      11 -body{margin:0;background:#FFFDF5;color:#1A1A1A;font:400 1rem/1.
         -6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica
         - Neue",Arial,sans-serif}                                       
      14 +:root{color-scheme:only light}                                 
      15 +body{margin:0;background:#FFFDF5;color:#141414;font:400 1rem/1.
         +6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica
         + Neue",Arial,sans-serif;-webkit-text-size-adjust:100%}         
      16  main{max-width:40rem;margin:0 auto;padding:24px 16px 64px}
      17  h1{font-size:1.75rem;line-height:1.15;margin:0 0 .5em}
      18  h2{font-size:1.2rem;line-height:1.2;margin:1.8em 0 .4em}
      15 -a{color:#1A1A1A}                                               
      16 -.draft{padding:12px 14px;border:2px dashed #1A1A1A;background:#
         -FFE45C;font-weight:700}                                        
      17 -.todo{background:#FFF2B3;outline:1px dashed #9A7400;padding:0 3
         -px}                                                            
      19 +a{color:#141414;text-underline-offset:2px}                     
      20 +.draft{margin:0 0 1.5em;padding:10px 14px;border-left:4px solid
         + #141414;background:#fff;font-size:.9375rem}                   
      21 +.doplni{color:#4A4A4A;font-style:italic}                       
      22 +.zdroj{font-size:.8125rem;color:#4A4A4A}                       
      23  ul{padding-left:1.2em}
      24  li{margin:4px 0}
      25  </style>
     ...
      28  <main>
      29  <p><a href="./">← Zpět na ETF dvojčata</a></p>
      30  <h1>Ochrana osobních údajů</h1>
      26 -<p class="draft">NÁVRH. Tento text napsal tvůrce stránky, ne pr
         -ávník. Před spuštěním kampaně ho musí zkontrolovat a schválit p
         -rávník. Žlutě označená místa je potřeba doplnit.</p>           
      31 +<p class="draft"><b>Návrh.</b> Text připravil tvůrce stránky, n
         +e právník. Před spuštěním kampaně ho zkontroluje a schválí práv
         +ník a správce doplní místa označená „doplní správce“.</p>      
      32  
      33  <h2>Kdo údaje zpracovává</h2>
      29 -<p>Správcem osobních údajů je Clientelo Czech s.r.o., IČO <span
         - class="todo">[TODO]</span>, sídlo <span class="todo">[TODO]</s
         -pan>. Kontakt pro otázky k osobním údajům: <span class="todo">[
         -TODO e-mail]</span>.</p>                                       
      34 +<p>Správcem osobních údajů je Clientelo Czech&nbsp;s.r.o., IČO 
         +22193456, se sídlem Platnéřská 90/13, Staré Město, 110&nbsp;00 
         +Praha&nbsp;1, zapsaná v&nbsp;obchodním rejstříku vedeném Městsk
         +ým soudem v&nbsp;Praze, oddíl&nbsp;C, vložka 412348.</p>       
      35 +<p>Kontakt pro otázky k&nbsp;osobním údajům: <span class="dopln
         +i">doplní správce</span>.</p>                                  
      36 +<p class="zdroj">Identifikační údaje podle <a href="https://are
         +s.gov.cz/ekonomicke-subjekty?ico=22193456">ARES</a> (obchodní r
         +ejstřík), ověřeno 11.&nbsp;10.&nbsp;2026.</p>                  
      37  
      38  <h2>Jaké údaje a proč</h2>
      39  <ul>
      33 -  <li><b>E-mail a souhlas.</b> Když vyplníš formulář u taháku, 
         -uložíme tvůj e-mail a souhlas včetně času, kdy byl udělen. Použ
         -ijeme je k posílání e-mailů o investování do ETF.</li>         
      34 -  <li><b>Měření návštěvnosti.</b> Stránka zaznamenává anonymní 
         -události (příchod, jak daleko je stránka posunutá, výběr ETF, o
         -tevření a odeslání formuláře). Identifikátor návštěvy existuje 
         -jen v paměti prohlížeče po dobu jednoho načtení stránky, nic se
         - neukládá do prohlížeče (žádné cookies) a s e-mailem se nikdy n
         -espojuje.</li>                                                 
      35 -  <li><b>Technické záznamy hostingu.</b> Poskytovatel hostingu 
         -může v záznamech o přístupu zpracovávat například IP adresu. <s
         -pan class="todo">[TODO: ověřit u poskytovatele, co a jak dlouho
         - uchovává]</span></li>                                         
      40 +  <li><b>E-mail a souhlas.</b> Když vyplníš formulář u&nbsp;tah
         +áku, uložíme tvůj e-mail, souhlas, čas, kdy byl udělen, a verzi
         + stránky, ze které přišel (podle reklamy). Použijeme je k&nbsp;
         +posílání e-mailů o&nbsp;investování do ETF.</li>               
      41 +  <li><b>Měření návštěvnosti.</b> Stránka zaznamenává anonymní 
         +události: příchod, jak daleko je stránka posunutá, otočení líst
         +ku s&nbsp;ETF, otevření a&nbsp;odeslání formuláře, otevření tah
         +áku a&nbsp;sdílení odkazu. Identifikátor návštěvy existuje jen 
         +v&nbsp;paměti prohlížeče po dobu jednoho načtení stránky, nic s
         +e neukládá do prohlížeče (žádné cookies) a&nbsp;s&nbsp;e-mailem
         + se nikdy nespojuje. Čas události ukládáme jen s&nbsp;přesností
         + na hodinu.</li>                                               
      42 +  <li><b>Technické záznamy hostingu.</b> Poskytovatel hostingu 
         +(Vercel) může v&nbsp;záznamech o&nbsp;přístupu zpracovávat např
         +íklad IP adresu. Jak dlouho je uchovává: <span class="doplni">d
         +oplní správce</span>.</li>                                     
      43  </ul>
      44  
      45  <h2>Na jakém základě</h2>
      39 -<p>E-mail zpracováváme na základě tvého souhlasu (čl. 6 odst. 1
         - písm. a) obecného nařízení o ochraně osobních údajů, GDPR). So
         -uhlas můžeš kdykoli odvolat (čl. 7 odst. 3 GDPR), například odk
         -azem v e-mailu nebo napsáním na kontakt výše. <span class="todo
         -">[TODO právník: právní základ měření návštěvnosti a zda smí bý
         -t tahák podmíněný souhlasem s e-maily]</span></p>              
      46 +<p>E-mail zpracováváme na základě tvého souhlasu (čl.&nbsp;6 od
         +st.&nbsp;1 písm.&nbsp;a) obecného nařízení o&nbsp;ochraně osobn
         +ích údajů, GDPR). Souhlas můžeš kdykoli odvolat (čl.&nbsp;7 ods
         +t.&nbsp;3 GDPR), například odkazem v&nbsp;e-mailu nebo napsáním
         + na kontakt výše.</p>                                          
      47 +<p>Právní základ měření návštěvnosti: <span class="doplni">dopl
         +ní správce po konzultaci s&nbsp;právníkem</span>.</p>          
      48  
      49  <h2>Jak dlouho</h2>
      42 -<p>E-mail uchováme, dokud souhlas neodvoláš. <span class="todo"
         ->[TODO: potvrdit dobu uložení]</span></p>                      
      50 +<p>E-mail uchováme, dokud souhlas neodvoláš. Nejdelší doba ulož
         +ení: <span class="doplni">doplní správce</span>.</p>           
      51  
      44 -<h2>Kdo k údajům má přístup</h2>                               
      52 +<h2>Kdo k&nbsp;údajům má přístup</h2>                          
      53  <ul>
      46 -  <li>Supabase: databáze, ve které jsou e-maily uložené, v regi
         -onu EU. <span class="todo">[TODO: doplnit přesný region po zalo
         -žení projektu]</span></li>                                     
      47 -  <li>Vercel: hosting stránky a funkce, která formulář zpracová
         -vá.</li>                                                       
      48 -  <li>E-mailový nástroj: <span class="todo">[TODO: zatím nevybr
         -án]</span></li>                                                
      54 +  <li><b>Supabase:</b> databáze, ve které jsou e-maily a&nbsp;u
         +dálosti uložené. Data leží v&nbsp;regionu EU, ve Frankfurtu (eu
         +-central-1).</li>                                              
      55 +  <li><b>Vercel:</b> hosting stránky a&nbsp;funkce, které formu
         +lář a&nbsp;měření zpracovávají. Funkce běží ve Frankfurtu.</li>
      56 +  <li><b>E-mailová služba</b> pro rozesílání: <span class="dopl
         +ni">doplní správce</span>.</li>                                
      57  </ul>
      50 -<p><span class="todo">[TODO právník: zda dochází k předávání úd
         -ajů mimo EU a na jakém základě]</span></p>                     
      51 -<p>Tvůj e-mail neprodáváme. <span class="todo">[TODO: potvrdit 
         -se správcem]</span></p>                                        
      58 +<p>Předávání údajů mimo EU a&nbsp;jeho základ: <span class="dop
         +lni">doplní správce po konzultaci s&nbsp;právníkem</span>.</p> 
      59  
      60  <h2>Tvoje práva</h2>
      54 -<p>Máš právo na přístup ke svým údajům (čl. 15 GDPR), na jejich
         - opravu (čl. 16), výmaz (čl. 17), omezení zpracování (čl. 18), 
         -přenositelnost (čl. 20) a vznést námitku (čl. 21). Pokud si mys
         -líš, že s údaji nezacházíme správně, můžeš podat stížnost u Úřa
         -du pro ochranu osobních údajů (<a href="https://uoou.gov.cz/">u
         -oou.gov.cz</a>, čl. 77 GDPR).</p>                              
      61 +<p>Máš právo na přístup ke svým údajům (čl.&nbsp;15 GDPR), na j
         +ejich opravu (čl.&nbsp;16), výmaz (čl.&nbsp;17), omezení zpraco
         +vání (čl.&nbsp;18), přenositelnost (čl.&nbsp;20) a&nbsp;vznést 
         +námitku (čl.&nbsp;21). Pokud si myslíš, že s&nbsp;údaji nezachá
         +zíme správně, můžeš podat stížnost u&nbsp;Úřadu pro ochranu oso
         +bních údajů (<a href="https://uoou.gov.cz/">uoou.gov.cz</a>, čl
         +.&nbsp;77 GDPR).</p>                                           
      62  
      63  <h2>Cookies</h2>
      64  <p>Stránka nepoužívá cookies ani neukládá nic do tvého prohlíže
          če.</p>
      65  
      59 -<p><small>Návrh ze dne 10. 10. 2026.</small></p>               
      66 +<p class="zdroj">Návrh ze dne 11.&nbsp;10.&nbsp;2026.</p>      
      67  </main>
      68  </body>
      69  </html>

⏺ Odkazy na favicon patří až do bodu 5, kdy soubory vzniknou. V tomhle commitu
  nechám původní favicon. Pak zkontroluji, jestli testy něco z návrhu zásad
  nevyžadují.

⏺ Bash(python3 - <<'EOF'
      p='public/ochrana-osobnich-udaju.html';
      s=open(p,encoding='utf-8').read()…)
  ⎿  Updated public/ochrana-osobnich-udaju.html (+1 -3)
       7  <meta name="robots" content="noindex">
       8  <meta name="theme-color" content="#FFFDF5">
       9  <meta name="color-scheme" content="only light">
      10 -<link rel="icon" href="/favicon.svg" type="image/svg+xml">     
      11 -<link rel="icon" href="/favicon.ico" sizes="32x32">            
      12 -<link rel="apple-touch-icon" href="/apple-touch-icon.png">     
      10 +<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://
         +www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' h
         +eight='32' rx='7' fill='%231A1A1A'/%3E%3Cpath d='M7 21h8M17 21h
         +8' stroke='%23FFE45C' stroke-width='3' stroke-linecap='round'/%
         +3E%3Cpath d='M8 10h6M18 10h6' stroke='%23fff' stroke-width='3' 
         +stroke-linecap='round'/%3E%3C/svg%3E">                         
      11  <style>
      12  :root{color-scheme:only light}
      13  body{margin:0;background:#FFFDF5;color:#141414;font:400 1rem/1.
          6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica
           Neue",Arial,sans-serif;-webkit-text-size-adjust:100%}

⏺ Přidám test stránky zásad a do README sekci „Před spuštěním kampaně“ se všemi
  otevřenými body.

⏺ Bash(python3 - <<'EOF'
      def edit(p, pairs):…)
  ⎿  Updated CLAUDE.md (+1 -1)
      54  - **Reklamy:** A „Dvojče“ (zklamání z brokera) a B „Začátek“ (n
          ejistota). Úvod stránky se mění podle `?v=dvojce` / `?v=zacatek
          `. Proč: testujeme dvě motivace a úvod musí navazovat na slib r
          eklamy.
      55  - **Formulář se otevírá na místě:** pod lístky (výzva se ukáže 
          po prvním otočení), nebo jako panel ze spodního tlačítka, nikdy
           odkazem dolů. Proč: méně kroků, návštěvník neztratí kontext.
      56  - **Brokery na stránce jmenujeme jen s ověřenou dostupností** (
          zdroj a datum v `data/etf.json`). Proč: jeden jmenovaný broker 
          by vypadal jako jeho reklama.
      57 -- **Správce osobních údajů: Clientelo Czech s.r.o.** Je to před
         -poklad zadavatele, ne ověřený údaj (poznámka je v README). IČO,
         - sídlo a kontakt jsou TODO v návrhu `public/ochrana-osobnich-ud
         -aju.html`. Proč: viditelné placeholdery na stránce působí nedod
         -ělaně.                                                         
      57 +- **Správce osobních údajů: Clientelo Czech s.r.o.** Je to před
         +poklad zadavatele, ne ověřený údaj (poznámka je v README). IČO 
         +a sídlo jsou z ARES (ověřeno 11. 10. 2026), kontakt a další ote
         +vřená místa jsou v návrhu `public/ochrana-osobnich-udaju.html` 
         +nenápadně jako „doplní správce“ a sepsaná v README v sekci „Pře
         +d spuštěním kampaně“. Proč: žluté TODO na stránce působí nedodě
         +laně.                                                          
      58  - **Zásady ochrany osobních údajů jsou jen návrh.** Stránka je 
          jasně označená a má `noindex`. Před spuštěním ji musí schválit 
          právník.
      59  - **Supabase projekt v EU regionu.** Proč: ukládáme e-maily čes
          kých návštěvníků a databáze má být blízko funkcím ve Frankfurtu
          .
      60  - **Denní keep-alive přes Vercel cron.** Proč: bezplatný Supaba
          se projekt se po čase bez aktivity pozastaví a hodnotitel může 
          stránku otevřít až za dva týdny.
  ⎿  Updated README.md (+21 -1)
      124  - **Co je „kontakt“:** jen e-mail, žádný telefon. Zadání chce 
           co nejméně polí a e-mail stačí k doručení toho, co návštěvníko
           vi slibujeme.
      125  - **Co je konverze:** návštěva → odeslaný formulář. Oba konce 
           trychtýře změříme vlastním měřením, bez dat z reklamního systé
           mu.
      126  - **Měření celé cesty bez cookie lišty:** vlastní anonymní eve
           nty (příchod, hloubka scrollu, interakce s prvky, otevření for
           muláře, odeslání) ukládané do Supabase, místo GA4. ID návštěvy
            existuje jen v paměti po dobu jednoho načtení stránky a do pr
           ohlížeče se nic neukládá. GA4 by potřebovalo souhlas a cookie 
           lišta na mobilu zdržuje a ubírá konverze. Trychtýř se počítá S
           QL dotazem.
      127 -- **Správce osobních údajů:** zadání ho neuvádí. Na stránce uv
          -ádím **Clientelo Czech s.r.o.**, ale je to můj předpoklad, ne 
          -ověřený údaj. IČO, sídlo a kontakt chybí. [Zásady ochrany osob
          -ních údajů](public/ochrana-osobnich-udaju.html) jsou jen návrh
          -, jasně tak označený, a před spuštěním je musí schválit právní
          -k.                                                            
      127 +- **Správce osobních údajů:** zadání ho neuvádí. Na stránce uv
          +ádím **Clientelo Czech s.r.o.** Že je správcem právě tahle fir
          +ma, je můj předpoklad. Její údaje jsou ověřené z [ARES](https:
          +//ares.gov.cz/ekonomicke-subjekty?ico=22193456) (obchodní rejs
          +třík, 11. 10. 2026): IČO 22193456, sídlo Platnéřská 90/13, Sta
          +ré Město, 110 00 Praha 1, spisová značka C 412348 u Městského 
          +soudu v Praze. [Zásady ochrany osobních údajů](public/ochrana-
          +osobnich-udaju.html) jsou jen návrh, jasně tak označený, a pře
          +d spuštěním je musí schválit právník. Co v nich chybí, je v se
          +kci [Před spuštěním kampaně](#před-spuštěním-kampaně).        
      128  - **Tón textů:** stránka tyká. Cílovka jsou spíš mladší lidé z
            reklamy na Instagramu a Facebooku, vykání by tam působilo str
           ojeně.
      129  
      130  ## Jak jsem pracoval s AI
     ...
      150  
      151  Varianty úvodu po: [?v=dvojce](docs/screenshots/po-1b-uvod-dvo
           jce.png), [?v=zacatek](docs/screenshots/po-1c-uvod-zacatek.png
           ).
      152  
      153 +## Před spuštěním kampaně                                     
      154 +                                                              
      155 +Co musí doplnit nebo rozhodnout někdo jiný než vývojář. V návr
          +hu zásad jsou tato místa nenápadně označená „doplní správce“. 
      156 +                                                              
      157 +**Správce (Clientelo Czech s.r.o.):**                         
      158 +                                                              
      159 +- kontaktní e-mail pro otázky k osobním údajům,               
      160 +- e-mailová služba pro rozesílání (je to další zpracovatel, pa
          +tří do zásad),                                                
      161 +- nejdelší doba uložení e-mailu,                              
      162 +- jak dlouho Vercel uchovává záznamy o přístupu (IP adresy) na
          + zvoleném tarifu,                                             
      163 +- potvrdit, že e-maily neprodává ani nepředává dalším firmám (
          +pak to doplnit do zásad),                                     
      164 +- přijmout smlouvy o zpracování osobních údajů (DPA) u Supabas
          +e a Vercelu.                                                  
      165 +                                                              
      166 +**Právník:**                                                  
      167 +                                                              
      168 +- jestli smí být tahák podmíněný souhlasem s marketingovými e-
          +maily, nebo má být souhlas dobrovolný a tahák dostane každý (s
          +ouhlas musí být svobodný),                                    
      169 +- právní základ měření bez cookie lišty. Do prohlížeče nic neu
          +kládáme, ale i odesílání dat z prohlížeče může podle výkladu E
          +vropského sboru pro ochranu osobních údajů (pokyny 2/2023) vyž
          +adovat souhlas. Tenhle výklad jsme z primárního zdroje neověřo
          +vali,                                                         
      170 +- předávání údajů mimo EU: Supabase i Vercel jsou americké fir
          +my, i když data a funkce jsou ve Frankfurtu,                  
      171 +- celý návrh [zásad ochrany osobních údajů](public/ochrana-oso
          +bnich-udaju.html) a text souhlasu u formuláře.                
      172 +                                                              
      173  ## Co v řešení chybí
      174  
      175  _TODO: co se nestihlo nebo bylo vědomě vynecháno a co by bylo 
           potřeba před ostrým spuštěním reklamy._
  ⎿  Updated scripts/test-page.mjs (+13 -0)
      244      await page.close();
      245    }
      246  
      247 +  // 9) Návrh zásad ochrany osobních údajů: označený návrh, be
          +z TODO, údaje správce z ARES                                  
      248 +  {                                                           
      249 +    const { page, logs } = await open('ochrana-osobnich-udaju.
          +html');                                                       
      250 +    const t = await page.evaluate(() => document.body.innerTex
          +t);                                                           
      251 +    const robots = await page.$eval('meta[name=robots]', (m) =
          +> m.content).catch(() => null);                               
      252 +    check('zásady: označené jako návrh a noindex', t.includes(
          +'Návrh.') && robots === 'noindex', String(robots));           
      253 +    check('zásady: bez TODO a žlutých bloků', !/TODO/.test(t) 
          +&& !(await page.$('.todo')));                                 
      254 +    check('zásady: IČO, sídlo a region databáze', ['22193456',
          + 'Platnéřská 90/13', 'eu-central-1'].every((x) => t.includes(x
          +)));                                                          
      255 +    check('zásady: otevřená místa jako „doplní správce“', (awa
          +it page.$$('.doplni')).length >= 5);                          
      256 +    check('zásady: bez chyb v konzoli', !realErrors(logs).leng
          +th, realErrors(logs).map((l) => l.text).join(' | '));         
      257 +    await page.close();                                       
      258 +  }                                                           
      259 +                                                              
      260    // 5) Skryté pole proti botům
      261    {
      262      const { page, logs } = await open();

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Testy prošly (95 kontrol). Rychle se podívám, jak zásady vypadají.

  Read 1 file, called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Vypadá klidně a čitelně. Commituji bod 4.

  Ran 1 shell command (ctrl+o to expand)

⏺ Bod 4 je hotový v commitu 1f5f61f. Teď se pustím do bodu 5 (favicon, sdílecí
  obrázek, color-scheme, přístupnost panelu, šířka 320 px) a nejdřív se podívám
  na strukturu záznamu VOO v data/etf.json, odkud sdílecí obrázek vezme čísla.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Struktura je jasná. Ověřím, jestli je adresa etf-dvojcata.vercel.app volná.
  og:image musí mít absolutní URL, takže na doménu budu potřebovat jeden
  předpoklad.

  Ran 1 shell command (ctrl+o to expand)

⏺ etf-dvojcata.vercel.app vrací 200, takže tam už něco běží. Podívám se co (jen
  titulek a meta tagy, nic neodesílám).

  Called plugin:context-mode:context-mode, ran 1 shell command (ctrl+o to expand)

⏺ Zjistil jsem, že etf-dvojcata.vercel.app patří cizímu projektu, takže ho
  nepoužiji – navrhnu místo toho jméno etf-dvojcata-clientelo a vynechám og:url
  i canonical, aby Facebook nečetl špatnou stránku. Teď připravím skript na
  favicony a sdílecí obrázek.

⏺ Write(scripts/lib/write.mjs)
  ⎿  Wrote 14 lines to scripts/lib/write.mjs
       1 // Zápis přes dočasný soubor ve stejné složce a přejmenování (na
          stejném disku atomické):
         oubor.
       3 import { writeFileSync, renameSync, rmSync } from 'node:fs';
       4 import { basename, dirname, join } from 'node:path';
       6 export function writeAtomic(path, data) {
       7   const tmp = join(dirname(path), `.${basename(path)}.tmp-${proc
         ess.pid}`);
       9     writeFileSync(tmp, data);
      10     renameSync(tmp, path);
     … +7 lines (ctrl+o to expand)

⏺ Bash(python3 - <<'EOF'
      p='scripts/pdf.mjs'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated scripts/pdf.mjs (+3 -14)
       1  // Vygeneruje public/tahak.pdf ze zdroje tahak/tahak.html a dat
           data/etf.json (headless Chrome)
       2  // a náhled první strany public/img/tahak-nahled.webp pro formu
          lář (potřebuje macOS kvůli PDFKit).
       3  // Použití: node pdf.mjs   (po každé změně dat nebo taháku)
       4 -import { readFileSync, statSync, writeFileSync, renameSync, mkd
         -irSync, mkdtempSync, rmSync } from 'node:fs';                  
       4 +import { readFileSync, statSync, mkdirSync, mkdtempSync, rmSync
         + } from 'node:fs';                                             
       5  import { execFileSync } from 'node:child_process';
       6  import { tmpdir } from 'node:os';
       7  import { fileURLToPath, pathToFileURL } from 'node:url';
       8 -import { basename, dirname, join } from 'node:path';           
       8 +import { dirname, join } from 'node:path';                     
       9  import { launch } from './lib/browser.mjs';
      10 +import { writeAtomic } from './lib/write.mjs';                 
      11  
      12  const PREVIEW_W = 480;
      13  const PREVIEW_H = 420;
     ...
      16  const data = JSON.parse(readFileSync(join(root, 'data', 'etf.js
          on'), 'utf8'));
      17  const out = join(root, 'public', 'tahak.pdf');
      18  
      18 -// Zápis přes dočasný soubor ve stejné složce a přejmenování (n
         -a stejném disku atomické):                                     
      19 -// běžící server tak nikdy neuvidí chybějící ani napůl zapsaný 
         -soubor.                                                        
      20 -function writeAtomic(path, data) {                             
      21 -  const tmp = join(dirname(path), `.${basename(path)}.tmp-${pro
         -cess.pid}`);                                                   
      22 -  try {                                                        
      23 -    writeFileSync(tmp, data);                                  
      24 -    renameSync(tmp, path);                                     
      25 -  } finally {                                                  
      26 -    rmSync(tmp, { force: true });                              
      27 -  }                                                            
      28 -}                                                              
      29 -                                                               
      19  const browser = await launch();
      20  try {
      21    const page = await browser.newPage();
⏺ Write(scripts/obrazky.mjs)
  ⎿  Wrote 94 lines to scripts/obrazky.mjs
      1 // Vygeneruje ikony a obrázek pro sdílení do public/ (headless Ch
        rome):
        px), og.png (1200×630, náhled odkazu na Facebooku a v Messengeru)
        .
      3 // Čísla na obrázku pro sdílení bere z data/etf.json (pár VOO → d
      4 // Použití: node obrazky.mjs   (po změně dat nebo vzhledu)
      5 import { readFileSync } from 'node:fs';
      6 import { fileURLToPath } from 'node:url';
      8 import { launch } from './lib/browser.mjs';
      9 import { writeAtomic } from './lib/write.mjs';
     … +140 lines (ctrl+o to expand)

⏺ Bash(cd /Users/daniel/etfLanding/scripts && node obrazky.mjs && ls -la
      ../public/favicon.* ../public/apple-touch-icon.png ../public/og.png &&
      file ../public/favicon.…)
  ⎿  Created public/favicon.svg (+1 -0)
      1 +<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rec
        +t width="32" height="32" rx="7" fill="#141414"/><path d="M6 21c3
        +-1 7-1 10 0M17 21c3-1 6-1 9 0" stroke="#FFE45C" stroke-width="4"
        + stroke-linecap="round"/><path d="M8 11l3 3 6-7" stroke="#39B26B
        +" stroke-width="3" fill="none" stroke-linecap="round" stroke-lin
        +ejoin="round"/></svg>                                           
  ⎿  … 3 more files changed

  Read 2 files (ctrl+o to expand)

⏺ Obrázek pro sdílení skoro sedí. Opravím dvě zalomení: „(VOO: / 3 Kč)“ a
  osamělé „ano.“ v podnadpisu.

⏺ Bash(python3 - <<'EOF'
      p='obrazky.mjs'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated scripts/obrazky.mjs (+4 -3)
      43  .logo{font-weight:800;font-size:30px;letter-spacing:-.01em}
      44  .fix{padding:0 .12em;margin:0 -.06em;background:url("${FIX}") 0
           72%/100% 62% no-repeat}
      45  h1{margin:26px 0 20px;font-size:62px;line-height:1.06;letter-sp
          acing:-.02em;font-weight:800}
      46 -.sub{margin:0;color:#4A4A4A}                                   
      46 +.sub{margin:0;color:#4A4A4A;text-wrap:balance}                 
      47  .right{position:relative}
      48  .orig{display:flex;align-items:center;gap:14px;margin:0 0 18px 
          6px;font-size:40px;font-weight:800;color:#4A4A4A}
      49  .orig s{text-decoration-color:#C62F3B;text-decoration-thickness
          :5px}
     ...
      53  .tk{position:relative;display:inline-block;margin:16px 0 18px 1
          8px;font-size:64px;font-weight:800;line-height:1}
      54  .tk svg{position:absolute;left:-26px;top:-16px;width:calc(100% 
          + 52px);height:calc(100% + 32px);overflow:visible}
      55  .ok{color:#177A41;font-weight:800;font-size:30px}
      56 -.fee{margin-top:12px;font-size:26px;color:#4A4A4A}             
      56 +.fee{margin-top:12px;font-size:26px}                           
      57 +.fee span{display:block;color:#4A4A4A;font-size:22px}          
      58  .stamp{margin:22px 0 0 6px;font-size:20px;color:#4A4A4A}
      59  </style></head><body><div class="wrap">
      60  <div>
     ...
      68      <div class="top">evropské dvojče · ${sameIndex ? 'stejný' :
           'podobný'} index</div>
      69      <div class="tk">${twin.burza.hodnota.ticker}<svg viewBox="0
           0 120 50" preserveAspectRatio="none"><path d="M64 5C95 4 117 1
          3 115 26c-2 13-29 20-58 19C26 44 4 36 5 24 6 12 31 4 70 7" fill
          ="none" stroke="#141414" stroke-width="3" stroke-linecap="round
          " vector-effect="non-scaling-stroke"/></svg></div>
      70      <div class="ok">✓ koupíš u&nbsp;${brokers.join(', ')}</div>
      70 -    <div class="fee">${kc(twin.ter)}&nbsp;Kč ročně z&nbsp;10&nb
         -sp;000&nbsp;Kč (${voo.ticker}: ${kc(voo.ter)}&nbsp;Kč)</div>   
      71 +    <div class="fee">${kc(twin.ter)}&nbsp;Kč ročně z&nbsp;10&nb
         +sp;000&nbsp;Kč <span>${voo.ticker}: ${kc(voo.ter)}&nbsp;Kč</spa
         +n></div>                                                       
      72    </div>
      73    <div class="stamp">Data od správců fondů, ověřeno ${date}</di
          v>
      74  </div>
  ⎿  … 1 more file changed

  Read 1 file (ctrl+o to expand)

⏺ Teď hlavička stránky: ikony, color-scheme, obrázek pro sdílení a aria-modal u
  panelu.

⏺ Bash(cd /Users/daniel/etfLanding && python3 - <<'EOF'
      import re…)
  ⎿  Updated public/index.html (+13 -4)
       9  <meta property="og:description" content="VOO, VT a dalších 5 ET
          F z USA ti broker v Česku často nenabídne. Najdi jejich evropsk
          á dvojčata, která koupíš.">
      10  <meta property="og:type" content="website">
      11  <meta property="og:locale" content="cs_CZ">
      12 +<meta property="og:site_name" content="ETF dvojčata">          
      13 +<!-- og:image musí mít absolutní adresu: po nasazení ji sladit 
         +s doménou na Vercelu (README, Nasazení) -->                    
      14 +<meta property="og:image" content="https://etf-dvojcata-cliente
         +lo.vercel.app/og.png">                                         
      15 +<meta property="og:image:width" content="1200">                
      16 +<meta property="og:image:height" content="630">                
      17 +<meta property="og:image:alt" content="ETF dvojčata: VOO přeškr
         +tnuté, evropské dvojče VUAA, koupíš u XTB a Trading 212, 7 Kč r
         +očně z 10 000 Kč.">                                            
      18 +<meta name="twitter:card" content="summary_large_image">       
      19  <meta name="theme-color" content="#FFFDF5">
      13 -<meta name="color-scheme" content="light">                     
      14 -<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://
         -www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' h
         -eight='32' rx='7' fill='%23141414'/%3E%3Cpath d='M6 21c3-1 7-1 
         -10 0M17 21c3-1 6-1 9 0' stroke='%23FFE45C' stroke-width='4' str
         -oke-linecap='round'/%3E%3Cpath d='M8 11l3 3 6-7' stroke='%2339B
         -26B' stroke-width='3' fill='none' stroke-linecap='round' stroke
         --linejoin='round'/%3E%3C/svg%3E">                              
      20 +<meta name="color-scheme" content="only light">                
      21 +<link rel="icon" href="/favicon.svg" type="image/svg+xml">     
      22 +<link rel="icon" href="/favicon.ico" sizes="32x32">            
      23 +<link rel="apple-touch-icon" href="/apple-touch-icon.png">     
      24  <style>
      16 -:root{--paper:#FFFDF5;--grid:#EDEFF2;--card:#fff;--ink:#141414;
         ---ink-2:#4A4A4A;--line:#D8D4C8;--fix:#FFE45C;--ok:#177A41;--red
         -:#C62F3B;--ease:cubic-bezier(.2,.8,.2,1)}                      
      25 +:root{color-scheme:only light;--paper:#FFFDF5;--grid:#EDEFF2;--
         +card:#fff;--ink:#141414;--ink-2:#4A4A4A;--line:#D8D4C8;--fix:#F
         +FE45C;--ok:#177A41;--red:#C62F3B;--ease:cubic-bezier(.2,.8,.2,1
         +)}                                                             
      26  *,*::before,*::after{box-sizing:border-box}
      27  [hidden]{display:none!important}
      28  html{-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:
          transparent;scroll-behavior:smooth;scroll-padding-top:12px}
     ...
      451    </div>
      452  </div>
      453  
      445 -<dialog class="sheet" id="panel" aria-labelledby="panel-nadpis
          -">                                                            
      454 +<dialog class="sheet" id="panel" aria-modal="true" aria-labell
          +edby="panel-nadpis">                                          
      455    <div class="sheet-in">
      456      <button class="sheet-close" type="button" aria-label="Zavř
           ít" data-zavri>×</button>
      457      <div data-host>
  ⎿  Updated public/ochrana-osobnich-udaju.html (+3 -1)
       7  <meta name="robots" content="noindex">
       8  <meta name="theme-color" content="#FFFDF5">
       9  <meta name="color-scheme" content="only light">
      10 -<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://
         -www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' h
         -eight='32' rx='7' fill='%231A1A1A'/%3E%3Cpath d='M7 21h8M17 21h
         -8' stroke='%23FFE45C' stroke-width='3' stroke-linecap='round'/%
         -3E%3Cpath d='M8 10h6M18 10h6' stroke='%23fff' stroke-width='3' 
         -stroke-linecap='round'/%3E%3C/svg%3E">                         
      10 +<link rel="icon" href="/favicon.svg" type="image/svg+xml">     
      11 +<link rel="icon" href="/favicon.ico" sizes="32x32">            
      12 +<link rel="apple-touch-icon" href="/apple-touch-icon.png">     
      13  <style>
      14  :root{color-scheme:only light}
      15  body{margin:0;background:#FFFDF5;color:#141414;font:400 1rem/1.
          6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica
           Neue",Arial,sans-serif;-webkit-text-size-adjust:100%}

⏺ V og:image:alt nechci natvrdo čísla, která by po změně dat zastarala. Pak
  zkontroluji šířku 320 px očima: úvod, otočený lístek se třemi brokery, karty,
  formulář.

⏺ Bash(python3 - <<'EOF'
      p='public/index.html'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated public/index.html (+1 -1)
      14  <meta property="og:image" content="https://etf-dvojcata-cliente
          lo.vercel.app/og.png">
      15  <meta property="og:image:width" content="1200">
      16  <meta property="og:image:height" content="630">
      17 -<meta property="og:image:alt" content="ETF dvojčata: VOO přeškr
         -tnuté, evropské dvojče VUAA, koupíš u XTB a Trading 212, 7 Kč r
         -očně z 10 000 Kč.">                                            
      17 +<meta property="og:image:alt" content="ETF dvojčata: k americké
         +mu VOO jeho evropské dvojče VUAA, u kterých brokerů ho koupíš a
         + kolik stojí.">                                                
      18  <meta name="twitter:card" content="summary_large_image">
      19  <meta name="theme-color" content="#FFFDF5">
      20  <meta name="color-scheme" content="only light">

  Read 2 files, called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Na 320 px jsem objevil skutečnou vadu: zadní strana lístku se třemi brokery
  přetéká a „3 Kč ročně“ zasahuje do další řady, protože test hlídal jen šířku.
  Opravím to tak, že líc a rub budou ve stejné buňce mřížky, čímž výška lístku
  bude podle delší strany a obsah nikdy nepřeteče.

⏺ Bash(python3 - <<'EOF'
      p='public/index.html'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated public/index.html (+5 -4)
      49  .note{font-size:.875rem;color:var(--ink-2);margin:0}
      50  .picker-label{display:flex;flex-wrap:wrap;align-items:baseline;
          gap:4px 10px;font-weight:700;margin:18px 0 12px}
      51  .hint{font-weight:400;font-size:.875rem;color:var(--ink-2)}
      52 -/* lístky z taháku: po klepnutí se otočí (jen CSS), vzadu je dv
         -ojče */                                                        
      52 +/* lístky z taháku: po klepnutí se otočí (jen CSS), vzadu je dv
         +ojče; líc a rub jsou ve stejné buňce mřížky,                   
      53 +   takže lístek je vysoký podle delší strany a na úzkém displej
         +i nic nepřeteče */                                             
      54  .listky{display:grid;grid-template-columns:1fr 1fr;gap:12px 10p
          x}
      54 -.listek{position:relative;display:block;height:124px;color:var(
         ---ink);text-decoration:none;perspective:900px;transform:rotate(
         -var(--r,0deg));touch-action:manipulation;-webkit-user-select:no
         -ne;user-select:none;-webkit-touch-callout:none}                
      55 +.listek{position:relative;display:grid;min-height:124px;color:v
         +ar(--ink);text-decoration:none;perspective:900px;transform:rota
         +te(var(--r,0deg));touch-action:manipulation;-webkit-user-select
         +:none;user-select:none;-webkit-touch-callout:none}             
      56  .listek.paska::before{content:"";position:absolute;z-index:2;to
          p:-6px;left:50%;width:40px;height:13px;margin-left:-20px;backgr
          ound:rgba(214,203,168,.55);transform:rotate(-2deg)}
      56 -.listek-in{position:relative;display:block;height:100%;transfor
         -m-style:preserve-3d;transition:transform .45s var(--ease)}     
      57 +.listek-in{position:relative;display:grid;transform-style:prese
         +rve-3d;transition:transform .45s var(--ease)}                  
      58  .listek[aria-pressed="true"] .listek-in{transform:rotateY(180de
          g)}
      59  .listek:active .lice{transform:scale(.98)}
      60  .listek:active .rub{transform:rotateY(180deg) scale(.98)}
      61  /* backface-visibility WebKit respektuje jen při hardwarovém sk
          ládání vrstev; pojistka: líc a rub se přepnou
      62     viditelností v půlce otočení (lístek je v tu chvíli z boku) 
          */
      62 -.lice,.rub{position:absolute;inset:0;display:flex;flex-directio
         -n:column;padding:12px;border:1.5px solid var(--ink);border-radi
         -us:6px;background:var(--card);-webkit-backface-visibility:hidde
         -n;backface-visibility:hidden;box-shadow:2px 3px 0 rgba(20,20,20
         -,.08);transition:transform .1s var(--ease),visibility 0s .22s} 
      63 +.lice,.rub{grid-area:1/1;display:flex;flex-direction:column;pad
         +ding:12px;border:1.5px solid var(--ink);border-radius:6px;backg
         +round:var(--card);-webkit-backface-visibility:hidden;backface-v
         +isibility:hidden;box-shadow:2px 3px 0 rgba(20,20,20,.08);transi
         +tion:transform .1s var(--ease),visibility 0s .22s}             
      64  .rub{transform:rotateY(180deg);padding:9px 11px;visibility:hidd
          en}
      65  .listek[aria-pressed="true"] .rub{visibility:visible}
      66  .listek[aria-pressed="true"] .lice{visibility:hidden}

⏺ Do WebKit testu přidám kontrolu, že obsah žádné strany lístku nepřetéká ani
  svisle, na všech třech šířkách.

⏺ Update(scripts/test-webkit.mjs)
  ⎿  Added 2 lines
      186        await sleep(550);
      187        // rub neotočených lístků nesmí prosvítat (headless WebK
           it nerespektuje backface-visibility)
      188        const faces = await page.$$eval('.listek', (ls) => ls.ma
           p((l) => `${l.dataset.etf}:${getComputedStyle(l.querySelector(
           '.lice')).visibility[0]}${getComputedStyle(l.querySelector('.r
           ub')).visibility[0]}`));
      189 +      const spill = await page.$$eval('.lice, .rub', (fs) => f
          +s.filter((f) => f.scrollHeight - f.clientHeight > 1).map((f) =
          +> `${f.closest('.listek').dataset.etf}:${f.className} ${f.scro
          +llHeight}/${f.clientHeight}`));                               
      190 +      check(`${tag}: obsah lístků (líc i rub) se vejde, nic ne
          +přetéká dolů`, !spill.length, spill.join(', '));              
      191        check(`${tag}: viditelný jen líc, u otočeného jen rub`, 
           faces.every((f) => f.startsWith('VWO') ? f.endsWith('hv') : f.
           endsWith('vh')), faces.join(' '));
      192        const over = await page.evaluate(() => {
      193          const W = document.documentElement.clientWidth;

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Test na staré verzi chybu zachytí (na 320 px přetékal rub všech 7 lístků), na
  nové projde. Na 375 px zůstává výška lístků stejná. Podívám se ještě na 320 px
  očima.

  Read 2 files (ctrl+o to expand)

⏺ Na 320 px je vše v pořádku. Do testu v Chromu doplním kontrolu ikon, obrázku
  pro sdílení, color-scheme a ovládání panelu klávesnicí (Enter otevře, Tab
  zůstane v panelu, Esc zavře a vrátí fokus).

⏺ Bash(python3 - <<'EOF'
      p='scripts/test-page.mjs'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated scripts/test-page.mjs (+43 -0)
      257      await page.close();
      258    }
      259  
      260 +  // 10) Hlavička: ikony, obrázek pro sdílení, jen světlé barv
          +y                                                             
      261 +  {                                                           
      262 +    const { page } = await open();                            
      263 +    const head = await page.evaluate(async () => {            
      264 +      const attr = (sel, a) => (document.querySelector(sel) ||
          + { getAttribute: () => null }).getAttribute(a);               
      265 +      const status = async (u) => { const r = await fetch(u); 
          +return `${u} ${r.status} ${r.headers.get('content-type')}`; };
      266 +      const og = await createImageBitmap(await (await fetch('/
          +og.png')).blob());                                            
      267 +      return {                                                
      268 +        scheme: attr('meta[name=color-scheme]', 'content'), cs
          +s: getComputedStyle(document.documentElement).colorScheme,    
      269 +        ogImage: attr('meta[property="og:image"]', 'content'),
          + ogSize: `${og.width}×${og.height}`,                          
      270 +        files: await Promise.all(['/favicon.svg', '/favicon.ic
          +o', '/apple-touch-icon.png', '/og.png'].map(status)),         
      271 +        modal: attr('#panel', 'aria-modal'),                  
      272 +      };                                                      
      273 +    });                                                       
      274 +    check('color-scheme jen světlé (tmavý režim iOS nic nepřeb
          +arví)', head.scheme === 'only light' && head.css.includes('onl
          +y'), `${head.scheme} / ${head.css}`);                         
      275 +    check('favicon, ikona pro iOS a obrázek pro sdílení existu
          +jí', head.files.every((f) => / 200 (image|text)/.test(f)), hea
          +d.files.join(' | '));                                         
      276 +    check('og:image: absolutní https adresa, 1200×630', /^http
          +s:\/\/[^/]+\/og\.png$/.test(head.ogImage) && head.ogSize === '
          +1200×630', `${head.ogImage} ${head.ogSize}`);                 
      277 +    check('panel má aria-modal', head.modal === 'true');      
      278 +    await page.close();                                       
      279 +  }                                                           
      280 +                                                              
      281 +  // 11) Panel z klávesnice (počítač bez dotyku): Enter otevře
          +, fokus v poli, Tab zůstane v panelu, Esc zavře a vrátí fokus 
      282 +  {                                                           
      283 +    const page = await browser.newPage();                     
      284 +    await page.setViewport({ width: 1024, height: 768 });     
      285 +    await page.goto(BASE, { waitUntil: 'networkidle0' });     
      286 +    await page.evaluate(() => document.getElementById('pary').
          +scrollIntoView({ behavior: 'instant' }));                     
      287 +    await sleep(400);                                         
      288 +    const y0 = await page.evaluate(() => Math.round(scrollY));
      289 +    await page.focus('[data-otevri="lista"]');                
      290 +    await page.keyboard.press('Enter');                       
      291 +    await sleep(400);                                         
      292 +    check('klávesnice: Enter otevře panel a fokus je v poli e-
          +mail', await page.evaluate(() => document.getElementById('pane
          +l').open && document.activeElement.name === 'email'));        
      293 +    let inside = true;                                        
      294 +    for (let i = 0; i < 4; i++) { await page.keyboard.press('T
          +ab'); inside = inside && await page.evaluate(() => document.ge
          +tElementById('panel').contains(document.activeElement)); }    
      295 +    check('klávesnice: Tab zůstává v panelu', inside);        
      296 +    await page.keyboard.press('Escape');                      
     … 9 more lines (ctrl+o to expand)

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Zjistil jsem, že Tab z posledního prvku panelu unikne mimo dialog do lišty
  prohlížeče. Doplním zacyklení fokusu – z posledního prvku na první a se
  Shiftem obráceně.

⏺ Update(public/index.html)
  ⎿  Added 8 lines
      745    doc.querySelectorAll('[data-otevri="lista"], [data-otevri="k
           arty"]').forEach(function (el) {
      746      el.addEventListener('click', function (e) { e.preventDefau
           lt(); openSheet(el.getAttribute('data-otevri'), el); });
      747    });
      748 +  // Tab v panelu dokola: z posledního prvku na první (a se Sh
          +iftem obráceně), fokus neuteče do prohlížeče                  
      749 +  dialog.addEventListener('keydown', function (e) {           
      750 +    if (e.key !== 'Tab') return;                              
      751 +    var f = [].filter.call(dialog.querySelectorAll('button, a[
          +href], input:not([tabindex="-1"])'), function (el) { return !e
          +l.disabled && el.getClientRects().length; });                 
      752 +    var i = f.indexOf(doc.activeElement);                     
      753 +    if (!e.shiftKey && i === f.length - 1) { e.preventDefault(
          +); f[0].focus(); }                                            
      754 +    else if (e.shiftKey && i === 0) { e.preventDefault(); f[f.
          +length - 1].focus(); }                                        
      755 +  });                                                         
      756    dialog.querySelector('[data-zavri]').addEventListener('click
           ', function () { dialog.close(); });
      757    dialog.addEventListener('click', function (e) { if (e.target
            === dialog) dialog.close(); });
      758    dialog.addEventListener('close', function () {

⏺ Bash(python3 - <<'EOF'
      p='scripts/test-page.mjs'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated scripts/test-page.mjs (+3 -2)
      291      await sleep(400);
      292      check('klávesnice: Enter otevře panel a fokus je v poli e-
           mail', await page.evaluate(() => document.getElementById('pane
           l').open && document.activeElement.name === 'email'));
      293      let inside = true;
      294 -    for (let i = 0; i < 4; i++) { await page.keyboard.press('T
          -ab'); inside = inside && await page.evaluate(() => document.ge
          -tElementById('panel').contains(document.activeElement)); }    
      295 -    check('klávesnice: Tab zůstává v panelu', inside);        
      294 +    for (let i = 0; i < 7; i++) { await page.keyboard.press('T
          +ab'); inside = inside && await page.evaluate(() => document.ge
          +tElementById('panel').contains(document.activeElement)); }    
      295 +    for (let i = 0; i < 7; i++) { await page.keyboard.down('Sh
          +ift'); await page.keyboard.press('Tab'); await page.keyboard.u
          +p('Shift'); inside = inside && await page.evaluate(() => docum
          +ent.getElementById('panel').contains(document.activeElement));
          + }                                                            
      296 +    check('klávesnice: Tab i Shift+Tab zůstávají v panelu', in
          +side);                                                        
      297      await page.keyboard.press('Escape');
      298      await sleep(300);
      299      const after = await page.evaluate(() => ({ open: document.
           getElementById('panel').open, focus: document.activeElement.ge
           tAttribute('data-otevri'), y: Math.round(scrollY) }));

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Všechny testy prošly (Chrome 102 kontrol, WebKit 72). Doplním dokumentaci k
  bodu 5 a commitnu.

  Ran 1 shell command (ctrl+o to expand)

⏺ Bash(python3 - <<'EOF'
      def edit(p, pairs):…)
  ⎿  Updated CLAUDE.md (+1 -0)
      19  public/        web – jediná složka, kterou Vercel servíruje
      20    index.html   celá stránka; CSS a JS jsou inline (jeden požada
          vek)
      21    tahak.pdf    lead magnet, generovaný (needitovat ručně)
      22 +  favicon.*, apple-touch-icon.png, og.png   ikony a obrázek pro
         + sdílení, generuje scripts/obrazky.mjs                         
      23    ochrana-osobnich-udaju.html   návrh zásad (musí schválit práv
          ník)
      24  api/           serverless funkce (zpracování formuláře)
      25  tahak/         zdroj PDF taháku (tahak.html), generuje scripts/
          pdf.mjs
  ⎿  Updated README.md (+7 -0)
      82  
      83  - **Celá stránka je jeden soubor `public/index.html`** s inline
           CSS a JS a systémovým písmem. Bez externích skriptů a písem: 4
          9 kB, po gzipu 13,6 kB, z toho JS 3,8 kB. Jediný obrázek je náh
          led taháku (WebP, 24 kB), který se načte až u formuláře. Lighth
          ouse po předělání designu (mobil, 10. 10. 2026, lokálně): 100 v
          e všech čtyřech kategoriích (výkon, přístupnost, osvědčené post
          upy, SEO) u všech tří verzí úvodu, LCP 1,0 s, CLS 0.
      84  - **„Ručně kreslené“ prvky bez písma navíc.** Fix, šipky, krouž
          ky a fajfky jsou malá inline SVG. Rukou psané písmo by přidalo 
          desítky kB a probliknutí textu. Lístky se otáčejí jen přes CSS 
          a při `prefers-reduced-motion` se jen vymění obsah.
      85 +- **Ikony a obrázek pro sdílení generuje skript** ([scripts/obr
         +azky.mjs](scripts/obrazky.mjs)) ve stylu stránky a s čísly z `d
         +ata/etf.json`: favicon (SVG a ICO), ikona pro iOS a `og.png` 12
         +00×630 pro náhled odkazu na Facebooku a v Messengeru. Stránka s
         +i je nenačítá, takže nezdržují.                                
      86 +- **Jen světlé barvy** (`color-scheme: only light`). Tmavý reži
         +m iOS ani automatické ztmavení v Chromu stránku nepřebarví, „se
         +šit“ zůstane papírový.                                         
      87 +- **Panel s formulářem je přístupný z klávesnice.** Je to nativ
         +ní modální `<dialog>` s `aria-modal`: Tab a Shift+Tab zůstávají
         + v panelu, Esc ho zavře a fokus se vrátí na tlačítko, které ho 
         +otevřelo.                                                      
      88  - **Funguje i bez JavaScriptu.** Obsah je v HTML a tlačítka výb
          ěru jsou odkazy na karty párů. JS jen přidává výsledek na místě
          , formulář na místě a lištu dole.
      89  - **Úvod podle reklamy:** malý inline skript hned za nadpisem p
          řepíše nadpis podle `?v=` dřív, než se stránka vykreslí, takže 
          se layout neposune (CLS 0 i u varianty s poznámkou navíc).
      90  - **Supabase projekt v EU regionu.** Ukládáme e-maily českých n
          ávštěvníků a databáze má být blízko serverless funkcím ve Frank
          furtu.
     ...
      173  - předávání údajů mimo EU: Supabase i Vercel jsou americké fir
           my, i když data a funkce jsou ve Frankfurtu,
      174  - celý návrh [zásad ochrany osobních údajů](public/ochrana-oso
           bnich-udaju.html) a text souhlasu u formuláře.
      175  
      176 +**Po nasazení (vývojář):**                                    
      177 +                                                              
      178 +- sladit adresu v `og:image` v `public/index.html` se skutečno
          +u doménou. Je tam `https://etf-dvojcata-clientelo.vercel.app/o
          +g.png`, protože `etf-dvojcata.vercel.app` už používá cizí proj
          +ekt. Pak odkaz zkontrolovat v [nástroji pro ladění sdílení od 
          +Facebooku](https://developers.facebook.com/tools/debug/).     
      179 +                                                              
      180  ## Co v řešení chybí
      181  
      182  _TODO: co se nestihlo nebo bylo vědomě vynecháno a co by bylo 
           potřeba před ostrým spuštěním reklamy._
  ⎿  Updated scripts/README.md (+1 -0)
      36  node lighthouse.mjs                # Lighthouse (mobil) pro vše
          chny verze úvodu
      37  node screenshots.mjs po            # snímky do docs/screenshots
          /po-*.png
      38  node pdf.mjs                       # vygeneruje public/tahak.pd
          f z tahak/tahak.html a data/etf.json
      39 +node obrazky.mjs                   # favicony a obrázek pro sdí
         +lení public/og.png (1200×630) z data/etf.json                  
      40  cd ..
      41  python3 scripts/check_pdf.py       # PDF obsahuje správné ISINy
          , poplatky a brokery (macOS, PDFKit)
      42  swift scripts/pdf-to-png.swift public/tahak.pdf /tmp/tahak 700 
            # stránky PDF jako PNG ke kontrole
  ⎿  Updated texty.md (+4 -0)
      23  - **`<title>`:** Evropská dvojčata amerických ETF | ETF dvojčat
          a
      24  - **Meta description a OG popis:** VOO, VT a dalších 5 ETF z US
          A ti broker v Česku často nenabídne. Najdi jejich evropská dvoj
          čata, která koupíš.
      25    `[r: PRIIPs]` `[d: * › ucits_obdoba.kde_koupit.xtb_cz]`
      26 +- **Obrázek pro sdílení (og:image, 1200×630, `public/og.png`, g
         +eneruje `scripts/obrazky.mjs`):**                              
      27 +  - vlevo: logo, nadpis „Najdi evropské dvojče k VOO, VT a dalš
         +ím ETF z USA“ (fix na „dvojče“), podnadpis „Americká ti broker 
         +často nenabídne, evropská ano.“                                
      28 +  - vpravo: přeškrtnuté VOO → lístek s dvojčetem VUAA v kroužku
         +, „✓ koupíš u XTB, Trading 212“, „7 Kč ročně z 10 000 Kč“, „VOO
         +: 3 Kč“, pod ním „Data od správců fondů, ověřeno 10. 10. 2026“.
         + Čísla a brokery skript bere z `data/etf.json`. `[d: VOO › ucit
         +s_obdoba.ter]` `[d: VOO › ter]` `[d: VOO › ucits_obdoba.kde_kou
         +pit]`                                                          
      29 +  - alt: ETF dvojčata: k americkému VOO jeho evropské dvojče VU
         +AA, u kterých brokerů ho koupíš a kolik stojí.                 
      30  
      31  ---
      32  

  Ran 1 shell command (ctrl+o to expand)
⏺ Bod 5 je hotový (commit 59f299e). Teď si ověřím pár věcí v dokumentaci k
  Vercelu a Supabase (funkce, outputDirectory, cron a CRON_SECRET, nové klíče
  Supabase, uspávání projektů), než napíšu funkce a vercel.json.

  Called plugin:context-mode:context-mode 5 times (ctrl+o to expand)

⏺ Potvrdil jsem, že sb_secret_… patří do hlavičky apikey, ne do Authorization:
  Bearer, kterou prohlížeč i Supabase odmítnou, a že Vercel na free tarifu
  posílá CRON_SECRET přes Bearer a spouští cron jen jednou denně. Dál
  zkontroluji vercel.json (výstupní složka, regiony) a chování Supabase při
  uspávání.

  Called plugin:context-mode:context-mode 3 times (ctrl+o to expand)

⏺ Zbývá ověřit, že Vercel chápe soubory v api/ začínající podtržítkem jako
  pomocné, ne jako endpointy. Poté sepíšu schéma, funkce a testy.

  Called plugin:context-mode:context-mode 2 times (ctrl+o to expand)

⏺ Že Vercel přeskakuje soubory s podtržítkem, tyhle stránky dokumentace
  nepotvrzují. Zkusím hlavní stránku o funkcích. Kdyby to nevyšlo, sdílený kód
  do api/ nedám.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Potvrzeno: web standard funkce v api/ s vlastní logikou,
  outputDirectory/regions/crons v vercel.json, CRON_SECRET a hlavička apikey s
  klíčem sb_secret_…; interval neaktivity Supabase nebudu uvádět, protože ho
  dokumentace nespecifikuje. Teď vytvořím schéma, trychtýř, funkce a
  vercel.json.

⏺ Write(supabase/schema.sql)
  ⎿  Wrote 40 lines to supabase/schema.sql
       1 -- Tabulky pro ETF dvojčata. Spusť jednou v Supabase: SQL Editor
       2 -- Skript jde pustit znovu, nic nesmaže.
       3 --
         t_…, role service_role, ta RLS obchází).
         publishable klíč) nesmí nic číst ani
       6 -- zapisovat: RLS je zapnuté, žádná politika neexistuje a práva
       7
       8 -- Kontakty: e-mail, souhlas, čas souhlasu a verze úvodu z ?v=.
       9 create table if not exists public.leads (
         ey,
     … +48 lines (ctrl+o to expand)

⏺ Write(supabase/funnel.sql)
  ⎿  Wrote 64 lines to supabase/funnel.sql
       1 -- Trychtýř po krocích zvlášť pro každou verzi úvodu (?v=): příc
       2 -- Spusť v Supabase: SQL Editor → vlož celý soubor → Run. Pak kd
         ykoli: select * from analytika.trychtyr;
       4 -- Pohled je ve vlastním schématu „analytika“, které Supabase AP
       5 -- se ptá (security_invoker). Přes publishable klíč ho tedy nikd
         o nepřečte.
       7 -- Sloupce:
       8 --   navstev            kolik návštěv krok udělalo (v libovolném
       9 --   navstev_postupne   kolik návštěv udělalo tenhle krok i všec
      10 --   pct_z_prichodu     navstev / návštěvy s příchodem
     … +73 lines (ctrl+o to expand)

⏺ Write(api/lead.js)
  ⎿  Wrote 85 lines to api/lead.js
      1 // POST /api/lead – uloží e-mail a souhlas do Supabase (tabulka l
        eads).
        _URL, SUPABASE_SECRET_KEY), nikdy v odpovědi ani v logu.
      3 // Funkce nepřijme ID návštěvy ani nic jiného navíc: e-mail se s
        měřením nikdy nespojuje.
      5
      6 const MAX_BYTES = 1024;
      7 const VARIANTY = ['vychozi', 'dvojce', 'zacatek'];
        ryté pole proti botům
      9 const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
     … +102 lines (ctrl+o to expand)

⏺ Bash(sed -i '' 's/cizíPuvod/ciziPuvod/g' api/lead.js && grep -c "ciziPuvod"
      api/lead.js)
  ⎿  Updated api/lead.js (+2 -2)
      31  }
      32  
      33  // Požadavek z cizí stránky (formulář jinde, který posílá sem) 
          odmítneme. Roboti hlavičku zfalšují, běžný prohlížeč ne.
      34 -function cizíPuvod(request) {                                  
      34 +function ciziPuvod(request) {                                  
      35    const origin = request.headers.get('origin');
      36    if (!origin) return false;
      37    const host = request.headers.get('x-forwarded-host') || reque
          st.headers.get('host');
     ...
      41  export default {
      42    async fetch(request) {
      43      if (request.method !== 'POST') return new Response(null, { 
          status: 405, headers: { Allow: 'POST' } });
      44 -    if (cizíPuvod(request)) return odpoved(403, { ok: false, ch
         -yba: 'puvod' });                                               
      44 +    if (ciziPuvod(request)) return odpoved(403, { ok: false, ch
         +yba: 'puvod' });                                               
      45      if (!(request.headers.get('content-type') || '').startsWith
          ('application/json')) return odpoved(415, { ok: false, chyba: '
          typ' });
      46  
      47      const { text, chyba } = await nactiTelo(request, MAX_BYTES)
          ;

⏺ Write(api/event.js)
  ⎿  Wrote 87 lines to api/event.js
       1 // POST /api/event – uloží anonymní událost z cesty návštěvníka
       2 // Přijímá jen ID návštěvy (náhodné UUID z paměti stránky), náze
         v události, verzi úvodu a krátký detail.
         „@“ a neznámá pole funkce odmítne.
         ain.
       5
       7 const VARIANTY = ['vychozi', 'dvojce', 'zacatek'];
       8 const UDALOSTI = [
         ', 'formular_otevren',
         ano', 'tahak_otevren', 'sdileni',
     … +104 lines (ctrl+o to expand)

⏺ Write(api/keepalive.js)
  ⎿  Wrote 31 lines to api/keepalive.js
       1 // GET /api/keepalive – jednou denně ji volá Vercel cron (vercel
       2 // bez návštěv neuspal. Udělá jeden malý dotaz do databáze.
       3 // Vercel posílá hlavičku Authorization: Bearer <CRON_SECRET>; b
       4
       5 const odpoved = (status, data) => Response.json(data, { status,
       6
       7 export default {
       9     if (request.method !== 'GET') return new Response(null, { st
         atus: 405, headers: { Allow: 'GET' } });
         rocess.env;
     … +29 lines (ctrl+o to expand)

⏺ Write(vercel.json)
  ⎿  Wrote 18 lines to vercel.json
       1 {
       2   "$schema": "https://openapi.vercel.sh/vercel.json",
       3   "outputDirectory": "public",
       4   "regions": ["fra1"],
       5   "crons": [
       6     { "path": "/api/keepalive", "schedule": "0 6 * * *" }
       7   ],
       8   "headers": [
       9     {
      10       "source": "/(.*)",
     … +9 lines (ctrl+o to expand)

⏺ Teď kořenový package.json (funkce jsou ES moduly) a .env.example s novými
  názvy proměnných.

⏺ Bash(ls package.json 2>/dev/null; cat > package.json <<'EOF'
      {…)
  ⎿  Updated .env.example (+9 -5)
       1  # Šablona proměnných prostředí – jen názvy, žádné hodnoty.
       2 -# Skutečné hodnoty patří lokálně do .env.local, na Vercelu do E
         -nvironment Variables.                                          
       2 +# Skutečné hodnoty patří lokálně do .env.local (je v .gitignore
         +), na Vercelu do Settings → Environment Variables.             
       3 +# Návod krok za krokem je v README (Nasazení na Supabase a Verc
         +el).                                                           
       4  
       4 -# URL projektu v Supabase                                      
       5 +# URL projektu v Supabase, tvar https://<id-projektu>.supabase.
         +co                                                             
       6  SUPABASE_URL=
       7  
       7 -# Service role (secret) klíč – obchází RLS. Používá ho JEN serv
         -erless funkce v api/,                                          
       8 -# nikdy public/ ani žádný kód, který běží v prohlížeči.        
       9 -SUPABASE_SERVICE_ROLE_KEY=                                     
       8 +# Secret klíč Supabase (sb_secret_…). Obchází Row Level Securit
         +y. Používají ho JEN serverless funkce v api/,                  
       9 +# nikdy public/ ani žádný kód, který běží v prohlížeči. Publish
         +able klíč stránka nepotřebuje vůbec.                           
      10 +SUPABASE_SECRET_KEY=                                           
      11 +                                                               
      12 +# Náhodný řetězec (aspoň 16 znaků) pro Vercel cron. Vercel ho p
         +osílá jako Authorization: Bearer … na /api/keepalive.          
      13 +CRON_SECRET=                                                   
  ⎿  Created package.json (+6 -0)
      1 +{                                                               
      2 +  "name": "etf-dvojcata",                                       
      3 +  "private": true,                                              
      4 +  "type": "module",                                             
      5 +  "description": "Serverless funkce v api/ jsou ES moduly. Web j
        +e ve public/, testy a skripty ve scripts/ (vlastní package.json)
        +."                                                              
      6 +}                                                               

  Ran 1 shell command (ctrl+o to expand)

⏺ Bash(python3 - <<'EOF'
      import re…)
  ⎿  Updated CLAUDE.md (+5 -3)
      21    tahak.pdf    lead magnet, generovaný (needitovat ručně)
      22    favicon.*, apple-touch-icon.png, og.png   ikony a obrázek pro
           sdílení, generuje scripts/obrazky.mjs
      23    ochrana-osobnich-udaju.html   návrh zásad (musí schválit práv
          ník)
      24 -api/           serverless funkce (zpracování formuláře)        
      24 +api/           serverless funkce: lead.js (formulář), event.js 
         +(měření), keepalive.js (cron), každá soběstačná                
      25  tahak/         zdroj PDF taháku (tahak.html), generuje scripts/
          pdf.mjs
      26  scripts/       testy, Lighthouse, snímky obrazovky, generování 
          PDF (návod v scripts/README.md)
      27  docs/screenshots/  snímky obrazovky před a po úpravách
      28  data/          podklady k údajům o ETF: hodnota, zdroj (URL), d
          atum
      29 -supabase/      SQL schéma tabulek a RLS politiky               
      29 +supabase/      SQL: schema.sql (tabulky a RLS), funnel.sql (try
         +chtýř podle verzí úvodu)                                       
      30  reklamy/       obě verze reklamy (texty a vizuály)
      31  ai-log/        exporty konverzací z Claude Code (/export) a den
          ík práce s AI
      32  README.md      dokumentace pro hodnotitele
     ...
      34  tahak.md       osnova PDF taháku a co pro něj chybí
      35  design.md      návrhy směru designu
      36  .env.example   názvy proměnných prostředí bez hodnot
      37 +package.json   jen "type": "module" pro funkce v api/ (bez závi
         +slostí)                                                        
      38 +vercel.json    výstupní složka public/, region fra1, denní cron
      39  ```
      40  
      41  `public/` nastav ve `vercel.json` explicitně jako výstupní slož
          ku, aby se omylem neservíroval celý kořen repa (`ai-log/`, `sup
          abase/`, `CLAUDE.md`). Novou složku v kořeni nezakládej bez dom
          luvy. Když se struktura změní, uprav tuhle sekci.
     ...
      91  ### 3. Klíče a osobní údaje
      92  
      93  - URL a klíče k Supabase jsou jen v proměnných prostředí: na Ve
          rcelu v Environment Variables, lokálně v `.env.local` (je v `.g
          itignore`). Do repa patří jen `.env.example` s názvy proměnných
           bez hodnot.
      92 -- Service role (secret) klíč obchází RLS. Používá se výhradně v
         - `api/`: nikdy v `public/`, nikdy v odpovědi API, nikdy v logu.
      94 +- Secret klíč (`sb_secret_…`, role service_role) obchází RLS. P
         +oužívá se výhradně v `api/` (proměnná `SUPABASE_SECRET_KEY`, po
         +sílá se v hlavičce `apikey`): nikdy v `public/`, nikdy v odpově
         +di API, nikdy v logu. Starý JWT klíč `service_role` Supabase do
         + konce roku 2026 ruší, proto ho nepoužíváme.                   
      95  - Prohlížeč se Supabase nemluví vůbec, data posílá jen na `/api
          /…`. Tabulka s kontakty má zapnuté RLS a žádné veřejné politiky
          .
      96  - Serverless funkce validuje vstup sama (nespoléhá na validaci 
          ve formuláři) a má ochranu proti botům, aspoň honeypot pole.
      97  - Nikdy nevypisuj obsah `.env.local` ani hodnoty klíčů (`cat`, 
          `echo`, logy). Výstup by skončil v exportu konverzace ve veřejn
          ém `ai-log/`.

⏺ Funkce mám hotové. Teď napíšu test scripts/test-api.mjs s podvrženou databází,
  který bez klíčů ověří validaci, honeypot, limity velikosti, chování bez
  databáze a to, že klíč ani e-mail nikdy neskončí v logu nebo v odpovědi.

⏺ API Error: Can't reach the API server — check your internet or DNS
  (ENOTFOUND)

❯ muzes pokracovat kde jsi skoncil. chyba byla na me strane

⏺ Pokračuji bodem 6. Hotové jsou SQL soubory, funkce v api/, vercel.json a
  .env.example. Teď testy funkcí s podvrženou databází.

⏺ Write(scripts/test-api.mjs)
  ⎿  Wrote 178 lines to scripts/test-api.mjs
       1 // Testy serverless funkcí v api/ s podvrženou databází: bez sku
       2 // globalThis.fetch nahradí atrapa Supabase, která si zapisuje,
         co by funkce poslala.
       4 import { readFileSync, readdirSync } from 'node:fs';
       5 import { fileURLToPath } from 'node:url';
       7
       8 const root = join(dirname(fileURLToPath(import.meta.url)), '..')
       9 let fails = 0;
      10 const check = (name, cond, extra = '') => { if (!cond) fails++;
         + extra : ''}`); };
     … +286 lines (ctrl+o to expand)

  Ran 1 shell command (ctrl+o to expand)

⏺ Kontrola veřejných souborů selhává jen na zmínce „Supabase“ v zásadách ochrany
  osobních údajů, kde to slovo patří. Upravím ji tak, aby cílila na adresu
  projektu (supabase.co), klíče a názvy proměnných.

⏺ Bash(python3 - <<'EOF'
      p='test-api.mjs'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated scripts/test-api.mjs (+1 -1)
      168  check('package.json: funkce jsou ES moduly, bez závislostí', p
           kg.type === 'module' && !pkg.dependencies);
      169  
      170  const publicText = readdirSync(join(root, 'public')).filter((f
           ) => /\.(html|js|json|txt)$/.test(f)).map((f) => readFileSync(
           join(root, 'public', f), 'utf8')).join('\n');
      171 -check('public/: žádný odkaz na Supabase ani klíč (prohlížeč ml
          -uví jen s /api/)', !/supabase|sb_secret|sb_publishable|service
          -_role|SUPABASE_/i.test(publicText));                          
      171 +check('public/: žádná adresa Supabase ani klíč (prohlížeč mluv
          +í jen s /api/)', !/supabase\.co|sb_secret|sb_publishable|servi
          +ce_role|SUPABASE_/i.test(publicText));                        
      172  const example = readFileSync(join(root, '.env.example'), 'utf8
           ');
      173  check('.env.example: jen názvy bez hodnot', example.split('\n'
           ).filter((l) => /^[A-Z_]+=/.test(l)).every((l) => /^[A-Z_]+=$/
           .test(l)) && /SUPABASE_SECRET_KEY=/.test(example));
      174  const gitignore = readFileSync(join(root, '.gitignore'), 'utf8
           ');

⏺ Všechny testy funkcí prošly (55 kontrol). Teď spustím lokální server, který
  servíruje public/ a funkce z api/ stejně jako Vercel, s databází v paměti, aby
  bylo možné celé odeslání vyzkoušet i na telefonu.
⏺ Write(scripts/server.mjs)
  ⎿  Wrote 114 lines to scripts/server.mjs
       1 // Lokální server: statické soubory z public/ a funkce z api/ (s
       2 // Bez proměnných SUPABASE_* běží s podvrženou databází v paměti
         : nic se nikam neposílá
         Vercel se tenhle soubor nedostane).
         js  (klíče se nikdy nevypisují)
       5 // Použití: node server.mjs   (HOST=0.0.0.0 pro telefon ve stejn
       6 import { createServer } from 'node:http';
       7 import { readFile, stat } from 'node:fs/promises';
       9 import { dirname, extname, join, normalize, sep } from 'node:pat
      10 import { fileURLToPath, pathToFile
     … +140 lines (ctrl+o to expand)

⏺ Bash(cd /Users/daniel/etfLanding && cat > scripts/serve.sh <<'EOF'
      #!/bin/sh…)
  ⎿  Updated scripts/serve.sh (+2 -3)
      1  #!/bin/sh
      2 -# Lokální server pro složku public/.                            
      2 +# Lokální server: public/ a funkce z api/ s podvrženou databází 
        +v paměti (viz scripts/server.mjs).                              
      3  # Na mobilu ve stejné síti: HOST=0.0.0.0 ./scripts/serve.sh a ot
         evři http://<IP Macu>:8737
      4  # (IP zjistíš příkazem: ipconfig getifaddr en0)
      5 -cd "$(dirname "$0")/../public" || exit 1                        
      6 -exec python3 -m http.server "${PORT:-8737}" --bind "${HOST:-127.
        -0.0.1}"                                                         
      5 +exec node "$(dirname "$0")/server.mjs"                          

⏺ Teď stránka: měření přes sendBeacon na /api/event a odeslání formuláře na
  /api/lead. Přečtu si aktuální JS.

  Searched for 1 pattern, read 1 file (ctrl+o to expand)

⏺ Update(public/index.html)
  ⎿  Added 34 lines, removed 16 lines
      483    var doc = document;
      484    var qs = new URLSearchParams(location.search);
      485    var variant = ['dvojce', 'zacatek'].indexOf(qs.get('v')) >= 
           0 ? qs.get('v') : 'vychozi';
      486 -  var utm = {};                                               
      487 -  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].
          -forEach(function (k) { if (qs.get(k)) utm[k] = qs.get(k); }); 
      488 -  var visitId = window.crypto && crypto.randomUUID ? crypto.ra
          -ndomUUID() : Date.now().toString(36) + Math.random().toString(
          -36).slice(2);                                                 
      486 +  /* ID návštěvy: náhodné UUID jen v paměti tohoto načtení str
          +ánky (nic se neukládá do prohlížeče).                         
      487 +     crypto.randomUUID funguje jen přes https, proto náhrada p
          +řes getRandomValues (třeba telefon v lokální síti). */        
      488 +  function uuid() {                                           
      489 +    if (window.crypto && crypto.randomUUID) return crypto.rand
          +omUUID();                                                     
      490 +    var b = crypto.getRandomValues(new Uint8Array(16));       
      491 +    b[6] = (b[6] & 15) | 64;                                  
      492 +    b[8] = (b[8] & 63) | 128;                                 
      493 +    var h = [].map.call(b, function (x) { return (x + 256).toS
          +tring(16).slice(1); }).join('');                              
      494 +    return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slic
          +e(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20);        
      495 +  }                                                           
      496 +  var visitId = uuid();                                       
      497  
      490 -  /* Měření: zatím jen do konzole, později navigator.sendBeaco
          -n na /api/udalost.                                            
      491 -     ID návštěvy žije jen v paměti tohoto načtení stránky a ni
          -kdy se neposílá s e-mailem. */                                
      492 -  function track(name, data) {                                
      493 -    var e = { udalost: name, navsteva: visitId, varianta: vari
          -ant, cas: new Date().toISOString() };                         
      494 -    var k;                                                    
      495 -    for (k in utm) e[k] = utm[k];                             
      496 -    for (k in data || {}) e[k] = data[k];                     
      497 -    console.log('[měření]', e);                               
      498 +  /* Měření: anonymní událost na /api/event (sendBeacon, strán
          +ku nezdrží). Detail je krátký text bez „@“,                   
      499 +     server jiné odmítne. ID návštěvy se nikdy neposílá s e-ma
          +ilem. */                                                      
      500 +  function track(name, detail) {                              
      501 +    var e = { navsteva: visitId, udalost: name, varianta: vari
          +ant };                                                        
      502 +    detail = String(detail == null ? '' : detail).replace(/[^A
          +-Za-z0-9_:.-]/g, '').slice(0, 40);                            
      503 +    if (detail) e.detail = detail;                            
      504 +    var body = JSON.stringify(e);                             
      505 +    try { if (navigator.sendBeacon && navigator.sendBeacon('/a
          +pi/event', body)) return; } catch (err) { /* fetch níž */ }   
      506 +    if (window.fetch) fetch('/api/event', { method: 'POST', bo
          +dy: body, keepalive: true, headers: { 'Content-Type': 'text/pl
          +ain' } }).catch(function () {});                              
      507    }
      508  
      500 -  /* Odeslání kontaktu: zatím jen do konzole, později POST na 
          -/api/lead.                                                    
      501 -     Záměrně bez ID návštěvy. */                              
      509 +  /* Odeslání kontaktu na /api/lead: jen e-mail, souhlas a ver
          +ze úvodu, záměrně bez ID návštěvy.                            
      510 +     Při chybě vrátí { chyba }: email / souhlas od serveru, ji
          +nak sit nebo server. */                                       
      511    function submitLead(lead) {
      503 -    console.log('[formulář] odeslání (zatím bez serveru):', le
          -ad);                                                          
      504 -    return new Promise(function (resolve) { setTimeout(resolve
          -, 400); });                                                   
      512 +    var ctrl = window.AbortController ? new AbortController() 
          +: null;                                                       
      513 +    var timer = ctrl && setTimeout(function () { ctrl.abort();
          + }, 10000);                                                   
      514 +    return fetch('/api/lead', { method: 'POST', headers: { 'Co
          +ntent-Type': 'application/json' }, body: JSON.stringify(lead),
          + signal: ctrl ? ctrl.signal : undefined })                    
      515 +      .then(function (r) {                                    
      516 +        clearTimeout(timer);                                  
      517 +        if (r.ok) return;                                     
      518 +        return r.json().catch(function () { return {}; }).then
          +(function (d) { throw { chyba: d.chyba || 'server' }; });     
      519 +      }, function () {                                        
      520 +        clearTimeout(timer);                                  
      521 +        throw { chyba: 'sit' };                               
      522 +      });                                                     
      523    }
      524  
      507 -  track('prichod', { sirka: window.innerWidth, ref: qs.get('re
          -f') === 'sdileni' ? 'sdileni' : '' });                        
      525 +  track('prichod', qs.get('ref') === 'sdileni' ? 'sdileni' : q
          +s.get('utm_source'));                                         
      526  
      527    /* Hloubka scrollu: 25, 50, 75 a 100 %, každá jednou. */
      528    var marks = [25, 50, 75, 100];

⏺ Teď převedu volání track() na nový tvar (název + krátký detail) a navážu chyby
  ze serveru na hlášky formuláře.

⏺ Bash(python3 - <<'EOF'
      p='public/index.html'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated public/index.html (+18 -18)
      533      requestAnimationFrame(function () {
      534        ticking = false;
      535        var pct = Math.round((window.scrollY + window.innerHeigh
           t) / doc.documentElement.scrollHeight * 100);
      536 -      while (marks.length && pct >= marks[0]) track('scroll', 
          -{ hloubka: marks.shift() });                                  
      536 +      while (marks.length && pct >= marks[0]) track('scroll', 
          +marks.shift());                                               
      537        if (!marks.length) window.removeEventListener('scroll', 
           onScroll);
      538      });
      539    }
     ...
      574      var on = card.getAttribute('aria-pressed') !== 'true';
      575      picker.classList.remove('peek');
      576      listky.forEach(function (c) { c.setAttribute('aria-pressed
           ', c === card && on ? 'true' : 'false'); });
      577 -    track('otoceni_listku', { etf: etf, strana: on ? 'dvojce' 
          -: 'original' });                                              
      577 +    track('otoceni_listku', etf + ':' + (on ? 'dvojce' : 'orig
          +inal'));                                                      
      578      if (!on) return;
      579      twins.forEach(function (t) { t.hidden = t.getAttribute('da
           ta-etf') !== etf; });
      580      result.hidden = false;
      581      if (cta.hidden && !done) {
      582        cta.hidden = false;
      583 -      track('vyzva_zobrazena', { zdroj: 'listky' });          
      583 +      track('vyzva_zobrazena', 'listky');                     
      584      }
      585    }
      586    listky.forEach(function (card) {
     ...
      609      p.hidden = false;
      610      email.setAttribute('aria-invalid', emailErr ? 'true' : 'fa
           lse');
      611      (emailErr ? email : type === 'souhlas' ? form.elements.con
           sent : form.querySelector('[type=submit]')).focus();
      612 -    track('odeslani_chyba', { typ: type, zdroj: form.getAttrib
          -ute('data-zdroj') });                                         
      612 +    track('odeslani_chyba', type);                            
      613    }
      614  
      615    function bind(form) {
      616      var started = false;
      617      form.addEventListener('focusin', function () {
      618 -      if (!started) { started = true; track('formular_zacatek'
          -, { zdroj: form.getAttribute('data-zdroj') }); }              
      618 +      if (!started) { started = true; track('formular_zacatek'
          +, form.getAttribute('data-zdroj')); }                         
      619      });
      620      form.elements.email.addEventListener('input', function () 
           { form.elements.email.removeAttribute('aria-invalid'); });
      621      form.addEventListener('submit', function (e) {
     ...
      623        var zdroj = form.getAttribute('data-zdroj');
      624        var email = form.elements.email.value.trim();
     … 86 more lines (ctrl+o to expand)

⏺ Bash(python3 - <<'EOF'
      p='public/index.html'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated public/index.html (+1 -1)
      635        submitLead({ email: email, souhlas: consent, varianta: v
           ariant }).then(function () {
      636          track('odeslano', zdroj);
      637          finish(form);
      638 -      }, function () {                                        
      638 +      }, function (err) {                                     
      639          btn.disabled = false;
      640          btn.textContent = label;
      641          showError(form, err.chyba === 'email' ? 'neplatny' : e
           rr.chyba === 'souhlas' ? 'souhlas' : err.chyba === 'sit' && na
           vigator.onLine === false ? 'offline' : 'server');

⏺ Skript stránky je syntakticky v pořádku. Vyměním testovací server: Python
  zastavím a pustím Node server s funkcemi.

  Ran 2 shell commands (ctrl+o to expand)

⏺ Background command "Start local static server on port 8737" failed with exit
code 143

⏺ (To hlášení o selhání je jen ukončení starého Python serveru.) Rychlá zkouška
  nového serveru: stránka, událost, kontakt a co se uložilo.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Server funguje a cesty s .. správně vrací 404 v rámci public/. Teď převedu
  Chrome test tak, aby četl události z odchozích požadavků na /api/event a
  ověřil, co skutečně dorazilo do databáze.

  Searched for 1 pattern, read 1 file (ctrl+o to expand)

⏺ Bash(python3 - <<'EOF'
      p='scripts/test-page.mjs'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated scripts/test-page.mjs (+37 -20)
      1  // Interakční testy stránky v headless Chrome na 375×667 (dotyk)
         . Vypíše OK/CHYBA u každé kontroly.
      2 -// Použití: node test-page.mjs [URL]   (výchozí http://127.0.0.1
        -:8737/, server viz serve.sh)                                    
      2 +// Použití: node test-page.mjs [URL]   (výchozí http://127.0.0.1
        +:8737/, server viz serve.sh – s podvrženou databází)            
      3 +// Události a kontakty čte z odeslaných požadavků na /api/event 
        +a /api/lead a porovnává s tím, co server uložil (/__dev/db).    
      4  // page.evaluate / $eval jsou API puppeteeru (spouští funkci v p
         rohlížeči), ne JS eval().
      5  import { launch, mobilePage, sleep, BASE_URL } from './lib/brows
         er.mjs';
      6  
     ...
      21    page.on('pageerror', (e) => logs.push({ type: 'pageerror', te
          xt: e.message, args: [] }));
      22    page.on('response', (r) => { if (r.status() >= 400) logs.push
          ({ type: 'http', text: `${r.status()} ${new URL(r.url()).pathna
          me}`, args: [] }); });
      23    page.on('request', (r) => logs.push({ type: 'req', text: `${r
          .method()} ${new URL(r.url()).pathname}`, args: [] }));
      24 +  page.on('requestfinished', (r) => {                          
      25 +    const path = new URL(r.url()).pathname;                    
      26 +    if (r.method() !== 'POST' || (path !== '/api/event' && path
         + !== '/api/lead')) return;                                     
      27 +    let data = null;                                           
      28 +    try { data = JSON.parse(r.postData() || 'null'); } catch { 
         +/* nevalidní tělo test odhalí jinde */ }                       
      29 +    logs.push({ type: path === '/api/event' ? 'event' : 'lead',
         + text: path, data, status: r.response() && r.response().status(
         +) });                                                          
      30 +  });                                                          
      31    await page.goto(BASE + query, { waitUntil: 'networkidle0' });
      32    return { page, logs };
      33  }
      26 -const realErrors = (logs) => {                                 
      27 -  const http = logs.filter((l) => l.type === 'http').map((l) =>
         - l.text);                                                      
      28 -  const onlyPdf404 = http.length > 0 && http.every((t) => t ===
         - '404 /tahak.pdf');                                            
      29 -  return logs.filter((l) => l.type === 'pageerror' || (l.type =
         -== 'error' && !(onlyPdf404 && l.text.includes('404'))) || (l.ty
         -pe === 'http' && l.text !== '404 /tahak.pdf'));                
      30 -};                                                             
      31 -const events = (logs) => logs.filter((l) => l.text.startsWith('
         -[měření]')).map((l) => l.args[1]);                             
      34 +const realErrors = (logs) => logs.filter((l) => l.type === 'pag
         +eerror' || l.type === 'error' || l.type === 'http');           
      35 +const events = (logs) => logs.filter((l) => l.type === 'event')
         +.map((l) => l.data);                                           
      36 +const devDb = (q = '') => fetch(`${BASE}__dev/db${q}`).then((r)
         + => r.json());                                                 
      37  const visible = (page, sel) => page.$eval(sel, (el) => !!(el.of
          fsetWidth || el.offsetHeight || el.getClientRects().length)).ca
          tch(() => false);
      38  const text = (page, sel) => page.$eval(sel, (el) => el.textCont
          ent.trim()).catch(() => null);
      39  
      40  try {
      41 +  await devDb('?smazat=1&vypadek=0');                          
      42 +                                                               
      43    // 1) Varianty úvodu
      44    const H1 = {
      45      '': 'Najdi evropské dvojče k VOO, VT a dalším ETF z USA',
     ...
      53      check(`varianta ${q || '(výchozí)'}: nadpis`, h1 === exp, h
          1);
      54      const ev = events(logs).find((e) => e.udalost === 'prichod'
          );
     … 86 more lines (ctrl+o to expand)

⏺ Přidám ještě test výpadku databáze z pohledu návštěvníka: chybová hláška,
  tlačítko znovu funkční a po obnovení projde druhý pokus.

⏺ Bash(python3 - <<'EOF'
      p='scripts/test-page.mjs'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated scripts/test-page.mjs (+22 -0)
      331      check('bot: kontakt se neodeslal', !logs.some((l) => l.typ
           e === 'lead'));
      332      await page.close();
      333    }
      334 +                                                              
      335 +  // 12) Nedostupná databáze: hláška, tlačítko zase funguje, p
          +o obnovení druhý pokus projde                                 
      336 +  {                                                           
      337 +    const { page, logs } = await open();                      
      338 +    const F = '[data-slot="sekce"] .lead-form';               
      339 +    await devDb('?vypadek=1');                                
      340 +    await page.type(`${F} input[name=email]`, 'petra@example.c
          +om');                                                         
      341 +    await page.tap(`${F} input[name=consent]`);               
      342 +    await page.tap(`${F} [type=submit]`);                     
      343 +    await sleep(600);                                         
      344 +    const err = ((await text(page, `${F} .form-error`)) || '')
          +.replace(/\u00a0/g, ' ');                                     
      345 +    const btn = await page.$eval(`${F} [type=submit]`, (b) => 
          +`${b.disabled}|${b.textContent}`);                            
      346 +    check('výpadek databáze: srozumitelná hláška a tlačítko za
          +se funguje', err === 'Něco se pokazilo u nás. Zkus to prosím z
          +a chvíli znovu.' && btn === 'false|Získat tahák', `${err} | ${
          +btn}`);                                                       
      347 +    check('výpadek databáze: kontakt se neuložil, formulář zůs
          +tal', !(await devDb()).leads.some((l) => l.email === 'petra@ex
          +ample.com') && !!(await page.$(F)));                          
      348 +    await devDb('?vypadek=0');                                
      349 +    await page.tap(`${F} [type=submit]`);                     
      350 +    await sleep(600);                                         
      351 +    check('po obnovení databáze druhý pokus projde', ((await t
          +ext(page, '#tahak .thanks h3')) || '') === 'Hotovo, tahák je t
          +vůj.' && (await devDb()).leads.some((l) => l.email === 'petra@
          +example.com'));                                               
      352 +    const bad = realErrors(logs).filter((l) => !(l.type === 'h
          +ttp' && l.text === '502 /api/lead') && !(l.type === 'error' &&
          + l.text.includes('502')));                                    
      353 +    check('výpadek databáze: kromě očekávané 502 bez chyb', !b
          +ad.length, bad.map((l) => l.text).join(' | '));               
      354 +    await page.close();                                       
      355 +  }                                                           
      356  } finally {
      357    await browser.close();
      358  }

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Objevil jsem tři chyby v testu, ne na stránce: test tlačítka reaguje příliš
  brzy a testy offline/výpadku databáze nesprávně filtrují očekávaná selhání
  /api/event. Opravím test tlačítka pomocí pozorovatele změn a zkontroluji, co
  přesně zachytil test odeslaného kontaktu.

  Ran 1 shell command (ctrl+o to expand)

⏺ Kontakt se do databáze uložil, ale test nezachytil požadavek /api/lead. Ověřím
  na malém příkladu, jestli Puppeteer pro fetch vyvolá requestfinished.

  Called plugin:context-mode:context-mode 2 times (ctrl+o to expand)

⏺ Pro /api/lead se Puppeteer u úspěšné odpovědi dostane jen k response, nikoli k
  requestfinished, protože se tělo nenačítá. Test tedy nasadím na odchycení
  události response.

⏺ Bash(python3 - <<'EOF'
      p='scripts/test-page.mjs'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated scripts/test-page.mjs (+12 -6)
      21    page.on('pageerror', (e) => logs.push({ type: 'pageerror', te
          xt: e.message, args: [] }));
      22    page.on('response', (r) => { if (r.status() >= 400) logs.push
          ({ type: 'http', text: `${r.status()} ${new URL(r.url()).pathna
          me}`, args: [] }); });
      23    page.on('request', (r) => logs.push({ type: 'req', text: `${r
          .method()} ${new URL(r.url()).pathname}`, args: [] }));
      24 -  page.on('requestfinished', (r) => {                          
      24 +  // odeslané události a kontakty (jen ty, na které server odpo
         +věděl)                                                         
      25 +  page.on('response', (res) => {                               
      26 +    const r = res.request();                                   
      27      const path = new URL(r.url()).pathname;
      28      if (r.method() !== 'POST' || (path !== '/api/event' && path
           !== '/api/lead')) return;
      29      let data = null;
      30      try { data = JSON.parse(r.postData() || 'null'); } catch { 
          /* nevalidní tělo test odhalí jinde */ }
      29 -    logs.push({ type: path === '/api/event' ? 'event' : 'lead',
         - text: path, data, status: r.response() && r.response().status(
         -) });                                                          
      31 +    logs.push({ type: path === '/api/event' ? 'event' : 'lead',
         + text: path, data, status: res.status() });                    
      32    });
      33    await page.goto(BASE + query, { waitUntil: 'networkidle0' });
      34    return { page, logs };
     ...
      117      await page.tap(`${F} [type=submit]`); await sleep(100);
      118      check('chyba: offline', (await err()) === 'Vypadá to, že n
           ejde internet. Zkontroluj připojení a zkus to znovu.', await e
           rr());
      119      await page.setOfflineMode(false);
      120 +    // stav tlačítka během odesílání zachytí pozorovatel změn 
          +(lokální server odpoví za pár milisekund)                     
      121 +    await page.$eval(`${F} [type=submit]`, (b) => { window.__b
          +tn = []; new MutationObserver(() => window.__btn.push(`${b.dis
          +abled}|${b.textContent}`)).observe(b, { attributes: true, chil
          +dList: true, characterData: true, subtree: true }); });       
      122      await page.tap(`${F} [type=submit]`);
      123      await sleep(80);
      120 -    const busy = await text(page, `${F} [type=submit]`);      
      121 -    check('tlačítko při odesílání', busy === 'Odesílám…', busy
          -);                                                            
      124 +    const busy = await page.evaluate(() => window.__btn || [])
          +;                                                             
      125 +    check('tlačítko při odesílání: zablokované s textem „Odesí
          +lám…“', busy.includes('true|Odesílám…'), busy.join(' / '));   
      126      await sleep(900);
      127      check('poděkování po odeslání', ((await text(page, '#vyber
           -cta .thanks h3')) || '') === 'Hotovo, tahák je tvůj.');
      128      check('všechny formuláře nahrazené poděkováním', (await pa
           ge.$$('.lead-form')).length === 0);
     ...
      153      check('tahák PDF je dostupný', pdf.startsWith('200') && pd
           f.includes('pdf'), pdf);
      154      const overflow = await page.evaluate(() => document.docume
           ntElement.scrollWidth - window.innerWidth);
      155      check('bez vodorovného přetečení (s výsledkem)', overflow 
           === 0, `${overflow}px`);
      152 -    check('bez chyb v konzoli', !realErrors(logs).length, real
          -Errors(logs).map((l) => l.text).join(' | '));                 
      156 +    // v režimu offline se události ztratí (stejně jako v reál
          +u), to je očekávaná chyba                                     
      157 +    const bad = realErrors(logs).filter((l) => !l.text.include
          +s('ERR_INTERNET_DISCONNECTED'));                              
      158 +    check('bez chyb v konzoli (kromě událostí ztracených v rež
          +imu offline)', !bad.length, bad.map((l) => l.text).join(' | ')
          +);                                                            
      159      await page.close();
      160    }
      161  
     … 8 more lines (ctrl+o to expand)

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Všechny tři sady prošly: Chrome 109 kontrol, WebKit 72, funkce 54. Teď
  dokumentace k bodu 6: měření v README, návod na Supabase a Vercel krok za
  krokem a návod ke skriptům.

  Ran 1 shell command (ctrl+o to expand)

⏺ Bash(python3 - <<'EOF'
      def edit(p, pairs):…)
  ⎿  Updated README.md (+67 -3)
       59  
       60  ## Měření cesty návštěvníka
       61  
       62 -_TODO: jaké události měříme od příchodu po odeslání formuláře,
          - čím a kde se dají zobrazit; jak je vyřešený souhlas s cookies
          -._                                                            
       62 +Vlastní anonymní události místo GA4, bez cookies a bez cookie 
          +lišty. Stránka je posílá přes `navigator.sendBeacon` na [`/api
          +/event`](api/event.js) a funkce je ukládá do tabulky `events` 
          +v Supabase ([schéma](supabase/schema.sql)).                   
       63  
       64 -- **ID návštěvy se nikdy nespojuje s e-mailem.** Eventy a kont
          -akty jsou oddělené, jinak by se z anonymních eventů staly osob
          -ní údaje.                                                     
       64 +| Událost | Kdy | Detail |                                    
       65 +|---|---|---|                                                 
       66 +| `prichod` | načtení stránky | `sdileni` u odkazu od kamaráda
          +, jinak `utm_source` |                                        
       67 +| `scroll` | 25, 50, 75 a 100 % stránky, každá jednou | hloubk
          +a |                                                           
       68 +| `otoceni_listku` | klepnutí na lístek | např. `VOO:dvojce`, 
          +`VOO:original` |                                              
       69 +| `vyzva_zobrazena` | výzva k taháku pod lístky po prvním otoč
          +ení | `listky` |                                              
       70 +| `cta` | klepnutí na tlačítko taháku | odkud: `listky`, `list
          +a`, `karty` |                                                 
       71 +| `formular_otevren` | formulář se rozbalí nebo otevře v panel
          +u | odkud |                                                   
       72 +| `formular_zacatek` | první fokus do formuláře | odkud, včetn
          +ě `sekce` |                                                   
       73 +| `odeslani_pokus`, `odeslani_chyba`, `odeslano` | odeslání, c
          +hybová hláška, úspěch | odkud / typ chyby |                   
       74 +| `tahak_otevren` | klepnutí na „Otevřít tahák“ | kde: `panel`
          +, `listky`, `sekce` |                                         
       75 +| `sdileni` | „Poslat odkaz kamarádovi“ | `nativni`, `zruseno`
          +, `kopie`, `rucne` |                                          
       76 +                                                              
       77 +- **Každá událost má ID návštěvy** (náhodné UUID jen v paměti 
          +jednoho načtení stránky), název, verzi úvodu z `?v=` a krátký 
          +detail. Do prohlížeče se nic neukládá.                        
       78 +- **Trychtýř podle verzí úvodu** počítá pohled `analytika.tryc
          +htyr` ze [supabase/funnel.sql](supabase/funnel.sql): příchod →
          + otočení lístku → otevření formuláře → odeslání. U každého kro
          +ku je, kolik návštěv ho udělalo, kolik udělalo i všechny předc
          +hozí a podíl z příchodů.                                      
       79 +- **ID návštěvy se nikdy nespojuje s e-mailem.** Kontakt jde j
          +inou funkcí ([`/api/lead`](api/lead.js)) do jiné tabulky, bez 
          +ID návštěvy. Funkce kontakt s ID odmítne a událost s „@“ v det
          +ailu taky. Čas událostí se ukládá jen na celé hodiny, takže ud
          +álost `odeslano` nejde s řádkem kontaktu spárovat podle času. 
       80 +- **Ověřeno automaticky:** test v Chromu porovná události, kte
          +ré stránka odeslala, s tím, co lokální server uložil, a kontro
          +luje, že v nich nikde není e-mail. Vlastní funkce mají testy s
          + podvrženou databází ([scripts/test-api.mjs](scripts/test-api.
          +mjs)).                                                        
       81  - **Před ostrou kampaní by měl měření posoudit právník.** Do p
           rohlížeče sice nic neukládáme, ale i JavaScript, který z prohl
           ížeče odesílá data, může podle výkladu Evropského sboru pro oc
           hranu osobních údajů (pokyny 2/2023) vyžadovat souhlas. Tenhle
            výklad jsme z primárního zdroje neověřovali, proto ho nechává
           me na právníkovi.
       82  
       83 +## Nasazení na Supabase a Vercel                              
       84 +                                                              
       85 +Všechno je připravené, stačí založit projekty a zadat tři prom
          +ěnné prostředí. Klíče patří jen do Vercelu (a lokálně do `.env
          +.local`, který je v `.gitignore`), nikdy do repa ani do chatu.
       86 +                                                              
       87 +**1. Supabase (databáze)**                                    
       88 +                                                              
       89 +1. Na [supabase.com](https://supabase.com/dashboard) → **New p
          +roject**. Název třeba `etf-dvojcata`, **Region: Central EU (Fr
          +ankfurt)**, tedy `eu-central-1`. Heslo k databázi si ulož do s
          +právce hesel, stránka ho nepotřebuje.                         
       90 +2. **SQL Editor → New query** → vlož celý [supabase/schema.sql
          +](supabase/schema.sql) → **Run**. V **Table Editor** pak uvidí
          +š tabulky `leads` a `events`, obě s RLS zapnutým.             
       91 +3. Znovu **SQL Editor → New query** → vlož [supabase/funnel.sq
          +l](supabase/funnel.sql) → **Run**. Trychtýř pak kdykoli zobraz
          +íš dotazem `select * from analytika.trychtyr;`.               
       92 +4. Tlačítko **Connect** (nebo **Project Settings → Data API**)
          +: zkopíruj **Project URL** (`https://….supabase.co`), to je `S
          +UPABASE_URL`.                                                 
       93 +5. **Project Settings → API Keys → Secret keys**: zkopíruj sec
          +ret klíč (`sb_secret_…`), to je `SUPABASE_SECRET_KEY`. Publish
          +able klíč stránka nepotřebuje, prohlížeč se Supabase vůbec nek
          +ontaktuje.                                                    
       94 +                                                              
       95 +**2. Vercel (web a funkce)**                                  
       96 +                                                              
     … 52 more lines (ctrl+o to expand)

⏺ Teď návod ke skriptům a seznam událostí v CLAUDE.md.

⏺ Bash(python3 - <<'EOF'
      def edit(p, pairs):…)  ⎿  Updated CLAUDE.md (+1 -1)
      49  - **Tykáme.** Proč: cílovka jsou spíš mladší lidé z Instagramu 
          a Facebooku, vykání by tam působilo strojeně.
      50  - **Kontakt = jen e-mail,** žádný telefon. Proč: zadání chce co
           nejméně polí a e-mail stačí k doručení toho, co slibujeme.
      51  - **Konverze = návštěva → odeslaný formulář.** Proč: oba konce 
          trychtýře změříme vlastním měřením, bez dat z reklamního systém
          u.
      52 -- **Měření: vlastní anonymní eventy do Supabase, žádné GA4, pix
         -el ani cookie lišta.** Stránka posílá eventy (příchod, hloubka 
         -scrollu, otočení lístku, zobrazení výzvy, otevření a odeslání f
         -ormuláře) přes `/api/…`. ID návštěvy žije jen v paměti po dobu 
         -jednoho načtení stránky; nic se neukládá do prohlížeče (žádné c
         -ookies, `localStorage` ani `sessionStorage`). Trychtýř se počít
         -á SQL dotazem. Proč: GA4 by potřebovalo souhlas a cookie lišta 
         -na mobilu zdržuje a ubírá konverze.                            
      52 +- **Měření: vlastní anonymní eventy do Supabase, žádné GA4, pix
         +el ani cookie lišta.** Stránka posílá eventy (příchod, hloubka 
         +scrollu, otočení lístku, zobrazení výzvy, otevření a odeslání f
         +ormuláře, otevření taháku, sdílení) přes `/api/event`, kontakt 
         +přes `/api/lead`. ID návštěvy žije jen v paměti po dobu jednoho
         + načtení stránky; nic se neukládá do prohlížeče (žádné cookies,
         + `localStorage` ani `sessionStorage`). Trychtýř se počítá SQL d
         +otazem. Proč: GA4 by potřebovalo souhlas a cookie lišta na mobi
         +lu zdržuje a ubírá konverze.                                   
      53  - **ID návštěvy se nikdy nespojuje s e-mailem.** Neukládej ho d
          o tabulky kontaktů a neposílej ho spolu s e-mailem. Proč: z ano
          nymních eventů by se staly osobní údaje. Před ostrou kampaní po
          soudí měření právník (poznámka je v README).
      54  - **Koncept stránky: „dvojčata“.** Návštěvník klepne na americk
          é ETF a uvidí jeho evropskou UCITS obdobu. Lead magnet je PDF t
          ahák; o e-mail žádáme po prvním výsledku a tlačítkem pořád vidě
          t dole. Detaily (cílovka, pořadí sekcí, proč) jsou v README, te
          xty v `texty.md`, reklamy v `reklamy/`. Proč: stavíme na ověřen
          ém faktu, který návštěvník jinde snadno nenajde.
      55  - **Název stránky: ETF dvojčata.** Design: směr B „Tahák v seši
          tě“ z `design.md`, čistě a důvěryhodně, nesmí působit dětsky (p
          ravidla jsou v `design.md`).
  ⎿  Updated scripts/README.md (+4 -1)
      25  ./scripts/serve.sh
      26  ```
      27  
      28 +Server ([server.mjs](server.mjs)) servíruje `public/` a funkce 
         +z `api/` stejně jako Vercel. Bez proměnných `SUPABASE_*` běží s
         + podvrženou databází v paměti: formulář i měření fungují, nic s
         +e nikam neposílá a na `/__dev/db` je vidět, co by se uložilo. U
         + každé odpovědi 404 vypíše, kde soubor hledal a kdo se ptal. Se
         + skutečnou databází: `node --env-file=.env.local scripts/server
         +.mjs` (z kořene repa; obsah `.env.local` nikdy nevypisuj).     
      29 +                                                               
      30  V druhém terminálu:
      31  
      32  ```
      33  python3 scripts/check_data.py      # data/etf.json: každý údaj 
          má zdroj a datum, platné ISINy
      34  python3 scripts/check_page.py      # čísla na stránce odpovídaj
          í data/etf.json
      35  cd scripts
      34 -node test-page.mjs                 # interakce na 375 px: výběr
         - ETF, formuláře, panel, měření                                 
      36 +node test-api.mjs                  # funkce v api/ s podvrženou
         + databází: validace, limity, honeypot, klíče, vercel.json      
      37 +node test-page.mjs                 # interakce na 375 px: výběr
         + ETF, formuláře, panel, měření, uložení do databáze            
      38  node test-webkit.mjs               # WebKit, iPhone 13 / SE / S
          E 320 px: formuláře se simulovanou klávesnicí
      39  node lighthouse.mjs                # Lighthouse (mobil) pro vše
          chny verze úvodu
      40  node screenshots.mjs po            # snímky do docs/screenshots
          /po-*.png

⏺ Snímky z WebKitu se přepsaly při běhu testu. Commitnu je až se závěrečnými
  snímky. Před commitem bodu 6 projdu diff, jestli v něm nejsou klíče nebo
  skutečné e-maily.

  Ran 1 shell command (ctrl+o to expand)

⏺ jana@seznam.cz byla v testu už dřív, ale mohla by to být něčí skutečná
  schránka. Převedu ji na vyhrazenou doménu example.com.

⏺ Bash(grep -n "seznam" scripts/*.mjs scripts/*.py 2>/dev/null; python3 -
      <<'EOF'
      p='scripts/test-page.mjs'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated scripts/test-page.mjs (+4 -4)
      106      const err = async () => (await text(page, `${F} .form-erro
           r`) || '').replace(/ /g, ' ');
      107      await page.tap(`${F} [type=submit]`); await sleep(100);
      108      check('chyba: prázdný e-mail', (await err()) === 'Napiš sv
           ůj e-mail.', await err());
      109 -    await page.type(`${F} input[name=email]`, 'jana@seznam'); 
      109 +    await page.type(`${F} input[name=email]`, 'jana@example');
      110      await page.tap(`${F} [type=submit]`); await sleep(100);
      111      check('chyba: neplatný e-mail', (await err()) === 'Tenhle 
           e-mail nevypadá správně. Zkontroluj ho.', await err());
      112 -    await page.type(`${F} input[name=email]`, '.cz');         
      112 +    await page.type(`${F} input[name=email]`, '.com');        
      113      await page.tap(`${F} [type=submit]`); await sleep(100);
      114      check('chyba: chybí souhlas', (await err()) === 'Zaškrtni 
           prosím souhlas.', await err());
      115      await page.tap(`${F} input[name=consent]`);
     ...
      133      check('na stránce není viditelné TODO', !(await page.evalu
           ate(() => document.body.innerText.includes('TODO'))));
      134      check('lišta dole po odeslání schovaná', !(await visible(p
           age, '#lista')));
      135      const lead = logs.find((l) => l.type === 'lead');
      136 -    check('odeslání: e-mail, souhlas a verze úvodu, bez ID náv
          -štěvy', lead && lead.status === 200 && JSON.stringify(lead.dat
          -a) === JSON.stringify({ email: 'jana@seznam.cz', souhlas: true
          -, varianta: 'vychozi' }), JSON.stringify(lead && lead.data)); 
      136 +    check('odeslání: e-mail, souhlas a verze úvodu, bez ID náv
          +štěvy', lead && lead.status === 200 && JSON.stringify(lead.dat
          +a) === JSON.stringify({ email: 'jana@example.com', souhlas: tr
          +ue, varianta: 'vychozi' }), JSON.stringify(lead && lead.data))
          +;                                                             
      137      await sleep(300);
      138      const evs = events(logs);
      139      const db = await devDb();
      140 -    const row = db.leads.find((l) => l.email === 'jana@seznam.
          -cz');                                                         
      140 +    const row = db.leads.find((l) => l.email === 'jana@example
          +.com');                                                       
      141      check('databáze: kontakt uložený jen se sloupci e-mail, so
           uhlas, čas souhlasu a verze', !!row && Object.keys(row).sort()
           .join() === 'email,souhlas,souhlas_cas,varianta', JSON.stringi
           fy(row));
      142      const visit = evs[0] && evs[0].navsteva;
      143      const stored = db.events.filter((e) => e.navsteva === visi
           t).map((e) => `${e.udalost}:${e.detail}`).sort().join();

⏺ Bash(sed -i '' "s/{ email: 'jana@seznam', souhlas: true }/{ email:
      'jana@example', souhlas: true }/" scripts/test-api.mjs && grep -c "seznam"
      scripts/test-api.mjs sc…)
  ⎿  Updated scripts/test-api.mjs (+1 -1)
      67  
      68  for (const [name, body, status, chyba] of [
      69    ['prázdný e-mail', { email: '', souhlas: true }, 422, 'email'
          ],
      70 -  ['neplatný e-mail', { email: 'jana@seznam', souhlas: true }, 
         -422, 'email'],                                                 
      70 +  ['neplatný e-mail', { email: 'jana@example', souhlas: true },
         + 422, 'email'],                                                
      71    ['e-mail delší než 254 znaků', { email: 'a'.repeat(250) + '@e
          xample.com', souhlas: true }, 422, 'email'],
      72    ['e-mail jiného typu než text', { email: ['a@b.cz'], souhlas:
           true }, 422, 'email'],
      73    ['bez souhlasu', { email: 'eva@example.com' }, 422, 'souhlas'
          ],

  Called plugin:context-mode:context-mode, ran 1 shell command (ctrl+o to expand)

⏺ Bod 6 je v commitu 21ed6a0. Teď závěr: všechny testy, Lighthouse na mobil a
  nové snímky.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Všechny testy prošly a Lighthouse ukazuje 100 ve všech kategoriích u všech tří
  verzí. Doplním počty z kontroly dat a velikost stránky a prověřím, proč LCP
  vzrostl z 1,0 na 1,2 s.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ HTML má 58,7 kB (16,9 kB po gzipu) a JS 16,7 kB, stále pod limitem 20 kB. LCP
  vzrostlo na 1,2 s hlavně kvůli nekomprimovanému HTML na lokálním serveru – teď
  udělám snímky v Chromu.

  Read 2 files, called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Snímky i panel s klávesnicí ve WebKitu sedí. Teď doplním README (čísla, druhý
  test na iPhonu, snímky s klávesnicí) a deník práce s AI.

  Searched for 1 pattern, ran 1 shell command (ctrl+o to expand)

⏺ Doplňuji do README čísla a druhý test na iPhonu, pak deník a poslední commit.

⏺ Bash(python3 - <<'EOF'
      def edit(p, pairs):…)
  ⎿  Updated README.md (+17 -1)
      129  
      130  _TODO: stack a proč (čisté HTML/CSS/JS bez build kroku, Vercel
           , Supabase), zpracování formuláře, zabezpečení klíčů, rychlost
            načtení._
      131  
      132 -- **Celá stránka je jeden soubor `public/index.html`** s inlin
          -e CSS a JS a systémovým písmem. Bez externích skriptů a písem:
          - 49 kB, po gzipu 13,6 kB, z toho JS 3,8 kB. Jediný obrázek je 
          -náhled taháku (WebP, 24 kB), který se načte až u formuláře. Li
          -ghthouse po předělání designu (mobil, 10. 10. 2026, lokálně): 
          -100 ve všech čtyřech kategoriích (výkon, přístupnost, osvědčen
          -é postupy, SEO) u všech tří verzí úvodu, LCP 1,0 s, CLS 0.    
      132 +- **Celá stránka je jeden soubor `public/index.html`** s inlin
          +e CSS a JS a systémovým písmem. Bez externích skriptů a písem:
          + 58,7 kB, po gzipu 16,9 kB, z toho JS 16,7 kB (po gzipu 6,1 kB
          +). Jediný obrázek je náhled taháku (WebP, 24 kB), který se nač
          +te až u formuláře. Lighthouse (mobil, 11. 10. 2026, lokální se
          +rver bez komprese): 100 ve všech čtyřech kategoriích (výkon, p
          +řístupnost, osvědčené postupy, SEO) u všech tří verzí úvodu, L
          +CP 1,2 s, CLS 0, TBT 0 ms, celkem 82 KiB.                     
      133  - **„Ručně kreslené“ prvky bez písma navíc.** Fix, šipky, krou
           žky a fajfky jsou malá inline SVG. Rukou psané písmo by přidal
           o desítky kB a probliknutí textu. Lístky se otáčejí jen přes C
           SS a při `prefers-reduced-motion` se jen vymění obsah.
      134  - **Ikony a obrázek pro sdílení generuje skript** ([scripts/ob
           razky.mjs](scripts/obrazky.mjs)) ve stylu stránky a s čísly z 
           `data/etf.json`: favicon (SVG a ICO), ikona pro iOS a `og.png`
            1200×630 pro náhled odkazu na Facebooku a v Messengeru. Strán
           ka si je nenačítá, takže nezdržují.
      135  - **Jen světlé barvy** (`color-scheme: only light`). Tmavý rež
           im iOS ani automatické ztmavení v Chromu stránku nepřebarví, „
           sešit“ zůstane papírový.
     ...
      211  
      212  Varianty úvodu po: [?v=dvojce](docs/screenshots/po-1b-uvod-dvo
           jce.png), [?v=zacatek](docs/screenshots/po-1c-uvod-zacatek.png
           ).
      213  
      214 +**Druhý test na skutečném iPhonu, zase člověk** (Safari, 10. 1
          +0. 2026). Design a lístky fungovaly, ale objevily se chyby, kt
          +eré headless Chrome neukázal:                                 
      215 +                                                              
      216 +- Po klepnutí do pole e-mail v panelu ze spodní lišty panel od
          +skočil nahoru, nadpis zajel pod horní lištu telefonu, pole zmi
          +zelo pod klávesnicí a pod panelem prosvítala stránka. Příčina:
          + iOS při klávesnici zmenší jen visual viewport, pevně umístěný
          + panel nechá pod klávesnicí a posouvá stránku i panel. Navíc f
          +okus šel do pole ještě během animace panelu. Oprava a test ve 
          +WebKitu jsou popsané v sekci [Testování](#testování-co-automat
          +icky-a-co-jen-na-telefonu).                                   
      217 +- V logu serveru bylo `GET /tahak.pdf` s 404 hned po úspěšném 
          +HEAD. Zopakovat se to nepodařilo a přegenerováním PDF to nebyl
          +o (PDF se naposledy zapsalo o 22 minut dřív). Generování teď z
          +apisuje přes dočasný soubor a lokální server u každé 404 vypíš
          +e, kde soubor hledal.                                         
      218 +- Safari PDF místo stažení otevřelo v prohlížeči, takže poděko
          +vání „tahák se ti stahuje“ neplatilo. Teď je tam tlačítko „Ote
          +vřít tahák“.                                                  
      219 +- Poděkování bylo prázdné, zásady měly moc žlutých TODO, chybě
          +la favicona.                                                  
      220 +                                                              
      221 +AI navíc při kontrole na 320 px našla, že zadní strana lístku 
          +se třemi brokery přetékala přes další řadu, a že headless WebK
          +it nerespektuje `backface-visibility` (rub prosvítal). Obojí j
          +e opravené a hlídané testem.                                  
      222 +                                                              
      223 +Panel a formulář na místě s otevřenou klávesnicí ve WebKitu (s
          +imulace, viz [scripts/test-webkit.mjs](scripts/test-webkit.mjs
          +)):                                                           
      224 +                                                              
      225 +| | iPhone SE 1. gen. (320 px) | iPhone SE 3. gen. (375 px) | 
          +iPhone 13 (390 px) |                                          
      226 +|---|---|---|---|                                             
      227 +| Panel ze spodní lišty | <img src="docs/screenshots/webkit-pa
          +nel-klavesnice-320.png" width="180" alt="Panel s klávesnicí, 3
          +20 px"> | <img src="docs/screenshots/webkit-panel-klavesnice-3
          +75.png" width="180" alt="Panel s klávesnicí, 375 px"> | <img s
          +rc="docs/screenshots/webkit-panel-klavesnice-390.png" width="1
          +80" alt="Panel s klávesnicí, 390 px"> |                       
      228 +| Formulář pod lístky | <img src="docs/screenshots/webkit-na-m
          +iste-klavesnice-320.png" width="180" alt="Formulář na místě s 
          +klávesnicí, 320 px"> | <img src="docs/screenshots/webkit-na-mi
          +ste-klavesnice-375.png" width="180" alt="Formulář na místě s k
          +lávesnicí, 375 px"> | <img src="docs/screenshots/webkit-na-mis
          +te-klavesnice-390.png" width="180" alt="Formulář na místě s kl
          +ávesnicí, 390 px"> |                                          
      229 +                                                              
      230  ## Před spuštěním kampaně
      231  
      232  Co musí doplnit nebo rozhodnout někdo jiný než vývojář. V návr
           hu zásad jsou tato místa nenápadně označená „doplní správce“.

⏺ Bash(cat >> ai-log/denik.md <<'EOF'…)
  ⎿  Updated ai-log/denik.md (+25 -0)
       85    - Po prvním otočení se ukázala spodní lišta a překryla třetí
            řadu lístků, takže klepnutí na SDY a VGT trefilo lištu. Zjist
           il to automatický test; teď se lišta ukáže, až jsou lístky mim
           o obrazovku. Skutečná vada UX, ne testu.
       86    - „Trading 212“ se zalamovalo mezi slovem a číslem. Ukázal t
           o snímek; doplněná nezlomitelná mezera.
       87    - Test po stažení PDF neukončil proces. Doplněný explicitní 
           konec.
       88 +                                                              
       89 +### 2026-10-11 – opravy po druhém testu na iPhonu, příprava Su
          +pabase a Vercelu                                              
       90 +                                                              
       91 +- **Zadání pro AI:**                                          
       92 +  - nejdřív napsat příčinu chyby s klávesnicí na iPhonu, pak o
          +pravit a otestovat ve WebKitu (Playwright, iPhone 13 a SE) se 
          +simulovanou klávesnicí,                                       
       93 +  - zjistit 404 u PDF, zápis PDF přes dočasný soubor, poděková
          +ní nesmí slibovat stažení,                                    
       94 +  - poděkování s tlačítkem, prvním krokem a sdílením (měřené),
       95 +  - zásady: IČO a sídlo z ARES, místo žlutých TODO „doplní spr
          +ávce“,                                                        
       96 +  - favicon, obrázek pro sdílení, `color-scheme`, přístupnost 
          +panelu, šířka 320 px,                                         
       97 +  - schéma Supabase, trychtýř, funkce v `api/` s testy na podv
          +rženou databázi, `vercel.json`, návod.                        
       98 +- **Kontrola výstupu:**                                       
       99 +  - test ve WebKitu (72 kontrol) se dvěma modely klávesnice (i
          +OS: zmenšený visualViewport, Android: zmenšené okno) a snímky 
          +s nakreslenou klávesnicí,                                     
      100 +  - test funkcí s podvrženou databází (54 kontrol),           
      101 +  - test stránky v Chromu (109 kontrol), nově porovnává odesla
          +né události s tím, co server uložil, a zkouší výpadek databáze
          +,                                                             
      102 +  - při přegenerování PDF 170 požadavků na soubor, všechny 200
          + a celý soubor,                                               
      103 +  - u nových kontrol ověřeno, že na staré verzi stránky selžou
          + (přetékání lístků na 320 px),                                
      104 +  - snímky, obrázek pro sdílení a zásady prohlédnuté očima, Li
          +ghthouse.                                                     
      105 +- **Kde se AI spletla a jak se na to přišlo:**                
      106 +  - Chybu s klávesnicí zavedla AI sama v předchozí verzi: pane
          +l `position: fixed` u spodku a fokus do pole hned po `showModa
          +l()` během animace. Headless Chrome klávesnici nemá, takže to 
          +žádný test neukázal. Našel to člověk na iPhonu.               
      107 +  - Kontrola šířky hlídala jen vodorovné přetečení, takže neza
          +chytila, že na 320 px rub lístku se třemi brokery přetéká svis
          +le přes další řadu. AI na to přišla při prohlížení snímků z 32
          +0 px a doplnila svislou kontrolu.                             
      108 +  - Headless WebKit nerespektuje `backface-visibility`, takže 
          +všechny lístky ukazovaly zrcadlově rub. Na iPhonu to podle člo
          +věka fungovalo. Odhalil to snímek z WebKitu; stránka má teď po
          +jistku přes `visibility`.                                     
      109 +  - Test měření po přechodu na skutečné požadavky nezachytil o
          +deslání kontaktu: Puppeteer u `fetch`, jehož tělo stránka nečt
          +e, nevyvolá `requestfinished`. Test teď čte událost `response`
          +.                                                             
      110 +  - Testovací adresa `jana@seznam.cz` mohla patřit skutečnému 
          +člověku. Při kontrole diffu před commitem ji AI nahradila adre
          +sou na vyhrazené doméně `example.com`.                        
      111 +  - Adresu `etf-dvojcata.vercel.app` AI chtěla použít pro `og:
          +image`, ale kontrola ukázala, že ji už používá cizí projekt. Z
          +volila volnou `etf-dvojcata-clientelo` a zapsala to do návodu.
      112 +  - Příčinu 404 u PDF se nepodařilo zjistit. AI to neoznačila 
          +za vyřešené: zapsala, co vyloučila, a přidala diagnostiku do l
          +okálního serveru.                                             

⏺ Zbývá neverzovaný export ai-log/02-design-a-tahak.txt. Projdu ho na klíče a
  e-maily (vypíšu jen počty, ne obsah).

  Called plugin:context-mode:context-mode, ran 1 shell command (ctrl+o to expand)

⏺ Hotovo. Ještě zastavím svůj testovací server, aby port 8737 zůstal volný pro
  tvůj test na telefonu.

  Ran 1 shell command (ctrl+o to expand)

⏺ Background command "Start Node dev server with fake database" failed with exit
code 143

⏺ Všech šest bodů je hotových, každý v samostatném commitu (07ab0e2 až 21ed6a0,
  plus a256f8a se snímky a dokumentací).

  Co bylo příčinou chyby s klávesnicí a co se změnilo

  Příčina:
  - iOS při otevření klávesnice zmenší jen visual viewport, layout viewport
    nechá celý. Panel přilepený ke spodku obrazovky (position: fixed) tak zůstal
    pod klávesnicí. Ve WebKitu na iPhonu 13 bylo pole na 411 px a tlačítko na
    556 px, nad klávesnicí přitom zbývá zhruba 330 px.
  - Aby bylo pole vidět, iOS posunul stránku i panel. Odtud nadpis pod horní
    lištou a pruh stránky pod panelem. overflow: hidden na <html> iOS v tomhle
    nezastaví.
  - JS navíc dával fokus do pole hned po otevření panelu, kdy ještě běžela
    animace vyjetí. Tuhle chybu jsem zavedl sám v minulé verzi.

  Oprava:
  - Pozadí je zamčené přes position: fixed na body. Po zavření panelu se stránka
    vrátí přesně tam, kde byla, a fokus na tlačítko, které panel otevřelo.
  - Spodek panelu sedí na horní hraně klávesnice (počítá se z visualViewport) a
    výška panelu je omezená na viditelnou část.
  - S otevřenou klávesnicí se formulář zhustí: skryje se podnadpis a popisek
    pole zůstane jen pro čtečky. Obsah se posune tak, aby bylo vidět pole i
    tlačítko. Totéž platí pro formulář pod lístky a v sekci Tahák.
  - Na dotykovém displeji jde fokus na nadpis panelu, takže klávesnice nevyskočí
    během animace.

  Ostatní body

  - PDF a 404:
    - Příčinu se mi zjistit nepodařilo. Přegenerováním to nebylo: PDF se
      naposledy zapsalo v 11:45:31, tedy 22 minut před chybou, a ve WebKitu i v
      Chromu jde HEAD 200 a pak GET 200.
    - Generování teď zapisuje přes dočasný soubor a přejmenování. Během
      přegenerování jsem PDF stáhl 170krát a pokaždé to bylo 200 s celým
      souborem.
    - Nový lokální server u každé 404 vypíše, kde soubor hledal a z jakého
      zařízení přišel požadavek. Když se to zopakuje, pošli mi ten řádek.
  - Změna rozhodnutí: PDF se už samo nestahuje.
    - Data MDN uvádějí podporu atributu download v Safari na iOS od verze 13. Co
      se na iPhonu stane (dialog, nebo otevření místo stránky), z nich ale
      nevyčtu a bez telefonu to neověřím.
    - Místo automatického stažení je v poděkování tlačítko „Otevřít tahák“,
      které PDF otevře v nové kartě a poděkování se sdílením zůstane.
    - Tlačítko formuláře se jmenuje „Získat tahák“.
  - Poděkování:
    - tlačítko „Otevřít tahák“,
    - jedna věta s prvním krokem (strana „Jak koupit“ v taháku),
    - „Poslat odkaz kamarádovi“: nativní sdílení, jinak se odkaz zkopíruje, a
      bez schránky se ukáže pole s odkazem,
    - měří se otevření taháku a sdílení a příchody přes sdílený odkaz
      (?ref=sdileni).
  - Zásady ochrany osobních údajů:
    - údaje z ARES: IČO 22193456, Platnéřská 90/13, Praha 1, C 412348 u
      Městského soudu v Praze, se zdrojem a datem,
    - Supabase v eu-central-1,
    - otevřené body jsou nenápadně jako „doplní správce“ a sepsané v README v
      sekci „Před spuštěním kampaně“.
  - Drobnosti:
    - favicon, ikona pro iOS a og.png 1200×630 generuje scripts/obrazky.mjs z
      data/etf.json,
    - color-scheme: only light,
    - v panelu Tab a Shift+Tab zůstávají uvnitř, Esc ho zavře.
  - 320 px: zadní strana lístků přetékala dolů přes další řadu. Lístek má teď
    výšku podle delší strany.
  - Supabase a Vercel:
    - schema.sql (supabase/schema.sql) a funnel.sql (supabase/funnel.sql),
    - funkce v api/ bez závislostí, vercel.json,
    - návod krok za krokem je v README v sekci „Nasazení na Supabase a Vercel“.
    - Proměnné prostředí: SUPABASE_URL, SUPABASE_SECRET_KEY (nový klíč
      sb_secret_…, starý service_role Supabase do konce roku 2026 ruší) a
      CRON_SECRET.

  Co jsem ověřil automaticky

  ┌────────────────────────────────────────────────────────────┬───────────┐
  │                          Kontrola                          │ Výsledek  │
  ├────────────────────────────────────────────────────────────┼───────────┤
  │ WebKit (Playwright 1.63, iPhone 13, SE 3. gen., SE 320 px) │ 72 z 72   │
  ├────────────────────────────────────────────────────────────┼───────────┤
  │ Chrome                                                     │ 109 z 109 │
  ├────────────────────────────────────────────────────────────┼───────────┤
  │ Funkce v api/ s podvrženou databází                        │ 54 z 54   │
  ├────────────────────────────────────────────────────────────┼───────────┤
  │ Kontrola dat (183 údajů, 0 chyb), stránky a PDF            │ prošly    │
  └────────────────────────────────────────────────────────────┴───────────┘

  - WebKit: klávesnice je simulovaná podle modelu iOS i Androidu. Výšku nad
    klávesnicí (328 / 343 / 244 px) jsem odhadl pesimisticky, nenaměřil.
  - Chrome: porovnává odeslané události s tím, co server opravdu uložil, a
    zkouší výpadek databáze.
  - Funkce: test hlídá validaci, limity velikosti, honeypot, že kontakt s ID
    návštěvy neprojde a že v logu není e-mail ani klíč.
  - Lighthouse (mobil): 100 ve všech čtyřech kategoriích u všech tří verzí
    úvodu, LCP 1,2 s, CLS 0, TBT 0 ms. LCP vzrostlo z 1,0 s, protože stránka je
    větší (16,9 kB po gzipu) a lokální server ji posílá bez komprese.
  - Snímky: jsou v docs/screenshots/, panel s klávesnicí je v
    webkit-panel-klavesnice-*.png. V README je přehledová tabulka.

  Co zkontroluj na iPhonu

  Spusť HOST=0.0.0.0 ./scripts/serve.sh a otevři http://<IP Macu>:8737. Formulář
  teď opravdu odesílá, do podvržené databáze v paměti.

  1. Sjeď pod lístky, klepni na „Chci tahák“ v liště. Klávesnice nesmí vyskočit
     sama.
  2. Klepni do pole e-mail. Nadpis, pole, souhlas i tlačítko musí být nad
     klávesnicí a během psaní nic neposkakuje.
  3. Zkus posunout pozadí prstem. Nesmí se hnout.
  4. Zavři panel křížkem, klepnutím mimo i tlačítkem „Hotovo“ na klávesnici a
     pak křížkem. Stránka musí být tam, kde byla.
  5. Totéž s formulářem pod lístky (otoč lístek, „Chci tahák se všemi 7
     dvojčaty“) a v sekci Tahák.
  6. Odešli e-mail a klepni na „Otevřít tahák“. PDF se má otevřít v nové kartě a
     poděkování zůstat.
  7. Klepni na „Poslat odkaz kamarádovi“: má se otevřít nabídka sdílení. Přes
     http v lokální síti se možná ukáže jen pole s odkazem, nativní sdílení
     vyžaduje https.
  8. Zapni tmavý režim. Stránka musí zůstat světlá.
  9. Otoč lístky a zkontroluj, že rub neprosvítá a otočení je plynulé.

  Co se nepodařilo nebo by šlo líp

  - Příčina 404 u PDF zůstává neznámá, jen jsem vyloučil přegenerování a přidal
    diagnostiku.
  - Skutečnou klávesnici iOS emulátor nemá, oprava je ověřená simulací. Rozhodne
    až tvůj test.
  - Na 320 px se s klávesnicí nevejde nadpis panelu. Vidět je pole, souhlas a
    tlačítko.
  - Rate limiting chybí. Proti botům je jen skryté pole a kontrola Origin.
  - Keep-alive: že denní dotaz Supabase počítá jako aktivitu, jsem v dokumentaci
    neověřil.
  - Doména pro og:image: etf-dvojcata.vercel.app už používá cizí projekt
    (podobný nápad, ale vyká). Ve stránce je etf-dvojcata-clientelo.vercel.app,
    tak projekt na Vercelu pojmenuj stejně, nebo mi dej vědět jinou adresu.
  - Tvůj export ai-log/02-design-a-tahak.txt jsem necommitnul. Klíče ani tokeny
    v něm nejsou, jen testovací adresa jana…@seznam.cz z dřívějšího testu. V
    repu jsem ji nahradil adresou na example.com. Jestli ho commitnout, rozhodni
    ty.

❯ Otestoval jsem to na iPhonu (Chrome na iOS, tedy engine WebKit) a nahrál
  video. Oprava panelu pomohla, pole už je vidět. Zbývají ale dvě chyby, které
  simulace nezachytila, a pak chci projít bezpečnost.

  1) OTOČENÍ LÍSTKU NEFUNGUJE
  Po klepnutí lístek během animace úplně zmizí (zůstane jen páska), pak se
  ukáže zase přední strana a výsledek se objeví pod lístky. Rub během otáčení
  vůbec nevidím, takže to působí jako bliknutí, ne otočení. Je to nejspíš
  problém 3D transformací ve WebKitu (backface-visibility bez -webkit- prefixu,
  transform-style: preserve-3d zrušené overflow, filtrem, box-shadow nebo
  will-change na rodiči, perspective na špatném prvku...). Nejdřív mi napiš, co
  je podle tebe příčina, pak oprav. Chci vidět skutečné otočení, kde je v
  polovině lístek z boku a pak rub s dvojčetem. Ověř to ve WebKitu sérií snímků
  v průběhu animace (třeba po 100 ms), ne jen konečný stav. Kdyby se to ve
  WebKitu spolehlivě udělat nedalo, navrhni jinou animaci, která tam funguje, a
  řekni mi to.

  2) TLAČÍTKO POD KLÁVESNICÍ
  Když klepnu do pole na e-mail, nad klávesnici vyskočí lišta s návrhy e-mailů
  (automatické vyplňování), zakryje souhlas a tlačítko "Získat tahák" skončí
  pod klávesnicí. Tvoje simulace s touhle lištou nepočítala a v Chromu na iOS
  se možná ani nepromítne do visualViewport. Nespoléhej proto na přesný výpočet
  výšky a udělej to odolné:
  - tlačítko dej hned pod pole na e-mail, nebo pole a tlačítko na jeden řádek,
  a souhlas pod ně, ať je tlačítko co nejvýš,
  - přidej enterkeyhint="send", ať jde formulář odeslat i modrou klávesou na
  klávesnici (se stejnou kontrolou souhlasu),
  - počítej s rezervou zhruba 50 px pro lištu návrhů,
  - pokud se nevejde všechno, má přednost pole + tlačítko, souhlas může být
  těsně pod nimi.
  Platí to pro panel i pro formulář pod lístky a v sekci Tahák. Do README
  připiš, že tohle simulace nezachytila a našel to až test na reálném telefonu.

  3) BEZPEČNOST A OCHRANA PROTI SPAMU
  Formulář bude veřejný a nechci, aby Clientelu plnil databázi nesmyslnými nebo
  falešnými e-maily ani aby šel zneužít. Nejdřív mi vypiš skilly, které máš k
  dispozici, a použij ty, které se hodí na bezpečnost a review kódu. Pak projdi
  celý projekt (api/, supabase/, vercel.json, public/) a zaměř se na:
  - spam a boty: kromě honeypotu a kontroly Origin přidej kontrolu, jak rychle
  byl formulář odeslán (bot ho odešle hned), omezení počtu odeslání (rate
  limiting, třeba přes tabulku v Supabase s hashem IP a solí, ne čistou IP),
  odmítnutí jednorázových e-mailových domén a kontrolu, že doména e-mailu má MX
  záznam,
  - duplicity: stejný e-mail podruhé neuložit jako nový lead, ale návštěvníkovi
  i tak ukázat tahák,
  - kvalitu leadů: navrhni, jestli dává smysl double opt-in (potvrzovací
  e-mail) a jak by ovlivnil konverzi. Zatím ho nestav, jen ho popiš v README
  jako doporučení,
  - bezpečnost: validace a limity vstupů, XSS, CORS, únik klíčů do frontendu
  nebo logů, RLS v Supabase (anonymní klíč nesmí nic číst ani zapisovat),
  bezpečnostní hlavičky ve vercel.json (Content-Security-Policy, HSTS,
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy), aby nerozbily
  stránku ani Lighthouse,
  - měřicí endpoint api/event: aby se nedal zahltit ani použít k ukládání
  libovolných dat.
  Ke každému nálezu napiš závažnost, co jsi opravil a co ne a proč. Výsledek
  dej do README do sekce "Bezpečnost a ochrana proti spamu". Na všechno napiš
  testy.

  4) DROBNOST PŘED NASAZENÍM
  Do patičky přidej nenápadnou poznámku "Ukázkové řešení do výběrového řízení"
  a na celou stránku dej noindex, dokud ji Clientelo nepřevezme.
  5) BODY Z TVÉHO MINULÉHO REPORTU
  - Doména: projekt na Vercelu pojmenuju etf-dvojcata-demo, ne
  etf-dvojcata-clientelo. Stránka není oficiálně Clientela a nechci jejich
  jméno v adrese. Uprav og:image, kanonickou adresu a všechny odkazy na
  https://etf-dvojcata-demo.vercel.app, a kdyby ta adresa byla obsazená, napiš
  mi.
  - Keep-alive: ověř v dokumentaci Supabase, co se počítá jako aktivita, která
  brání pozastavení projektu na free plánu, a podle toho uprav cron. Když to
  ověřit nepůjde, napiš to do README jako riziko, s doporučením zkontrolovat
  projekt den před odevzdáním.
  - 320 px: že se s klávesnicí nevejde nadpis panelu, je v pořádku. Přednost má
  pole a tlačítko, jak píšu v bodě 2.
  Commit po každém bodu. Na konci pusť všechny testy a Lighthouse a napiš mi:
  - příčinu chyby s lístkem a co jsi změnil,
  - konkrétní kroky, co mám znovu otestovat na iPhonu,
  - výsledek bezpečnostní kontroly v pár bodech.

⏺ Začnu bodem 1. Nejdřív si podle tvého zadání ve WebKitu ověřím, co přesně dělá
  současné otočení, a pak napíšu příčinu.

  Ran 1 shell command (ctrl+o to expand)

⏺ Lokální main odpovídá origin/main, commity jsou tedy už na GitHubu. Teď ve
  WebKitu zastavím tranzici otočení a projdu snímky na 0, 100, 200, 300 a 450
  ms, na každém změřím šířku lístku a viditelnou stranu – vyzkouším to v
  headless i okenním módu, protože okenní WebKit skládá vrstvy na GPU podobně
  jako iPhone.

  Made 1 scratchpad edit +30, called plugin:context-mode:context-mode, ran 1 shell command (ctrl+o to expand)

⏺ Po 100 ms je lístek pootočený o ~130°, přičemž 90° uplynulo zhruba po 50 ms,
  ale přepnutí viditelnosti stran se odehrává až po 220 ms. Teď se podívám, jak
  tento moment vypadá na snímku z GPU skládání okna.

  Read 2 files, ran 1 shell command (ctrl+o to expand)

⏺ Měřením jsem potvrdil, že lístek mizí, protože se při otáčení pohybuje
  rychleji než časová hranice pro přehození líc/rub, takže je chvíli otočený
  zády a nic se nekreslí. Opravím to tak, že zruším 3D kontext a
  backface-visibility a budu otáčet jednu rovinu přes perspective(), kde se
  strany vymění přesně v bodě otočení z boku, ne podle času.

  Read 1 file (ctrl+o to expand)

⏺ Teď oprava: CSS bez 3D kontextu a JS, které otočí jednu rovinu ve dvou
  půlkách.

⏺ Bash(python3 - <<'EOF'
      p='public/index.html'; s=open(p,encoding='utf-8').read()…)  ⎿  Updated public/index.html (+38 -15)
      49  .note{font-size:.875rem;color:var(--ink-2);margin:0}
      50  .picker-label{display:flex;flex-wrap:wrap;align-items:baseline;
          gap:4px 10px;font-weight:700;margin:18px 0 12px}
      51  .hint{font-weight:400;font-size:.875rem;color:var(--ink-2)}
      52 -/* lístky z taháku: po klepnutí se otočí (jen CSS), vzadu je dv
         -ojče; líc a rub jsou ve stejné buňce mřížky,                   
      53 -   takže lístek je vysoký podle delší strany a na úzkém displej
         -i nic nepřeteče */                                             
      52 +/* lístky z taháku: klepnutí lístek otočí, vzadu je dvojče. Líc
         + a rub jsou ve stejné buňce mřížky, takže lístek               
      53 +   je vysoký podle delší strany a na úzkém displeji nic nepřete
         +če.                                                            
      54 +   Otočení je bez 3D kontextu a backface-visibility (WebKit je 
         +bez GPU nerespektuje): JS otočí jednu rovinu                   
      55 +   0 → 90°, když je lístek z boku, vymění strany (data-strana) 
         +a dotočí −90 → 0°. */                                          
      56  .listky{display:grid;grid-template-columns:1fr 1fr;gap:12px 10p
          x}
      55 -.listek{position:relative;display:grid;min-height:124px;color:v
         -ar(--ink);text-decoration:none;perspective:900px;transform:rota
         -te(var(--r,0deg));touch-action:manipulation;-webkit-user-select
         -:none;user-select:none;-webkit-touch-callout:none}             
      57 +.listek{position:relative;display:grid;min-height:124px;color:v
         +ar(--ink);text-decoration:none;transform:rotate(var(--r,0deg));
         +touch-action:manipulation;-webkit-user-select:none;user-select:
         +none;-webkit-touch-callout:none}                               
      58  .listek.paska::before{content:"";position:absolute;z-index:2;to
          p:-6px;left:50%;width:40px;height:13px;margin-left:-20px;backgr
          ound:rgba(214,203,168,.55);transform:rotate(-2deg)}
      57 -.listek-in{position:relative;display:grid;transform-style:prese
         -rve-3d;transition:transform .45s var(--ease)}                  
      58 -.listek[aria-pressed="true"] .listek-in{transform:rotateY(180de
         -g)}                                                            
      59 -.listek:active .lice{transform:scale(.98)}                     
      60 -.listek:active .rub{transform:rotateY(180deg) scale(.98)}      
      61 -/* backface-visibility WebKit respektuje jen při hardwarovém sk
         -ládání vrstev; pojistka: líc a rub se přepnou                  
      62 -   viditelností v půlce otočení (lístek je v tu chvíli z boku) 
         -*/                                                             
      63 -.lice,.rub{grid-area:1/1;display:flex;flex-direction:column;pad
         -ding:12px;border:1.5px solid var(--ink);border-radius:6px;backg
         -round:var(--card);-webkit-backface-visibility:hidden;backface-v
         -isibility:hidden;box-shadow:2px 3px 0 rgba(20,20,20,.08);transi
         -tion:transform .1s var(--ease),visibility 0s .22s}             
      64 -.rub{transform:rotateY(180deg);padding:9px 11px;visibility:hidd
         -en}                                                            
      65 -.listek[aria-pressed="true"] .rub{visibility:visible}          
      66 -.listek[aria-pressed="true"] .lice{visibility:hidden}          
      59 +.listek-in{position:relative;display:grid}                     
      60 +.listek:active .lice,.listek:active .rub{transform:scale(.98)} 
      61 +.lice,.rub{grid-area:1/1;display:flex;flex-direction:column;pad
         +ding:12px;border:1.5px solid var(--ink);border-radius:6px;backg
         +round:var(--card);box-shadow:2px 3px 0 rgba(20,20,20,.08);trans
         +ition:transform .1s var(--ease)}                               
      62 +.rub{padding:9px 11px;visibility:hidden}                       
      63 +.listek[data-strana="rub"] .rub{visibility:visible}            
      64 +.listek[data-strana="rub"] .lice{visibility:hidden}            
      65  .lice .tk{font-size:1.625rem;line-height:1.1}
      66  .lice .co{font-size:.875rem;color:var(--ink-2);margin-top:2px}
      67  .lice .otoc{margin-top:auto;align-self:flex-end;font-size:.75re
          m;color:var(--ink-2)}
     ...
      71  .rub .koupis{font-size:.8125rem;line-height:1.25;color:var(--ok
          );font-weight:700}
      72  .rub .cena{margin-top:auto;font-size:.75rem;color:var(--ink-2);
          line-height:1.2}
      73  .listky.peek .listek:first-child .listek-in{animation:peek 1.1s
           var(--ease) .9s 1}
      76 -@keyframes peek{0%,100%{transform:rotateY(0)}45%{transform:rota
         -teY(-16deg)}}                                                  
      74 +@keyframes peek{0%,100%{transform:perspective(600px) rotateY(0)
         +}45%{transform:perspective(600px) rotateY(-16deg)}}            
      75  .stamp{margin:14px 0 0;font-size:.8125rem;color:var(--ink-2)}
      76  .cta{margin-top:16px}
      77  .cta .small{text-align:center;margin:8px 0 0}
     … 43 more lines (ctrl+o to expand)

⏺ Teď test ve WebKitu: snímky průběhu otočení po 100 ms (plus těsně před výměnou
  stran) a kontroly, že je pořád vidět právě jedna strana a nikdy nic není
  zrcadlově.

⏺ Update(scripts/test-webkit.mjs)
  ⎿  Added 56 lines
       72    });
       73  }
       74  
       75 +// Průběh otočení lístku: animaci zastaví a posune na daný čas
          +, změří úhel, šířku a viditelnou stranu                       
       76 +// a z výřezů složí jeden snímek docs/screenshots/webkit-otoce
          +ni-listku.png.                                                
       77 +async function flipFrames(browser) {                          
       78 +  const ctx = await browser.newContext({ ...devices['iPhone 13
          +'] });                                                        
       79 +  const page = await ctx.newPage();                           
       80 +  await page.goto(BASE, { waitUntil: 'load' });               
       81 +  await page.evaluate(() => document.querySelector('.listky').
          +classList.remove('peek'));                                    
       82 +  const sel = '.listek[data-etf="VTI"]';                      
       83 +  const box = await page.$eval(sel, (el) => { el.scrollIntoVie
          +w({ block: 'center' }); const b = el.getBoundingClientRect(); 
          +return { x: b.x - 8, y: b.y - 10, width: b.width + 16, height:
          + b.height + 20 }; });                                         
       84 +  await page.tap(sel);                                        
       85 +  const frames = [];                                          
       86 +  const measure = (t) => page.evaluate(([sel, t]) => {        
       87 +    const card = document.querySelector(sel);                 
       88 +    const inner = card.querySelector('.listek-in');           
       89 +    const anim = inner.getAnimations()[0];                    
       90 +    if (anim) { anim.pause(); anim.currentTime = t; }         
       91 +    const m = new DOMMatrix(getComputedStyle(inner).transform 
          +=== 'none' ? undefined : getComputedStyle(inner).transform);  
       92 +    return {                                                  
       93 +      cos: m.m11, sirka: inner.getBoundingClientRect().width, 
       94 +      lic: getComputedStyle(card.querySelector('.lice')).visib
          +ility === 'visible',                                          
       95 +      rub: getComputedStyle(card.querySelector('.rub')).visibi
          +lity === 'visible',                                           
       96 +    };                                                        
       97 +  }, [sel, t]);                                               
       98 +  const half = 225;                                           
       99 +  for (const [t, phase] of [[0, 1], [100, 1], [200, 1], [224, 
          +1], [25, 2], [125, 2], [225, 2]]) {                           
      100 +    if (phase === 2 && frames.length === 4) {                 
      101 +      // konec první půlky: dokončit ji, výměna stran proběhne
          + v onfinish a začne druhá půlka                               
      102 +      await page.evaluate((sel) => document.querySelector(sel)
          +.querySelector('.listek-in').getAnimations()[0].finish(), sel)
          +;                                                             
      103 +      await page.waitForFunction((sel) => document.querySelect
          +or(sel).getAttribute('data-strana') === 'rub' && document.quer
          +ySelector(sel).querySelector('.listek-in').getAnimations().len
          +gth === 1, sel);                                              
      104 +    }                                                         
      105 +    const f = await measure(t);                               
      106 +    f.ms = phase === 1 ? t : half + t;                        
      107 +    f.png = (await page.screenshot({ clip: box })).toString('b
          +ase64');                                                      
      108 +    frames.push(f);                                           
      109 +  }                                                           
      110 +  const full = frames[0].sirka;                               
      111 +  const first = frames.slice(0, 4);                           
      112 +  const second = frames.slice(4);                             
      113 +  check('otočení: v první půlce je vidět líc, lístek se zužuje
          +', first.every((f) => f.lic && !f.rub) && first.every((f, i) =
          +> i === 0 || f.sirka < first[i - 1].sirka), first.map((f) => M
          +ath.round(f.sirka)).join(' → '));                             
      114 +  check('otočení: v půlce je lístek z boku (šířka pod 15 %)', 
          +first[3].sirka < full * 0.15, `${Math.round(first[3].sirka)} z
          + ${Math.round(full)} px`);                                    
      115 +  check('otočení: ve druhé půlce je vidět rub s dvojčetem, lís
          +tek se rozšiřuje', second.every((f) => f.rub && !f.lic) && sec
          +ond.every((f, i) => i === 0 || f.sirka > second[i - 1].sirka),
          + second.map((f) => Math.round(f.sirka)).join(' → '));         
      116 +  check('otočení: nikdy obě strany schované ani obě vidět', fr
          +ames.every((f) => f.lic !== f.rub));                          
      117 +  check('otočení: nikdy zrcadlově (úhel nejvýš 90°, nic nezávi
          +sí na backface-visibility)', frames.every((f) => f.cos >= -0.0
          +01), frames.map((f) => f.cos.toFixed(2)).join(' '));          
      118 +  check('otočení: na konci rub v plné šířce', second[2].sirka 
          +> full * 0.97);                                               
      119 +  // jeden snímek ze všech výřezů s časy                      
      120 +  const sheet = await ctx.newPage();                          
      121 +  await sheet.setViewportSize({ width: 1200, height: 400 });  
      122 +  await sheet.setContent(`<body style="margin:0;padding:12px;b
          +ackground:#FFFDF5;font:600 14px -apple-system,sans-serif;displ
          +ay:flex;gap:10px;width:max-content">${frames.map((f) => `<figu
          +re style="margin:0;text-align:center"><img src="data:image/png
          +;base64,${f.png}" style="display:block;width:${Math.round(box.
          +width)}px"><figcaption style="margin-top:6px">${f.ms} ms</figc
          +aption></figure>`).join('')}</body>`);                        
      123 +  await sheet.waitForFunction(() => [...document.images].every
          +((i) => i.complete));                                         
      124 +  const size = await sheet.evaluate(() => ({ width: document.b
          +ody.scrollWidth, height: document.body.scrollHeight }));      
      125 +  await sheet.setViewportSize(size);                          
      126 +  await sheet.screenshot({ path: new URL('../docs/screenshots/
          +webkit-otoceni-listku.png', import.meta.url).pathname });     
      127 +  await ctx.close();                                          
      128 +}                                                             
      129 +                                                              
      130  const browser = await webkit.launch();
      131  try {
      132 +  await flipFrames(browser);                                  
      133    for (const phone of PHONES) {
      134      const dev = devices[phone.name];
      135      const H = dev.viewport.height;

  Read 1 file, called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Otočení už funguje správně. Teď opravím prázdný pruh dole kvůli chybějícímu
  doctype a upravím Chrome test, který ještě ověřoval starou rotaci o 180°.

⏺ Bash(python3 - <<'EOF'
      p='scripts/test-webkit.mjs'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated scripts/test-page.mjs (+2 -2)
      81        await sleep(550);
      82        const pressed = await page.$$eval('.listek[aria-pressed="
          true"]', (cs) => cs.map((c) => c.getAttribute('data-etf')));
      83        const back = await page.$eval(`.listek[data-etf="${us}"] 
          .rub`, (r) => r.textContent.replace(/\u00a0/g, ' '));
      84 -      const flipped = await page.$eval(`.listek[data-etf="${us}
         -"] .listek-in`, (el) => getComputedStyle(el).transform);       
      84 +      const side = await page.$eval(`.listek[data-etf="${us}"]`
         +, (el) => `${el.dataset.strana}|${getComputedStyle(el.querySele
         +ctor('.rub')).visibility}|${getComputedStyle(el.querySelector('
         +.lice')).visibility}`);                                        
      85        const shown = await page.$$eval('.twin', (ts) => ts.filte
          r((t) => !t.hidden).map((t) => t.getAttribute('data-etf')));
      86        const h2 = await page.$eval(`.twin[data-etf="${us}"] h2`,
           (h) => h.textContent);
      87 -      check(`lístek ${us} → ${tw}: otočený, vzadu dvojče, podro
         -bnosti`, pressed.join() === us && back.includes(tw) && back.inc
         -ludes('Kč ročně') && flipped !== 'none' && shown.join() === us 
         -&& h2.includes(tw), `${pressed} | ${back} | ${shown}`);        
      87 +      check(`lístek ${us} → ${tw}: otočený, vzadu dvojče, podro
         +bnosti`, pressed.join() === us && back.includes(tw) && back.inc
         +ludes('Kč ročně') && side === 'rub|visible|hidden' && shown.joi
         +n() === us && h2.includes(tw), `${pressed} | ${back} | ${shown}
         +`);                                                            
      88      }
      89      check('výzva k taháku se ukázala po prvním otočení', await 
          visible(page, '#vyber-cta'));
      90      await page.tap('.listek[data-etf="AGG"]');
  ⎿  Updated scripts/test-webkit.mjs (+2 -2)
      80    await page.goto(BASE, { waitUntil: 'load' });
      81    await page.evaluate(() => document.querySelector('.listky').c
          lassList.remove('peek'));
      82    const sel = '.listek[data-etf="VTI"]';
      83 -  const box = await page.$eval(sel, (el) => { el.scrollIntoView
         -({ block: 'center' }); const b = el.getBoundingClientRect(); re
         -turn { x: b.x - 8, y: b.y - 10, width: b.width + 16, height: b.
         -height + 20 }; });                                             
      83 +  const box = await page.$eval(sel, (el) => { el.scrollIntoView
         +({ block: 'center' }); const b = el.getBoundingClientRect(); re
         +turn { x: b.x - 4, y: b.y - 10, width: b.width + 8, height: b.h
         +eight + 20 }; });                                              
      84    await page.tap(sel);
      85    const frames = [];
      86    const measure = (t) => page.evaluate(([sel, t]) => {
     ...
      119    // jeden snímek ze všech výřezů s časy
      120    const sheet = await ctx.newPage();
      121    await sheet.setViewportSize({ width: 1200, height: 400 });
      122 -  await sheet.setContent(`<body style="margin:0;padding:12px;b
          -ackground:#FFFDF5;font:600 14px -apple-system,sans-serif;displ
          -ay:flex;gap:10px;width:max-content">${frames.map((f) => `<figu
          -re style="margin:0;text-align:center"><img src="data:image/png
          -;base64,${f.png}" style="display:block;width:${Math.round(box.
          -width)}px"><figcaption style="margin-top:6px">${f.ms} ms</figc
          -aption></figure>`).join('')}</body>`);                        
      122 +  await sheet.setContent(`<!doctype html><body style="margin:0
          +;padding:12px;background:#FFFDF5;font:600 14px -apple-system,s
          +ans-serif;display:flex;gap:10px;width:max-content">${frames.ma
          +p((f) => `<figure style="margin:0;text-align:center"><img src=
          +"data:image/png;base64,${f.png}" style="display:block;width:${
          +Math.round(box.width)}px"><figcaption style="margin-top:6px">$
          +{f.ms} ms</figcaption></figure>`).join('')}</body>`);         
      123    await sheet.waitForFunction(() => [...document.images].every
           ((i) => i.complete));
      124    const size = await sheet.evaluate(() => ({ width: document.b
           ody.scrollWidth, height: document.body.scrollHeight }));
      125    await sheet.setViewportSize(size);

⏺ Bash(python3 - <<'EOF'
      p='scripts/test-page.mjs'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated scripts/test-page.mjs (+4 -4)
      205      const page = await mobilePage(browser);
      206      await page.emulateMediaFeatures([{ name: 'prefers-reduced-
           motion', value: 'reduce' }]);
      207      await page.goto(BASE, { waitUntil: 'networkidle0' });
      208 -    const t = await page.$eval('.listek-in', (el) => `${getCom
          -putedStyle(el).transitionDuration} / ${getComputedStyle(el).an
          -imationName}`);                                               
      209 -    check('reduced motion: bez animace otočení i „nakouknutí“'
          -, t.startsWith('0s') && t.endsWith('none'), t);               
      208 +    const t = await page.$eval('.listek-in', (el) => getComput
          +edStyle(el).animationName);                                   
      209 +    check('reduced motion: bez „nakouknutí“', t === 'none', t)
          +;                                                             
      210      await page.tap('.listek[data-etf="VOO"]');
      211 -    await sleep(100);                                         
      212 -    check('reduced motion: lístek přesto ukáže dvojče', (await
          - page.$$('.listek[aria-pressed="true"]')).length === 1);      
      211 +    const now = await page.$eval('.listek[data-etf="VOO"]', (e
          +l) => `${el.querySelector('.listek-in').getAnimations().length
          +}|${el.dataset.strana}`);                                     
      212 +    check('reduced motion: bez animace otočení, rub se ukáže h
          +ned', now === '0|rub', now);                                  
      213      await page.close();
      214    }
      215  

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Testy prošly. Přidám ještě kontrolu rychlého klepání (lístek klepnutý během
  animace jiného lístku), aby se strany nikdy nerozešly se stavem.

⏺ Update(scripts/test-webkit.mjs)
  ⎿  Added 6 lines
      238        const ctx = await browser.newContext({ ...dev });
      239        const page = await ctx.newPage();
      240        await page.goto(BASE, { waitUntil: 'load' });
      241 +      // rychlé klepání během animace: strany musí na konci od
          +povídat stavu                                                 
      242 +      await page.evaluate(() => document.querySelector('.listk
          +y').classList.remove('peek'));                                
      243 +      for (const [etf, ms] of [['VOO', 80], ['VTI', 60], ['VTI
          +', 120], ['VOO', 30]]) { await page.tap(`.listek[data-etf="${e
          +tf}"]`); await sleep(ms); }                                   
      244 +      await sleep(600);                                       
      245 +      const states = await page.$$eval('.listek', (ls) => ls.m
          +ap((l) => `${l.dataset.etf}:${l.getAttribute('aria-pressed')}:
          +${l.dataset.strana}`));                                       
      246 +      check(`${tag}: rychlé klepání – strany odpovídají stavu`
          +, states.every((s) => (s.endsWith('true:rub') || s.endsWith('f
          +alse:lic'))) && states.filter((s) => s.includes('true')).join(
          +) === 'VOO:true:rub', states.join(' '));                      
      247        await page.tap('.listek[data-etf="VWO"]');
      248        await sleep(550);
      249        // rub neotočených lístků nesmí prosvítat (headless WebK
           it nerespektuje backface-visibility)

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Kontrola rychlého klepání prošla na všech třech zařízeních. Upravím zmínky o
  otáčení v dokumentaci a commitnu bod 1.

  Searched for 1 pattern (ctrl+o to expand)

⏺ Bash(python3 - <<'EOF'
      import re…)
  ⎿  Updated README.md (+2 -2)
      130  _TODO: stack a proč (čisté HTML/CSS/JS bez build kroku, Vercel
           , Supabase), zpracování formuláře, zabezpečení klíčů, rychlost
            načtení._
      131  
      132  - **Celá stránka je jeden soubor `public/index.html`** s inlin
           e CSS a JS a systémovým písmem. Bez externích skriptů a písem:
            58,7 kB, po gzipu 16,9 kB, z toho JS 16,7 kB (po gzipu 6,1 kB
           ). Jediný obrázek je náhled taháku (WebP, 24 kB), který se nač
           te až u formuláře. Lighthouse (mobil, 11. 10. 2026, lokální se
           rver bez komprese): 100 ve všech čtyřech kategoriích (výkon, p
           řístupnost, osvědčené postupy, SEO) u všech tří verzí úvodu, L
           CP 1,2 s, CLS 0, TBT 0 ms, celkem 82 KiB.
      133 -- **„Ručně kreslené“ prvky bez písma navíc.** Fix, šipky, krou
          -žky a fajfky jsou malá inline SVG. Rukou psané písmo by přidal
          -o desítky kB a probliknutí textu. Lístky se otáčejí jen přes C
          -SS a při `prefers-reduced-motion` se jen vymění obsah.        
      133 +- **„Ručně kreslené“ prvky bez písma navíc.** Fix, šipky, krou
          +žky a fajfky jsou malá inline SVG. Rukou psané písmo by přidal
          +o desítky kB a probliknutí textu. Lístky se otáčejí bez 3D kon
          +textu a bez `backface-visibility`: JS (Web Animations API, bez
          + knihovny) otočí jednu rovinu s perspektivou o 90°, když je lí
          +stek z boku, vymění strany a dotočí. WebKit to kreslí stejně s
          + grafickým čipem i bez něj. Při `prefers-reduced-motion` se je
          +n vymění strany.                                              
      134  - **Ikony a obrázek pro sdílení generuje skript** ([scripts/ob
           razky.mjs](scripts/obrazky.mjs)) ve stylu stránky a s čísly z 
           `data/etf.json`: favicon (SVG a ICO), ikona pro iOS a `og.png`
            1200×630 pro náhled odkazu na Facebooku a v Messengeru. Strán
           ka si je nenačítá, takže nezdržují.
      135  - **Jen světlé barvy** (`color-scheme: only light`). Tmavý rež
           im iOS ani automatické ztmavení v Chromu stránku nepřebarví, „
           sešit“ zůstane papírový.
      136  - **Panel s formulářem je přístupný z klávesnice.** Je to nati
           vní modální `<dialog>` s `aria-modal`: Tab a Shift+Tab zůstáva
           jí v panelu, Esc ho zavře a fokus se vrátí na tlačítko, které 
           ho otevřelo.
     ...
      172  **Jen na skutečném telefonu:**
      173  
      174  - skutečná klávesnice iOS: její výška, lišta nad ní (šipky, Ho
           tovo, automatické doplnění e-mailu) a to, jak Safari sám posou
           vá stránku k poli,
      175 -- plynulost otočení lístků (3D na grafickém čipu; headless Web
          -Kit ho kreslí bez něj, proto stránka má pojistku, aby neprosví
          -tal rub),                                                     
      175 +- plynulost otočení lístků na skutečném displeji. Průběh (úhel
          +, šířka a viditelná strana po 100 ms) test ve WebKitu kontrolu
          +je a skládá do [snímku](docs/screenshots/webkit-otoceni-listku
          +.png),                                                        
      176  - otevření a uložení PDF v Safari,
      177  - nativní sdílení a kopírování odkazu,
      178  - výřez displeje a domovský indikátor (safe area), tmavý režim
            iOS,
  ⎿  Updated design.md (+1 -1)
      73    - nikdy přes poplatek, aby oko jako první nevidělo „dvojče je
           dražší“.
      74  - **Lístky z taháku** místo tlačítek výběru:
      75    - pootočené nejvýš o 1,5°, páska jen u každého druhého,
      76 -  - klepnutí lístek otočí (CSS 3D, 0,45 s),                    
      76 +  - klepnutí lístek otočí (0,45 s: jedna rovina s perspektivou 
         +do 90°, výměna stran, dotočení; bez 3D kontextu, aby to fungova
         +lo ve WebKitu na iPhonu),                                      
      77    - vzadu je dvojče v ručně kresleném kroužku, zelená „✓ kde ko
          upit“, poplatek v Kč a štítek stejný/podobný index,
      78    - při `prefers-reduced-motion` se lístek neotáčí, jen se vymě
          ní obsah.
      79  - **Ručně kreslené prvky:** šipka, kroužek, fajfka. Všechno mal
          á inline SVG, žádné písmo navíc.

  Ran 1 shell command (ctrl+o to expand)

⏺ Bod 1 je v commitu c6fedae. Teď bod 2: tlačítko hned pod pole, souhlas pod
  tlačítko a rezerva 50 px na lištu s návrhy e-mailů.

  Ran 1 shell command (ctrl+o to expand)

⏺ Bash(python3 - <<'EOF'
      p='public/index.html'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated public/index.html (+3 -3)
      414          <label class="field"><span class="field-label">Tvůj e-
           mail</span>
      415            <input type="email" name="email" autocomplete="email
           " inputmode="email" autocapitalize="none" spellcheck="false" e
           nterkeyhint="send" placeholder="jmeno@email.cz" required>
      416          </label>
      417 +        <button class="btn" type="submit">Získat tahák</button
          +>                                                             
      418 +        <p class="form-error" role="alert" hidden></p>        
      419          <label class="consent">
      420            <input type="checkbox" name="consent" value="ano" re
           quired>
      421            <span>Souhlasím, že mi Clientelo Czech&nbsp;s.r.o. b
           ude posílat e-maily o&nbsp;investování do ETF. Odhlásit se můž
           u kdykoli. <a href="ochrana-osobnich-udaju.html">Jak nakládáme
            s&nbsp;osobními údaji</a></span>
      422          </label>
      421 -        <div class="hp" aria-hidden="true"><label>Toto pole ne
          -ch prázdné <input type="text" name="web" tabindex="-1" autocom
          -plete="off"></label></div>                                    
      422 -        <p class="form-error" role="alert" hidden></p>        
      423 -        <button class="btn" type="submit">Získat tahák</button
          ->                                                             
      423          <p class="small">Tahák otevřeš hned po odeslání, na e-
           mail čekat nemusíš.</p>
      424 +        <div class="hp" aria-hidden="true"><label>Toto pole ne
          +ch prázdné <input type="text" name="web" tabindex="-1" autocom
          +plete="off"></label></div>                                    
      425        </form>
      426      </div>
      427    </div>

⏺ Bash(python3 - <<'EOF'
      p='public/index.html'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated public/index.html (+6 -3)
      731      s.marginBottom = Math.max(0, window.innerHeight - vv.heigh
           t - vv.offsetTop) + 'px';
      732      s.maxHeight = Math.round(kb ? vv.height - 8 : vv.height * 
           0.92) + 'px';
      733    }
      734 -  /* Pole s fokusem a tlačítko odeslat mají být nad klávesnicí
          -; když se nevejdou obě, má přednost pole. */                  
      734 +  /* Nad klávesnicí musí být vidět pole a tlačítko (je hned po
          +d polem), a to s rezervou na lištu s návrhy                   
      735 +     e-mailů: iOS ji do visualViewport nemusí započítat. Souhl
          +as může být těsně pod nimi. Když se nevejde                   
      736 +     ani pole s tlačítkem, má přednost pole. */               
      737 +  var SUGGEST_BAR = 50;                                       
      738    function keepFormVisible() {
      739      var a = doc.activeElement;
      740      var form = a && a.closest && a.closest('.lead-form');
      741      if (!form || !keyboardOpen()) return;
      739 -    var field = (a.closest('.field, .consent') || a).getBoundi
          -ngClientRect();                                               
      742 +    var field = form.querySelector('.field').getBoundingClient
          +Rect();                                                       
      743      var btn = form.querySelector('[type=submit]').getBoundingC
           lientRect();
      744      var inSheet = dialog.contains(form);
      745      var viewTop = inSheet ? dialog.getBoundingClientRect().top
            : vv.offsetTop;
      746      var viewH = inSheet ? dialog.clientHeight : vv.height;
      744 -    var need = btn.bottom + 12 - (viewTop + viewH);           
      747 +    var need = btn.bottom + 12 + SUGGEST_BAR - (viewTop + view
          +H);                                                           
      748      var room = field.top - 8 - viewTop;
      749      var dy = need > 0 ? Math.min(need, room) : Math.min(0, roo
           m);
      750      if (Math.abs(dy) < 1) return;

⏺ Teď WebKit test: lišta s návrhy jako 50px pruh nad klávesnicí, se kterým
  visualViewport nepočítá. Pole a tlačítko musí být celé nad ním.

  Searched for 1 pattern (ctrl+o to expand)

⏺ Bash(python3 - <<'EOF'
      p='scripts/test-webkit.mjs'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated scripts/test-webkit.mjs (+16 -7)
      13  const { webkit, devices } = await import('playwright');
      14  
      15  const BASE = process.argv[2] || BASE_URL;
      16 +const LISTA = 50; // rezerva na lištu s návrhy e-mailů nad kláv
         +esnicí                                                         
      17  // Viditelná výška nad klávesnicí (včetně lišty nad ní). Pesimi
          stický odhad, ne naměřená hodnota.
      18  const PHONES = [
      19    { name: 'iPhone 13', visible: 328, all: true },
     ...
      56      };
      57      const vis = {};
      58      for (const [k, v] of Object.entries(parts)) if (v) vis[k] =
           v.t >= top - 0.5 && v.b <= bottom + 0.5;
      58 -    return { vis, parts, top, bottom };                        
      59 +    // lišta s návrhy e-mailů nad klávesnicí: iOS ji do visualV
         +iewport nemusí započítat, proto zakrývá spodních 50 px         
      60 +    const nadListou = {};                                      
      61 +    for (const [k, v] of Object.entries(parts)) if (v) nadListo
         +u[k] = v.t >= top - 0.5 && v.b <= bottom - LISTA + 0.5;        
      62 +    const souhlasZacina = !!parts.souhlas && parts.souhlas.t < 
         +bottom;                                                        
      63 +    return { vis, nadListou, souhlasZacina, parts, top, bottom 
         +};                                                             
      64    }, root);
      65  }
      66  
     ...
      72      const top = window.visualViewport.offsetTop + window.visual
          Viewport.height;
      73      k.style.cssText = `position:fixed;inset:${top}px 0 0 0;marg
          in:0;width:100%;height:auto;border:0;padding:14px;background:#D
          1D4DA;color:#3A3A3C;font:600 15px -apple-system,sans-serif;text
          -align:center`;
      74      k.textContent = 'klávesnice (simulace)';
      75 +    const l = document.createElement('div');                   
      76 +    l.style.cssText = `position:absolute;left:0;right:0;top:-50
         +px;height:50px;background:repeating-linear-gradient(45deg,rgba(
         +150,155,165,.92) 0 8px,rgba(175,180,190,.92) 8px 16px);color:#1
         +C1C1E;font:600 13px/50px -apple-system,sans-serif`;            
      77 +    l.textContent = 'lišta s návrhy e-mailů (simulace, 50 px)';
      78 +    k.appendChild(l);                                          
      79      document.body.appendChild(k);
      80      k.showPopover();
      81    });
     ...
      174        check(`${tag}: spodek panelu sedí na klávesnici`, Math.a
           bs(sheet.b - phone.visible) <= 1, `spodek ${sheet.b}, klávesni
           ce od ${phone.visible}`);
      175        check(`${tag}: panel nepřesahuje nahoru`, sheet.t >= 0, 
           `horní okraj ${sheet.t}`);
      176        let v = await inView(page, '#panel');
      168 -      const must = phone.all ? ['nadpis', 'pole', 'souhlas', '
          -tlacitko'] : ['pole', 'souhlas', 'tlacitko'];                 
      169 -      check(`${tag}: s klávesnicí vidět ${must.join(', ')}`, m
          -ust.every((k) => v.vis[k]), JSON.stringify(v.vis));           
      177 +      const ok = (v) => v.nadListou.pole && v.nadListou.tlacit
          +ko && (!phone.all || v.vis.nadpis) && v.souhlasZacina;        
      178 +      const popis = phone.all ? 'nadpis, pole a tlačítko nad l
          +ištou návrhů, souhlas začíná pod nimi' : 'pole a tlačítko nad 
          +lištou návrhů, souhlas začíná pod nimi';                      
      179 +      check(`${tag}: s klávesnicí ${popis}`, ok(v), JSON.strin
          +gify(v.nadListou));                                           
      180        await page.keyboard.type('jana@example.com');
      181        check(`${tag}: v poli je vidět, co píšu`, (await page.in
           putValue('#panel input[name=email]')) === 'jana@example.com' &
           & v.vis.pole);
      182        await drawKeyboard(page);
     … 25 more lines (ctrl+o to expand)

⏺ LISTA je proměnná v Node, ale inView běží v prohlížeči. Předám ji jako
  argument.

  Ran 1 shell command (ctrl+o to expand)

⏺ Bash(python3 - <<'EOF'
      p='scripts/test-webkit.mjs'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated scripts/test-webkit.mjs (+2 -2)
      43  
      44  // Které části formuláře leží celé ve viditelné oblasti (nad kl
          ávesnicí, pod horním okrajem).
      45  function inView(page, root) {
      46 -  return page.evaluate((root) => {                             
      46 +  return page.evaluate(([root, LISTA]) => {                    
      47      const r = document.querySelector(root);
      48      const top = window.visualViewport.offsetTop;
      49      const bottom = top + window.visualViewport.height;
     ...
      61      for (const [k, v] of Object.entries(parts)) if (v) nadListo
          u[k] = v.t >= top - 0.5 && v.b <= bottom - LISTA + 0.5;
      62      const souhlasZacina = !!parts.souhlas && parts.souhlas.t < 
          bottom;
      63      return { vis, nadListou, souhlasZacina, parts, top, bottom 
          };
      64 -  }, root);                                                    
      64 +  }, [root, LISTA]);                                           
      65  }
      66  
      67  // Fiktivní klávesnice do snímku: popover je v top layer nad pa
          nelem.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Na staré verzi nové kontroly neprojdou, na nové fungují na všech třech
  zařízeních včetně 320 px. Teď přidám test odeslání klávesou Enter se stejnou
  kontrolou souhlasu.

⏺ Bash(python3 - <<'EOF'
      p='scripts/test-page.mjs'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated scripts/test-page.mjs (+21 -0)
      338      await page.close();
      339    }
      340  
      341 +  // 13) Odeslání modrou klávesou na klávesnici (enterkeyhint=
          +"send", Enter): stejná kontrola souhlasu                      
      342 +  {                                                           
      343 +    const { page } = await open();                            
      344 +    const F = '[data-slot="sekce"] .lead-form';               
      345 +    const order = await page.$eval(F, (f) => [...f.children].m
          +ap((c) => c.matches('.field') ? 'pole' : c.matches('[type=subm
          +it]') ? 'tlacitko' : c.matches('.consent') ? 'souhlas' : null)
          +.filter(Boolean).join(','));                                  
      346 +    check('formulář: tlačítko hned pod polem, souhlas pod tlač
          +ítkem', order === 'pole,tlacitko,souhlas', order);            
      347 +    check('pole e-mail má enterkeyhint="send"', (await page.$e
          +val(`${F} input[name=email]`, (i) => i.getAttribute('enterkeyh
          +int'))) === 'send');                                          
      348 +    await page.type(`${F} input[name=email]`, 'enter@example.c
          +om');                                                         
      349 +    await page.keyboard.press('Enter');                       
      350 +    await sleep(150);                                         
      351 +    const err = ((await text(page, `${F} .form-error`)) || '')
          +;                                                             
      352 +    const focus = await page.evaluate(() => document.activeEle
          +ment.name);                                                   
      353 +    check('Enter bez souhlasu: hláška o souhlasu a fokus na za
          +škrtávátku', err === 'Zaškrtni prosím souhlas.' && focus === '
          +consent', `${err} | ${focus}`);                               
      354 +    await page.tap(`${F} input[name=consent]`);               
      355 +    await page.focus(`${F} input[name=email]`);               
      356 +    await page.keyboard.press('Enter');                       
      357 +    await sleep(700);                                         
      358 +    check('Enter se souhlasem: odesláno, poděkování', ((await 
          +text(page, '#tahak .thanks h3')) || '') === 'Hotovo, tahák je 
          +tvůj.');                                                      
      359 +    await page.close();                                       
      360 +  }                                                           
      361 +                                                              
      362    // 12) Nedostupná databáze: hláška, tlačítko zase funguje, p
           o obnovení druhý pokus projde
      363    {
      364      const { page, logs } = await open();

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Druhé odeslání Enterem neprošlo. Podívám se, co formulář po Enteru ukazuje.
  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Kliknutí mimo zaškrtávátko bylo způsobeno posunem stránky po chybové hlášce,
  kde tap zasáhl původní pozici. Počkám, až se posun ustálí, než budu
  pokračovat.

⏺ Bash(python3 - <<'EOF'
      p='scripts/test-page.mjs'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated scripts/test-page.mjs (+1 -0)
      351      const err = ((await text(page, `${F} .form-error`)) || '')
           ;
      352      const focus = await page.evaluate(() => document.activeEle
           ment.name);
      353      check('Enter bez souhlasu: hláška o souhlasu a fokus na za
           škrtávátku', err === 'Zaškrtni prosím souhlas.' && focus === '
           consent', `${err} | ${focus}`);
      354 +    await sleep(700); // fokus na zaškrtávátko stránku plynule
          + posune, klepnout až potom                                    
      355      await page.tap(`${F} input[name=consent]`);
      356      await page.focus(`${F} input[name=email]`);
      357      await page.keyboard.press('Enter');

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Chrome 113 kontrol prošlo. Podívám se na snímky panelu s klávesnicí a lištou
  návrhů.

  Read 2 files (ctrl+o to expand)

⏺ Pole i tlačítko jsou nad klávesnicí, ale pruh lišty návrhů se do snímku
  nenakreslil, protože ho popover ořízl (overflow). Opravím kreslení a snímky
  přegeneruji.

⏺ Bash(python3 - <<'EOF'
      p='scripts/test-webkit.mjs'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated scripts/test-webkit.mjs (+1 -1)
      70      const k = document.createElement('div');
      71      k.popover = 'manual';
      72      const top = window.visualViewport.offsetTop + window.visual
          Viewport.height;
      73 -    k.style.cssText = `position:fixed;inset:${top}px 0 0 0;marg
         -in:0;width:100%;height:auto;border:0;padding:14px;background:#D
         -1D4DA;color:#3A3A3C;font:600 15px -apple-system,sans-serif;text
         --align:center`;                                                
      73 +    k.style.cssText = `position:fixed;inset:${top}px 0 0 0;marg
         +in:0;width:100%;height:auto;overflow:visible;border:0;padding:1
         +4px;background:#D1D4DA;color:#3A3A3C;font:600 15px -apple-syste
         +m,sans-serif;text-align:center`;                               
      74      k.textContent = 'klávesnice (simulace)';
      75      const l = document.createElement('div');
      76      l.style.cssText = `position:absolute;left:0;right:0;top:-50
          px;height:50px;background:repeating-linear-gradient(45deg,rgba(
          150,155,165,.92) 0 8px,rgba(175,180,190,.92) 8px 16px);color:#1
          C1C1E;font:600 13px/50px -apple-system,sans-serif`;

  Read 1 file, called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Teď je vidět, že pole i tlačítko zůstávají nad lištou návrhů a souhlas začíná
  pod nimi. Pruh udělám neprůhledný jako ve skutečnosti a doplním dokumentaci.

⏺ Bash(sed -i '' 's/rgba(150,155,165,.92) 0 8px,rgba(175,180,190,.92) 8px
      16px/#969BA5 0 8px,#AFB4BE 8px 16px/' scripts/test-webkit.mjs && grep -c
      "#969BA5" scripts/te…)
  ⎿  Updated README.md (+3 -2)
      166    - po zavření se stránka vrátí na stejné místo a fokus na tla
           čítko, které panel otevřelo,
      167    - nic nepřetéká do šířky.
      168  
      169 -  Viditelnou výšku nad klávesnicí (328 px na iPhonu 13, 343 px
          - na SE, 244 px na 320 px) jsme odhadli pesimisticky, nenaměřil
          -i.                                                            
      169 +  Viditelnou výšku nad klávesnicí (328 px na iPhonu 13, 343 px
          + na SE, 244 px na 320 px) jsme odhadli pesimisticky, nenaměřil
          +i. Nad klávesnicí navíc počítá s 50px lištou s návrhy e-mailů,
          + kterou iOS do `visualViewport` nemusí započítat: pole a tlačí
          +tko musí být celé nad ní.                                     
      170 +- **WebKit, průběh otočení lístku:** animaci zastaví po 100 ms
          + a kontroluje úhel, šířku a viditelnou stranu (nikdy zrcadlově
          +, nikdy prázdný lístek), z výřezů skládá [snímek](docs/screens
          +hots/webkit-otoceni-listku.png).                              
      171  - **Lighthouse (mobil), data proti zdrojům, čísla na stránce p
           roti datům, text PDF proti datům.**
      172  
      173  **Jen na skutečném telefonu:**
      174  
      174 -- skutečná klávesnice iOS: její výška, lišta nad ní (šipky, Ho
          -tovo, automatické doplnění e-mailu) a to, jak Safari sám posou
          -vá stránku k poli,                                            
      175 +- skutečná klávesnice iOS: její výška, lišta nad ní (šipky, Ho
          +tovo, automatické doplnění e-mailu) a to, jak Safari sám posou
          +vá stránku k poli. **Lištu s návrhy e-mailů první simulace nez
          +achytila, našel ji až test na reálném telefonu** (tlačítko „Zí
          +skat tahák“ skončilo pod klávesnicí). Formulář má proto tlačít
          +ko hned pod polem, souhlas pod ním a rezervu 50 px,           
      176  - plynulost otočení lístků na skutečném displeji. Průběh (úhel
           , šířka a viditelná strana po 100 ms) test ve WebKitu kontrolu
           je a skládá do [snímku](docs/screenshots/webkit-otoceni-listku
           .png),
      177  - otevření a uložení PDF v Safari,
      178  - nativní sdílení a kopírování odkazu,
  ⎿  Updated scripts/test-webkit.mjs (+1 -1)
      73      k.style.cssText = `position:fixed;inset:${top}px 0 0 0;marg
          in:0;width:100%;height:auto;overflow:visible;border:0;padding:1
          4px;background:#D1D4DA;color:#3A3A3C;font:600 15px -apple-syste
          m,sans-serif;text-align:center`;
      74      k.textContent = 'klávesnice (simulace)';
      75      const l = document.createElement('div');
      76 -    l.style.cssText = `position:absolute;left:0;right:0;top:-50
         -px;height:50px;background:repeating-linear-gradient(45deg,rgba(
         -150,155,165,.92) 0 8px,rgba(175,180,190,.92) 8px 16px);color:#1
         -C1C1E;font:600 13px/50px -apple-system,sans-serif`;            
      76 +    l.style.cssText = `position:absolute;left:0;right:0;top:-50
         +px;height:50px;background:repeating-linear-gradient(45deg,#969B
         +A5 0 8px,#AFB4BE 8px 16px);color:#1C1C1E;font:600 13px/50px -ap
         +ple-system,sans-serif`;                                        
      77      l.textContent = 'lišta s návrhy e-mailů (simulace, 50 px)';
      78      k.appendChild(l);
      79      document.body.appendChild(k);
  ⎿  Updated texty.md (+1 -0)
      222  - **Souhlas (zaškrtávací pole):** Souhlasím, že mi Clientelo C
           zech s.r.o. bude posílat e-maily o investování do ETF. Odhlási
           t se můžu kdykoli.
      223    - odkaz: Jak nakládáme s osobními údaji → `public/ochrana-os
           obnich-udaju.html` (návrh, musí schválit právník)
      224    - `[ROZHODNOUT + právník: smí být stažení taháku podmíněné s
           ouhlasem s marketingovými e-maily? Pokud ne, souhlas bude dobr
           ovolný a tahák dostane každý, kdo vyplní e-mail.]`
      225 +- **Pořadí:** pole, hned pod ním tlačítko, pak souhlas a text 
          +pod ním. Tlačítko je co nejvýš, aby ho na mobilu nezakryla klá
          +vesnice s lištou návrhů e-mailů. Odeslat jde i modrou klávesou
          + „Odeslat“ na klávesnici (`enterkeyhint="send"`), se stejnou k
          +ontrolou souhlasu.                                            
      226  - **Tlačítko:** Získat tahák
      227  - **Tlačítko při odesílání:** Odesílám…
      228  - **Pod tlačítkem:** Tahák otevřeš hned po odeslání, na e-mail
            čekat nemusíš.

  Read 1 file, called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Formulář v klidovém stavu vypadá dobře. Commituji bod 2.

  Ran 1 shell command (ctrl+o to expand)

⏺ Bod 2 je hotový (commit 6e67e14). Pro bod 3 (bezpečnost) vybírám relevantní
  skilly – security-review, code-review na api/, supabase/, vercel.json a
  public/, TDD pro nové ochrany a finální verifikaci – a teď spouštím
  security-review.

⏺ Skill(security-review)
  ⎿  Initializing…
  ⎿  Error: Shell command failed for pattern "!`git log --no-decorate
     origin/HEAD...`": [stderr]
     fatal: ambiguous argument 'origin/HEAD...': unknown revision or path not in
     the working tree.
     Use '--' to separate paths from revisions, like this:
     'git <command> [<revision>...] -- [<file>...]'

⏺ Skill security-review čeká lokální odkaz origin/HEAD, který v repu chybí.
  Nastavím ho lokálně na main (nic se neposílá) a zkusím to znovu.

  Ran 1 shell command (ctrl+o to expand)

⏺ Skill(security-review)
  ⎿  Successfully loaded skill

⏺ Agent(Identify security vulnerabilities)
  ⎿  Done (20 tool uses · 100.3k tokens · 4m 18s)
  (ctrl+o to expand)

› Message from general-purpose
  # Security review: ETF dvojčata (branch diff plus whole-project audit)

  **Result: I found no HIGH or MEDIUM vulnerabilities that an outside attacker
  could exploit.** No files were changed. The only extra command I ran was a
  throwaway Chromium probe from the scratchpad, and the repo is still clean. I
  never read or printed `.env.local` or any key value.

  ## Branch diff (`origin/HEAD...HEAD`)
  These are two commits that change `public/index.html`: the card flip now uses
  the Web Animations API with `data-strana` set to the fixed values `lic`/`rub`,
  and the form order changed (submit button under the field, honeypot moved to
  the end). The tests and docs changed too.
  - No new sinks, no new network calls, no new data flows.
  - The honeypot is still inside the form, keeps `tabindex="-1"` and is still
  checked on both client and server.
  - **Nothing security-relevant in the diff.**

  ## What I checked in the whole project, and the outcome

  **XSS through `?v=` (`public/index.html:212-215`)**
  - Only the fixed strings from the object literal can reach `innerHTML`; the
  URL value is used only as a lookup key.
  - I tested it in headless Chrome. `?v=<img src=x onerror=...>` matches
  nothing, so the script does nothing.
  - `?v=constructor`, `__proto__` or `toString` make the H1 read the literal
  text "undefined" and blank the lead paragraph. That is cosmetic only, not XSS.
  - There are no other `innerHTML`, `insertAdjacentHTML`, `document.write` or
  `eval` sinks. `utm_source` is stripped to `[A-Za-z0-9_:.-]{0,40}` before it is
  sent.

  **Supabase access (`supabase/schema.sql:35-40`, `funnel.sql:13-16`)**
  - RLS is on, there are no policies, and `revoke all` from `anon` and
  `authenticated` removes the default grants Supabase gives on `public`.
  - The sequences created for the identity columns keep their default grants,
  but PostgREST does not expose them and there are no RPC functions. Not
  exploitable.
  - `analytika` has no USAGE grant for anon, is not in the API's exposed
  schemas, and the view is `security_invoker`.
  - The publishable key does not appear anywhere in `public/`.

  **Secrets**
  - `SUPABASE_SECRET_KEY` is used only in `api/` as the `apikey` header.
  - Error logs contain only `r.status` or `e.name`, and responses contain only
  `{ok, chyba}`.
  - I searched the working tree, the full git history and `ai-log/` for
  `sb_secret_…`, `sb_publishable_…`, JWTs and `*.supabase.co` project URLs: 0
  hits.

  **`lead.js`**
  - It rejects any unknown key (`POLE` whitelist, line 52), so the visit ID or
  extra fields cannot be stored.
  - It writes only `{email, souhlas: true, varianta}`, with `varianta`
  normalised against a whitelist.
  - The body is built with `JSON.stringify` and `on_conflict` is fixed, so there
  is no PostgREST injection.
  - Duplicate emails get the same response, so the form cannot be used to check
  which addresses are already stored.

  **`event.js`**
  - It accepts only a UUIDv4, a whitelisted event name, a whitelisted variant
  and a detail matching `^[A-Za-z0-9_:.-]{1,40}$`. The database has the same
  CHECK constraints.
  - Someone could fake events (bad analytics), but cannot store arbitrary data
  or an `@`.

  **Origin check (both functions)**
  - A request with no Origin header is allowed, which only helps non-browser
  clients that could post anyway.
  - From another site, `lead.js` needs a CORS preflight that gets no CORS
  headers, and a cross-site `sendBeacon` to `/api/event` carries a foreign or
  `null` Origin and gets 403.
  - Getting past the check gains nothing beyond what a curl client already has.

  **`keepalive.js`**
  - If `CRON_SECRET` is not set, it returns 401. The response leaks nothing and
  it only runs a read-only `select … limit 1`.

  **`scripts/server.mjs`**
  - No path traversal: `decodeURIComponent`, then `normalize(join())`, then a
  `startsWith(PUBLIC + sep)` check. There are no symlinks in `public/`.
  - Function names must match `^[a-z]+$` and be on the list read from `api/`.

  **Deployment (`vercel.json`)**
  - `outputDirectory: public`, so `api/` source, `ai-log/`, `supabase/` and
  `.env*` are not served.

  ## Privacy problem below the vulnerability bar: visit ID and e-mail can still
  be linked
  Locations: `supabase/schema.sql:9-29`, `public/index.html:658-659`, and the
  claim in `README.md:79` and `schema.sql:19`.

  Severity: not something an outsider can exploit, because it needs read access
  to the database. **But it defeats a control the project explicitly relies
  on**, so confidence that the linking works is 9/10.

  **What happens:**
  1. The `odeslano` event is sent immediately after `/api/lead` succeeds.
  2. `leads.souhlas_cas` is stored to the microsecond, and both tables use
  sequential identity `id`s.
  3. So within any hour bucket, the k-th `odeslano` event (ordered by
  `events.id`) matches the k-th new lead (ordered by `leads.id` or
  `souhlas_cas`).
  4. Even with random IDs, an hour with only one lead (likely at small ad
  traffic) pairs trivially. PostgreSQL's `xmin` system column also exposes
  insertion order across tables.

  **Consequence:** whoever has database access (owner, Clientelo, or anyone
  after a breach) can attach each e-mail to that visit's whole event trail. The
  events then count as personal data, and the README's statement that hour
  rounding prevents pairing is not true.

  **Recommendation:** you can't fix this by rounding time more coarsely. Either:
  - send `odeslano` without `navsteva` (count it as a total, so the last funnel
  step is not per-visit), or
  - keep it as is and rewrite the README and schema claims so the lawyer judges
  the measurement on accurate facts.

  ## Hardening notes (not vulnerabilities, do not meet the bar)
  - **Security headers:** there is no Content-Security-Policy. Both inline
  scripts can be allowed by hash, for example `default-src 'self'; script-src
  'sha256-…' 'sha256-…'; style-src 'unsafe-inline'; img-src 'self' data:;
  connect-src 'self'; form-action 'self'; base-uri 'none'; object-src 'none';
  frame-ancestors 'none'`. Also add `Permissions-Policy` and
  `Cross-Origin-Opener-Policy: same-origin`, and confirm HSTS on any custom
  domain.
  - **`?v=` lookup (`index.html:212-215`):** use an own-property check
  (`Object.prototype.hasOwnProperty.call(t, v)`, or a `Map`) so `?v=constructor`
  cannot turn the headline into "undefined".
  - **Lead quality and consent:** anyone with curl can sign up someone else's
  address, because neither the Origin check nor the honeypot stops scripts. Add
  double opt-in before any marketing e-mail; it also gives proof of consent
  under GDPR.
  - **Email format:** the regex accepts `<>"'` and a leading `=`, `+` or `-`.
  Tighten it, or neutralise those characters when exporting to CSV or Excel
  (formula injection).
  - **Origin check:** compare against an explicit allowlist (an env variable
  such as `ALLOWED_ORIGINS`) instead of the `Host`/`X-Forwarded-Host` headers.
  - **Supabase defaults:** Supabase's default privileges still grant new
  `public` tables, sequences and functions to `anon` and `authenticated`. Add
  `alter default privileges in schema public revoke all on tables, sequences,
  functions from anon, authenticated;`. The browser never needs the publishable
  key, so consider deleting it and disabling `pg_graphql`.
  - **Local dev server (`scripts/server.mjs:76-81, 105`):** `/__dev/db` is an
  unauthenticated GET that dumps the database, wipes it with `?smazat`, or
  toggles a fake outage with `?vypadek`. With `HOST=0.0.0.0` anyone on the same
  Wi-Fi can use it, and there is no Host-header check, so a DNS-rebinding page
  could too. The data is fake test data only, so this is low risk; a Host check
  or a random token would close it.
  - **Test address in the public repo:** `ai-log/denik.md:110` still contains
  the realistic-looking test address (`j…@seznam.cz`) that the same entry says
  was replaced with `example.com`. It is already in 3 commits on `origin`.
  Redact it in the file going forward; no history rewrite, per the project
  rules.

⏺ Skill security-review nenašel žádnou vysoce/středně závažnou zranitelnost
  zneužitelnou útočníkem zvenčí, odhalil ale problém se soukromím (možnost
  spárovat záznam odeslano s kontaktem podle pořadí a sekvenčních ID) a několik
  návrhů na zpevnění (CSP, Permissions-Policy, validace e-mailu, práva v
  Supabase atd.). Opravím nepravdivé tvrzení v README a teď spustím druhý skill,
  code-review, na celý projekt.

⏺ Skill(code-review)
  ⎿  Done

⏺ Skill code-review přinesl osm nálezů včetně problémů s trychtýřem, honeypotem,
  zablokovaným tlačítkem, rozdílem toLowerCase()/lower(), chybějícím rate
  limitem a zdvojeným kódem v api/. Nejdřív ověřím ve zdrojovém kódu Vercelu, že
  soubory s podtržítkem v api/ nejsou funkce, a poté přesunu sdílený kód do
  api/_lib.js.

  Called plugin:context-mode:context-mode 2 times (ctrl+o to expand)

⏺ Potvrdil jsem ze zdrojového kódu Vercelu, že soubory v api/ s cestou
  obsahující /_ nejsou funkce, takže sdílený kód umístím do api/_lib.js. Dál
  zjistím, z jaké hlavičky brát IP adresu na Vercelu a zda lze SQL testovat v
  PGlite.

  Called plugin:context-mode:context-mode 2 times, ran 1 shell command (ctrl+o to expand)

⏺ Ověřil jsem, že hlavičku x-forwarded-for nastavuje Vercel s reálnou IP
  klienta, takže ji použiju pro rate limiting. Teď nainstaluji PGlite 0.5.8 a
  ověřím podporu rolí a RLS, pak otestuji schema.sql na skutečném Postgresu.

⏺ Bash(npm install --no-audit --no-fund --save-dev --save-exact
      @electric-sql/pglite@0.5.8 2>&1 | tail -1 && node -e "
      const { PGlite } = require('@electric-sql/pglite…)
  ⎿  Updated scripts/package-lock.json (+8 -0)
       6      "": {
       7        "name": "etf-dvojcata-scripts",
       8        "devDependencies": {
       9 +        "@electric-sql/pglite": "0.5.8",                       
      10          "lighthouse": "13.5.0",
      11          "playwright": "1.63.0",
      12          "puppeteer-core": "25.13.0"
      13        }
      14      },
      15 +    "node_modules/@electric-sql/pglite": {                     
      16 +      "version": "0.5.8",                                      
      17 +      "resolved": "https://registry.npmjs.org/@electric-sql/pgl
         +ite/-/pglite-0.5.8.tgz",                                       
      18 +      "integrity": "sha512-n9tsbUOhwx2epK1V0ZG9Ar4SHWUju04dhmzZ
         +XiSBXwBoleOvIfals33NAaWgagQVAL4Rbvx/Ptsu3P+pA09f6Q==",         
      19 +      "dev": true,                                             
      20 +      "license": "Apache-2.0"                                  
      21 +    },                                                         
      22      "node_modules/@formatjs/ecma402-abstract": {
      23        "version": "2.3.6",
      24        "resolved": "https://registry.npmjs.org/@formatjs/ecma402
          -abstract/-/ecma402-abstract-2.3.6.tgz",
  ⎿  Updated scripts/package.json (+1 -0)
      12      "test:webkit": "node test-webkit.mjs"
      13    },
      14    "devDependencies": {
      15 +    "@electric-sql/pglite": "0.5.8",                           
      16      "lighthouse": "13.5.0",
      17      "playwright": "1.63.0",
      18      "puppeteer-core": "25.13.0"
  ⎿  (timeout 3m)

⏺ PGlite funguje včetně rolí a RLS (Postgres 18.3), takže schéma půjde testovat
  naostro. Teď seznam jednorázových e-mailových domén: zdroj, licence a verze.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Seznam obsahuje 9 222 domén (130 kB), včetně mailinator.com a
  10minutemail.com, bez seznam.cz, email.cz, centrum.cz či gmail.com. GitHub
  licenci nerozpoznal, takže se teď podívám přímo do souboru s licencí.
  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Licence CC0 1.0 umožňuje seznam přibalit, takže vše je ověřeno a začínám
  stavět. Nejprve vytvořím generátor seznamu jednorázových domén, který stáhne
  pevný commit a zapíše modul api/_jednorazove-domeny.js se zdrojem a datem.

⏺ Write(scripts/jednorazove-domeny.mjs)
  ⎿  Wrote 34 lines to scripts/jednorazove-domeny.mjs
       1 // Stáhne seznam jednorázových e-mailových domén a zapíše ho do
       2 // Zdroj: github.com/disposable-email-domains/disposable-email-d
         omains, licence CC0 1.0 (volné dílo).
       3 // Použití: node jednorazove-domeny.mjs [commit]   (bez argument
       4 import { fileURLToPath } from 'node:url';
       5 import { dirname, join } from 'node:path';
       7
       8 const REPO = 'disposable-email-domains/disposable-email-domains'
         ;
      10 const headers = { 'User-Agent': 'etf-dvojcata' };
     … +39 lines (ctrl+o to expand)

⏺ Bash(SSL_CERT_FILE=/etc/ssl/cert.pem node jednorazove-domeny.mjs
      81a8976e63879a11bf4301a28c14e0eb7a7855cf && ls -la ../api/ && head -c 400
      ../api/_jednorazove-domeny…)
  ⎿  1 file changed (binary, mode only or too large to show)

⏺ Teď vytvořím sdílený modul api/_lib.js, kam sloučím všechny kontroly na jedno
  místo – limit těla požadavku, ověření Origin, validaci e-mailu (formát, MX,
  jednorázové domény), token pro rate-limit, HMAC klíč z IP adresy a volání
  Supabase funkcí.

⏺ Write(api/_lib.js)
  ⎿  Wrote 140 lines to api/_lib.js
       1 // Společné kontroly pro funkce v api/. Soubor začíná podtržítke
         m, takže z něj Vercel neudělá endpoint
         t-builders.ts přeskakuje cesty s „/_“).
       3 import { createHmac, timingSafeEqual } from 'node:crypto';
       4 import { promises as dns } from 'node:dns';
       6
       7 export const VARIANTY = ['vychozi', 'dvojce', 'zacatek'];
       8
         a opravdu posílá (do měření nejde uložit nic jiného).
      10 const ETF = 'VOO|VTI|VT|VWO|SDY|VGT|AGG';
     … +169 lines (ctrl+o to expand)

⏺ Teď funkce: lead.js s celým řetězcem kontrol, event.js s limity, nový token.js
  a keepalive.js, který zároveň uklízí staré záznamy limitů.

⏺ Write(api/lead.js)
  ⎿  Added 28 lines, removed 57 lines
       1 -// POST /api/lead – uloží e-mail a souhlas do Supabase (tabulka
         - leads).                                                       
       2 -// Secret klíč je jen v proměnných prostředí na serveru (SUPABA
         -SE_URL, SUPABASE_SECRET_KEY), nikdy v odpovědi ani v logu.     
       3 -// Funkce nepřijme ID návštěvy ani nic jiného navíc: e-mail se 
         -s měřením nikdy nespojuje.                                     
       4 -// Vstup ověřuje sama, na formulář v prohlížeči se nespoléhá.  
       1 +// POST /api/lead – uloží e-mail a souhlas do Supabase (funkce 
         +uloz_kontakt, tabulka leads).                                  
       2 +// Secret klíč je jen v proměnných prostředí na serveru, nikdy 
         +v odpovědi ani v logu.                                         
       3 +// Funkce nepřijme ID návštěvy ani nic jiného navíc: e-mail se 
         +s měřením nikdy neposílá ani neukládá.                         
       4 +// Ochrana proti spamu, v tomhle pořadí (na formulář v prohlíže
         +či se nespoléhá):                                              
       5 +//   povolená pole a velikost → skryté pole → token (rychlost o
         +deslání) → formát e-mailu → souhlas →                          
       6 +//   jednorázová doména → MX záznam → limit pokusů z jedné IP (
         +v databázi, s hashem IP) → duplicita.                          
       7 +// Bot (skryté pole, příliš rychlé odeslání) dostane stejnou od
         +pověď jako úspěch, ať se nic nedozví.                          
       8 +import { VARIANTY, odpoved, nactiTelo, ciziPuvod, platnyEmail, 
         +jednorazovaDomena, maPostu, overToken, klicIp, chybiNastaveni, 
         +rpc } from './_lib.js';                                        
       9  
      10  const MAX_BYTES = 1024;
       7 -const VARIANTY = ['vychozi', 'dvojce', 'zacatek'];             
       8 -const POLE = ['email', 'souhlas', 'varianta', 'web']; // web = 
         -skryté pole proti botům                                        
       9 -const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;               
      11 +const POLE = ['email', 'souhlas', 'varianta', 'token', 'poznamk
         +a']; // poznamka = skryté pole proti botům                     
      12  
      11 -const odpoved = (status, data) => Response.json(data, { status,
         - headers: { 'Cache-Control': 'no-store' } });                  
      12 -                                                               
      13 -// Tělo požadavku nejvýš max bajtů, i když klient délku neuvede
         - nebo lže.                                                     
      14 -async function nactiTelo(request, max) {                       
      15 -  if (Number(request.headers.get('content-length') || 0) > max)
         - return { chyba: 413 };                                        
      16 -  if (!request.body) return { text: '' };                      
      17 -  const reader = request.body.getReader();                     
      18 -  const casti = [];                                            
      19 -  let delka = 0;                                               
      20 -  for (;;) {                                                   
      21 -    const { done, value } = await reader.read();               
      22 -    if (done) break;                                           
      23 -    delka += value.byteLength;                                 
      24 -    if (delka > max) {                                         
      25 -      await reader.cancel();                                   
      26 -      return { chyba: 413 };                                   
      27 -    }                                                          
      28 -    casti.push(value);                                         
      29 -  }                                                            
      30 -  return { text: Buffer.concat(casti).toString('utf8') };      
      31 -}                                                              
      32 -                                                               
      33 -// Požadavek z cizí stránky (formulář jinde, který posílá sem) 
         -odmítneme. Roboti hlavičku zfalšují, běžný prohlížeč ne.       
      34 -function ciziPuvod(request) {                                  
      35 -  const origin = request.headers.get('origin');                
      36 -  if (!origin) return false;                                   
      37 -  const host = request.headers.get('x-forwarded-host') || reque
         -st.headers.get('host');                                        
      38 -  try { return new URL(origin).host !== host; } catch { return 
         -true; }                                                        
      39 -}                                                              
      40 -                                                               
      13  export default {
      14    async fetch(request) {
      15      if (request.method !== 'POST') return new Response(null, { 
          status: 405, headers: { Allow: 'POST' } });
     ...
      22      try { data = JSON.parse(text); } catch { return odpoved(400
          , { ok: false, chyba: 'format' }); }
      23      if (!data || typeof data !== 'object' || Array.isArray(data
          )) return odpoved(400, { ok: false, chyba: 'format' });
      24      if (Object.keys(data).some((k) => !POLE.includes(k))) retur
          n odpoved(400, { ok: false, chyba: 'pole' });
      25 +    if (chybiNastaveni(['SUPABASE_URL', 'SUPABASE_SECRET_KEY', 
         +'ANTISPAM_SECRET'])) return odpoved(503, { ok: false, chyba: 'k
         +onfigurace' });                                                
      26  
      54 -    // Skryté pole vyplnil bot: tváříme se úspěšně, nic neuklád
         -áme.                                                           
      55 -    if (typeof data.web === 'string' && data.web.trim()) return
         - odpoved(200, { ok: true });                                   
      27 +    if (typeof data.poznamka === 'string' && data.poznamka.trim
         +()) {                                                          
      28 +      console.warn('[lead] zamítnuto: vyplněné skryté pole');  
      29 +      return odpoved(200, { ok: true });                       
      30 +    }                                                          
      31 +    const token = overToken(data.token);                       
      32 +    if (token === 'neplatny') return odpoved(400, { ok: false, 
         +chyba: 'token' });                                             
      33 +    if (token === 'rychle') {                                  
      34 +      console.warn('[lead] zamítnuto: odesláno dřív než 3 s po 
         +načtení');                                                     
      35 +      return odpoved(200, { ok: true });                       
      36 +    }                                                          
      37  
      38      const email = typeof data.email === 'string' ? data.email.t
          rim().toLowerCase() : '';
      58 -    if (email.length > 254 || !EMAIL.test(email)) return odpove
         -d(422, { ok: false, chyba: 'email' });                         
      39 +    if (!platnyEmail(email)) return odpoved(422, { ok: false, c
         +hyba: 'email' });                                              
      40      if (data.souhlas !== true) return odpoved(422, { ok: false,
           chyba: 'souhlas' });
      41 +    const domena = email.split('@')[1];                        
      42 +    if (jednorazovaDomena(domena)) return odpoved(422, { ok: fa
         +lse, chyba: 'jednorazovy' });                                  
      43 +    if (await maPostu(domena) === false) return odpoved(422, { 
         +ok: false, chyba: 'mx' });                                     
      44      const varianta = VARIANTY.includes(data.varianta) ? data.va
          rianta : 'vychozi';
      45  
      62 -    const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env; 
      63 -    if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {               
      64 -      console.error('[lead] chybí proměnná prostředí SUPABASE_U
         -RL nebo SUPABASE_SECRET_KEY');                                 
      65 -      return odpoved(503, { ok: false, chyba: 'konfigurace' });
      66 -    }                                                          
      46      try {
      68 -      // Opakovaný e-mail se neuloží znovu a návštěvník dostane
         - stejnou odpověď (neprozradíme, kdo už v databázi je).         
      69 -      const r = await fetch(`${SUPABASE_URL}/rest/v1/leads?on_c
         -onflict=email`, {                                              
      70 -        method: 'POST',                                        
      71 -        headers: { apikey: SUPABASE_SECRET_KEY, 'Content-Type':
         - 'application/json', Prefer: 'resolution=ignore-duplicates,retu
         -rn=minimal' },                                                 
      72 -        body: JSON.stringify({ email, souhlas: true, varianta }
         -),                                                             
      73 -        signal: AbortSignal.timeout(8000),                     
      74 -      });                                                      
      75 -      if (!r.ok) {                                             
      76 -        console.error(`[lead] Supabase vrátil ${r.status}`);   
      77 -        return odpoved(502, { ok: false, chyba: 'databaze' }); 
      78 -      }                                                        
      47 +      // limit pokusů a uložení v jedné transakci; opakovaný e-
         +mail se neuloží znovu, odpověď je stejná                       
      48 +      const vysledek = await rpc('uloz_kontakt', { p_klic: klic
         +Ip(request, 'lead'), p_email: email, p_varianta: varianta });  
      49 +      if (vysledek === 'limit') return odpoved(429, { ok: false
         +, chyba: 'limit' });                                           
      50      } catch (e) {
      80 -      console.error(`[lead] Supabase nedostupný (${e.name})`); 
      51 +      console.error(`[lead] databáze: ${e.status ? `Supabase vr
         +átil ${e.status}` : `nedostupná (${e.name})`}`);               
      52        return odpoved(502, { ok: false, chyba: 'databaze' });
      53      }
      54      return odpoved(200, { ok: true });

⏺ Write(api/event.js)
  ⎿  Added 13 lines, removed 57 lines
       1 -// POST /api/event – uloží anonymní událost z cesty návštěvníka
         - do Supabase (tabulka events).                                 
       2 -// Přijímá jen ID návštěvy (náhodné UUID z paměti stránky), náz
         -ev události, verzi úvodu a krátký detail.                      
       3 -// E-mail ani nic jiného navíc neprojde: detail nesmí obsahovat
         - „@“ a neznámá pole funkce odmítne.                            
       1 +// POST /api/event – uloží anonymní událost z cesty návštěvníka
         + (funkce uloz_udalost, tabulka events).                        
       2 +// Přijímá jen ID návštěvy (náhodné UUID z paměti stránky), náz
         +ev události, verzi úvodu a detail z pevného                    
       3 +// seznamu pro každou událost (_lib.js, DETAILY), takže se přes
         + měření nedají ukládat libovolná data.                         
       4 +// Proti zahlcení: tělo nejvýš 512 B, 600 událostí za hodinu z 
         +jedné IP a 100 na návštěvu (počítá databáze).                  
       5  // Prohlížeč posílá přes navigator.sendBeacon, tedy jako text/p
          lain.
       6 +import { VARIANTY, DETAILY, odpoved, nactiTelo, ciziPuvod, klic
         +Ip, chybiNastaveni, rpc } from './_lib.js';                    
       7  
       8  const MAX_BYTES = 512;
       7 -const VARIANTY = ['vychozi', 'dvojce', 'zacatek'];             
       8 -const UDALOSTI = [                                             
       9 -  'prichod', 'scroll', 'otoceni_listku', 'vyzva_zobrazena', 'ct
         -a', 'formular_otevren',                                        
      10 -  'formular_zacatek', 'odeslani_pokus', 'odeslani_chyba', 'odes
         -lano', 'tahak_otevren', 'sdileni',                             
      11 -];                                                             
       9  const POLE = ['navsteva', 'udalost', 'varianta', 'detail'];
      10  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a
          -f]{3}-[0-9a-f]{12}$/;
      14 -const DETAIL = /^[A-Za-z0-9_:.-]{1,40}$/;                      
      11  
      16 -const odpoved = (status, data) => (data                        
      17 -  ? Response.json(data, { status, headers: { 'Cache-Control': '
         -no-store' } })                                                 
      18 -  : new Response(null, { status, headers: { 'Cache-Control': 'n
         -o-store' } }));                                                
      19 -                                                               
      20 -async function nactiTelo(request, max) {                       
      21 -  if (Number(request.headers.get('content-length') || 0) > max)
         - return { chyba: 413 };                                        
      22 -  if (!request.body) return { text: '' };                      
      23 -  const reader = request.body.getReader();                     
      24 -  const casti = [];                                            
      25 -  let delka = 0;                                               
      26 -  for (;;) {                                                   
      27 -    const { done, value } = await reader.read();               
      28 -    if (done) break;                                           
      29 -    delka += value.byteLength;                                 
      30 -    if (delka > max) {                                         
      31 -      await reader.cancel();                                   
      32 -      return { chyba: 413 };                                   
      33 -    }                                                          
      34 -    casti.push(value);                                         
      35 -  }                                                            
      36 -  return { text: Buffer.concat(casti).toString('utf8') };      
      37 -}                                                              
      38 -                                                               
      39 -function ciziPuvod(request) {                                  
      40 -  const origin = request.headers.get('origin');                
      41 -  if (!origin) return false;                                   
      42 -  const host = request.headers.get('x-forwarded-host') || reque
         -st.headers.get('host');                                        
      43 -  try { return new URL(origin).host !== host; } catch { return 
         -true; }                                                        
      44 -}                                                              
      45 -                                                               
      12  export default {
      13    async fetch(request) {
      14      if (request.method !== 'POST') return new Response(null, { 
          status: 405, headers: { Allow: 'POST' } });
     ...
      23      if (!d || typeof d !== 'object' || Array.isArray(d)) return
           odpoved(400, { ok: false, chyba: 'format' });
      24      if (Object.keys(d).some((k) => !POLE.includes(k))) return o
          dpoved(400, { ok: false, chyba: 'pole' });
      25      if (typeof d.navsteva !== 'string' || !UUID.test(d.navsteva
          )) return odpoved(400, { ok: false, chyba: 'navsteva' });
      60 -    if (!UDALOSTI.includes(d.udalost)) return odpoved(400, { ok
         -: false, chyba: 'udalost' });                                  
      26 +    if (!Object.hasOwn(DETAILY, d.udalost)) return odpoved(400,
         + { ok: false, chyba: 'udalost' });                             
      27      if (!VARIANTY.includes(d.varianta)) return odpoved(400, { o
          k: false, chyba: 'varianta' });
      62 -    if (d.detail != null && (typeof d.detail !== 'string' || !D
         -ETAIL.test(d.detail))) return odpoved(400, { ok: false, chyba: 
         -'detail' });                                                   
      28 +    if (d.detail != null && (typeof d.detail !== 'string' || !D
         +ETAILY[d.udalost].test(d.detail))) return odpoved(400, { ok: fa
         +lse, chyba: 'detail' });                                       
      29 +    if (chybiNastaveni(['SUPABASE_URL', 'SUPABASE_SECRET_KEY', 
         +'ANTISPAM_SECRET'])) return odpoved(503, { ok: false, chyba: 'k
         +onfigurace' });                                                
      30  
      64 -    const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env; 
      65 -    if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {               
      66 -      console.error('[event] chybí proměnná prostředí SUPABASE_
         -URL nebo SUPABASE_SECRET_KEY');                                
      67 -      return odpoved(503, { ok: false, chyba: 'konfigurace' });
      68 -    }                                                          
      31      try {
      32        // čas doplní databáze (zaokrouhlený na hodiny), od prohl
          ížeče ho nebereme
      71 -      const r = await fetch(`${SUPABASE_URL}/rest/v1/events`, {
      72 -        method: 'POST',                                        
      73 -        headers: { apikey: SUPABASE_SECRET_KEY, 'Content-Type':
         - 'application/json', Prefer: 'return=minimal' },               
      74 -        body: JSON.stringify({ navsteva: d.navsteva, udalost: d
         -.udalost, varianta: d.varianta, detail: d.detail ?? null }),   
      75 -        signal: AbortSignal.timeout(5000),                     
      76 -      });                                                      
      77 -      if (!r.ok) {                                             
      78 -        console.error(`[event] Supabase vrátil ${r.status}`);  
      79 -        return odpoved(502, { ok: false, chyba: 'databaze' }); 
      80 -      }                                                        
      33 +      const vysledek = await rpc('uloz_udalost', {             
      34 +        p_klic: klicIp(request, 'event'), p_navsteva: d.navstev
         +a, p_udalost: d.udalost, p_varianta: d.varianta, p_detail: d.de
         +tail ?? null,                                                  
      35 +      }, 5000);                                                
      36 +      if (vysledek === 'limit') return odpoved(429, { ok: false
         +, chyba: 'limit' });                                           
      37      } catch (e) {
      82 -      console.error(`[event] Supabase nedostupný (${e.name})`);
      38 +      console.error(`[event] databáze: ${e.status ? `Supabase v
         +rátil ${e.status}` : `nedostupná (${e.name})`}`);              
      39        return odpoved(502, { ok: false, chyba: 'databaze' });
      40      }
      41      return odpoved(204);

⏺ Write(api/token.js)
  ⎿  Wrote 12 lines to api/token.js
       1 // GET /api/token – podepsaný čas vydání pro formulář. Stránka s
       2 // s kontaktem; /api/lead odmítne kontakt bez platného tokenu a
         potichu zahodí odeslaný dřív než 3 s po vydání
         návštěvníkovi.
       4 import { odpoved, vydejToken, chybiNastaveni } from './_lib.js';
       6 export default {
       7   fetch(request) {
         atus: 405, headers: { Allow: 'GET' } });
       9     if (chybiNastaveni(['ANTISPAM_SECRET'])) return odpoved(503,
      10     return odpoved(200, { token: vydejToken() });
     … +7 lines (ctrl+o to expand)

⏺ Write(api/keepalive.js)
  ⎿  Added 8 lines, removed 18 lines
       1  // GET /api/keepalive – jednou denně ji volá Vercel cron (verce
          l.json), aby se bezplatný Supabase projekt
       2 -// bez návštěv neuspal. Udělá jeden malý dotaz do databáze.    
       2 +// bez návštěv neuspal. Zavolá v databázi funkci uklid (smaže z
         +áznamy limitů starší než 2 dny),                               
       3 +// takže je to skutečný zápis do databáze, ne jen dotaz na API.
       4  // Vercel posílá hlavičku Authorization: Bearer <CRON_SECRET>; 
          bez ní funkce nic nedělá.
       5 +import { odpoved, chybiNastaveni, rpc } from './_lib.js';      
       6  
       5 -const odpoved = (status, data) => Response.json(data, { status,
         - headers: { 'Cache-Control': 'no-store' } });                  
       6 -                                                               
       7  export default {
       8    async fetch(request) {
       9      if (request.method !== 'GET') return new Response(null, { s
          tatus: 405, headers: { Allow: 'GET' } });
      10 -    const { CRON_SECRET, SUPABASE_URL, SUPABASE_SECRET_KEY } = 
         -process.env;                                                   
      10 +    const { CRON_SECRET } = process.env;                       
      11      if (!CRON_SECRET || request.headers.get('authorization') !=
          = `Bearer ${CRON_SECRET}`) return odpoved(401, { ok: false });
      12 -    if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {               
      13 -      console.error('[keepalive] chybí proměnná prostředí SUPAB
         -ASE_URL nebo SUPABASE_SECRET_KEY');                            
      14 -      return odpoved(503, { ok: false, chyba: 'konfigurace' });
      15 -    }                                                          
      12 +    if (chybiNastaveni(['SUPABASE_URL', 'SUPABASE_SECRET_KEY'])
         +) return odpoved(503, { ok: false, chyba: 'konfigurace' });    
      13      try {
      17 -      const r = await fetch(`${SUPABASE_URL}/rest/v1/events?sel
         -ect=id&limit=1`, {                                             
      18 -        headers: { apikey: SUPABASE_SECRET_KEY },              
      19 -        signal: AbortSignal.timeout(8000),                     
      20 -      });                                                      
      21 -      if (!r.ok) {                                             
      22 -        console.error(`[keepalive] Supabase vrátil ${r.status}`
         -);                                                             
      23 -        return odpoved(502, { ok: false, chyba: 'databaze' }); 
      24 -      }                                                        
      14 +      const smazano = await rpc('uklid', {});                  
      15 +      return odpoved(200, { ok: true, smazano });              
      16      } catch (e) {
      26 -      console.error(`[keepalive] Supabase nedostupný (${e.name}
         -)`);                                                           
      17 +      console.error(`[keepalive] databáze: ${e.status ? `Supaba
         +se vrátil ${e.status}` : `nedostupná (${e.name})`}`);          
      18        return odpoved(502, { ok: false, chyba: 'databaze' });
      19      }
      29 -    return odpoved(200, { ok: true });                         
      20    },
      21  };

⏺ Teď vytvořím schema.sql s UUID identifikátory, tabulkou limitů s hashovanou
  IP, funkcemi uloz_kontakt, uloz_udalost, uklid a odebráním výchozích práv pro
  anonymní roli.

⏺ Write(supabase/schema.sql)
  ⎿  Added 71 lines, removed 14 lines
       1 --- Tabulky pro ETF dvojčata. Spusť jednou v Supabase: SQL Edito
         -r → New query → vlož celý soubor → Run.                        
       2 --- Skript jde pustit znovu, nic nesmaže.                       
       1 +-- Tabulky a funkce pro ETF dvojčata. Spusť v Supabase: SQL Edi
         +tor → New query → vlož celý soubor → Run.                      
       2 +-- Skript jde pustit znovu, nic nesmaže. Testuje ho scripts/tes
         +t-db.mjs na skutečném Postgresu (PGlite).                      
       3  --
       4 --- Zapisuje jen serverless funkce v api/ secret klíčem (sb_secr
         -et_…, role service_role, ta RLS obchází).                      
       5 --- Prohlížeč se Supabase nemluví. Anonymní ani přihlášená role 
         -(publishable klíč) nesmí nic číst ani                          
       6 --- zapisovat: RLS je zapnuté, žádná politika neexistuje a práva
         - jsou odebraná.                                                
       4 +-- Zapisují jen serverless funkce v api/ secret klíčem (sb_secr
         +et_…, role service_role) a jen přes funkce                     
       5 +-- uloz_kontakt, uloz_udalost a uklid. Prohlížeč se Supabase ne
         +mluví. Anonymní ani přihlášená role                            
       6 +-- (publishable klíč) nesmí nic číst, zapisovat ani volat: RLS 
         +bez politik a odebraná práva.                                  
       7  
       8 +-- Nové tabulky a funkce v public nedostanou anon a authenticat
         +ed automaticky žádná práva                                     
       9 +-- (Supabase je jinak přiděluje výchozími právy).              
      10 +alter default privileges in schema public revoke all on tables 
         +from anon, authenticated;                                      
      11 +alter default privileges in schema public revoke all on sequenc
         +es from anon, authenticated;                                   
      12 +alter default privileges in schema public revoke execute on fun
         +ctions from public, anon, authenticated;                       
      13 +                                                               
      14  -- Kontakty: e-mail, souhlas, čas souhlasu a verze úvodu z ?v=.
           Nic víc: žádná IP, prohlížeč ani ID návštěvy.
      15 +-- Klíč je náhodné UUID, ne pořadové číslo: podle pořadí by šel
         + kontakt spárovat s událostí „odeslano“.                       
      16  create table if not exists public.leads (
      10 -  id          bigint      generated always as identity primary 
         -key,                                                           
      17 +  id          uuid        primary key default gen_random_uuid()
         +,                                                              
      18    email       text        not null unique
      12 -                          check (char_length(email) between 3 a
         -nd 254 and email = lower(email) and email like '%_@_%'),       
      19 +                          check (char_length(email) between 6 a
         +nd 254 and email = lower(email)                                
      20 +                                 and email ~ '^[a-z0-9._%+-]+@[
         +a-z0-9.-]+\.[a-z0-9-]{2,}$'),                                  
      21    souhlas     boolean     not null check (souhlas),
      22    souhlas_cas timestamptz not null default now(),
      23    varianta    text        not null default 'vychozi' check (var
          ianta in ('vychozi', 'dvojce', 'zacatek'))
      24  );
      25  
      26  -- Anonymní události z cesty návštěvníka. Bez e-mailu; ID návšt
          ěvy žije jen v paměti jednoho načtení stránky.
      19 --- Čas se ukládá jen na celé hodiny, aby nešlo událost „odeslan
         -o“ spárovat s řádkem v leads podle času.                       
      27 +-- Čas jen na celé hodiny a klíč náhodný, aby se nedaly řadit p
         +odle pořadí zápisu (viz README, Bezpečnost).                   
      28  create table if not exists public.events (
      21 -  id        bigint      generated always as identity primary ke
         -y,                                                             
      29 +  id        uuid        primary key default gen_random_uuid(), 
      30    navsteva  uuid        not null,
      31    udalost   text        not null check (udalost in (
      32                'prichod', 'scroll', 'otoceni_listku', 'vyzva_zob
          razena', 'cta', 'formular_otevren',
     ...
      35    detail    text        check (detail ~ '^[A-Za-z0-9_:.-]{1,40}
          $'),
      36    cas       timestamptz not null default date_trunc('hour', now
          ())
      37  );
      30 -                                                               
      38  create index if not exists events_udalost_varianta on public.ev
          ents (udalost, varianta);
      39  create index if not exists events_navsteva on public.events (na
          vsteva);
      40  
      34 --- Row Level Security bez jediné politiky: přes API (publishabl
         -e klíč) nejde nic přečíst ani zapsat.                          
      41 +-- Počítadla pro omezení pokusů. Klíč je HMAC z IP adresy, endp
         +ointu a hodiny s tajnou solí                                   
      42 +-- (počítá ho api/_lib.js), takže tu žádná IP adresa není a klí
         +če z různých hodin nejdou spojit.                              
      43 +create table if not exists public.limity (                     
      44 +  klic  text        not null check (klic ~ '^[0-9a-f]{32}$'),  
      45 +  okno  timestamptz not null,                                  
      46 +  pocet integer     not null,                                  
      47 +  primary key (klic, okno)                                     
      48 +);                                                             
      49 +                                                               
      50  alter table public.leads  enable row level security;
      51  alter table public.events enable row level security;
      37 -revoke all on table public.leads, public.events from anon, auth
         -enticated;                                                     
      38 -                                                               
      39 --- Serverless funkce (secret klíč = role service_role): zápis a
         - čtení pro keep-alive.                                         
      52 +alter table public.limity enable row level security;           
      53 +revoke all on table public.leads, public.events, public.limity 
         +from anon, authenticated;                                      
      54  grant select, insert on table public.leads, public.events to se
          rvice_role;
      55 +grant select, insert, update, delete on table public.limity to 
         +service_role;                                                  
      56 +                                                               
      57 +-- Započítá pokus v aktuální hodině a vrátí, jestli je ještě v 
         +limitu.                                                        
      58 +create or replace function public.zapocitej(p_klic text, p_max 
         +integer)                                                       
      59 +returns boolean language sql security invoker set search_path =
         + '' as $$                                                      
      60 +  insert into public.limity as l (klic, okno, pocet) values (p_
         +klic, date_trunc('hour', now()), 1)                            
      61 +  on conflict (klic, okno) do update set pocet = l.pocet + 1   
      62 +  returning l.pocet <= p_max;                                  
      63 +$$;                                                            
      64 +                                                               
      65 +-- Kontakt: nejvýš 10 pokusů za hodinu z jedné IP. Vrací 'novy'
         +, 'duplicita' (e-mail už je, nic se nemění)                    
      66 +-- nebo 'limit'.                                               
      67 +create or replace function public.uloz_kontakt(p_klic text, p_e
         +mail text, p_varianta text)                                    
      68 +returns text language plpgsql security invoker set search_path 
         += '' as $$                                                     
      69 +begin                                                          
      70 +  if not public.zapocitej(p_klic, 10) then return 'limit'; end 
         +if;                                                            
      71 +  insert into public.leads (email, souhlas, varianta) values (p
         +_email, true, p_varianta)                                      
      72 +  on conflict (email) do nothing;                              
      73 +  if found then return 'novy'; end if;                         
      74 +  return 'duplicita';                                          
      75 +end $$;                                                        
      76 +                                                               
      77 +-- Událost: nejvýš 600 za hodinu z jedné IP a 100 na jednu návš
         +těvu. Vrací 'ok' nebo 'limit'.                                 
      78 +create or replace function public.uloz_udalost(p_klic text, p_n
         +avsteva uuid, p_udalost text, p_varianta text, p_detail text)  
      79 +returns text language plpgsql security invoker set search_path 
         += '' as $$                                                     
      80 +begin                                                          
      81 +  if not public.zapocitej(p_klic, 600) then return 'limit'; end
         + if;                                                           
      82 +  if (select count(*) from public.events where navsteva = p_nav
         +steva) >= 100 then return 'limit'; end if;                     
      83 +  insert into public.events (navsteva, udalost, varianta, detai
         +l) values (p_navsteva, p_udalost, p_varianta, p_detail);       
      84 +  return 'ok';                                                 
      85 +end $$;                                                        
      86 +                                                               
      87 +-- Úklid počítadel starších než 2 dny. Volá ho denní cron (/api
         +/keepalive), takže je to zároveň aktivita v databázi.          
      88 +create or replace function public.uklid()                      
      89 +returns integer language sql security invoker set search_path =
         + '' as $$                                                      
      90 +  with smazane as (delete from public.limity where okno < now()
         + - interval '2 days' returning 1)                              
      91 +  select count(*)::integer from smazane;                       
      92 +$$;                                                            
      93 +                                                               
      94 +revoke all on function public.zapocitej(text, integer), public.
         +uloz_kontakt(text, text, text),                                
      95 +  public.uloz_udalost(text, uuid, text, text, text), public.ukl
         +id() from public, anon, authenticated;                         
      96 +grant execute on function public.zapocitej(text, integer), publ
         +ic.uloz_kontakt(text, text, text),                             
      97 +  public.uloz_udalost(text, uuid, text, text, text), public.ukl
         +id() to service_role;                                          

⏺ Bash(cd /Users/daniel/etfLanding && python3 - <<'EOF'
      p='supabase/funnel.sql'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated supabase/funnel.sql (+3 -1)
       6  --
       7  -- Sloupce:
       8  --   navstev            kolik návštěv krok udělalo (v libovolné
          m pořadí; formulář jde otevřít i bez otočení lístku)
       9 +--                      „otevření formuláře“ = rozbalení nebo p
         +anel (formular_otevren), nebo první klepnutí do                
      10 +--                      formuláře v sekci Tahák, který je vidět
         + pořád a neotvírá se (formular_zacatek)                        
      11  --   navstev_postupne   kolik návštěv udělalo tenhle krok i vše
          chny předchozí
      12  --   pct_z_prichodu     navstev / návštěvy s příchodem
      13  --   pct_z_predchoziho  navstev_postupne / navstev_postupne pře
          dchozího kroku
     ...
      22      navsteva,
      23      bool_or(udalost = 'prichod')          as prichod,
      24      bool_or(udalost = 'otoceni_listku')   as otoceni,
      23 -    bool_or(udalost = 'formular_otevren') as formular,         
      25 +    bool_or(udalost in ('formular_otevren', 'formular_zacatek')
         +) as formular,                                                 
      26      bool_or(udalost = 'odeslano')         as odeslani
      27    from public.events
      28    group by varianta, navsteva

⏺ Teď scripts/test-db.mjs: schema.sql a funnel.sql na skutečném Postgresu v
  PGlite. Výchozí práva Supabase pro anonymní roli nasimuluje, aby bylo vidět,
  že je schéma opravdu odebere.

⏺ Write(scripts/test-db.mjs)
  ⎿  Wrote 109 lines to scripts/test-db.mjs
       1 // Testy supabase/schema.sql a supabase/funnel.sql na skutečném
       2 // Nasimuluje role a výchozí práva Supabase (anon a authenticate
         d dostávají na public všechno) a ověří,
       3 // že schéma je odebere, že funkce dělají limity a duplicity a ž
       4 // Použití: node test-db.mjs
       5 import { readFileSync } from 'node:fs';
       7 import { dirname, join } from 'node:path';
       8 import { PGlite } from '@electric-sql/pglite';
       9
         ;
     … +186 lines (ctrl+o to expand)

  Ran 1 shell command (ctrl+o to expand)

⏺ Všech 45 kontrol databáze prošlo napoprvé – role, limity, duplicity i trychtýř
  fungují správně. Teď spouštím lokální server s podvrženou PGlite databází na
  reálném schema.sql, hlavičkami z vercel.json a /__dev/db omezeným jen na
  vlastní počítač.

⏺ Write(scripts/server.mjs)
  ⎿  Added 61 lines, removed 26 lines
       1 -// Lokální server: statické soubory z public/ a funkce z api/ (
         -stejně jako na Vercelu).                                       
       2 -// Bez proměnných SUPABASE_* běží s podvrženou databází v pamět
         -i: nic se nikam neposílá                                       
       3 -// a na /__dev/db je vidět, co by se uložilo (jen pro testy, na
         - Vercel se tenhle soubor nedostane).                           
       1 +// Lokální server: statické soubory z public/ a funkce z api/ (
         +stejně jako na Vercelu), včetně hlaviček z vercel.json.        
       2 +// Bez proměnných SUPABASE_* běží s podvrženou databází: PGlite
         + (Postgres ve WASM) se skutečným supabase/schema.sql,          
       3 +// funkce volají jeho funkce stejně jako na Supabase. Na /__dev
         +/db je vidět, co by se uložilo – jen z tohohle                 
       4 +// počítače (ne z telefonu v síti) a jen přes adresu localhost 
         +/ 127.0.0.1. Na Vercel se tenhle soubor nedostane.             
       5  // Se skutečnou databází: node --env-file=../.env.local server.
          mjs  (klíče se nikdy nevypisují)
       6  // Použití: node server.mjs   (HOST=0.0.0.0 pro telefon ve stej
          né Wi-Fi, PORT=8737)
       7  import { createServer } from 'node:http';
       8  import { readFile, stat } from 'node:fs/promises';
       8 -import { readdirSync } from 'node:fs';                         
       9 +import { readdirSync, readFileSync } from 'node:fs';           
      10 +import { randomBytes } from 'node:crypto';                     
      11  import { dirname, extname, join, normalize, sep } from 'node:pa
          th';
      12  import { fileURLToPath, pathToFileURL } from 'node:url';
      13  
     ...
      20    '.json': 'application/json', '.svg': 'image/svg+xml', '.png':
           'image/png', '.webp': 'image/webp',
      21    '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.txt': 't
          ext/plain; charset=utf-8',
      22  };
      21 -const FUNCTIONS = readdirSync(join(root, 'api')).filter((f) => 
         -f.endsWith('.js')).map((f) => f.slice(0, -3));                 
      23 +const FUNCTIONS = readdirSync(join(root, 'api')).filter((f) => 
         +f.endsWith('.js') && !f.startsWith('_')).map((f) => f.slice(0, 
         +-3));                                                          
      24  
      23 -// Podvržená databáze: zachytí volání funkcí na Supabase REST a
         - uloží řádky do paměti.                                        
      25 +// Hlavičky z vercel.json (zdroje typu "/(.*)" nebo přesná cest
         +a), ať se lokálně projeví i CSP.                               
      26 +const HEADERS = JSON.parse(readFileSync(join(root, 'vercel.json
         +'), 'utf8')).headers || [];                                    
      27 +const headerRules = HEADERS.map((h) => ({ re: new RegExp(`^${h.
         +source.replace(/\(\.\*\)/g, '(.*)')}$`), headers: h.headers }))
         +;                                                              
      28 +function vercelHeaders(path) {                                 
      29 +  const out = {};                                              
      30 +  for (const rule of headerRules) if (rule.re.test(path)) for (
         +const { key, value } of rule.headers) out[key] = value;        
      31 +  return out;                                                  
      32 +}                                                              
      33 +                                                               
      34 +// Podvržená databáze (PGlite) a DNS: e-mailové domény končící 
         +.invalid nemají MX, ostatní ano.                               
      35  const fake = !process.env.SUPABASE_URL;
      25 -const db = { leads: [], events: [], vypadek: false };          
      36 +let db = null;                                                 
      37 +let vypadek = false;                                           
      38 +if (!process.env.ANTISPAM_SECRET) process.env.ANTISPAM_SECRET =
         + randomBytes(32).toString('hex');                              
      39  if (fake) {
      40 +  const { PGlite } = await import('@electric-sql/pglite');     
      41 +  db = new PGlite();                                           
      42 +  await db.exec(`create role anon nologin; create role authenti
         +cated nologin; create role service_role nologin bypassrls;     
      43 +    grant usage on schema public to anon, authenticated, servic
         +e_role;`);                                                     
      44 +  await db.exec(readFileSync(join(root, 'supabase', 'schema.sql
         +'), 'utf8'));                                                  
      45 +  await db.exec(readFileSync(join(root, 'supabase', 'funnel.sql
         +'), 'utf8'));                                                  
      46    process.env.SUPABASE_URL = 'http://supabase.lokalne';
      47    process.env.SUPABASE_SECRET_KEY = 'lokalni-atrapa';
      48    process.env.CRON_SECRET ??= 'lokalni-cron';
      49 +  const lib = await import(pathToFileURL(join(root, 'api', '_li
         +b.js')).href);                                                 
      50 +  lib.zavislosti.resolveMx = async (domena) => {               
      51 +    if (domena.endsWith('.invalid')) throw Object.assign(new Er
         +ror('nenalezeno'), { code: 'ENOTFOUND' });                     
      52 +    return [{ exchange: 'mx.lokalne', priority: 10 }];         
      53 +  };                                                           
      54    const realFetch = globalThis.fetch;
      55    globalThis.fetch = async (url, opts = {}) => {
      56      const u = new URL(url);
      57      if (u.host !== 'supabase.lokalne') return realFetch(url, op
          ts);
      34 -    if (db.vypadek) throw new TypeError('fetch failed');       
      35 -    const table = u.pathname.replace('/rest/v1/', '');         
      36 -    if ((opts.method || 'GET') === 'POST') {                   
      37 -      const row = JSON.parse(opts.body);                       
      38 -      if (table === 'leads') {                                 
      39 -        if (!db.leads.some((l) => l.email === row.email)) db.le
         -ads.push({ ...row, souhlas_cas: new Date().toISOString() });   
      40 -      } else {                                                 
      41 -        const hodina = new Date();                             
      42 -        hodina.setMinutes(0, 0, 0);                            
      43 -        db.events.push({ ...row, cas: hodina.toISOString() }); 
      44 -      }                                                        
      45 -      return new Response(null, { status: 201 });              
      58 +    if (vypadek) throw new TypeError('fetch failed');          
      59 +    const m = u.pathname.match(/^\/rest\/v1\/rpc\/([a-z_]+)$/);
      60 +    if (!m || (opts.method || 'GET') !== 'POST') return new Res
         +ponse('{"message":"nepodporováno"}', { status: 404 });         
      61 +    const args = JSON.parse(opts.body || '{}');                
      62 +    const names = Object.keys(args);                           
      63 +    if (!names.every((n) => /^p_[a-z_]+$/.test(n))) return new 
         +Response('{"message":"argumenty"}', { status: 400 });          
      64 +    // jako PostgREST: volání funkce pod rolí service_role s po
         +jmenovanými argumenty                                          
      65 +    await db.exec('set role service_role');                    
      66 +    try {                                                      
      67 +      const r = await db.query(`select public.${m[1]}(${names.m
         +ap((n, i) => `${n} => $${i + 1}`).join(', ')}) as r`, names.map
         +((n) => args[n]));                                             
      68 +      return Response.json(r.rows[0].r);                       
      69 +    } catch (e) {                                              
      70 +      return Response.json({ message: e.message }, { status: 40
         +0 });                                                          
      71 +    } finally {                                                
      72 +      await db.exec('reset role');                             
      73      }
      47 -    return Response.json(db[table] ? db[table].slice(0, 1).map(
         -(_, i) => ({ id: i + 1 })) : []);                              
      74    };
      75  }
      76  
     ...
       88    }
       89    const headers = new Headers();
       90    for (const [k, v] of Object.entries(req.headers)) if (typeof
            v === 'string') headers.set(k, v);
       91 +  headers.set('x-forwarded-for', req.socket.remoteAddress || '
          +'); // jako Vercel: IP klienta, ne co klient pošle            
       92    const request = new Request(`http://${req.headers.host}${req
           .url}`, {
       93      method: req.method, headers, body: ['GET', 'HEAD'].include
           s(req.method) ? undefined : Buffer.concat(chunks),
       94    });
       95    const mod = await import(pathToFileURL(join(root, 'api', `${
           name}.js`)).href);
       96    const response = await mod.default.fetch(request);
       97    const body = Buffer.from(await response.arrayBuffer());
       71 -  res.writeHead(response.status, Object.fromEntries(response.h
          -eaders));                                                     
       98 +  res.writeHead(response.status, { ...vercelHeaders(new URL(re
          +quest.url).pathname), ...Object.fromEntries(response.headers) 
          +});                                                           
       99    res.end(body);
      100    log(req, response.status);
      101  }
      102  
      103 +// /__dev/db jen z tohohle počítače a jen přes localhost/127.0
          +.0.1 (ne z telefonu v síti, ne přes podvržený Host)           
      104 +function devAllowed(req) {                                    
      105 +  const local = ['127.0.0.1', '::1', '::ffff:127.0.0.1'].inclu
          +des(req.socket.remoteAddress);                                
      106 +  const host = (req.headers.host || '').replace(/:\d+$/, ''); 
      107 +  return local && ['127.0.0.1', 'localhost', '[::1]'].includes
          +(host);                                                       
      108 +}                                                             
      109  async function devDb(req, res, url) {
       77 -  if (url.searchParams.has('vypadek')) db.vypadek = url.search
          -Params.get('vypadek') === '1';                                
       78 -  if (url.searchParams.has('smazat')) { db.leads.length = 0; d
          -b.events.length = 0; }                                        
      110 +  if (!devAllowed(req)) { res.writeHead(403).end(); return log
          +(req, 403); }                                                 
      111 +  if (url.searchParams.has('vypadek')) vypadek = url.searchPar
          +ams.get('vypadek') === '1';                                   
      112 +  if (url.searchParams.has('smazat')) await db.exec('delete fr
          +om public.leads; delete from public.events; delete from public
          +.limity;');                                                   
      113 +  const [leads, events, limity] = await Promise.all(['leads', 
          +'events', 'limity'].map((t) => db.query(`select * from public.
          +${t}`)));                                                     
      114    res.writeHead(200, { 'Content-Type': 'application/json', 'Ca
           che-Control': 'no-store' });
       80 -  res.end(JSON.stringify(db));                                
      115 +  res.end(JSON.stringify({ leads: leads.rows, events: events.r
          +ows, limity: limity.rows, vypadek }));                        
      116  }
      117  
      118  async function serveStatic(req, res, url) {
     ...
      122    try {
      123      if ((await stat(path)).isDirectory()) path = join(path, 'i
           ndex.html');
      124      const data = await readFile(path);
       90 -    res.writeHead(200, { 'Content-Type': TYPES[extname(path)] 
          -|| 'application/octet-stream', 'Content-Length': data.length, 
          -'Cache-Control': 'no-cache' });                               
      125 +    res.writeHead(200, { ...vercelHeaders(url.pathname), 'Cont
          +ent-Type': TYPES[extname(path)] || 'application/octet-stream',
          + 'Content-Length': data.length, 'Cache-Control': 'no-cache' })
          +;                                                             
      126      res.end(req.method === 'HEAD' ? undefined : data);
      127      log(req, 200);
      128    } catch {
     ...
      145      if (!res.headersSent) res.writeHead(500).end();
      146    }
      147  }).listen(PORT, HOST, () => {
      113 -  console.log(`http://${HOST}:${PORT}/  (funkce: ${FUNCTIONS.j
          -oin(', ')}; databáze: ${fake ? 'podvržená v paměti' : 'Supabas
          -e z proměnných prostředí'})`);                                
      148 +  console.log(`http://${HOST}:${PORT}/  (funkce: ${FUNCTIONS.j
          +oin(', ')}; databáze: ${fake ? 'podvržená (PGlite se schema.sq
          +l)' : 'Supabase z proměnných prostředí'})`);                  
      149  });
  ⎿  You've hit your session limit · resets 2:20pm (Europe/Prague)
     /upgrade to increase your usage limit.

❯ pokracuj kde jsi skoncil
  ⎿  You've hit your session limit · resets 2:20pm (Europe/Prague)
     /upgrade to increase your usage limit.

❯ pokracuj kde jsi skoncil

⏺ Pokračuji bodem 3 – funkce v api/, schéma s limity, databázové testy a lokální
  server s PGlite jsou hotové. Nyní upravím stránku: token s minimální čekací
  dobou, nová chybová hlášení, serverové anti-bot pole, čistý formulář, kontrola
  ?v= a nezlomitelné mezery v textech z JS.

  Read 1 file, ran 4 shell commands (ctrl+o to expand)

⏺ Upravuji skript stránky, jedna náhrada nesedí na přesný text (asi jsou tam už
  nezlomitelné mezery). Podívám se na přesné znaky.

  Ran 1 shell command (ctrl+o to expand)

⏺ Texty úvodu už nezlomitelné mezery mají, jen jako přímé znaky místo &nbsp;. U
  nich je nález z code-review falešný poplach. Upravím náhrady a pustím je
  znovu.

  Ran 2 shell commands (ctrl+o to expand)
⏺ I hlášky už nezlomitelné mezery mají. Nález o typografii je tak falešný
  poplach až na text pro sdílení. Náhradu postavím z přesného textu v souboru.

⏺ Bash(python3 - <<'EOF'
      p='public/index.html'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated public/index.html (+57 -17)
      209    <p class="lead" id="uvod-text">Americká ti broker často nena
           bídne, evropská ano.</p>
      210    <p class="note" id="uvod-pozn" hidden></p>
      211    <script>
      212 -  (function(){var v=new URLSearchParams(location.search).get('
          -v');var t={                                                   
      212 +  (function(){var v=new URLSearchParams(location.search).get('
          +v');var T={                                                   
      213      dvojce:['Broker ti nenabídl VOO? <span class="fix">Není to
            chyba.</span>','Tady je jeho evropské dvojče a 6 dalších.',''
           ],
      214      zacatek:['Nevíš, kterým ETF <span class="fix">začít</span>
           ?','7 známých fondů z USA a co v nich je.','Nic ti nedoporučuj
           eme, jen ukazujeme, co existuje.']
      215 -  }[v];if(!t)return;document.getElementById('uvod-h1').innerHT
          -ML=t[0];document.getElementById('uvod-text').textContent=t[1];
          -var n=document.getElementById('uvod-pozn');if(t[2]){n.textCont
          -ent=t[2];n.hidden=false}})();                                 
      215 +  };var t=Object.prototype.hasOwnProperty.call(T,v)?T[v]:null;
          +if(!t)return;document.getElementById('uvod-h1').innerHTML=t[0]
          +;document.getElementById('uvod-text').textContent=t[1];var n=d
          +ocument.getElementById('uvod-pozn');if(t[2]){n.textContent=t[2
          +];n.hidden=false}})();                                        
      216    </script>
      217  
      218    <div id="vyber">
     ...
      421            <span>Souhlasím, že mi Clientelo Czech&nbsp;s.r.o. b
           ude posílat e-maily o&nbsp;investování do ETF. Odhlásit se můž
           u kdykoli. <a href="ochrana-osobnich-udaju.html">Jak nakládáme
            s&nbsp;osobními údaji</a></span>
      422          </label>
      423          <p class="small">Tahák otevřeš hned po odeslání, na e-
           mail čekat nemusíš.</p>
      424 -        <div class="hp" aria-hidden="true"><label>Toto pole ne
          -ch prázdné <input type="text" name="web" tabindex="-1" autocom
          -plete="off"></label></div>                                    
      424 +        <div class="hp" aria-hidden="true"><label>Toto pole ne
          +ch prázdné <input type="text" name="poznamka" tabindex="-1" au
          +tocomplete="off"></label></div>                               
      425        </form>
      426      </div>
      427    </div>
     ...
      504      if (window.fetch) fetch('/api/event', { method: 'POST', bo
           dy: body, keepalive: true, headers: { 'Content-Type': 'text/pl
           ain' } }).catch(function () {});
      505    }
      506  
      507 -  /* Odeslání kontaktu na /api/lead: jen e-mail, souhlas a ver
          -ze úvodu, záměrně bez ID návštěvy.                            
      508 -     Při chybě vrátí { chyba }: email / souhlas od serveru, ji
          -nak sit nebo server. */                                       
      509 -  function submitLead(lead) {                                 
      507 +  /* Token proti botům: podepsaný čas vydání ze /api/token, st
          +ránka si ho vezme hned po načtení.                            
      508 +     Server odmítne kontakt bez tokenu a potichu zahodí odesla
          +ný dřív než 3 s po vydání (to stihne jen bot).                
      509 +     Kdo je rychlejší, chvíli počká na „Odesílám…“, o kontakt 
          +nepřijde. */                                                  
      510 +  var MIN_FORM_MS = 3200;                                     
      511 +  var token = null;                                           
      512 +  var tokenAt = 0;                                            
      513 +  var tokenReq = null;                                        
      514 +  function getToken(fresh) {                                  
      515 +    if (fresh) tokenReq = null;                               
      516 +    if (!tokenReq) {                                          
      517 +      tokenReq = fetch('/api/token', { cache: 'no-store' }).th
          +en(function (r) {                                             
      518 +        if (!r.ok) throw new Error(r.status);                 
      519 +        return r.json();                                      
      520 +      }).then(function (d) {                                  
     … 97 more lines (ctrl+o to expand)

⏺ Stránka i skripty jsou v pořádku. Teď zkontroluji bezpečnostní hlavičky – CSP
  povoluje jen dva vložené skripty podle hashe, který udržuje scripts/csp.mjs, a
  jeho --check mód selže, pokud se hashe po změně stránky neshodují.

⏺ Write(scripts/csp.mjs)
  ⎿  Wrote 46 lines to scripts/csp.mjs
      1 // Content-Security-Policy pro HTML stránky ve vercel.json: vlože
        né skripty povolí jen podle hashe (SHA-256),
        ě skriptu v public/*.html spusť znovu.
      3 // Použití: node csp.mjs          (přepočítá hashe a zapíše verce
        l.json)
         na aktuální HTML; jinak skončí chybou)
      5 import { createHash } from 'node:crypto';
      6 import { readFileSync, readdirSync } from 'node:fs';
      8 import { dirname, join } from 'node:path';
      9 import { writeAtomic } from './lib/write.mjs';
     … +53 lines (ctrl+o to expand)

⏺ Write(vercel.json)
  ⎿  Added 4 lines, removed 1 line
       9      {
      10        "source": "/(.*)",
      11        "headers": [
      12 +        { "key": "Strict-Transport-Security", "value": "max-age
         +=63072000; includeSubDomains" },                               
      13          { "key": "X-Content-Type-Options", "value": "nosniff" }
          ,
      14          { "key": "Referrer-Policy", "value": "strict-origin-whe
          n-cross-origin" },
      14 -        { "key": "X-Frame-Options", "value": "DENY" }          
      15 +        { "key": "X-Frame-Options", "value": "DENY" },         
      16 +        { "key": "Permissions-Policy", "value": "camera=(), mic
         +rophone=(), geolocation=(), payment=(), usb=()" },             
      17 +        { "key": "Cross-Origin-Opener-Policy", "value": "same-o
         +rigin" }                                                       
      18        ]
      19      }
      20    ]

⏺ Bash(cd /Users/daniel/etfLanding/scripts && node csp.mjs && node csp.mjs
      --check && python3 -c "
      import json; d=json.load(open('../vercel.json')); print([h['source']…)
  ⎿  Updated vercel.json (+58 -8)
       1  {
       2    "$schema": "https://openapi.vercel.sh/vercel.json",
       3    "outputDirectory": "public",
       4 -  "regions": ["fra1"],                                         
       4 +  "regions": [                                                 
       5 +    "fra1"                                                     
       6 +  ],                                                           
       7    "crons": [
       6 -    { "path": "/api/keepalive", "schedule": "0 6 * * *" }      
       8 +    {                                                          
       9 +      "path": "/api/keepalive",                                
      10 +      "schedule": "0 6 * * *"                                  
      11 +    }                                                          
      12    ],
      13    "headers": [
      14      {
      15        "source": "/(.*)",
      16        "headers": [
      12 -        { "key": "Strict-Transport-Security", "value": "max-age
         -=63072000; includeSubDomains" },                               
      13 -        { "key": "X-Content-Type-Options", "value": "nosniff" }
         -,                                                              
      14 -        { "key": "Referrer-Policy", "value": "strict-origin-whe
         -n-cross-origin" },                                             
      15 -        { "key": "X-Frame-Options", "value": "DENY" },         
      16 -        { "key": "Permissions-Policy", "value": "camera=(), mic
         -rophone=(), geolocation=(), payment=(), usb=()" },             
      17 -        { "key": "Cross-Origin-Opener-Policy", "value": "same-o
         -rigin" }                                                       
      17 +        {                                                      
      18 +          "key": "Strict-Transport-Security",                  
      19 +          "value": "max-age=63072000; includeSubDomains"       
      20 +        },                                                     
      21 +        {                                                      
      22 +          "key": "X-Content-Type-Options",                     
      23 +          "value": "nosniff"                                   
      24 +        },                                                     
      25 +        {                                                      
      26 +          "key": "Referrer-Policy",                            
      27 +          "value": "strict-origin-when-cross-origin"           
      28 +        },                                                     
      29 +        {                                                      
      30 +          "key": "X-Frame-Options",                            
      31 +          "value": "DENY"                                      
      32 +        },                                                     
     … 38 more lines (ctrl+o to expand)

⏺ CSP je ve vercel.json a kontrola sedí. Doplním ANTISPAM_SECRET do .env.example
  a restartuji lokální server, který teď běží s PGlite.

⏺ Bash(cd /Users/daniel/etfLanding && cat >> .env.example <<'EOF'…)
  ⎿  Updated .env.example (+4 -0)
      11  
      12  # Náhodný řetězec (aspoň 16 znaků) pro Vercel cron. Vercel ho p
          osílá jako Authorization: Bearer … na /api/keepalive.
      13  CRON_SECRET=
      14 +                                                               
      15 +# Tajná sůl proti spamu (aspoň 32 náhodných znaků): podepisuje 
         +token formuláře a hashuje IP adresy                            
      16 +# pro omezení počtu pokusů (IP se nikam neukládá). Vytvoř třeba
         +: openssl rand -hex 32                                         
      17 +ANTISPAM_SECRET=                                               

  Ran 1 shell command (ctrl+o to expand)

⏺ Background command "Start local dev server with fake database" failed with
exit code 143

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Celý řetězec ochran jsem ověřil na lokálním serveru se skutečným SQL a všechny
  scénáře (chybějící token, předčasné odeslání, zpoždění, neplatné domény,
  duplicity, cizí detail) fungují správně. Teď přepíšu testy funkcí s podvrženou
  databází na nový stav.

⏺ Write(scripts/test-api.mjs)
  ⎿  Error writing file

  Ran 1 shell command (ctrl+o to expand)

⏺ Zápis selhal, protože jsem soubor před přepsáním znovu nenačetl. Načtu ho a
  zapíšu novou verzi.

  Read 1 file (ctrl+o to expand)

⏺ Write(scripts/test-api.mjs)
  ⎿  Added 181 lines, removed 71 lines
        1 -// Testy serverless funkcí v api/ s podvrženou databází: bez s
          -kutečných klíčů a bez sítě.                                   
        2 -// globalThis.fetch nahradí atrapa Supabase, která si zapisuje
          -, co by funkce poslala.                                       
        1 +// Testy serverless funkcí v api/ s podvrženou databází a DNS:
          + bez skutečných klíčů a bez sítě.                             
        2 +// globalThis.fetch nahradí atrapa Supabase, která si zapisuje
          + volání a vrací nastavenou odpověď.                           
        3 +// SQL (limity, duplicity, práva) testuje zvlášť test-db.mjs n
          +a skutečném Postgresu.                                        
        4  // Použití: node test-api.mjs
        5  import { readFileSync, readdirSync } from 'node:fs';
        6  import { fileURLToPath } from 'node:url';
        7  import { dirname, join } from 'node:path';
        8 +import { execFileSync } from 'node:child_process';            
        9  
       10  const root = join(dirname(fileURLToPath(import.meta.url)), '..
           ');
       11  let fails = 0;
       12  const check = (name, cond, extra = '') => { if (!cond) fails++
           ; console.log(`${cond ? 'OK   ' : 'CHYBA'} ${name}${extra ? ' 
           – ' + extra : ''}`); };
       13  
       12 -// Atrapa Supabase: zaznamená volání a vrátí nastavenou odpově
          -ď (nebo vyhodí chybu jako nedostupná síť).                    
       14  const KEY = 'testovaci-klic-neni-skutecny';
       15 +const SECRET = 'testovaci-sul-0123456789abcdef0123456789abcdef
          +';                                                            
       16 +const OK_ENV = { SUPABASE_URL: 'https://projekt.supabase.co', 
          +SUPABASE_SECRET_KEY: KEY, CRON_SECRET: 'tajny-cron-1234567890'
          +, ANTISPAM_SECRET: SECRET };                                  
       17 +const env = (vals) => { for (const k of Object.keys(OK_ENV)) d
          +elete process.env[k]; Object.assign(process.env, vals); };    
       18 +env(OK_ENV);                                                  
       19 +                                                              
       20 +// Atrapa Supabase: zaznamená volání a vrátí nastavenou odpově
          +ď (nebo vyhodí chybu jako nedostupná síť).                    
       21  const calls = [];
       15 -let reply = () => new Response(null, { status: 201 });        
       22 +let reply = () => Response.json('novy');                      
       23  globalThis.fetch = async (url, opts = {}) => {
       24    calls.push({ url: String(url), method: opts.method || 'GET',
            headers: opts.headers || {}, body: opts.body ? JSON.parse(opt
           s.body) : null });
       25    return reply();
       26  };
       20 -const env = (vals) => { for (const k of ['SUPABASE_URL', 'SUPA
          -BASE_SECRET_KEY', 'CRON_SECRET']) delete process.env[k]; Objec
          -t.assign(process.env, vals); };                               
       21 -const OK_ENV = { SUPABASE_URL: 'https://projekt.supabase.co', 
          -SUPABASE_SECRET_KEY: KEY, CRON_SECRET: 'tajny-cron-1234567890'
          - };                                                           
       22 -                                                              
       23 -// Zachytí console.error, aby šlo ověřit, že log neobsahuje e-
          -mail ani klíč.                                                
       27 +// Zachytí logy, aby šlo ověřit, že v nich není e-mail, klíč a
          +ni IP.                                                        
       28  const logs = [];
       25 -const origError = console.error;                              
       29 +const orig = { error: console.error, warn: console.warn };    
       30  console.error = (...a) => logs.push(a.join(' '));
       31 +console.warn = (...a) => logs.push(a.join(' '));              
       32  
       33 +const lib = await import('../api/_lib.js');                   
       34  const { default: lead } = await import('../api/lead.js');
       35  const { default: event } = await import('../api/event.js');
       36 +const { default: token } = await import('../api/token.js');   
       37  const { default: keepalive } = await import('../api/keepalive.
           js');
       38  
       39 +// Podvržené DNS: podle domény vrátí MX, žádný záznam, null MX
          + nebo výpadek.                                                
       40 +let dnsCalls = 0;                                             
       41 +lib.zavislosti.resolveMx = async (d) => {                     
       42 +  dnsCalls++;                                                 
       43 +  if (d === 'neexistuje.cz') throw Object.assign(new Error('x'
          +), { code: 'ENOTFOUND' });                                    
       44 +  if (d === 'bez-mx.cz') throw Object.assign(new Error('x'), {
          + code: 'ENODATA' });                                          
       45 +  if (d === 'null-mx.cz') return [{ exchange: '', priority: 0 
          +}];                                                           
       46 +  if (d === 'vypadek-dns.cz') throw Object.assign(new Error('x
          +'), { code: 'ESERVFAIL' });                                   
       47 +  if (d === 'pomale-dns.cz') return new Promise(() => {});    
       48 +  return [{ exchange: 'mx1.' + d, priority: 10 }];            
       49 +};                                                            
       50 +                                                              
       51  const HOST = 'etf-dvojcata.example';
       52 +const IP = '203.0.113.7';                                     
       53  function req(path, { method = 'POST', body, type = 'applicatio
           n/json', headers = {} } = {}) {
       34 -  const h = { host: HOST, ...headers };                       
       54 +  const h = { host: HOST, 'x-forwarded-for': IP, ...headers };
       55    if (type) h['content-type'] = type;
       56    return new Request(`https://${HOST}${path}`, { method, heade
           rs: h, body: body === undefined ? undefined : (typeof body ===
            'string' ? body : JSON.stringify(body)) });
       57  }
       58  async function run(handler, r) {
       59    calls.length = 0;
       60 +  dnsCalls = 0;                                               
       61    const res = await handler.fetch(r);
       62    const text = await res.text();
       63    let json = null;
       43 -  try { json = JSON.parse(text); } catch {}                   
       44 -  return { status: res.status, json, text, calls: [...calls] }
          -;                                                             
       64 +  try { json = JSON.parse(text); } catch { /* bez těla */ }   
       65 +  return { status: res.status, json, text, calls: [...calls], 
          +headers: res.headers };                                       
       66  }
       46 -// Tělo, které přijde po kouscích a neuvede délku (klient lže 
          -nebo posílá stream).                                          
       67  function streamBody(bytes) {
       68    const chunk = new TextEncoder().encode('x'.repeat(256));
       69    let sent = 0;
       70    return new ReadableStream({ pull(c) { if (sent >= bytes) ret
           urn c.close(); c.enqueue(chunk); sent += chunk.length; } });
       71  }
       72 +const oldToken = () => lib.vydejToken(Date.now() - 5000); // v
          +ydaný před 5 s: projde                                        
       73 +const lead1 = (extra = {}) => ({ email: 'jana.nova@example.cz'
          +, souhlas: true, varianta: 'dvojce', token: oldToken(), ...ext
          +ra });                                                        
       74  
       53 -// ---------- /api/lead ----------                            
       54 -env(OK_ENV);                                                  
       55 -reply = () => new Response(null, { status: 201 });            
       56 -let r = await run(lead, req('/api/lead', { body: { email: '  J
          -ana.Nova@Example.COM ', souhlas: true, varianta: 'dvojce' } })
          -);                                                            
       75 +// ---------- /api/lead: úspěch, duplicita, limit ----------  
       76 +let r = await run(lead, req('/api/lead', { body: lead1({ email
          +: '  Jana.Nova@Example.CZ ' }) }));                           
       77  const c = r.calls[0] || {};
       58 -check('lead: platný kontakt → 200 a jeden zápis', r.status ===
          - 200 && r.json.ok === true && r.calls.length === 1, `${r.statu
          -s} ${r.calls.length}`);                                       
       59 -check('lead: zápis do leads s on_conflict=email', c.url === 'h
          -ttps://projekt.supabase.co/rest/v1/leads?on_conflict=email' &&
          - c.method === 'POST', c.url);                                 
       60 -check('lead: e-mail oříznutý a malými písmeny, jen povolené sl
          -oupce', JSON.stringify(c.body) === JSON.stringify({ email: 'ja
          -na.nova@example.com', souhlas: true, varianta: 'dvojce' }), JS
          -ON.stringify(c.body));                                        
       78 +check('lead: platný kontakt → 200 a jedno volání uloz_kontakt'
          +, r.status === 200 && r.json.ok === true && r.calls.length ===
          + 1 && c.url === 'https://projekt.supabase.co/rest/v1/rpc/uloz_
          +kontakt', `${r.status} ${c.url}`);                            
       79 +check('lead: e-mail oříznutý a malými písmeny, jen povolené ar
          +gumenty', c.body && c.body.p_email === 'jana.nova@example.cz' 
          +&& c.body.p_varianta === 'dvojce' && Object.keys(c.body).sort(
          +).join() === 'p_email,p_klic,p_varianta', JSON.stringify(c.bod
          +y));                                                          
       80 +check('lead: do databáze jde hash IP (32 hex znaků), ne IP', /
          +^[0-9a-f]{32}$/.test(c.body.p_klic) && !JSON.stringify(c.body)
          +.includes(IP));                                               
       81  check('lead: klíč jen v hlavičce apikey, ne v Authorization', 
           c.headers.apikey === KEY && !('Authorization' in c.headers) &&
            !('authorization' in c.headers));
       62 -check('lead: opakovaný e-mail se ignoruje (ignore-duplicates)'
          -, /resolution=ignore-duplicates/.test(c.headers.Prefer || ''))
          -;                                                             
       82  check('lead: odpověď neobsahuje klíč', !r.text.includes(KEY));
       83 +reply = () => Response.json('duplicita');                     
       84 +r = await run(lead, req('/api/lead', { body: lead1() }));     
       85 +check('lead: e-mail už v databázi (duplicita) → stejná odpověď
          + jako nový, tahák se ukáže', r.status === 200 && r.json.ok ===
          + true);                                                       
       86 +reply = () => Response.json('limit');                         
       87 +r = await run(lead, req('/api/lead', { body: lead1() }));     
       88 +check('lead: překročený limit pokusů z jedné IP → 429', r.stat
          +us === 429 && r.json.chyba === 'limit');                      
       89 +reply = () => Response.json('novy');                          
       90 +r = await run(lead, req('/api/lead', { body: lead1({ varianta:
          + 'neco-jineho' }) }));                                        
       91 +check('lead: neznámá verze úvodu se uloží jako vychozi', r.cal
          +ls[0] && r.calls[0].body.p_varianta === 'vychozi');           
       92  
       65 -r = await run(lead, req('/api/lead', { body: { email: 'eva@exa
          -mple.com', souhlas: true, varianta: 'neco-jineho' } }));      
       66 -check('lead: neznámá verze úvodu se uloží jako vychozi', r.cal
          -ls[0] && r.calls[0].body.varianta === 'vychozi');             
       93 +// ---------- token: rychlost odeslání ----------             
       94 +r = await run(lead, req('/api/lead', { body: lead1({ token: un
          +defined }) }));                                               
       95 +check('lead: bez tokenu → 400 token, nic se neuloží', r.status
          + === 400 && r.json.chyba === 'token' && r.calls.length === 0);
       96 +const [ts] = oldToken().split('.');                           
       97 +r = await run(lead, req('/api/lead', { body: lead1({ token: `$
          +{ts}.${Buffer.from('podvrh-podvrh-podvrh-podvrh-podvr').toStri
          +ng('base64url')}` }) }));                                     
       98 +check('lead: podvržený podpis tokenu → 400', r.status === 400 
          +&& r.json.chyba === 'token' && r.calls.length === 0);         
       99 +r = await run(lead, req('/api/lead', { body: lead1({ token: li
          +b.vydejToken(Date.now() - 25 * 3600 * 1000) }) }));           
      100 +check('lead: token starší než 24 h → 400 (stránka si vezme nov
          +ý)', r.status === 400 && r.json.chyba === 'token');           
      101 +r = await run(lead, req('/api/lead', { body: lead1({ token: li
          +b.vydejToken() }) }));                                        
      102 +check('lead: odesláno hned po vydání tokenu (bot) → tváří se ú
          +spěšně, nic se neuloží', r.status === 200 && r.json.ok === tru
          +e && r.calls.length === 0);                                   
      103 +r = await run(lead, req('/api/lead', { body: lead1({ token: li
          +b.vydejToken(Date.now() + 60000) }) }));                      
      104 +check('lead: token z budoucnosti → 400', r.status === 400);   
      105 +const tokenSigned = lib.vydejToken(Date.now() - 5000);        
      106 +process.env.ANTISPAM_SECRET = 'jina-sul-0123456789abcdef012345
          +6789abcdef';                                                  
      107 +r = await run(lead, req('/api/lead', { body: lead1({ token: to
          +kenSigned }) }));                                             
      108 +check('lead: token podepsaný jiným klíčem → 400', r.status ===
          + 400 && r.json.chyba === 'token');                            
      109 +env(OK_ENV);                                                  
      110  
      111 +// ---------- skryté pole, formát e-mailu, souhlas ---------- 
      112 +r = await run(lead, req('/api/lead', { body: lead1({ poznamka:
          + 'https://spam.example' }) }));                               
      113 +check('lead: vyplněné skryté pole (bot) → 200, ale nic se neul
          +oží', r.status === 200 && r.json.ok === true && r.calls.length
          + === 0);                                                      
      114 +for (const [name, email] of [                                 
      115 +  ['prázdný', ''], ['bez domény', 'jana@seznam'], ['delší než 
          +254 znaků', 'a'.repeat(60) + '@' + 'b'.repeat(190) + '.cz'],  
      116 +  ['dvě tečky', 'jana..nova@example.cz'], ['tečka před zavináč
          +em', 'jana.@example.cz'], ['diakritika', 'jána@example.cz'],  
      117 +  ['znaky < >', 'ja<na>@example.cz'], ['uvozovky', '"jana"@exa
          +mple.cz'], ['= na začátku (vzorec v tabulce)', '=cmd@example.c
          +z'],                                                          
      118 +  ['+ na začátku', '+jana@example.cz'], ['číselná koncovka', '
          +jana@example.123'], ['pole místo textu', ['a@b.cz']],         
      119 +]) {                                                          
      120 +  r = await run(lead, req('/api/lead', { body: lead1({ email }
          +) }));                                                        
      121 +  check(`lead: e-mail (${name}) → 422, nic se neuloží`, r.stat
          +us === 422 && r.json.chyba === 'email' && r.calls.length === 0
          +, `${r.status} ${r.json && r.json.chyba}`);                   
      122 +}                                                             
      123 +for (const [name, souhlas] of [['bez souhlasu', undefined], ['
          +souhlas false', false], ['souhlas jako text „ano“', 'ano']]) {
      124 +  r = await run(lead, req('/api/lead', { body: lead1({ souhlas
          + }) }));                                                      
      125 +  check(`lead: ${name} → 422`, r.status === 422 && r.json.chyb
          +a === 'souhlas' && r.calls.length === 0);                     
      126 +}                                                             
      127 +                                                              
      128 +// ---------- jednorázové domény a MX ----------              
      129 +for (const email of ['x@mailinator.com', 'x@10minutemail.com',
          + 'x@sub.mailinator.com']) {                                   
      130 +  r = await run(lead, req('/api/lead', { body: lead1({ email }
          +) }));                                                        
      131 +  check(`lead: jednorázová doména (${email.split('@')[1]}) → 4
          +22, bez dotazu do DNS`, r.status === 422 && r.json.chyba === '
          +jednorazovy' && r.calls.length === 0 && dnsCalls === 0);      
      132 +}                                                             
      133 +for (const email of ['x@seznam.cz', 'x@email.cz', 'x@centrum.c
          +z', 'x@gmail.com']) check(`běžná doména ${email.split('@')[1]}
          + není na seznamu jednorázových`, !lib.jednorazovaDomena(email.
          +split('@')[1]));                                              
      134 +for (const [name, domena] of [['doména neexistuje', 'neexistuj
          +e.cz'], ['doména bez MX', 'bez-mx.cz'], ['„null MX“ (poštu nep
          +řijímá)', 'null-mx.cz']]) {                                   
      135 +  r = await run(lead, req('/api/lead', { body: lead1({ email: 
          +`x@${domena}` }) }));                                         
      136 +  check(`lead: ${name} → 422 mx, nic se neuloží`, r.status ===
          + 422 && r.json.chyba === 'mx' && r.calls.length === 0 && dnsCa
          +lls === 1);                                                   
      137 +}                                                             
      138 +r = await run(lead, req('/api/lead', { body: lead1({ email: 'x
          +@vypadek-dns.cz' }) }));                                      
      139 +check('lead: výpadek DNS → kontakt se uloží (skutečného člověk
          +a kvůli DNS neodmítneme)', r.status === 200 && r.calls.length 
          +=== 1);                                                       
      140 +const t0 = Date.now();                                        
      141 +r = await run(lead, req('/api/lead', { body: lead1({ email: 'x
          +@pomale-dns.cz' }) }));                                       
      142 +check('lead: DNS bez odpovědi → po 2,5 s se pokračuje a kontak
          +t se uloží', r.status === 200 && r.calls.length === 1 && Date.
          +now() - t0 < 4000, `${Date.now() - t0} ms`);                  
      143 +                                                              
      144 +// ---------- pole navíc, velikost, typ, metoda, původ -------
          +---                                                           
      145  for (const [name, body, status, chyba] of [
       69 -  ['prázdný e-mail', { email: '', souhlas: true }, 422, 'email
          -'],                                                           
       70 -  ['neplatný e-mail', { email: 'jana@example', souhlas: true }
          -, 422, 'email'],                                              
       71 -  ['e-mail delší než 254 znaků', { email: 'a'.repeat(250) + '@
          -example.com', souhlas: true }, 422, 'email'],                 
       72 -  ['e-mail jiného typu než text', { email: ['a@b.cz'], souhlas
          -: true }, 422, 'email'],                                      
       73 -  ['bez souhlasu', { email: 'eva@example.com' }, 422, 'souhlas
          -'],                                                           
       74 -  ['souhlas false', { email: 'eva@example.com', souhlas: false
          - }, 422, 'souhlas'],                                          
       75 -  ['souhlas jako text „ano“', { email: 'eva@example.com', souh
          -las: 'ano' }, 422, 'souhlas'],                                
       76 -  ['ID návštěvy u e-mailu', { email: 'eva@example.com', souhla
          -s: true, navsteva: '6cea79d5-7dbd-47ef-a402-37cd1ae34015' }, 4
          -00, 'pole'],                                                  
       77 -  ['pole navíc', { email: 'eva@example.com', souhlas: true, te
          -lefon: '777' }, 400, 'pole'],                                 
      146 +  ['ID návštěvy u e-mailu', lead1({ navsteva: '6cea79d5-7dbd-4
          +7ef-a402-37cd1ae34015' }), 400, 'pole'],                      
      147 +  ['pole navíc', lead1({ telefon: '777' }), 400, 'pole'],     
      148    ['pole místo objektu', [1, 2], 400, 'format'],
      149  ]) {
      150    r = await run(lead, req('/api/lead', { body }));
     ...
      152  }
      153  r = await run(lead, req('/api/lead', { body: '{"email": "eva@e
           xa' }));
      154  check('lead: rozbitý JSON → 400', r.status === 400 && r.calls.
           length === 0);
       85 -r = await run(lead, req('/api/lead', { body: { email: 'bot@exa
          -mple.com', souhlas: true, web: 'https://spam.example' } }));  
       86 -check('lead: vyplněné skryté pole (bot) → 200, ale nic se neul
          -oží', r.status === 200 && r.json.ok === true && r.calls.length
          - === 0);                                                      
       87 -r = await run(lead, req('/api/lead', { body: { email: 'eva@exa
          -mple.com', souhlas: true }, type: 'text/plain' }));           
      155 +r = await run(lead, req('/api/lead', { body: lead1(), type: 't
          +ext/plain' }));                                               
      156  check('lead: jiný typ obsahu než JSON → 415', r.status === 415
            && r.calls.length === 0);
       89 -r = await run(lead, req('/api/lead', { body: { email: 'eva@exa
          -mple.com', souhlas: true, varianta: 'x'.repeat(2000) } }));   
       90 -check('lead: tělo nad 1 kB → 413', r.status === 413 && r.calls
          -.length === 0, String(r.status));                             
      157 +r = await run(lead, req('/api/lead', { body: lead1({ varianta:
          + 'x'.repeat(2000) }) }));                                     
      158 +check('lead: tělo nad 1 kB → 413', r.status === 413 && r.calls
          +.length === 0);                                               
      159  r = await run(lead, new Request(`https://${HOST}/api/lead`, { 
           method: 'POST', headers: { host: HOST, 'content-type': 'applic
           ation/json' }, body: streamBody(5000), duplex: 'half' }));
       92 -check('lead: velké tělo bez uvedené délky (stream) → 413', r.s
          -tatus === 413 && r.calls.length === 0, String(r.status));     
      160 +check('lead: velké tělo bez uvedené délky (stream) → 413', r.s
          +tatus === 413 && r.calls.length === 0);                       
      161  r = await run(lead, req('/api/lead', { method: 'GET', type: nu
           ll }));
      162  check('lead: GET → 405', r.status === 405);
       95 -r = await run(lead, req('/api/lead', { body: { email: 'eva@exa
          -mple.com', souhlas: true }, headers: { origin: 'https://cizi-s
          -tranka.example' } }));                                        
      163 +r = await run(lead, req('/api/lead', { method: 'OPTIONS', type
          +: null, headers: { origin: 'https://cizi-stranka.example' } })
          +);                                                            
      164 +check('lead: CORS preflight z cizí stránky neprojde (žádné Acc
          +ess-Control-Allow-Origin)', r.status === 405 && !r.headers.get
          +('access-control-allow-origin'));                             
      165 +r = await run(lead, req('/api/lead', { body: lead1(), headers:
          + { origin: 'https://cizi-stranka.example' } }));              
      166  check('lead: požadavek z cizí stránky (Origin) → 403', r.statu
           s === 403 && r.calls.length === 0);
       97 -r = await run(lead, req('/api/lead', { body: { email: 'eva@exa
          -mple.com', souhlas: true }, headers: { origin: `https://${HOST
          -}` } }));                                                     
      167 +r = await run(lead, req('/api/lead', { body: lead1(), headers:
          + { origin: `https://${HOST}` } }));                           
      168  check('lead: požadavek ze stejné stránky (Origin) projde', r.s
           tatus === 200);
      169  
      170 +// ---------- hash IP ----------                              
      171 +const klic = async (ip) => { const x = await run(lead, req('/a
          +pi/lead', { body: lead1(), headers: { 'x-forwarded-for': ip } 
          +})); return x.calls[0] && x.calls[0].body.p_klic; };          
      172 +const k1 = await klic('198.51.100.1');                        
      173 +check('hash IP: stejná IP ve stejné hodině → stejný klíč, jiná
          + IP → jiný', k1 === await klic('198.51.100.1') && k1 !== await
          + klic('198.51.100.2'));                                       
      174 +check('hash IP: klíč pro kontakty a pro události se liší', k1 
          +!== lib.klicIp(req('/api/event', { headers: { 'x-forwarded-for
          +': '198.51.100.1' } }), 'event'));                            
      175 +check('hash IP: v jiné hodině jiný klíč (nejde spojit napříč h
          +odinami)', lib.klicIp(req('/'), 'lead', new Date('2026-10-11T1
          +0:00:00Z')) !== lib.klicIp(req('/'), 'lead', new Date('2026-10
          +-11T11:00:00Z')));                                            
      176 +                                                              
      177 +// ---------- databáze a nastavení ----------                 
      178  reply = () => new Response('{"message":"internal"}', { status:
            500 });
      101 -r = await run(lead, req('/api/lead', { body: { email: 'eva@exa
          -mple.com', souhlas: true } }));                               
      179 +r = await run(lead, req('/api/lead', { body: lead1() }));     
      180  check('lead: chyba databáze → 502', r.status === 502 && r.json
           .chyba === 'databaze');
      181  reply = () => { throw new TypeError('fetch failed'); };
      104 -r = await run(lead, req('/api/lead', { body: { email: 'eva@exa
          -mple.com', souhlas: true } }));                               
      182 +r = await run(lead, req('/api/lead', { body: lead1() }));     
      183  check('lead: nedostupná databáze → 502', r.status === 502 && r
           .json.chyba === 'databaze');
      106 -env({});                                                      
      107 -r = await run(lead, req('/api/lead', { body: { email: 'eva@exa
          -mple.com', souhlas: true } }));                               
      108 -check('lead: bez proměnných prostředí → 503, nic se neposílá',
          - r.status === 503 && r.calls.length === 0);                   
      184 +reply = () => Response.json('novy');                          
      185 +for (const missing of ['SUPABASE_URL', 'SUPABASE_SECRET_KEY', 
          +'ANTISPAM_SECRET']) {                                         
      186 +  env(Object.fromEntries(Object.entries(OK_ENV).filter(([k]) =
          +> k !== missing)));                                           
      187 +  r = await run(lead, req('/api/lead', { body: { email: 'eva@e
          +xample.cz', souhlas: true } }));                              
      188 +  check(`lead: bez ${missing} → 503, nic se neposílá`, r.statu
          +s === 503 && r.calls.length === 0);                           
      189 +}                                                             
      190  env(OK_ENV);
      110 -reply = () => new Response(null, { status: 201 });            
      191  
      192  // ---------- /api/event ----------
      193  const ID = '6cea79d5-7dbd-47ef-a402-37cd1ae34015';
      114 -r = await run(event, req('/api/event', { body: { navsteva: ID,
          - udalost: 'otoceni_listku', varianta: 'zacatek', detail: 'VOO:
          -dvojce' }, type: 'text/plain;charset=UTF-8' }));              
      194 +reply = () => Response.json('ok');                            
      195 +const ev = (o) => ({ navsteva: ID, udalost: 'otoceni_listku', 
          +varianta: 'zacatek', detail: 'VOO:dvojce', ...o });           
      196 +r = await run(event, req('/api/event', { body: ev(), type: 'te
          +xt/plain;charset=UTF-8' }));                                  
      197  const e = r.calls[0] || {};
      116 -check('event: platná událost přes sendBeacon (text/plain) → 20
          -4 a zápis', r.status === 204 && r.calls.length === 1, String(r
          -.status));                                                    
      117 -check('event: zápis do events, jen čtyři sloupce (čas doplní d
          -atabáze)', e.url === 'https://projekt.supabase.co/rest/v1/even
          -ts' && JSON.stringify(e.body) === JSON.stringify({ navsteva: I
          -D, udalost: 'otoceni_listku', varianta: 'zacatek', detail: 'VO
          -O:dvojce' }), JSON.stringify(e.body));                        
      118 -check('event: klíč jen v hlavičce apikey', e.headers && e.head
          -ers.apikey === KEY && !('Authorization' in e.headers));       
      119 -r = await run(event, req('/api/event', { body: { navsteva: ID,
          - udalost: 'prichod', varianta: 'vychozi' } }));               
      120 -check('event: bez detailu → detail null', r.status === 204 && 
          -r.calls[0].body.detail === null);                             
      198 +check('event: platná událost přes sendBeacon (text/plain) → 20
          +4 a jedno volání uloz_udalost', r.status === 204 && r.calls.le
          +ngth === 1 && e.url === 'https://projekt.supabase.co/rest/v1/r
          +pc/uloz_udalost', String(r.status));                          
      199 +check('event: jen ID návštěvy, událost, verze, detail a hash I
          +P (čas doplní databáze)', e.body && Object.keys(e.body).sort()
          +.join() === 'p_detail,p_klic,p_navsteva,p_udalost,p_varianta' 
          +&& e.body.p_detail === 'VOO:dvojce', JSON.stringify(e.body)); 
      200 +for (const [udalost, detail] of [['prichod', null], ['prichod'
          +, 'sdileni'], ['prichod', 'facebook'], ['scroll', '75'], ['cta
          +', 'karty'], ['formular_zacatek', 'sekce'], ['odeslani_chyba',
          + 'mx'], ['tahak_otevren', 'panel'], ['sdileni', 'kopie']]) {  
      201 +  r = await run(event, req('/api/event', { body: ev({ udalost,
          + detail }), type: 'text/plain' }));                           
      202 +  check(`event: ${udalost}${detail ? ` s detailem ${detail}` :
          + ''} → 204`, r.status === 204);                               
      203 +}                                                             
      204  for (const [name, body, chyba] of [
      122 -  ['neplatné ID návštěvy', { navsteva: 'abc', udalost: 'pricho
          -d', varianta: 'vychozi' }, 'navsteva'],                       
      123 -  ['neznámá událost', { navsteva: ID, udalost: 'nakup', varian
          -ta: 'vychozi' }, 'udalost'],                                  
      124 -  ['neznámá verze úvodu', { navsteva: ID, udalost: 'prichod', 
          -varianta: 'jina' }, 'varianta'],                              
      125 -  ['e-mail v detailu', { navsteva: ID, udalost: 'prichod', var
          -ianta: 'vychozi', detail: 'jana@example.com' }, 'detail'],    
      126 -  ['e-mail jako pole navíc', { navsteva: ID, udalost: 'odeslan
          -o', varianta: 'vychozi', email: 'jana@example.com' }, 'pole'],
      127 -  ['příliš dlouhý detail', { navsteva: ID, udalost: 'prichod',
          - varianta: 'vychozi', detail: 'x'.repeat(41) }, 'detail'],    
      205 +  ['neplatné ID návštěvy', ev({ navsteva: 'abc' }), 'navsteva'
          +],                                                            
      206 +  ['neznámá událost', ev({ udalost: 'nakup' }), 'udalost'],   
      207 +  ['událost „constructor“', ev({ udalost: 'constructor' }), 'u
          +dalost'],                                                     
      208 +  ['neznámá verze úvodu', ev({ varianta: 'jina' }), 'varianta'
          +],                                                            
      209 +  ['e-mail v detailu', ev({ udalost: 'prichod', detail: 'jana@
          +example.com' }), 'detail'],                                   
      210 +  ['libovolný text v detailu', ev({ udalost: 'scroll', detail:
          + 'tajna-zprava' }), 'detail'],                                
      211 +  ['neexistující ETF v detailu', ev({ detail: 'QQQ:dvojce' }),
          + 'detail'],                                                   
      212 +  ['detail jako číslo', ev({ udalost: 'scroll', detail: 50 }),
          + 'detail'],                                                   
      213 +  ['e-mail jako pole navíc', ev({ email: 'jana@example.com' })
          +, 'pole'],                                                    
      214  ]) {
      215    r = await run(event, req('/api/event', { body, type: 'text/p
           lain' }));
      216    check(`event: ${name} → 400, nic se neuloží`, r.status === 4
           00 && r.json.chyba === chyba && r.calls.length === 0, `${r.sta
           tus} ${r.json && r.json.chyba}`);
      217  }
      132 -r = await run(event, req('/api/event', { body: { navsteva: ID,
          - udalost: 'prichod', varianta: 'vychozi', detail: 'x'.repeat(6
          -00) }, type: 'text/plain' }));                                
      218 +r = await run(event, req('/api/event', { body: ev({ detail: 'x
          +'.repeat(600) }), type: 'text/plain' }));                     
      219  check('event: tělo nad 512 B → 413', r.status === 413 && r.cal
           ls.length === 0);
      220  r = await run(event, req('/api/event', { method: 'GET', type: 
           null }));
      221  check('event: GET → 405', r.status === 405);
      136 -r = await run(event, req('/api/event', { body: { navsteva: ID,
          - udalost: 'prichod', varianta: 'vychozi' }, type: 'text/plain'
          -, headers: { origin: 'https://cizi-stranka.example' } }));    
      222 +r = await run(event, req('/api/event', { body: ev(), type: 'te
          +xt/plain', headers: { origin: 'https://cizi-stranka.example' }
          + }));                                                         
      223  check('event: požadavek z cizí stránky → 403', r.status === 40
           3 && r.calls.length === 0);
      224 +reply = () => Response.json('limit');                         
      225 +r = await run(event, req('/api/event', { body: ev(), type: 'te
          +xt/plain' }));                                                
      226 +check('event: překročený limit (IP nebo návštěva) → 429', r.st
          +atus === 429 && r.json.chyba === 'limit');                    
      227  reply = () => { throw new TypeError('fetch failed'); };
      139 -r = await run(event, req('/api/event', { body: { navsteva: ID,
          - udalost: 'prichod', varianta: 'vychozi' }, type: 'text/plain'
          - }));                                                         
      228 +r = await run(event, req('/api/event', { body: ev(), type: 'te
          +xt/plain' }));                                                
      229  check('event: nedostupná databáze → 502', r.status === 502);
      141 -reply = () => new Response(null, { status: 201 });            
      230 +reply = () => Response.json('ok');                            
      231  
      232 +// ---------- /api/token ----------                           
      233 +r = await run(token, req('/api/token', { method: 'GET', type: 
          +null }));                                                     
      234 +check('token: GET → 200, podepsaný a platný token, necachuje s
          +e', r.status === 200 && /^\d{13}\./.test(r.json.token) && lib.
          +overToken(r.json.token) === 'rychle' && lib.overToken(r.json.t
          +oken, Date.now() + 3500) === 'ok' && r.headers.get('cache-cont
          +rol') === 'no-store');                                        
      235 +r = await run(token, req('/api/token', { body: '{}' }));      
      236 +check('token: POST → 405', r.status === 405);                 
      237 +env({ ...OK_ENV, ANTISPAM_SECRET: '' });                      
      238 +r = await run(token, req('/api/token', { method: 'GET', type: 
          +null }));                                                     
      239 +check('token: bez ANTISPAM_SECRET → 503', r.status === 503);  
      240 +env(OK_ENV);                                                  
      241 +                                                              
      242  // ---------- /api/keepalive ----------
      243  r = await run(keepalive, req('/api/keepalive', { method: 'GET'
           , type: null }));
      244  check('keepalive: bez hlavičky Authorization → 401, žádný dota
           z', r.status === 401 && r.calls.length === 0);
      245  r = await run(keepalive, req('/api/keepalive', { method: 'GET'
           , type: null, headers: { authorization: 'Bearer spatne' } }));
      246  check('keepalive: špatný CRON_SECRET → 401', r.status === 401 
           && r.calls.length === 0);
      148 -reply = () => Response.json([{ id: 1 }]);                     
      247 +reply = () => Response.json(3);                               
      248  r = await run(keepalive, req('/api/keepalive', { method: 'GET'
           , type: null, headers: { authorization: `Bearer ${OK_ENV.CRON_
           SECRET}` } }));
      150 -check('keepalive: se správným CRON_SECRET → 200 a jeden malý d
          -otaz', r.status === 200 && r.calls.length === 1 && r.calls[0].
          -url.endsWith('/rest/v1/events?select=id&limit=1') && r.calls[0
          -].method === 'GET', r.calls[0] && r.calls[0].url);            
      151 -env({ SUPABASE_URL: OK_ENV.SUPABASE_URL, SUPABASE_SECRET_KEY: 
          -KEY });                                                       
      152 -r = await run(keepalive, req('/api/keepalive', { method: 'GET'
          -, type: null, headers: { authorization: 'Bearer undefined' } }
          -));                                                           
      249 +check('keepalive: se správným CRON_SECRET → 200 a volání uklid
          + (zápis do databáze)', r.status === 200 && r.calls.length === 
          +1 && r.calls[0].url.endsWith('/rest/v1/rpc/uklid') && r.json.s
          +mazano === 3, r.calls[0] && r.calls[0].url);                  
      250 +env({ ...OK_ENV, CRON_SECRET: '' });                          
      251 +r = await run(keepalive, req('/api/keepalive', { method: 'GET'
          +, type: null, headers: { authorization: 'Bearer ' } }));      
      252  check('keepalive: bez nastaveného CRON_SECRET nepustí nikoho',
            r.status === 401 && r.calls.length === 0);
      253  env(OK_ENV);
      254  
      255  // ---------- logy, konfigurace, žádné klíče ve webu ---------
           -
      157 -console.error = origError;                                    
      158 -check('logy funkcí neobsahují e-mail ani klíč', logs.length > 
          -0 && !logs.some((l) => l.includes('@') || l.includes(KEY)), lo
          -gs.join(' | '));                                              
      256 +console.error = orig.error;                                   
      257 +console.warn = orig.warn;                                     
      258 +check('logy funkcí neobsahují e-mail, klíč ani IP', logs.lengt
          +h > 0 && !logs.some((l) => l.includes('@') || l.includes(KEY) 
          +|| l.includes(SECRET) || l.includes(IP)), logs.slice(0, 4).joi
          +n(' | '));                                                    
      259  
      260  const vercel = JSON.parse(readFileSync(join(root, 'vercel.json
           '), 'utf8'));
      261  const apiFiles = readdirSync(join(root, 'api'));
     ...
      264  const cron = (vercel.crons || [])[0] || {};
      265  const [min, hour, ...rest] = (cron.schedule || '').split(' ');
      266  check('vercel.json: denní cron na existující /api/keepalive (H
           obby: nejvýš jednou denně)', cron.path === '/api/keepalive' &&
            apiFiles.includes('keepalive.js') && /^\d+$/.test(min) && /^\
           d+$/.test(hour) && rest.join(' ') === '* * *', cron.schedule);
      267 +const all = (vercel.headers.find((h) => h.source === '/(.*)') 
          +|| { headers: [] }).headers;                                  
      268 +const hv = (k) => (all.find((h) => h.key === k) || {}).value |
          +| '';                                                         
      269 +check('hlavičky: HSTS aspoň rok', /max-age=(\d+)/.test(hv('Str
          +ict-Transport-Security')) && Number(hv('Strict-Transport-Secur
          +ity').match(/max-age=(\d+)/)[1]) >= 31536000);                
      270 +check('hlavičky: nosniff, Referrer-Policy, X-Frame-Options, CO
          +OP', hv('X-Content-Type-Options') === 'nosniff' && hv('Referre
          +r-Policy') === 'strict-origin-when-cross-origin' && hv('X-Fram
          +e-Options') === 'DENY' && hv('Cross-Origin-Opener-Policy') ===
          + 'same-origin');                                              
      271 +check('hlavičky: Permissions-Policy vypíná kameru, mikrofon, p
          +olohu; sdílení a schránku nechává', /camera=\(\)/.test(hv('Per
          +missions-Policy')) && !/web-share|clipboard/.test(hv('Permissi
          +ons-Policy')));                                               
      272 +let cspOk = true;                                             
      273 +try { execFileSync('node', [join(root, 'scripts', 'csp.mjs'), 
          +'--check'], { stdio: 'pipe' }); } catch { cspOk = false; }    
      274 +check('hlavičky: CSP na HTML stránkách sedí na hashe vložených
          + skriptů (scripts/csp.mjs --check)', cspOk);                  
      275 +const csp = (vercel.headers.find((h) => h.source === '/') || {
          + headers: [] }).headers.find((h) => h.key === 'Content-Securit
          +y-Policy')?.value || '';                                      
      276 +check("hlavičky: CSP bez 'unsafe-inline' a 'unsafe-eval' u skr
          +iptů, object-src a frame-ancestors 'none'", /script-src 'sha25
          +6-/.test(csp) && !/script-src[^;]*unsafe/.test(csp) && /object
          +-src 'none'/.test(csp) && /frame-ancestors 'none'/.test(csp));
      277 +check('api/_lib.js a seznam domén nejsou funkce (podtržítko), 
          +všechny endpointy mají soubor', apiFiles.filter((f) => !f.star
          +tsWith('_')).sort().join() === 'event.js,keepalive.js,lead.js,
          +token.js', apiFiles.join());                                  
      278  const pkg = JSON.parse(readFileSync(join(root, 'package.json')
           , 'utf8'));
      279  check('package.json: funkce jsou ES moduly, bez závislostí', p
           kg.type === 'module' && !pkg.dependencies);
      169 -                                                              
      280  const publicText = readdirSync(join(root, 'public')).filter((f
           ) => /\.(html|js|json|txt)$/.test(f)).map((f) => readFileSync(
           join(root, 'public', f), 'utf8')).join('\n');
      171 -check('public/: žádná adresa Supabase ani klíč (prohlížeč mluv
          -í jen s /api/)', !/supabase\.co|sb_secret|sb_publishable|servi
          -ce_role|SUPABASE_/i.test(publicText));                        
      281 +check('public/: žádná adresa Supabase ani klíč (prohlížeč mluv
          +í jen s /api/)', !/supabase\.co|sb_secret|sb_publishable|servi
          +ce_role|SUPABASE_|ANTISPAM/i.test(publicText));               
      282  const example = readFileSync(join(root, '.env.example'), 'utf8
           ');
      173 -check('.env.example: jen názvy bez hodnot', example.split('\n'
          -).filter((l) => /^[A-Z_]+=/.test(l)).every((l) => /^[A-Z_]+=$/
          -.test(l)) && /SUPABASE_SECRET_KEY=/.test(example));           
      283 +check('.env.example: jen názvy bez hodnot, všechny čtyři promě
          +nné', example.split('\n').filter((l) => /^[A-Z_]+=/.test(l)).e
          +very((l) => /^[A-Z_]+=$/.test(l)) && ['SUPABASE_URL', 'SUPABAS
          +E_SECRET_KEY', 'CRON_SECRET', 'ANTISPAM_SECRET'].every((k) => 
          +example.includes(`${k}=`)));                                  
      284  const gitignore = readFileSync(join(root, '.gitignore'), 'utf8
           ');
      285  check('.gitignore: .env.local se necommituje', /^\.env\.\*$/m.
           test(gitignore) && /^!\.env\.example$/m.test(gitignore));
      286  

  Ran 1 shell command (ctrl+o to expand)

⏺ Funkční testy proběhly v pořádku (107 kontrol). Teď otestuji stránku v Chromu
  – nahradím pevné pauzy čekáním na poděkování (zobrazí se až po ~3 s) a doplním
  testy hlášek pro doménu bez MX, jednorázovou adresu, překročený limit a
  server-side kontrolu skrytého pole.

  Read 1 file, ran 1 shell command (ctrl+o to expand)

⏺ Bash(python3 - <<'EOF'
      p='scripts/test-page.mjs'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated scripts/test-page.mjs (+43 -11)
      36  const realErrors = (logs) => logs.filter((l) => l.type === 'pag
          eerror' || l.type === 'error' || l.type === 'http');
      37  const events = (logs) => logs.filter((l) => l.type === 'event')
          .map((l) => l.data);
      38  const devDb = (q = '') => fetch(`${BASE}__dev/db${q}`).then((r)
           => r.json());
      39 +// poděkování přijde až ~3 s po načtení (server zahodí formulář
         + odeslaný rychleji, stránka do té doby počká)                  
      40 +const waitFor = (page, sel, ms = 12000) => page.waitForSelector
         +(sel, { timeout: ms }).then(() => true, () => false);          
      41 +const waitError = (page, F, ms = 12000) => page.waitForFunction
         +((F) => { const p = document.querySelector(`${F} .form-error`);
         + return p && !p.hidden && !document.querySelector(`${F} [type=s
         +ubmit]`).disabled; }, { timeout: ms }, F).then(() => true, () =
         +> false);                                                      
      42  const visible = (page, sel) => page.$eval(sel, (el) => !!(el.of
          fsetWidth || el.offsetHeight || el.getClientRects().length)).ca
          tch(() => false);
      43  const text = (page, sel) => page.$eval(sel, (el) => el.textCont
          ent.trim()).catch(() => null);
      44  
     ...
      126      await sleep(80);
      127      const busy = await page.evaluate(() => window.__btn || [])
           ;
      128      check('tlačítko při odesílání: zablokované s textem „Odesí
           lám…“', busy.includes('true|Odesílám…'), busy.join(' / '));
      126 -    await sleep(900);                                         
      129 +    await waitFor(page, '#vyber-cta .thanks');                
      130      check('poděkování po odeslání', ((await text(page, '#vyber
           -cta .thanks h3')) || '') === 'Hotovo, tahák je tvůj.');
      131      check('všechny formuláře nahrazené poděkováním', (await pa
           ge.$$('.lead-form')).length === 0);
      132      check('poděkování nahradilo celou kartu v sekci (žádné odr
           ážky)', (await page.$$('#tahak .form-card ul, #tahak .form-car
           d .lead-form')).length === 0 && !!(await page.$('#tahak .form-
           card .thanks')));
     ...
      141      const evs = events(logs);
      142      const db = await devDb();
      143      const row = db.leads.find((l) => l.email === 'jana@example
           .com');
      141 -    check('databáze: kontakt uložený jen se sloupci e-mail, so
          -uhlas, čas souhlasu a verze', !!row && Object.keys(row).sort()
          -.join() === 'email,souhlas,souhlas_cas,varianta', JSON.stringi
          -fy(row));                                                     
      144 +    check('databáze: kontakt uložený jen se sloupci e-mail, so
          +uhlas, čas souhlasu a verze', !!row && Object.keys(row).sort()
          +.join() === 'email,id,souhlas,souhlas_cas,varianta', JSON.stri
          +ngify(row));                                                  
      145      const visit = evs[0] && evs[0].navsteva;
      146      const stored = db.events.filter((e) => e.navsteva === visi
           t).map((e) => `${e.udalost}:${e.detail}`).sort().join();
      147      check('databáze: každá odeslaná událost této návštěvy opra
           vdu dorazila', !!visit && stored === evs.map((e) => `${e.udalo
           st}:${e.detail ?? null}`).sort().join() && evs.every((e) => e.
           navsteva === visit), `${evs.length} odesláno`);
     ...
      187      await page.type(`${F} input[name=email]`, 'petr@example.co
           m');
      188      await page.tap(`${F} input[name=consent]`);
      189      await page.tap(`${F} [type=submit]`);
      187 -    await sleep(900);                                         
      190 +    await waitFor(page, '#panel .thanks');                    
      191      check('odeslání z panelu → poděkování', ((await text(page,
            '#panel .thanks h3')) || '') === 'Hotovo, tahák je tvůj.');
      192      const ev = events(logs).filter((e) => e.udalost === 'odesl
           ano');
      193      check('měření: odeslano se zdrojem karty', ev.length === 1
            && ev[0].detail === 'karty', JSON.stringify(ev));
     ...
      233      kopie: () => { delete Navigator.prototype.share; Object.de
           fineProperty(navigator, 'clipboard', { value: { writeText: () 
           => Promise.resolve() } }); },
      234      rucne: () => { delete Navigator.prototype.share; Object.de
           fineProperty(navigator, 'clipboard', { value: undefined }); },
      235    };
      236 +  await devDb('?smazat=1'); // limit 10 kontaktů za hodinu z j
          +edné IP: testy jich odešlou víc                               
      237    for (const [mode, before] of Object.entries(SHARE)) {
      238      const { page, logs } = await open('', before);
      239      const F = '[data-slot="sekce"] .lead-form';
     … 81 more lines (ctrl+o to expand)

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Dvě věci: kontrola obsahu odeslaného kontaktu čeká staré pole (teď jsou v něm
  i token a poznamka) a tři ze čtyř testů sdílení selhaly. Podívám se proč.

  Searched for 1 pattern (ctrl+o to expand)

⏺ Sharing tests tapnou tlačítko hned po zobrazení poděkování, ale focus se v tu
  chvíli ještě posouvá, takže klik mine (podobně jako dřív u zaškrtávátka).
  Počkám na doběhnutí posunu a opravím kontrolu obsahu kontaktu.

⏺ Bash(python3 - <<'EOF'
      p='scripts/test-page.mjs'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated scripts/test-page.mjs (+2 -1)
      136      check('na stránce není viditelné TODO', !(await page.evalu
           ate(() => document.body.innerText.includes('TODO'))));
      137      check('lišta dole po odeslání schovaná', !(await visible(p
           age, '#lista')));
      138      const lead = logs.find((l) => l.type === 'lead');
      139 -    check('odeslání: e-mail, souhlas a verze úvodu, bez ID náv
          -štěvy', lead && lead.status === 200 && JSON.stringify(lead.dat
          -a) === JSON.stringify({ email: 'jana@example.com', souhlas: tr
          -ue, varianta: 'vychozi' }), JSON.stringify(lead && lead.data))
          -;                                                             
      139 +    check('odeslání: e-mail, souhlas, verze úvodu, token a prá
          +zdné skryté pole, bez ID návštěvy', lead && lead.status === 20
          +0 && Object.keys(lead.data).sort().join() === 'email,poznamka,
          +souhlas,token,varianta' && lead.data.email === 'jana@example.c
          +om' && lead.data.souhlas === true && lead.data.varianta === 'v
          +ychozi' && lead.data.poznamka === '' && /^\d{13}\./.test(lead.
          +data.token), JSON.stringify(lead && lead.data));              
      140      await sleep(300);
      141      const evs = events(logs);
      142      const db = await devDb();
     ...
      241      await page.tap(`${F} input[name=consent]`);
      242      await page.tap(`${F} [type=submit]`);
      243      await waitFor(page, '#tahak .thanks');
      244 +    await sleep(700); // fokus na poděkování stránku plynule p
          +osune, klepat až potom                                        
      245      const T = '#tahak .thanks';
      246      if (mode === 'nativni') {
      247        const btn = await page.$eval(`${T} [data-tahak]`, (a) =>
            `${a.textContent}|${a.className}|${a.getAttribute('href')}|${
           a.target}`).catch(() => null);

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Všech 117 kontrol v Chromu prošlo s aktivní CSP díky hlavičkám z vercel.json.
  Teď přidám důkaz, že CSP skutečně blokuje spuštění podstrčeného vloženého
  skriptu.

⏺ Bash(python3 - <<'EOF'
      p='scripts/test-page.mjs'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated scripts/test-page.mjs (+7 -0)
      303      check('favicon, ikona pro iOS a obrázek pro sdílení existu
           jí', head.files.every((f) => / 200 (image|text)/.test(f)), hea
           d.files.join(' | '));
      304      check('og:image: absolutní https adresa, 1200×630', /^http
           s:\/\/[^/]+\/og\.png$/.test(head.ogImage) && head.ogSize === '
           1200×630', `${head.ogImage} ${head.ogSize}`);
      305      check('panel má aria-modal', head.modal === 'true');
      306 +    const csp = await page.evaluate(() => {                   
      307 +      const s = document.createElement('script');             
      308 +      s.textContent = 'window.__xss = 1';                     
      309 +      document.body.appendChild(s);                           
      310 +      return window.__xss === undefined;                      
      311 +    });                                                       
      312 +    check('CSP: podstrčený vložený skript (XSS) se nespustí', 
          +csp);                                                         
      313      await page.close();
      314    }
      315  

  Called plugin:context-mode:context-mode (ctrl+o to expand)
⏺ Chrome, WebKit, kontrola stránky, funkce i databáze prošly. Teď doplním
  dokumentaci: sekci o bezpečnosti s nálezy, opravu nepravdivého tvrzení o
  spárování, ANTISPAM_SECRET do návodu a nové skripty.

  Searched for 1 pattern, ran 1 shell command (ctrl+o to expand)

⏺ Bash(python3 - <<'EOF'
      import re…)
  ⎿  Updated README.md (+68 -9)
       76  
       77  - **Každá událost má ID návštěvy** (náhodné UUID jen v paměti 
           jednoho načtení stránky), název, verzi úvodu z `?v=` a krátký 
           detail. Do prohlížeče se nic neukládá.
       78  - **Trychtýř podle verzí úvodu** počítá pohled `analytika.tryc
           htyr` ze [supabase/funnel.sql](supabase/funnel.sql): příchod →
            otočení lístku → otevření formuláře → odeslání. U každého kro
           ku je, kolik návštěv ho udělalo, kolik udělalo i všechny předc
           hozí a podíl z příchodů.
       79 -- **ID návštěvy se nikdy nespojuje s e-mailem.** Kontakt jde j
          -inou funkcí ([`/api/lead`](api/lead.js)) do jiné tabulky, bez 
          -ID návštěvy. Funkce kontakt s ID odmítne a událost s „@“ v det
          -ailu taky. Čas událostí se ukládá jen na celé hodiny, takže ud
          -álost `odeslano` nejde s řádkem kontaktu spárovat podle času. 
       79 +- **ID návštěvy se nikdy nespojuje s e-mailem.** Kontakt jde j
          +inou funkcí ([`/api/lead`](api/lead.js)) do jiné tabulky, bez 
          +ID návštěvy. Funkce kontakt s ID odmítne a detail události ber
          +e jen z pevného seznamu hodnot. Klíče řádků jsou náhodná UUID 
          +a čas událostí je jen na celé hodiny. **Úplně spárování vylouč
          +it nejde:** kdo má plný přístup do databáze, může při malém pr
          +ovozu odhadnout, která návštěva odeslala který kontakt, podle 
          +hodiny a pořadí zápisu v Postgresu. ID návštěvy je proto pseud
          +onymní údaj, ne anonymní. Podrobnosti jsou v sekci [Bezpečnost
          + a ochrana proti spamu](#bezpečnost-a-ochrana-proti-spamu).   
       80  - **Ověřeno automaticky:** test v Chromu porovná události, kte
           ré stránka odeslala, s tím, co lokální server uložil, a kontro
           luje, že v nich nikde není e-mail. Vlastní funkce mají testy s
            podvrženou databází ([scripts/test-api.mjs](scripts/test-api.
           mjs)).
       81  - **Před ostrou kampaní by měl měření posoudit právník.** Do p
           rohlížeče sice nic neukládáme, ale i JavaScript, který z prohl
           ížeče odesílá data, může podle výkladu Evropského sboru pro oc
           hranu osobních údajů (pokyny 2/2023) vyžadovat souhlas. Tenhle
            výklad jsme z primárního zdroje neověřovali, proto ho nechává
           me na právníkovi.
       82  
       83 +## Bezpečnost a ochrana proti spamu                           
       84 +                                                              
       85 +Formulář je veřejný, takže počítám s tím, že ho budou zkoušet 
          +boti a že ho někdo bude chtít zneužít. Projekt prošly dva revi
          +ew skilly Claude Code (`security-review` a `code-review`) a vl
          +astní kontrola. Všechno je pokryté testy:                     
       86 +- [scripts/test-api.mjs](scripts/test-api.mjs): funkce s podvr
          +ženou databází a DNS, 107 kontrol,                            
       87 +- [scripts/test-db.mjs](scripts/test-db.mjs): `schema.sql` na 
          +skutečném Postgresu v PGlite, 45 kontrol,                     
       88 +- [scripts/test-page.mjs](scripts/test-page.mjs): celá cesta v
          + prohlížeči proti lokálnímu serveru se stejnou databází.      
       89 +                                                              
       90 +**Cesta kontaktu přes `/api/lead`, v tomhle pořadí:**         
       91 +                                                              
       92 +1. Jen povolená pole (`email`, `souhlas`, `varianta`, `token`,
          + skryté pole). Kontakt s ID návštěvy nebo s čímkoli navíc funk
          +ce odmítne. Tělo nejvýš 1 kB, i když klient délku neuvede. Pož
          +adavek z cizí stránky (`Origin`) odmítne.                     
       93 +2. **Skryté pole** `poznamka`: když ho bot vyplní, funkce odpo
          +ví jako při úspěchu, ale nic neuloží.                         
       94 +3. **Rychlost odeslání:** stránka si po načtení vezme z `/api/
          +token` podepsaný čas vydání (HMAC, `ANTISPAM_SECRET`). Kontakt
          + bez platného tokenu funkce odmítne. Kontakt odeslaný dřív než
          + 3 s po vydání potichu zahodí, protože tak rychle formulář vyp
          +lní jen bot. Rychlejší člověk o kontakt nepřijde: stránka ten 
          +zbytek počká na „Odesílám…“.                                  
       95 +4. **Formát e-mailu:** jen ASCII, platná doména s koncovkou, b
          +ez `< > " '`, bez `=`, `+` nebo `-` na začátku (vzorec při exp
          +ortu do tabulky). Stejné pravidlo hlídá i databáze.           
       96 +5. **Souhlas** musí být `true`.                               
       97 +6. **Jednorázové domény:** 9 222 domén ze seznamu [disposable-
          +email-domains](https://github.com/disposable-email-domains/dis
          +posable-email-domains) (licence CC0, commit `81a8976` z 9. 10.
          + 2026). Aktualizuje se skriptem [scripts/jednorazove-domeny.mj
          +s](scripts/jednorazove-domeny.mjs). Kontroluje se i subdoména 
          +(`x.mailinator.com`).                                         
       98 +7. **MX záznam:** doména musí přijímat poštu. Doména bez MX ne
          +bo s „null MX“ (RFC 7505) neprojde. Když DNS neodpoví do 2,5 s
          +, kontakt projde, aby skutečný člověk nedoplatil na výpadek DN
          +S.                                                            
       99 +8. **Limit pokusů:** nejvýš 10 kontaktů za hodinu z jedné IP a
          +dresy. Počítá to databáze (funkce `uloz_kontakt`) podle HMAC z
          + IP, hodiny a tajné soli. IP adresa se nikam neukládá a klíče 
          +z různých hodin nejdou spojit. Záznamy starší než 2 dny maže d
          +enní cron.                                                    
      100 +9. **Duplicita:** stejný e-mail se podruhé neuloží (`on confli
          +ct do nothing`), ale návštěvník dostane stejnou odpověď a tahá
          +k. Formulář tak neprozradí, kdo už v databázi je.             
      101 +                                                              
      102 +**Nálezy a co s nimi:**                                       
      103 +                                                              
      104 +| Nález | Závažnost | Stav |                                  
      105 +|---|---|---|                                                 
      106 +| Spam a cizí e-maily přes API: skript bez hlavičky `Origin` m
          +ohl posílat kontakty donekonečna, proti tomu bylo jen skryté p
          +ole. | střední | **Opraveno** body 3 až 8 výše. Zůstává jedna 
          +věc: kdo zná cizí existující adresu, může ji zapsat. To žádná 
          +kontrola na stránce nepozná, pomůže jen double opt-in (níže). 
          +|                                                             
      107 +| Zahlcení `/api/event` nebo ukládání libovolných dat přes měř
          +ení. | střední | **Opraveno:** detail události jen z pevného s
          +eznamu hodnot pro každou událost (např. `scroll` jen 25/50/75/
          +100), nejvýš 600 událostí za hodinu z jedné IP a 100 na návště
          +vu (počítá databáze), tělo nejvýš 512 B. |                    
      108 +| Spárování e-mailu s návštěvou podle pořadí zápisu: tabulky m
          +ěly pořadová čísla, takže k-tý kontakt odpovídal k-té události
          + `odeslano`. README přitom tvrdilo, že spárovat nejdou. | stře
          +dní (soukromí, jen pro toho, kdo má přístup do databáze) | **Č
          +ástečně:** klíče jsou náhodná UUID a nepravdivé tvrzení je opr
          +avené. Úplně to vyloučit nejde: při malém provozu lze páry odh
          +adnout podle hodiny a systémových sloupců Postgresu. Spolehliv
          +ě by pomohlo jen neposílat ID návštěvy u událostí kolem odeslá
          +ní, což mění měření. To je rozhodnutí pro tebe a právníka, ne 
          +pro mě. |                                                     
      109 +| Skryté pole kontrolované v prohlížeči tiše zahodilo kontakt,
          + když ho vyplnilo automatické vyplňování formulářů. | nízká (z
          +tracené kontakty) | **Opraveno:** rozhoduje jen server a pole 
          +se jmenuje `poznamka`, což automatické vyplňování nezná. |    
      110 +| Chybějící bezpečnostní hlavičky. | nízká (obrana do hloubky)
          + | **Opraveno ve [vercel.json](vercel.json):** Content-Securit
          +y-Policy s hashi obou vložených skriptů (bez `unsafe-inline` p
          +ro skripty, test ověřuje, že podstrčený skript se nespustí; ha
          +she hlídá [scripts/csp.mjs](scripts/csp.mjs)), HSTS, `nosniff`
          +, Referrer-Policy, Permissions-Policy, COOP a zákaz vkládání d
          +o rámu. Lighthouse ani stránku to nerozbilo, lokální server po
          +sílá stejné hlavičky. |                                       
      111 +| Výchozí práva Supabase dávají anonymní roli přístup ke každé
          + nové tabulce a funkci v `public`. | nízká (obrana do hloubky)
          + | **Opraveno:** schéma výchozí práva odebere a test v PGlite 
          +ověřuje, že anonymní ani přihlášená role nic nepřečte, nezapíš
          +e ani nezavolá. |                                             
      112 +| E-maily s ne-ASCII znaky: `toLowerCase()` v JS a `lower()` v
          + Postgresu se liší, uživatel by dostal „Něco se pokazilo“. | n
          +ízká | **Opraveno:** e-mail jen ASCII. |                      
      113 +| Kopie formuláře mohla převzít zablokované tlačítko „Odesílám
          +…“ z formuláře v sekci. | nízká (funkční) | **Opraveno:** kopi
          +e vznikají z čisté šablony. |                                 
      114 +| `?v=constructor` vypsal v nadpisu „undefined“. | nízká (kosm
          +etika, ne XSS) | **Opraveno:** jen vlastní klíče objektu. |   
     … 64 more lines (ctrl+o to expand)

⏺ Sekce o bezpečnosti je hotová v README. Teď doplním zbytek dokumentace k bodu
  3 (návod ke skriptům, strukturu v CLAUDE.md, nové chybové hlášky v texty.md,
  odstranění testovací adresy z deníku) a následně vše commitnu.

⏺ Bash(grep -n "seznam" ai-log/denik.md | cut -c1-120; python3 - <<'EOF'
      def edit(p, pairs):…)
  ⎿  Updated CLAUDE.md (+3 -2)
      21    tahak.pdf    lead magnet, generovaný (needitovat ručně)
      22    favicon.*, apple-touch-icon.png, og.png   ikony a obrázek pro
           sdílení, generuje scripts/obrazky.mjs
      23    ochrana-osobnich-udaju.html   návrh zásad (musí schválit práv
          ník)
      24 -api/           serverless funkce: lead.js (formulář), event.js 
         -(měření), keepalive.js (cron), každá soběstačná                
      24 +api/           serverless funkce: lead.js (formulář), event.js 
         +(měření), token.js (token proti botům), keepalive.js (cron);   
      25 +               společný kód v _lib.js (soubory s _ Vercel nenas
         +adí jako funkce)                                               
      26  tahak/         zdroj PDF taháku (tahak.html), generuje scripts/
          pdf.mjs
      27  scripts/       testy, Lighthouse, snímky obrazovky, generování 
          PDF (návod v scripts/README.md)
      28  docs/screenshots/  snímky obrazovky před a po úpravách
      29  data/          podklady k údajům o ETF: hodnota, zdroj (URL), d
          atum
      29 -supabase/      SQL: schema.sql (tabulky a RLS), funnel.sql (try
         -chtýř podle verzí úvodu)                                       
      30 +supabase/      SQL: schema.sql (tabulky, RLS, limity, funkce), 
         +funnel.sql (trychtýř podle verzí úvodu)                        
      31  reklamy/       obě verze reklamy (texty a vizuály)
      32  ai-log/        exporty konverzací z Claude Code (/export) a den
          ík práce s AI
      33  README.md      dokumentace pro hodnotitele
  ⎿  Updated ai-log/denik.md (+1 -1)
      107    - Kontrola šířky hlídala jen vodorovné přetečení, takže neza
           chytila, že na 320 px rub lístku se třemi brokery přetéká svis
           le přes další řadu. AI na to přišla při prohlížení snímků z 32
           0 px a doplnila svislou kontrolu.
      108    - Headless WebKit nerespektuje `backface-visibility`, takže 
           všechny lístky ukazovaly zrcadlově rub. Na iPhonu to podle člo
           věka fungovalo. Odhalil to snímek z WebKitu; stránka má teď po
           jistku přes `visibility`.
      109    - Test měření po přechodu na skutečné požadavky nezachytil o
           deslání kontaktu: Puppeteer u `fetch`, jehož tělo stránka nečt
           e, nevyvolá `requestfinished`. Test teď čte událost `response`
           .
      110 -  - Testovací adresa `jana@seznam.cz` mohla patřit skutečnému 
          -člověku. Při kontrole diffu před commitem ji AI nahradila adre
          -sou na vyhrazené doméně `example.com`.                        
      110 +  - Testovací adresa testovací adresa na skutečné doméně mohla
          + patřit skutečnému člověku. Při kontrole diffu před commitem j
          +i AI nahradila adresou na vyhrazené doméně `example.com`.     
      111    - Adresu `etf-dvojcata.vercel.app` AI chtěla použít pro `og:
           image`, ale kontrola ukázala, že ji už používá cizí projekt. Z
           volila volnou `etf-dvojcata-clientelo` a zapsala to do návodu.
      112    - Příčinu 404 u PDF se nepodařilo zjistit. AI to neoznačila 
           za vyřešené: zapsala, co vyloučila, a přidala diagnostiku do l
           okálního serveru.
  ⎿  Updated scripts/README.md (+5 -2)
      25  ./scripts/serve.sh
      26  ```
      27  
      28 -Server ([server.mjs](server.mjs)) servíruje `public/` a funkce 
         -z `api/` stejně jako Vercel. Bez proměnných `SUPABASE_*` běží s
         - podvrženou databází v paměti: formulář i měření fungují, nic s
         -e nikam neposílá a na `/__dev/db` je vidět, co by se uložilo. U
         - každé odpovědi 404 vypíše, kde soubor hledal a kdo se ptal. Se
         - skutečnou databází: `node --env-file=.env.local scripts/server
         -.mjs` (z kořene repa; obsah `.env.local` nikdy nevypisuj).     
      28 +Server ([server.mjs](server.mjs)) servíruje `public/` a funkce 
         +z `api/` stejně jako Vercel, včetně hlaviček z `vercel.json` (C
         +SP). Bez proměnných `SUPABASE_*` běží s podvrženou databází: PG
         +lite (Postgres ve WASM) se skutečným `supabase/schema.sql`. For
         +mulář i měření fungují, nic se nikam neposílá a na `/__dev/db` 
         +je vidět, co by se uložilo (jen z tohohle počítače). E-mailové 
         +domény končící `.invalid` se tváří, že nemají MX. U každé odpov
         +ědi 404 vypíše, kde soubor hledal a kdo se ptal. Se skutečnou d
         +atabází: `node --env-file=.env.local scripts/server.mjs` (z koř
         +ene repa; obsah `.env.local` nikdy nevypisuj).                 
      29  
      30  V druhém terminálu:
      31  
     ...
      33  python3 scripts/check_data.py      # data/etf.json: každý údaj 
          má zdroj a datum, platné ISINy
      34  python3 scripts/check_page.py      # čísla na stránce odpovídaj
          í data/etf.json
      35  cd scripts
      36 -node test-api.mjs                  # funkce v api/ s podvrženou
         - databází: validace, limity, honeypot, klíče, vercel.json      
      36 +node test-api.mjs                  # funkce v api/ s podvrženou
         + databází a DNS: validace, token, MX, limity, hlavičky         
      37 +node test-db.mjs                   # supabase/schema.sql a funn
         +el.sql na skutečném Postgresu (PGlite): práva, RLS, limity     
      38 +node csp.mjs                       # po změně skriptu v public/
         +*.html přepočítá hashe CSP ve vercel.json (--check jen ověří)  
      39 +node jednorazove-domeny.mjs        # aktualizuje seznam jednorá
         +zových e-mailových domén (api/_jednorazove-domeny.js)          
      40  node test-page.mjs                 # interakce na 375 px: výběr
           ETF, formuláře, panel, měření, uložení do databáze
      41  node test-webkit.mjs               # WebKit, iPhone 13 / SE / S
          E 320 px: formuláře se simulovanou klávesnicí
      42  node lighthouse.mjs                # Lighthouse (mobil) pro vše
          chny verze úvodu
  ⎿  Updated texty.md (+3 -0)
      237  | nezaškrtnutý souhlas | Zaškrtni prosím souhlas. (Závisí na r
           ozhodnutí výše.) |
      238  | chyba serveru | Něco se pokazilo u nás. Zkus to prosím za ch
           víli znovu. |
      239  | bez internetu | Vypadá to, že nejde internet. Zkontroluj při
           pojení a zkus to znovu. |
      240 +| doména nepřijímá poštu (bez MX) | Na tuhle adresu nejde posl
          +at e-mail. Zkontroluj, jestli v ní není překlep. |            
      241 +| jednorázová adresa | Jednorázové e-mailové adresy nebereme. 
          +Napiš prosím svůj běžný e-mail. |                             
      242 +| moc pokusů z jedné IP (10 za hodinu) | Z tohohle připojení p
          +řišlo moc pokusů za sebou. Zkus to prosím za hodinu. |        
      243  | e-mail už máme (není chyba) | Žádná hláška, stejné poděkován
           í jako u nového e-mailu. Jinak by formulář prozradil, kdo už j
           e v databázi. |
      244  
      245  ### Poděkování (nahradí celý blok s formulářem: kartu v sekci,
            výzvu pod lístky i obsah panelu)

⏺ Bash(python3 - <<'EOF'
      p='ai-log/denik.md'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated ai-log/denik.md (+1 -1)
      107    - Kontrola šířky hlídala jen vodorovné přetečení, takže neza
           chytila, že na 320 px rub lístku se třemi brokery přetéká svis
           le přes další řadu. AI na to přišla při prohlížení snímků z 32
           0 px a doplnila svislou kontrolu.
      108    - Headless WebKit nerespektuje `backface-visibility`, takže 
           všechny lístky ukazovaly zrcadlově rub. Na iPhonu to podle člo
           věka fungovalo. Odhalil to snímek z WebKitu; stránka má teď po
           jistku přes `visibility`.
      109    - Test měření po přechodu na skutečné požadavky nezachytil o
           deslání kontaktu: Puppeteer u `fetch`, jehož tělo stránka nečt
           e, nevyvolá `requestfinished`. Test teď čte událost `response`
           .
      110 -  - Testovací adresa testovací adresa na skutečné doméně mohla
          - patřit skutečnému člověku. Při kontrole diffu před commitem j
          -i AI nahradila adresou na vyhrazené doméně `example.com`.     
      110 +  - Testovací adresa na skutečné doméně (seznam.cz) mohla patř
          +it skutečnému člověku. Při kontrole diffu před commitem ji AI 
          +nahradila adresou na vyhrazené doméně `example.com`.          
      111    - Adresu `etf-dvojcata.vercel.app` AI chtěla použít pro `og:
           image`, ale kontrola ukázala, že ji už používá cizí projekt. Z
           volila volnou `etf-dvojcata-clientelo` a zapsala to do návodu.
      112    - Příčinu 404 u PDF se nepodařilo zjistit. AI to neoznačila 
           za vyřešené: zapsala, co vyloučila, a přidala diagnostiku do l
           okálního serveru.

⏺ Před commitem doplním skripty do package.json, znovu pustím testy funkcí a
  databáze a projdu diff na klíče a skutečné e-maily.

⏺ Bash(cd /Users/daniel/etfLanding/scripts && python3 - <<'EOF'
      import json…)
  ⎿  Updated scripts/package.json (+4 -1)
       9      "lighthouse": "node lighthouse.mjs",
      10      "pdf": "node pdf.mjs",
      11      "webkit": "PLAYWRIGHT_BROWSERS_PATH=0 playwright install we
          bkit",
      12 -    "test:webkit": "node test-webkit.mjs"                      
      12 +    "test:webkit": "node test-webkit.mjs",                     
      13 +    "test:api": "node test-api.mjs",                           
      14 +    "test:db": "node test-db.mjs",                             
      15 +    "csp": "node csp.mjs"                                      
      16    },
      17    "devDependencies": {
      18      "@electric-sql/pglite": "0.5.8",
  ⎿  (timeout 5m)

⏺ Zkontroluji přímo domény, aby v repu nezůstaly ani adresy typu x@seznam.cz, a
  opravím v README počet databázových kontrol na 44 (dříve chybně uvedeno 45).

⏺ Bash(python3 - <<'EOF'
      p='scripts/test-api.mjs'; s=open(p,encoding='utf-8').read()…)
  ⎿  Updated README.md (+1 -1)
      84  
      85  Formulář je veřejný, takže počítám s tím, že ho budou zkoušet b
          oti a že ho někdo bude chtít zneužít. Projekt prošly dva review
           skilly Claude Code (`security-review` a `code-review`) a vlast
          ní kontrola. Všechno je pokryté testy:
      86  - [scripts/test-api.mjs](scripts/test-api.mjs): funkce s podvrž
          enou databází a DNS, 107 kontrol,
      87 -- [scripts/test-db.mjs](scripts/test-db.mjs): `schema.sql` na s
         -kutečném Postgresu v PGlite, 45 kontrol,                       
      87 +- [scripts/test-db.mjs](scripts/test-db.mjs): `schema.sql` na s
         +kutečném Postgresu v PGlite, 44 kontrol,                       
      88  - [scripts/test-page.mjs](scripts/test-page.mjs): celá cesta v 
          prohlížeči proti lokálnímu serveru se stejnou databází.
      89  
      90  **Cesta kontaktu přes `/api/lead`, v tomhle pořadí:**
  ⎿  Updated scripts/test-api.mjs (+1 -1)
      130    r = await run(lead, req('/api/lead', { body: lead1({ email }
           ) }));
      131    check(`lead: jednorázová doména (${email.split('@')[1]}) → 4
           22, bez dotazu do DNS`, r.status === 422 && r.json.chyba === '
           jednorazovy' && r.calls.length === 0 && dnsCalls === 0);
      132  }
      133 -for (const email of ['x@seznam.cz', 'x@email.cz', 'x@centrum.c
          -z', 'x@gmail.com']) check(`běžná doména ${email.split('@')[1]}
          - není na seznamu jednorázových`, !lib.jednorazovaDomena(email.
          -split('@')[1]));                                              
      133 +for (const domena of ['seznam.cz', 'email.cz', 'centrum.cz', '
          +gmail.com']) check(`běžná doména ${domena} není na seznamu jed
          +norázových`, !lib.jednorazovaDomena(domena));                 
      134  for (const [name, domena] of [['doména neexistuje', 'neexistuj
           e.cz'], ['doména bez MX', 'bez-mx.cz'], ['„null MX“ (poštu nep
           řijímá)', 'null-mx.cz']]) {
      135    r = await run(lead, req('/api/lead', { body: lead1({ email: 
           `x@${domena}` }) }));
      136    check(`lead: ${name} → 422 mx, nic se neuloží`, r.status ===
            422 && r.json.chyba === 'mx' && r.calls.length === 0 && dnsCa
           lls === 1);

  Ran 1 shell command (ctrl+o to expand)

⏺ Bod 3 je v commitu 58efcdc. Teď bod 4: nenápadná poznámka v patičce a noindex
  na celou stránku. noindex dám do meta tagu i do hlavičky X-Robots-Tag, aby
  platil i pro PDF a obrázky.

  Ran 1 shell command (ctrl+o to expand)

⏺ Bash(python3 - <<'EOF'
      import json…)
  ⎿  Updated public/index.html (+4 -0)
       4  <meta charset="utf-8">
       5  <meta name="viewport" content="width=device-width, initial-scal
          e=1, viewport-fit=cover, interactive-widget=resizes-content">
       6  <title>Evropská dvojčata amerických ETF | ETF dvojčata</title>
       7 +<!-- noindex, dokud stránku Clientelo nepřevezme (README, Před 
         +spuštěním kampaně) -->                                         
       8 +<meta name="robots" content="noindex">                         
       9  <meta name="description" content="VOO, VT a dalších 5 ETF z USA
           ti broker v Česku často nenabídne. Najdi jejich evropská dvojč
          ata, která koupíš.">
      10  <meta property="og:title" content="Evropská dvojčata amerických
           ETF | ETF dvojčata">
      11  <meta property="og:description" content="VOO, VT a dalších 5 ET
          F z USA ti broker v Česku často nenabídne. Najdi jejich evropsk
          á dvojčata, která koupíš.">
     ...
      177  /* patička */
      178  .foot{padding-block:48px 120px;font-size:.8125rem;color:var(--
           ink-2)}
      179  .foot p{margin:0 0 .5em}
      180 +.foot .demo{margin-top:1em;opacity:.8}                        
      181  @media (hover:hover) and (pointer:fine){
      182  .btn:hover{background:#2B2B2B}
      183  .btn-yellow:hover{background:#FFD92E}
     ...
      444    <p>Data: weby správců fondů a&nbsp;brokerů, ověřeno 10.&nbsp
           ;10.&nbsp;2026.</p>
      445    <p>Nejde o&nbsp;investiční doporučení ani nabídku investiční
           ho nástroje. Investování nese riziko.</p>
      446    <p>Provozovatel: Clientelo Czech&nbsp;s.r.o. · <a href="ochr
           ana-osobnich-udaju.html">Zásady ochrany osobních údajů</a></p>
      447 +  <p class="demo">Ukázkové řešení do výběrového řízení.</p>   
      448  </footer>
      449  
      450  <div class="bar" id="lista" hidden>
  ⎿  Updated texty.md (+1 -0)
      298  - Data: weby správců fondů a brokerů, ověřeno 10. 10. 2026. `[
           d: meta.overeno_dne]`
      299  - Nejde o investiční doporučení ani nabídku investičního nástr
           oje. Investování nese riziko.
      300  - Provozovatel: Clientelo Czech s.r.o. · Zásady ochrany osobní
           ch údajů (odkaz na návrh)
      301 +- Nenápadně, menším písmem: Ukázkové řešení do výběrového říze
          +ní. (Spolu s `noindex` zůstane, dokud stránku Clientelo nepřev
          +ezme.)                                                        
      302  
      303  ---
      304  
  ⎿  Updated vercel.json (+4 -0)
      37          {
      38            "key": "Cross-Origin-Opener-Policy",
      39            "value": "same-origin"
      40 +        },                                                     
      41 +        {                                                      
      42 +          "key": "X-Robots-Tag",                               
      43 +          "value": "noindex"                                   
      44          }
      45        ]
      46      },

⏺ Doplním testy (meta noindex, hlavička X-Robots-Tag, poznámka v patičce) a bod
  do README „Před spuštěním kampaně“.

⏺ Bash(cd /Users/daniel/etfLanding && python3 - <<'EOF'
      def edit(p, pairs):…)
  ⎿  Updated README.md (+4 -0)
      313  - ověřit, že denní dotaz z keep-alive Supabase opravdu počítá 
           jako aktivitu (předpoklad, z dokumentace neověřený),
      314  - [nasadit podle návodu](#nasazení-na-supabase-a-vercel) a pro
           jít kontrolu po nasazení.
      315  
      316 +**Až stránku Clientelo převezme:**                            
      317 +                                                              
      318 +- odebrat `noindex`: meta tag v `public/index.html` a hlavičku
          + `X-Robots-Tag` ve `vercel.json`, a poznámku „Ukázkové řešení 
          +do výběrového řízení“ v patičce. Do té doby ji vyhledávače nei
          +ndexují (Lighthouse proto v kategorii SEO hlásí „stránka je bl
          +okovaná pro indexování“, to je záměr).                        
      319 +                                                              
      320  **Po nasazení (vývojář):**
      321  
      322  - sladit adresu v `og:image` v `public/index.html` se skutečno
           u doménou. Je tam `https://etf-dvojcata-clientelo.vercel.app/o
           g.png`, protože `etf-dvojcata.vercel.app` už používá cizí proj
           ekt. Pak odkaz zkontrolovat v [nástroji pro ladění sdílení od 
           Facebooku](https://developers.facebook.com/tools/debug/).
  ⎿  Updated scripts/test-api.mjs (+1 -0)
      267  const all = (vercel.headers.find((h) => h.source === '/(.*)') 
           || { headers: [] }).headers;
      268  const hv = (k) => (all.find((h) => h.key === k) || {}).value |
           | '';
      269  check('hlavičky: HSTS aspoň rok', /max-age=(\d+)/.test(hv('Str
           ict-Transport-Security')) && Number(hv('Strict-Transport-Secur
           ity').match(/max-age=(\d+)/)[1]) >= 31536000);
      270 +check('hlavičky: celý web noindex (X-Robots-Tag), dokud ho Cli
          +entelo nepřevezme', hv('X-Robots-Tag') === 'noindex');        
      271  check('hlavičky: nosniff, Referrer-Policy, X-Frame-Options, CO
           OP', hv('X-Content-Type-Options') === 'nosniff' && hv('Referre
           r-Policy') === 'strict-origin-when-cross-origin' && hv('X-Fram
           e-Options') === 'DENY' && hv('Cross-Origin-Opener-Policy') ===
            'same-origin');
      272  check('hlavičky: Permissions-Policy vypíná kameru, mikrofon, p
           olohu; sdílení a schránku nechává', /camera=\(\)/.test(hv('Per
           missions-Policy')) && !/web-share|clipboard/.test(hv('Permissi
           ons-Policy')));
      273  let cspOk = true;
  ⎿  Updated scripts/test-page.mjs (+5 -0)
      303      check('favicon, ikona pro iOS a obrázek pro sdílení existu
           jí', head.files.every((f) => / 200 (image|text)/.test(f)), hea
           d.files.join(' | '));
      304      check('og:image: absolutní https adresa, 1200×630', /^http
           s:\/\/[^/]+\/og\.png$/.test(head.ogImage) && head.ogSize === '
           1200×630', `${head.ogImage} ${head.ogSize}`);
      305      check('panel má aria-modal', head.modal === 'true');
      306 +    const robots = await page.$eval('meta[name=robots]', (m) =
          +> m.content).catch(() => null);                               
      307 +    const res = await page.evaluate(() => fetch('/').then((r) 
          +=> r.headers.get('x-robots-tag')));                           
      308 +    check('celá stránka noindex (meta i hlavička X-Robots-Tag)
          +', robots === 'noindex' && res === 'noindex', `${robots} | ${r
          +es}`);                                                        
      309 +    const demo = await page.$eval('footer .demo', (p) => `${p.
          +textContent}|${getComputedStyle(p).fontSize}`).catch(() => nul
          +l);                                                           
      310 +    check('patička: nenápadná poznámka „Ukázkové řešení do výb
          +ěrového řízení.“', demo === 'Ukázkové řešení do výběrového říz
          +ení.|13px', String(demo));                                    
      311      const csp = await page.evaluate(() => {
      312        const s = document.createElement('script');
      313        s.textContent = 'window.__xss = 1';

  Ran 1 shell command (ctrl+o to expand)

⏺ Background command "Start dev server with PGlite database" failed with exit
code 143

  Called plugin:context-mode:context-mode, ran 1 shell command (ctrl+o to expand)

⏺ Bod 4 je v commitu 39a015c. Teď bod 5. Nejdřív zjistím, jestli je adresa
  etf-dvojcata-demo.vercel.app volná.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Adresa etf-dvojcata-demo.vercel.app je zatím volná. Teď zjistím v dokumentaci
  Supabase, co se počítá jako aktivita, která zabrání uspání projektu na
  bezplatném plánu.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Potvrdil jsem si, že Supabase pozastaví bezplatný projekt po týdnu neaktivity,
  ale co přesně se počítá jako aktivita, tam není uvedeno. Teď proleznu celou
  dokumentaci přes soubor llms.txt se seznamem stránek.

  Called plugin:context-mode:context-mode 2 times (ctrl+o to expand)

⏺ V dokumentaci Supabase (7 MB) se nikde nedefinuje, co se počítá jako
  "aktivita" chránící projekt před pozastavením, takže cron ponechám a riziko
  zapíšu do README s doporučením zkontrolovat projekt den před odevzdáním. Teď
  doplním doménu etf-dvojcata-demo do stránky i dokumentace.

  Searched for 2 patterns, ran 1 shell command (ctrl+o to expand)

⏺ Měním adresu na etf-dvojcata-demo všude (og:image, kanonická adresa, og:url,
  README) a dopisuji riziko keep-alive.

⏺ Bash(python3 - <<'EOF'
      def edit(p, pairs):…)
  ⎿  Updated README.md (+6 -6)
      2  
      3  Řešení zadání B (konverzní landing page) do výběrového řízení na
          pozici Junior AI Developer.
      4  
      5 -- **Stránka:** TODO (URL na Vercelu)                            
      5 +- **Stránka:** [etf-dvojcata-demo.vercel.app](https://etf-dvojca
        +ta-demo.vercel.app/) (po nasazení; neoficiální ukázka, proto bez
        + jména Clientela v adrese)                                      
      6  - **Obě verze reklamy:** [reklamy/](reklamy/)
      7  - **Exporty konverzací s AI:** [ai-log/](ai-log/)
      8  
     ...
      159  **2. Vercel (web a funkce)**
      160  
      161  1. Na [vercel.com](https://vercel.com/new) → **Add New → Proje
           ct** → importuj repozitář z GitHubu.
      162 -2. **Project Name:** `etf-dvojcata-clientelo`. Adresa pak bude
          - `https://etf-dvojcata-clientelo.vercel.app` a bude sedět s `o
          -g:image` ve stránce (`etf-dvojcata` už používá cizí projekt). 
          -Když zvolíš jiný název, změň adresu v `og:image` v `public/ind
          -ex.html`.                                                     
      162 +2. **Project Name:** `etf-dvojcata-demo`. Adresa pak bude `htt
          +ps://etf-dvojcata-demo.vercel.app` a sedí s kanonickou adresou
          +, `og:url` a `og:image` ve stránce. Stránka není oficiálně Cli
          +entela, proto bez jejich jména v adrese. `etf-dvojcata` už pou
          +žívá cizí projekt, `etf-dvojcata-demo` byl 11. 10. 2026 volný.
          + Kdyby Vercel přidělil jinou adresu, změň tři řádky v hlavičce
          + `public/index.html` (hledej `etf-dvojcata-demo`).            
      163  3. **Framework Preset:** Other. Build ani výstupní složku nemě
           ň, nastavuje je [vercel.json](vercel.json): web z `public/`, f
           unkce z `api/` ve Frankfurtu (`fra1`) a denní cron na `/api/ke
           epalive`.
      164  4. **Environment Variables** (pro Production, případně i Previ
           ew):
      165     - `SUPABASE_URL`: Project URL ze Supabase,
     ...
      205  - **Secret klíč Supabase (`sb_secret_…`) jen na serveru.** Fun
           kce ho posílá v hlavičce `apikey`, jak chce [dokumentace Supab
           ase](https://supabase.com/docs/guides/api/api-keys) (nové klíč
           e nejsou JWT, do `Authorization: Bearer` nepatří). Starý klíč 
           `service_role` Supabase do konce roku 2026 ruší. Tabulky mají 
           zapnuté RLS bez jediné politiky a odebraná práva pro `anon` a 
           `authenticated`, takže publishable klíčem nejde nic přečíst an
           i zapsat.
      206  - **Lokální server se stejnými funkcemi** ([scripts/server.mjs
           ](scripts/server.mjs)): servíruje `public/` a funkce z `api/` 
           jako Vercel. Bez klíčů běží s podvrženou databází v paměti, ta
           kže formulář jde vyzkoušet i na telefonu ve stejné Wi-Fi a tes
           ty můžou ověřit, co se opravdu uložilo.
      207  - **Supabase projekt v EU regionu.** Ukládáme e-maily českých 
           návštěvníků a databáze má být blízko serverless funkcím ve Fra
           nkfurtu.
      208 -- **Denní keep-alive přes Vercel cron.** Bezplatný Supabase pr
          -ojekt se po čase bez aktivity pozastaví a formulář musí fungov
          -at, i když stránku někdo otevře až za dva týdny. Cron volá [`/
          -api/keepalive`](api/keepalive.js) jednou denně (víc bezplatný 
          -tarif Vercelu nedovolí) a ta udělá jeden malý dotaz do databáz
          -e. Funkce chce hlavičku s `CRON_SECRET`, cizí volání odmítne. 
      208 +- **Denní keep-alive přes Vercel cron.** Bezplatný Supabase pr
          +ojekt se po čase bez aktivity pozastaví a formulář musí fungov
          +at, i když stránku někdo otevře až za dva týdny. Cron volá [`/
          +api/keepalive`](api/keepalive.js) jednou denně (víc bezplatný 
          +tarif Vercelu nedovolí). Ta přes API Supabase spustí v databáz
          +i funkci `uklid`, která smaže staré záznamy limitů, takže jde 
          +o požadavek na API i o příkaz v databázi. Supabase ale nedefin
          +uje, co přesně je „aktivita“ (riziko a doporučení jsou v sekci
          + [Před spuštěním kampaně](#před-spuštěním-kampaně)). Funkce ch
          +ce hlavičku s `CRON_SECRET`, cizí volání odmítne.             
      209  - **Serverless funkce v regionu `fra1` (Frankfurt).** Kratší o
           dezva pro české návštěvníky i k databázi v EU.
      210  
      211  ## Testování: co automaticky a co jen na telefonu
     ...
      220    - jako Android: zmenší se celé okno.
      221  
      222    Kontroluje, že:
      223 -  - nad klávesnicí je vidět nadpis panelu, pole, souhlas i tla
          -čítko; na 320 px aspoň pole, souhlas a tlačítko,              
      223 +  - nad klávesnicí (s rezervou 50 px na lištu návrhů e-mailů) 
          +je vidět pole a tlačítko a souhlas začíná těsně pod nimi; na 3
          +75 a 390 px i nadpis panelu. Na 320 px se nadpis vejít nemusí,
          + přednost má pole a tlačítko,                                 
      224    - pozadí se pod panelem nepohne,
      225    - po zavření se stránka vrátí na stejné místo a fokus na tla
           čítko, které panel otevřelo,
      226    - nic nepřetéká do šířky.
     ...
      310  **Vývojář (před ostrou kampaní):**
      311  
      312  - sledovat v logu Vercelu zamítnuté pokusy (`[lead] zamítnuto:
            …`). Kdyby spam prošel přes limity, přidat CAPTCHA (například
            Cloudflare Turnstile) a s právníkem probrat, co to znamená pr
           o souhlas,
      313 -- ověřit, že denní dotaz z keep-alive Supabase opravdu počítá 
          -jako aktivitu (předpoklad, z dokumentace neověřený),          
      313 +- **riziko keep-alive:** Supabase uvádí jen, že bezplatný proj
          +ekt se pozastaví po týdnu neaktivity ([ceník](https://supabase
          +.com/pricing), stejně v celé dokumentaci). Co se jako aktivita
          + počítá, nedefinuje, takže nevím jistě, jestli denní volání z 
          +cronu stačí. **Den před odevzdáním (15. 10. 2026) otevři proje
          +kt v Supabase a zkontroluj, že neběží jako „Paused“.** Pozasta
          +vený projekt jde podle [dokumentace](https://supabase.com/docs
          +/guides/platform/upgrading) do roka obnovit jedním tlačítkem v
          + Supabase Studiu, data zůstanou,                              
      314  - [nasadit podle návodu](#nasazení-na-supabase-a-vercel) a pro
           jít kontrolu po nasazení.
      315  
      316  **Až stránku Clientelo převezme:**
     … 8 more lines (ctrl+o to expand)
  ⎿  Updated public/index.html (+4 -2)
      12  <meta property="og:type" content="website">
      13  <meta property="og:locale" content="cs_CZ">
      14  <meta property="og:site_name" content="ETF dvojčata">
      15 -<!-- og:image musí mít absolutní adresu: po nasazení ji sladit 
         -s doménou na Vercelu (README, Nasazení) -->                    
      16 -<meta property="og:image" content="https://etf-dvojcata-cliente
         -lo.vercel.app/og.png">                                         
      15 +<!-- adresa projektu na Vercelu (README, Nasazení); og:image mu
         +sí být absolutní -->                                           
      16 +<link rel="canonical" href="https://etf-dvojcata-demo.vercel.ap
         +p/">                                                           
      17 +<meta property="og:url" content="https://etf-dvojcata-demo.verc
         +el.app/">                                                      
      18 +<meta property="og:image" content="https://etf-dvojcata-demo.ve
         +rcel.app/og.png">                                              
      19  <meta property="og:image:width" content="1200">
      20  <meta property="og:image:height" content="630">
      21  <meta property="og:image:alt" content="ETF dvojčata: k americké
          mu VOO jeho evropské dvojče VUAA, u kterých brokerů ho koupíš a
           kolik stojí.">
  ⎿  Updated scripts/test-page.mjs (+2 -0)
      301      });
      302      check('color-scheme jen světlé (tmavý režim iOS nic nepřeb
           arví)', head.scheme === 'only light' && head.css.includes('onl
           y'), `${head.scheme} / ${head.css}`);
      303      check('favicon, ikona pro iOS a obrázek pro sdílení existu
           jí', head.files.every((f) => / 200 (image|text)/.test(f)), hea
           d.files.join(' | '));
      304 +    const urls = await page.evaluate(() => [document.querySele
          +ctor('link[rel=canonical]')?.href, document.querySelector('met
          +a[property="og:url"]')?.content, document.querySelector('meta[
          +property="og:image"]')?.content]);                            
      305 +    check('kanonická adresa, og:url a og:image na https://etf-
          +dvojcata-demo.vercel.app', urls[0] === 'https://etf-dvojcata-d
          +emo.vercel.app/' && urls[1] === urls[0] && urls[2] === urls[0]
          + + 'og.png', urls.join(' | '));                               
      306      check('og:image: absolutní https adresa, 1200×630', /^http
           s:\/\/[^/]+\/og\.png$/.test(head.ogImage) && head.ogSize === '
           1200×630', `${head.ogImage} ${head.ogSize}`);
      307      check('panel má aria-modal', head.modal === 'true');
      308      const robots = await page.$eval('meta[name=robots]', (m) =
           > m.content).catch(() => null);

  Called plugin:context-mode:context-mode, ran 1 shell command (ctrl+o to expand)

⏺ Bod 5 je v commitu faf7c94. Na závěr pustím všechny testy, Lighthouse na mobil
  a nové snímky. Podle ohlášeného postupu před tvrzením „hotovo“ ještě použiji
  skill na ověření.

⏺ Skill(superpowers:verification-before-completion)  ⎿  Successfully loaded skill

⏺ Pouštím celou sadu kontrol znovu a naráz: data, stránku, PDF, funkce,
  databázi, CSP, Chrome a WebKit.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Vše proběhlo úspěšně s návratovým kódem 0 – data, stránka, PDF, CSP i všechny
  testy (funkce, databáze, Chrome, WebKit) jsou v pořádku. Teď spustím
  Lighthouse pro mobil a pořídím snímky.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Lighthouse ukazuje 100 bodů za výkon, přístupnost i osvědčené postupy u všech
  tří verzí úvodu, SEO má 66 díky záměrnému noindexu, CSP/HSTS audity procházejí
  a konzole je bez chyb (LCP 1,2 s, CLS 0). Teď spočítám aktuální velikost
  stránky a projdu nové snímky.

  Read 1 file, ran 1 shell command (ctrl+o to expand)

⏺ Snímek otočeného lístku je v pořádku a JS (7,6 kB po gzipu) splňuje limit 20
  kB. Doplním README (čísla, iPhone test, snímek otáčení) a deník a pak udělám
  poslední commit.

⏺ Bash(python3 - <<'EOF'
      import re…)
  ⎿  Updated README.md (+8 -1)
      194  
      195  _TODO: stack a proč (čisté HTML/CSS/JS bez build kroku, Vercel
           , Supabase), zpracování formuláře, zabezpečení klíčů, rychlost
            načtení._
      196  
      197 -- **Celá stránka je jeden soubor `public/index.html`** s inlin
          -e CSS a JS a systémovým písmem. Bez externích skriptů a písem:
          - 58,7 kB, po gzipu 16,9 kB, z toho JS 16,7 kB (po gzipu 6,1 kB
          -). Jediný obrázek je náhled taháku (WebP, 24 kB), který se nač
          -te až u formuláře. Lighthouse (mobil, 11. 10. 2026, lokální se
          -rver bez komprese): 100 ve všech čtyřech kategoriích (výkon, p
          -řístupnost, osvědčené postupy, SEO) u všech tří verzí úvodu, L
          -CP 1,2 s, CLS 0, TBT 0 ms, celkem 82 KiB.                     
      197 +- **Celá stránka je jeden soubor `public/index.html`** s inlin
          +e CSS a JS a systémovým písmem. Bez externích skriptů a písem:
          + 62,7 kB, po gzipu 18,5 kB, z toho JS 20,6 kB (po gzipu 7,6 kB
          +). Jediný obrázek je náhled taháku (WebP, 24 kB), který se nač
          +te až u formuláře. Lighthouse (mobil, 11. 10. 2026, lokální se
          +rver bez komprese, s CSP a ostatními hlavičkami z `vercel.json
          +`): výkon, přístupnost a osvědčené postupy 100 u všech tří ver
          +zí úvodu, LCP 1,2 s, CLS 0, TBT 0 ms, celkem 88 KiB. SEO 66, p
          +rotože stránka má záměrně `noindex` (jediný neúspěšný audit je
          + „stránka je blokovaná pro indexování“).                      
      198  - **„Ručně kreslené“ prvky bez písma navíc.** Fix, šipky, krou
           žky a fajfky jsou malá inline SVG. Rukou psané písmo by přidal
           o desítky kB a probliknutí textu. Lístky se otáčejí bez 3D kon
           textu a bez `backface-visibility`: JS (Web Animations API, bez
            knihovny) otočí jednu rovinu s perspektivou o 90°, když je lí
           stek z boku, vymění strany a dotočí. WebKit to kreslí stejně s
            grafickým čipem i bez něj. Při `prefers-reduced-motion` se je
           n vymění strany.
      199  - **Ikony a obrázek pro sdílení generuje skript** ([scripts/ob
           razky.mjs](scripts/obrazky.mjs)) ve stylu stránky a s čísly z 
           `data/etf.json`: favicon (SVG a ICO), ikona pro iOS a `og.png`
            1200×630 pro náhled odkazu na Facebooku a v Messengeru. Strán
           ka si je nenačítá, takže nezdržují.
      200  - **Jen světlé barvy** (`color-scheme: only light`). Tmavý rež
           im iOS ani automatické ztmavení v Chromu stránku nepřebarví, „
           sešit“ zůstane papírový.
     ...
      278  - Safari PDF místo stažení otevřelo v prohlížeči, takže poděko
           vání „tahák se ti stahuje“ neplatilo. Teď je tam tlačítko „Ote
           vřít tahák“.
      279  - Poděkování bylo prázdné, zásady měly moc žlutých TODO, chybě
           la favicona.
      280  
      281 +**Třetí test na skutečném iPhonu, zase člověk** (Chrome na iOS
          +, tedy WebKit, 11. 10. 2026, s videem). Oprava panelu pomohla,
          + ale našly se dvě chyby, které simulace nezachytila:          
      282 +                                                              
      283 +- **Lístek se neotáčel, jen blikl:** během animace zmizel (zůs
          +tala páska) a rub nebylo vidět. Příčinu zavedla AI v předchozí
          + opravě: viditelnost líce a rubu přepínala v půlce *času* (220
          + ms), ale lístek byl kvůli křivce animace z boku už po ~50 ms.
          + Mezitím byl otočený zády se skrytým rubem a GPU v iPhonu odvr
          +ácený líc nekreslí. Původní test kontroloval jen konečný stav,
          + ne průběh. Teď se otáčí jedna rovina bez 3D kontextu, strany 
          +se vymění přesně ve chvíli, kdy je lístek z boku, a test ve We
          +bKitu kontroluje snímky po 100 ms:                            
      284 +                                                              
      285 +  <img src="docs/screenshots/webkit-otoceni-listku.png" width=
          +"640" alt="Průběh otočení lístku VTI po 100 ms: líc se zužuje,
          + ve 224 ms je lístek z boku, pak se rozšiřuje rub s dvojčetem 
          +SXR4">                                                        
      286 +- **Tlačítko pod klávesnicí:** nad klávesnici vyskočila lišta 
          +s návrhy e-mailů, zakryla souhlas a tlačítko „Získat tahák“ sk
          +ončilo pod klávesnicí. Tuhle lištu simulace nezachytila. Tlačí
          +tko je teď hned pod polem, souhlas pod ním a formulář nechává 
          +rezervu 50 px.                                                
      287 +                                                              
      288  AI navíc při kontrole na 320 px našla, že zadní strana lístku 
           se třemi brokery přetékala přes další řadu, a že headless WebK
           it nerespektuje `backface-visibility` (rub prosvítal). Obojí j
           e opravené a hlídané testem.
      289  
      290  Panel a formulář na místě s otevřenou klávesnicí ve WebKitu (s
           imulace, viz [scripts/test-webkit.mjs](scripts/test-webkit.mjs
           )):
  ⎿  Updated ai-log/denik.md (+20 -0)
      110    - Testovací adresa na skutečné doméně (seznam.cz) mohla patř
           it skutečnému člověku. Při kontrole diffu před commitem ji AI 
           nahradila adresou na vyhrazené doméně `example.com`.
      111    - Adresu `etf-dvojcata.vercel.app` AI chtěla použít pro `og:
           image`, ale kontrola ukázala, že ji už používá cizí projekt. Z
           volila volnou `etf-dvojcata-clientelo` a zapsala to do návodu.
      112    - Příčinu 404 u PDF se nepodařilo zjistit. AI to neoznačila 
           za vyřešené: zapsala, co vyloučila, a přidala diagnostiku do l
           okálního serveru.
      113 +                                                              
      114 +### 2026-10-11 – otočení lístku ve WebKitu, formulář nad lišto
          +u návrhů, bezpečnost a ochrana proti spamu                    
      115 +                                                              
      116 +- **Zadání pro AI:**                                          
      117 +  - nejdřív napsat příčinu nefunkčního otočení lístku (test čl
          +ověka na iPhonu, Chrome na iOS), pak opravit a ověřit snímky v
          + průběhu animace ve WebKitu,                                  
      118 +  - tlačítko formuláře nad klávesnici i s lištou návrhů e-mail
          +ů, odeslání modrou klávesou,                                  
      119 +  - vypsat dostupné skilly a ty na bezpečnost a review použít;
          + projít celý projekt, přidat ochranu proti spamu (rychlost ode
          +slání, limity s hashem IP, jednorázové domény, MX), bezpečnost
          +ní hlavičky, testy na všechno,                                
      120 +  - noindex a poznámka „Ukázkové řešení“ v patičce, doména etf
          +-dvojcata-demo, ověřit v dokumentaci Supabase, co je aktivita 
          +proti uspání.                                                 
      121 +- **Kontrola výstupu:**                                       
      122 +  - příčina otočení změřená ve WebKitu (úhel z matice transfor
          +mace po 100 ms), nový test kontroluje každý snímek průběhu a n
          +a staré verzi by selhal (zrcadlový nebo prázdný lístek),      
      123 +  - nová kontrola „pole a tlačítko nad lištou návrhů“ ověřená 
          +na staré verzi formuláře (selhala) i na nové (prošla),        
      124 +  - skilly `security-review` (s podúkolem podle jeho postupu) 
          +a `code-review`; jejich nálezy AI ověřila v kódu, falešný popl
          +ach (typografie) zapsala jako falešný,                        
      125 +  - SQL testované na skutečném Postgresu (PGlite) včetně výcho
          +zích práv Supabase; lokální server používá stejnou databázi a 
          +stejné hlavičky jako Vercel,                                  
      126 +  - CSP ověřená tím, že podstrčený skript se nespustí, a Light
          +house bez chyb v konzoli.                                     
      127 +- **Kde se AI spletla a jak se na to přišlo:**                
      128 +  - Otočení lístku rozbila „pojistka“, kterou AI přidala v pře
          +dchozím kroku kvůli headless WebKitu: přepínala strany podle č
          +asu, ne podle úhlu. Test kontroloval jen konečný stav, takže c
          +hybu našel až člověk na telefonu.                             
      129 +  - AI tvrdila v README, že zaokrouhlení času na hodiny zabrán
          +í spárovat kontakt s návštěvou. Review ukázal, že to nepravda 
          +(pořadová čísla, pořadí zápisu). Opraveno na náhodná UUID a tv
          +rzení přepsané na pravdivé, včetně toho, co vyřešit nejde.    
      130 +  - AI ve svém předchozím počtu uvedla 45 kontrol databáze, sk
          +utečně jich je 44. Přišlo se na to při kontrole výstupu před c
          +ommitem.                                                      
      131 +  - Klepnutí v testech míjela tlačítka, protože fokus stránku 
          +ještě plynule posouval. Šlo o chybu testu, ne stránky; test te
          +ď čeká na doběhnutí posunu.                                   
      132 +  - Review hlásil chybějící nezlomitelné mezery v textech z JS
          +. Kontrola znaků ukázala, že tam jsou (jako znak, ne `&nbsp;`)
          +, takže falešný poplach.                                      

⏺ Všechno je v commitech. Ještě zastavím svůj lokální server, aby port 8737
  zůstal volný pro tvůj test na telefonu.

  Ran 1 shell command (ctrl+o to expand)

⏺ Background command "Restart dev server with new headers" failed with exit code
143

⏺ Všech pět bodů je hotových, každý v samostatném commitu. Celkem je to 6
  commitů, které ještě nejsou na GitHubu: push udělám, až řekneš.

  Proč lístek blikal a co jsem změnil

  Příčina byla moje pojistka z minulého kola. Viditelnost líce a rubu se
  přepínala v půlce času (po 220 ms), jenže animace na začátku hodně zrychlí,
  takže lístek byl z boku už po ~50 ms. Ve WebKitu jsem naměřil, že po 100 ms je
  otočený o ~130°.

  Mezi 50 a 220 ms byl tedy lístek otočený zády, líc se pořád počítal jako
  viditelný a rub byl schovaný. iPhone odvrácenou stranu nekreslí, takže zůstala
  jen páska. Rub se ukázal až těsně před koncem, proto to vypadalo jako
  bliknutí. Test předtím kontroloval jen konečný stav, ne průběh.

  Oprava: žádný 3D kontext ani backface-visibility. Otáčí se jedna plocha: 0° →
  90° (líc), přesně v okamžiku, kdy je lístek z boku, se vymění strany, a pak
  −90° → 0° (rub s dvojčetem). Výměna je navázaná na konec první půlky animace,
  ne na čas.

  Ověření: test ve WebKitu animaci zastavuje po 100 ms a u každého snímku
  kontroluje úhel, šířku a viditelnou stranu. Lístek není nikdy zrcadlově, nikdy
  prázdný a nikdy neukazuje obě strany. Kontroluje i rychlé klepání. Průběh je
  složený do snímku docs/screenshots/webkit-otoceni-listku.png: šířka 176 → 164
  → 53 → 4 px (z boku) → 76 → 171 → 176 px.

  Co znovu otestovat na iPhonu

  Spusť HOST=0.0.0.0 ./scripts/serve.sh a otevři http://<IP Macu>:8737.

  1. Klepni na několik lístků. V půlce musí být lístek vidět z boku a pak rub s
     dvojčetem, ne bliknutí. Zkus i rychle klepat na různé lístky.
  2. Otevři panel ze spodní lišty a klepni do pole na e-mail. Tlačítko „Získat
     tahák“ musí být nad lištou s návrhy e-mailů a souhlas těsně pod ním.
  3. Zkus totéž u formuláře pod lístky a v sekci Tahák.
  4. Odešli formulář modrou klávesou „Odeslat“ bez zaškrtnutého souhlasu. Má se
     objevit hláška a fokus skočit na zaškrtávátko. Pak souhlas zaškrtni a
     odešli znovu.
  5. Odešli formulář hned po načtení stránky. Tlačítko chvíli ukazuje
     „Odesílám…“ (do 3 s od načtení) a pak se objeví poděkování.
  6. Zkus adresu test@neco.invalid (hláška o překlepu) a x@mailinator.com
     (jednorázové adresy nebereme).

  Výsledek bezpečnostní kontroly

  Spustil jsem security-review a code-review a kontroloval i sám. Podrobnosti a
  závažnost každého nálezu jsou v README v sekci „Bezpečnost a ochrana proti
  spamu“.

  - Zranitelnost, kterou by mohl zneužít útočník zvenčí, review nenašel. XSS,
    CORS, únik klíčů, RLS i lokální server jsou bez nálezu.
  - Opravené nálezy:
    - spam přes API (střední),
    - zahlcení měření a ukládání libovolných dat (střední),
    - kontrolu skrytého pole v prohlížeči, která tiše zahazovala kontakty,
    - chybějící bezpečnostní hlavičky,
    - výchozí práva Supabase pro anonymní roli,
    - drobnosti: e-maily s ne-ASCII znaky, kopie formuláře se zablokovaným
      tlačítkem, ?v=constructor, /__dev/db dostupný z Wi-Fi.
  - Ochrana formuláře teď stojí na serveru:
    - token: kontakt odeslaný dřív než 3 s po vydání se potichu zahodí,
    - limit 10 kontaktů za hodinu z jedné IP (v databázi je jen HMAC z IP s
      tajnou solí, ne samotná IP),
    - 9 222 jednorázových domén,
    - kontrola MX záznamu,
    - přísnější formát e-mailu,
    - opakovaný e-mail se neuloží znovu, ale tahák se ukáže.
  - Měření: detail události bere jen hodnoty z pevného seznamu pro danou
    událost. Limit je 600 událostí za hodinu z jedné IP a 100 na jednu návštěvu.
  - Hlavičky: CSP s hashi obou vložených skriptů (test ověřuje, že podstrčený
    skript se nespustí), HSTS, Permissions-Policy, COOP. Stránku ani Lighthouse
    to nerozbilo.
  - Opravil jsem svou chybu: v README jsem tvrdil, že kontakt nejde spárovat s
    návštěvou. Šlo to podle pořadových čísel řádků, ta jsou teď nahrazená
    náhodnými ID. Při malém provozu ale párování podle hodiny zápisu úplně
    vyloučit nejde (a databáze si pořadí zápisu pamatuje sama). Spolehlivě by
    pomohlo jen neposílat ID návštěvy u událostí kolem odeslání, což mění
    měření. To je rozhodnutí pro tebe a právníka.
  - Double opt-in je v README jako doporučení: konverze stránky se nezmění,
    klesne jen podíl kontaktů, kterým se smí psát.

  Testy a Lighthouse

  ┌────────────────────────────────────────────┬───────────┐
  │                  Kontrola                  │ Výsledek  │
  ├────────────────────────────────────────────┼───────────┤
  │ Funkce v api/ s podvrženou databází        │ 108/108   │
  ├────────────────────────────────────────────┼───────────┤
  │ schema.sql na skutečném Postgresu (PGlite) │ 44/44     │
  ├────────────────────────────────────────────┼───────────┤
  │ Chrome                                     │ 121/121   │
  ├────────────────────────────────────────────┼───────────┤
  │ WebKit                                     │ 81/81     │
  ├────────────────────────────────────────────┼───────────┤
  │ Data, stránka, PDF, CSP                    │ v pořádku │
  └────────────────────────────────────────────┴───────────┘

  Lighthouse na mobilu (všechny tři verze úvodu): výkon, přístupnost i osvědčené
  postupy 100, LCP 1,2 s, CLS 0. SEO je 66 jen kvůli noindex, který jsi chtěl.
  JS má 20,6 kB, přenáší se 7,6 kB.

  Co je potřeba od tebe

  - Na Vercelu přibyla čtvrtá proměnná ANTISPAM_SECRET (openssl rand -hex 32).
    Návod v README ji už obsahuje.
  - Keep-alive: Supabase píše jen, že bezplatný projekt se pozastaví po týdnu
    neaktivity, co je „aktivita“, nikde nedefinuje. Cron denně volá API a v
    databázi spustí úklid, ale jistotu nemám. 15. 10. zkontroluj, že projekt
    neběží jako „Paused“. Obnova jde do roka jedním tlačítkem.
  - Adresa etf-dvojcata-demo.vercel.app byla dnes volná. Je teď v kanonické
    adrese, og:url a og:image. Po nasazení ověř, že ji Vercel opravdu přidělil.
  - Kvůli skillu security-review jsem lokálně nastavil odkaz origin/HEAD na
    main. Nic se tím neodeslalo.

⏺ Všech pět bodů je hotových, každý v samostatném commitu. Celkem je to 6
  commitů, které ještě nejsou na GitHubu: push udělám, až řekneš.

  Proč lístek blikal a co jsem změnil

  Příčina byla moje pojistka z minulého kola. Viditelnost líce a rubu se
  přepínala v půlce času (po 220 ms), jenže animace na začátku hodně zrychlí,
  takže lístek byl z boku už po ~50 ms. Ve WebKitu jsem naměřil, že po 100 ms je
  otočený o ~130°.

  Mezi 50 a 220 ms byl tedy lístek otočený zády, líc se pořád počítal jako
  viditelný a rub byl schovaný. iPhone odvrácenou stranu nekreslí, takže zůstala
  jen páska. Rub se ukázal až těsně před koncem, proto to vypadalo jako
  bliknutí. Test předtím kontroloval jen konečný stav, ne průběh.

  Oprava: žádný 3D kontext ani backface-visibility. Otáčí se jedna plocha: 0° →
  90° (líc), přesně v okamžiku, kdy je lístek z boku, se vymění strany, a pak
  −90° → 0° (rub s dvojčetem). Výměna je navázaná na konec první půlky animace,
  ne na čas.

  Ověření: test ve WebKitu animaci zastavuje po 100 ms a u každého snímku
  kontroluje úhel, šířku a viditelnou stranu. Lístek není nikdy zrcadlově, nikdy
  prázdný a nikdy neukazuje obě strany. Kontroluje i rychlé klepání. Průběh je
  složený do snímku docs/screenshots/webkit-otoceni-listku.png: šířka 176 → 164
  → 53 → 4 px (z boku) → 76 → 171 → 176 px.

  Co znovu otestovat na iPhonu

  Spusť HOST=0.0.0.0 ./scripts/serve.sh a otevři http://<IP Macu>:8737.

  1. Klepni na několik lístků. V půlce musí být lístek vidět z boku a pak rub s
     dvojčetem, ne bliknutí. Zkus i rychle klepat na různé lístky.
  2. Otevři panel ze spodní lišty a klepni do pole na e-mail. Tlačítko „Získat
     tahák“ musí být nad lištou s návrhy e-mailů a souhlas těsně pod ním.
  3. Zkus totéž u formuláře pod lístky a v sekci Tahák.
  4. Odešli formulář modrou klávesou „Odeslat“ bez zaškrtnutého souhlasu. Má se
     objevit hláška a fokus skočit na zaškrtávátko. Pak souhlas zaškrtni a
     odešli znovu.
  5. Odešli formulář hned po načtení stránky. Tlačítko chvíli ukazuje
     „Odesílám…“ (do 3 s od načtení) a pak se objeví poděkování.
  6. Zkus adresu test@neco.invalid (hláška o překlepu) a x@mailinator.com
     (jednorázové adresy nebereme).

  Výsledek bezpečnostní kontroly

  Spustil jsem security-review a code-review a kontroloval i sám. Podrobnosti a
  závažnost každého nálezu jsou v README v sekci „Bezpečnost a ochrana proti
  spamu“.

  - Zranitelnost, kterou by mohl zneužít útočník zvenčí, review nenašel. XSS,
    CORS, únik klíčů, RLS i lokální server jsou bez nálezu.
  - Opravené nálezy:
    - spam přes API (střední),
    - zahlcení měření a ukládání libovolných dat (střední),
    - kontrolu skrytého pole v prohlížeči, která tiše zahazovala kontakty,
    - chybějící bezpečnostní hlavičky,
    - výchozí práva Supabase pro anonymní roli,
    - drobnosti: e-maily s ne-ASCII znaky, kopie formuláře se zablokovaným
      tlačítkem, ?v=constructor, /__dev/db dostupný z Wi-Fi.
  - Ochrana formuláře teď stojí na serveru:
    - token: kontakt odeslaný dřív než 3 s po vydání se potichu zahodí,
    - limit 10 kontaktů za hodinu z jedné IP (v databázi je jen HMAC z IP s
      tajnou solí, ne samotná IP),
    - 9 222 jednorázových domén,
    - kontrola MX záznamu,
    - přísnější formát e-mailu,
    - opakovaný e-mail se neuloží znovu, ale tahák se ukáže.
  - Měření: detail události bere jen hodnoty z pevného seznamu pro danou
    událost. Limit je 600 událostí za hodinu z jedné IP a 100 na jednu návštěvu.
  - Hlavičky: CSP s hashi obou vložených skriptů (test ověřuje, že podstrčený
    skript se nespustí), HSTS, Permissions-Policy, COOP. Stránku ani Lighthouse
    to nerozbilo.
  - Opravil jsem svou chybu: v README jsem tvrdil, že kontakt nejde spárovat s
    návštěvou. Šlo to podle pořadových čísel řádků, ta jsou teď nahrazená
    náhodnými ID. Při malém provozu ale párování podle hodiny zápisu úplně
    vyloučit nejde (a databáze si pořadí zápisu pamatuje sama). Spolehlivě by
    pomohlo jen neposílat ID návštěvy u událostí kolem odeslání, což mění
    měření. To je rozhodnutí pro tebe a právníka.
  - Double opt-in je v README jako doporučení: konverze stránky se nezmění,
    klesne jen podíl kontaktů, kterým se smí psát.

  Testy a Lighthouse

  ┌────────────────────────────────────────────┬───────────┐
  │                  Kontrola                  │ Výsledek  │
  ├────────────────────────────────────────────┼───────────┤
  │ Funkce v api/ s podvrženou databází        │ 108/108   │
  ├────────────────────────────────────────────┼───────────┤
  │ schema.sql na skutečném Postgresu (PGlite) │ 44/44     │
  ├────────────────────────────────────────────┼───────────┤
  │ Chrome                                     │ 121/121   │
  ├────────────────────────────────────────────┼───────────┤
  │ WebKit                                     │ 81/81     │
  ├────────────────────────────────────────────┼───────────┤
  │ Data, stránka, PDF, CSP                    │ v pořádku │
  └────────────────────────────────────────────┴───────────┘

  Lighthouse na mobilu (všechny tři verze úvodu): výkon, přístupnost i osvědčené
  postupy 100, LCP 1,2 s, CLS 0. SEO je 66 jen kvůli noindex, který jsi chtěl.
  JS má 20,6 kB, přenáší se 7,6 kB.

  Co je potřeba od tebe

  - Na Vercelu přibyla čtvrtá proměnná ANTISPAM_SECRET (openssl rand -hex 32).
    Návod v README ji už obsahuje.
  - Keep-alive: Supabase píše jen, že bezplatný projekt se pozastaví po týdnu
    neaktivity, co je „aktivita“, nikde nedefinuje. Cron denně volá API a v
    databázi spustí úklid, ale jistotu nemám. 15. 10. zkontroluj, že projekt
    neběží jako „Paused“. Obnova jde do roka jedním tlačítkem.
  - Adresa etf-dvojcata-demo.vercel.app byla dnes volná. Je teď v kanonické
    adrese, og:url a og:image. Po nasazení ověř, že ji Vercel opravdu přidělil.
  - Kvůli skillu security-review jsem lokálně nastavil odkaz origin/HEAD na
    main. Nic se tím neodeslalo.

❯ /compact
  ⎿  Compacted PreCompact [node "${CLAUDE_PLUGIN_ROOT}/hooks/precompact.mjs"]
     completed successfully: {}
  ⎿  Referenced file scripts/test-api.mjs
  ⎿  Read vercel.json (76 lines)
  ⎿  Read scripts/csp.mjs (47 lines)
  ⎿  Read scripts/server.mjs (150 lines)
  ⎿  Read scripts/test-db.mjs (110 lines)
  ⎿  Skills restored (superpowers:verification-before-completion,
     security-review, anthropic-skills:mobile-native)

❯ Na iPhonu jsem prošel všech šest kroků z tvého reportu a všechno funguje:
  lístky se otáčí, tlačítko je vidět nad lištou s návrhy e-mailů, souhlas,
  rychlé odeslání i obě testovací adresy dělají, co mají. Díky, hlavně za to,
  že jsi blikání lístku doložil měřením a ne odhadem.

  Teď to chci dotáhnout tak, aby to bylo kompletní a dalo se nasadit. Push
  zatím nedělej, až na konci.

  A) TECHNICKÉ ÚPRAVY

  1) JS má 20,6 kB, ale v CLAUDE.md máme limit 20 kB. Dostaň ho pod limit bez
  ztráty funkcí. Kdyby to rozumně nešlo, napiš do README poctivě proč, ale
  radši ať to projde.

  2) Limit 10 kontaktů za hodinu z jedné IP je na mobilní reklamu přísný. Čeští
  operátoři pouštějí hodně lidí přes sdílenou IP (CGNAT), takže bychom při
  kampani odmítali skutečné lidi. Zvedni ho na 30 za hodinu a důvod napiš do
  README k bezpečnosti.

  3) Ověř, že kontrola MX záznamu při chybě nebo timeoutu DNS kontakt přijme
  (fail-open) a že timeout je krátký, aby odeslání nezdržoval. Přidej na to
  test.

  4) Párování kontaktu s návštěvou jsem rozhodl takhle: událost odeslání
  formuláře posílej bez ID návštěvy, variantu reklamy ulož přímo ke kontaktu a
  čas u událostí zaokrouhli na minuty. Uprav funnel.sql tak, aby odeslání
  počítal podle varianty z tabulky kontaktů. V README i na stránce o ochraně
  údajů to popiš pravdivě: netvrď, že párování je nemožné, ale napiš, co jsme
  udělali, aby prakticky nešlo.

  5) Zkontroluj, že u lístků (ne až v patičce) je vidět zdroj dat, datum, ke
  kterému data platí, a krátké „Není to investiční doporučení“. Hravý design
  nesmí ubrat na důvěryhodnosti. Pokud to tam je, nic neměň.

  B) README PRO HODNOTITELE

  README bude číst někdo z Clientela, kdo má na to pár minut. Uprav ho tak, aby
  to, co je nejdůležitější, bylo nahoře:

  6) Úplně nahoru dej krátké shrnutí (max. 6 řádků):
     - odkaz na živou stránku (https://etf-dvojcata-demo.vercel.app) a odkazy
  na obě reklamní varianty (?v=dvojce, ?v=zacatek),
     - myšlenku v jedné větě,
     - očekávanou konverzi,
     - co chybí do ostrého spuštění.
     Pod to dej sekci „Jak to vyzkoušet za 2 minuty“: co otevřít na mobilu, co
  zkusit a kde je vidět funnel.

  7) Očekávaná konverze: uveď rozsah a ukaž výpočet krok po kroku pro každý
  krok funnelu (příchod → otočení lístku → otevření formuláře → odeslání).
  Všechny předpoklady jasně označ jako odhad. Pokud cituješ nějaký benchmark,
  musí mít skutečný zdroj s odkazem, jinak napiš, že je to vlastní odhad a z
  čeho vychází. Nic si nevymýšlej.

  8) Přidej krátký obchodní pohled: k čemu je kontakt pro Clientelo nebo jeho
  klienta, orientační cena za kontakt (CPC a konverze jako označené
  předpoklady, výpočet ukázaný) a proč chceme jen e-mail a nic dalšího.

  9) Tři A/B hypotézy seřazené podle očekávaného dopadu. Každá má: hypotézu, co
  přesně měníme, metriku, minimální počet návštěv k rozhodnutí (orientační
  výpočet) a proč je na tomhle místě v pořadí.

  10) Sekce o práci s AI: doplň, že jsem kromě Claude Code používal samostatný
  plánovací chat (claude.ai), ve kterém jsem si připravoval a ladil zadání pro
  tebe, a že jsem výstupy kontroloval testy, na skutečném iPhonu a proti
  zadání. Doplň konkrétní příklady, kde AI chybovala a jak se to odhalilo,
  věcně a bez omlouvání:
     - absolutní tvrzení „Americké ti broker nenabídne“, které jsem nechal
  opravit na „často“,
     - pojistka u lístku přepínala strany podle času místo podle úhlu, takže
  lístek na iPhonu blikal, a test kontroloval jen konečný stav,
     - kontrola skrytého pole v prohlížeči tiše zahazovala skutečné kontakty,
     - tvrzení v README, že kontakt nejde spárovat s návštěvou, které nebylo
  pravda,
     - chyby na iPhonu (klávesnice, lišta s návrhy), které simulace neodhalila
  a našly se až na skutečném telefonu.

  11) Projdi celé README očima hodnotitele: odstraň opakování, zastaralé údaje
  po dnešních změnách a zbylé TODO (kromě vědomých, která jsou v „Před
  spuštěním kampaně“). Zkontroluj, že každé číslo v README odpovídá kódu a
  testům. Česky přirozeně, tykání bez rodu, žádný marketingový balast.

  C) FINÁLNÍ KONTROLA REPOZITÁŘE

  12) Ověř, že v celé historii gitu nejsou žádné klíče, tajemství, soubor .env
  ani ZADANI.md, a že v ai-log nejsou žádné osobní e-maily kromě mého.

  13) Aktualizuj ai-log/denik.md o dnešní práci.

  14) Napiš mi checklist nasazení krok po kroku (Supabase v EU Frankfurt,
  spuštění schema.sql, Vercel projekt etf-dvojcata-demo, všechny čtyři
  proměnné, co po nasazení ověřit na živé adrese). Klíče mi nikam nepiš,
  vygeneruju si je sám.

  Commit po každém bodu. Na konci pusť všechny testy a Lighthouse, udělej push
  a napiš mi krátký report: co se změnilo, výsledky testů a checklist nasazení.

  Read 1 file, listed 1 directory, called plugin:context-mode:context-mode, ran 1 shell command (ctrl+o to expand)

⏺ Pracuju na bodu A1: měřím JavaScript. Oba skripty mají dohromady 21 229 B,
  takže je potřeba ubrat zhruba 1,3 kB. Teď procházím hlavní skript.

  Read 1 file, called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Update(public/index.html)
  ⎿  Added 6 lines, removed 9 lines
      487    var doc = document;
      488    var qs = new URLSearchParams(location.search);
      489    var variant = ['dvojce', 'zacatek'].indexOf(qs.get('v')) >= 
           0 ? qs.get('v') : 'vychozi';
      490 -  /* ID návštěvy: náhodné UUID jen v paměti tohoto načtení str
          -ánky (nic se neukládá do prohlížeče).                         
      491 -     crypto.randomUUID funguje jen přes https, proto náhrada p
          -řes getRandomValues (třeba telefon v lokální síti). */        
      490 +  // ID návštěvy jen v paměti tohoto načtení; randomUUID chybí
          + na http (telefon v lokální síti)                             
      491    function uuid() {
      493 -    if (window.crypto && crypto.randomUUID) return crypto.rand
          -omUUID();                                                     
      492 +    if (crypto.randomUUID) return crypto.randomUUID();        
      493      var b = crypto.getRandomValues(new Uint8Array(16));
      495 -    b[6] = (b[6] & 15) | 64;                                  
      496 -    b[8] = (b[8] & 63) | 128;                                 
      497 -    var h = [].map.call(b, function (x) { return (x + 256).toS
          -tring(16).slice(1); }).join('');                              
      498 -    return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slic
          -e(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20);        
      494 +    b[6] = b[6] & 15 | 64;                                    
      495 +    b[8] = b[8] & 63 | 128;                                   
      496 +    return [].map.call(b, function (x, i) { return (i > 3 && i
          + < 11 && i % 2 == 0 ? '-' : '') + (x + 256).toString(16).slice
          +(1); }).join('');                                             
      497    }
      498    var visitId = uuid();
      499  
      502 -  /* Měření: anonymní událost na /api/event (sendBeacon, strán
          -ku nezdrží). Detail je krátký text bez „@“,                   
      503 -     server jiné odmítne. ID návštěvy se nikdy neposílá s e-ma
          -ilem. */                                                      
      500 +  // Měření: anonymní událost (sendBeacon stránku nezdrží), ni
          +kdy s e-mailem                                                
      501    function track(name, detail) {
      502      var e = { navsteva: visitId, udalost: name, varianta: vari
           ant };
      503      detail = String(detail == null ? '' : detail).replace(/[^A
           -Za-z0-9_:.-]/g, '').slice(0, 40);

⏺ Update(public/index.html)
  ⎿  Added 1 line, removed 3 lines
      507      if (window.fetch) fetch('/api/event', { method: 'POST', bo
           dy: body, keepalive: true, headers: { 'Content-Type': 'text/pl
           ain' } }).catch(function () {});
      508    }
      509  
      510 -  /* Token proti botům: podepsaný čas vydání ze /api/token, st
          -ránka si ho vezme hned po načtení.                            
      511 -     Server odmítne kontakt bez tokenu a potichu zahodí odesla
          -ný dřív než 3 s po vydání (to stihne jen bot).                
      512 -     Kdo je rychlejší, chvíli počká na „Odesílám…“, o kontakt 
          -nepřijde. */                                                  
      510 +  // Token proti botům: server zahodí kontakt do 3 s od vydání
          +, rychlejší člověk počká na „Odesílám…“                       
      511    var MIN_FORM_MS = 3200;
      512    var token = null;
      513    var tokenAt = 0;

⏺ Update(public/index.html)
  ⎿  Added 2 lines, removed 3 lines
      531    window.addEventListener('load', function () { setTimeout(fun
           ction () { getToken().catch(function () {}); }, 0); });
      532    function wait(ms) { return new Promise(function (resolve) { 
           setTimeout(resolve, Math.max(0, ms)); }); }
      533  
      534 -  /* Odeslání kontaktu na /api/lead: jen e-mail, souhlas, verz
          -e úvodu, token a skryté pole, záměrně bez ID návštěvy.        
      535 -     Při chybě vrátí { chyba }: email / souhlas / mx / jednora
          -zovy / limit od serveru, jinak sit nebo server. */            
      534 +  // Kontakt záměrně bez ID návštěvy; chyba je { chyba: kód ze
          + serveru | sit | server }                                     
      535    function submitLead(lead, retried) {
      536      return getToken(retried).then(function () { return wait(MI
           N_FORM_MS - (Date.now() - tokenAt)); }).then(function () { ret
           urn postLead(lead); })
      537        .catch(function (err) {
      539 -        // propadlý token (stránka otevřená přes den): jednou 
          -vzít nový a zkusit znovu                                      
      538 +        // propadlý token (stránka otevřená přes den): jednou 
          +nový                                                          
      539          if (err && err.chyba === 'token' && !retried) return s
           ubmitLead(lead, true);
      540          throw err;
      541        });

⏺ Update(public/index.html)
  ⎿  Removed 1 line
      557  
      558    track('prichod', qs.get('ref') === 'sdileni' ? 'sdileni' : q
           s.get('utm_source'));
      559  
      560 -  /* Hloubka scrollu: 25, 50, 75 a 100 %, každá jednou. */    
      560    var marks = [25, 50, 75, 100];
      561    var ticking = false;
      562    function onScroll() {

⏺ Update(public/index.html)  ⎿  Added 1 line, removed 1 line
      571    }
      572    window.addEventListener('scroll', onScroll, { passive: true 
           });
      573  
      574 -  /* Spodní lišta: až když jsou lístky mimo obrazovku (nepřekr
          -ývá je) a není vidět výzva ani formulář. */                   
      574 +  // Spodní lišta: až jsou lístky pryč a není vidět výzva ani 
          +formulář                                                      
      575    var bar = doc.getElementById('lista');
      576    var dialog = doc.getElementById('panel');
      577    var heroOut = false;

⏺ Update(public/index.html)
  ⎿  Removed 1 line
      594      io.observe(doc.getElementById('tahak'));
      595    }
      596  
      597 -  /* Lístky: klepnutí otočí lístek (otočený je vždy jen jeden)
          -, pod nimi se ukáže výzva a podrobnosti. */                   
      597    var picker = doc.querySelector('.listky');
      598    var listky = picker.querySelectorAll('.listek[data-etf]');
      599    var cta = doc.getElementById('vyber-cta');

⏺ Update(public/index.html)
  ⎿  Added 1 line, removed 3 lines
      601    var twins = result.querySelectorAll('.twin');
      602    picker.classList.add('peek');
      603  
      604 -  /* Otočení: jedna rovina s perspektivou 0 → 90° (je vidět st
          -rana, ze které se otáčí). Když je lístek přesně               
      605 -     z boku (konec první půlky), vymění se strany a lístek dot
          -očí −90 → 0°. Strany se mění podle konce animace,             
      606 -     ne podle času, takže se nemůžou rozejít. Při prefers-redu
          -ced-motion se jen vymění strany. */                           
      604 +  // Otočení jedné roviny 0 → 90°, z boku (konec animace, ne č
          +as) výměna stran, pak −90 → 0°                                
      605    var FLIP_MS = 450;
      606    var reduceMotion = window.matchMedia('(prefers-reduced-motio
           n: reduce)');
      607    function turn(card, back) {

⏺ Update(public/index.html)
  ⎿  Added 1 line, removed 1 line
      644      card.addEventListener('keydown', function (e) { if (e.key 
           === ' ') { e.preventDefault(); flip(card); } });
      645    });
      646  
      647 -  /* Formuláře: jeden vzor v sekci Tahák, kopie se otevírají n
          -a místě (pod lístky, v panelu). */                            
      647 +  // Formuláře: vzor v sekci Tahák, kopie na místě (pod lístky
          +, v panelu)                                                   
      648    var MSG = {
      649      prazdny: 'Napiš svůj e-mail.',
      650      neplatny: 'Tenhle e-mail nevypadá správně. Zkontroluj ho.'
           ,

⏺ Update(public/index.html)
  ⎿  Added 1 line, removed 1 line
      655      jednorazovy: 'Jednorázové e-mailové adresy nebereme. Napiš
            prosím svůj běžný e-mail.',
      656      limit: 'Z tohohle připojení přišlo moc pokusů za sebou. Zk
           us to prosím za hodinu.'
      657    };
      658 -  // stejné pravidlo jako na serveru (api/_lib.js): jen ASCII,
          - platná doména                                                
      658 +  // stejné pravidlo jako api/_lib.js                         
      659    var EMAIL = /^(?![.+=-])[A-Za-z0-9._%+-]{1,64}@(?=.{4,253}$)
           (?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+(?:[A-Za-z
           ]{2,24}|xn--[A-Za-z0-9-]{2,59})$/;
      660    function validEmail(e) { return EMAIL.test(e) && e.indexOf('
           ..') < 0 && !/\.@/.test(e); }
      661    var tpl = doc.querySelector('[data-slot="sekce"] .lead-form'
           );

⏺ Update(public/index.html)
  ⎿  Added 1 line, removed 1 line
      659    var EMAIL = /^(?![.+=-])[A-Za-z0-9._%+-]{1,64}@(?=.{4,253}$)
           (?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+(?:[A-Za-z
           ]{2,24}|xn--[A-Za-z0-9-]{2,59})$/;
      660    function validEmail(e) { return EMAIL.test(e) && e.indexOf('
           ..') < 0 && !/\.@/.test(e); }
      661    var tpl = doc.querySelector('[data-slot="sekce"] .lead-form'
           );
      662 -  var pristine = tpl.cloneNode(true); // čistá kopie pro formu
          -láře na místě (ne rozpracovaný stav sekce)                    
      662 +  var pristine = tpl.cloneNode(true); // kopie bez rozpracovan
          +ého stavu sekce                                               
      663  
      664    function showError(form, type) {
      665      var p = form.querySelector('.form-error');

⏺ Update(public/index.html)
  ⎿  Added 1 line, removed 1 line
      687        var err = !email ? 'prazdny' : !validEmail(email) ? 'nep
           latny' : !consent ? 'souhlas' : navigator.onLine === false ? '
           offline' : '';
      688        if (err) return showError(form, err);
      689        form.querySelector('.form-error').hidden = true;
      690 -      // skryté pole proti botům posíláme serveru, rozhodne on
          - (v prohlížeči by vyplnění automatem tiše zahodilo kontakt)   
      690 +      // skryté pole posíláme, rozhodne server (automatické vy
          +plnění by tu tiše zahodilo kontakt)                           
      691        var btn = form.querySelector('[type=submit]');
      692        var label = btn.textContent;
      693        btn.disabled = true;

⏺ Update(public/index.html)
  ⎿  Added 2 lines, removed 5 lines
      728      form.elements.email.focus();
      729    });
      730  
      731 -  /* Klávesnice na iPhonu: iOS nezmenší layout viewport, jen v
          -isual viewport. Pevně umístěný panel                          
      732 -     by zůstal pod klávesnicí a iOS by kvůli poli posouval str
          -ánku i panel. Proto:                                          
      733 -     - pozadí zamkneme přes position: fixed (dokument pak nejd
          -e posunout) a po zavření vrátíme pozici,                      
      734 -     - spodek panelu posadíme na horní hranu klávesnice a výšk
          -u omezíme na viditelnou část,                                 
      735 -     - po otevření klávesnice posuneme panel nebo stránku tak,
          - aby bylo vidět pole i tlačítko. */                           
      731 +  /* Klávesnice na iPhonu zmenší jen visualViewport: pozadí za
          +mkneme (position: fixed), panel posadíme                      
      732 +     na klávesnici a posuneme panel nebo stránku, aby bylo vid
          +ět pole i tlačítko. */                                        
      733    var vv = window.visualViewport;
      734    var coarse = window.matchMedia('(pointer: coarse)').matches;
      735    var baseH = vv ? vv.height : window.innerHeight;

⏺ Update(public/index.html)
  ⎿  Added 1 line, removed 3 lines
      764      s.marginBottom = Math.max(0, window.innerHeight - vv.heigh
           t - vv.offsetTop) + 'px';
      765      s.maxHeight = Math.round(kb ? vv.height - 8 : vv.height * 
           0.92) + 'px';
      766    }
      767 -  /* Nad klávesnicí musí být vidět pole a tlačítko (je hned po
          -d polem), a to s rezervou na lištu s návrhy                   
      768 -     e-mailů: iOS ji do visualViewport nemusí započítat. Souhl
          -as může být těsně pod nimi. Když se nevejde                   
      769 -     ani pole s tlačítkem, má přednost pole. */               
      767 +  // Pole a tlačítko nad klávesnicí s rezervou na lištu návrhů
          + e-mailů (iOS ji do visualViewport nepočítá); přednost má pole
      768    var SUGGEST_BAR = 50;
      769    function keepFormVisible() {
      770      var a = doc.activeElement;

⏺ Update(public/index.html)
  ⎿  Added 1 line, removed 1 line
      814      fitSheet();
      815      updateBar();
      816      track('formular_otevren', zdroj);
      817 -    // Na dotykovém displeji fokus na nadpis: klávesnice nevys
          -kočí během animace panelu. S myší rovnou do pole.             
      817 +    // na dotyku fokus na nadpis, ať klávesnice nevyskočí běhe
          +m animace panelu                                              
      818      (coarse ? dialog.querySelector('h2') || form.elements.emai
           l : form.elements.email).focus({ preventScroll: true });
      819    }
      820    doc.querySelectorAll('[data-otevri="lista"], [data-otevri="k
           arty"]').forEach(function (el) {

⏺ Update(public/index.html)
  ⎿  Added 1 line, removed 1 line
      820    doc.querySelectorAll('[data-otevri="lista"], [data-otevri="k
           arty"]').forEach(function (el) {
      821      el.addEventListener('click', function (e) { e.preventDefau
           lt(); openSheet(el.getAttribute('data-otevri'), el); });
      822    });
      823 -  // Tab v panelu dokola: z posledního prvku na první (a se Sh
          -iftem obráceně), fokus neuteče do prohlížeče                  
      823 +  // Tab v panelu dokola, fokus neuteče do prohlížeče         
      824    dialog.addEventListener('keydown', function (e) {
      825      if (e.key !== 'Tab') return;
      826      var f = [].filter.call(dialog.querySelectorAll('button, a[
           href], input:not([tabindex="-1"])'), function (el) { return !e
           l.disabled && el.getClientRects().length; });

⏺ Update(public/index.html)
  ⎿  Added 1 line, removed 2 lines
      840      opener = null;
      841    });
      842  
      843 -  /* Po odeslání: poděkování nahradí celý blok s formulářem. P
          -DF se nestahuje samo: Safari na iPhonu                        
      844 -     atribut download zpracuje jinak než Chrome, tak má každý 
          -stejné tlačítko „Otevřít tahák“. */                           
      843 +  // Poděkování nahradí všechny formuláře; PDF se otevírá tlač
          +ítkem (download Safari zpracuje jinak)                        
      844    function finish(submitted) {
      845      if (done) return;
      846      done = true;

⏺ Update(public/index.html)
  ⎿  Added 1 line, removed 1 line
      860      if (focusTarget) focusTarget.focus();
      861    }
      862  
      863 -  /* Sdílení: nativní nabídka telefonu, jinak zkopírovat odkaz
          -. Každé sdílení je další možný kontakt, proto ho měříme. */   
      863 +  // Sdílení: nativní nabídka, jinak kopie odkazu             
      864    var SHARE_URL = location.origin + location.pathname + '?ref=
           sdileni';
      865    function share(status) {
      866      if (navigator.share) {

⏺ Update(public/index.html)
  ⎿  Added 1 line, removed 1 line
      880        track('sdileni', 'kopie');
      881      }
      882      function manual() {
      883 -      // bez schránky (např. stránka přes http v lokální síti)
          -: odkaz k ručnímu zkopírování                                 
      883 +      // bez schránky (http v lokální síti): odkaz k ručnímu z
          +kopírování                                                    
      884        var input = status.parentNode.querySelector('.share-url'
           ) || doc.createElement('input');
      885        input.className = 'share-url';
      886        input.readOnly = true;

  Called plugin:context-mode:context-mode, ran 1 shell command (ctrl+o to expand)

⏺ JavaScript je teď 19 178 B (limit 20 000 B): zkrátil jsem komentáře a
  zjednodušil záložní UUID. Přidávám do testu kontrolu velikosti a otestování té
  záložní cesty.

  Searched for 1 pattern, read 1 file (ctrl+o to expand)

⏺ Update(scripts/test-page.mjs)
  ⎿  Added 11 lines
      45  try {
      46    await devDb('?smazat=1&vypadek=0');
      47  
      48 +  // 0) JS do 20 kB (limit z CLAUDE.md, všechny vložené skripty
         +) a ID návštěvy i bez crypto.randomUUID (http v lokální síti)  
      49 +  {                                                            
      50 +    const html = await fetch(BASE).then((r) => r.text());      
      51 +    const js = [...html.matchAll(/<script>([\s\S]*?)<\/script>/
         +g)].reduce((n, m) => n + Buffer.byteLength(m[1]), 0);          
      52 +    check('JavaScript na stránce do 20 000 B', js <= 20000, `${
         +js} B`);                                                       
      53 +    const { page, logs } = await open('', () => { delete Crypto
         +.prototype.randomUUID; });                                     
      54 +    const ev = logs.find((l) => l.type === 'event' && l.data &&
         + l.data.udalost === 'prichod');                                
      55 +    check('ID návštěvy bez crypto.randomUUID: UUID v4, server h
         +o přijme', !!ev && ev.status === 204 && /^[0-9a-f]{8}-[0-9a-f]{
         +4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(ev.data.n
         +avsteva), ev && `${ev.status} ${ev.data.navsteva}`);           
      56 +    await page.close();                                        
      57 +  }                                                            
      58 +                                                               
      59    // 1) Varianty úvodu
      60    const H1 = {
      61      '': 'Najdi evropské dvojče k VOO, VT a dalším ETF z USA',

⏺ Bash(node scripts/csp.mjs && cat scripts/serve.sh && grep -n
      "BASE_URL\|executablePath" scripts/lib/browser.mjs | head)
  ⎿  Updated vercel.json (+3 -3)
      49        "headers": [
      50          {
      51            "key": "Content-Security-Policy",
      52 -          "value": "default-src 'self'; script-src 'sha256-L2ft
         -mCnxaaTzPFKkGtUnqzL+yK0TepsEXS0+FN/S4xY=' 'sha256-yuwEevXGZk/AB
         -ReoSPgaKHXIQqXZ6QCGqi0VqLuHJ1E='; style-src 'self' 'unsafe-inli
         -ne'; img-src 'self' data:; connect-src 'self'; font-src 'self';
         - object-src 'none'; base-uri 'none'; form-action 'self'; frame-
         -ancestors 'none'"                                              
      52 +          "value": "default-src 'self'; script-src 'sha256-L2ft
         +mCnxaaTzPFKkGtUnqzL+yK0TepsEXS0+FN/S4xY=' 'sha256-Go9SzF1sBkd56
         +VghA3BGabj5odrq0iHus7xzn0oQ3OE='; style-src 'self' 'unsafe-inli
         +ne'; img-src 'self' data:; connect-src 'self'; font-src 'self';
         + object-src 'none'; base-uri 'none'; form-action 'self'; frame-
         +ancestors 'none'"                                              
      53          }
      54        ]
      55      },
     ...
      58        "headers": [
      59          {
      60            "key": "Content-Security-Policy",
      61 -          "value": "default-src 'self'; script-src 'sha256-L2ft
         -mCnxaaTzPFKkGtUnqzL+yK0TepsEXS0+FN/S4xY=' 'sha256-yuwEevXGZk/AB
         -ReoSPgaKHXIQqXZ6QCGqi0VqLuHJ1E='; style-src 'self' 'unsafe-inli
         -ne'; img-src 'self' data:; connect-src 'self'; font-src 'self';
         - object-src 'none'; base-uri 'none'; form-action 'self'; frame-
         -ancestors 'none'"                                              
      61 +          "value": "default-src 'self'; script-src 'sha256-L2ft
         +mCnxaaTzPFKkGtUnqzL+yK0TepsEXS0+FN/S4xY=' 'sha256-Go9SzF1sBkd56
         +VghA3BGabj5odrq0iHus7xzn0oQ3OE='; style-src 'self' 'unsafe-inli
         +ne'; img-src 'self' data:; connect-src 'self'; font-src 'self';
         + object-src 'none'; base-uri 'none'; form-action 'self'; frame-
         +ancestors 'none'"                                              
      62          }
      63        ]
      64      },
     ...
      67        "headers": [
      68          {
      69            "key": "Content-Security-Policy",
      70 -          "value": "default-src 'self'; script-src 'sha256-L2ft
         -mCnxaaTzPFKkGtUnqzL+yK0TepsEXS0+FN/S4xY=' 'sha256-yuwEevXGZk/AB
         -ReoSPgaKHXIQqXZ6QCGqi0VqLuHJ1E='; style-src 'self' 'unsafe-inli
         -ne'; img-src 'self' data:; connect-src 'self'; font-src 'self';
         - object-src 'none'; base-uri 'none'; form-action 'self'; frame-
         -ancestors 'none'"                                              
      70 +          "value": "default-src 'self'; script-src 'sha256-L2ft
         +mCnxaaTzPFKkGtUnqzL+yK0TepsEXS0+FN/S4xY=' 'sha256-Go9SzF1sBkd56
         +VghA3BGabj5odrq0iHus7xzn0oQ3OE='; style-src 'self' 'unsafe-inli
         +ne'; img-src 'self' data:; connect-src 'self'; font-src 'self';
         + object-src 'none'; base-uri 'none'; form-action 'self'; frame-
         +ancestors 'none'"                                              
      71          }
      72        ]
      73      }

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Sekce 3 v Chrome testu selhala na kliknutí na souhlas, ale mých změn se to
  netýká – vypadá to na problém s časováním posunu stránky. Pouštím test znovu,
  abych zjistil, jestli jde o nestabilní chybu.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Chyba je stabilní, ne náhodná. Zjišťuju, jestli ji způsobila změna stránky,
  nebo nová sekce testu: pustím test se starou verzí index.html.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Se starou stránkou test selhává taky, takže problém je v testu nebo v
  prostředí, ne ve změně JS. Ověřuju, jestli za to může nová sekce 0.
  Called plugin:context-mode:context-mode (ctrl+o to expand)
  ⎿  Interrupted · What should Claude do instead?

❯ pokracuj kde jsi skoncil

⏺ Pokračuju. Pokusnou kopii testu dám tentokrát do scratchpadu, ne do
  repozitáře.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Bez sekce 0 test selhává stejně. Příčina je tedy v prostředí, ne v mé změně.
  Podívám se, jaký prohlížeč test používá, a co přesně se stane s klepnutím na
  souhlas.

  Called plugin:context-mode:context-mode, ran 1 shell command (ctrl+o to expand)

⏺ V izolovaném scénáři klepnutí na souhlas funguje. Pustím proto přesnou
  sekvenci z testu se záznamem, co leží v místě klepnutí.

  Called plugin:context-mode:context-mode 2 times (ctrl+o to expand)

⏺ Před klepnutím je souhlas vidět a nic ho nezakrývá. Po klepnutí se ale stránka
  posunula o 221 px, souhlas zůstal nezaškrtnutý a fokus skončil na body.
  Zjistím, co ten posun vyvolává.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Zjistil jsem, že problém je v testu – plynulé posouvání stránky způsobí, že
  klik dopadne mimo zaškrtávátko, zatímco reálný uživatel klikne na už viditelný
  prvek. Opravím to pomocníkem, který prvek nejdřív okamžitě vystředí a až poté
  klikne.

  Searched for 1 pattern, ran 1 shell command (ctrl+o to expand)

⏺ Update(scripts/test-page.mjs)
  ⎿  Added 4 lines, removed 1 line
      40  const waitFor = (page, sel, ms = 12000) => page.waitForSelector
          (sel, { timeout: ms }).then(() => true, () => false);
      41  const waitError = (page, F, ms = 12000) => page.waitForFunction
          ((F) => { const p = document.querySelector(`${F} .form-error`);
           return p && !p.hidden && !document.querySelector(`${F} [type=s
          ubmit]`).disabled; }, { timeout: ms }, F).then(() => true, () =
          > false);
      42  const visible = (page, sel) => page.$eval(sel, (el) => !!(el.of
          fsetWidth || el.offsetHeight || el.getClientRects().length)).ca
          tch(() => false);
      43 -const text = (page, sel) => page.$eval(sel, (el) => el.textCont
         -ent.trim()).catch(() => null);                                 
      43 +// Klepnutí bez plynulého posunu: puppeteer před klepnutím k pr
         +vku posouvá a se scroll-behavior: smooth                       
      44 +// klepne doprostřed posunu, vedle prvku. Proto prvek nejdřív o
         +kamžitě vystředíme.                                            
      45 +const tapStill = async (page, sel) => { await page.$eval(sel, (
         +el) => el.scrollIntoView({ block: 'center', behavior: 'instant'
         + })); await sleep(50); await page.tap(sel); };                 
      46 +const text = (page, sel) =>page.$eval(sel, (el) => el.textConte
         +nt.trim()).catch(() => null);                                  
      47  
      48  try {
      49    await devDb('?smazat=1&vypadek=0');

⏺ Bash(sed -i '' 's/await page\.tap(`\${F} input\[name=consent\]`)/await
      tapStill(page, `${F} input[name=consent]`)/' scripts/test-page.mjs && grep
      -n "tapStill" scrip…)
  ⎿  Updated scripts/test-page.mjs (+5 -5)
      129      await page.type(`${F} input[name=email]`, '.com');
      130      await page.tap(`${F} [type=submit]`); await sleep(100);
      131      check('chyba: chybí souhlas', (await err()) === 'Zaškrtni 
           prosím souhlas.', await err());
      132 -    await page.tap(`${F} input[name=consent]`);               
      132 +    await tapStill(page, `${F} input[name=consent]`);         
      133      await page.setOfflineMode(true);
      134      await page.tap(`${F} [type=submit]`); await sleep(100);
      135      check('chyba: offline', (await err()) === 'Vypadá to, že n
           ejde internet. Zkontroluj připojení a zkus to znovu.', await e
           rr());
     ...
      199      check('tlačítko pod kartami otevře panel (ne skok dolů)', 
           await page.$eval('#panel', (d) => d.open));
      200      const F = '#panel .lead-form';
      201      await page.type(`${F} input[name=email]`, 'petr@example.co
           m');
      202 -    await page.tap(`${F} input[name=consent]`);               
      202 +    await tapStill(page, `${F} input[name=consent]`);         
      203      await page.tap(`${F} [type=submit]`);
      204      await waitFor(page, '#panel .thanks');
      205      check('odeslání z panelu → poděkování', ((await text(page,
            '#panel .thanks h3')) || '') === 'Hotovo, tahák je tvůj.');
     ...
      252      const { page, logs } = await open('', before);
      253      const F = '[data-slot="sekce"] .lead-form';
      254      await page.type(`${F} input[name=email]`, 'eva@example.com
           ');
      255 -    await page.tap(`${F} input[name=consent]`);               
      255 +    await tapStill(page, `${F} input[name=consent]`);         
      256      await page.tap(`${F} [type=submit]`);
      257      await waitFor(page, '#tahak .thanks');
      258      await sleep(700); // fokus na poděkování stránku plynule p
           osune, klepat až potom
     ...
      386      const focus = await page.evaluate(() => document.activeEle
           ment.name);
      387      check('Enter bez souhlasu: hláška o souhlasu a fokus na za
           škrtávátku', err === 'Zaškrtni prosím souhlas.' && focus === '
           consent', `${err} | ${focus}`);
      388      await sleep(700); // fokus na zaškrtávátko stránku plynule
            posune, klepnout až potom
      389 -    await page.tap(`${F} input[name=consent]`);               
      389 +    await tapStill(page, `${F} input[name=consent]`);         
      390      await page.focus(`${F} input[name=email]`);
      391      await page.keyboard.press('Enter');
      392      await waitFor(page, '#tahak .thanks');
     ...
      427      const F = '[data-slot="sekce"] .lead-form';
      428      await devDb('?vypadek=1');
      429      await page.type(`${F} input[name=email]`, 'petra@example.c
           om');
      430 -    await page.tap(`${F} input[name=consent]`);               
      430 +    await tapStill(page, `${F} input[name=consent]`);         
      431      await page.tap(`${F} [type=submit]`);
      432      await waitError(page, F);
      433      const err = ((await text(page, `${F} .form-error`)) || '')
           .replace(/\u00a0/g, ' ');

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Chrome test prošel: 123 kontrol, 0 chyb. Ověřím ještě API testy (hlídají i CSP
  hashe) a pak commitnu.

  Ran 1 shell command (ctrl+o to expand)

⏺ Bash(cd /Users/daniel/etfLanding && python3 - <<'EOF'
      p='README.md'…)
  ⎿  Updated README.md (+1 -1)
      194  
      195  _TODO: stack a proč (čisté HTML/CSS/JS bez build kroku, Vercel
           , Supabase), zpracování formuláře, zabezpečení klíčů, rychlost
            načtení._
      196  
      197 -- **Celá stránka je jeden soubor `public/index.html`** s inlin
          -e CSS a JS a systémovým písmem. Bez externích skriptů a písem:
          - 62,7 kB, po gzipu 18,5 kB, z toho JS 20,6 kB (po gzipu 7,6 kB
          -). Jediný obrázek je náhled taháku (WebP, 24 kB), který se nač
          -te až u formuláře. Lighthouse (mobil, 11. 10. 2026, lokální se
          -rver bez komprese, s CSP a ostatními hlavičkami z `vercel.json
          -`): výkon, přístupnost a osvědčené postupy 100 u všech tří ver
          -zí úvodu, LCP 1,2 s, CLS 0, TBT 0 ms, celkem 88 KiB. SEO 66, p
          -rotože stránka má záměrně `noindex` (jediný neúspěšný audit je
          - „stránka je blokovaná pro indexování“).                      
      197 +- **Celá stránka je jeden soubor `public/index.html`** s inlin
          +e CSS a JS a systémovým písmem. Bez externích skriptů a písem:
          + 60,7 kB, po gzipu 17,7 kB, z toho JS 19,2 kB (oba vložené skr
          +ipty, po gzipu 7,0 kB, limit 20 kB hlídá test). Jediný obrázek
          + je náhled taháku (WebP, 24 kB), který se načte až u formuláře
          +. Lighthouse (mobil, 11. 10. 2026, lokální server bez komprese
          +, s CSP a ostatními hlavičkami z `vercel.json`): výkon, přístu
          +pnost a osvědčené postupy 100 u všech tří verzí úvodu, LCP 1,2
          + s, CLS 0, TBT 0 ms, celkem 88 KiB. SEO 66, protože stránka má
          + záměrně `noindex` (jediný neúspěšný audit je „stránka je blok
          +ovaná pro indexování“).                                       
      198  - **„Ručně kreslené“ prvky bez písma navíc.** Fix, šipky, krou
           žky a fajfky jsou malá inline SVG. Rukou psané písmo by přidal
           o desítky kB a probliknutí textu. Lístky se otáčejí bez 3D kon
           textu a bez `backface-visibility`: JS (Web Animations API, bez
            knihovny) otočí jednu rovinu s perspektivou o 90°, když je lí
           stek z boku, vymění strany a dotočí. WebKit to kreslí stejně s
            grafickým čipem i bez něj. Při `prefers-reduced-motion` se je
           n vymění strany.
      199  - **Ikony a obrázek pro sdílení generuje skript** ([scripts/ob
           razky.mjs](scripts/obrazky.mjs)) ve stylu stránky a s čísly z 
           `data/etf.json`: favicon (SVG a ICO), ikona pro iOS a `og.png`
            1200×630 pro náhled odkazu na Facebooku a v Messengeru. Strán
           ka si je nenačítá, takže nezdržují.
      200  - **Jen světlé barvy** (`color-scheme: only light`). Tmavý rež
           im iOS ani automatické ztmavení v Chromu stránku nepřebarví, „
           sešit“ zůstane papírový.

  Ran 1 shell command (ctrl+o to expand)

⏺ Bod 1 je hotový (1533ba2). Pokračuju bodem 2, limitem kontaktů.

  Searched for 1 pattern, ran 1 shell command (ctrl+o to expand)

⏺ Bash(python3 - <<'EOF'
      import re…)
  ⎿  Updated api/_lib.js (+1 -1)
      25    sdileni: /^(nativni|zruseno|kopie|rucne)$/,
      26  };
      27  
      28 -// Limity (počítá je databáze, viz supabase/schema.sql): kontak
         -ty 10 za hodinu z jedné IP,                                    
      28 +// Limity (počítá je databáze, viz supabase/schema.sql): kontak
         +ty 30 za hodinu z jedné IP,                                    
      29  // události 600 za hodinu z jedné IP a nejvýš 100 na jednu návš
          těvu.
      30  export const MIN_FORM_MS = 3000; // formulář odeslaný dřív než 
          3 s po načtení stránky odešle bot
      31  export const MAX_TOKEN_MS = 24 * 3600 * 1000;
  ⎿  Updated scripts/test-db.mjs (+5 -3)
      66  check('uloz_kontakt: stejný e-mail podruhé = duplicita, neuloží
           se znovu', (await one('service_role', `select public.uloz_kont
          akt('${KLIC(2)}', 'jana@example.com', 'zacatek')`)) === 'duplic
          ita'
      67    && (await one('service_role', "select count(*)::int from publ
          ic.leads where email = 'jana@example.com'")) === 1
      68    && (await one('service_role', "select varianta from public.le
          ads where email = 'jana@example.com'")) === 'dvojce');
      69 -let last = '';                                                 
      70 -for (let i = 0; i < 11; i++) last = await one('service_role', `
         -select public.uloz_kontakt('${KLIC(3)}', 'novy${i}@example.com'
         -, 'vychozi')`);                                                
      71 -check('uloz_kontakt: 11. pokus z jedné IP za hodinu = limit', l
         -ast === 'limit' && (await one('service_role', "select count(*):
         -:int from public.leads where email like 'novy%'")) === 10, last
         -);                                                             
      69 +const LIMIT_KONTAKTU = 30;                                     
      70 +const pokusy = [];                                             
      71 +for (let i = 0; i <= LIMIT_KONTAKTU; i++) pokusy.push(await one
         +('service_role', `select public.uloz_kontakt('${KLIC(3)}', 'nov
         +y${i}@example.com', 'vychozi')`));                             
      72 +check(`uloz_kontakt: ${LIMIT_KONTAKTU} pokusů z jedné IP za hod
         +inu projde, ${LIMIT_KONTAKTU + 1}. = limit`, pokusy.slice(0, -1
         +).every((r) => r === 'novy') && pokusy.at(-1) === 'limit'      
      73 +  && (await one('service_role', "select count(*)::int from publ
         +ic.leads where email like 'novy%'")) === LIMIT_KONTAKTU, pokusy
         +.at(-1));                                                      
      74  check('uloz_kontakt: jiná IP limit nemá', (await one('service_r
          ole', `select public.uloz_kontakt('${KLIC(4)}', 'jina@example.c
          om', 'vychozi')`)) === 'novy');
      75  for (const [what, email] of [['velká písmena', 'Jana@Example.co
          m'], ['diakritika', 'jána@example.com'], ['bez zavináče', 'jana
          .example.com'], ['znak <', 'ja<na@example.com']]) {
      76    const r = await one('service_role', `select public.uloz_konta
          kt('${KLIC(5)}', $1, 'vychozi')`, [email]);
  ⎿  Updated scripts/test-page.mjs (+1 -1)
      247      kopie: () => { delete Navigator.prototype.share; Object.de
           fineProperty(navigator, 'clipboard', { value: { writeText: () 
           => Promise.resolve() } }); },
      248      rucne: () => { delete Navigator.prototype.share; Object.de
           fineProperty(navigator, 'clipboard', { value: undefined }); },
      249    };
      250 -  await devDb('?smazat=1'); // limit 10 kontaktů za hodinu z j
          -edné IP: testy jich odešlou víc                               
      250 +  await devDb('?smazat=1'); // limit 30 kontaktů za hodinu z j
          +edné IP: testy jich odešlou víc                               
      251    for (const [mode, before] of Object.entries(SHARE)) {
      252      const { page, logs } = await open('', before);
      253      const F = '[data-slot="sekce"] .lead-form';
  ⎿  Updated supabase/schema.sql (+2 -2)
      62    returning l.pocet <= p_max;
      63  $$;
      64  
      65 --- Kontakt: nejvýš 10 pokusů za hodinu z jedné IP. Vrací 'novy'
         -, 'duplicita' (e-mail už je, nic se nemění)                    
      65 +-- Kontakt: nejvýš 30 pokusů za hodinu z jedné IP (sdílená IP m
         +obilních operátorů, viz README). Vrací 'novy', 'duplicita' (e-m
         +ail už je, nic se nemění)                                      
      66  -- nebo 'limit'.
      67  create or replace function public.uloz_kontakt(p_klic text, p_e
          mail text, p_varianta text)
      68  returns text language plpgsql security invoker set search_path 
          = '' as $$
      69  begin
      70 -  if not public.zapocitej(p_klic, 10) then return 'limit'; end 
         -if;                                                            
      70 +  if not public.zapocitej(p_klic, 30) then return 'limit'; end 
         +if;                                                            
      71    insert into public.leads (email, souhlas, varianta) values (p
          _email, true, p_varianta)
      72    on conflict (email) do nothing;
      73    if found then return 'novy'; end if;
  ⎿  Updated texty.md (+1 -1)
      239  | bez internetu | Vypadá to, že nejde internet. Zkontroluj při
           pojení a zkus to znovu. |
      240  | doména nepřijímá poštu (bez MX) | Na tuhle adresu nejde posl
           at e-mail. Zkontroluj, jestli v ní není překlep. |
      241  | jednorázová adresa | Jednorázové e-mailové adresy nebereme. 
           Napiš prosím svůj běžný e-mail. |
      242 -| moc pokusů z jedné IP (10 za hodinu) | Z tohohle připojení p
          -řišlo moc pokusů za sebou. Zkus to prosím za hodinu. |        
      242 +| moc pokusů z jedné IP (30 za hodinu) | Z tohohle připojení p
          +řišlo moc pokusů za sebou. Zkus to prosím za hodinu. |        
      243  | e-mail už máme (není chyba) | Žádná hláška, stejné poděkován
           í jako u nového e-mailu. Jinak by formulář prozradil, kdo už j
           e v databázi. |
      244  
      245  ### Poděkování (nahradí celý blok s formulářem: kartu v sekci,
            výzvu pod lístky i obsah panelu)

  Searched for 1 pattern, read 1 file (ctrl+o to expand)

⏺ Přidám i záznam do logu, když limit kontakt odmítne. Bez něj by při kampani
  nebylo vidět, jestli limit nezastavuje skutečné lidi.

⏺ Update(api/lead.js)
  ⎿  Added 4 lines, removed 1 line
      46      try {
      47        // limit pokusů a uložení v jedné transakci; opakovaný e-
          mail se neuloží znovu, odpověď je stejná
      48        const vysledek = await rpc('uloz_kontakt', { p_klic: klic
          Ip(request, 'lead'), p_email: email, p_varianta: varianta });
      49 -      if (vysledek === 'limit') return odpoved(429, { ok: false
         -, chyba: 'limit' });                                           
      49 +      if (vysledek === 'limit') {                              
      50 +        console.warn('[lead] zamítnuto: limit pokusů z jedné IP
         +'); // bez IP; kdyby přibývalo během kampaně, zvednout limit   
      51 +        return odpoved(429, { ok: false, chyba: 'limit' });    
      52 +      }                                                        
      53      } catch (e) {
      54        console.error(`[lead] databáze: ${e.status ? `Supabase vr
          átil ${e.status}` : `nedostupná (${e.name})`}`);
      55        return odpoved(502, { ok: false, chyba: 'databaze' });

  Searched for 1 pattern, read 1 file (ctrl+o to expand)

⏺ Update(scripts/test-api.mjs)
  ⎿  Added 1 line, removed 1 line
      85  check('lead: e-mail už v databázi (duplicita) → stejná odpověď 
          jako nový, tahák se ukáže', r.status === 200 && r.json.ok === t
          rue);
      86  reply = () => Response.json('limit');
      87  r = await run(lead, req('/api/lead', { body: lead1() }));
      88 -check('lead: překročený limit pokusů z jedné IP → 429', r.statu
         -s === 429 && r.json.chyba === 'limit');                        
      88 +check('lead: překročený limit pokusů z jedné IP → 429 a záznam 
         +v logu (bez IP)', r.status === 429 && r.json.chyba === 'limit' 
         +&& logs.at(-1) === '[lead] zamítnuto: limit pokusů z jedné IP')
         +;                                                              
      89  reply = () => Response.json('novy');
      90  r = await run(lead, req('/api/lead', { body: lead1({ varianta: 
          'neco-jineho' }) }));
      91  check('lead: neznámá verze úvodu se uloží jako vychozi', r.call
          s[0] && r.calls[0].body.p_varianta === 'vychozi');

⏺ Bash(python3 - <<'EOF'
      p='README.md'…)
  ⎿  Updated README.md (+3 -2)
       96  5. **Souhlas** musí být `true`.
       97  6. **Jednorázové domény:** 9 222 domén ze seznamu [disposable-
           email-domains](https://github.com/disposable-email-domains/dis
           posable-email-domains) (licence CC0, commit `81a8976` z 9. 10.
            2026). Aktualizuje se skriptem [scripts/jednorazove-domeny.mj
           s](scripts/jednorazove-domeny.mjs). Kontroluje se i subdoména 
           (`x.mailinator.com`).
       98  7. **MX záznam:** doména musí přijímat poštu. Doména bez MX ne
           bo s „null MX“ (RFC 7505) neprojde. Když DNS neodpoví do 2,5 s
           , kontakt projde, aby skutečný člověk nedoplatil na výpadek DN
           S.
       99 -8. **Limit pokusů:** nejvýš 10 kontaktů za hodinu z jedné IP a
          -dresy. Počítá to databáze (funkce `uloz_kontakt`) podle HMAC z
          - IP, hodiny a tajné soli. IP adresa se nikam neukládá a klíče 
          -z různých hodin nejdou spojit. Záznamy starší než 2 dny maže d
          -enní cron.                                                    
       99 +8. **Limit pokusů:** nejvýš 30 kontaktů za hodinu z jedné IP a
          +dresy. Počítá to databáze (funkce `uloz_kontakt`) podle HMAC z
          + IP, hodiny a tajné soli. IP adresa se nikam neukládá a klíče 
          +z různých hodin nejdou spojit. Záznamy starší než 2 dny maže d
          +enní cron.                                                    
      100 +   **Proč 30, a ne méně:** mobilní operátoři pouštějí mnoho zá
          +kazníků přes jednu veřejnou IPv4 adresu (CGNAT, adresní rozsah
          + pro něj vyhrazuje [RFC 6598](https://www.rfc-editor.org/rfc/r
          +fc6598)). Reklama míří na mobily, takže přísnější limit by při
          + kampani odmítal skutečné lidi. Bot z jedné adresy i tak pošle
          + nejvýš 30 kontaktů za hodinu a každý musí projít tokenem, kon
          +trolou MX a seznamem jednorázových domén. Každé odmítnutí limi
          +tem se zapíše do logu Vercelu (`[lead] zamítnuto: limit pokusů
          + z jedné IP`, bez IP).                                        
      101  9. **Duplicita:** stejný e-mail se podruhé neuloží (`on confli
           ct do nothing`), ale návštěvník dostane stejnou odpověď a tahá
           k. Formulář tak neprozradí, kdo už v databázi je.
      102  
      103  **Nálezy a co s nimi:**
     ...
      128  
      129  **Co jsem vědomě neudělal:**
      130  - **CAPTCHA (např. Turnstile):** přidala by skript třetí stran
           y a otázku souhlasu. Má smysl, až by spam prošel přes limity.
      130 -- **Limit z jedné IP může omylem zastavit skutečné lidi** za s
          -tejnou sdílenou adresou mobilního operátora. Při 10 kontaktech
          - za hodinu je to málo pravděpodobné. Botnet s mnoha adresami l
          -imit obejde, proto jsou za ním další kontroly.                
      131 +- **Limit z jedné IP může i při 30 za hodinu zastavit skutečné
          + lidi** za stejnou sdílenou adresou operátora. Kolik lidí sdíl
          +í jednu adresu, nevím. Kdyby během kampaně v logu přibývalo od
          +mítnutí limitem, stačí zvednout jedno číslo ve funkci `uloz_ko
          +ntakt` v [supabase/schema.sql](supabase/schema.sql). Botnet s 
          +mnoha adresami limit obejde, proto jsou za ním další kontroly.
      132  - **Formulář bez JavaScriptu nefunguje** (chybí token). Obsah 
           stránky bez JS funguje dál.
      133  
      134  **Double opt-in (doporučení, zatím nestavěno).** Po odeslání b
           y přišel e-mail s potvrzovacím odkazem a do marketingových e-m
           ailů by se kontakt zařadil až po kliknutí.

  Ran 1 shell command (ctrl+o to expand)

⏺ Bod 2 je hotový (8a200b7). Pokračuju bodem 3: chování kontroly MX při chybě
  nebo timeoutu DNS.

  Ran 1 shell command (ctrl+o to expand)

⏺ Zjistil jsem, že doména bez MX (ENODATA) je chybně odmítána i v případech, kdy
  podle RFC 5321 jde doručit přes implicitní MX (A/AAAA záznam), a časovač se
  po úspěšném dotazu nevyčišťuje. Opravím tuto logiku a zkrátím timeout na 1 s.

  Ran 1 shell command (ctrl+o to expand)
⏺ Update(api/_lib.js)
  ⎿  Added 30 lines, removed 11 lines
       76    return false;
       77  }
       78  
       79 -// DNS jde v testech a v lokálním serveru podvrhnout přes zavi
          -slosti.resolveMx.                                             
       80 -export const zavislosti = { resolveMx: (domena) => dns.resolve
          -Mx(domena) };                                                 
       81 -// Má doména záznam MX, který přijímá poštu? „Null MX“ (RFC 75
          -05, prázdný cíl) znamená, že ne.                              
       82 -// Když DNS neodpoví (výpadek, timeout), skutečného člověka ne
          -odmítneme: vrátí null = nevíme.                               
       79 +// Celá kontrola v DNS nejvýš 1 s, pak kontakt pustíme: odeslá
          +ní nezdrží a výpadek DNS neodmítne člověka.                   
       80 +export const MX_TIMEOUT_MS = 1000;                            
       81 +const resolver = new dns.Resolver({ timeout: MX_TIMEOUT_MS, tr
          +ies: 1 });                                                    
       82 +// DNS jde v testech a v lokálním serveru podvrhnout přes zavi
          +slosti.                                                       
       83 +export const zavislosti = {                                   
       84 +  resolveMx: (domena) => resolver.resolveMx(domena),          
       85 +  resolveAdresy: (domena) => Promise.any([resolver.resolve4(do
          +mena), resolver.resolve6(domena)]),                           
       86 +};                                                            
       87 +                                                              
       88 +// Přijímá doména poštu? true: má MX (ne „null MX“ z RFC 7505)
          +, nebo bez MX aspoň adresu (pošta jde na ni,                  
       89 +// implicitní MX z RFC 5321, 5.1). false: doména neexistuje, m
          +á „null MX“, nebo nemá ani MX, ani adresu.                    
       90 +// null: nevíme (výpadek, chyba nebo timeout DNS), kontakt pro
          +jde.                                                          
       91  export async function maPostu(domena) {
       92 +  let casovac;                                                
       93 +  const limit = new Promise((resolve) => { casovac = setTimeou
          +t(() => resolve(null), MX_TIMEOUT_MS); });                    
       94    try {
       85 -    const mx = await Promise.race([                           
       86 -      zavislosti.resolveMx(domena),                           
       87 -      new Promise((_, reject) => setTimeout(() => reject(Objec
          -t.assign(new Error('timeout'), { code: 'ETIMEOUT' })), 2500)),
       88 -    ]);                                                       
       89 -    return mx.some((r) => r.exchange && r.exchange !== '.');  
       95 +    return await Promise.race([zjistiPostu(domena), limit]);  
       96 +  } finally {                                                 
       97 +    clearTimeout(casovac);                                    
       98 +  }                                                           
       99 +}                                                             
      100 +async function zjistiPostu(domena) {                          
      101 +  try {                                                       
      102 +    const mx = await zavislosti.resolveMx(domena);            
      103 +    if (mx.length) return mx.some((r) => r.exchange && r.excha
          +nge !== '.');                                                 
      104    } catch (e) {
       91 -    if (e.code === 'ENOTFOUND' || e.code === 'ENODATA') return
          - false;                                                       
       92 -    return null;                                              
      105 +    if (e.code === 'ENOTFOUND') return false;                 
      106 +    if (e.code !== 'ENODATA') return null;                    
      107    }
      108 +  try {                                                       
      109 +    return (await zavislosti.resolveAdresy(domena)).length > 0
          +;                                                             
      110 +  } catch (e) {                                               
      111 +    return (e.errors || [e]).every((x) => x.code === 'ENODATA'
          + || x.code === 'ENOTFOUND') ? false : null;                   
      112 +  }                                                           
      113  }
      114  
      115  function hmac(cast) {

⏺ Update(scripts/test-api.mjs)
  ⎿  Added 13 lines, removed 4 lines
      36  const { default: token } = await import('../api/token.js');
      37  const { default: keepalive } = await import('../api/keepalive.j
          s');
      38  
      39 -// Podvržené DNS: podle domény vrátí MX, žádný záznam, null MX 
         -nebo výpadek.                                                  
      39 +// Podvržené DNS: podle domény vrátí MX, žádný záznam, null MX,
         + chybu nebo nic (timeout).                                     
      40 +// chyba-<kód>.cz vyhodí chybu s tím kódem; bez-mx* nemají MX a
         + dotaz jde na adresu domény (implicitní MX).                   
      41  let dnsCalls = 0;
      42 +const dnsChyba = (code) => Object.assign(new Error('x'), { code
         + });                                                           
      43  lib.zavislosti.resolveMx = async (d) => {
      44    dnsCalls++;
      43 -  if (d === 'neexistuje.cz') throw Object.assign(new Error('x')
         -, { code: 'ENOTFOUND' });                                      
      44 -  if (d === 'bez-mx.cz') throw Object.assign(new Error('x'), { 
         -code: 'ENODATA' });                                            
      45 +  if (d === 'neexistuje.cz') throw dnsChyba('ENOTFOUND');      
      46 +  if (d.startsWith('bez-mx')) throw dnsChyba('ENODATA');       
      47    if (d === 'null-mx.cz') return [{ exchange: '', priority: 0 }
          ];
      46 -  if (d === 'vypadek-dns.cz') throw Object.assign(new Error('x'
         -), { code: 'ESERVFAIL' });                                     
      48 +  if (d.startsWith('chyba-')) throw dnsChyba(d.slice(6, -3).toU
         +pperCase());                                                   
      49    if (d === 'pomale-dns.cz') return new Promise(() => {});
      50    return [{ exchange: 'mx1.' + d, priority: 10 }];
      51  };
      52 +lib.zavislosti.resolveAdresy = async (d) => {                  
      53 +  dnsCalls++;                                                  
      54 +  if (d === 'bez-mx-s-adresou.cz') return ['192.0.2.10'];      
      55 +  if (d === 'bez-mx-pomale.cz') return new Promise(() => {});  
      56 +  if (d === 'bez-mx-vypadek.cz') throw new AggregateError([dnsC
         +hyba('ENODATA'), dnsChyba('ESERVFAIL')]);                      
      57 +  throw new AggregateError([dnsChyba('ENODATA'), dnsChyba('ENOD
         +ATA')]);                                                       
      58 +};                                                             
      59  
      60  const HOST = 'etf-dvojcata.example';
      61  const IP = '203.0.113.7';

⏺ Update(scripts/test-api.mjs)
  ⎿  Added 23 lines, removed 7 lines
      140    check(`lead: jednorázová doména (${email.split('@')[1]}) → 4
           22, bez dotazu do DNS`, r.status === 422 && r.json.chyba === '
           jednorazovy' && r.calls.length === 0 && dnsCalls === 0);
      141  }
      142  for (const domena of ['seznam.cz', 'email.cz', 'centrum.cz', '
           gmail.com']) check(`běžná doména ${domena} není na seznamu jed
           norázových`, !lib.jednorazovaDomena(domena));
      143 -for (const [name, domena] of [['doména neexistuje', 'neexistuj
          -e.cz'], ['doména bez MX', 'bez-mx.cz'], ['„null MX“ (poštu nep
          -řijímá)', 'null-mx.cz']]) {                                   
      143 +for (const [name, domena, dotazu] of [['doména neexistuje', 'n
          +eexistuje.cz', 1], ['„null MX“ (poštu nepřijímá)', 'null-mx.cz
          +', 1], ['doména bez MX i bez adresy', 'bez-mx.cz', 2]]) {     
      144    r = await run(lead, req('/api/lead', { body: lead1({ email: 
           `x@${domena}` }) }));
      145 -  check(`lead: ${name} → 422 mx, nic se neuloží`, r.status ===
          - 422 && r.json.chyba === 'mx' && r.calls.length === 0 && dnsCa
          -lls === 1);                                                   
      145 +  check(`lead: ${name} → 422 mx, nic se neuloží`, r.status ===
          + 422 && r.json.chyba === 'mx' && r.calls.length === 0 && dnsCa
          +lls === dotazu, `${r.status} ${dnsCalls} dotazů`);            
      146  }
      147 -r = await run(lead, req('/api/lead', { body: lead1({ email: 'x
          -@vypadek-dns.cz' }) }));                                      
      148 -check('lead: výpadek DNS → kontakt se uloží (skutečného člověk
          -a kvůli DNS neodmítneme)', r.status === 200 && r.calls.length 
          -=== 1);                                                       
      149 -const t0 = Date.now();                                        
      150 -r = await run(lead, req('/api/lead', { body: lead1({ email: 'x
          -@pomale-dns.cz' }) }));                                       
      151 -check('lead: DNS bez odpovědi → po 2,5 s se pokračuje a kontak
          -t se uloží', r.status === 200 && r.calls.length === 1 && Date.
          -now() - t0 < 4000, `${Date.now() - t0} ms`);                  
      147 +r = await run(lead, req('/api/lead', { body: lead1({ email: 'x
          +@bez-mx-s-adresou.cz' }) }));                                 
      148 +check('lead: doména bez MX, ale s adresou (implicitní MX, RFC 
          +5321) → kontakt se uloží', r.status === 200 && r.calls.length 
          +=== 1);                                                       
      149 +// Fail-open: při chybě nebo timeoutu DNS kontakt projde, skut
          +ečného člověka kvůli DNS neodmítneme.                         
      150 +check(`MX: timeout DNS je krátký (${lib.MX_TIMEOUT_MS} ms, nej
          +výš 1,5 s)`, lib.MX_TIMEOUT_MS > 0 && lib.MX_TIMEOUT_MS <= 150
          +0);                                                           
      151 +for (const code of ['ESERVFAIL', 'ETIMEOUT', 'ECONNREFUSED', '
          +EREFUSED', 'EBADRESP', 'ECANCELLED']) {                       
      152 +  r = await run(lead, req('/api/lead', { body: lead1({ email: 
          +`x@chyba-${code.toLowerCase()}.cz` }) }));                    
      153 +  check(`lead: chyba DNS ${code} → kontakt se uloží`, r.status
          + === 200 && r.calls.length === 1, `${r.status}`);             
      154 +}                                                             
      155 +r = await run(lead, req('/api/lead', { body: lead1({ email: 'x
          +@bez-mx-vypadek.cz' }) }));                                   
      156 +check('lead: bez MX a dotaz na adresu skončí výpadkem → kontak
          +t se uloží', r.status === 200 && r.calls.length === 1);       
      157 +for (const [name, domena] of [['DNS neodpoví na MX', 'pomale-d
          +ns.cz'], ['DNS neodpoví na adresu domény bez MX', 'bez-mx-poma
          +le.cz']]) {                                                   
      158 +  const t0 = Date.now();                                      
      159 +  r = await run(lead, req('/api/lead', { body: lead1({ email: 
          +`x@${domena}` }) }));                                         
      160 +  const ms = Date.now() - t0;                                 
      161 +  check(`lead: ${name} → po ${lib.MX_TIMEOUT_MS} ms se pokraču
          +je a kontakt se uloží`, r.status === 200 && r.calls.length ===
          + 1 && ms >= lib.MX_TIMEOUT_MS - 20 && ms < lib.MX_TIMEOUT_MS +
          + 300, `${ms} ms`);                                            
      162 +}                                                             
      163 +{                                                             
      164 +  const t0 = Date.now();                                      
      165 +  const vysledek = await lib.maPostu('example.cz');           
      166 +  check('MX: běžná doména odpoví hned, časovač timeoutu se zru
          +ší', vysledek === true && Date.now() - t0 < 50 && process.getA
          +ctiveResourcesInfo().filter((x) => x === 'Timeout').length ===
          + 0, `${Date.now() - t0} ms, ${process.getActiveResourcesInfo()
          +.join(',')}`);                                                
      167 +}                                                             
      168  
      169  // ---------- pole navíc, velikost, typ, metoda, původ -------
           ---
      170  for (const [name, body, status, chyba] of [

  Ran 1 shell command (ctrl+o to expand)

⏺ Všech 118 API kontrol prošlo. Ještě ověřím skutečné DNS (ne podvržené): běžnou
  doménu, example.com (ta má null MX) a neexistující doménu.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Skutečné DNS odpovídá za 16–24 ms, takže timeout 1 s má velkou rezervu.
  Doplním README.

⏺ Bash(python3 - <<'EOF'
      p='README.md'…)
  ⎿  Updated README.md (+1 -1)
       95  4. **Formát e-mailu:** jen ASCII, platná doména s koncovkou, b
           ez `< > " '`, bez `=`, `+` nebo `-` na začátku (vzorec při exp
           ortu do tabulky). Stejné pravidlo hlídá i databáze.
       96  5. **Souhlas** musí být `true`.
       97  6. **Jednorázové domény:** 9 222 domén ze seznamu [disposable-
           email-domains](https://github.com/disposable-email-domains/dis
           posable-email-domains) (licence CC0, commit `81a8976` z 9. 10.
            2026). Aktualizuje se skriptem [scripts/jednorazove-domeny.mj
           s](scripts/jednorazove-domeny.mjs). Kontroluje se i subdoména 
           (`x.mailinator.com`).
       98 -7. **MX záznam:** doména musí přijímat poštu. Doména bez MX ne
          -bo s „null MX“ (RFC 7505) neprojde. Když DNS neodpoví do 2,5 s
          -, kontakt projde, aby skutečný člověk nedoplatil na výpadek DN
          -S.                                                            
       98 +7. **MX záznam:** doména musí přijímat poštu. Neprojde doména,
          + která neexistuje, má „null MX“ (RFC 7505), nebo nemá ani MX, 
          +ani adresu. Doména bez MX, ale s adresou projde, protože pošta
          + jde i na ni (implicitní MX podle RFC 5321). **Při chybě DNS n
          +ebo timeoutu kontakt projde** (fail-open), aby skutečný člověk
          + nedoplatil na výpadek DNS. Celá kontrola trvá nejvýš 1 s, sku
          +tečné dotazy trvají kolem 20 ms. Test ověřuje šest druhů chyb 
          +DNS, nezodpovězený dotaz (pokračuje se po 1 s) a že se časovač
          + po odpovědi zruší.                                           
       99  8. **Limit pokusů:** nejvýš 30 kontaktů za hodinu z jedné IP a
           dresy. Počítá to databáze (funkce `uloz_kontakt`) podle HMAC z
            IP, hodiny a tajné soli. IP adresa se nikam neukládá a klíče 
           z různých hodin nejdou spojit. Záznamy starší než 2 dny maže d
           enní cron.
      100     **Proč 30, a ne méně:** mobilní operátoři pouštějí mnoho zá
           kazníků přes jednu veřejnou IPv4 adresu (CGNAT, adresní rozsah
            pro něj vyhrazuje [RFC 6598](https://www.rfc-editor.org/rfc/r
           fc6598)). Reklama míří na mobily, takže přísnější limit by při
            kampani odmítal skutečné lidi. Bot z jedné adresy i tak pošle
            nejvýš 30 kontaktů za hodinu a každý musí projít tokenem, kon
           trolou MX a seznamem jednorázových domén. Každé odmítnutí limi
           tem se zapíše do logu Vercelu (`[lead] zamítnuto: limit pokusů
            z jedné IP`, bez IP).
      101  9. **Duplicita:** stejný e-mail se podruhé neuloží (`on confli
           ct do nothing`), ale návštěvník dostane stejnou odpověď a tahá
           k. Formulář tak neprozradí, kdo už v databázi je.

  Called plugin:context-mode:context-mode, ran 1 shell command (ctrl+o to expand)

⏺ Bod 3 je hotový (eecec81). Teď bod 4, párování kontaktu s návštěvou. Načtu
  funkci pro události, schéma, trychtýř a zásady.

  Ran 1 shell command (ctrl+o to expand)

⏺ Navrhuji, že bez ID návštěvy budu posílat odeslano i navazující události
  (odeslani_pokus, odeslani_chyba, tahak_otevren, sdileni), aby nebylo možné
  odeslání nepřímo rozpoznat, čas událostí zaokrouhlím na minuty a trychtýř
  počítá odeslání z kontaktů podle varianty – vše popíšu v reportu. Teď si
  nejdřív načtu testy událostí a stránku se zásadami.

  Searched for 1 pattern, ran 2 shell commands (ctrl+o to expand)

⏺ Začnu sdílenou knihovnou a funkcí pro události.

  Ran 1 shell command (ctrl+o to expand)

⏺ Update(api/_lib.js)
  ⎿  Added 3 lines
      24    tahak_otevren: /^(panel|listky|sekce)$/,
      25    sdileni: /^(nativni|zruseno|kopie|rucne)$/,
      26  };
      27 +// Události od odeslání formuláře dál jsou vždy bez ID návštěvy
         +, ostatní vždy s ním (hlídá i databáze).                       
      28 +// Podle nich by šlo poznat, která návštěva kontakt odeslala, a
         + spárovat ji s e-mailem (viz README, Měření).                  
      29 +export const BEZ_NAVSTEVY = ['odeslani_pokus', 'odeslani_chyba'
         +, 'odeslano', 'tahak_otevren', 'sdileni'];                     
      30  
      31  // Limity (počítá je databáze, viz supabase/schema.sql): kontak
          ty 30 za hodinu z jedné IP,
      32  // události 600 za hodinu z jedné IP a nejvýš 100 na jednu návš
          těvu.

⏺ Bash(python3 - <<'EOF'
      p='api/event.js'…)
  ⎿  Updated api/event.js (+6 -4)
       1  // POST /api/event – uloží anonymní událost z cesty návštěvníka
           (funkce uloz_udalost, tabulka events).
       2  // Přijímá jen ID návštěvy (náhodné UUID z paměti stránky), náz
          ev události, verzi úvodu a detail z pevného
       3  // seznamu pro každou událost (_lib.js, DETAILY), takže se přes
           měření nedají ukládat libovolná data.
       4 +// Události od odeslání formuláře dál (BEZ_NAVSTEVY) musí přijí
         +t bez ID návštěvy, ostatní s ním.                              
       5  // Proti zahlcení: tělo nejvýš 512 B, 600 událostí za hodinu z 
          jedné IP a 100 na návštěvu (počítá databáze).
       6  // Prohlížeč posílá přes navigator.sendBeacon, tedy jako text/p
          lain.
       6 -import { VARIANTY, DETAILY, odpoved, nactiTelo, ciziPuvod, klic
         -Ip, chybiNastaveni, rpc } from './_lib.js';                    
       7 +import { VARIANTY, DETAILY, BEZ_NAVSTEVY, odpoved, nactiTelo, c
         +iziPuvod, klicIp, chybiNastaveni, rpc } from './_lib.js';      
       8  
       9  const MAX_BYTES = 512;
      10  const POLE = ['navsteva', 'udalost', 'varianta', 'detail'];
     ...
      23      try { d = JSON.parse(text); } catch { return odpoved(400, {
           ok: false, chyba: 'format' }); }
      24      if (!d || typeof d !== 'object' || Array.isArray(d)) return
           odpoved(400, { ok: false, chyba: 'format' });
      25      if (Object.keys(d).some((k) => !POLE.includes(k))) return o
          dpoved(400, { ok: false, chyba: 'pole' });
      25 -    if (typeof d.navsteva !== 'string' || !UUID.test(d.navsteva
         -)) return odpoved(400, { ok: false, chyba: 'navsteva' });      
      26      if (!Object.hasOwn(DETAILY, d.udalost)) return odpoved(400,
           { ok: false, chyba: 'udalost' });
      27 +    const bezNavstevy = BEZ_NAVSTEVY.includes(d.udalost);      
      28 +    if (bezNavstevy ? d.navsteva !== undefined : typeof d.navst
         +eva !== 'string' || !UUID.test(d.navsteva)) return odpoved(400,
         + { ok: false, chyba: 'navsteva' });                            
      29      if (!VARIANTY.includes(d.varianta)) return odpoved(400, { o
          k: false, chyba: 'varianta' });
      30      if (d.detail != null && (typeof d.detail !== 'string' || !D
          ETAILY[d.udalost].test(d.detail))) return odpoved(400, { ok: fa
          lse, chyba: 'detail' });
      31      if (chybiNastaveni(['SUPABASE_URL', 'SUPABASE_SECRET_KEY', 
          'ANTISPAM_SECRET'])) return odpoved(503, { ok: false, chyba: 'k
          onfigurace' });
      32  
      33      try {
      32 -      // čas doplní databáze (zaokrouhlený na hodiny), od prohl
         -ížeče ho nebereme                                              
      34 +      // čas doplní databáze (zaokrouhlený na minuty), od prohl
         +ížeče ho nebereme                                              
      35        const vysledek = await rpc('uloz_udalost', {
      34 -        p_klic: klicIp(request, 'event'), p_navsteva: d.navstev
         -a, p_udalost: d.udalost, p_varianta: d.varianta, p_detail: d.de
         -tail ?? null,                                                  
      36 +        p_klic: klicIp(request, 'event'), p_navsteva: bezNavste
         +vy ? null : d.navsteva, p_udalost: d.udalost, p_varianta: d.var
         +ianta, p_detail: d.detail ?? null,                             
      37        }, 5000);
      38        if (vysledek === 'limit') return odpoved(429, { ok: false
          , chyba: 'limit' });
      39      } catch (e) {

⏺ Teď schéma: navsteva může být prázdné jen u událostí kolem odeslání, čas se
  zaokrouhluje na minuty.

⏺ Bash(python3 - <<'EOF'
      p='supabase/schema.sql'…)
  ⎿  Updated supabase/schema.sql (+13 -7)
      11  alter default privileges in schema public revoke all on sequenc
          es from anon, authenticated;
      12  alter default privileges in schema public revoke execute on fun
          ctions from public, anon, authenticated;
      13  
      14 --- Kontakty: e-mail, souhlas, čas souhlasu a verze úvodu z ?v=.
         - Nic víc: žádná IP, prohlížeč ani ID návštěvy.                 
      15 --- Klíč je náhodné UUID, ne pořadové číslo: podle pořadí by šel
         - kontakt spárovat s událostí „odeslano“.                       
      14 +-- Kontakty: e-mail, souhlas, čas souhlasu a verze úvodu z ?v= 
         +(podle ní trychtýř počítá odeslání, viz funnel.sql).           
      15 +-- Nic víc: žádná IP, prohlížeč ani ID návštěvy. Klíč je náhodn
         +é UUID, ne pořadové číslo (podle pořadí zápisu                 
      16 +-- by šel kontakt řadit k událostem).                          
      17  create table if not exists public.leads (
      18    id          uuid        primary key default gen_random_uuid()
          ,
      19    email       text        not null unique
     ...
      25  );
      26  
      27  -- Anonymní události z cesty návštěvníka. Bez e-mailu; ID návšt
          ěvy žije jen v paměti jednoho načtení stránky.
      27 --- Čas jen na celé hodiny a klíč náhodný, aby se nedaly řadit p
         -odle pořadí zápisu (viz README, Bezpečnost).                   
      28 +-- Události od odeslání formuláře dál (pokus, chyba, odeslání, 
         +otevření taháku, sdílení) jsou vždy bez ID návštěvy,           
      29 +-- aby nešlo poznat, která návštěva kontakt odeslala. Čas jen n
         +a celé minuty a klíč náhodný (viz README, Měření).             
      30  create table if not exists public.events (
      31    id        uuid        primary key default gen_random_uuid(),
      30 -  navsteva  uuid        not null,                              
      32 +  navsteva  uuid,                                              
      33    udalost   text        not null check (udalost in (
      34                'prichod', 'scroll', 'otoceni_listku', 'vyzva_zob
          razena', 'cta', 'formular_otevren',
      35                'formular_zacatek', 'odeslani_pokus', 'odeslani_c
          hyba', 'odeslano', 'tahak_otevren', 'sdileni')),
      36    varianta  text        not null check (varianta in ('vychozi',
           'dvojce', 'zacatek')),
      37    detail    text        check (detail ~ '^[A-Za-z0-9_:.-]{1,40}
          $'),
      36 -  cas       timestamptz not null default date_trunc('hour', now
         -())                                                            
      38 +  cas       timestamptz not null default date_trunc('minute', n
         +ow()),                                                         
      39 +  check ((navsteva is null) = (udalost in ('odeslani_pokus', 'o
         +deslani_chyba', 'odeslano', 'tahak_otevren', 'sdileni')))      
      40  );
      41  create index if not exists events_udalost_varianta on public.ev
          ents (udalost, varianta);
      42  create index if not exists events_navsteva on public.events (na
          vsteva);
     ...
      77    return 'duplicita';
      78  end $$;
      79  
      77 --- Událost: nejvýš 600 za hodinu z jedné IP a 100 na jednu návš
         -těvu. Vrací 'ok' nebo 'limit'.                                 
      80 +-- Událost: nejvýš 600 za hodinu z jedné IP a 100 na jednu návš
         +těvu (události bez ID návštěvy hlídá jen limit IP).            
      81 +-- Vrací 'ok' nebo 'limit'.                                    
      82  create or replace function public.uloz_udalost(p_klic text, p_n
          avsteva uuid, p_udalost text, p_varianta text, p_detail text)
      83  returns text language plpgsql security invoker set search_path 
          = '' as $$
     … 9 more lines (ctrl+o to expand)

⏺ Teď stránka: události od odeslání dál půjdou bez ID návštěvy.

⏺ Update(public/index.html)
  ⎿  Added 4 lines, removed 2 lines
      497    }
      498    var visitId = uuid();
      499  
      500 -  // Měření: anonymní událost (sendBeacon stránku nezdrží), ni
          -kdy s e-mailem                                                
      500 +  // Měření: anonymní událost (sendBeacon stránku nezdrží), ni
          +kdy s e-mailem. Od odeslání formuláře dál                     
      501 +  // bez ID návštěvy, aby kontakt nešel spárovat s návštěvou (
          +stejný seznam hlídá api/_lib.js i databáze)                   
      502    function track(name, detail) {
      502 -    var e = { navsteva: visitId, udalost: name, varianta: vari
          -ant };                                                        
      503 +    var e = { udalost: name, varianta: variant };             
      504 +    if (!/^(odeslan|tahak|sdileni)/.test(name)) e.navsteva = v
          +isitId;                                                       
      505      detail = String(detail == null ? '' : detail).replace(/[^A
           -Za-z0-9_:.-]/g, '').slice(0, 40);
      506      if (detail) e.detail = detail;
      507      var body = JSON.stringify(e);

⏺ Write(supabase/funnel.sql)
  ⎿  Added 34 lines, removed 25 lines
       4  -- Pohled je ve vlastním schématu „analytika“, které Supabase A
          PI nevystavuje, a běží s právy toho, kdo
       5  -- se ptá (security_invoker). Přes publishable klíč ho tedy nik
          do nepřečte.
       6  --
       7 +-- Kroky 1–3 se počítají z událostí podle ID návštěvy. Odeslání
         + se počítá z tabulky kontaktů podle verze úvodu                
       8 +-- uložené u kontaktu: události od odeslání dál záměrně nemají 
         +ID návštěvy, aby kontakt nešel spárovat s návštěvou.           
       9 +-- Proto u odeslání není „postupně“ (nejde zjistit, které předc
         +hozí kroky odesílající návštěva udělala).                      
      10 +-- Opakovaný e-mail se uloží jen jednou, odeslání jsou tedy nov
         +é kontakty.                                                    
      11 +--                                                             
      12  -- Sloupce:
       8 ---   navstev            kolik návštěv krok udělalo (v libovolné
         -m pořadí; formulář jde otevřít i bez otočení lístku)           
       9 ---                      „otevření formuláře“ = rozbalení nebo p
         -anel (formular_otevren), nebo první klepnutí do                
      10 ---                      formuláře v sekci Tahák, který je vidět
         - pořád a neotvírá se (formular_zacatek)                        
      11 ---   navstev_postupne   kolik návštěv udělalo tenhle krok i vše
         -chny předchozí                                                 
      13 +--   navstev            kroky 1–3: kolik návštěv krok udělalo (
         +v libovolném pořadí; formulář jde otevřít i bez otočení        
      14 +--                      lístku). „Otevření formuláře“ = rozbale
         +ní nebo panel (formular_otevren), nebo první klepnutí do       
      15 +--                      formuláře v sekci Tahák, který je vidět
         + pořád a neotvírá se (formular_zacatek).                       
      16 +--                      Krok 4: kolik nových kontaktů s touhle 
         +verzí úvodu přibylo.                                           
      17 +--   navstev_postupne   kolik návštěv udělalo tenhle krok i vše
         +chny předchozí (u odeslání prázdné, viz výše)                  
      18  --   pct_z_prichodu     navstev / návštěvy s příchodem
      13 ---   pct_z_predchoziho  navstev_postupne / navstev_postupne pře
         -dchozího kroku                                                 
      19 +--   pct_z_predchoziho  kroky 2–3: navstev_postupne / navstev_p
         +ostupne předchozího kroku;                                     
      20 +--                      krok 4: nové kontakty / návštěvy, které
         + otevřely formulář                                             
      21  
      22  create schema if not exists analytika;
      23  revoke all on schema analytika from anon, authenticated;
     ...
      29      navsteva,
      30      bool_or(udalost = 'prichod')          as prichod,
      31      bool_or(udalost = 'otoceni_listku')   as otoceni,
      25 -    bool_or(udalost in ('formular_otevren', 'formular_zacatek')
         -) as formular,                                                 
      26 -    bool_or(udalost = 'odeslano')         as odeslani          
      32 +    bool_or(udalost in ('formular_otevren', 'formular_zacatek')
         +) as formular                                                  
      33    from public.events
      34 +  where navsteva is not null                                   
      35    group by varianta, navsteva
      36  ),
      37  souhrn as (
      38    select
      39      varianta,
      33 -    count(*) filter (where prichod)                            
         -        as prichod,                                            
      34 -    count(*) filter (where otoceni)                            
         -        as otoceni,                                            
      35 -    count(*) filter (where formular)                           
         -        as formular,                                           
      36 -    count(*) filter (where odeslani)                           
         -        as odeslani,                                           
      37 -    count(*) filter (where prichod and otoceni)                
         -        as otoceni_p,                                          
      38 -    count(*) filter (where prichod and otoceni and formular)   
         -        as formular_p,                                         
      39 -    count(*) filter (where prichod and otoceni and formular and
         - odeslani) as odeslani_p                                       
      40 +    count(*) filter (where prichod)                          as
         + prichod,                                                      
      41 +    count(*) filter (where otoceni)                          as
         + otoceni,                                                      
      42 +    count(*) filter (where formular)                         as
         + formular,                                                     
      43 +    count(*) filter (where prichod and otoceni)              as
         + otoceni_p,                                                    
      44 +    count(*) filter (where prichod and otoceni and formular) as
         + formular_p                                                    
      45    from navstevy
      46    group by varianta
      47  ),
      48 +kontakty as (                                                  
      49 +  select varianta, count(*) as odeslani from public.leads group
         + by varianta                                                   
      50 +),                                                             
      51  kroky as (
      44 -  select s.varianta, k.poradi, k.krok, k.navstev, k.navstev_pos
         -tupne, s.prichod                                               
      45 -  from souhrn s                                                
      52 +  select v.varianta, k.poradi, k.krok, k.navstev, k.navstev_pos
         +tupne, k.predchozi, coalesce(s.prichod, 0) as prichod          
      53 +  from (values ('vychozi'), ('dvojce'), ('zacatek')) as v(varia
         +nta)                                                           
      54 +  left join souhrn s using (varianta)                          
      55 +  left join kontakty c using (varianta)                        
      56    cross join lateral (values
      47 -    (1, 'příchod',            s.prichod,  s.prichod),          
      48 -    (2, 'otočení lístku',     s.otoceni,  s.otoceni_p),        
      49 -    (3, 'otevření formuláře', s.formular, s.formular_p),       
      50 -    (4, 'odeslání',           s.odeslani, s.odeslani_p)        
      51 -  ) as k(poradi, krok, navstev, navstev_postupne)              
      57 +    (1, 'příchod',            coalesce(s.prichod, 0),   coalesc
         +e(s.prichod, 0),    null::bigint),                             
      58 +    (2, 'otočení lístku',     coalesce(s.otoceni, 0),   coalesc
         +e(s.otoceni_p, 0),  coalesce(s.prichod, 0)),                   
      59 +    (3, 'otevření formuláře', coalesce(s.formular, 0),  coalesc
         +e(s.formular_p, 0), coalesce(s.otoceni_p, 0)),                 
      60 +    (4, 'odeslání',           coalesce(c.odeslani, 0),  null::b
         +igint,              coalesce(s.formular, 0))                   
      61 +  ) as k(poradi, krok, navstev, navstev_postupne, predchozi)   
      62  )
      63  select
      64    varianta,
     ...
      67    navstev,
      68    navstev_postupne,
      69    round(100.0 * navstev / nullif(prichod, 0), 1) as pct_z_prich
          odu,
      60 -  round(100.0 * navstev_postupne                               
      61 -        / nullif(lag(navstev_postupne) over (partition by varia
         -nta order by poradi), 0), 1) as pct_z_predchoziho              
      70 +  round(100.0 * coalesce(navstev_postupne, navstev) / nullif(pr
         +edchozi, 0), 1) as pct_z_predchoziho                           
      71  from kroky
      72  order by varianta, poradi;
      73  
      65 --- Kontrola proti tabulce kontaktů (opakovaný e-mail se uloží j
         -en jednou, proto může být kontaktů méně než odeslání):         
      66 --- select varianta, count(*) as kontaktu from public.leads grou
         -p by varianta order by varianta;                               
      74 +-- Kolikrát se formulář úspěšně odeslal, včetně opakovaného e-m
         +ailu (události bez ID návštěvy):                               
      75 +-- select varianta, count(*) as odeslani from public.events whe
         +re udalost = 'odeslano' group by varianta;                     

⏺ Teď testy databáze: události bez ID návštěvy, čas na minuty a trychtýř z
  tabulky kontaktů.

⏺ Bash(python3 - <<'EOF'
      p='scripts/test-db.mjs'…)
  ⎿  Updated scripts/test-db.mjs (+19 -8)
       88  check('uloz_udalost: 601. událost z jedné IP za hodinu = limit
           ', (await one('service_role', `select public.uloz_udalost('${K
           LIC(7)}', gen_random_uuid(), 'prichod', 'vychozi', null)`)) ==
           = 'limit');
       89  check('events: databáze odmítne „@“ v detailu', String(await o
           ne('service_role', `select public.uloz_udalost('${KLIC(8)}', g
           en_random_uuid(), 'prichod', 'vychozi', 'jana@example.com')`))
           .includes('check constraint'));
       90  check('events: databáze odmítne neznámou událost', String(awai
           t one('service_role', `select public.uloz_udalost('${KLIC(8)}'
           , gen_random_uuid(), 'nakup', 'vychozi', null)`)).includes('ch
           eck constraint'));
       91 -check('events: čas jen na celé hodiny', (await one('service_ro
          -le', 'select bool_and(cas = date_trunc(\'hour\', cas)) from pu
          -blic.events')) === true);                                     
       91 +check('events: čas jen na celé minuty', (await one('service_ro
          +le', 'select bool_and(cas = date_trunc(\'minute\', cas)) from 
          +public.events')) === true);                                   
       92 +// události od odeslání formuláře dál jsou bez ID návštěvy, os
          +tatní s ním (aby kontakt nešel spárovat s návštěvou)          
       93 +for (const u of ['odeslani_pokus', 'odeslani_chyba', 'odeslano
          +', 'tahak_otevren', 'sdileni']) {                             
       94 +  check(`events: ${u} bez ID návštěvy se uloží`, (await one('s
          +ervice_role', `select public.uloz_udalost('${KLIC(10)}', null,
          + '${u}', 'dvojce', null)`)) === 'ok');                        
       95 +  check(`events: ${u} s ID návštěvy databáze odmítne`, String(
          +await one('service_role', `select public.uloz_udalost('${KLIC(
          +10)}', gen_random_uuid(), '${u}', 'dvojce', null)`)).includes(
          +'check constraint'));                                         
       96 +}                                                             
       97 +check('events: příchod bez ID návštěvy databáze odmítne', Stri
          +ng(await one('service_role', `select public.uloz_udalost('${KL
          +IC(10)}', null, 'prichod', 'dvojce', null)`)).includes('check 
          +constraint'));                                                
       98 +for (let i = 0; i < 100; i++) await one('service_role', `selec
          +t public.uloz_udalost('${KLIC(11)}', null, 'odeslano', 'dvojce
          +', 'sekce')`);                                                
       99 +check('uloz_udalost: události bez ID návštěvy hlídá jen limit 
          +IP (ne 100 na návštěvu)', (await one('service_role', `select p
          +ublic.uloz_udalost('${KLIC(11)}', null, 'odeslano', 'dvojce', 
          +'sekce')`)) === 'ok');                                        
      100  check('limity: klíč musí vypadat jako hash (žádná IP)', String
           (await one('service_role', "select public.zapocitej('192.168.1
           .10', 5)")).includes('check constraint'));
      101  
      102  // --- úklid ---
     ...
      104  const smazano = await one('service_role', 'select public.uklid
           ()');
      105  check('uklid: smaže počítadla starší než 2 dny, novější nechá'
           , smazano === 1 && (await one('service_role', `select count(*)
           ::int from public.limity where klic = '${KLIC(9)}'`)) === 0 &&
            (await one('service_role', 'select count(*)::int from public.
           limity')) > 0, String(smazano));
      106  
       99 -// --- trychtýř ---                                           
      100 -await db.exec('delete from public.events');                   
      107 +// --- trychtýř: kroky 1–3 z událostí podle návštěvy, odeslání
          + z kontaktů podle verze úvodu ---                             
      108 +await db.exec('delete from public.events; delete from public.l
          +eads');                                                       
      109  const ev3 = async (v, items) => { for (const u of items) await
            db.query("insert into public.events (navsteva, udalost, varia
           nta) values ($1, $2, 'dvojce')", [v, u]); };
      102 -await ev3('00000000-0000-4000-8000-000000000001', ['prichod', 
          -'otoceni_listku', 'formular_otevren', 'odeslano']);           
      103 -await ev3('00000000-0000-4000-8000-000000000002', ['prichod', 
          -'formular_zacatek', 'odeslano']); // formulář v sekci Tahák   
      110 +await ev3('00000000-0000-4000-8000-000000000001', ['prichod', 
          +'otoceni_listku', 'formular_otevren']);                       
      111 +await ev3('00000000-0000-4000-8000-000000000002', ['prichod', 
          +'formular_zacatek']); // formulář v sekci Tahák               
      112  await ev3('00000000-0000-4000-8000-000000000003', ['prichod'])
           ;
      105 -const t = (await db.query("select poradi, navstev, navstev_pos
          -tupne, pct_z_prichodu::float p from analytika.trychtyr where v
          -arianta = 'dvojce' order by poradi")).rows;                   
      106 -const got = t.map((r) => `${r.poradi}:${r.navstev}/${r.navstev
          -_postupne}/${r.p}`).join(' ');                                
      107 -check('trychtýř: kroky, postupně i formulář v sekci Tahák', go
          -t === '1:3/3/100 2:1/1/33.3 3:2/1/66.7 4:2/1/66.7', got);     
      113 +await ev3(null, ['odeslani_pokus', 'odeslano', 'odeslano', 'ta
          +hak_otevren']); // bez ID návštěvy: nesmí přibýt návštěva     
      114 +await db.exec("insert into public.leads (email, souhlas, varia
          +nta) values ('a@example.com', true, 'dvojce'), ('b@example.com
          +', true, 'dvojce'), ('c@example.com', true, 'zacatek')");     
      115 +const t = (await db.query("select varianta, poradi, navstev, n
          +avstev_postupne, pct_z_prichodu::float p, pct_z_predchoziho::f
          +loat q from analytika.trychtyr order by varianta, poradi")).ro
          +ws;                                                           
      116 +const radky = (v) => t.filter((r) => r.varianta === v).map((r)
          + => `${r.poradi}:${r.navstev}/${r.navstev_postupne}/${r.p}/${r
          +.q}`).join(' ');                                              
      117 +check('trychtýř: kroky, postupně, formulář v sekci Tahák a ode
          +slání z kontaktů', radky('dvojce') === '1:3/3/100/null 2:1/1/3
          +3.3/33.3 3:2/1/66.7/100 4:2/null/66.7/100', radky('dvojce')); 
      118 +check('trychtýř: verze bez návštěv se ukáže s nulami, kontakty
          + se neztratí', radky('zacatek') === '1:0/0/null/null 2:0/0/nul
          +l/null 3:0/0/null/null 4:1/null/null/null' && radky('vychozi')
          +.startsWith('1:0/0/'), radky('zacatek'));                     
      119  
      120  await db.close();
     … 1 more lines (ctrl+o to expand)

⏺ Bash(python3 - <<'EOF'
      p='scripts/test-db.mjs'…)
  ⎿  Updated scripts/test-db.mjs (+2 -1)
      88  check('uloz_udalost: 601. událost z jedné IP za hodinu = limit'
          , (await one('service_role', `select public.uloz_udalost('${KLI
          C(7)}', gen_random_uuid(), 'prichod', 'vychozi', null)`)) === '
          limit');
      89  check('events: databáze odmítne „@“ v detailu', String(await on
          e('service_role', `select public.uloz_udalost('${KLIC(8)}', gen
          _random_uuid(), 'prichod', 'vychozi', 'jana@example.com')`)).in
          cludes('check constraint'));
      90  check('events: databáze odmítne neznámou událost', String(await
           one('service_role', `select public.uloz_udalost('${KLIC(8)}', 
          gen_random_uuid(), 'nakup', 'vychozi', null)`)).includes('check
           constraint'));
      91 -check('events: čas jen na celé minuty', (await one('service_rol
         -e', 'select bool_and(cas = date_trunc(\'minute\', cas)) from pu
         -blic.events')) === true);                                      
      91 +const casDefault = await one('service_role', "select column_def
         +ault from information_schema.columns where table_name = 'events
         +' and column_name = 'cas'");                                   
      92 +check('events: čas jen na celé minuty (zaokrouhlí databáze)', (
         +await one('service_role', 'select bool_and(cas = date_trunc(\'m
         +inute\', cas)) from public.events')) === true && /date_trunc\('
         +minute'/.test(casDefault), casDefault);                        
      93  // události od odeslání formuláře dál jsou bez ID návštěvy, ost
          atní s ním (aby kontakt nešel spárovat s návštěvou)
      94  for (const u of ['odeslani_pokus', 'odeslani_chyba', 'odeslano'
          , 'tahak_otevren', 'sdileni']) {
      95    check(`events: ${u} bez ID návštěvy se uloží`, (await one('se
          rvice_role', `select public.uloz_udalost('${KLIC(10)}', null, '
          ${u}', 'dvojce', null)`)) === 'ok');

⏺ Databáze: 57 kontrol, 0 chyb. Teď API testy pro události.

⏺ Bash(python3 - <<'EOF'
      p='scripts/test-api.mjs'…)
  ⎿  Updated scripts/test-api.mjs (+15 -1)
      222  const e = r.calls[0] || {};
      223  check('event: platná událost přes sendBeacon (text/plain) → 20
           4 a jedno volání uloz_udalost', r.status === 204 && r.calls.le
           ngth === 1 && e.url === 'https://projekt.supabase.co/rest/v1/r
           pc/uloz_udalost', String(r.status));
      224  check('event: jen ID návštěvy, událost, verze, detail a hash I
           P (čas doplní databáze)', e.body && Object.keys(e.body).sort()
           .join() === 'p_detail,p_klic,p_navsteva,p_udalost,p_varianta' 
           && e.body.p_detail === 'VOO:dvojce', JSON.stringify(e.body));
      225 -for (const [udalost, detail] of [['prichod', null], ['prichod'
          -, 'sdileni'], ['prichod', 'facebook'], ['scroll', '75'], ['cta
          -', 'karty'], ['formular_zacatek', 'sekce'], ['odeslani_chyba',
          - 'mx'], ['tahak_otevren', 'panel'], ['sdileni', 'kopie']]) {  
      225 +for (const [udalost, detail] of [['prichod', null], ['prichod'
          +, 'sdileni'], ['prichod', 'facebook'], ['scroll', '75'], ['cta
          +', 'karty'], ['formular_zacatek', 'sekce']]) {                
      226    r = await run(event, req('/api/event', { body: ev({ udalost,
            detail }), type: 'text/plain' }));
      227    check(`event: ${udalost}${detail ? ` s detailem ${detail}` :
            ''} → 204`, r.status === 204);
      228  }
      229 +// od odeslání formuláře dál bez ID návštěvy (kontakt nejde sp
          +árovat s návštěvou), s ním je to chyba                        
      230 +check('event: seznam událostí bez ID návštěvy', lib.BEZ_NAVSTE
          +VY.join() === 'odeslani_pokus,odeslani_chyba,odeslano,tahak_ot
          +evren,sdileni');                                              
      231 +for (const [udalost, detail] of [['odeslani_pokus', 'lista'], 
          +['odeslani_chyba', 'mx'], ['odeslano', 'sekce'], ['tahak_otevr
          +en', 'panel'], ['sdileni', 'kopie']]) {                       
      232 +  const { navsteva, ...bez } = ev({ udalost, detail });       
      233 +  r = await run(event, req('/api/event', { body: bez, type: 't
          +ext/plain' }));                                               
      234 +  check(`event: ${udalost} bez ID návštěvy → 204, do databáze 
          +jde ID návštěvy null`, r.status === 204 && r.calls[0] && r.cal
          +ls[0].body.p_navsteva === null, `${r.status}`);               
      235 +  r = await run(event, req('/api/event', { body: ev({ udalost,
          + detail }), type: 'text/plain' }));                           
      236 +  check(`event: ${udalost} s ID návštěvy → 400, nic se neuloží
          +`, r.status === 400 && r.json.chyba === 'navsteva' && r.calls.
          +length === 0, `${r.status}`);                                 
      237 +}                                                             
      238 +{                                                             
      239 +  const { navsteva, ...bez } = ev({ udalost: 'prichod', detail
          +: null });                                                    
      240 +  r = await run(event, req('/api/event', { body: bez, type: 't
          +ext/plain' }));                                               
      241 +  check('event: příchod bez ID návštěvy → 400', r.status === 4
          +00 && r.json.chyba === 'navsteva' && r.calls.length === 0);   
      242 +}                                                             
      243  for (const [name, body, chyba] of [
      244    ['neplatné ID návštěvy', ev({ navsteva: 'abc' }), 'navsteva'
           ],
      245    ['neznámá událost', ev({ udalost: 'nakup' }), 'udalost'],

⏺ Jediná chyba je CSP: změnil se skript, takže je potřeba přepočítat hashe. Pak
  upravím Chrome test.
⏺ Bash(node scripts/csp.mjs && grep -n "const visit = evs\[0\]" -A 3
      scripts/test-page.mjs && grep -n "sdileni\|tahak_otevren"
      scripts/test-page.mjs | head)
  ⎿  Updated vercel.json (+3 -3)
      49        "headers": [
      50          {
      51            "key": "Content-Security-Policy",
      52 -          "value": "default-src 'self'; script-src 'sha256-L2ft
         -mCnxaaTzPFKkGtUnqzL+yK0TepsEXS0+FN/S4xY=' 'sha256-Go9SzF1sBkd56
         -VghA3BGabj5odrq0iHus7xzn0oQ3OE='; style-src 'self' 'unsafe-inli
         -ne'; img-src 'self' data:; connect-src 'self'; font-src 'self';
         - object-src 'none'; base-uri 'none'; form-action 'self'; frame-
         -ancestors 'none'"                                              
      52 +          "value": "default-src 'self'; script-src 'sha256-L2ft
         +mCnxaaTzPFKkGtUnqzL+yK0TepsEXS0+FN/S4xY=' 'sha256-1n2JPBIdvnV5T
         +We0pGBALihWrXRJpvj31HVB2i0yv9U='; style-src 'self' 'unsafe-inli
         +ne'; img-src 'self' data:; connect-src 'self'; font-src 'self';
         + object-src 'none'; base-uri 'none'; form-action 'self'; frame-
         +ancestors 'none'"                                              
      53          }
      54        ]
      55      },
     ...
      58        "headers": [
      59          {
      60            "key": "Content-Security-Policy",
      61 -          "value": "default-src 'self'; script-src 'sha256-L2ft
         -mCnxaaTzPFKkGtUnqzL+yK0TepsEXS0+FN/S4xY=' 'sha256-Go9SzF1sBkd56
         -VghA3BGabj5odrq0iHus7xzn0oQ3OE='; style-src 'self' 'unsafe-inli
         -ne'; img-src 'self' data:; connect-src 'self'; font-src 'self';
         - object-src 'none'; base-uri 'none'; form-action 'self'; frame-
         -ancestors 'none'"                                              
      61 +          "value": "default-src 'self'; script-src 'sha256-L2ft
         +mCnxaaTzPFKkGtUnqzL+yK0TepsEXS0+FN/S4xY=' 'sha256-1n2JPBIdvnV5T
         +We0pGBALihWrXRJpvj31HVB2i0yv9U='; style-src 'self' 'unsafe-inli
         +ne'; img-src 'self' data:; connect-src 'self'; font-src 'self';
         + object-src 'none'; base-uri 'none'; form-action 'self'; frame-
         +ancestors 'none'"                                              
      62          }
      63        ]
      64      },
     ...
      67        "headers": [
      68          {
      69            "key": "Content-Security-Policy",
      70 -          "value": "default-src 'self'; script-src 'sha256-L2ft
         -mCnxaaTzPFKkGtUnqzL+yK0TepsEXS0+FN/S4xY=' 'sha256-Go9SzF1sBkd56
         -VghA3BGabj5odrq0iHus7xzn0oQ3OE='; style-src 'self' 'unsafe-inli
         -ne'; img-src 'self' data:; connect-src 'self'; font-src 'self';
         - object-src 'none'; base-uri 'none'; form-action 'self'; frame-
         -ancestors 'none'"                                              
      70 +          "value": "default-src 'self'; script-src 'sha256-L2ft
         +mCnxaaTzPFKkGtUnqzL+yK0TepsEXS0+FN/S4xY=' 'sha256-1n2JPBIdvnV5T
         +We0pGBALihWrXRJpvj31HVB2i0yv9U='; style-src 'self' 'unsafe-inli
         +ne'; img-src 'self' data:; connect-src 'self'; font-src 'self';
         + object-src 'none'; base-uri 'none'; form-action 'self'; frame-
         +ancestors 'none'"                                              
      71          }
      72        ]
      73      }

  Read 1 file (ctrl+o to expand)

⏺ Bash(python3 - <<'EOF'
      p='scripts/test-page.mjs'…)
  ⎿  Updated scripts/test-page.mjs (+14 -6)
      156      const db = await devDb();
      157      const row = db.leads.find((l) => l.email === 'jana@example
           .com');
      158      check('databáze: kontakt uložený jen se sloupci e-mail, so
           uhlas, čas souhlasu a verze', !!row && Object.keys(row).sort()
           .join() === 'email,id,souhlas,souhlas_cas,varianta', JSON.stri
           ngify(row));
      159 -    const visit = evs[0] && evs[0].navsteva;                  
      160 -    const stored = db.events.filter((e) => e.navsteva === visi
          -t).map((e) => `${e.udalost}:${e.detail}`).sort().join();      
      161 -    check('databáze: každá odeslaná událost této návštěvy opra
          -vdu dorazila', !!visit && stored === evs.map((e) => `${e.udalo
          -st}:${e.detail ?? null}`).sort().join() && evs.every((e) => e.
          -navsteva === visit), `${evs.length} odesláno`);               
      159 +    // od odeslání formuláře dál bez ID návštěvy, aby kontakt 
          +nešel spárovat s návštěvou                                    
      160 +    const BEZ = ['odeslani_pokus', 'odeslani_chyba', 'odeslano
          +', 'tahak_otevren', 'sdileni'];                               
      161 +    const sVisit = evs.filter((e) => !BEZ.includes(e.udalost))
          +;                                                             
      162 +    const sBez = evs.filter((e) => BEZ.includes(e.udalost));  
      163 +    const key = (e) => `${e.udalost}:${e.detail ?? null}`;    
      164 +    const visit = sVisit[0] && sVisit[0].navsteva;            
      165 +    const stored = db.events.filter((e) => e.navsteva === visi
          +t).map(key).sort().join();                                    
      166 +    check('databáze: každá odeslaná událost této návštěvy opra
          +vdu dorazila', !!visit && stored === sVisit.map(key).sort().jo
          +in() && sVisit.every((e) => e.navsteva === visit), `${sVisit.l
          +ength} odesláno`);                                            
      167 +    check('měření: pokus, chyby a odeslání bez ID návštěvy', s
          +Bez.length >= 5 && sBez.every((e) => !('navsteva' in e)) && sB
          +ez.some((e) => e.udalost === 'odeslano'), sBez.map(key).join()
          +);                                                            
      168 +    check('databáze: události bez ID návštěvy dorazily a ID v 
          +nich není', db.events.filter((e) => e.navsteva === null).map(k
          +ey).sort().join() === sBez.map(key).sort().join(), `${sBez.len
          +gth} odesláno`);                                              
      169      check('databáze: v událostech nikde e-mail', !JSON.stringi
           fy(db.events).includes('@'));
      170      check('měření: nikde e-mail', !JSON.stringify(evs).include
           s('@'));
      171      const names = evs.map((e) => e.udalost);
     ...
      272        await page.tap(`${T} [data-tahak]`);
      273        await sleep(250);
      274        const op = events(logs).filter((e) => e.udalost === 'tah
           ak_otevren');
      268 -      check('měření: otevření taháku', op.length === 1 && op[0
          -].detail === 'sekce', JSON.stringify(op));                    
      275 +      check('měření: otevření taháku, bez ID návštěvy', op.len
          +gth === 1 && op[0].detail === 'sekce' && !('navsteva' in op[0]
          +), JSON.stringify(op));                                       
      276      }
      277      await page.tap(`${T} [data-sdilej]`);
      278      await sleep(300);
      272 -    const sh = events(logs).filter((e) => e.udalost === 'sdile
          -ni').map((e) => e.detail);                                    
      273 -    check(`měření: sdílení (${mode})`, sh.join() === mode, sh.
          -join());                                                      
      279 +    const shEv = events(logs).filter((e) => e.udalost === 'sdi
          +leni');                                                       
      280 +    const sh = shEv.map((e) => e.detail);                     
      281 +    check(`měření: sdílení (${mode}), bez ID návštěvy`, sh.joi
          +n() === mode && shEv.every((e) => !('navsteva' in e)), sh.join
          +());                                                          
      282      if (mode === 'kopie') check('sdílení bez nativní nabídky: 
           odkaz zkopírovaný', ((await text(page, `${T} [data-sdileni-sta
           v]`)) || '').startsWith('Odkaz je zkopírovaný'));
      283      if (mode === 'rucne') {
      284        const url = await page.$eval(`${T} .share-url`, (i) => i
           .value).catch(() => null);

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Všechny testy prošly: API 127, Chrome 125, JS má 19 379 B. Teď dokumentace:
  README, zásady ochrany údajů a rozhodnutí v CLAUDE.md.

⏺ Bash(python3 - <<'EOF'
      p='README.md'…)
  ⎿  Updated CLAUDE.md (+1 -0)
      52  - **Konverze = návštěva → odeslaný formulář.** Proč: oba konce 
          trychtýře změříme vlastním měřením, bez dat z reklamního systém
          u.
      53  - **Měření: vlastní anonymní eventy do Supabase, žádné GA4, pix
          el ani cookie lišta.** Stránka posílá eventy (příchod, hloubka 
          scrollu, otočení lístku, zobrazení výzvy, otevření a odeslání f
          ormuláře, otevření taháku, sdílení) přes `/api/event`, kontakt 
          přes `/api/lead`. ID návštěvy žije jen v paměti po dobu jednoho
           načtení stránky; nic se neukládá do prohlížeče (žádné cookies,
           `localStorage` ani `sessionStorage`). Trychtýř se počítá SQL d
          otazem. Proč: GA4 by potřebovalo souhlas a cookie lišta na mobi
          lu zdržuje a ubírá konverze.
      54  - **ID návštěvy se nikdy nespojuje s e-mailem.** Neukládej ho d
          o tabulky kontaktů a neposílej ho spolu s e-mailem. Proč: z ano
          nymních eventů by se staly osobní údaje. Před ostrou kampaní po
          soudí měření právník (poznámka je v README).
      55 +- **Události od odeslání formuláře dál jsou bez ID návštěvy** (
         +`odeslani_pokus`, `odeslani_chyba`, `odeslano`, `tahak_otevren`
         +, `sdileni`; seznam je v `api/_lib.js` a hlídá ho i databáze). 
         +Verze úvodu se ukládá ke kontaktu, trychtýř počítá odeslání z t
         +abulky kontaktů a čas událostí je jen na minuty. Proč: podle ud
         +álostí s ID návštěvy kolem odeslání by šlo poznat, která návště
         +va kontakt odeslala. V textech netvrdíme, že spárování je nemož
         +né.                                                            
      56  - **Koncept stránky: „dvojčata“.** Návštěvník klepne na americk
          é ETF a uvidí jeho evropskou UCITS obdobu. Lead magnet je PDF t
          ahák; o e-mail žádáme po prvním výsledku a tlačítkem pořád vidě
          t dole. Detaily (cílovka, pořadí sekcí, proč) jsou v README, te
          xty v `texty.md`, reklamy v `reklamy/`. Proč: stavíme na ověřen
          ém faktu, který návštěvník jinde snadno nenajde.
      57  - **Název stránky: ETF dvojčata.** Design: směr B „Tahák v seši
          tě“ z `design.md`, čistě a důvěryhodně, nesmí působit dětsky (p
          ravidla jsou v `design.md`).
      58  - **Nic absolutního netvrdíme.** Nepíšeme „VOO nekoupíš“, ale „
          broker ti ho často nenabídne“. Proč: XTB má VOO.US jako ETF a Č
          NB připouští execution-only bez KID.
  ⎿  Updated README.md (+10 -4)
      74  | `tahak_otevren` | klepnutí na „Otevřít tahák“ | kde: `panel`,
           `listky`, `sekce` |
      75  | `sdileni` | „Poslat odkaz kamarádovi“ | `nativni`, `zruseno`,
           `kopie`, `rucne` |
      76  
      77 -- **Každá událost má ID návštěvy** (náhodné UUID jen v paměti j
         -ednoho načtení stránky), název, verzi úvodu z `?v=` a krátký de
         -tail. Do prohlížeče se nic neukládá.                           
      78 -- **Trychtýř podle verzí úvodu** počítá pohled `analytika.trych
         -tyr` ze [supabase/funnel.sql](supabase/funnel.sql): příchod → o
         -točení lístku → otevření formuláře → odeslání. U každého kroku 
         -je, kolik návštěv ho udělalo, kolik udělalo i všechny předchozí
         - a podíl z příchodů.                                           
      79 -- **ID návštěvy se nikdy nespojuje s e-mailem.** Kontakt jde ji
         -nou funkcí ([`/api/lead`](api/lead.js)) do jiné tabulky, bez ID
         - návštěvy. Funkce kontakt s ID odmítne a detail události bere j
         -en z pevného seznamu hodnot. Klíče řádků jsou náhodná UUID a ča
         -s událostí je jen na celé hodiny. **Úplně spárování vyloučit ne
         -jde:** kdo má plný přístup do databáze, může při malém provozu 
         -odhadnout, která návštěva odeslala který kontakt, podle hodiny 
         -a pořadí zápisu v Postgresu. ID návštěvy je proto pseudonymní ú
         -daj, ne anonymní. Podrobnosti jsou v sekci [Bezpečnost a ochran
         -a proti spamu](#bezpečnost-a-ochrana-proti-spamu).             
      77 +- **ID návštěvy** (náhodné UUID jen v paměti jednoho načtení st
         +ránky) mají jen události do otevření formuláře. Události od ode
         +slání dál (`odeslani_pokus`, `odeslani_chyba`, `odeslano`, `tah
         +ak_otevren`, `sdileni`) jdou **bez ID návštěvy**, jen s verzí ú
         +vodu z `?v=` a detailem. Do prohlížeče se nic neukládá.        
      78 +- **Trychtýř podle verzí úvodu** počítá pohled `analytika.trych
         +tyr` ze [supabase/funnel.sql](supabase/funnel.sql): příchod → o
         +točení lístku → otevření formuláře → odeslání. Kroky 1–3 se poč
         +ítají z událostí podle ID návštěvy: kolik návštěv krok udělalo,
         + kolik i všechny předchozí a podíl z příchodů. Odeslání se počí
         +tá z tabulky kontaktů podle verze úvodu, kterou ukládáme ke kon
         +taktu. U odeslání proto nejde říct, které předchozí kroky ta ná
         +vštěva udělala, a opakovaný e-mail se nepočítá dvakrát.        
      79 +- **Kontakt a návštěva se nespojují.** Co pro to děláme:       
      80 +  - e-mail jde jinou funkcí ([`/api/lead`](api/lead.js)) do jin
         +é tabulky a nikdy s ID návštěvy (funkce kontakt s ID odmítne), 
      81 +  - události od odeslání dál nemají ID návštěvy, takže z měření
         + nejde vyčíst, která návštěva formulář odeslala. Hlídá to funkc
         +e i kontrola na tabulce v databázi,                            
      82 +  - čas událostí je jen na celé minuty a klíče řádků jsou náhod
         +ná UUID, ne pořadová čísla,                                    
      83 +  - detail události bere funkce jen z pevného seznamu hodnot, t
         +akže se do měření nedá zapsat nic jiného.                      
      84 +                                                               
      85 +  **Nemožné to není.** Kdo má přímý přístup do databáze, vidí i
         + pořadí zápisu (systémové sloupce Postgresu). Při malém provozu
         + může odhadnout, která návštěva otevřela formulář těsně předtím
         +, než přibyl kontakt se stejnou verzí úvodu. Když v té době for
         +mulář otevřela jen jedna návštěva, bude odhad nejspíš správný. 
         +S rostoucím provozem se zhoršuje. ID návštěvy proto beru jako p
         +seudonymní údaj, ne anonymní.                                  
      86  - **Ověřeno automaticky:** test v Chromu porovná události, kter
          é stránka odeslala, s tím, co lokální server uložil, a kontrolu
          je, že v nich nikde není e-mail. Vlastní funkce mají testy s po
          dvrženou databází ([scripts/test-api.mjs](scripts/test-api.mjs)
          ).
      87  - **Před ostrou kampaní by měl měření posoudit právník.** Do pr
          ohlížeče sice nic neukládáme, ale i JavaScript, který z prohlíž
          eče odesílá data, může podle výkladu Evropského sboru pro ochra
          nu osobních údajů (pokyny 2/2023) vyžadovat souhlas. Tenhle výk
          lad jsme z primárního zdroje neověřovali, proto ho necháváme na
           právníkovi.
      88  
     ...
      112  |---|---|---|
      113  | Spam a cizí e-maily přes API: skript bez hlavičky `Origin` m
           ohl posílat kontakty donekonečna, proti tomu bylo jen skryté p
           ole. | střední | **Opraveno** body 3 až 8 výše. Zůstává jedna 
           věc: kdo zná cizí existující adresu, může ji zapsat. To žádná 
           kontrola na stránce nepozná, pomůže jen double opt-in (níže). 
           |
      114  | Zahlcení `/api/event` nebo ukládání libovolných dat přes měř
           ení. | střední | **Opraveno:** detail události jen z pevného s
           eznamu hodnot pro každou událost (např. `scroll` jen 25/50/75/
           100), nejvýš 600 událostí za hodinu z jedné IP a 100 na návště
           vu (počítá databáze), tělo nejvýš 512 B. |
      109 -| Spárování e-mailu s návštěvou podle pořadí zápisu: tabulky m
          -ěly pořadová čísla, takže k-tý kontakt odpovídal k-té události
          - `odeslano`. README přitom tvrdilo, že spárovat nejdou. | stře
          -dní (soukromí, jen pro toho, kdo má přístup do databáze) | **Č
          -ástečně:** klíče jsou náhodná UUID a nepravdivé tvrzení je opr
          -avené. Úplně to vyloučit nejde: při malém provozu lze páry odh
          -adnout podle hodiny a systémových sloupců Postgresu. Spolehliv
          -ě by pomohlo jen neposílat ID návštěvy u událostí kolem odeslá
          -ní, což mění měření. To je rozhodnutí pro tebe a právníka, ne 
          -pro mě. |                                                     
      115 +| Spárování e-mailu s návštěvou podle pořadí zápisu: tabulky m
          +ěly pořadová čísla, takže k-tý kontakt odpovídal k-té události
          + `odeslano`. README přitom tvrdilo, že spárovat nejdou. | stře
          +dní (soukromí, jen pro toho, kdo má přístup do databáze) | **O
          +praveno:** klíče jsou náhodná UUID, události od odeslání dál n
          +emají ID návštěvy, verze úvodu je u kontaktu a trychtýř počítá
          + odeslání z kontaktů, čas událostí je na minuty. Nepravdivé tv
          +rzení je opravené. Co zůstává při malém provozu, je popsané v 
          +sekci [Měření](#měření-cesty-návštěvníka). |                  
      116  | Skryté pole kontrolované v prohlížeči tiše zahodilo kontakt,
            když ho vyplnilo automatické vyplňování formulářů. | nízká (z
           tracené kontakty) | **Opraveno:** rozhoduje jen server a pole 
           se jmenuje `poznamka`, což automatické vyplňování nezná. |
      117  | Chybějící bezpečnostní hlavičky. | nízká (obrana do hloubky)
            | **Opraveno ve [vercel.json](vercel.json):** Content-Securit
           y-Policy s hashi obou vložených skriptů (bez `unsafe-inline` p
           ro skripty, test ověřuje, že podstrčený skript se nespustí; ha
           she hlídá [scripts/csp.mjs](scripts/csp.mjs)), HSTS, `nosniff`
           , Referrer-Policy, Permissions-Policy, COOP a zákaz vkládání d
           o rámu. Lighthouse ani stránku to nerozbilo, lokální server po
           sílá stejné hlavičky. |
      118  | Výchozí práva Supabase dávají anonymní roli přístup ke každé
            nové tabulce a funkci v `public`. | nízká (obrana do hloubky)
            | **Opraveno:** schéma výchozí práva odebere a test v PGlite 
           ověřuje, že anonymní ani přihlášená role nic nepřečte, nezapíš
           e ani nezavolá. |
  ⎿  Updated public/ochrana-osobnich-udaju.html (+1 -1)
      38  <h2>Jaké údaje a proč</h2>
      39  <ul>
      40    <li><b>E-mail a souhlas.</b> Když vyplníš formulář u&nbsp;tah
          áku, uložíme tvůj e-mail, souhlas, čas, kdy byl udělen, a verzi
           stránky, ze které přišel (podle reklamy). Použijeme je k&nbsp;
          posílání e-mailů o&nbsp;investování do ETF.</li>
      41 -  <li><b>Měření návštěvnosti.</b> Stránka zaznamenává anonymní 
         -události: příchod, jak daleko je stránka posunutá, otočení líst
         -ku s&nbsp;ETF, otevření a&nbsp;odeslání formuláře, otevření tah
         -áku a&nbsp;sdílení odkazu. Identifikátor návštěvy existuje jen 
         -v&nbsp;paměti prohlížeče po dobu jednoho načtení stránky, nic s
         -e neukládá do prohlížeče (žádné cookies) a&nbsp;s&nbsp;e-mailem
         - se nikdy nespojuje. Čas události ukládáme jen s&nbsp;přesností
         - na hodinu.</li>                                               
      41 +  <li><b>Měření návštěvnosti.</b> Stránka zaznamenává anonymní 
         +události: příchod, jak daleko je stránka posunutá, otočení líst
         +ku s&nbsp;ETF, otevření a&nbsp;odeslání formuláře, otevření tah
         +áku a&nbsp;sdílení odkazu. Identifikátor návštěvy existuje jen 
         +v&nbsp;paměti prohlížeče po dobu jednoho načtení stránky a&nbsp
         +;nic se neukládá do prohlížeče (žádné cookies). K&nbsp;e-mailu 
         +ho neukládáme a&nbsp;s&nbsp;e-mailem ho neposíláme. Odeslání fo
         +rmuláře a&nbsp;všechno po něm (otevření taháku, sdílení) zaznam
         +enáváme úplně bez identifikátoru návštěvy, aby se e-mail nedal 
         +přiřadit ke konkrétní návštěvě. Čas události ukládáme jen s&nbs
         +p;přesností na minutu. Úplně vyloučit přiřazení nejde: kdo má p
         +řístup do databáze, mohl by při malé návštěvnosti podle času od
         +hadnout, která návštěva formulář vyplňovala.</li>              
      42    <li><b>Technické záznamy hostingu.</b> Poskytovatel hostingu 
          (Vercel) může v&nbsp;záznamech o&nbsp;přístupu zpracovávat např
          íklad IP adresu. Jak dlouho je uchovává: <span class="doplni">d
          oplní správce</span>.</li>
      43  </ul>
      44  

  Called plugin:context-mode:context-mode, ran 2 shell commands (ctrl+o to expand)

⏺ Bod 4 je hotový (59773e2). Bod 5: kontroluju, jestli je u lístků vidět zdroj
  dat, datum a upozornění, že nejde o investiční doporučení.

  Read 1 file, called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Karty teď mají zdroj a datum ověření, ale chybí upozornění na to, že nejde o
  investiční doporučení, a zdroj je neúplný – informace o nákupu ETF pochází i z
  webů brokerů. Teď se zaměřím na styl razítka.

  Searched for 2 patterns (ctrl+o to expand)

⏺ Bash(python3 - <<'EOF'
      p='public/index.html'…)
  ⎿  Updated public/index.html (+1 -1)
      272        <p class="small">ISINy, poplatky a&nbsp;postup nákupu kr
           ok za krokem. PDF hned a&nbsp;zdarma.</p>
      273        <div class="form-slot" data-slot="vyber"></div>
      274      </div>
      275 -    <p class="stamp">Data přímo od správců fondů, ověřeno 10.&
          -nbsp;10.&nbsp;2026</p>                                        
      275 +    <p class="stamp">Data od správců fondů a&nbsp;brokerů, ově
          +řeno 10.&nbsp;10.&nbsp;2026 (<a href="#data">zdroje</a>). Není
          + to investiční doporučení.</p>                                
      276    </div>
      277  </section>
      278  
  ⎿  Updated texty.md (+1 -1)
      78  - **Po prvním otočení se pod lístky objeví výzva:**
      79    - tlačítko: Chci tahák se všemi 7 dvojčaty. Formulář se rozba
          lí na místě.
      80    - pod ním: ISINy, poplatky a postup nákupu krok za krokem. PD
          F hned a zdarma.
      81 -- **Pod výběrem:** Data přímo od správců fondů, ověřeno 10. 10.
         - 2026                                                          
      81 +- **Pod výběrem (u lístků, ne až v patičce):** Data od správců 
         +fondů a brokerů, ověřeno 10. 10. 2026 (zdroje). Není to investi
         +ční doporučení. „zdroje“ vede na sekci se zdroji. `[d: meta.ove
         +reno_dne]`                                                     
      82    `[d: meta.overeno_dne]`
      83  
      84  ---

⏺ Bash(python3 - <<'EOF'
      p='texty.md'…)
  ⎿  Updated texty.md (+1 -1)
      78  - **Po prvním otočení se pod lístky objeví výzva:**
      79    - tlačítko: Chci tahák se všemi 7 dvojčaty. Formulář se rozba
          lí na místě.
      80    - pod ním: ISINy, poplatky a postup nákupu krok za krokem. PD
          F hned a zdarma.
      81 -- **Pod výběrem (u lístků, ne až v patičce):** Data od správců 
         -fondů a brokerů, ověřeno 10. 10. 2026 (zdroje). Není to investi
         -ční doporučení. „zdroje“ vede na sekci se zdroji. `[d: meta.ove
         -reno_dne]`                                                     
      81 +- **Pod výběrem (u lístků, ne až v patičce):** Data od správců 
         +fondů a brokerů, ověřeno 10. 10. 2026 (zdroje). Není to investi
         +ční doporučení. „zdroje“ vede na sekci se zdroji.              
      82    `[d: meta.overeno_dne]`
      83  
      84  ---

⏺ Commit security review found: privacy-deanonymization in supabase/schema.sql

⏺ Bezpečnostní kontrola oznámila riziko deanonymizace v schema.sql, ale bez
  detailů – po vlastním prověření jde o zbytkové riziko (pořadí zápisu, čas)
  popsané v README a navíc zúžení kandidátů kvůli místu formuláře v eventu
  odeslání, což doplním do bodu 11. Teď dokončuji bod 5: přidal jsem razítko u
  lístků a ověřuji zobrazení na 360 px.

  Read 1 file, called plugin:context-mode:context-mode 2 times (ctrl+o to expand)

⏺ Na 360 px vypadá razítko klidně: dva řádky drobným písmem pod výzvou. Přidám
  do testu kontrolu, že zdroj, datum, odkaz na zdroje i upozornění zůstanou u
  lístků.

⏺ Update(scripts/test-page.mjs)
  ⎿  Added 2 lines
      84      const { page, logs } = await open();
      85      check('lišta dole je na začátku schovaná', !(await visible(
          page, '#lista')));
      86      check('výzva k taháku je před otočením schovaná', !(await v
          isible(page, '#vyber-cta')));
      87 +    const stamp = await page.$eval('#vyber .stamp', (p) => `${p
         +.textContent.replace(/ /g, ' ')}|${p.querySelector('a[href="#da
         +ta"]') ? 'odkaz' : ''}`).catch(() => '');                      
      88 +    check('u lístků (ne až v patičce): zdroj dat, datum, odkaz 
         +na zdroje a „Není to investiční doporučení“', /správců fondů a 
         +brokerů, ověřeno \d{1,2}\. \d{1,2}\. \d{4}/.test(stamp) && stam
         +p.includes('Není to investiční doporučení.') && stamp.endsWith(
         +'|odkaz') && await visible(page, '#vyber .stamp'), stamp);     
      89      const rot = await page.$$eval('.listek', (ls) => ls.map((l)
           => {
      90        const m = getComputedStyle(l).transform;
      91        if (m === 'none') return 0;

  Called plugin:context-mode:context-mode, ran 1 shell command (ctrl+o to expand)

⏺ Bod 5 je hotový (12f5c89). Teď README, body 6 až 11. Pro odhad konverze a ceny
  kontaktu potřebuju benchmarky se skutečným zdrojem, tak je dohledám.

⏺ Web Search("Unbounce Conversion Benchmark Report median landing page
            conversion rate finance industry")
  ⎿  Did 1 search in 5s

⏺ Web Search("WordStream Facebook ads benchmarks 2025 average cost per click
            finance insurance traffic campaigns")
  ⎿  Did 1 search in 6s

⏺ Výsledky vyhledávání jsou z velké části přepisy třetích stran. Ověřím čísla
  přímo na stránkách Unbounce a WordStreamu.

⏺ Fetch(https://unbounce.com/landing-pages/whats-a-good-conversion-rate/)
  ⎿  Error: PreToolUse:WebFetch hook error: context-mode: WebFetch redirected.
     Call mcp__plugin_context-mode_context-mode__ctx_fetch_and_index(url:
     "https://unbounce.com/landing-pages/whats-a-good-conversion-rate/", source:
     "...") to fetch + index the page, then
     mcp__plugin_context-mode_context-mode__ctx_search(queries: [...]) to query
     the indexed content — the raw page bytes stay in storage instead of
     entering your conversation. Or call
     mcp__plugin_context-mode_context-mode__ctx_execute(language, code) when you
     want to derive your answer in one round trip (parse, extract, count)
     without persisting the response. Both have full network access. Retry the
     same call on a transient DNS error (EAI_AGAIN, ETIMEDOUT, ENETUNREACH).

⏺ Fetch(https://www.wordstream.com/blog/facebook-ads-benchmarks-2025)
  ⎿  Error: PreToolUse:WebFetch hook error: context-mode: WebFetch redirected.
     Call mcp__plugin_context-mode_context-mode__ctx_fetch_and_index(url:
     "https://www.wordstream.com/blog/facebook-ads-benchmarks-2025", source:
     "...") to fetch + index the page, then
     mcp__plugin_context-mode_context-mode__ctx_search(queries: [...]) to query
     the indexed content — the raw page bytes stay in storage instead of
     entering your conversation. Or call
     mcp__plugin_context-mode_context-mode__ctx_execute(language, code) when you
     want to derive your answer in one round trip (parse, extract, count)
     without persisting the response. Both have full network access. Retry the
     same call on a transient DNS error (EAI_AGAIN, ETIMEDOUT, ENETUNREACH).

  Called plugin:context-mode:context-mode 3 times (ctrl+o to expand)

⏺ Unbounce data mám potvrzená (medián 6,6 %, finanční služby 8,3 %, investování
  3,9 %), ale starší stránka uvádí 3,8 %, proto do README uvedu obě hodnoty.
  WordStream vrátil 403, zkusím místo něj LocaliQ.

  Called plugin:context-mode:context-mode 2 times (ctrl+o to expand)

⏺ Potvrdil jsem si u LocaliQ údaje z přehledu „Facebook Advertising Benchmarks
  for 2026“ – průměrná CPC 0,60 $ napříč obory a 0,86 $ pro Finance & Insurance,
  český trh v datech chybí, takže cenu v korunách budu uvádět jako vlastní
  odhad. Teď si v zadání ověřím požadavky na obchodní pohled a konverzi.

  Searched for 1 pattern (ctrl+o to expand)
⏺ Zadání vyžaduje v README zdůvodnění pořadí sekcí, očekávanou konverzi a tři
  hypotézy na A/B test, obchodní pohled napíšu obecně bez vymyšlených čísel. Než
  README přepíšu, projdu deník práce s AI a podklady k reklamám a datům.

  Searched for 1 pattern, read 2 files, ran 1 shell command (ctrl+o to expand)

⏺ Pracuju na README (body 6 až 11). Teď počítám velikosti vzorků pro A/B
  hypotézy a cenu za kontakt, ať jsou čísla v README spočítaná, ne odhadnutá od
  oka.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Přidám do lokálního serveru adresu /__dev/trychtyr, ať jde trychtýř ukázat i
  bez přístupu do Supabase. Pak napíšu shrnutí a návod na vyzkoušení.

⏺ Bash(python3 - <<'EOF'
      p='scripts/server.mjs'…)
  ⎿  Updated scripts/server.mjs (+20 -2)
      1  // Lokální server: statické soubory z public/ a funkce z api/ (s
         tejně jako na Vercelu), včetně hlaviček z vercel.json.
      2  // Bez proměnných SUPABASE_* běží s podvrženou databází: PGlite 
         (Postgres ve WASM) se skutečným supabase/schema.sql,
      3 -// funkce volají jeho funkce stejně jako na Supabase. Na /__dev/
        -db je vidět, co by se uložilo – jen z tohohle                   
      4 -// počítače (ne z telefonu v síti) a jen přes adresu localhost /
        - 127.0.0.1. Na Vercel se tenhle soubor nedostane.               
      3 +// funkce volají jeho funkce stejně jako na Supabase. Na /__dev/
        +db je vidět, co by se uložilo, na /__dev/trychtyr               
      4 +// trychtýř z funnel.sql – jen z tohohle počítače (ne z telefonu
        + v síti) a jen přes adresu localhost / 127.0.0.1.               
      5 +// Na Vercel se tenhle soubor nedostane.                        
      6  // Se skutečnou databází: node --env-file=../.env.local server.m
         js  (klíče se nikdy nevypisují)
      7  // Použití: node server.mjs   (HOST=0.0.0.0 pro telefon ve stejn
         é Wi-Fi, PORT=8737)
      8  import { createServer } from 'node:http';
     ...
      116    res.end(JSON.stringify({ leads: leads.rows, events: events.r
           ows, limity: limity.rows, vypadek }));
      117  }
      118  
      119 +// Trychtýř z analytika.trychtyr (stejné SQL jako v Supabase) 
          +jako textová tabulka, s ?json jako JSON.                      
      120 +async function devFunnel(req, res, url) {                     
      121 +  if (!devAllowed(req)) { res.writeHead(403).end(); return log
          +(req, 403); }                                                 
      122 +  const rows = (await db.query('select * from analytika.trycht
          +yr')).rows;                                                   
      123 +  if (url.searchParams.has('json')) {                         
      124 +    res.writeHead(200, { 'Content-Type': 'application/json', '
          +Cache-Control': 'no-store' });                                
      125 +    return res.end(JSON.stringify(rows));                     
      126 +  }                                                           
      127 +  const cols = ['varianta', 'poradi', 'krok', 'navstev', 'navs
          +tev_postupne', 'pct_z_prichodu', 'pct_z_predchoziho'];        
      128 +  const cell = (v) => (v == null ? '–' : String(v));          
      129 +  const width = cols.map((c) => Math.max(c.length, ...rows.map
          +((r) => cell(r[c]).length)));                                 
      130 +  const line = (vals) => vals.map((v, i) => v.padEnd(width[i])
          +).join('  ');                                                 
      131 +  res.writeHead(200, { 'Content-Type': 'text/plain; charset=ut
          +f-8', 'Cache-Control': 'no-store' });                         
      132 +  res.end([line(cols), ...rows.map((r) => line(cols.map((c) =>
          + cell(r[c]))))].join('\n') + '\n');                           
      133 +}                                                             
      134 +                                                              
      135  async function serveStatic(req, res, url) {
      136    let path;
      137    try { path = normalize(join(PUBLIC, decodeURIComponent(url.p
           athname))); } catch { res.writeHead(400).end(); return log(req
           , 400); }
     ...
      155      const fn = url.pathname.match(/^\/api\/([a-z]+)$/);
      156      if (fn && FUNCTIONS.includes(fn[1])) return await callFunc
           tion(fn[1], req, res);
      157      if (fake && url.pathname === '/__dev/db') return await dev
           Db(req, res, url);
      158 +    if (fake && url.pathname === '/__dev/trychtyr') return awa
          +it devFunnel(req, res, url);                                  
      159      if (req.method !== 'GET' && req.method !== 'HEAD') { res.w
           riteHead(405).end(); return log(req, 405); }
      160      return await serveStatic(req, res, url);
      161    } catch (e) {

⏺ Update(scripts/test-page.mjs)
  ⎿  Added 3 lines
      169      check('měření: pokus, chyby a odeslání bez ID návštěvy', s
           Bez.length >= 5 && sBez.every((e) => !('navsteva' in e)) && sB
           ez.some((e) => e.udalost === 'odeslano'), sBez.map(key).join()
           );
      170      check('databáze: události bez ID návštěvy dorazily a ID v 
           nich není', db.events.filter((e) => e.navsteva === null).map(k
           ey).sort().join() === sBez.map(key).sort().join(), `${sBez.len
           gth} odesláno`);
      171      check('databáze: v událostech nikde e-mail', !JSON.stringi
           fy(db.events).includes('@'));
      172 +    const tr = await fetch(`${BASE}__dev/trychtyr?json`).then(
          +(r) => r.json()).catch(() => []);                             
      173 +    const krok4 = tr.find((r) => r.varianta === 'vychozi' && r
          +.poradi === 4);                                               
      174 +    check('lokální trychtýř (/__dev/trychtyr): odeslání se poč
          +ítá z kontaktů podle verze úvodu', !!krok4 && Number(krok4.nav
          +stev) === db.leads.filter((l) => l.varianta === 'vychozi').len
          +gth && Number(krok4.navstev) >= 1 && krok4.navstev_postupne ==
          += null, JSON.stringify(krok4));                               
      175      check('měření: nikde e-mail', !JSON.stringify(evs).include
           s('@'));
      176      const names = evs.map((e) => e.udalost);
      177      for (const n of ['prichod', 'otoceni_listku', 'vyzva_zobra
           zena', 'cta', 'formular_otevren', 'formular_zacatek', 'odeslan
           i_pokus', 'odeslani_chyba', 'odeslano']) check(`měření: událos
           t ${n}`, names.includes(n));

⏺ Teď napíšu do README shrnutí a sekci „Jak to vyzkoušet za 2 minuty“.

⏺ Bash(python3 - <<'EOF'
      p='README.md'…)
  ⎿  Updated README.md (+20 -5)
       1 -# Srovnání ETF z NYSE – konverzní landing page                 
       1 +# ETF dvojčata – konverzní landing page (zadání B)             
       2  
       3 -Řešení zadání B (konverzní landing page) do výběrového řízení n
         -a pozici Junior AI Developer.                                  
       3 +**Stránka:** [etf-dvojcata-demo.vercel.app](https://etf-dvojcat
         +a-demo.vercel.app/) · reklama A „Dvojče“: [?v=dvojce](https://e
         +tf-dvojcata-demo.vercel.app/?v=dvojce) · reklama B „Začátek“: [
         +?v=zacatek](https://etf-dvojcata-demo.vercel.app/?v=zacatek)   
       4 +**Myšlenka:** americká ETF ti broker v Česku často nenabídne. S
         +tránka k 7 známým ETF z NYSE jedním klepnutím ukáže evropské „d
         +vojče“, které koupíš, a za e-mail dá PDF tahák s postupem nákup
         +u.                                                             
       5 +**Očekávaná konverze** (návštěva → odeslaný formulář): 2–13 %, 
         +nejspíš kolem 6 %. Je to odhad, [výpočet po krocích](#očekávaná
         +-konverze).                                                    
       6 +**Do ostrého spuštění chybí:** posouzení právníkem, údaje a e-m
         +ailová služba od správce, hotové obrázky reklam a ověření pravi
         +del Meta pro finanční reklamu ([seznam](#před-spuštěním-kampaně
         +)).                                                            
       7  
       5 -- **Stránka:** [etf-dvojcata-demo.vercel.app](https://etf-dvojc
         -ata-demo.vercel.app/) (po nasazení; neoficiální ukázka, proto b
         -ez jména Clientela v adrese)                                   
       6 -- **Obě verze reklamy:** [reklamy/](reklamy/)                  
       7 -- **Exporty konverzací s AI:** [ai-log/](ai-log/)              
       8 +## Jak to vyzkoušet za 2 minuty                                
       9 +                                                               
      10 +**Na mobilu:**                                                 
      11 +                                                               
      12 +1. Otevři [etf-dvojcata-demo.vercel.app/?v=dvojce](https://etf-
         +dvojcata-demo.vercel.app/?v=dvojce). Nadpis navazuje na reklamu
         + A, pro srovnání zkus [?v=zacatek](https://etf-dvojcata-demo.ve
         +rcel.app/?v=zacatek).                                          
      13 +2. Klepni na lístek **VOO**. Otočí se a ukáže evropské dvojče V
         +UAA, u kterých brokerů ho koupíš a kolik stojí ročně z 10 000 K
         +č. Pod lístky se objeví výzva k taháku.                        
      14 +3. Klepni na „Chci tahák se všemi 7 dvojčaty“, zadej e-mail, za
         +škrtni souhlas a odešli. Přijde poděkování s tlačítkem „Otevřít
         + tahák“ (PDF) a sdílením. Po odscrollování funguje i spodní liš
         +ta, která otevře formulář jako panel.                          
      15 +4. Ochrana formuláře: zkus `x@mailinator.com` (jednorázová adre
         +sa) nebo `test@neexistuje.invalid` (doména nepřijímá poštu).   
      16 +                                                               
      17 +**Kde je vidět trychtýř:**                                     
      18 +                                                               
      19 +- **Na nasazené stránce** v Supabase: SQL Editor → `select * fr
         +om analytika.trychtyr;` (příchod → otočení lístku → otevření fo
         +rmuláře → odeslání, zvlášť pro každou verzi úvodu).            
      20 +- **Lokálně bez Supabase:** `./scripts/serve.sh`, projdi stránk
         +u na http://127.0.0.1:8737/ a otevři http://127.0.0.1:8737/__de
         +v/trychtyr. Server používá stejné SQL nad Postgresem v paměti (
         +PGlite).                                                       
      21 +                                                               
      22 +Exporty konverzací s AI jsou v [ai-log/](ai-log/), reklamy v [r
         +eklamy/](reklamy/).                                            
      23  
      24  ## Cílová skupina
      25  

⏺ Bash(python3 - <<'EOF'
      p='README.md'…)
  ⎿  Updated README.md (+5 -5)
      1  # ETF dvojčata – konverzní landing page (zadání B)
      2  
      3 -**Stránka:** [etf-dvojcata-demo.vercel.app](https://etf-dvojcata
        --demo.vercel.app/) · reklama A „Dvojče“: [?v=dvojce](https://etf
        --dvojcata-demo.vercel.app/?v=dvojce) · reklama B „Začátek“: [?v=
        -zacatek](https://etf-dvojcata-demo.vercel.app/?v=zacatek)       
      4 -**Myšlenka:** americká ETF ti broker v Česku často nenabídne. St
        -ránka k 7 známým ETF z NYSE jedním klepnutím ukáže evropské „dvo
        -jče“, které koupíš, a za e-mail dá PDF tahák s postupem nákupu. 
      5 -**Očekávaná konverze** (návštěva → odeslaný formulář): 2–13 %, n
        -ejspíš kolem 6 %. Je to odhad, [výpočet po krocích](#očekávaná-k
        -onverze).                                                       
      6 -**Do ostrého spuštění chybí:** posouzení právníkem, údaje a e-ma
        -ilová služba od správce, hotové obrázky reklam a ověření pravide
        -l Meta pro finanční reklamu ([seznam](#před-spuštěním-kampaně)).
      3 +- **Stránka:** [etf-dvojcata-demo.vercel.app](https://etf-dvojca
        +ta-demo.vercel.app/) · reklama A „Dvojče“: [?v=dvojce](https://e
        +tf-dvojcata-demo.vercel.app/?v=dvojce) · reklama B „Začátek“: [?
        +v=zacatek](https://etf-dvojcata-demo.vercel.app/?v=zacatek)     
      4 +- **Myšlenka:** americká ETF ti broker v Česku často nenabídne. 
        +Stránka k 7 známým ETF z NYSE jedním klepnutím ukáže evropské „d
        +vojče“, které koupíš, a za e-mail dá PDF tahák s postupem nákupu
        +.                                                               
      5 +- **Očekávaná konverze** (návštěva → odeslaný formulář): 2–13 %,
        + nejspíš kolem 6 %. Je to odhad, [výpočet po krocích](#očekávaná
        +-konverze).                                                     
      6 +- **Do ostrého spuštění chybí:** posouzení právníkem, údaje a e-
        +mailová služba od správce, hotové obrázky reklam a ověření pravi
        +del Meta pro finanční reklamu ([seznam](#před-spuštěním-kampaně)
        +).                                                              
      7  
      8  ## Jak to vyzkoušet za 2 minuty
      9  
     ...
      11  
      12  1. Otevři [etf-dvojcata-demo.vercel.app/?v=dvojce](https://etf-
          dvojcata-demo.vercel.app/?v=dvojce). Nadpis navazuje na reklamu
           A, pro srovnání zkus [?v=zacatek](https://etf-dvojcata-demo.ve
          rcel.app/?v=zacatek).
      13  2. Klepni na lístek **VOO**. Otočí se a ukáže evropské dvojče V
          UAA, u kterých brokerů ho koupíš a kolik stojí ročně z 10 000 K
          č. Pod lístky se objeví výzva k taháku.
      14 -3. Klepni na „Chci tahák se všemi 7 dvojčaty“, zadej e-mail, za
         -škrtni souhlas a odešli. Přijde poděkování s tlačítkem „Otevřít
         - tahák“ (PDF) a sdílením. Po odscrollování funguje i spodní liš
         -ta, která otevře formulář jako panel.                          
      14 +3. Klepni na „Chci tahák se všemi 7 dvojčaty“, zadej e-mail, za
         +škrtni souhlas a odešli. Přijde poděkování s tlačítkem „Otevřít
         + tahák“ (PDF) a sdílením. Když stránku posuneš dál, objeví se d
         +ole lišta, která formulář otevře jako panel.                   
      15  4. Ochrana formuláře: zkus `x@mailinator.com` (jednorázová adre
          sa) nebo `test@neexistuje.invalid` (doména nepřijímá poštu).
      16  
      17  **Kde je vidět trychtýř:**

  Searched for 1 pattern (ctrl+o to expand)

⏺ Bash(python3 - <<'EOF'
      p='scripts/README.md'…)
  ⎿  Updated scripts/README.md (+1 -1)
      25  ./scripts/serve.sh
      26  ```
      27  
      28 -Server ([server.mjs](server.mjs)) servíruje `public/` a funkce 
         -z `api/` stejně jako Vercel, včetně hlaviček z `vercel.json` (C
         -SP). Bez proměnných `SUPABASE_*` běží s podvrženou databází: PG
         -lite (Postgres ve WASM) se skutečným `supabase/schema.sql`. For
         -mulář i měření fungují, nic se nikam neposílá a na `/__dev/db` 
         -je vidět, co by se uložilo (jen z tohohle počítače). E-mailové 
         -domény končící `.invalid` se tváří, že nemají MX. U každé odpov
         -ědi 404 vypíše, kde soubor hledal a kdo se ptal. Se skutečnou d
         -atabází: `node --env-file=.env.local scripts/server.mjs` (z koř
         -ene repa; obsah `.env.local` nikdy nevypisuj).                 
      28 +Server ([server.mjs](server.mjs)) servíruje `public/` a funkce 
         +z `api/` stejně jako Vercel, včetně hlaviček z `vercel.json` (C
         +SP). Bez proměnných `SUPABASE_*` běží s podvrženou databází: PG
         +lite (Postgres ve WASM) se skutečným `supabase/schema.sql`. For
         +mulář i měření fungují, nic se nikam neposílá a na `/__dev/db` 
         +je vidět, co by se uložilo, a na `/__dev/trychtyr` trychtýř ze 
         +`supabase/funnel.sql` (obojí jen z tohohle počítače). E-mailové
         + domény končící `.invalid` se tváří, že nemají MX. U každé odpo
         +vědi 404 vypíše, kde soubor hledal a kdo se ptal. Se skutečnou 
         +databází: `node --env-file=.env.local scripts/server.mjs` (z ko
         +řene repa; obsah `.env.local` nikdy nevypisuj).                
      29  
      30  V druhém terminálu:
      31  

  Called plugin:context-mode:context-mode, ran 1 shell command (ctrl+o to expand)

⏺ Bod 6 je hotový (c5800dc). Bod 7: výpočet očekávané konverze po krocích.
  Všechny předpoklady budou označené jako odhad, benchmark Unbounce s odkazem.

⏺ Bash(python3 - <<'EOF'
      p='README.md'…)
  ⎿  Updated README.md (+23 -1)
      202  
      203  ## Očekávaná konverze
      204  
      205 -_TODO: odhad konverze (a čeho přesně, např. návštěva → kontakt
          -), z čeho vychází a co ji nejvíc ovlivní._                    
      205 +**Odhad: 2–13 % návštěv odešle formulář, nejspíš kolem 6 %.** 
          +Konverze je návštěva (načtená stránka) → odeslaný formulář, st
          +ejně jako v trychtýři. **Všechna procenta v tabulce jsou můj o
          +dhad**, ne naměřená data. Po prvním týdnu kampaně je nahradí č
          +ísla z `analytika.trychtyr`.                                  
      206 +                                                              
      207 +| Krok trychtýře | Pesimisticky | Středně | Optimisticky | Z č
          +eho odhad vychází |                                           
      208 +|---|---|---|---|---|                                         
      209 +| 1. příchod | 100 % | 100 % | 100 % | výchozí bod, každá načt
          +ená stránka |                                                 
      210 +| 2. otočení lístku (z příchodů) | 25 % | 40 % | 55 % | Lístky
          + jsou na první obrazovce a jsou přesně to, co reklama slibuje.
          + Z reklamy na sociálních sítích ale velká část lidí odejde po 
          +pár sekundách bez jediného klepnutí. |                        
      211 +| 3. otevření formuláře (z těch, kdo otočili) | 20 % | 30 % | 
          +40 % | Výzva se objeví hned pod otočeným lístkem. Kdo ale vidě
          +l dvojče, už dostal, kvůli čemu přišel, a tahák ho musí zaujmo
          +ut navíc. |                                                   
      212 +| 4. odeslání (z otevřených formulářů) | 40 % | 50 % | 60 % | 
          +Jedno pole a zaškrtnutí, tahák hned bez čekání na e-mail. Část
          + lidí odradí, že dávají e-mail a souhlas s e-maily. |         
      213 +| **Návštěva → odeslání** | **2,0 %** | **6,0 %** | **13,2 %**
          + | součin kroků 2–4 |                                         
      214 +                                                              
      215 +**Výpočet po krocích na 1 000 návštěv:**                      
      216 +- středně: 1 000 × 40 % = 400 otočí lístek → 400 × 30 % = 120 
          +otevře formulář → 120 × 50 % = 60 odešle, tedy 6,0 %,         
      217 +- pesimisticky: 1 000 × 25 % = 250 → 250 × 20 % = 50 → 50 × 40
          + % = 20, tedy 2,0 %,                                          
      218 +- optimisticky: 1 000 × 55 % = 550 → 550 × 40 % = 220 → 220 × 
          +60 % = 132, tedy 13,2 %.                                      
      219 +                                                              
      220 +Zjednodušení: formulář jde otevřít i bez otočení lístku (spodn
          +í lišta, sekce Tahák). Tyhle cesty v odhadu zvlášť nejsou, poč
          +ítám je jako součást kroku 3.                                 
      221 +                                                              
      222 +**Srovnání s benchmarkem (skutečný zdroj, ne odhad):** podle [
          +Unbounce](https://unbounce.com/landing-pages/whats-a-good-conv
          +ersion-rate/) (Conversion Benchmark Report 2024, 41 000 landin
          +g pages a 57 milionů konverzí) je medián konverze landing page
          + napříč obory 6,6 %, ve finančních službách 8,3 % a v podkateg
          +orii investování 3,9 %. Starší [stránka Unbounce o financích](
          +https://unbounce.com/industry/finance/) uvádí pro finance a po
          +jištění medián 3,8 % a rok dat neuvádí. Zdroje se rozcházejí, 
          +proto mezi nimi nevybírám. Střední odhad 6 % leží mezi investo
          +váním (3,9 %) a finančními službami (8,3 %). Benchmark zahrnuj
          +e všechny zdroje návštěv a všechny druhy konverzí, nejen e-mai
          +l za PDF, a český trh v něm zvlášť není. Je to tedy jen hrubá 
          +kontrola, že odhad není mimo.                                 
      223 +                                                              
      224 +**Co konverzi nejvíc ovlivní:**                               
      225 +- jestli úvod navazuje na slib reklamy (proto se mění podle `?
          +v=`),                                                         
      226 +- jestli lidé poznají, že se na lístek dá klepnout (krok 2),  
      227 +- jestli je tahák lákavý i pro toho, kdo už dvojče viděl (krok
          + 3). Na tenhle krok míří [první hypotéza na A/B test](#hypotéz
          +y-na-ab-test).                                                
      228  
      229  ## Hypotézy na A/B test
      230  

⏺ Bod 7 je hotový (b804240). Bod 8: obchodní pohled s cenou za kontakt.

⏺ Bash(python3 - <<'EOF'
      p='README.md'…)
  ⎿  Updated README.md (+27 -0)
      226  - jestli lidé poznají, že se na lístek dá klepnout (krok 2),
      227  - jestli je tahák lákavý i pro toho, kdo už dvojče viděl (krok
            3). Na tenhle krok míří [první hypotéza na A/B test](#hypotéz
           y-na-ab-test).
      228  
      229 +## Obchodní pohled                                            
      230 +                                                              
      231 +**K čemu je kontakt.** Co s kontakty Clientelo nebo jeho klien
          +t udělá, zadání neříká, proto to beru obecně. Kontakt je člově
          +k, který se aktivně zajímá o ETF, viděl, které fondy si z Česk
          +a koupí, a souhlasil s e-maily o investování do ETF. Hodí se p
          +ro firmu, která na investování do ETF vydělává: broker nebo in
          +vestiční platforma (otevření účtu), finanční médium nebo vzděl
          +ávání (newsletter, kurz). U kontaktu je uložená i verze reklam
          +y, takže je vidět, s jakou motivací přišel (zklamání z brokera
          +, nebo nejistota začátečníka), a podle toho jde psát první e-m
          +aily.                                                         
      232 +                                                              
      233 +**Orientační cena za kontakt.** Cena za kontakt = cena za klik
          + ÷ (podíl kliků, ze kterých je načtená stránka × konverze návš
          +těva → kontakt). Předpoklady:                                 
      234 +                                                              
      235 +- **Cena za klik z Meta v Česku: předpoklad 5–20 Kč, středně 1
          +0 Kč.** Ověřený zdroj pro český trh nemám. Pro představu: [Loc
          +aliQ (WordStream)](https://localiq.com/blog/facebook-advertisi
          +ng-benchmarks/) uvádí u kampaní Facebooku na návštěvnost průmě
          +rnou cenu za klik 0,60 USD napříč obory a 0,86 USD pro finance
          + a pojištění. Jsou to data z kampaní jejich klientů, český trh
          + v nich zvlášť není a na koruny je nepřepočítávám.            
      236 +- **Z kliku je načtená stránka: předpoklad 85 %.** Část lidí s
          +tránku zavře dřív, než se načte. Stránka je rychlá (LCP 1,2 s 
          +v Lighthouse), ztráta by tedy neměla být velká, ale změřená ne
          +ní.                                                           
      237 +- **Konverze: 2 %, 6 % a 13,2 %** z [odhadu výše](#očekávaná-k
          +onverze).                                                     
      238 +                                                              
      239 +Výpočet střední varianty: 10 Kč ÷ (0,85 × 0,06) = 10 Kč ÷ 0,05
          +1 ≈ **196 Kč za kontakt**. Jinak řečeno: 1 000 kliků za 10 000
          + Kč → 850 návštěv → 51 kontaktů.                              
      240 +                                                              
      241 +| Cena za klik | Konverze 2 % | 6 % | 13,2 % |                
      242 +|---|---|---|---|                                             
      243 +| 5 Kč | 294 Kč | 98 Kč | 45 Kč |                             
      244 +| 10 Kč | 588 Kč | **196 Kč** | 89 Kč |                       
      245 +| 20 Kč | 1 176 Kč | 392 Kč | 178 Kč |                        
      246 +                                                              
      247 +Rozsah je široký, protože oba vstupy jsou odhady. Po pár dnech
          + kampaně se dosadí skutečná cena za klik z Meta a konverze z t
          +rychtýře. Kontakt se vyplatí, když z něj klient v průměru vydě
          +lá víc, než stojí. To záleží na jeho byznysu, který zadání neu
          +vádí, takže to nehádám. S double opt-inem (viz [Bezpečnost](#b
          +ezpečnost-a-ochrana-proti-spamu)) by se cena počítala na potvr
          +zený kontakt a byla by vyšší.                                 
      248 +                                                              
      249 +**Proč jen e-mail a nic dalšího:**                            
      250 +- **E-mail stačí k tomu, co slibujeme.** Tahák se ukáže hned a
          + další e-maily jdou na adresu. Jméno ani telefon k tomu nejsou
          + potřeba.                                                     
      251 +- **Každé pole navíc je na mobilu další psaní** a další důvod 
          +formulář nedokončit. Člověk z reklamy stránce dává pár sekund.
      252 +- **Telefon by změnil, co nabízíme.** Za PDF zdarma telefon dá
          +t nechci, protože čekám, že zavolá prodejce. (Je to můj předpo
          +klad, neměřený.)                                              
      253 +- **Minimalizace údajů:** GDPR chce osobní údaje omezit na to,
          + co je pro daný účel nezbytné (čl. 5 odst. 1 písm. c)). Méně ú
          +dajů je i menší škoda při úniku.                              
      254 +- **Víc se dá zjistit později:** v prvním e-mailu jednou otázk
          +ou na klepnutí (třeba „U jakého brokera jsi?“). Odpoví jen ti,
          + kdo už důvěřují, a formulář na stránce zůstane krátký.       
      255 +                                                              
      256  ## Hypotézy na A/B test
      257  
      258  _TODO: tři hypotézy seřazené podle očekávaného dopadu. U každé
            změna, očekávaný efekt, metrika a proč je na tomto místě pořa
           dí._

⏺ Bash(python3 - <<'EOF'
      p='README.md'…)
  ⎿  Updated README.md (+1 -1)
      249  **Proč jen e-mail a nic dalšího:**
      250  - **E-mail stačí k tomu, co slibujeme.** Tahák se ukáže hned a
            další e-maily jdou na adresu. Jméno ani telefon k tomu nejsou
            potřeba.
      251  - **Každé pole navíc je na mobilu další psaní** a další důvod 
           formulář nedokončit. Člověk z reklamy stránce dává pár sekund.
      252 -- **Telefon by změnil, co nabízíme.** Za PDF zdarma telefon dá
          -t nechci, protože čekám, že zavolá prodejce. (Je to můj předpo
          -klad, neměřený.)                                              
      252 +- **Telefon by změnil, co nabízíme.** Za PDF zdarma ho návštěv
          +ník spíš nedá, protože by čekal hovor od prodejce. Je to můj p
          +ředpoklad, neměřený.                                          
      253  - **Minimalizace údajů:** GDPR chce osobní údaje omezit na to,
            co je pro daný účel nezbytné (čl. 5 odst. 1 písm. c)). Méně ú
           dajů je i menší škoda při úniku.
      254  - **Víc se dá zjistit později:** v prvním e-mailu jednou otázk
           ou na klepnutí (třeba „U jakého brokera jsi?“). Odpoví jen ti,
            kdo už důvěřují, a formulář na stránce zůstane krátký.
      255  

⏺ Bod 8 je hotový (a71d854). Bod 9: tři A/B hypotézy, u každé s výpočtem
  minimálního počtu návštěv.

⏺ Bash(python3 - <<'EOF'
      p='README.md'…)
  ⎿  Updated README.md (+26 -5)
      255  
      256  ## Hypotézy na A/B test
      257  
      258 -_TODO: tři hypotézy seřazené podle očekávaného dopadu. U každé
          - změna, očekávaný efekt, metrika a proč je na tomto místě pořa
          -dí._                                                          
      259 -                                                              
      260 -1. TODO                                                       
      261 -2. TODO                                                       
      262 -3. TODO                                                       
      258 +Seřazené podle očekávaného dopadu na konverzi návštěva → odesl
          +ání. Hlavní metrika je u všech stejná a měří ji vlastní trycht
          +ýř. Očekávaná zlepšení jsou můj odhad, ze kterého počítám potř
          +ebný počet návštěv.                                           
      259 +                                                              
      260 +**1. Formulář rovnou pod otočeným lístkem**                   
      261 +- **Hypotéza:** když po prvním otočení uvidí návštěvník rovnou
          + pole na e-mail, odpadne jedno klepnutí ve chvíli největšího z
          +ájmu a víc lidí formulář odešle.                              
      262 +- **Co měníme:** pod lístky se místo tlačítka „Chci tahák se v
          +šemi 7 dvojčaty“, které formulář teprve rozbalí, ukáže rovnou 
          +formulář (pole, „Získat tahák“, souhlas). Zbytek stránky zůsta
          +ne stejný.                                                    
      263 +- **Metrika:** návštěva → odeslání. Kontrolní: návštěva → otoč
          +ení lístku (formulář pod lístky nesmí odradit od dalšího otáče
          +ní).                                                          
      264 +- **Minimum:** z 6 % na 7,5 % (+25 %) → 4 388 návštěv na verzi
          +, **asi 8 800 celkem**.                                       
      265 +- **Proč první:** míří na krok s největším odhadovaným úbytkem
          + (z těch, kdo otočí lístek, formulář neotevře 70 %) a mění jen
          + jeden prvek. Čekám od ní největší dopad.                     
      266 +                                                              
      267 +**2. Jeden lístek otočený hned po načtení**                   
      268 +- **Hypotéza:** část lidí nepozná, že se na lístek dá klepnout
          +, nebo to nezkusí. Když lístek VOO ukáže dvojče sám, hodnota j
          +e vidět bez jediné akce a víc lidí dojde k výzvě.             
      269 +- **Co měníme:** lístek VOO se chvíli po načtení sám otočí na 
          +VUAA, ostatní zůstanou lícem nahoru.                          
      270 +- **Metrika:** návštěva → odeslání. Vedlejší: návštěva → otoče
          +ní lístku, které by se mělo zvednout nejvíc.                  
      271 +- **Minimum:** z 6 % na 7,2 % (+20 %) → 6 717 návštěv na verzi
          +, **asi 13 400 celkem**.                                      
      272 +- **Proč druhá:** míří na krok 2, kde odejde odhadem nejvíc li
          +dí, ale na odeslání působí jen nepřímo. Kdo uvidí dvojče bez k
          +lepnutí, nemusí o tahák stát. Proto čekám menší dopad než u pr
          +vní.                                                          
      273 +                                                              
      274 +**3. Výzva slibuje „jak koupit“ místo „všech 7 dvojčat“**     
      275 +- **Hypotéza:** kdo otočil lístek, už ví, co koupit, ale neví 
          +jak. Výzva, která slibuje postup nákupu, je pro něj konkrétněj
          +ší než seznam, jehož část už viděl.                           
      276 +- **Co měníme:** text tlačítka pod lístky a ve spodní liště, n
          +apříklad „Chci postup nákupu krok za krokem“. Formulář i tahák
          + zůstanou stejné.                                             
      277 +- **Metrika:** návštěva → odeslání. Vedlejší: otočení lístku →
          + otevření formuláře.                                          
      278 +- **Minimum:** z 6 % na 6,9 % (+15 %) → 11 690 návštěv na verz
          +i, **asi 23 400 celkem**.                                     
      279 +- **Proč třetí:** mění jen slova, ne počet kroků ani to, co ná
          +vštěvník vidí. Čekám nejmenší efekt, a proto potřebuje nejvíc 
          +návštěv. Na druhou stranu se připraví nejrychleji.            
      280 +                                                              
      281 +**Výpočet minima:** n na verzi = (z₁₋α/₂ + z₁₋β)² × [p₁(1 − p₁
          +) + p₂(1 − p₂)] ÷ (p₂ − p₁)², kde α = 0,05 oboustranně (z = 1,
          +96) a síla testu 80 % (z = 0,84), takže (1,96 + 0,84)² ≈ 7,85.
          + Například první hypotéza: 7,85 × (0,06 × 0,94 + 0,075 × 0,925
          +) ÷ 0,015² = 7,85 × 0,1258 ÷ 0,000225 ≈ 4 388. Výchozí konverz
          +e 6 % je střední odhad. Kdyby skutečná byla 2 %, potřebný poče
          +t návštěv vyjde zhruba třikrát vyšší (u první hypotézy 13 807 
          +na verzi). Výpočet je proto potřeba zopakovat s konverzí naměř
          +enou v prvním týdnu. Při 500 návštěvách denně (předpoklad) by 
          +první test trval asi 18 dní, druhý 27 a třetí 47.             
      282 +                                                              
      283 +**Co je pro test potřeba připravit:** stránka zatím rozlišuje 
          +jen verzi reklamy (`?v=`). Pro test na stránce je potřeba přid
          +at druhý parametr nebo náhodné přidělení verze při načtení (be
          +z ukládání do prohlížeče) a ukládat ho k událostem i ke kontak
          +tu. Testy pouštět po jednom, s délkou určenou předem a bez pře
          +dčasného vyhodnocování.                                       
      284  
      285  ## Technická rozhodnutí
      286  

⏺ Bod 9 je hotový (ff2824a). Bod 10: sekce o práci s AI. Než napíšu, kdo kterou
  chybu našel, ověřím to v přepisu konverzace, ať to není z paměti.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Potvrzeno: chybu se skrytým polem našel skill code-review. Ověřím ještě, který
  review našel nepravdivé tvrzení o párování.

  Called plugin:context-mode:context-mode 3 times (ctrl+o to expand)

⏺ Kdo našel nepravdivé tvrzení o párování, deník zapsal jako „review“, takže to
  tak i napíšu. Teď přepíšu sekci o práci s AI.

  Searched for 1 pattern (ctrl+o to expand)

⏺ Bash(python3 - <<'EOF'
      p='README.md'…)
  ⎿  Updated README.md (+33 -22)
      342  
      343  ## Jak jsem pracoval s AI
      344  
      345 -_TODO: jaké pokyny dostali agenti (viz [CLAUDE.md](CLAUDE.md))
          -, jak probíhala kontrola jejich výstupu, kde se spletli a jak 
          -se na to přišlo. Exporty konverzací jsou v [ai-log/](ai-log/),
          - průběžné poznámky v [ai-log/denik.md](ai-log/denik.md)._     
      345 +**Nástroje a role:**                                          
      346  
      347 -**Test na skutečném telefonu udělal člověk, ne AI** (iPhone, S
          -afari, 10. 10. 2026). AI testovala jen v headless Chrome ([scr
          -ipts/](scripts/)). Výsledek:                                  
      347 +- **Plánovací chat (claude.ai):** v samostatném chatu jsem si 
          +připravoval a ladil zadání pro Claude Code: co chci, v jakém p
          +ořadí, co ověřit a co se nesmí stát. Do Claude Code šlo až hot
          +ové zadání. Exporty v [ai-log/](ai-log/) jsou z Claude Code.  
      348 +- **Claude Code** (ve VS Code) dělal výzkum dat z primárních z
          +drojů, stránku, PDF, funkce, SQL, testy a dokumentaci. Pravidl
          +a pro každou session i pro subagenty jsou v [CLAUDE.md](CLAUDE
          +.md): žádná vymyšlená data (zdroj, nebo TODO), klíče jen v pro
          +měnných prostředí, nic absolutního v textech, tykání bez rodu,
          + česká typografie, malé commity a push jen na pokyn.          
      349 +- **Agenti:** většina práce běžela v jedné konverzaci. Subagen
          +ty spouštěly skilly `security-review` (hledání zranitelností a
          + ověření každého nálezu zvlášť) a `code-review`. Co dostaly za
          + zadání, jak se kontroloval jejich výstup a kde se spletly, je
          + v [ai-log/denik.md](ai-log/denik.md).                        
      350 +- **Postup u chyb:** AI nejdřív napsala příčinu a teprve potom
          + opravovala. U nové kontroly ověřila, že na staré verzi selže.
      351  
      349 -- Stránka funguje, je rychlá a obsahově sedí.                 
      350 -- Design působil příliš „bezpečně“: bílé zaoblené karty a modr
          -é tlačítko vypadaly jako typický web od AI a ze „sešitu“ zbyla
          - jen mřížka.                                                  
      351 -- Stav po odeslání byl rozbitý: nad „Hotovo, tahák se ti stahu
          -je“ zůstávaly odrážky z formuláře.                            
      352 -- Stránka slibovala PDF, které neexistovalo.                  
      352 +**Jak jsem výstupy kontroloval:**                             
      353 +                                                              
      354 +- **Testy**, které vrací chybu, když něco neprojde ([scripts/]
          +(scripts/README.md)): funkce s podvrženou databází a DNS (127 
          +kontrol), SQL na skutečném Postgresu v PGlite (57), stránka v 
          +Chromu (127), WebKit s emulovanými iPhony a simulovanou kláves
          +nicí (81), data proti zdrojům, čísla na stránce a v PDF proti 
          +datům, Lighthouse.                                            
      355 +- **Na skutečném iPhonu**, třikrát (Safari a Chrome na iOS). T
          +am se našly chyby, které žádná simulace neukázala.            
      356 +- **Proti zadání:** cílová skupina, hodnota viditelná před for
          +mulářem, dvě reklamy, měření celé cesty, skutečná data se zdro
          +jem, pořadí sekcí, konverze, hypotézy, nasazení.              
      357 +- **Čtením:** texty, README a diff před každým commitem (klíče
          +, skutečné e-maily).                                          
      358 +                                                              
      359 +**Kde AI chybovala a jak se to odhalilo:**                    
      360 +                                                              
      361 +| Chyba AI | Jak se na ni přišlo | Oprava |                   
      362 +|---|---|---|                                                 
      363 +| V návrhu podnadpisu absolutní tvrzení „Americké ti broker ne
          +nabídne, evropské ano.“, proti pravidlu nic netvrdit absolutně
          +. | Člověk při čtení plánu. | „Americká ti broker často nenabí
          +dne, evropská ano.“ |                                         
      364 +| „Pojistka“ u otočení lístku přepínala líc a rub podle času, 
          +ne podle úhlu. Lístek byl z boku dřív, než se strany vyměnily,
          + takže na iPhonu jen blikl. Test kontroloval jen konečný stav.
          + | Člověk na iPhonu (Chrome na iOS, s videem). Příčinu AI změř
          +ila ve WebKitu po 100 ms. | Strany se mění na konci první půlk
          +y animace. Test kontroluje každý snímek průběhu. |            
      365 +| Kontrola skrytého pole proti botům v prohlížeči tiše zahazov
          +ala skutečné kontakty, když pole vyplnilo automatické vyplňová
          +ní. Návštěvník viděl poděkování, ale kontakt se neuložil. | Sk
          +ill `code-review` při bezpečnostní kontrole. | Rozhoduje jen s
          +erver a pole má název, který automatické vyplňování nezná. |  
      366 +| V README tvrdila, že kontakt nejde spárovat s návštěvou. Neb
          +yla to pravda: řádky měly pořadová čísla a databáze zná pořadí
          + zápisu. | Review při bezpečnostní kontrole. | Náhodná UUID, o
          +deslání a všechno po něm bez ID návštěvy, čas na minuty a prav
          +divý popis toho, co zůstává. |                                
      367 +| Panel s formulářem po klepnutí do pole odskočil pod klávesni
          +ci. Po opravě tlačítko zakryla lišta s návrhy e-mailů nad kláv
          +esnicí. Headless Chrome ani simulace ve WebKitu klávesnici a l
          +ištu neukázaly. | Dva testy na skutečném iPhonu (člověk). | Pa
          +nel podle `visualViewport`, tlačítko hned pod polem a rezerva 
          +50 px na lištu. Test ve WebKitu lištu teď kreslí. |           
      368 +| Limit 10 kontaktů za hodinu z jedné IP brala jako bezpečný p
          +ro skutečné lidi. | Člověk upozornil na sdílené IP mobilních o
          +perátorů (CGNAT). | 30 za hodinu, odmítnutí se zapisují do log
          +u. |                                                          
      369 +| Kontrola MX odmítala doménu bez MX záznamu, i když pošta jde
          + i na adresu domény (RFC 5321). | AI při ověřování, o které čl
          +ověk požádal (fail-open při chybě DNS). | Bez MX se ověří adre
          +sa domény, timeout 1 s. |                                     
      370 +                                                              
      371 +Další drobnější chyby (odhadnutá adresa produktové stránky Van
          +guardu, nápověda XTB pro klienty mimo EU, test, který klepal b
          +ěhem plynulého posunu stránky) jsou v [deníku](ai-log/denik.md
          +).                                                            
      372 +                                                              
      373 +**Testy na skutečném iPhonu dělal člověk, ne AI:**            
      374 +                                                              
      375 +1. **10. 10. 2026, Safari:** design působil jako typický web o
          +d AI, poděkování bylo rozbité a stránka slibovala PDF, které n
          +eexistovalo. Design se předělal na „sešit“ s lístky.          
     … 29 more lines (ctrl+o to expand)

⏺ Bash(python3 - <<'EOF'
      p='README.md'…)
  ⎿  Updated README.md (+1 -1)
      376  2. **10. 10. 2026, Safari:** panel s formulářem odskakoval pod
            klávesnici, Safari PDF místo stažení otevřelo (poděkování teď
            nabízí „Otevřít tahák“), poděkování bylo prázdné.
      377  3. **11. 10. 2026, Chrome na iOS, s videem:** lístek se neotáč
           el, jen blikl, a tlačítko zakrývala lišta s návrhy e-mailů. Pr
           ůběh otočení po opravě (WebKit, snímky po 100 ms):
      378  
      379 -  <img src="docs/screenshots/webkit-otoceni-listku.png" width=
          -"640" alt="Průběh otočení lístku VTI po 100 ms: líc se zužuje,
          - ve 224 ms je lístek z boku, pak se rozšiřuje rub s dvojčetem 
          -SXR4">                                                        
      379 +   <img src="docs/screenshots/webkit-otoceni-listku.png" width
          +="640" alt="Průběh otočení lístku VTI po 100 ms: líc se zužuje
          +, ve 224 ms je lístek z boku, pak se rozšiřuje rub s dvojčetem
          + SXR4">                                                       
      380  
      381  Snímky před úpravami a po nich jsou v [docs/screenshots/](docs
           /screenshots/) (375 px, generuje `scripts/screenshots.mjs`):
      382  

⏺ Bod 10 je hotový (cb40ba2). Bod 11: projdu celé README očima hodnotitele.
  Načtu aktuální verzi.
  Read 1 file (ctrl+o to expand)

⏺ Narazil jsem v README na zastaralé údaje, rozpor ohledně fungování bez JS,
  duplicitní věty, čtyři nedokončené sekce s TODO a chybu týkající se ukládání
  utm_content. Teď ještě ověřím pár tvrzení proti datům a PDF.

  Ran 1 shell command (ctrl+o to expand)

⏺ Tvrzení sedí: 1 137 z 1 151 je v datech a PDF má 8 stran. Ještě ověřím, jestli
  stránka zmiňuje Fio.

  Ran 2 shell commands (ctrl+o to expand)

⏺ Všechny ověřené údaje sedí. Teď provedu revizi README: přeskládám sekce
  (nejdůležitější nahoru), doplním čtyři prázdné sekce, opravím zastaralá čísla
  a smažu opakování.

⏺ Bash(cat > /private/tmp/claude-501/-Users-daniel-etfLanding/65a1b1d0-4c48-4b63
      -b5fe-0203afe326c3/scratchpad/readme11.py <<'PYEOF'
      import re, sys…)
  ⎿  1 file changed (binary, mode only or too large to show)

⏺ Bash(python3 - <<'EOF'
      p='README.md'…)
  ⎿  Updated README.md (+2 -2)
      428  
      429  ## Nasazení na Supabase a Vercel
      430  
      431 -Všechno je připravené, stačí založit projekty a zadat tři prom
          -ěnné prostředí. Klíče patří jen do Vercelu (a lokálně do `.env
          -.local`, který je v `.gitignore`), nikdy do repa ani do chatu.
      431 +Všechno je připravené, stačí založit projekty a zadat čtyři pr
          +oměnné prostředí. Klíče patří jen do Vercelu (a lokálně do `.e
          +nv.local`, který je v `.gitignore`), nikdy do repa ani do chat
          +u.                                                            
      432  
      433  **1. Supabase (databáze)**
      434  
      435  1. Na [supabase.com](https://supabase.com/dashboard) → **New p
           roject**. Název třeba `etf-dvojcata`, **Region: Central EU (Fr
           ankfurt)**, tedy `eu-central-1`. Heslo k databázi si ulož do s
           právce hesel, stránka ho nepotřebuje.
      436 -2. **SQL Editor → New query** → vlož celý [supabase/schema.sql
          -](supabase/schema.sql) → **Run**. V **Table Editor** pak uvidí
          -š tabulky `leads` a `events`, obě s RLS zapnutým.             
      436 +2. **SQL Editor → New query** → vlož celý [supabase/schema.sql
          +](supabase/schema.sql) → **Run**. V **Table Editor** pak uvidí
          +š tabulky `leads`, `events` a `limity`, všechny s RLS zapnutým
          +.                                                             
      437  3. Znovu **SQL Editor → New query** → vlož [supabase/funnel.sq
           l](supabase/funnel.sql) → **Run**. Trychtýř pak kdykoli zobraz
           íš dotazem `select * from analytika.trychtyr;`.
      438  4. Tlačítko **Connect** (nebo **Project Settings → Data API**)
           : zkopíruj **Project URL** (`https://….supabase.co`), to je `S
           UPABASE_URL`.
      439  5. **Project Settings → API Keys → Secret keys**: zkopíruj sec
           ret klíč (`sb_secret_…`), to je `SUPABASE_SECRET_KEY`. Publish
           able klíč stránka nepotřebuje, prohlížeč se Supabase vůbec nek
           ontaktuje.

⏺ Seznam má opravdu 9 222 domén. Teď opravím nepřesnosti v reklamy/README.

⏺ Bash(python3 - <<'EOF'
      p='reklamy/README.md'…)
  ⎿  Updated reklamy/README.md (+4 -4)
      39  
      40  **Alternativa:** Vercel rewrite podle parametru na dvě různé HT
          ML stránky by se obešla bez JS. Nedoporučuju ji: obsah by byl d
          vakrát a při úpravách se rozjede. `[TODO]` Podporu podmínek pod
          le query ve `vercel.json` jsem neověřoval.
      41  
      42 -**Měření:** hodnota `v` (a `utm_content`) se ukládá ke každému 
         -eventu návštěvy, aby šel trychtýř porovnat podle verze. ID návš
         -těvy se ani tady nespojuje s e-mailem.                         
      42 +**Měření:** hodnota `v` se ukládá ke každé události i ke kontak
         +tu, aby šel trychtýř porovnat podle verze. `utm_source` se uklá
         +dá jen jako detail příchodu, `utm_content` se neukládá (verzi r
         +eklamy nese `v`). ID návštěvy se s e-mailem nespojuje.         
      43  
      44  **Odkazy z reklam:**
      45  
      46  ```
      47 -https://[TODO doména]/?v=dvojce&utm_source=meta&utm_medium=paid
         -_social&utm_campaign=etf-dvojcata&utm_content=a-dvojce         
      48 -https://[TODO doména]/?v=zacatek&utm_source=meta&utm_medium=pai
         -d_social&utm_campaign=etf-dvojcata&utm_content=b-zacatek       
      47 +https://etf-dvojcata-demo.vercel.app/?v=dvojce&utm_source=meta&
         +utm_medium=paid_social&utm_campaign=etf-dvojcata&utm_content=a-
         +dvojce                                                         
      48 +https://etf-dvojcata-demo.vercel.app/?v=zacatek&utm_source=meta
         +&utm_medium=paid_social&utm_campaign=etf-dvojcata&utm_content=b
         +-zacatek                                                       
      49  ```
      50  
      51  ## Nastavení testu
      52  
      53  - Obě reklamy ve stejné kampani, stejné publikum, stejný rozpoč
          et, souběžně.
      54 -- **Hlavní metrika:** odeslané formuláře ÷ návštěvy, podle `utm
         -_content`, z našeho měření.                                    
      54 +- **Hlavní metrika:** odeslané formuláře ÷ návštěvy podle verze
         + úvodu (`v`), z našeho měření (`analytika.trychtyr`).          
      55  - **Vedlejší metriky:**
      56    - míra prokliku (CTR) a cena za proklik z Meta,
      57    - kolik návštěv použilo „Najdi dvojče“.

⏺ Zbylá TODO v reklamy/README jsou vědomá: ověřit u Meta před výrobou obrázků.
  Projdu výsledné README, jestli dává smysl při čtení odshora.

  Searched for 1 pattern, read 1 file (ctrl+o to expand)

⏺ Bash(python3 - <<'EOF'
      p='README.md'…)
  ⎿  Updated README.md (+5 -7)
      31  - Jsou blízko k akci. Nepotřebují vysvětlovat, proč investovat,
           jen co koupit a jak.
      32  - Začátečníky, kteří nevědí, kterým ETF začít, oslovuje reklama
           B. Testujeme tak druhou motivaci: nejistotu místo zklamání z b
          rokera.
      33  
      34 -**Stavíme na ověřeném faktu:** americká ETF ti broker v Česku č
         -asto nenabídne, evropská obdoba ano. Například u Trading 212 je
         - pro evropské klienty vyloučeno 1 137 z 1 151 amerických ETF (v
         -iz [data/README.md](data/README.md)). Tuhle informaci jinde sna
         -dno nenajde, a je to hlavní důvod, proč na stránce zůstat.     
      34 +**Stavíme na ověřeném faktu:** americká ETF ti broker v Česku č
         +asto nenabídne, evropská obdoba ano. Například u Trading 212 je
         + pro evropské klienty vyloučeno 1 137 z 1 151 amerických ETF (v
         +iz [data/README.md](data/README.md)). Tuhle informaci návštěvní
         +k jinde snadno nenajde a je to hlavní důvod, proč na stránce zů
         +stat.                                                          
      35  
      36  ## Lead magnet a moment žádosti o kontakt
      37  
      38  **Co návštěvník dostane:** PDF „Tahák: 7 ETF z NYSE a jejich dv
          ojčata, která koupíš z Česka“ ([public/tahak.pdf](public/tahak.
          pdf), 8 stran A5): ISINy, poplatky, kde koupit a postup nákupu 
          u XTB a Trading 212 krok za krokem, se zdrojem u každého kroku.
           Generuje se z [tahak/tahak.html](tahak/tahak.html) a dat, takž
          e po změně dat stačí přegenerovat.
      39  
      40 -**Hodnota je vidět ještě před formulářem.** Lístky se 7 ETF jso
         -u na první obrazovce. Klepnutím se lístek otočí a ukáže evropsk
         -é dvojče, u kterých brokerů ho koupíš a kolik stojí ročně z 10 
         -000 Kč. Pod lístky se ukážou podrobnosti (index, poplatek proti
         - originálu). Zdarma, bez e-mailu. Dělba je jasná: na stránce ná
         -vštěvník vidí, **co** koupit, v taháku dostane, **jak** to uděl
         -at.                                                            
      40 +**Hodnota je vidět ještě před formulářem.** Lístky se 7 ETF jso
         +u na první obrazovce. Klepnutím se lístek otočí a ukáže evropsk
         +é dvojče, u kterých brokerů ho koupíš a kolik stojí ročně z 10 
         +000 Kč. Pod lístky se ukážou podrobnosti (index, poplatek proti
         + originálu, dividendy). Zdarma, bez e-mailu. Dělba je jasná: na
         + stránce návštěvník vidí, **co** koupit, v taháku dostane, **ja
         +k** to udělat.                                                 
      41  
      42  **Kdy žádáme o kontakt:**
      43  
     ...
      45  2. Spodní lištou, která se ukáže, když lístky zmizí z obrazovky
           a výzva ani formulář nejsou vidět. Formulář se otevře jako pan
          el tam, kde návštěvník právě je.
      46  3. Formulářem v sekci Tahák pro ty, kdo dočtou až dolů.
      47  
      48 -Výzvy nikdy nevedou odkazem dolů na formulář: skok přes tři sek
         -ce stojí konverze a návštěvník ztratí kontext.                 
      49 -                                                               
      48  **Formulář:** jen e-mail a souhlas (proč, je v [obchodním pohle
          du](#obchodní-pohled)). Tlačítko je hned pod polem, aby ho na i
          Phonu nezakryla klávesnice ani lišta s návrhy e-mailů.
      49  
      50  **Po odeslání:** poděkování s tlačítkem „Otevřít tahák“, takže 
          nikdo nečeká na e-mail. Pod ním je věta s prvním krokem a „Posl
          at odkaz kamarádovi“ (nativní sdílení telefonu, jinak zkopírová
          ní odkazu). Sdílení měříme a sdílený odkaz má `?ref=sdileni`. P
          DF se samo nestahuje: Safari na iPhonu ho při testu místo staže
          ní otevřel a návštěvník by odešel dřív, než uvidí sdílení.
     ...
      53  
      54  ## Pořadí sekcí a zdůvodnění
      55  
      58 -1. **Úvod navazující na reklamu a rovnou „Najdi dvojče“.** Návš
         -těvník má jen pár sekund. První obrazovka musí zopakovat slib r
         -eklamy a nabídnout akci bez scrollování. Nadpis se mění podle t
         -oho, ze které reklamy návštěvník přišel (viz [reklamy/](reklamy
         -/)).                                                           
      59 -2. **Výsledek a výzva k taháku.** Otočený lístek ukáže dvojče, 
         -kde ho koupíš a kolik stojí: okamžitá hodnota zdarma. Výzva se 
         -objeví hned pod lístky ve chvíli, kdy je zájem nejvyšší, a form
         -ulář se rozbalí na místě. Pod ní jsou podrobnosti (index, divid
         -endy).                                                         
      56 +1. **Úvod navazující na reklamu a rovnou lístky s ETF.** Návště
         +vník má jen pár sekund. První obrazovka musí zopakovat slib rek
         +lamy a nabídnout akci bez scrollování. Nadpis se mění podle toh
         +o, ze které reklamy návštěvník přišel (viz [reklamy/](reklamy/)
         +).                                                             
      57 +2. **Výsledek a výzva k taháku.** Otočený lístek ukáže dvojče, 
         +kde ho koupíš a kolik stojí: okamžitá hodnota zdarma. Výzva se 
         +objeví hned pod lístky ve chvíli, kdy je zájem nejvyšší, a form
         +ulář se rozbalí na místě. Pod ní jsou podrobnosti (index, popla
         +tek proti originálu, dividendy).                               
      58  3. **Přehled všech 7 párů v kompaktních kartách.** Pro ty, kdo 
          chtějí vidět celek, než se rozhodnou. Karty zvýrazňují „✓ koupí
          š u …“ a poplatek ukazují lidsky v korunách; ISINy a postup zůs
          távají v taháku.
      59  4. **Proč ti broker americká ETF často nenabídne (2–3 věty).** 
          Vysvětlení, proč dvojčata vůbec potřebujeme. Až tady, protože t
          en, kdo přišel z reklamy „Dvojče“, už důvod zná z úvodu a nechc
          e ho číst před výsledkem.
      60  5. **Důvěra: zdroje dat s datem a upozornění, že nejde o invest
          iční doporučení.** Těsně před formulářem odpovídá na otázku „mů
          žu tomu věřit?“. Krátká verze (zdroj, datum, „Není to investičn
          í doporučení“) je i hned pod lístky.
      63 -6. **Formulář (e-mail a souhlas).** Pro ty, kdo dočetli až sem.
         - Výzvy ze sekce 2 a z tlačítka dole sem nevedou, otevírají form
         -ulář na místě. Tuhle změnu oproti původnímu návrhu navrhla AI (
         -Claude Code): méně kroků a žádné přeskakování stránkou.        
      61 +6. **Formulář (e-mail a souhlas).** Pro ty, kdo dočetli až sem.
         + Výzvy ze sekce 2 a z lišty dole sem nevedou, otevírají formulá
         +ř na místě: skok přes tři sekce stojí konverze a návštěvník ztr
         +atí kontext. Tuhle změnu oproti původnímu návrhu navrhla AI (Cl
         +aude Code).                                                    
      62  7. **Krátké FAQ (Je to zdarma? Co s mým e-mailem?).** Odstraní 
          poslední obavy u formuláře, hlavně strach ze spamu.
      63  
      64  ## Dvě verze reklamy

  Read 1 file, called plugin:context-mode:context-mode 2 times (ctrl+o to expand)

⏺ Ověřil jsem, že Vercel na bezplatném tarifu umožňuje cron pouze jednou denně,
  takže tvrzení v README je správné. Teď opravím slovo „anonymní“ a projdu, zda
  všechny odkazy v README vedou na existující nadpisy.

⏺ Bash(python3 - <<'EOF'
      import re…)
  ⎿  Updated README.md (+1 -1)
      234  
      235  ## Měření cesty návštěvníka
      236  
      237 -Vlastní anonymní události místo GA4, bez cookies a bez cookie 
          -lišty. Stránka je posílá přes `navigator.sendBeacon` na [`/api
          -/event`](api/event.js) a funkce je ukládá do tabulky `events` 
          -v Supabase ([schéma](supabase/schema.sql)).                   
      237 +Vlastní události místo GA4, bez cookies a bez cookie lišty. St
          +ránka je posílá přes `navigator.sendBeacon` na [`/api/event`](
          +api/event.js) a funkce je ukládá do tabulky `events` v Supabas
          +e ([schéma](supabase/schema.sql)).                            
      238  
      239  | Událost | Kdy | Detail | ID návštěvy |
      240  |---|---|---|---|

⏺ Odkazy, soubory i TODO jsou v pořádku. Ověřím ještě zbylá čísla z README proti
  kódu.

  Searched for 1 pattern, listed 1 directory (ctrl+o to expand)

⏺ Všechna čísla sedí (náhled taháku má 24 434 B). Commitnu bod 11.

  Ran 1 shell command (ctrl+o to expand)

⏺ Bod 11 je hotový. Pokračuji bodem 12 – prohledám celou historii gitu na klíče,
  tajemství, soubory .env/ZADANI.md a e-maily v ai-log, výsledky uvedu jen
  maskovaně bez vypisování citlivých hodnot.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Nic citlivého v historii nenacházím – žádné klíče, tokeny ani soubory
  .env/ZADANI.md. Teď ověřím šest nálezů „proměnná s hodnotou“, které podle
  souborů vypadají jako řádky kódu v lokálním serveru a testech.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Všech šest nálezů jsou jen testovací atrapy a místní sůl, žádné skutečné
  hodnoty. Teď projdu e-maily v ai-log, včetně nového nesledovaného exportu, a
  pro jistotu i celou historii.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ V historii jsem nenašel žádné klíče ani tajemství, ale narazil jsem na pár
  e-mailových adres na skutečných doménách (seznam.cz, email.cz, gmail.com) i
  testovací adresy v souboru ai-log, včetně nesledovaného exportu 03. Teď
  zjistím, kde tyto adresy jsou a jestli už nejsou zveřejněné na GitHubu.

  Called plugin:context-mode:context-mode (ctrl+o to expand)
  ⎿  You've hit your session limit · resets 7:20pm (Europe/Prague)
     /upgrade to increase your usage limit.

❯ muzes pokracovat

⏺ Pokračuju. Adresa na email.cz je pořád v index.html a texty.md, nejspíš jako
  ukázkový text v poli e-mailu. Podívám se na kontext (adresu maskovaně).

  Ran 1 shell command (ctrl+o to expand)

⏺ V nesledovaném exportu 03 nahradím testovací adresy na reálných doménách za
  @example.com (tvoji adresu a placeholder nechám beze změny) a zároveň v
  exportu zkontroluju výskyt klíčů.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ V exportu jsem nahradil 11 testovacích adres. Zůstaly jen tvoje adresa a
  placeholder. Klíče ani tajemství export neobsahuje. Commitnu ho jako výsledek
  bodu 12.
  Ran 1 shell command (ctrl+o to expand)

⏺ Bod 12 je hotový (34ffb63). Bod 13: zápis dnešní práce do deníku.

⏺ Bash(cat >> ai-log/denik.md <<'EOF'…)
  ⎿  Updated ai-log/denik.md (+34 -0)
      130    - AI ve svém předchozím počtu uvedla 45 kontrol databáze, sk
           utečně jich je 44. Přišlo se na to při kontrole výstupu před c
           ommitem.
      131    - Klepnutí v testech míjela tlačítka, protože fokus stránku 
           ještě plynule posouval. Šlo o chybu testu, ne stránky; test te
           ď čeká na doběhnutí posunu.
      132    - Review hlásil chybějící nezlomitelné mezery v textech z JS
           . Kontrola znaků ukázala, že tam jsou (jako znak, ne `&nbsp;`)
           , takže falešný poplach.
      133 +                                                              
      134 +### 2026-10-11 – dotažení před nasazením: JS, limity, MX, páro
          +vání, README, kontrola repa                                   
      135 +                                                              
      136 +- **Zadání pro AI** (připravené v plánovacím chatu na claude.a
          +i):                                                           
      137 +  - JS pod limit 20 kB bez ztráty funkcí,                     
      138 +  - limit kontaktů z jedné IP na 30 za hodinu (CGNAT),        
      139 +  - ověřit fail-open a krátký timeout u kontroly MX a přidat t
          +est,                                                          
      140 +  - podle rozhodnutí člověka: odeslání bez ID návštěvy, varian
          +ta u kontaktu, čas událostí na minuty, trychtýř odeslání z kon
          +taktů, pravdivý popis v README i zásadách,                    
      141 +  - zdroj, datum a „Není to investiční doporučení“ u lístků,  
      142 +  - README pro hodnotitele: shrnutí, vyzkoušení za 2 minuty, k
          +onverze po krocích, obchodní pohled, tři A/B hypotézy s počtem
          + návštěv, práce s AI, revize celého textu,                    
      143 +  - kontrola historie gitu a ai-log, checklist nasazení, commi
          +t po každém bodu, push na konci.                              
      144 +- **Kontrola výstupu:**                                       
      145 +  - každý bod commitnutý zvlášť až po testech: API 127, databá
          +ze 57, Chrome 127 a WebKit 81 kontrol,                        
      146 +  - nové kontroly:                                            
      147 +    - velikost JS,                                            
      148 +    - záložní UUID bez `crypto.randomUUID`,                   
      149 +    - 30. a 31. pokus,                                        
      150 +    - šest druhů chyb DNS, timeout 1 s a zrušený časovač,     
      151 +    - události bez ID návštěvy (funkce, databáze i prohlížeč),
      152 +    - trychtýř z kontaktů,                                    
      153 +    - razítko u lístků,                                       
      154 +  - kontrola MX ověřená i proti skutečnému DNS (20 ms, `exampl
          +e.com` s null MX správně odmítnutá),                          
      155 +  - benchmarky jen z ověřených stránek (Unbounce, LocaliQ). Wo
          +rdStream vrátil 403, proto čísla z LocaliQ (stejná firma),    
      156 +  - v README skript ověřil všechny odkazy na nadpisy a soubory
          + a že nezůstalo TODO,                                         
      157 +  - celá historie gitu prohledaná na klíče, `.env` a `ZADANI.m
          +d` (nic) a ai-log na e-maily. Výstup byl jen maskovaný, aby se
          + adresy nedostaly do exportu.                                 
      158 +- **Kde se AI spletla a jak se na to přišlo:**                
      159 +  - **Kontrola MX odmítala doménu bez MX záznamu,** i když poš
          +ta jde podle RFC 5321 na adresu domény (implicitní MX). Navíc 
          +časovač timeoutu zůstával běžet. AI to našla, když ověřovala f
          +ail-open, o který člověk požádal.                             
      160 +  - **Limit 10 kontaktů za hodinu AI v README označila za „mál
          +o pravděpodobný“ problém** pro skutečné lidi. Člověk upozornil
          + na sdílené IP mobilních operátorů (CGNAT).                   
      161 +  - **Chrome test po zkrácení JS selhal na klepnutí na souhlas
          +.** AI nejdřív pustila test se starou verzí stránky: selhal ta
          +ky, takže chyba nebyla ve změně. Příčinu našla záznamem událos
          +tí: puppeteer před klepnutím posouval stránku a se `scroll-beh
          +avior: smooth` klepl vedle. Test teď prvek nejdřív okamžitě vy
          +středí.                                                       
      162 +  - **Rozhodnutí „odeslání bez ID návštěvy“ by samo nestačilo:
          +** pokus bez chyby nebo otevřený tahák s ID návštěvy prozradí 
          +totéž. AI proto bez ID posílá i pokus, chybu, otevření taháku 
          +a sdílení a v reportu to řekla člověku.                       
      163 +  - **Automatická bezpečnostní kontrola commitu označila rizik
          +o deanonymizace v `schema.sql`.** Šlo o zbytkové párování při 
          +malém provozu (pořadí zápisu, minuta), které README popisuje. 
          +AI k němu doplnila i zúžení podle místa formuláře v události o
          +deslání.                                                      
      164 +  - **Razítko pod lístky tvrdilo „Data přímo od správců fondů“
          +,** ale lístky ukazují i dostupnost u brokerů, a ta je z webů 
          +brokerů. Opraveno spolu s doplněním „Není to investiční doporu
          +čení“.                                                        
      165 +  - **`reklamy/README.md` tvrdilo, že se `utm_content` ukládá 
          +k událostem.** Neukládá, verzi nese `?v=`. Přišlo se na to při
          + revizi README.                                               
      166 +  - **V nesledovaném exportu `03` bylo 11 testovacích adres na
          + skutečných doménách** z minulého kola (adresy, které AI dřív 
          +nahradila v kódu). Před commitem nahrazené za `@example.com`. 
          +V historii gitu na GitHubu zůstávají dvě podobné adresy (deník
          + a test), historie se nepřepisuje.                            

⏺ Bod 13 hotov (7754f90). Teď upravím sekci Nasazení v README na checklist
  včetně kontrol na živé adrese a stejný seznam přidám do reportu.

⏺ Bash(python3 - <<'EOF'
      p='README.md'…)
  ⎿  Updated README.md (+32 -28)
      420  
      421  - odebrat `noindex`: meta tag v `public/index.html` a hlavičku
            `X-Robots-Tag` ve `vercel.json`, a poznámku „Ukázkové řešení 
           do výběrového řízení“ v patičce. Do té doby ji vyhledávače nei
           ndexují (Lighthouse proto v kategorii SEO hlásí „stránka je bl
           okovaná pro indexování“, to je záměr).
      422  
      423 -**Po nasazení (vývojář):**                                    
      424 -                                                              
      425 -- ověřit, že projekt dostal adresu `https://etf-dvojcata-demo.
          -vercel.app` (jinak změnit kanonickou adresu, `og:url` a `og:im
          -age` v `public/index.html`), a odkaz zkontrolovat v [nástroji 
          -pro ladění sdílení od Facebooku](https://developers.facebook.c
          -om/tools/debug/).                                             
      426 -                                                              
      423  ## Nasazení na Supabase a Vercel
      424  
      429 -Všechno je připravené, stačí založit projekty a zadat čtyři pr
          -oměnné prostředí. Klíče patří jen do Vercelu (a lokálně do `.e
          -nv.local`, který je v `.gitignore`), nikdy do repa ani do chat
          -u.                                                            
      425 +Checklist krok po kroku. Klíče patří jen do Vercelu (a lokálně
          + do `.env.local`, který je v `.gitignore`), nikdy do repa ani 
          +do chatu.                                                     
      426  
      431 -**1. Supabase (databáze)**                                    
      427 +**1. Supabase (databáze v EU)**                               
      428  
      433 -1. Na [supabase.com](https://supabase.com/dashboard) → **New p
          -roject**. Název třeba `etf-dvojcata`, **Region: Central EU (Fr
          -ankfurt)**, tedy `eu-central-1`. Heslo k databázi si ulož do s
          -právce hesel, stránka ho nepotřebuje.                         
      434 -2. **SQL Editor → New query** → vlož celý [supabase/schema.sql
          -](supabase/schema.sql) → **Run**. V **Table Editor** pak uvidí
          -š tabulky `leads`, `events` a `limity`, všechny s RLS zapnutým
          -.                                                             
      435 -3. Znovu **SQL Editor → New query** → vlož [supabase/funnel.sq
          -l](supabase/funnel.sql) → **Run**. Trychtýř pak kdykoli zobraz
          -íš dotazem `select * from analytika.trychtyr;`.               
      436 -4. Tlačítko **Connect** (nebo **Project Settings → Data API**)
          -: zkopíruj **Project URL** (`https://….supabase.co`), to je `S
          -UPABASE_URL`.                                                 
      437 -5. **Project Settings → API Keys → Secret keys**: zkopíruj sec
          -ret klíč (`sb_secret_…`), to je `SUPABASE_SECRET_KEY`. Publish
          -able klíč stránka nepotřebuje, prohlížeč se Supabase vůbec nek
          -ontaktuje.                                                    
      429 +- [ ] [supabase.com/dashboard](https://supabase.com/dashboard)
          + → **New project**, název třeba `etf-dvojcata`, **Region: Cent
          +ral EU (Frankfurt)**, tedy `eu-central-1`. Heslo k databázi do
          + správce hesel, stránka ho nepotřebuje.                       
      430 +- [ ] **SQL Editor → New query** → vlož celý [supabase/schema.
          +sql](supabase/schema.sql) → **Run**. V **Table Editor** jsou p
          +ak tabulky `leads`, `events` a `limity`, všechny s RLS.       
      431 +- [ ] Znovu **SQL Editor → New query** → [supabase/funnel.sql]
          +(supabase/funnel.sql) → **Run** (až po `schema.sql`). Zkouška:
          + `select * from analytika.trychtyr;` vrátí 12 řádků s nulami. 
      432 +- [ ] **Connect** (nebo **Project Settings → Data API**): **Pr
          +oject URL** (`https://….supabase.co`) je `SUPABASE_URL`.      
      433 +- [ ] **Project Settings → API Keys → Secret keys**: secret kl
          +íč (`sb_secret_…`) je `SUPABASE_SECRET_KEY`. Publishable klíč 
          +stránka nepotřebuje.                                          
      434  
      435  **2. Vercel (web a funkce)**
      436  
      441 -1. Na [vercel.com](https://vercel.com/new) → **Add New → Proje
          -ct** → importuj repozitář z GitHubu.                          
      442 -2. **Project Name:** `etf-dvojcata-demo`. Adresa pak bude `htt
          -ps://etf-dvojcata-demo.vercel.app` a sedí s kanonickou adresou
          -, `og:url` a `og:image` ve stránce. Stránka není oficiálně Cli
          -entela, proto bez jejich jména v adrese. `etf-dvojcata` už pou
          -žívá cizí projekt, `etf-dvojcata-demo` byl 11. 10. 2026 volný.
          - Kdyby Vercel přidělil jinou adresu, změň tři řádky v hlavičce
          - `public/index.html` (hledej `etf-dvojcata-demo`).            
      443 -3. **Framework Preset:** Other. Build ani výstupní složku nemě
          -ň, nastavuje je [vercel.json](vercel.json): web z `public/`, f
          -unkce z `api/` ve Frankfurtu (`fra1`) a denní cron na `/api/ke
          -epalive`.                                                     
      444 -4. **Environment Variables** (pro Production, případně i Previ
          -ew):                                                          
      445 -   - `SUPABASE_URL`: Project URL ze Supabase,                 
      446 -   - `SUPABASE_SECRET_KEY`: secret klíč `sb_secret_…`,        
      447 -   - `CRON_SECRET`: náhodný řetězec aspoň 16 znaků, vytvoříš h
          -o třeba příkazem `openssl rand -hex 24`. Vercel ho posílá cron
          -u v hlavičce, bez něj keep-alive nic neudělá.                 
      448 -   - `ANTISPAM_SECRET`: náhodný řetězec aspoň 32 znaků (`opens
          -sl rand -hex 32`). Podepisuje token formuláře a hashuje IP adr
          -esy pro limit pokusů. Bez něj formulář vrátí chybu.           
      449 -5. **Deploy.**                                                
      450 -                                                              
      451 -**3. Kontrola po nasazení**                                   
      452 -                                                              
     … 32 more lines (ctrl+o to expand)

  Ran 1 shell command (ctrl+o to expand)

⏺ Bod 14 je hotový (022fcd9). Teď finální ověření: všechny testy, Lighthouse a
  obnovené snímky (razítko u lístků se změnilo). Nejdřív zjistím, jak se pouští
  Lighthouse a snímky.

  Searched for 1 pattern, called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Všechny testy prošly a odpovídají počtům z README (API 127, databáze 57,
  Chrome 127, WebKit 81, data 183 bez chyb, PDF a CSP v pořádku). Teď spustím
  Lighthouse pro tři verze úvodu a obnovím snímky.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Lighthouse ukazuje skóre 100 pro výkon, přístupnost i osvědčené postupy, SEO
  66, LCP 1,2 s, CLS 0, TBT 0 ms a 87 KiB. Teď ověřím, že SEO snižuje jen
  záměrný noindex, a podívám se na obnovený snímek úvodu.

  Read 1 file, called plugin:context-mode:context-mode, ran 1 shell command (ctrl+o to expand)

⏺ Lighthouse shazuje jen záměrný noindex: v konzoli nejsou chyby a CSP proti XSS
  prochází. Snímky jsou v pořádku. Změřím velikost stránky a doplním finální
  čísla do README.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Bash(cd /Users/daniel/etfLanding && python3 - <<'EOF'
      p='README.md'…)
  ⎿  Updated README.md (+1 -1)
      265  
      266  **Stack:** čisté HTML, CSS a JavaScript bez frameworku a bez b
           uild kroku, Vercel (statika a serverless funkce) a Supabase (P
           ostgres v EU). Proč: stránka pro návštěvníka z mobilní reklamy
            musí být hlavně rychlá a malá a tohle je nejkratší cesta k we
           bu, funkcím a databázi zdarma, v EU a bez závislostí, které by
            se musely instalovat a aktualizovat.
      267  
      268 -- **Celá stránka je jeden soubor `public/index.html`** s inlin
          -e CSS a JS a systémovým písmem. Bez externích skriptů a písem:
          - 60,7 kB, po gzipu 17,7 kB, z toho JS 19,2 kB (oba vložené skr
          -ipty, po gzipu 7,0 kB, limit 20 kB hlídá test). Jediný obrázek
          - je náhled taháku (WebP, 24 kB), který se načte až u formuláře
          -. Lighthouse (mobil, 11. 10. 2026, lokální server bez komprese
          -, s CSP a ostatními hlavičkami z `vercel.json`): výkon, přístu
          -pnost a osvědčené postupy 100 u všech tří verzí úvodu, LCP 1,2
          - s, CLS 0, TBT 0 ms, celkem 88 KiB. SEO 66, protože stránka má
          - záměrně `noindex` (jediný neúspěšný audit je „stránka je blok
          -ovaná pro indexování“).                                       
      268 +- **Celá stránka je jeden soubor `public/index.html`** s inlin
          +e CSS a JS a systémovým písmem. Bez externích skriptů a písem:
          + 61,0 kB, po gzipu 17,8 kB, z toho JS 19,4 kB (oba vložené skr
          +ipty, po gzipu 7,1 kB, limit 20 kB hlídá test). Jediný obrázek
          + je náhled taháku (WebP, 24 kB), který se načte až u formuláře
          +. Lighthouse (mobil, 11. 10. 2026, lokální server bez komprese
          +, s CSP a ostatními hlavičkami z `vercel.json`): výkon, přístu
          +pnost a osvědčené postupy 100 u všech tří verzí úvodu, LCP 1,2
          + s, CLS 0, TBT 0 ms, celkem 87 KiB, bez chyb v konzoli. SEO 66
          +, protože stránka má záměrně `noindex` (jediný neúspěšný audit
          + je „stránka je blokovaná pro indexování“).                   
      269  - **„Ručně kreslené“ prvky bez písma navíc.** Fix, šipky, krou
           žky a fajfky jsou malá inline SVG. Rukou psané písmo by přidal
           o desítky kB a probliknutí textu. Lístky se otáčejí bez 3D kon
           textu a bez `backface-visibility`: JS (Web Animations API, bez
            knihovny) otočí jednu rovinu s perspektivou o 90°, když je lí
           stek z boku, vymění strany a dotočí. WebKit to kreslí stejně s
            grafickým čipem i bez něj. Při `prefers-reduced-motion` se je
           n vymění strany.
      270  - **Ikony a obrázek pro sdílení generuje skript** ([scripts/ob
           razky.mjs](scripts/obrazky.mjs)) ve stylu stránky a s čísly z 
           `data/etf.json`: favicon (SVG a ICO), ikona pro iOS a `og.png`
            1200×630 pro náhled odkazu na Facebooku a v Messengeru. Strán
           ka si je nenačítá, takže nezdržují.
      271  - **Jen světlé barvy** (`color-scheme: only light`). Tmavý rež
           im iOS ani automatické ztmavení v Chromu stránku nepřebarví, „
           sešit“ zůstane papírový.

⏺ Všechno je commitnuté. Před pushem ještě projdu, co přesně odchází na GitHub,
  jestli v tom nejsou klíče nebo skutečné e-maily.

  Called plugin:context-mode:context-mode (ctrl+o to expand)

⏺ Čisto. Pushuju 21 commitů (6 z minulého kola a 15 dnešních) na GitHub.

  Ran 1 shell command (ctrl+o to expand)

⏺ Všech 14 bodů je hotových a pushnutých na GitHub (c6cd365..4f19a60, 21
  commitů: 6 z minulého kola a 15 dnešních, každý bod zvlášť).

  Co se změnilo

  1. JS: 19 379 B místo 21 229 B (oba vložené skripty). Zkrátil jsem komentáře a
     záložní generování ID návštěvy, funkce se nezměnily. Limit hlídá test.
  2. Limit kontaktů: 30 za hodinu z jedné IP, důvod (CGNAT) je v README. Každé
     odmítnutí limitem se zapíše do logu Vercelu bez IP, takže během kampaně
     poznáš, kdy limit zvednout.
  3. Kontrola MX: při chybě nebo timeoutu DNS kontakt projde, timeout je 1 s
     (skutečné dotazy trvají kolem 20 ms). Našel a opravil jsem dvě chyby:
     - časovač po odpovědi zůstával běžet,
     - doména bez MX záznamu, ale s vlastní adresou se odmítala, přestože pošta
       podle RFC 5321 jde i na tu adresu.
  4. Párování kontaktu s návštěvou: udělal jsem, jak jsi rozhodl, a navíc jsem
     bez ID návštěvy poslal i pokus o odeslání, chybu, otevření taháku a
     sdílení. Kdyby ID měly, bylo by podle nich vidět, která návštěva odeslala.
     Databáze to vynucuje sama. Pokud to chceš jen u odeslání, vrátím to.
     - Čas událostí je na minuty, varianta se ukládá ke kontaktu a trychtýř
       počítá odeslání z tabulky kontaktů.
     - README i zásady píšou, co zůstává: kdo má přístup do databáze, může při
       malém provozu odhadnout pár podle pořadí zápisu, minuty a místa
       formuláře.
     - Automatická bezpečnostní kontrola commitu právě tohle označila, odpovídá
       to popsanému zbytkovému riziku.
  5. U lístků chybělo „Není to investiční doporučení“ a zdroj neuváděl brokery.
     Teď tam je: „Data od správců fondů a brokerů, ověřeno 10. 10. 2026
     (zdroje). Není to investiční doporučení.“
  6. README pro hodnotitele:
     - nahoře shrnutí, postup „vyzkoušej za 2 minuty“, konverze po krocích,
       obchodní pohled a tři hypotézy, dál práce s AI s tvými příklady chyb,
     - doplněné prázdné sekce: reklamy, zdroje dat, technická rozhodnutí, co
       chybí,
     - opravená zastaralá čísla a rozpory, smazaná opakování.
     - Očekávaná konverze: 2–13 %, nejspíš 6 %. Benchmark Unbounce má dva údaje,
       které se rozcházejí (8,3 % a starší 3,8 %), uvádím oba.
     - Cena za kontakt: při 10 Kč za klik vychází kolem 196 Kč. Cena za klik v
       Česku je můj předpoklad, ověřený zdroj pro český trh nemám.
     - Trychtýř bez Supabase: lokální server ho teď ukazuje na /__dev/trychtyr.
  7. Repozitář:
     - V celé historii nejsou klíče, .env ani ZADANI.md.
     - V nesledovaném exportu 03 jsem před commitem nahradil 11 testovacích
       adres na skutečných doménách za @example.com.
     - V historii na GitHubu zůstávají dvě takové adresy z dřívějška (deník a
       test). Smazat by šly jen přepsáním historie, a to podle pravidel nedělám.
     - Placeholder …@email.cz v poli e-mailu je ukázkový text, ne kontakt na
       člověka, ten jsem nechal.

  Testy

  ┌──────────────────────────────────────────────┬──────────┐
  │                   Kontrola                   │ Výsledek │
  ├──────────────────────────────────────────────┼──────────┤
  │ Funkce v api/                                │ 127/127  │
  ├──────────────────────────────────────────────┼──────────┤
  │ SQL na Postgresu                             │ 57/57    │
  ├──────────────────────────────────────────────┼──────────┤
  │ Chrome                                       │ 127/127  │
  ├──────────────────────────────────────────────┼──────────┤
  │ WebKit                                       │ 81/81    │
  ├──────────────────────────────────────────────┼──────────┤
  │ Data (183 údajů), čísla na stránce, PDF, CSP │ bez chyb │
  └──────────────────────────────────────────────┴──────────┘

  Lighthouse (mobil, všechny tři verze úvodu): výkon, přístupnost a osvědčené
  postupy 100, LCP 1,2 s, CLS 0, 87 KiB, bez chyb v konzoli. SEO 66 jen kvůli
  záměrnému noindex.

  Jedna věc z průběhu: Chrome test začal selhávat na klepnutí na zaškrtávátko, i
  se starou verzí stránky. Byla to chyba testu, ne stránky: puppeteer před
  klepnutím plynule posouval stránku a klepl vedle. Opravil jsem test.

  Checklist nasazení

  Podrobně se zaškrtávátky je v README v sekci „Nasazení na Supabase a Vercel“.

  Supabase
  1. New project, Region Central EU (Frankfurt).
  2. SQL Editor: spusť supabase/schema.sql, potom supabase/funnel.sql. Dotaz
     select * from analytika.trychtyr; vrátí 12 řádků s nulami.
  3. Zkopíruj Project URL (to je SUPABASE_URL) a Secret key sb_secret_… (to je
     SUPABASE_SECRET_KEY).

  Vercel
  1. Importuj repozitář, Project Name etf-dvojcata-demo, Framework Preset Other.
  2. Environment Variables (Production):
     - SUPABASE_URL
     - SUPABASE_SECRET_KEY
     - CRON_SECRET (openssl rand -hex 24)
     - ANTISPAM_SECRET (openssl rand -hex 32)
  3. Deploy. Pokud proměnné přidáš až po prvním nasazení, pusť Redeploy.

  Kontrola na https://etf-dvojcata-demo.vercel.app
  1. Adresa sedí. Jinak změň tři řádky s etf-dvojcata-demo v hlavičce
     index.html.
  2. curl -sI na stránku ukáže CSP, HSTS a x-robots-tag: noindex.
  3. /api/token vrátí token (503 znamená, že chybí ANTISPAM_SECRET).
     /api/keepalive bez tajemství vrátí 401.
  4. Z telefonu otevři ?v=dvojce, otoč lístek a odešli svůj e-mail.
     - V tabulce leads je řádek s verzí dvojce.
     - V events je odeslano bez ID návštěvy.
     - Trychtýř ukazuje všechny čtyři kroky.
  5. x@mailinator.com a test@neexistuje.invalid ukážou svou hlášku.
  6. Dotaz na leads s publishable klíčem vrátí chybu oprávnění, ne data.
  7. Vercel: cron /api/keepalive pusť tlačítkem Run (v logu musí být 200),
     region funkcí fra1.
  8. PageSpeed Insights na živé adrese, Facebook Sharing Debugger.
  9. 15. 10. zkontroluj, že projekt v Supabase neběží jako „Paused“.

  Až z téhle konverzace uděláš export 04, prosím projdi ho na e-maily stejně
  jako 03, nebo mi ho pošli a projdu ho já.