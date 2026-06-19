import os, re, json, sys

ROOT = "."
lv_to_ru = json.load(open('/tmp/lv_to_ru.json'))
lv_to_en = json.load(open('/tmp/lv_to_en.json'))
ru_to_lv = json.load(open('/tmp/ru_to_lv.json'))
ru_to_en = json.load(open('/tmp/ru_to_en.json'))
en_to_lv = json.load(open('/tmp/en_to_lv.json'))
en_to_ru = json.load(open('/tmp/en_to_ru.json'))

SKIP = {('lv','chart-preview.html'), ('lv','registracija.html')}

DRY_RUN = ("--apply" not in sys.argv)

def fix_lang_dd(content, fname, targets):
    """targets: dict lang_code -> new_href (only for the 2 non-self languages)"""
    idx = content.find('lang-dd')
    if idx == -1:
        return content, "NO lang-dd block found"
    end = content.find('</li>', idx)
    if end == -1:
        return content, "lang-dd: no closing </li> found"
    chunk = content[idx:end]
    orig_chunk = chunk
    notes = []
    for code, new_href in targets.items():
        # find <a ...>CODE  (allow attrs in any order, text starts with code)
        pattern = re.compile(r'(<a\s+[^>]*?>)\s*(' + code + r')\b')
        m = pattern.search(chunk)
        if not m:
            notes.append(f"{code} anchor not found in lang-dd")
            continue
        tag = m.group(1)
        href_m = re.search(r'href="([^"]*)"', tag)
        if not href_m:
            notes.append(f"{code} anchor has no href attr")
            continue
        old_href = href_m.group(1)
        if old_href == new_href:
            continue
        new_tag = tag[:href_m.start(1)] + new_href + tag[href_m.end(1):]
        chunk = chunk[:m.start(1)] + new_tag + chunk[m.start(1)+len(tag):]
    if chunk != orig_chunk:
        content = content[:idx] + chunk + content[end:]
    return content, "; ".join(notes) if notes else None

def fix_footer_lang(content, fname, self_code, targets_all):
    """targets_all: dict lang_code -> new_href, for ALL 3 codes (self gets '#')"""
    idx = content.find('class="footer-lang"')
    if idx == -1:
        return content, "NO footer-lang block found"
    end = content.find('</div>', idx)
    if end == -1:
        return content, "footer-lang: no closing </div> found"
    chunk = content[idx:end]
    orig_chunk = chunk
    notes = []
    found_codes = set()
    for code in ('LV', 'RU', 'EN'):
        pattern = re.compile(r'(<a\s+[^>]*?>)\s*(' + code + r')\b')
        m = pattern.search(chunk)
        if not m:
            notes.append(f"{code} anchor not found in footer-lang")
            continue
        found_codes.add(code)
        tag = m.group(1)
        href_m = re.search(r'href="([^"]*)"', tag)
        if not href_m:
            notes.append(f"{code} anchor has no href attr")
            continue
        old_href = href_m.group(1)
        new_href = '#' if code == self_code else targets_all[code]
        if old_href == new_href:
            continue
        new_tag = tag[:href_m.start(1)] + new_href + tag[href_m.end(1):]
        chunk = chunk[:m.start(1)] + new_tag + chunk[m.start(1)+len(tag):]
    if chunk != orig_chunk:
        content = content[:idx] + chunk + content[end:]
    return content, "; ".join(notes) if notes else None

report = []
changed_files = 0

for lang in ['lv', 'ru', 'en']:
    for fname in sorted(os.listdir(lang)):
        if not fname.endswith('.html'):
            continue
        if (lang, fname) in SKIP:
            continue
        if lang == 'lv':
            if fname not in lv_to_ru:
                continue
            header_targets = {'RU': f"../ru/{lv_to_ru[fname]}", 'EN': f"../en/{lv_to_en[fname]}"}
            footer_targets = {'LV': '#', 'RU': f"../ru/{lv_to_ru[fname]}", 'EN': f"../en/{lv_to_en[fname]}"}
            self_code = 'LV'
        elif lang == 'ru':
            if fname not in ru_to_lv:
                continue
            header_targets = {'LV': f"../lv/{ru_to_lv[fname]}", 'EN': f"../en/{ru_to_en[fname]}"}
            footer_targets = {'LV': f"../lv/{ru_to_lv[fname]}", 'RU': '#', 'EN': f"../en/{ru_to_en[fname]}"}
            self_code = 'RU'
        else:
            if fname not in en_to_lv:
                continue
            header_targets = {'LV': f"../lv/{en_to_lv[fname]}", 'RU': f"../ru/{en_to_ru[fname]}"}
            footer_targets = {'LV': f"../lv/{en_to_lv[fname]}", 'RU': f"../ru/{en_to_ru[fname]}", 'EN': '#'}
            self_code = 'EN'

        fpath = os.path.join(lang, fname)
        content = open(fpath, encoding='utf-8').read()
        orig = content

        content, note1 = fix_lang_dd(content, fname, header_targets)
        content, note2 = fix_footer_lang(content, fname, self_code, footer_targets)

        notes = [n for n in (note1, note2) if n]
        if content != orig:
            changed_files += 1
            if not DRY_RUN:
                with open(fpath, 'w', encoding='utf-8') as f:
                    f.write(content)
        if notes or content != orig:
            report.append((fpath, 'CHANGED' if content != orig else 'no-op', notes))

print(f"Mode: {'DRY RUN' if DRY_RUN else 'APPLIED'}")
print(f"Files changed: {changed_files}")
print()
for fpath, status, notes in report:
    if notes:
        print(fpath, status, notes)

print()
print("Files with issues (notes) count:", sum(1 for r in report if r[2]))
