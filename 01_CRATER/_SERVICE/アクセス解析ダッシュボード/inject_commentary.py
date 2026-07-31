import os
import re
import json
import sys
from datetime import datetime, timezone, timedelta

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_PATH = os.path.join(HERE, "output", "data", "日次データ.json")

SITE_KEYS = {
    "CRATER": "crater",
    "ACURRY": "acurry",
    "A CURRY": "acurry",
    "CHICS": "chics",
    "YEARS": "years",
    "APOLLOS": "apollos",
    "BIRTH": "birth",
}


def parse(text):
    fields = {"INSIGHT": "", "SUGGESTION": ""}
    site_comments = {}
    for line in text.splitlines():
        m = re.match(r"^\s*([A-Z ]+?)\s*[:：]\s*(.+)$", line)
        if not m:
            continue
        key, val = m.group(1).strip(), m.group(2).strip()
        if key in ("INSIGHT", "SUGGESTION"):
            fields[key] = val
        elif key in SITE_KEYS:
            site_comments[SITE_KEYS[key]] = val
    return fields, site_comments


def main():
    commentary_path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "commentary.txt")
    with open(commentary_path, encoding="utf-8") as f:
        text = f.read()

    fields, site_comments = parse(text)

    with open(OUT_PATH, encoding="utf-8") as f:
        data = json.load(f)

    data["insight"] = fields["INSIGHT"] or data.get("insight", "")
    data["suggestion"] = fields["SUGGESTION"] or data.get("suggestion", "")
    for site in data["sites"]:
        if site["id"] in site_comments:
            site["comment"] = site_comments[site["id"]]

    today = datetime.now(timezone(timedelta(hours=9))).strftime("%Y-%m-%d")
    history = data.get("history", [])
    history = [h for h in history if h.get("date") != today]
    history.append({"date": today, "text": data["insight"]})
    data["history"] = history[-30:]

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("INSIGHT:", data["insight"])
    print("SUGGESTION:", data["suggestion"])


if __name__ == "__main__":
    main()
