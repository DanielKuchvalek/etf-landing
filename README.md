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

- **Hodnota před formulářem, zdarma:** lístky se 7 ETF na první obrazovce, klepnutím se otočí na evropské dvojče, brokery v nabídce a poplatek v korunách.
- **Tahák (PDF, 8 stran A5):** jen to, co stránka nedává: ISINy všech dvojčat a postup nákupu u XTB a Trading 212 krok za krokem se zdrojem u každého kroku. Na první obrazovce je řádek „Tahák zdarma v PDF: ISINy a postup nákupu krok za krokem“, aby navázal na nabídku z reklam.
- **Kdy žádáme:** hned po prvním otočení lístku (výzva pod řadou otočeného lístku, formulář se rozbalí na místě), spodní lištou, když lístky zmizí z obrazovky, a v sekci Tahák. Nikdy odkazem dolů.
- **Formulář:** jen e-mail a souhlas, tlačítko hned pod polem kvůli klávesnici na iPhonu. Po odeslání „Otevřít tahák“ a sdílení.

Výběr textu výzvy a proč je PDF na veřejné adrese: [docs/lead-magnet.md](docs/lead-magnet.md); proč jen e-mail: [docs/obchodni-pohled.md](docs/obchodni-pohled.md).

## Pořadí sekcí a zdůvodnění

1. **Úvod navazující na reklamu a rovnou lístky.** Pár sekund pozornosti: zopakovat slib reklamy a nabídnout akci bez scrollování.
2. **Výsledek a výzva k taháku** hned pod otočeným lístkem, kdy je zájem nejvyšší.
3. **Přehled všech 7 párů v kartách** pro ty, kdo chtějí celek.
4. **Proč ti broker americká ETF často nenabídne** (2–3 věty). Až tady: kdo přišel z reklamy A, důvod zná a nechce ho číst před výsledkem.
5. **Důvěra: zdroje s datem a „Není to investiční doporučení“** těsně před formulářem (krátká verze je i hned pod lístky).
6. **Formulář** pro ty, kdo dočetli. Výzvy výš sem nevedou, otevírají formulář na místě (návrh AI: méně kroků, žádné skákání stránkou).
7. **Krátké FAQ** proti poslední obavě, hlavně ze spamu.

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

**Odhad 2–13 %, nejspíš kolem 6 %** (návštěva → odeslaný formulář). Procenta jsou **můj odhad**, po prvním týdnu kampaně je nahradí `analytika.trychtyr_od(datum spuštění)`.

| Krok trychtýře | Pesimisticky | Středně | Optimisticky | Z čeho odhad vychází |
|---|---|---|---|---|
| 1. příchod | 100 % | 100 % | 100 % | výchozí bod, každá načtená stránka |
| 2. otočení lístku (z příchodů) | 25 % | 40 % | 55 % | Lístky jsou na první obrazovce a jsou přesně to, co reklama slibuje. Z reklamy na sociálních sítích ale velká část lidí odejde po pár sekundách bez jediného klepnutí. |
| 3. otevření formuláře (z těch, kdo otočili) | 20 % | 30 % | 40 % | Výzva se objeví hned pod otočeným lístkem. Kdo ale viděl dvojče, už dostal, kvůli čemu přišel, a tahák ho musí zaujmout navíc. |
| 4. odeslání (z otevřených formulářů) | 40 % | 50 % | 60 % | Jedno pole a zaškrtnutí, tahák hned bez čekání na e-mail. Část lidí odradí, že dávají e-mail a souhlas s e-maily. |
| **Návštěva → odeslání** | **2,0 %** | **6,0 %** | **13,2 %** | součin kroků 2–4 |

Středně na 1 000 návštěv: 1 000 × 40 % = 400 otočí lístek → × 30 % = 120 otevře formulář → × 50 % = 60 odešle (6 %).

**Hrubá kontrola proti zdroji:** [Unbounce](https://unbounce.com/landing-pages/whats-a-good-conversion-rate/) (2024, 41 000 landing pages) uvádí medián 6,6 % napříč obory, 8,3 % ve finančních službách a 3,9 % v investování; [starší stránka Unbounce](https://unbounce.com/industry/finance/) 3,8 % pro finance. Zdroje se rozcházejí a český trh v nich není.

Cena za kontakt (orientačně ~196 Kč při 10 Kč za klik), k čemu je kontakt a proč jen e-mail: [docs/obchodni-pohled.md](docs/obchodni-pohled.md).

## Hypotézy na A/B test

Seřazené podle očekávaného dopadu; minimum pro rozdíl při výchozí konverzi 6 %, α 0,05 a síle 80 % (výpočet a zdůvodnění v [docs/ab-hypotezy.md](docs/ab-hypotezy.md)).

| # | Hypotéza a změna | Metrika | Minimum návštěv | Proč na tomhle místě |
|---|---|---|---|---|
| 1 | Formulář rovnou pod otočeným lístkem místo tlačítka, které ho rozbalí: odpadne jedno klepnutí ve chvíli zájmu. | návštěva → odeslání | ~8 800 (+25 %) | největší odhadovaný úbytek v procentech (otočení → formulář), mění jeden prvek |
| 2 | Poslední tři lístky (SDY, VGT, AGG) zamčené za e-mail. | návštěva → odeslání, odchody po zámku | ~13 400 (+20 %) | možný velký dopad, ale riziko pro důvěru a slib reklamy B, proto jen pro reklamu A a po první |
| 3 | Lístek VOO se po načtení otočí sám. | návštěva → odeslání, otočení | ~23 400 (+15 %) | míří na krok 2, na odeslání působí jen nepřímo |

Dřívější hypotéza „výzva slibuje postup nákupu místo všech 7 dvojčat“ už není test, ale oprava: stránka dvojčata ukáže zdarma.

## Jak jsem pracoval s AI

- **Plánovací chat na claude.ai** na přípravu zadání, **Claude Code** na výzkum dat, stránku, PDF, funkce, SQL, testy a dokumentaci. Pravidla pro každou session jsou v [CLAUDE.md](CLAUDE.md), exporty konverzací v [ai-log/](ai-log/README.md), deník kontrol v [ai-log/denik.md](ai-log/denik.md).
- **Kontrola výstupů:** automatické testy (funkce, SQL na Postgresu, Chrome, WebKit se simulovanou klávesnicí, data proti zdrojům), tři testy na skutečném iPhonu a čtení diffu před každým commitem.
- **Nezávislá kontrola:** hotové řešení zkontrolovaly Gemini, ChatGPT a nový chat Claude jen se zadáním a odkazy. Gemini si kontrolu z velké části vymyslel (neexistující soubory, páry QQQ a SOXX), jeho report jsem zahodil. Další dvě se shodly na výtkách, které jsou opravené.
- **Kde AI chybovala (výběr):** absolutní tvrzení „Americké ti broker nenabídne“; „pojistka“ u lístku podle času místo úhlu (na iPhonu blikal, test hlídal jen konečný stav); kontrola skrytého pole v prohlížeči tiše zahazovala kontakty; nepravdivé tvrzení, že kontakt nejde spárovat s návštěvou; klávesnice a lišta návrhů na iPhonu, které simulace neukázala; Clientelo jako správce, slib „všech 7 dvojčat“ a „koupíš u“; tvrzení, že je oprava „všude“, i když PDF zůstalo. Celá tabulka s tím, jak se na chyby přišlo: [docs/prace-s-ai.md](docs/prace-s-ai.md).

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
