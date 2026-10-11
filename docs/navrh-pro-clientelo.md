# Návrh souhlasu a zásad pro ostrou verzi pod Clientelem

Živá ukázka teď uvádí jako správce autora (Daniel Kuchválek) a nic nikomu neposílá. Tohle je návrh pro chvíli, kdy stránku převezme Clientelo a pustí na ni reklamu. Text připravil autor stránky, ne právník. Místa v hranatých závorkách doplní Clientelo, celé to musí schválit právník.

## Text souhlasu u formuláře

> Souhlasím, že mi Clientelo Czech s.r.o. bude posílat e-maily o investování do ETF. Odhlásit se můžu kdykoli. [Jak nakládáme s osobními údaji]

Otevřená otázka pro právníka: smí být tahák podmíněný souhlasem s marketingovými e-maily? Souhlas musí být svobodný. Varianta bez podmínky: tahák dostane každý, kdo zadá e-mail, a souhlas s dalšími e-maily je samostatné, nepovinné zaškrtávátko.

Při každé změně textu změnit i jeho verzi (`SOUHLAS` v `api/_lib.js`), ukládá se ke kontaktu do `leads.souhlas_verze`.

## Zásady ochrany osobních údajů

### Kdo údaje zpracovává

Správcem osobních údajů je Clientelo Czech s.r.o., IČO 22193456, se sídlem Platnéřská 90/13, Staré Město, 110 00 Praha 1, zapsaná v obchodním rejstříku vedeném Městským soudem v Praze, oddíl C, vložka 412348 (podle [ARES](https://ares.gov.cz/ekonomicke-subjekty?ico=22193456), ověřeno 11. 10. 2026).

Kontakt pro otázky k osobním údajům: [doplní Clientelo].

### Jaké údaje a proč

- **E-mail a souhlas.** Když vyplníš formulář u taháku, uložíme tvůj e-mail, souhlas, čas, kdy byl udělen, verzi textu souhlasu a verzi stránky, ze které přišel (podle reklamy). Použijeme je k posílání e-mailů o investování do ETF.
- **Měření návštěvnosti.** Stránka zaznamenává události: příchod (i s parametry reklamy v odkazu), jak daleko je stránka posunutá, otočení lístku s ETF, otevření a odeslání formuláře, otevření taháku a sdílení odkazu. Identifikátor návštěvy existuje jen v paměti prohlížeče po dobu jednoho načtení stránky a nic se neukládá do prohlížeče (žádné cookies). Je to pseudonymní údaj. K e-mailu ho neukládáme a s e-mailem ho neposíláme. Odeslání formuláře a všechno po něm zaznamenáváme úplně bez identifikátoru návštěvy. Čas události ukládáme jen s přesností na minutu. Úplně vyloučit přiřazení nejde: kdo má přístup do databáze, mohl by při malé návštěvnosti podle času odhadnout, která návštěva formulář vyplňovala.
- **Technické záznamy hostingu.** Poskytovatel hostingu (Vercel) může v záznamech o přístupu zpracovávat například IP adresu. Jak dlouho je uchovává na zvoleném tarifu: [doplní Clientelo].

### Na jakém základě

E-mail zpracováváme na základě tvého souhlasu (čl. 6 odst. 1 písm. a) GDPR). Souhlas můžeš kdykoli odvolat (čl. 7 odst. 3 GDPR), například odkazem v e-mailu nebo napsáním na kontakt výše.

Právní základ měření návštěvnosti: [doplní Clientelo po konzultaci s právníkem]. I odesílání dat z prohlížeče bez cookies může podle pokynů Evropského sboru pro ochranu osobních údajů 2/2023 vyžadovat souhlas.

### Jak dlouho

E-mail uchováme, dokud souhlas neodvoláš. Nejdelší doba uložení: [doplní Clientelo].

### Kdo k údajům má přístup

- **Supabase:** databáze, data v regionu EU (Frankfurt, eu-central-1).
- **Vercel:** hosting stránky a funkce, které formulář a měření zpracovávají, funkce ve Frankfurtu.
- **E-mailová služba** pro rozesílání: [doplní Clientelo].
- Pokud se nasadí Meta Conversions API (viz README, Před spuštěním kampaně): Meta Platforms.

Předávání údajů mimo EU a jeho základ: [doplní Clientelo po konzultaci s právníkem].

### Tvoje práva

Přístup (čl. 15 GDPR), oprava (čl. 16), výmaz (čl. 17), omezení zpracování (čl. 18), přenositelnost (čl. 20), námitka (čl. 21) a stížnost u Úřadu pro ochranu osobních údajů ([uoou.gov.cz](https://uoou.gov.cz/), čl. 77).

### Cookies

Stránka nepoužívá cookies ani neukládá nic do tvého prohlížeče.
