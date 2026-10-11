# Skripty

Testy, snímky obrazovky, Lighthouse a generování PDF taháku. Nejsou součástí webu, Vercel je neservíruje.

## Jednou na začátku

```
cd scripts
npm install
```

Používá nainstalovaný Google Chrome. Jinou cestu nastavíš proměnnou `CHROME_PATH`.

Test ve WebKitu (engine Safari) potřebuje Playwright a jeho WebKit. Ten se stáhne do `scripts/node_modules`:

```
npm run webkit
```

## Po každé změně

V jednom terminálu spusť server:

```
./scripts/serve.sh
```

Server ([server.mjs](server.mjs)) servíruje `public/` a funkce z `api/` stejně jako Vercel. Bez proměnných `SUPABASE_*` běží s podvrženou databází v paměti: formulář i měření fungují, nic se nikam neposílá a na `/__dev/db` je vidět, co by se uložilo. U každé odpovědi 404 vypíše, kde soubor hledal a kdo se ptal. Se skutečnou databází: `node --env-file=.env.local scripts/server.mjs` (z kořene repa; obsah `.env.local` nikdy nevypisuj).

V druhém terminálu:

```
python3 scripts/check_data.py      # data/etf.json: každý údaj má zdroj a datum, platné ISINy
python3 scripts/check_page.py      # čísla na stránce odpovídají data/etf.json
cd scripts
node test-api.mjs                  # funkce v api/ s podvrženou databází: validace, limity, honeypot, klíče, vercel.json
node test-page.mjs                 # interakce na 375 px: výběr ETF, formuláře, panel, měření, uložení do databáze
node test-webkit.mjs               # WebKit, iPhone 13 / SE / SE 320 px: formuláře se simulovanou klávesnicí
node lighthouse.mjs                # Lighthouse (mobil) pro všechny verze úvodu
node screenshots.mjs po            # snímky do docs/screenshots/po-*.png
node pdf.mjs                       # vygeneruje public/tahak.pdf z tahak/tahak.html a data/etf.json
node obrazky.mjs                   # favicony a obrázek pro sdílení public/og.png (1200×630) z data/etf.json
cd ..
python3 scripts/check_pdf.py       # PDF obsahuje správné ISINy, poplatky a brokery (macOS, PDFKit)
swift scripts/pdf-to-png.swift public/tahak.pdf /tmp/tahak 700   # stránky PDF jako PNG ke kontrole
```

Skripty vracejí nenulový návratový kód, když něco neprojde.

## Na telefonu

```
HOST=0.0.0.0 ./scripts/serve.sh
```

Na telefonu ve stejné Wi-Fi otevři `http://<IP Macu>:8737`. IP zjistíš příkazem `ipconfig getifaddr en0`.
