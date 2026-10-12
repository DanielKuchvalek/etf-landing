# Hypotézy na A/B test

Část [README](../README.md), přesunutá sem, aby se hlavní README dalo přečíst za 5 minut.

Seřazené podle očekávaného dopadu na konverzi návštěva → odeslání. Hlavní metrika je u všech stejná a měří ji vlastní trychtýř. Očekávaná zlepšení jsou můj odhad, ze kterého počítám potřebný počet návštěv.

**1. Formulář rovnou pod otočeným lístkem**
- **Hypotéza:** když po prvním otočení uvidí návštěvník rovnou pole na e-mail, odpadne jedno klepnutí ve chvíli největšího zájmu a víc lidí formulář odešle.
- **Co měníme:** pod lístky se místo tlačítka „Chci tahák s postupem nákupu“, které formulář teprve rozbalí, ukáže rovnou formulář (pole, „Získat tahák“, souhlas). Zbytek stránky zůstane stejný.
- **Metrika:** návštěva → odeslání. Kontrolní: návštěva → otočení lístku (formulář pod lístky nesmí odradit od dalšího otáčení).
- **Minimum:** z 6 % na 7,5 % (+25 %) → 4 388 návštěv na verzi, **asi 8 800 celkem**.
- **Proč první:** míří na krok s největším odhadovaným úbytkem v procentech (z těch, kdo otočí lístek, formulář neotevře 70 %) a mění jen jeden prvek. Čekám od ní největší dopad.

**2. Poslední tři lístky zamčené za e-mail**
- **Hypotéza:** když se dvojčata SDY, VGT a AGG ukážou až po zadání e-mailu, část lidí, kteří chtějí vidět celý přehled, e-mail zadá. Teď dostanou všech 7 dvojčat zdarma a důvod k e-mailu je jen postup nákupu.
- **Co měníme:** lístky SDY, VGT a AGG mají místo „otoč“ zámek a po klepnutí otevřou formulář („Dvojče najdeš v taháku“). VOO a ostatní zůstanou volně, takže slib reklamy A platí. Karty párů níž ukážou u zamčených fondů jen originál.
- **Metrika:** návštěva → odeslání. Kontrolní: podíl návštěv, které odejdou hned po klepnutí na zamčený lístek, a stížnosti v komentářích u reklamy.
- **Minimum:** z 6 % na 7,2 % (+20 %) → 6 717 návštěv na verzi, **asi 13 400 celkem**.
- **Proč druhá:** může mít velký dopad, ale nese riziko: jde proti zásadě, že hodnota je vidět před formulářem, část lidí odradí a nesmí ji vidět lidé z reklamy B, která slibuje všech 7 fondů a jejich evropské verze. Test proto jen na návštěvách z reklamy A (`?v=dvojce`) a až po první hypotéze.

**3. Jeden lístek otočený hned po načtení**
- **Hypotéza:** část lidí nepozná, že se na lístek dá klepnout, nebo to nezkusí. Když lístek VOO ukáže dvojče sám, hodnota je vidět bez jediné akce a víc lidí dojde k výzvě.
- **Co měníme:** lístek VOO se chvíli po načtení sám otočí na VUAA, ostatní zůstanou lícem nahoru.
- **Metrika:** návštěva → odeslání. Vedlejší: návštěva → otočení lístku, které by se mělo zvednout nejvíc.
- **Minimum:** z 6 % na 6,9 % (+15 %) → 11 690 návštěv na verzi, **asi 23 400 celkem**.
- **Proč třetí:** míří na krok 2, kde v absolutních číslech odejde odhadem nejvíc lidí (600 z 1 000), ale na odeslání působí jen nepřímo. Kdo uvidí dvojče bez klepnutí, nemusí o tahák stát. Proto čekám nejmenší dopad.

**Co už hypotéza není:** dřívější třetí hypotéza „výzva slibuje postup nákupu místo všech 7 dvojčat“. Stránka dvojčata ukáže zdarma, takže slib „všech 7 dvojčat“ byl chyba, ne varianta k testu. Je opravený na stránce i v reklamách (výzva, lišta, panel, sekce Tahák, reklamy).

**Výpočet minima:** n na verzi = (z₁₋α/₂ + z₁₋β)² × [p₁(1 − p₁) + p₂(1 − p₂)] ÷ (p₂ − p₁)², kde α = 0,05 oboustranně (z = 1,96) a síla testu 80 % (z = 0,84), takže (1,96 + 0,84)² ≈ 7,85. Například první hypotéza: 7,85 × (0,06 × 0,94 + 0,075 × 0,925) ÷ 0,015² = 7,85 × 0,1258 ÷ 0,000225 ≈ 4 388. Výchozí konverze 6 % je střední odhad. Kdyby skutečná byla 2 %, potřebný počet návštěv vyjde zhruba třikrát vyšší (u první hypotézy 13 807 na verzi). Výpočet je proto potřeba zopakovat s konverzí naměřenou v prvním týdnu. Při 500 návštěvách denně (předpoklad) by první test trval asi 18 dní, druhý 27 a třetí 47. Druhý test běží jen na návštěvách z reklamy A, takže potrvá déle podle toho, jaký podíl provozu A přivede.

**Co je pro test potřeba připravit:** stránka zatím rozlišuje jen verzi reklamy (`?v=`). Pro test na stránce je potřeba přidat druhý parametr nebo náhodné přidělení verze při načtení (bez ukládání do prohlížeče) a ukládat ho k událostem i ke kontaktu. Testy pouštět po jednom, s délkou určenou předem a bez předčasného vyhodnocování.
