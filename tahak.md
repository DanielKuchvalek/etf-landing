# Tahák (PDF): osnova a co pro něj chybí

**Název:** Tahák: 7 ETF z NYSE a jejich dvojčata, která koupíš z Česka
**Slib ze stránky:** ISINy, poplatky, kde koupit a postup nákupu krok za krokem. Na stránce je, **co** koupit, v taháku je, **jak** na to.

**Formát:** PDF se stahuje hned po odeslání formuláře, takže ho většina lidí otevře na mobilu.

- Sazba v jednom sloupci, velké písmo, tabulky úzké nebo rozdělené na karty. Klasická dvousloupcová A4 by se na telefonu špatně četla.
- Jen text, tabulky a jednoduchá grafika, žádné fotky, aby PDF bylo malé a stáhlo se rychle.
- Výroba: HTML s tiskovým CSS, export do PDF. Jednorázově, žádný build krok webu.

## Osnova

Značky `[d: …]`, `[r: …]` a `[TODO]` mají stejný význam jako v [texty.md](texty.md).

### 1. Titulní strana

- Název a podtitul: „Co koupit a jak, když VOO u brokera nenajdeš“.
- „Data ověřena 10. 10. 2026“ `[d: meta.overeno_dne]`
- „Nejde o investiční doporučení.“
- Provozovatel: [TODO správce: Clientelo]

### 2. Proč dvojčata (půl strany)

- Tři věty jako v sekci 4 stránky. `[r: PRIIPs]`
- Jedna věta o výjimkách: profesionální klient a výklad ČNB k execution-only. `[r: PRIIPs]`

### 3. Všech 7 párů v jedné tabulce

Sloupce:

- originál: ticker a poplatek `[d: * › ter]`
- dvojče: ticker a název `[d: * › ucits_obdoba.nazev]`
- ISIN `[d: * › ucits_obdoba.isin]`
- burza a měna `[d: * › ucits_obdoba.burza]`
- poplatek dvojčete `[d: * › ucits_obdoba.ter]`
- dividendy `[d: * › ucits_obdoba.dividendova_politika]`
- stejný, nebo podobný index `[d: * › ucits_obdoba.rozdil_oproti_originalu]`

Všechno ověřené, nic nechybí.

### 4. Karta každého páru (7×)

- **Ověřené:**
  - rozdíl indexu a počet titulů `[d: X › pocet_titulu]` `[d: X › ucits_obdoba.pocet_titulu]`
  - velikost fondu s datem `[d: X › ucits_obdoba.velikost_fondu]`
  - dividendy
  - všechny burzy, kde je fond kotovaný `[d: X › ucits_obdoba.kotace]`
  - odkaz na stránku správce `[d: X › ucits_obdoba.nazev.zdroj]`
- **Chybí:**
  - odkaz na KID dvojčete `[TODO]`
  - měna fondu `[TODO]`

### 5. Jak koupit krok za krokem

| Krok | Obsah | Stav |
|---|---|---|
| 1. Vyber brokera | broker s přístupem na Deutsche Börse nebo London Stock Exchange | ověřené jen XTB `[d: * › ucits_obdoba.kde_koupit.xtb_cz]`, ostatní `[TODO]` |
| 2. Založ účet | co je potřeba (doklady, jak dlouho to trvá) | `[TODO]` neověřeno |
| 3. Pošli peníze | v jaké měně, za kolik | `[TODO]` neověřeno |
| 4. Najdi fond | vyhledej podle ISINu nebo tickeru | ISIN a ticker ověřené `[d: * › ucits_obdoba.isin]`; jak vyhledávání vypadá v aplikaci `[TODO]` |
| 5. Zkontroluj burzu a měnu | Deutsche Börse v EUR, u IUAA London Stock Exchange v USD | ověřené `[d: * › ucits_obdoba.burza]` |
| 6. Zadej pokyn | typ pokynu (tržní, nebo limitní) a částka | `[TODO]` vysvětlení převzít ze zdroje (nápověda brokera), ne z hlavy |
| 7. Co dál | pravidelné nákupy, kdy se dívat na KID | `[TODO]` |

### 6. Na co si dát pozor

- **Dvojče není vždy totéž co originál.** U 4 ze 7 je index jen podobný. `[d: * › ucits_obdoba.rozdil_oproti_originalu]`
- **Poplatek fondu (TER) není jediný náklad.** Platí se i poplatek brokera a za směnu měny. `[TODO]` čísla se zdrojem, viz seznam níže.
- **Měnové riziko:** fondy jsou v USD, obchoduješ v EUR nebo USD. `[TODO]` měna fondu do dat.
- **Daně:** `[TODO]` Buď vynechat, nebo se zdrojem a ideálně s daňovým poradcem.

### 7. Zdroje

- Seznam URL ke každému údaji `[d: * › *.zdroj]`.
- Zdroje k PRIIPs z [data/README.md](data/README.md).

### 8. Patička

Provozovatel, kontakt, „Nejde o investiční doporučení. Investování nese riziko.“ `[TODO správce a kontakt]`

## Co pro tahák chybí nebo není ověřené

| # | Údaj | Kde v taháku | Stav | Co je potřeba |
|---|---|---|---|---|
| 1 | Dostupnost dvojčat u jiných brokerů než XTB (Fio, Trading 212, Degiro, IBKR, Portu, Lynx) | 3, 5 | v datech `null` | ověřit na webu nebo v aplikaci každého brokera, uložit se zdrojem a datem |
| 2 | Jestli XTB prodá VOO.US retailovému klientovi | 2 | neověřeno | zkusit v aplikaci s retailovým účtem |
| 3 | Postup založení účtu, vkladu a nákupu | 5 | neověřeno | projít u jednoho brokera a popsat podle jeho nápovědy |
| 4 | Poplatky brokerů za nákup a směnu měn | 6 | není v datech | Na webu XTB (stránka VOO.US) bylo 10. 10. 2026 vidět „0 % do 100 000 EUR měsíčně, nad limit 0,2 % (min. 10 EUR)“ a „poplatek 0,5 % za konverzi měn“. Je to jen v exportu konverzace, ne v datech; doplnit do `etf.json` se zdrojem a znovu ověřit. |
| 5 | Měna fondu (base currency) | 4, 6 | na stránkách správců je, v datech ne | doplnit do `etf.json` |
| 6 | Odkaz na KID každého dvojčete | 4 | ověřený jen VUAA (`data/README.md`) | dohledat u všech 7 |
| 7 | Datum platnosti TER | 3 | u většiny `k_datu: null` | ponechat „stav k 10. 10. 2026“, nebo datum z prospektu |
| 8 | Datum velikosti fondu u dvojčat od Vanguardu | 4 | `k_datu: null` | uvést „stav k 10. 10. 2026“ |
| 9 | Daně | 6 | nezkoumáno | vynechat, nebo zdroj a daňový poradce |
| 10 | Minimální částka a zlomky podílů | 5 | neověřeno | podle nápovědy brokera |
| 11 | Výkonnost fondů | není v osnově | nesbírá se | nezařazovat; pokud ano, s obdobím, měnou, zdrojem a upozorněním |
| 12 | Správce, kontakt, zásady ochrany osobních údajů | 1, 8 | `[TODO]` | dodá zadavatel |
