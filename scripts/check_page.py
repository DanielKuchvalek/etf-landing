"""Porovná čísla a tvrzení na stránce (public/index.html) s data/etf.json.

U každého páru kontroluje výsledek „Najdi dvojče“ (ticker, poplatky, Kč z 10 000 Kč, počty titulů
u podobných indexů, měnu, jmenované brokery, odznak stejný/podobný index), kartu páru a odkazy na zdroje.
Použití: python3 scripts/check_page.py
"""
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
data = json.loads((ROOT / "data" / "etf.json").read_text(encoding="utf-8"))
page = (ROOT / "public" / "index.html").read_text(encoding="utf-8")
BROKERS = [("xtb_cz", "XTB"), ("trading212", "Trading 212"), ("degiro", "Degir")]  # Degiro i Degira


def plain(fragment):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", fragment))).replace("\xa0", " ")


def cz(x):
    return f"{x:.2f}".replace(".", ",")


def thousands(n):
    return f"{n:,}".replace(",", " ")


def kc(ter):
    """Kč ročně z 10 000 Kč: TER v % × 100."""
    return round(ter * 100)


errors = 0
for e in data["etf"]:
    tk, u = e["ticker"], e["ucits_obdoba"]
    twin = u["burza"]["hodnota"]["ticker"]
    kk = u["kde_koupit"]
    same = "stejný index" in u["rozdil_oproti_originalu"].lower()

    art = re.search(rf'<article[^>]*data-etf="{tk}".*?</article>', page, re.S)
    text = plain(art.group(0)) if art else ""
    expected = [twin, f"{cz(u['ter']['hodnota'])} %", f"{kc(u['ter']['hodnota'])} Kč z každých 10 000 Kč",
                {"EUR": "v eurech", "USD": "v dolarech"}[u["burza"]["hodnota"]["mena"]],
                "Stejný index" if same else "Podobný, ne stejný"]
    if e["ter"]["hodnota"] != u["ter"]["hodnota"]:
        expected.append(f"{cz(e['ter']['hodnota'])} % ({kc(e['ter']['hodnota'])} Kč)")
    if not same:
        expected += [thousands(e["pocet_titulu"]["hodnota"]), thousands(u["pocet_titulu"]["hodnota"])]
    for key, name in BROKERS:
        if kk[key]["hodnota"]:
            expected.append(name)
    missing = [x for x in expected if x not in text]
    for key, name in BROKERS:
        if not kk[key]["hodnota"] and name in text:
            missing.append(f"jmenuje {name}, ale v datech není ověřeno")

    card = re.search(rf'<li[^>]*id="par-{tk.lower()}".*?</li>', page, re.S)
    card_text = plain(card.group(0)) if card else ""
    fee_shown = f"{kc(u['ter']['hodnota'])} Kč" in card_text or f"{cz(u['ter']['hodnota'])} %" in card_text
    card_missing = ([] if twin in card_text else [twin]) + ([] if fee_shown else ["poplatek dvojčete"])

    sources_ok = e["emitent"]["zdroj"] in page and u["nazev"]["zdroj"] in page
    ok = not missing and not card_missing and sources_ok
    errors += not ok
    print(f"{'OK   ' if ok else 'CHYBA'} {tk} → {twin}"
          + (f" | výsledek: {missing}" if missing else "")
          + (f" | karta: {card_missing}" if card_missing else "")
          + ("" if sources_ok else " | chybí odkaz na zdroj"))

date_ok = "10. 10. 2026" in plain(page) and data["meta"]["overeno_dne"] == "2026-10-10"
print(f"{'OK   ' if date_ok else 'CHYBA'} datum ověření na stránce odpovídá datům")
errors += not date_ok
print("VŠE OK" if not errors else f"CELKEM CHYB: {errors}")
sys.exit(1 if errors else 0)
