# Meta Conversions API (popis, v demu není)

Část [README](../README.md), přesunutá sem, aby se hlavní README dalo přečíst za 5 minut.

po spuštění kampaně by se hodilo posílat Metě událost `Lead` ze serveru, aby reklamní systém věděl, která reklama přivádí kontakty, a mohl na ně optimalizovat. Návrh:
- posílá ji `api/lead.js` až po úspěšném uložení nového kontaktu (ne u duplicity, bota ani chyby), přímo na Conversions API, bez pixelu a bez cookies v prohlížeči,
- s `event_id`, `event_time`, verzí reklamy a `fbclid` z odkazu (kdyby se předával), přístupový token jen v proměnné prostředí,
- hashovaný e-mail (SHA-256) zlepší párování, ale je to předání osobního údaje Metě: jen po právní kontrole, s doplněním do zásad a souhlasu,
- Meta jako další příjemce a předání mimo EU musí být v zásadách ([návrh](navrh-pro-clientelo.md)).

V demu není, protože demo nemá reklamní účet, správcem je autor a předávat e-maily Metě by bez právní kontroly a změny souhlasu nebylo v pořádku.
