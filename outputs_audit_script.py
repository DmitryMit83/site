import os, re, json
from urllib.parse import unquote
from bs4 import BeautifulSoup

LANG_DIRS = ["lv", "en", "ru"]
all_files = {}
for d in LANG_DIRS:
    all_files[d] = set(f for f in os.listdir(d) if f.endswith(".html"))

broken_links = []
lang_switch_map = {}
lang_switch_issues = []

def resolve(base_dir, href):
    path = href.split("#")[0].split("?")[0]
    if path == "":
        return None
    if path.startswith("http") or path.startswith("mailto:") or path.startswith("tel:"):
        return "EXTERNAL"
    return os.path.normpath(os.path.join(base_dir, unquote(path)))

for lang in LANG_DIRS:
    for fname in sorted(all_files[lang]):
        fpath = os.path.join(lang, fname)
        content = open(fpath, encoding="utf-8").read()
        soup = BeautifulSoup(content, "lxml")
        for a in soup.find_all("a", href=True):
            href = a["href"].strip()
            if not href or href == "#" or href.startswith("javascript:"):
                continue
            target = resolve(lang, href)
            if target in (None, "EXTERNAL"):
                continue
            if not os.path.exists(target):
                broken_links.append((fpath, href, target))
        langdd = soup.find(class_="lang-dd")
        entry = {}
        if langdd:
            for a in langdd.find_all("a"):
                txt = a.get_text(strip=True)
                href = a.get("href", "")
                code = "lv" if txt.startswith("LV") else "ru" if txt.startswith("RU") else "en" if txt.startswith("EN") else None
                if code: entry[code] = href
        else:
            lang_switch_issues.append((fpath, "NO lang-dd FOUND"))
        lang_switch_map[fpath] = entry

for fpath, entry in lang_switch_map.items():
    lang = fpath.split(os.sep)[0]
    fname = os.path.basename(fpath)
    for other in LANG_DIRS:
        if other == lang: continue
        href = entry.get(other)
        if href is None:
            lang_switch_issues.append((fpath, f"missing {other} link"))
            continue
        target = resolve(lang, href)
        if target in (None, "EXTERNAL"):
            lang_switch_issues.append((fpath, f"{other} link malformed: {href}"))
            continue
        if not os.path.exists(target):
            lang_switch_issues.append((fpath, f"{other} link -> missing file: {href}"))
        tgt_base = os.path.basename(target)
        if tgt_base == "index.html" and fname != "index.html":
            lang_switch_issues.append((fpath, f"{other} link -> homepage ({href}) instead of equivalent page"))

print("Broken internal links:", len(broken_links))
for b in broken_links: print(" ", b)
print()
print("Lang switch issues:", len(lang_switch_issues))
for i in lang_switch_issues: print(" ", i)
