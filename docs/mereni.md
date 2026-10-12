# Měření cesty návštěvníka

Část [README](../README.md), přesunutá sem, aby se hlavní README dalo přečíst za 5 minut.

Vlastní události místo GA4, bez cookies a bez cookie lišty. Stránka je posílá přes `navigator.sendBeacon` na [`/api/event`](../api/event.js) a funkce je ukládá do tabulky `events` v Supabase ([schéma](../supabase/schema.sql)).

| Událost | Kdy | Detail | ID návštěvy |
|---|---|---|---|
| `prichod` | načtení stránky | `sdileni` u odkazu od kamaráda, jinak `utm_source:utm_campaign:utm_content` (každá část nejvýš 24 znaků) | ano |
| `scroll` | 25, 50, 75 a 100 % stránky, každá jednou | hloubka | ano |
| `otoceni_listku` | klepnutí na lístek | např. `VOO:dvojce`, `VOO:original` | ano |
| `vyzva_zobrazena` | výzva k taháku pod lístky po prvním otočení | `listky` | ano |
| `cta` | klepnutí na tlačítko taháku | odkud: `listky`, `lista`, `karty` | ano |
| `formular_otevren` | formulář se rozbalí nebo otevře v panelu | odkud | ano |
| `formular_zacatek` | první fokus do formuláře | odkud, včetně `sekce` | ano |
| `odeslani_pokus`, `odeslani_chyba`, `odeslano` | odeslání, chybová hláška, úspěch | odkud / typ chyby | **ne** |
| `tahak_otevren` | klepnutí na „Otevřít tahák“ | kde: `panel`, `listky`, `sekce` | **ne** |
| `sdileni` | „Poslat odkaz kamarádovi“ | `nativni`, `zruseno`, `kopie`, `rucne` | **ne** |

- **ID návštěvy** je náhodné UUID jen v paměti jednoho načtení stránky, do prohlížeče se nic neukládá. Události od odeslání dál ho nemají (poslední sloupec), jdou jen s verzí úvodu z `?v=` a detailem.
- **Trychtýř podle verzí úvodu** počítá pohled `analytika.trychtyr` ze [supabase/funnel.sql](../supabase/funnel.sql): příchod → otočení lístku → otevření formuláře → odeslání. Kroky 1–3 se počítají z událostí podle ID návštěvy: kolik návštěv krok udělalo, kolik i všechny předchozí a podíl z příchodů. Odeslání se počítá z tabulky kontaktů podle verze úvodu, kterou ukládáme ke kontaktu. U odeslání proto nejde říct, které předchozí kroky ta návštěva udělala, a opakovaný e-mail se nepočítá dvakrát.
- **Od data spuštění kampaně:** `select * from analytika.trychtyr_od('2026-10-16 00:00+02');` počítá jen události a kontakty od zadaného okamžiku, pohled `analytika.trychtyr` je za celou dobu.
- **Co z trychtýře jde a nejde vyčíst:** je agregovaný. Kroky 1–3 se počítají podle návštěv, odeslání podle kontaktů. Jde z něj vyčíst, kolik návštěv kterým krokem prošlo a jaký podíl odeslal formulář, zvlášť pro každou verzi úvodu a od zvoleného data. Nejde z něj vyčíst, jestli konkrétní odesílající návštěva předtím otočila lístek nebo přišla z určité kampaně: odeslání záměrně nemá ID návštěvy. Porovnání kampaní (`utm_campaign`, `utm_content`) jde proto jen u příchodů a kroků 1–3, u odeslání podle verze úvodu.
- **Kontakt a návštěva se nespojují.** Co pro to děláme:
  - e-mail jde jinou funkcí ([`/api/lead`](../api/lead.js)) do jiné tabulky a nikdy s ID návštěvy (funkce kontakt s ID odmítne),
  - události od odeslání dál nemají ID návštěvy, takže z měření nejde vyčíst, která návštěva formulář odeslala. Hlídá to funkce i kontrola na tabulce v databázi,
  - čas událostí je jen na celé minuty a klíče řádků jsou náhodná UUID, ne pořadová čísla,
  - detail události bere funkce z pevného seznamu hodnot, u příchodu je to text z UTM omezený regulárním výrazem (malá písmena, číslice, `_.-`, nejvýš 3 × 24 znaků). E-mail ani jiný libovolný text se tam nedostane, krátké vymyšlené UTM hodnoty ano.

  **Nemožné to není.** Kdo má přímý přístup do databáze, vidí i pořadí zápisu (systémové sloupce Postgresu). Při malém provozu může odhadnout, která návštěva otevřela formulář těsně předtím, než přibyl kontakt se stejnou verzí úvodu. Okruh dál zužuje detail události odeslání (pod lístky, v panelu, v sekci). Když v té době formulář otevřela jen jedna návštěva, bude odhad nejspíš správný. S rostoucím provozem se zhoršuje. ID návštěvy proto beru jako pseudonymní údaj, ne anonymní.
- **Ověřeno automaticky:** test v Chromu porovná události, které stránka odeslala, s tím, co lokální server uložil, a kontroluje, že v nich nikde není e-mail. Vlastní funkce mají testy s podvrženou databází ([scripts/test-api.mjs](../scripts/test-api.mjs)).
- **Před ostrou kampaní by měl měření posoudit právník** ([Před spuštěním kampaně](pred-spustenim.md#před-spuštěním-kampaně)): i odesílání dat z prohlížeče bez cookies může podle pokynů Evropského sboru pro ochranu osobních údajů 2/2023 vyžadovat souhlas. Tenhle výklad jsme z primárního zdroje neověřovali.

## Falešné příchody

`/api/event` nemá token (na rozdíl od formuláře), protože by zdržel měření příchodu. Kdokoli tak může poslat vymyšlené události. Limity: 600 událostí za hodinu z jedné IP (hash, ne IP) a 100 na jednu návštěvu, tělo do 512 B, detail jen z povolených hodnot.

**Jak se pozná:**
- návštěvy, které mají jen `prichod` a nic dalšího (ani scroll), ve velkém počtu v krátkém čase,
- neznámé UTM hodnoty v detailu příchodu, které žádná reklama nepoužívá,
- skok příchodů proti klikům v Ads Manageru za stejné období,
- v tabulce `limity` počítadla pro `event` blízko limitu 600.

```sql
-- příchody podle hodiny a UTM: náhlý skok s neznámou hodnotou je podezřelý
select date_trunc('hour', cas) as hodina, detail, count(*) from public.events
where udalost = 'prichod' group by 1, 2 order by 1 desc, 3 desc;

-- návštěvy jen s příchodem v podezřelém okně
select count(*) from public.events e where e.udalost = 'prichod' and e.cas between '2026-10-20 10:00+02' and '2026-10-20 11:00+02'
  and not exists (select 1 from public.events x where x.navsteva = e.navsteva and x.udalost <> 'prichod');
```

**Jak vyčistit:** smazat události těch návštěv (stejná podmínka jako výše, `delete from public.events where navsteva in (…)`), nebo trychtýř počítat od data po útoku (`analytika.trychtyr_od`). Kontakty to neovlivní, ty chrání token, MX a limit ([bezpečnost](bezpecnost.md)). Kdyby se to opakovalo, dá se k událostem přidat stejný podepsaný token jako u formuláře.

