# Lead magnet a moment žádosti o kontakt

Část [README](../README.md), přesunutá sem, aby se hlavní README dalo přečíst za 5 minut.

**Co návštěvník dostane:** PDF „Tahák: 7 ETF z NYSE a jejich evropská dvojčata z nabídky brokerů v Česku“ ([public/tahak.pdf](../public/tahak.pdf), 8 stran A5): ISINy, poplatky, kde koupit a postup nákupu u XTB a Trading 212 krok za krokem, se zdrojem u každého kroku. Generuje se z [tahak/tahak.html](../tahak/tahak.html) a dat, takže po změně dat stačí přegenerovat.

**Hodnota je vidět ještě před formulářem.** Lístky se 7 ETF jsou na první obrazovce. Klepnutím se lístek otočí a ukáže evropské dvojče, u kterých brokerů je v nabídce a kolik stojí ročně z 10 000 Kč. Pod lístky se ukážou podrobnosti (index, poplatek proti originálu, dividendy). Zdarma, bez e-mailu. Pod podnadpisem je hned na první obrazovce i řádek „Tahák zdarma v PDF: ISINy a postup nákupu krok za krokem.“, aby stránka navázala na nabídku z obou reklam ještě před otočením lístku. Dělba je jasná: na stránce návštěvník vidí, **co** koupit, v taháku dostane, **jak** to udělat.

**Kdy žádáme o kontakt:**

1. Hned po prvním otočení lístku: hned pod řadou otočeného lístku (ne až pod posledním) se objeví „Chci tahák s postupem nákupu“, a když je lístek u spodního okraje, stránka se posune jen o tolik, aby byla výzva vidět (snímky z [WebKitu](screenshots/vyzva-webkit-375x667-dole.png) a [Chromu](screenshots/vyzva-chrome-390x844-nahore.png)). Návštěvník právě viděl dvojče a výzva mu nabízí, co mu ještě chybí: jak ho koupit. Formulář se rozbalí na místě.
2. Spodní lištou, která se ukáže, když lístky zmizí z obrazovky a výzva ani formulář nejsou vidět. Formulář se otevře jako panel tam, kde návštěvník právě je.
3. Formulářem v sekci Tahák pro ty, kdo dočtou až dolů.

**Co tahák slibuje.** Jen to, co PDF přidává navíc ke stránce: ISINy všech dvojčat a postup nákupu u XTB a Trading 212 krok za krokem. Dvojčata samotná stránka ukáže zdarma, takže slib „všech 7 dvojčat“, který tu byl dřív, by nabízel něco, co návštěvník už má. Varianty textu tlačítka pod lístky:
1. „Chci tahák s postupem nákupu“ (vybraná: nejkratší, nezalomí se ani na 320 px, navazuje na „Tahák zdarma“ z reklam a sedí s tlačítkem u karet „Chci tahák s ISINy a postupem nákupu“),
2. „Chci postup nákupu krok za krokem“ (konkrétnější, ale bez slova tahák, které reklama slibuje),
3. „Chci tahák: ISINy a postup nákupu“ (úplné, ale ISIN začátečník nezná).

Spodní lišta: „Tahák zdarma: ISINy a postup nákupu“, reklamy: „Tahák zdarma: ISINy a postup nákupu →“.

**Formulář:** jen e-mail a souhlas (proč, je v [obchodním pohledu](obchodni-pohled.md#obchodní-pohled)). Tlačítko je hned pod polem, aby ho na iPhonu nezakryla klávesnice ani lišta s návrhy e-mailů.

**Po odeslání:** poděkování s tlačítkem „Otevřít tahák“, takže nikdo nečeká na e-mail. Pod ním je věta s prvním krokem a „Poslat odkaz kamarádovi“ (nativní sdílení telefonu, jinak zkopírování odkazu). Sdílení měříme a sdílený odkaz má `?ref=sdileni`. PDF se samo nestahuje: Safari na iPhonu ho při testu místo stažení otevřel a návštěvník by odešel dřív, než uvidí sdílení.

**PDF je na veřejné adrese** (`/tahak.pdf`), takže se dá stáhnout i bez e-mailu. V demu je to záměr: jednoduchost (žádné přihlášení, žádná e-mailová služba) a tahák má hodnotu hlavně jako důvod k akci ve chvíli zájmu, ne jako tajemství. Kdo adresu zná, e-mail obejde, ale z reklamy na ni nikdo nepřijde. V ostré verzi by se PDF vydávalo přes jednorázový podepsaný odkaz, který vrátí `/api/lead` po úspěšném uložení kontaktu, nebo e-mailem po potvrzení double opt-inu, a soubor by na veřejné adrese nebyl.

Texty všech částí jsou v [texty.md](../texty.md).
