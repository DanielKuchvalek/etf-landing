"""Kontrola data/etf.json: každý údaj má zdroj a datum, null jen s poznámkou, ISIN s platnou kontrolní číslicí.

Použití: python3 scripts/check_data.py [cesta k etf.json]
"""
import json
import sys
from pathlib import Path

path = sys.argv[1] if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent / "data" / "etf.json"
data = json.load(open(path, encoding="utf-8"))
errors = []
fields = 0
nulls = []


def isin_ok(isin):
    if not isin or len(isin) != 12:
        return False
    digits = "".join(str(int(c, 36)) for c in isin[:-1])
    total = 0
    for i, d in enumerate(reversed(digits)):
        n = int(d)
        if i % 2 == 0:
            n *= 2
            if n > 9:
                n -= 9
        total += n
    return (10 - total % 10) % 10 == int(isin[-1])


def walk(node, where):
    global fields
    if isinstance(node, dict) and "overeno" in node:
        fields += 1
        for key in ("hodnota", "zdroj", "k_datu", "overeno"):
            if key not in node:
                errors.append(f"{where}: chybí klíč {key}")
        if node.get("hodnota") is None:
            nulls.append(where)
            if not node.get("poznamka"):
                errors.append(f"{where}: null bez poznámky")
        elif not str(node.get("zdroj", "")).startswith("https://"):
            errors.append(f"{where}: hodnota bez zdroje")
        return
    if isinstance(node, dict):
        for k, v in node.items():
            walk(v, f"{where}.{k}")
    elif isinstance(node, list):
        for i, v in enumerate(node):
            walk(v, f"{where}[{i}]")


walk(data["etf"], "etf")
for e in data["etf"]:
    isin = e["ucits_obdoba"]["isin"]["hodnota"]
    if not isin_ok(isin):
        errors.append(f"{e['ticker']}: neplatný ISIN {isin}")

print(f"údajů: {fields}, null: {len(nulls)}, chyb: {len(errors)}")
for n in nulls:
    print("  null:", n)
for err in errors:
    print("  CHYBA:", err)

print()
for e in data["etf"]:
    u = e["ucits_obdoba"]
    v = lambda x: x["hodnota"]  # noqa: E731
    print(f"{e['ticker']:4} | {v(e['nazev'])} | {v(e['burza'])} | {v(e['index'])} | TER {v(e['ter'])} "
          f"(k {e['ter']['k_datu']}) | {e['velikost_fondu']['hodnota_ve_zdroji']} (k {e['velikost_fondu']['k_datu']}) | "
          f"titulů {v(e['pocet_titulu'])} (k {e['pocet_titulu']['k_datu']}) | {v(e['dividendova_politika'])} | XTB: {v(e['original_u_xtb_cz'])}")
    b = v(u["burza"]) or {}
    print(f"     UCITS: {v(u['nazev'])} | {v(u['isin'])} | {v(u['index'])} | TER {v(u['ter'])} | "
          f"{u['velikost_fondu']['hodnota_ve_zdroji']} (k {u['velikost_fondu']['k_datu']}) | titulů {v(u['pocet_titulu'])} "
          f"(k {u['pocet_titulu']['k_datu']}) | {v(u['dividendova_politika'])} | {b.get('burza')} {b.get('ticker')} {b.get('mena')} | "
          f"kotací {len(v(u['kotace']) or [])} | XTB: {v(u['kde_koupit']['xtb_cz'])}"
          + (f" | registrace ČR: {v(u['registrace_v_cr'])}" if 'registrace_v_cr' in u else ""))

sys.exit(1 if errors else 0)
