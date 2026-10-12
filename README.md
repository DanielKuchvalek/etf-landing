# ETF dvojčata – konverzní landing page (zadání B)

- **Živá stránka** (nasazeno 11. 10. 2026): [etf-dvojcata-demo.vercel.app](https://etf-dvojcata-demo.vercel.app/) · reklama A „Dvojče“: [?v=dvojce](https://etf-dvojcata-demo.vercel.app/?v=dvojce) · reklama B „Začátek“: [?v=zacatek](https://etf-dvojcata-demo.vercel.app/?v=zacatek)
- **Myšlenka:** americká ETF ti broker v Česku často nenabídne. Stránka k 7 známým ETF z NYSE jedním klepnutím ukáže evropské „dvojče“ z nabídky brokerů v Česku a za e-mail dá PDF tahák s ISINy a postupem nákupu.
- **Očekávaná konverze** (návštěva → odeslaný formulář): 2–13 %, nejspíš kolem 6 %. Je to odhad, [výpočet níž](#očekávaná-konverze).
- **Do ostrého spuštění chybí:** posouzení právníkem, rozhodnutí o double opt-inu, údaje a e-mailová služba od správce, ověření pravidel Meta pro finanční reklamu a vlastní doména ([seznam](docs/pred-spustenim.md)).

## Jak to vyzkoušet za 2 minuty

1. Na mobilu otevři [?v=dvojce](https://etf-dvojcata-demo.vercel.app/?v=dvojce) (navazuje na reklamu A), pro srovnání [?v=zacatek](https://etf-dvojcata-demo.vercel.app/?v=zacatek).
2. Klepni na lístek **VOO**: ukáže dvojče VUAA, u kterých brokerů je v nabídce a kolik stojí ročně z 10 000 Kč. Hned pod řadou lístku se objeví výzva k taháku.
3. Klepni na „Chci tahák s postupem nákupu“, zadej e-mail a souhlas. Přijde poděkování s „Otevřít tahák“ (PDF) a sdílením.
4. Ochrana formuláře: zkus `x@mailinator.com` nebo `test@neexistuje.invalid`.

| Úvod (`?v=dvojce`) | Otočený lístek | Formulář pod lístky | Poděkování |
|---|---|---|---|
| <img src="docs/screenshots/zive-1-uvod.png" width="180" alt="Úvod podle reklamy A"> | <img src="docs/screenshots/zive-2-otoceny-listek.png" width="180" alt="Otočený lístek VOO s dvojčetem VUAA"> | <img src="docs/screenshots/zive-3-formular.png" width="180" alt="Formulář pod lístky"> | <img src="docs/screenshots/zive-4-podekovani.png" width="180" alt="Poděkování s tlačítkem Otevřít tahák"> |

Snímky z iPhonu 13 (390 × 844), poděkování z lokálního serveru. **Trychtýř:** v Supabase `select * from analytika.trychtyr;` (projekt je na mém účtu, výstup ukážu), lokálně `./scripts/serve.sh` a http://127.0.0.1:8737/__dev/trychtyr.

## Cílová skupina

**Začínající investoři 25–40 let** z reklamy na Instagramu a Facebooku, na mobilu, s pár sekundami pozornosti. O ETF slyšeli (YouTube, TikTok, kamarád), někteří marně hledali VOO u brokera, bojí se, že vyberou špatně. Reklama A míří na zklamání z brokera, B na nejistotu začátečníka.

**Na čem stavíme:** americká ETF ti broker v Česku často nenabídne, evropská obdoba ano. Ve veřejném seznamu nástrojů Trading 212 je 1 137 z 1 151 ETF s americkým ISINem označených jako nedostupné pro evropské pobočky a v aplikaci XTB český klient VOO nenajde (ověřeno 12. 10. 2026, [snímky](docs/screenshots/xtb-voo-us.png)). Podrobnosti a výhrady (výklad ČNB) jsou v [data/README.md](data/README.md).

## Lead magnet a moment žádosti o kontakt

**Co návštěvník dostane zdarma a bez e-mailu:** lístky se 7 známými ETF z NYSE na první obrazovce. Klepnutím se lístek otočí a ukáže evropské dvojče, u kterých brokerů je ve veřejné nabídce a kolik stojí ročně z 10 000 Kč. Pod lístky jsou podrobnosti (index, poplatek proti originálu, dividendy) a přehled všech párů.

**Co dostane za e-mail:** PDF „Tahák: 7 ETF z NYSE a jejich evropská dvojčata z nabídky brokerů v Česku“ (8 stran A5). Slibuje jen to, co stránka nedává: ISINy všech dvojčat (zkopíruje je do aplikace brokera), poplatky originálů a dvojčat vedle sebe a postup nákupu u XTB a Trading 212 krok za krokem se zdrojem u každého kroku. Tahák se otevře hned po odeslání, nikdo nečeká na e-mail.

**Kdy žádáme o kontakt:**

1. **Hned po prvním otočení lístku**, kdy je zájem nejvyšší: výzva „Chci tahák s postupem nákupu“ se objeví hned pod řadou otočeného lístku a formulář se rozbalí na místě. Na první obrazovce už předtím stojí „Tahák zdarma v PDF: ISINy a postup nákupu krok za krokem“, aby stránka navázala na nabídku z reklamy.
2. **Spodní lištou**, která se ukáže, když lístky zmizí z obrazovky. Otevře formulář jako panel tam, kde návštěvník je.
3. **Formulářem v sekci Tahák** pro ty, kdo dočtou až dolů.

Formulář má jen e-mail a souhlas a tlačítko hned pod polem, aby ho na iPhonu nezakryla klávesnice. Po odeslání: „Otevřít tahák“, jedna věta s prvním krokem a „Poslat odkaz kamarádovi“. Výběr textu výzvy a proč je PDF na veřejné adrese: [docs/lead-magnet.md](docs/lead-magnet.md); proč jen e-mail: [docs/obchodni-pohled.md](docs/obchodni-pohled.md).

## Pořadí sekcí a zdůvodnění

| # | Sekce | Proč právě tady |
|---|---|---|
| 1 | Úvod navazující na reklamu (mění se podle `?v=`), řádek o taháku a rovnou lístky s ETF | Návštěvník z reklamy dává stránce pár sekund: první obrazovka musí zopakovat slib reklamy a nabídnout akci bez scrollování. |
| 2 | Výsledek po otočení a výzva k taháku pod řadou otočeného lístku | Hodnota zdarma hned, výzva ve chvíli největšího zájmu, formulář na místě. |
| 3 | Přehled všech 7 párů v kartách | Pro ty, kdo chtějí vidět celek, než se rozhodnou. |
| 4 | Proč ti broker americká ETF často nenabídne (2–3 věty) | Až tady: kdo přišel z reklamy A, důvod zná a nechce ho číst před výsledkem. |
| 5 | Důvěra: zdroje s datem a „Není to investiční doporučení“ | Těsně před formulářem odpoví na „můžu tomu věřit?“. Krátká verze je i hned pod lístky. |
| 6 | Formulář (e-mail a souhlas) | Pro ty, kdo dočetli. Výzvy výš sem nevedou, otevírají formulář na místě: skok přes tři sekce stojí konverze (návrh AI). |
| 7 | Krátké FAQ | Odstraní poslední obavy u formuláře, hlavně strach ze spamu. |

## Dvě verze reklamy

Meta (Facebook a Instagram), mobil, statický obrázek 4 : 5 a 9 : 16, generovaný z HTML ve stylu stránky ([scripts/reklamy.mjs](scripts/reklamy.mjs)). Texty a podrobnosti v [reklamy/](reklamy/README.md).

| | Feed 1080 × 1350 | Stories a Reels 1080 × 1920 |
|---|---|---|
| **A „Dvojče“** | <img src="reklamy/a-dvojce-feed.png" width="240" alt="Reklama A do feedu: Broker ti nenabídl VOO? Není to chyba. VOO přeškrtnuté, šipka, VUAA v kroužku, nabídka taháku zdarma"> | <img src="reklamy/a-dvojce-stories.png" width="190" alt="Reklama A do Stories"> |
| **B „Začátek“** | <img src="reklamy/b-zacatek-feed.png" width="240" alt="Reklama B do feedu: Začínáš s ETF? 7 známých fondů z USA a jejich evropské verze, nabídka taháku zdarma"> | <img src="reklamy/b-zacatek-stories.png" width="190" alt="Reklama B do Stories"> |

- **A „Dvojče“** (`?v=dvojce`): pro ty, kdo o ETF slyšeli a VOO možná zkoušeli koupit. Čekám, že hned otočí VOO a odešlou formulář častěji než u B. Premisa je ověřená v aplikaci XTB ([snímek](docs/screenshots/xtb-voo-us.png)).
- **B „Začátek“** (`?v=zacatek`): pro začátečníky. Ukazuje všech 7 fondů s evropskými verzemi stejně jako stránka. Čekám víc otočených lístků, ale nižší konverzi.
- Očekávání jsou moje hypotézy, rozhodne trychtýř podle verze úvodu. Úvod stránky se mění podle `?v=`, zbytek je stejný, takže rozdíl jde připsat reklamě.

## Očekávaná konverze

**Odhad 2–13 %, nejspíš kolem 6 %** (návštěva = načtená stránka → odeslaný formulář, stejně jako v trychtýři). **Všechna procenta jsou můj odhad**, ne naměřená data; po prvním týdnu kampaně je nahradí `select * from analytika.trychtyr_od('datum spuštění');`.

| Krok trychtýře | Pesimisticky | Středně | Optimisticky | Z čeho odhad vychází |
|---|---|---|---|---|
| 1. příchod | 100 % | 100 % | 100 % | výchozí bod, každá načtená stránka |
| 2. otočení lístku (z příchodů) | 25 % | 40 % | 55 % | Lístky jsou na první obrazovce a jsou přesně to, co reklama slibuje. Z reklamy na sociálních sítích ale velká část lidí odejde po pár sekundách bez jediného klepnutí. |
| 3. otevření formuláře (z těch, kdo otočili) | 20 % | 30 % | 40 % | Výzva se objeví hned pod otočeným lístkem. Kdo ale viděl dvojče, už dostal, kvůli čemu přišel, a tahák ho musí zaujmout navíc. |
| 4. odeslání (z otevřených formulářů) | 40 % | 50 % | 60 % | Jedno pole a zaškrtnutí, tahák hned bez čekání na e-mail. Část lidí odradí, že dávají e-mail a souhlas s e-maily. |
| **Návštěva → odeslání** | **2,0 %** | **6,0 %** | **13,2 %** | součin kroků 2–4 |

**Výpočet po krocích na 1 000 návštěv:**
- středně: 1 000 × 40 % = 400 otočí lístek → 400 × 30 % = 120 otevře formulář → 120 × 50 % = 60 odešle, tedy **6,0 %**,
- pesimisticky: 1 000 × 25 % = 250 → 250 × 20 % = 50 → 50 × 40 % = 20, tedy **2,0 %**,
- optimisticky: 1 000 × 55 % = 550 → 550 × 40 % = 220 → 220 × 60 % = 132, tedy **13,2 %**.

Zjednodušení: formulář jde otevřít i bez otočení lístku (spodní lišta, sekce Tahák), v odhadu je to součást kroku 3.

**Hrubá kontrola proti zdroji (ne odhad):** [Unbounce](https://unbounce.com/landing-pages/whats-a-good-conversion-rate/) (Conversion Benchmark Report 2024, 41 000 landing pages) uvádí medián 6,6 % napříč obory, 8,3 % ve finančních službách a 3,9 % v investování; [starší stránka Unbounce](https://unbounce.com/industry/finance/) 3,8 % pro finance a pojištění. Zdroje se rozcházejí, zahrnují všechny druhy konverzí a český trh v nich není. Střední odhad 6 % leží mezi investováním a finančními službami.

**Co konverzi nejvíc ovlivní:** jestli úvod navazuje na slib reklamy, jestli lidé poznají, že se na lístek dá klepnout (krok 2), a jestli je tahák lákavý i pro toho, kdo dvojče už viděl (krok 3, na něj míří první hypotéza). Cena za kontakt (~196 Kč při 10 Kč za klik) a k čemu je kontakt: [docs/obchodni-pohled.md](docs/obchodni-pohled.md).

## Hypotézy na A/B test

Seřazené podle očekávaného dopadu na konverzi návštěva → odeslání. Očekávaná zlepšení jsou můj odhad.

| # | Hypotéza | Co měníme | Metrika | Minimum návštěv | Proč na tomhle místě |
|---|---|---|---|---|---|
| 1 | Když po prvním otočení uvidí návštěvník rovnou pole na e-mail, odpadne jedno klepnutí ve chvíli největšího zájmu a víc lidí formulář odešle. | Pod lístky rovnou formulář (pole, „Získat tahák“, souhlas) místo tlačítka, které ho teprve rozbalí. | návštěva → odeslání; kontrolní: otočení lístků | 4 388 na verzi, **asi 8 800** (z 6 na 7,5 %, +25 %) | Míří na krok s největším odhadovaným úbytkem v procentech (formulář neotevře 70 % z těch, kdo otočí lístek) a mění jeden prvek. |
| 2 | Když se dvojčata SDY, VGT a AGG ukážou až po e-mailu, část lidí, kteří chtějí celý přehled, e-mail zadá. | Tři poslední lístky se zámkem, klepnutí otevře formulář; VOO a ostatní zůstanou volně. Jen pro návštěvy z reklamy A. | návštěva → odeslání; kontrolní: odchody po klepnutí na zámek | 6 717 na verzi, **asi 13 400** (z 6 na 7,2 %, +20 %) | Může mít velký dopad, ale jde proti zásadě „hodnota před formulářem“ a slibu reklamy B (všech 7 fondů), proto až po první a jen pro reklamu A. |
| 3 | Část lidí nepozná, že se na lístek dá klepnout. Když se VOO otočí sám, hodnota je vidět bez akce a víc lidí dojde k výzvě. | Lístek VOO se chvíli po načtení sám otočí. | návštěva → odeslání; vedlejší: otočení | 11 690 na verzi, **asi 23 400** (z 6 na 6,9 %, +15 %) | Míří na krok 2, kde v absolutních číslech odejde nejvíc lidí, ale na odeslání působí jen nepřímo. |

**Výpočet minima:** n na verzi = (z₁₋α/₂ + z₁₋β)² × [p₁(1 − p₁) + p₂(1 − p₂)] ÷ (p₂ − p₁)², α = 0,05 oboustranně, síla 80 %, (1,96 + 0,84)² ≈ 7,85. Příklad pro první: 7,85 × (0,06 × 0,94 + 0,075 × 0,925) ÷ 0,015² ≈ 4 388. Při skutečné výchozí konverzi 2 % vychází zhruba třikrát víc, výpočet je potřeba zopakovat s naměřenou konverzí. Při 500 návštěvách denně (předpoklad) by testy trvaly asi 18, 27 a 47 dní. Dřívější hypotéza „výzva slibuje postup nákupu místo všech 7 dvojčat“ už není test, ale oprava: stránka dvojčata ukáže zdarma. Podrobnosti: [docs/ab-hypotezy.md](docs/ab-hypotezy.md).

## Jak jsem pracoval s AI

**Jak jsem agenta řídil:**

- **Plánovací chat na claude.ai:** v něm jsem si připravoval a ladil zadání pro Claude Code. Do Claude Code šlo až hotové, očíslované zadání: co udělat, v jakém pořadí, jak to ověřit, co se nesmí stát, „commit po každém bodu“ a co napsat v reportu.
- **Claude Code** dělal výzkum dat z primárních zdrojů, stránku, PDF, funkce, SQL, testy a dokumentaci. Pravidla pro každou session i pro subagenty jsou v [CLAUDE.md](CLAUDE.md):
  - žádná vymyšlená data, u každého údaje zdroj, nebo TODO,
  - klíče jen v proměnných prostředí,
  - nic absolutního v textech, tykání bez rodu, česká typografie,
  - malé commity, push jen na pokyn, nepřepisovat historii.
- **U chyb vždy nejdřív příčina:** agent napsal, proč chyba vzniká, teprve pak opravoval a novou kontrolu ověřil na staré verzi, že selže (například otočení lístku změřené ve WebKitu po 100 ms).
- **Subagenti:** skilly `security-review` (hledání zranitelností, každý nález ověřený zvlášť, falešné poplachy vyřazené) a `code-review`. Co dostaly za zadání a jak se kontroloval jejich výstup, je v [ai-log/denik.md](ai-log/denik.md).

**Jak jsem výstupy kontroloval:**

- **Automatické testy**, které při chybě skončí nenulovým kódem: funkce s podvrženou databází a DNS (132 kontrol), SQL na skutečném Postgresu (80), stránka v Chromu (134), WebKit s emulovanými iPhony a simulovanou klávesnicí (81), data proti zdrojům, čísla na stránce a v PDF proti datům, Lighthouse a kontrola živé stránky jen čtením ([docs/testovani.md](docs/testovani.md)).
- **Na skutečném iPhonu**, třikrát (Safari a Chrome na iOS). Tam se našly chyby, které žádná simulace neukázala.
- **Proti zadání** a **čtením**: texty, README a diff před každým commitem (klíče, skutečné e-maily).
- **Nezávislá kontrola:** hotové řešení zkontrolovaly Gemini, ChatGPT a nový chat Claude jen se zadáním a odkazy. Gemini si kontrolu z velké části vymyslel (soubory `app.js` a `analytics.js`, které neexistují, páry QQQ a SOXX), jeho report jsem zahodil. ChatGPT a Claude se dvakrát shodly na výtkách, které jsou opravené.

**Kde AI chybovala a jak se to odhalilo (nejdůležitější):**

| Chyba AI | Jak se na ni přišlo | Oprava |
|---|---|---|
| Absolutní tvrzení „Americké ti broker nenabídne, evropské ano.“ v návrhu podnadpisu. | Člověk při čtení plánu. | „Americká ti broker často nenabídne, evropská ano.“ |
| „Pojistka“ u otočení lístku přepínala strany podle času, ne podle úhlu, takže na iPhonu lístek jen blikl. Test kontroloval jen konečný stav. | Člověk na iPhonu (s videem), příčinu AI změřila ve WebKitu. | Strany se mění na konci první půlky animace, test kontroluje každý snímek. |
| Kontrola skrytého pole v prohlížeči tiše zahazovala skutečné kontakty, když pole vyplnilo automatické vyplňování. | Skill `code-review`. | Rozhoduje jen server. |
| README tvrdilo, že kontakt nejde spárovat s návštěvou. Nebyla to pravda (pořadová čísla, pořadí zápisu). | Review při bezpečnostní kontrole. | Náhodná UUID, odeslání bez ID návštěvy, čas na minuty, pravdivý popis zbytkového rizika. |
| Panel odskočil pod klávesnici, po opravě tlačítko zakryla lišta s návrhy e-mailů. Simulace to neukázala. | Dva testy na skutečném iPhonu. | Panel podle `visualViewport`, tlačítko pod polem, rezerva 50 px, WebKit test lištu kreslí. |
| Clientelo jako správce na živém demu, slib „všech 7 dvojčat“, která stránka dá zdarma, reklama B se schovanými dvojčaty a „koupíš u …“ bez ověření v účtu. Všechno prošlo testy, protože hlídaly shodu s daty, ne smysl. | Nezávislá kontrola (ChatGPT a Claude). | Správce je autor, slib „ISINy a postup nákupu“, B ukazuje dvojčata, „v nabídce“. |
| AI tvrdila opravu „všude“, ale PDF vynechala („Koupíš u“ 7×, u SXR4 popis originálu). | Druhá nezávislá kontrola četla text PDF. | „V nabídce u“, popis dvojčete, kontrola textu PDF. |
| Výzva po otočení byla pod všemi 7 lístky, na 390 × 844 mimo obrazovku. Test hlídal, že existuje, ne že je vidět. | Druhá nezávislá kontrola. | Výzva pod řadou otočeného lístku, test viditelnosti v Chromu i WebKitu. |

Celá tabulka (limit z jedné IP, kontrola MX, Gemini a další) a průběh testů na iPhonu jsou v [docs/prace-s-ai.md](docs/prace-s-ai.md), každé kolo v [ai-log/denik.md](ai-log/denik.md).

## Nejasnosti v zadání a moje rozhodnutí

- **NYSE = NYSE i NYSE Arca**, fondy hlavně z Nasdaqu (QQQ) vynechávám.
- **Ke každému americkému ETF evropská UCITS obdoba**, protože americká ETF brokeři v EU drobným investorům často neprodají (chybí KID podle PRIIPs, [data/README.md](data/README.md)).
- **Kontakt = jen e-mail, konverze = návštěva → odeslaný formulář**, měřené vlastním měřením bez cookie lišty.
- **Správce osobních údajů:** zadání ho neuvádí a Clientelo o ukázce neví, proto je na demu správcem autor (d.kuchvalek@gmail.com), účel jen ukázka, žádné e-maily, výmaz do 31. 12. 2026. Návrh souhlasu a zásad pro Clientelo: [docs/navrh-pro-clientelo.md](docs/navrh-pro-clientelo.md).
- **Tykání** bez rodu: cílovka jsou spíš mladší lidé ze sociálních sítí.

## Zdroje dat

Údaje o fondech jsou z webů správců (Vanguard, iShares, State Street), dostupnost z veřejných seznamů produktů XTB, Trading 212 a Degiro (v aplikaci ověřený jen VOO u XTB). Každý údaj má v [data/etf.json](data/etf.json) zdroj a datum (ověřeno 10. 10. 2026), skripty kontrolují data, stránku i PDF proti nim. Aktualizovat před kampaní a pak měsíčně.

## Měření a známá rizika

Vlastní pseudonymní události bez cookies na `/api/event`, trychtýř v SQL podle verze úvodu a od data spuštění. Události od odeslání formuláře dál nemají ID návštěvy, aby kontakt nešel spárovat s návštěvou; při malém provozu to úplně vyloučit nejde. Detail události je u většiny událostí z pevného seznamu hodnot, u příchodu je to text z UTM parametrů omezený regulárním výrazem (malá písmena, číslice, `_.-`, nejvýš 3 × 24 znaků). Podrobnosti: [docs/mereni.md](docs/mereni.md).

**Známé riziko: `/api/event` nemá token.** Kdokoli může poslat falešné příchody (s limitem 600 za hodinu z jedné IP a 100 na návštěvu). Poznaly by se podle návštěv, které mají jen `prichod` bez scrollu a otočení, podle neznámých UTM hodnot a podle náhlého skoku proti klikům v Ads Manageru; vyčistit jdou SQL dotazem podle času a detailu ([postup](docs/mereni.md#falešné-příchody)). Kontakty to neovlivní, ty chrání token, MX a limit ([docs/bezpecnost.md](docs/bezpecnost.md)).

## Co v řešení chybí

- E-maily po odeslání (e-mailová služba je na správci) a double opt-in (doporučení v [docs/bezpecnost.md](docs/bezpecnost.md)).
- Přepínač verzí pro A/B test na stránce (hypotézy jsou připravené).
- Formulář bez JavaScriptu (token proti botům); obsah stránky bez JS funguje.
- Dostupnost u brokerů jen z veřejných seznamů, u Degira 3 ze 7 dvojčat, u Fia žádné.
- Test na skutečném Androidu (zařízení nemám); Chrome emulace pokrývá lístky, formulář, panel, sdílení a měření.
- Jistota, že denní keep-alive stačí proti uspání Supabase (kontrola 15. 10. 2026).

## Podrobnosti v docs/

- [Lead magnet](docs/lead-magnet.md) · [Obchodní pohled a cena za kontakt](docs/obchodni-pohled.md) · [A/B hypotézy s výpočtem](docs/ab-hypotezy.md) · [Měření](docs/mereni.md)
- [Technická rozhodnutí](docs/technicka-rozhodnuti.md) · [Bezpečnost a ochrana proti spamu](docs/bezpecnost.md) · [Testování](docs/testovani.md) · [Nasazení a checklist](docs/nasazeni.md)
- [Před spuštěním kampaně](docs/pred-spustenim.md) · [Meta Conversions API](docs/meta-conversions-api.md) · [Návrh souhlasu a zásad pro Clientelo](docs/navrh-pro-clientelo.md) · [Práce s AI, celá tabulka chyb](docs/prace-s-ai.md)
