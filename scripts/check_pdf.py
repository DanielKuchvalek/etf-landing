"""Zkontroluje public/tahak.pdf proti data/etf.json: u každého páru ISIN, ticker, poplatek v Kč a brokery.

Text z PDF tahá scripts/pdf-text.swift (macOS PDFKit). Použití: python3 scripts/check_pdf.py
"""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
data = json.loads((ROOT / "data" / "etf.json").read_text(encoding="utf-8"))
raw = subprocess.run(["swift", str(ROOT / "scripts" / "pdf-text.swift"), str(ROOT / "public" / "tahak.pdf")],
                     capture_output=True, text=True, check=True).stdout
text = re.sub(r"\s+", " ", raw.replace("\xa0", " "))
pages = int(re.search(r"STRAN: (\d+)", text).group(1))

errors = 0
for e in data["etf"]:
    u = e["ucits_obdoba"]
    twin = u["burza"]["hodnota"]["ticker"]
    kc = round(u["ter"]["hodnota"] * 100)
    kk = u["kde_koupit"]
    brokers = [n for k, n in [("xtb_cz", "XTB"), ("trading212", "Trading 212"), ("degiro", "Degiro")] if kk[k]["hodnota"]]
    expected = [u["isin"]["hodnota"], f"{e['ticker']} → {twin}", f"{kc} Kč ročně z 10 000 Kč", "✓ " + ", ".join(brokers)]
    missing = [x for x in expected if x not in text]
    errors += bool(missing)
    print(f"{'OK   ' if not missing else 'CHYBA'} {e['ticker']} → {twin}" + (f" | chybí: {missing}" if missing else ""))

for phrase in ["Jak koupit dvojče krok za krokem", "XTB", "Trading 212", "Vydává Daniel Kuchválek", "Nejde o investiční doporučení"]:
    ok = phrase in text
    errors += not ok
    print(f"{'OK   ' if ok else 'CHYBA'} obsahuje „{phrase}“")
print(f"stran: {pages}")
print("VŠE OK" if not errors else f"CELKEM CHYB: {errors}")
sys.exit(1 if errors else 0)
