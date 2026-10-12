# Obchodní pohled

Část [README](../README.md), přesunutá sem, aby se hlavní README dalo přečíst za 5 minut.

**K čemu je kontakt.** Co s kontakty Clientelo nebo jeho klient udělá, zadání neříká, proto to beru obecně. Kontakt je člověk, který se aktivně zajímá o ETF, viděl, které fondy si z Česka koupí, a souhlasil s e-maily o investování do ETF. Hodí se pro firmu, která na investování do ETF vydělává: broker nebo investiční platforma (otevření účtu), finanční médium nebo vzdělávání (newsletter, kurz). U kontaktu je uložená i verze reklamy, takže je vidět, s jakou motivací přišel (zklamání z brokera, nebo nejistota začátečníka), a podle toho jde psát první e-maily.

**Orientační cena za kontakt.** Cena za kontakt = cena za klik ÷ (podíl kliků, ze kterých je načtená stránka × konverze návštěva → kontakt). Předpoklady:

- **Cena za klik z Meta v Česku: předpoklad 5–20 Kč, středně 10 Kč.** Ověřený zdroj pro český trh nemám. Pro představu: [LocaliQ (WordStream)](https://localiq.com/blog/facebook-advertising-benchmarks/) uvádí u kampaní Facebooku na návštěvnost průměrnou cenu za klik 0,60 USD napříč obory a 0,86 USD pro finance a pojištění. Jsou to data z kampaní jejich klientů, český trh v nich zvlášť není a na koruny je nepřepočítávám.
- **Z kliku je načtená stránka: předpoklad 85 %.** Část lidí stránku zavře dřív, než se načte. Stránka je rychlá (LCP 0,9–1,1 s v Lighthouse na živé adrese), ztráta by tedy neměla být velká, ale změřená není.
- **Konverze: 2 %, 6 % a 13,2 %** z [odhadu výše](../README.md#očekávaná-konverze).

Výpočet střední varianty: 10 Kč ÷ (0,85 × 0,06) = 10 Kč ÷ 0,051 ≈ **196 Kč za kontakt**. Jinak řečeno: 1 000 kliků za 10 000 Kč → 850 návštěv → 51 kontaktů.

| Cena za klik | Konverze 2 % | 6 % | 13,2 % |
|---|---|---|---|
| 5 Kč | 294 Kč | 98 Kč | 45 Kč |
| 10 Kč | 588 Kč | **196 Kč** | 89 Kč |
| 20 Kč | 1 176 Kč | 392 Kč | 178 Kč |

Rozsah je široký, protože oba vstupy jsou odhady. Po pár dnech kampaně se dosadí skutečná cena za klik z Meta a konverze z trychtýře. Kontakt se vyplatí, když z něj klient v průměru vydělá víc, než stojí. To záleží na jeho byznysu, který zadání neuvádí, takže to nehádám. S double opt-inem (viz [Bezpečnost](bezpecnost.md#bezpečnost-a-ochrana-proti-spamu)) by se cena počítala na potvrzený kontakt a byla by vyšší.

**Proč jen e-mail a nic dalšího:**
- **E-mail stačí k tomu, co slibujeme.** Tahák se ukáže hned a další e-maily jdou na adresu. Jméno ani telefon k tomu nejsou potřeba.
- **Každé pole navíc je na mobilu další psaní** a další důvod formulář nedokončit. Člověk z reklamy stránce dává pár sekund.
- **Telefon by změnil, co nabízíme.** Za PDF zdarma ho návštěvník spíš nedá, protože by čekal hovor od prodejce. Je to můj předpoklad, neměřený.
- **Minimalizace údajů:** GDPR chce osobní údaje omezit na to, co je pro daný účel nezbytné (čl. 5 odst. 1 písm. c)). Méně údajů je i menší škoda při úniku.
- **Víc se dá zjistit později:** v prvním e-mailu jednou otázkou na klepnutí (třeba „U jakého brokera jsi?“). Odpoví jen ti, kdo už důvěřují, a formulář na stránce zůstane krátký.
