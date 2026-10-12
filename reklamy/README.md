# Reklamy

Dvě verze pro Meta (Facebook a Instagram), mobil. Testují dva úhly:

| | A „Dvojče“ | B „Začátek“ |
|---|---|---|
| Soubor | [a-dvojce.md](a-dvojce.md) | [b-zacatek.md](b-zacatek.md) |
| Háček | broker ti nenabídl VOO, není to chyba | začínáš s ETF? 7 známých fondů z USA a jejich evropské verze |
| Motivace | zklamání z brokera | nejistota |
| Pro koho | lidi, kteří už o ETF slyšeli a možná je zkoušeli koupit | začátečníci, kteří konkrétní fond zatím nehledají |
| Parametr pro úvod stránky | `?v=dvojce` | `?v=zacatek` |
| `utm_content` | `a-dvojce` | `b-zacatek` |

Původní reklamu B „Poplatky“ jsme zahodili. Bez srovnávacího fondu se zdrojem by její čísla nikoho nezaujala (historie v gitu).

## Formát

- **Umístění:** Facebook a Instagram feed, Stories a Reels. Jeden statický obrázek, žádné video (rychlá výroba, snadná úprava po testu).
- **Obrázky:**
  - feed na výšku 4 : 5 (1080 × 1350 px),
  - Stories a Reels 9 : 16 (1080 × 1920 px).
  - hotové v této složce (`*-feed.png`, `*-stories.png`), generuje je [scripts/reklamy.mjs](../scripts/reklamy.mjs) z HTML, takže texty a vzhled jdou upravit a přegenerovat,
  - u 9 : 16 text je mimo horních 270 px, dolních 450 px a 65 px po stranách (ovládání Instagramu a Facebooku; skript to kontroluje). Oficiální zóny Meta jsem neověřil, jen z návodů třetích stran, které se rozcházejí (dole 250–670 px), proto před spuštěním zkontrolovat v náhledu Ads Manageru.
- **Texty:**
  - primární text je krátký, aby háček byl vidět před zkrácením „… Zobrazit víc“,
  - nadpis do jednoho řádku,
  - `[TODO]` Přesné limity znaků ověřit v Ads Manageru.
- **Tlačítko:** „Zjistit víc“ (Learn more).

## Má se úvod stránky měnit podle reklamy? Ano.

Nadpis a podnadpis první obrazovky se mají měnit, aby návštěvník hned viděl slib, kvůli kterému klepl. Zbytek stránky zůstává pro obě verze stejný. Rozdíl v konverzi tak připíšeme reklamě a úvodu, ne jinému obsahu.

**Jak to udělat:**

- Výchozí nadpis je přímo v HTML, takže bez JavaScriptu i bez parametru stránka funguje.
- Malý inline skript hned za nadpisem přečte `?v=` a přepíše nadpis a podnadpis. Má pár řádků, nic se nenačítá navíc a text se vymění dřív, než si ho člověk stihne přečíst.
- Neznámá hodnota parametru znamená výchozí text.
- Texty všech tří verzí jsou v [texty.md](../texty.md), sekce 1.

**Alternativa:** Vercel rewrite podle parametru na dvě různé HTML stránky by se obešla bez JS. Nedoporučuju ji: obsah by byl dvakrát a při úpravách se rozjede. `[TODO]` Podporu podmínek podle query ve `vercel.json` jsem neověřoval.

**Měření:** hodnota `v` se ukládá ke každé události i ke kontaktu, aby šel trychtýř porovnat podle verze. K příchodu se ukládá i `utm_source:utm_campaign:utm_content`, takže jdou porovnat i reklamy uvnitř jedné verze úvodu. ID návštěvy se s e-mailem nespojuje.

**Odkazy z reklam:**

```
https://etf-dvojcata-demo.vercel.app/?v=dvojce&utm_source=meta&utm_medium=paid_social&utm_campaign=etf-dvojcata&utm_content=a-dvojce
https://etf-dvojcata-demo.vercel.app/?v=zacatek&utm_source=meta&utm_medium=paid_social&utm_campaign=etf-dvojcata&utm_content=b-zacatek
```

## Nastavení testu

- Obě reklamy ve stejné kampani, stejné publikum, stejný rozpočet, souběžně.
- **Hlavní metrika:** odeslané formuláře ÷ návštěvy podle verze úvodu (`v`), z našeho měření (`analytika.trychtyr`).
- **Vedlejší metriky:**
  - míra prokliku (CTR) a cena za proklik z Meta,
  - kolik návštěv otočilo aspoň jeden lístek (krok 2 trychtýře).

## Než se reklama spustí (TODO)

- **Speciální kategorie reklam:** ověřit, jestli kampaň u Meta nespadá do kategorie „Finanční produkty a služby“. Ta může omezit cílení podle věku, takže 25–40 let by nešlo nastavit přesně.
- **Pravidla Meta pro finanční služby:** ověřit, jestli nevyžadují ověření inzerenta nebo upozornění přímo v reklamě.
- **Právník:** posoudit texty reklam z pohledu propagace investic (stránka i reklama říkají, že nejde o doporučení).
- **Vizuály:** bez log správců fondů a brokerů a bez napodobeného rozhraní konkrétní aplikace.
