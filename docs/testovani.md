# Testování: co automaticky a co jen na telefonu

Část [README](../README.md), přesunutá sem, aby se hlavní README dalo přečíst za 5 minut.

Skripty a návod jsou ve [scripts/](../scripts/README.md). Všechny vracejí nenulový kód, když něco neprojde.

**Automaticky:**

- **Funkce v `api/`** s podvrženou databází a DNS ([test-api.mjs](../scripts/test-api.mjs), 132 kontrol): každá kontrola z cesty kontaktu, verze textu souhlasu, UTM u příchodu, MX při chybě a timeoutu DNS, události s ID návštěvy a bez něj, hlavičky, nepřítomnost e-mailu, klíče a IP v logu.
- **SQL** na skutečném Postgresu v PGlite ([test-db.mjs](../scripts/test-db.mjs), 80 kontrol): práva anonymní role, RLS, limity, duplicity, verze souhlasu, události bez ID návštěvy, čas na minuty, trychtýř od data, migrace starší databáze, trychtýř a projekt bez automatických práv Supabase.
- **Chrome** (headless, 375 px, dotyk, [test-page.mjs](../scripts/test-page.mjs), 134 kontrol): výzva po prvním otočení vidět hned pod řadou lístku, text souhlasu proti `SOUHLAS` v `api/_lib.js`, řádek o taháku na první obrazovce, otočení všech lístků, chybové hlášky, odeslání, panel, lišta dole, měření (každá událost dorazí, e-mail nikdy s ID návštěvy, události od odeslání bez něj), CSP, velikost JS do 20 kB, `prefers-reduced-motion`.
- **WebKit, tedy engine Safari** (Playwright, emulace iPhonu 13, iPhonu SE 3. generace a iPhonu SE 1. generace s šířkou 320 px, [test-webkit.mjs](../scripts/test-webkit.mjs), 81 kontrol): panel a formuláře na místě s otevřenou klávesnicí. Emulátor softwarovou klávesnici nemá, proto ji test simuluje dvěma způsoby:
  - jako iOS: layout viewport zůstane, zmenší se jen `visualViewport` a viditelná oblast se posune k poli,
  - jako Android: zmenší se celé okno.

  Kontroluje, že:
  - nad klávesnicí (s rezervou 50 px na lištu návrhů e-mailů) je vidět pole a tlačítko a souhlas začíná těsně pod nimi; na 375 a 390 px i nadpis panelu. Na 320 px se nadpis vejít nemusí, přednost má pole a tlačítko,
  - pozadí se pod panelem nepohne,
  - po zavření se stránka vrátí na stejné místo a fokus na tlačítko, které panel otevřelo,
  - nic nepřetéká do šířky.

  Viditelnou výšku nad klávesnicí (328 px na iPhonu 13, 343 px na SE, 244 px na 320 px) jsme odhadli pesimisticky, nenaměřili. Nad klávesnicí navíc počítá s 50px lištou s návrhy e-mailů, kterou iOS do `visualViewport` nemusí započítat: pole a tlačítko musí být celé nad ní.
- **WebKit, průběh otočení lístku:** animaci zastaví po 100 ms a kontroluje úhel, šířku a viditelnou stranu (nikdy zrcadlově, nikdy prázdný lístek), z výřezů skládá [snímek](screenshots/webkit-otoceni-listku.png).
- **Lighthouse (mobil), data proti zdrojům, čísla na stránce proti datům, text PDF proti datům.**

**Jen na skutečném telefonu:**

- skutečná klávesnice iOS: její výška, lišta nad ní (šipky, Hotovo, návrhy e-mailů) a to, jak Safari sám posouvá stránku k poli. **Lištu s návrhy e-mailů simulace nezachytila, našel ji až test na skutečném telefonu** ([víc](prace-s-ai.md#jak-jsem-pracoval-s-ai)),
- plynulost otočení lístků na skutečném displeji (průběh po 100 ms kontroluje WebKit),
- otevření a uložení PDF v Safari,
- nativní sdílení a kopírování odkazu,
- výřez displeje a domovský indikátor (safe area), tmavý režim iOS,
- dotyková odezva a gumové dotažení stránky,
- **Android vůbec:** skutečné zařízení nemám, co je ověřené jen v emulaci, je v [Co v řešení chybí](../README.md#co-v-řešení-chybí).

**Snímky před úpravami a po nich** jsou v [docs/screenshots/](screenshots/) (375 px, generuje `scripts/screenshots.mjs`):

| | Před | Po |
|---|---|---|
| Úvod | <img src="screenshots/pred-1-uvod.png" width="220" alt="Úvod před"> | <img src="screenshots/po-1-uvod.png" width="220" alt="Úvod po"> |
| Výběr ETF | <img src="screenshots/pred-2-vysledek-voo.png" width="220" alt="Výsledek VOO před"> | <img src="screenshots/po-2-otoceny-listek.png" width="220" alt="Otočený lístek VOO po"> |
| Karty párů | <img src="screenshots/pred-3-karty-paru.png" width="220" alt="Karty párů před"> | <img src="screenshots/po-3-karty-paru.png" width="220" alt="Karty párů po"> |
| Formulář | <img src="screenshots/pred-4-formular.png" width="220" alt="Formulář před"> | <img src="screenshots/po-4-formular.png" width="220" alt="Formulář s náhledem taháku po"> |
| Poděkování | <img src="screenshots/pred-5-podekovani.png" width="220" alt="Rozbité poděkování před"> | <img src="screenshots/po-5-podekovani.png" width="220" alt="Poděkování po"> |

Varianty úvodu po: [?v=dvojce](screenshots/po-1b-uvod-dvojce.png), [?v=zacatek](screenshots/po-1c-uvod-zacatek.png).

Panel a formulář na místě s otevřenou klávesnicí ve WebKitu (simulace, viz [scripts/test-webkit.mjs](../scripts/test-webkit.mjs)):

| | iPhone SE 1. gen. (320 px) | iPhone SE 3. gen. (375 px) | iPhone 13 (390 px) |
|---|---|---|---|
| Panel ze spodní lišty | <img src="screenshots/webkit-panel-klavesnice-320.png" width="180" alt="Panel s klávesnicí, 320 px"> | <img src="screenshots/webkit-panel-klavesnice-375.png" width="180" alt="Panel s klávesnicí, 375 px"> | <img src="screenshots/webkit-panel-klavesnice-390.png" width="180" alt="Panel s klávesnicí, 390 px"> |
| Formulář pod lístky | <img src="screenshots/webkit-na-miste-klavesnice-320.png" width="180" alt="Formulář na místě s klávesnicí, 320 px"> | <img src="screenshots/webkit-na-miste-klavesnice-375.png" width="180" alt="Formulář na místě s klávesnicí, 375 px"> | <img src="screenshots/webkit-na-miste-klavesnice-390.png" width="180" alt="Formulář na místě s klávesnicí, 390 px"> |
