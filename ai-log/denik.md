# Deník práce s AI

Doplňuje exporty konverzací (`/export`), které nezachytí celý průběh práce subagentů. Podklad pro sekci „Jak jsem pracoval s AI“ v README.

## Formát záznamu

### RRRR-MM-DD – krok

- **Zadání pro AI / agenta:** …
- **Kontrola výstupu:** …
- **Kde se AI spletla a jak se na to přišlo:** …

## Záznamy

### 2026-10-10 – výzkum PRIIPs a data o ETF

- **Zadání pro AI:** ověřit z primárních zdrojů (EUR-Lex, ČNB, ESMA, brokeři), proč Čech nekoupí americké ETF; vybrat 6–8 ETF z NYSE / NYSE Arca, burzu ověřit u emitenta; ke každému najít UCITS obdobu; vše uložit do `data/etf.json` se zdrojem a datem. Bez subagentů, jedna konverzace.
- **Kontrola výstupu:**
  - data z webů emitentů vytáhl skript (bez ručního přepisování),
  - kontrolní skript ověřil, že každý údaj má zdroj a datum a null jen s poznámkou,
  - ISINy prošly kontrolou kontrolní číslice,
  - všech 42 zdrojových URL vrací HTTP 200.
- **Kde se AI spletla nebo by se spletla:**
  - Odhadnuté ID produktové stránky Vanguard UK (9679) vedlo na FTSE All-World, ne na S&P 500. Přišlo se na to podle ISINu na stránce; správná ID se pak dohledala.
  - VTI se dnes jmenuje „Vanguard Morningstar Total Stock Market ETF“ a sleduje index Morningstar. Z paměti by AI uvedla jiný název a index; opravilo se díky čtení přímo z API Vanguardu.
  - Regex na index u SDY selhal, protože JSON v HTML byl escapovaný. Kontrolní výpis skriptu to zachytil („index: nenalezeno“).
  - Volba hlavní burzy u UCITS fondu AGG nejdřív vybrala mexickou burzu (první v seznamu). Zjistilo se to při čtení souhrnu a pravidlo se změnilo na Xetra EUR → LSE USD.
  - Původní předpoklad „PRIIPs = zákaz“ byl příliš zjednodušený: ČNB připouští execution-only bez KID a XTB má VOO.US jako stránku ETF. Zapsáno jako výhrada v `data/README.md`.
