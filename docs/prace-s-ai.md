# Jak jsem pracoval s AI

Část [README](../README.md), přesunutá sem, aby se hlavní README dalo přečíst za 5 minut.

**Nástroje a role:**

- **Plánovací chat (claude.ai):** v samostatném chatu jsem si připravoval a ladil zadání pro Claude Code: co chci, v jakém pořadí, co ověřit a co se nesmí stát. Do Claude Code šlo až hotové zadání. Exporty v [ai-log/](../ai-log/) jsou z Claude Code.
- **Claude Code** (ve VS Code) dělal výzkum dat z primárních zdrojů, stránku, PDF, funkce, SQL, testy a dokumentaci. Pravidla pro každou session i pro subagenty jsou v [CLAUDE.md](../CLAUDE.md): žádná vymyšlená data (zdroj, nebo TODO), klíče jen v proměnných prostředí, nic absolutního v textech, tykání bez rodu, česká typografie, malé commity a push jen na pokyn.
- **Agenti:** většina práce běžela v jedné konverzaci. Subagenty spouštěly skilly `security-review` (hledání zranitelností a ověření každého nálezu zvlášť) a `code-review`. Co dostaly za zadání, jak se kontroloval jejich výstup a kde se spletly, je v [ai-log/denik.md](../ai-log/denik.md).
- **Postup u chyb:** AI nejdřív napsala příčinu a teprve potom opravovala. U nové kontroly ověřila, že na staré verzi selže.

**Jak jsem výstupy kontroloval:**

- **Testy**, které vrací chybu, když něco neprojde: funkce s podvrženou databází a DNS, SQL na skutečném Postgresu, stránka v Chromu, WebKit s emulovanými iPhony a simulovanou klávesnicí, data proti zdrojům, čísla na stránce a v PDF proti datům, Lighthouse ([přehled a počty](testovani.md#testování-co-automaticky-a-co-jen-na-telefonu)).
- **Na skutečném iPhonu**, třikrát (Safari a Chrome na iOS). Tam se našly chyby, které žádná simulace neukázala.
- **Proti zadání:** cílová skupina, hodnota viditelná před formulářem, dvě reklamy, měření celé cesty, skutečná data se zdrojem, pořadí sekcí, konverze, hypotézy, nasazení.
- **Čtením:** texty, README a diff před každým commitem (klíče, skutečné e-maily).

**Kde AI chybovala a jak se to odhalilo:**

| Chyba AI | Jak se na ni přišlo | Oprava |
|---|---|---|
| V návrhu podnadpisu absolutní tvrzení „Americké ti broker nenabídne, evropské ano.“, proti pravidlu nic netvrdit absolutně. | Člověk při čtení plánu. | „Americká ti broker často nenabídne, evropská ano.“ |
| „Pojistka“ u otočení lístku přepínala líc a rub podle času, ne podle úhlu. Lístek byl z boku dřív, než se strany vyměnily, takže na iPhonu jen blikl. Test kontroloval jen konečný stav. | Člověk na iPhonu (Chrome na iOS, s videem). Příčinu AI změřila ve WebKitu po 100 ms. | Strany se mění na konci první půlky animace. Test kontroluje každý snímek průběhu. |
| Kontrola skrytého pole proti botům v prohlížeči tiše zahazovala skutečné kontakty, když pole vyplnilo automatické vyplňování. Návštěvník viděl poděkování, ale kontakt se neuložil. | Skill `code-review` při bezpečnostní kontrole. | Rozhoduje jen server a pole má název, který automatické vyplňování nezná. |
| V README tvrdila, že kontakt nejde spárovat s návštěvou. Nebyla to pravda: řádky měly pořadová čísla a databáze zná pořadí zápisu. | Review při bezpečnostní kontrole. | Náhodná UUID, odeslání a všechno po něm bez ID návštěvy, čas na minuty a pravdivý popis toho, co zůstává. |
| Panel s formulářem po klepnutí do pole odskočil pod klávesnici. Po opravě tlačítko zakryla lišta s návrhy e-mailů nad klávesnicí. Headless Chrome ani simulace ve WebKitu klávesnici a lištu neukázaly. | Dva testy na skutečném iPhonu (člověk). | Panel podle `visualViewport`, tlačítko hned pod polem a rezerva 50 px na lištu. Test ve WebKitu lištu teď kreslí. |
| Limit 10 kontaktů za hodinu z jedné IP brala jako bezpečný pro skutečné lidi. | Člověk upozornil na sdílené IP mobilních operátorů (CGNAT). | 30 za hodinu, odmítnutí se zapisují do logu. |
| Kontrola MX odmítala doménu bez MX záznamu, i když pošta jde i na adresu domény (RFC 5321). | AI při ověřování, o které člověk požádal (fail-open při chybě DNS). | Bez MX se ověří adresa domény, timeout 1 s. |
| Claude Code navrhl a celý projekt držel: Clientelo jako správce na živém demu (Clientelo o něm neví), tahák se slibem „všech 7 dvojčat“, která stránka ukáže zdarma, reklamu B se schovanými dvojčaty a „koupíš u …“, i když ověřený je jen veřejný seznam produktů brokera. | Dvě nezávislé kontroly (ChatGPT a nový chat Claude bez kontextu) se na tom shodly. | Správce je autor, slib taháku je postup nákupu a ISINy, B ukazuje dvojčata, „v nabídce“ místo „koupíš“. |
| V minulém kole AI v README tvrdila, že formulace o brokerech je opravená „všude“, ale PDF vynechala: popisek u každého dvojčete zůstal „Koupíš u“ (7× v PDF) a u SXR4 popis originálu VTI („celý americký akciový trh“). | Druhá nezávislá kontrola (Claude a ChatGPT) prošla text PDF. | „V nabídce u“, u dvojčat s jiným indexem index dvojčete, kontrola textu PDF na „koup“. |
| Gemini při nezávislé kontrole hotového řešení hodnotil soubory, které v repozitáři nejsou (`app.js`, `analytics.js`), ETF páry, které nemáme (QQQ, SOXX), a tvrdil, že chybí GDPR text a ochrana proti spamu. | Člověk porovnal report s repozitářem a stránkou. | Report zahozený; platné výtky ze dvou dalších kontrol opravené (viz níž). |

Další drobnější chyby (odhadnutá adresa produktové stránky Vanguardu, nápověda XTB pro klienty mimo EU, test, který klepal během plynulého posunu stránky) jsou v [deníku](../ai-log/denik.md).

**Nezávislá kontrola.** Hotové řešení jsem dal zkontrolovat třem jiným AI: Gemini, ChatGPT a novému chatu Claude bez kontextu projektu. Každá dostala jen zadání a odkazy na stránku a repozitář. Gemini si kontrolu z velké části vymyslel: hodnotil soubory, které v repozitáři nejsou (`app.js`, `analytics.js`), ETF páry, které nemáme (QQQ, SOXX), a tvrdil, že chybí GDPR text a ochrana proti spamu. Jeho report jsem zahodil. Zbylé dvě kontroly se shodly na výtkách, které jsme v posledním kole opravili: správce údajů (živé demo uvádělo Clientelo, které o něm neví), slib taháku („všech 7 dvojčat“, která stránka dá zdarma), navázání reklamy B na stránku, formulace o brokerech („koupíš u“ místo „v nabídce“) a délka README.

**Testy na skutečném iPhonu dělal člověk, ne AI:**

1. **10. 10. 2026, Safari:** design působil jako typický web od AI, poděkování bylo rozbité a stránka slibovala PDF, které neexistovalo. Design se předělal na „sešit“ s lístky.
2. **10. 10. 2026, Safari:** panel s formulářem odskakoval pod klávesnici, Safari PDF místo stažení otevřelo (poděkování teď nabízí „Otevřít tahák“), poděkování bylo prázdné.
3. **11. 10. 2026, Chrome na iOS, s videem:** lístek se neotáčel, jen blikl, a tlačítko zakrývala lišta s návrhy e-mailů. Průběh otočení po opravě (WebKit, snímky po 100 ms):

   <img src="screenshots/webkit-otoceni-listku.png" width="640" alt="Průběh otočení lístku VTI po 100 ms: líc se zužuje, ve 224 ms je lístek z boku, pak se rozšiřuje rub s dvojčetem SXR4">

Snímky před úpravami a po nich a snímky s klávesnicí ve WebKitu jsou v sekci [Testování](testovani.md#testování-co-automaticky-a-co-jen-na-telefonu).
