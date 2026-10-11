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
    expected = [twin, f"{cz(u['ter']['hodnota'])} %", f"{kc(u['ter']['hodnota'])} Kč ročně z každých 10 000 Kč",
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

    broker_names = [n.replace("Degir", "Degiro") for k, n in BROKERS if kk[k]["hodnota"]]
    card = re.search(rf'<li[^>]*id="par-{tk.lower()}".*?</li>', page, re.S)
    card_html = card.group(0) if card else ""
    card_text = plain(card_html)
    fix = re.search(r'<span class="fix">(.*?)</span>', card_html, re.S)
    card_missing = [x for x in [twin, f"{kc(u['ter']['hodnota'])} Kč ročně z 10 000 Kč", "v nabídce " + ", ".join(broker_names)] if x not in card_text]
    if "<mark" in card_html or not fix or "Kč" in plain(fix.group(1)) or "v nabídce" not in plain(fix.group(1)):
        card_missing.append("žlutě má být „v nabídce …“, ne poplatek")

    # zadní strana lístku: dvojče, kde koupit, poplatek v Kč, stejný/podobný index
    card_back = re.search(rf'<a class="listek[^"]*"[^>]*data-etf="{tk}".*?</a>', page, re.S)
    back_text = plain(card_back.group(0)) if card_back else ""
    back_missing = [x for x in [twin, "✓ " + ", ".join(broker_names), f"{kc(u['ter']['hodnota'])} Kč ročně z 10 000 Kč",
                                "stejný index" if same else "podobný index"] if x not in back_text]
    card_missing += [f"lístek: {x}" for x in back_missing]

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
