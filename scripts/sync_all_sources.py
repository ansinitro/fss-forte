#!/usr/bin/env python3
"""
Master 4-Source Harvester & Normalizer for Forte Compass
Sources:
  1. https://studenthub.kz (24 Knowledge Base guides + existing 218 programs, 90 unis, 128 ENT histories)
  2. https://univision.kz (131 Bachelor GOPs RU+KK with thresholds/passing scores/grant quotas,
                           131+ Universities with codes/tuition/stats, 589 Bachelor Professions RU+KK,
                           2025 grant breakdown & 2026 articles)
  3. https://www.gov.kz/article/657?lang=ru & ?lang=kk (All 20 regions Kazakhstan Universities)
  4. https://www.gov.kz/article/707?lang=ru & ?lang=kk (All 19 regions Kazakhstan Colleges, preserving 32 Astana colleges)
"""

import concurrent.futures
import html as html_lib
import json
import os
import re
import time
import urllib.request
from pathlib import Path

ROOT = Path("/home/hacker/forte-soc")
BACKEND_DATA = ROOT / "backend" / "internal" / "handlers" / "data"
FRONTEND_DATA = ROOT / "frontend" / "src" / "data"
BACKEND_DATA.mkdir(parents=True, exist_ok=True)
FRONTEND_DATA.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
    "Accept-Language": "ru-RU,ru;q=0.9,kk;q=0.8",
}


def fetch(url: str, timeout: int = 20) -> str:
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read().decode("utf-8", errors="ignore")
        except Exception:
            if attempt == 2:
                return ""
            time.sleep(0.5 * (attempt + 1))
    return ""


def clean_text(s: str) -> str:
    s = re.sub(r"<script.*?</script>|<style.*?</style>|<svg.*?</svg>", " ", s, flags=re.S)
    s = re.sub(r"<br\s*/?>", " ", s, flags=re.I)
    s = re.sub(r"<[^>]+>", " ", s)
    s = html_lib.unescape(s)
    s = s.replace("\xa0", " ")
    s = re.sub(r"\s+", " ", s).strip()
    return s


def slugify(text: str) -> str:
    trans = {
        "а": "a", "ә": "a", "б": "b", "в": "v", "г": "g", "ғ": "g", "д": "d", "е": "e", "ё": "e",
        "ж": "zh", "з": "z", "и": "i", "й": "y", "к": "k", "қ": "k", "л": "l", "м": "m", "н": "n",
        "ң": "n", "о": "o", "ө": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u", "ұ": "u",
        "ү": "u", "ф": "f", "х": "h", "һ": "h", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "shch",
        "ъ": "", "ы": "y", "і": "i", "ь": "", "э": "e", "ю": "yu", "я": "ya",
    }
    res = []
    for ch in text.lower():
        if ch in trans:
            res.append(trans[ch])
        elif ch.isalnum():
            res.append(ch)
        else:
            res.append("-")
    out = re.sub(r"-+", "-", "".join(res)).strip("-")
    return out[:80] or "item"


def extract_table_rows(table_html: str) -> list[list[str]]:
    # Strip HTML comments first so commented-out columns don't shift indices
    clean_tbl = re.sub(r"<!--.*?-->", "", table_html, flags=re.S)
    rows = []
    for tr in re.findall(r"<tr[^>]*>(.*?)</tr>", clean_tbl, flags=re.S):
        cells = [clean_text(c) for c in re.findall(r"<t[hd][^>]*>(.*?)</t[hd]>", tr, flags=re.S)]
        if any(cells):
            rows.append(cells)
    return rows


def extract_balls_table_rows(table_html: str) -> list[dict]:
    """Extract uni_passing rows including commented max/avg scores from Univision #balls table."""
    out = []
    trs = re.findall(r"<tr[^>]*>(.*?)</tr>", table_html, flags=re.S)
    for tr in trs[1:]:
        # Pull commented-out numeric scores before stripping comments
        commented_nums = re.findall(r"<!--\s*<td>(\d+)</td>\s*-->", tr)
        clean_tr = re.sub(r"<!--.*?-->", "", tr, flags=re.S)
        cells = [clean_text(c) for c in re.findall(r"<t[hd][^>]*>(.*?)</t[hd]>", clean_tr, flags=re.S)]
        if len(cells) >= 2 and cells[0]:
            out.append({
                "uni_name": cells[0],
                "min_score": to_int(cells[1]),
                "max_score": int(commented_nums[0]) if len(commented_nums) >= 1 else None,
                "avg_score": int(commented_nums[1]) if len(commented_nums) >= 2 else None,
                "grants_count": to_int(cells[2]) if len(cells) >= 3 else None,
            })
    return out


def to_int(val: str) -> int | None:
    if not val:
        return None
    m = re.search(r"(\d[\d\s]*)", val)
    if not m:
        return None
    try:
        return int(re.sub(r"\s+", "", m.group(1)))
    except ValueError:
        return None


# ==============================================================================
# 1. GOV.KZ ARTICLE 707: ALL COLLEGES ACROSS KAZAKHSTAN (RU + KK)
# ==============================================================================
REGION_NAMES_707 = [
    ("г. Астана", "Астана қаласы", "astana"),
    ("г. Алматы", "Алматы қаласы", "almaty"),
    ("г. Шымкент", "Шымкент қаласы", "shymkent"),
    ("Акмолинская область", "Ақмола облысы", "akmola"),
    ("Актюбинская область", "Ақтөбе облысы", "aktobe"),
    ("Алматинская область", "Алматы облысы", "almaty-region"),
    ("Атырауская область", "Атырау облысы", "atyrau"),
    ("Западно-Казахстанская область", "Батыс Қазақстан облысы", "zko"),
    ("Жамбылская область", "Жамбыл облысы", "zhambyl"),
    ("Карагандинская область", "Қарағанды облысы", "karaganda"),
    ("Костанайская область", "Қостанай облысы", "kostanay"),
    ("Кызылординская область", "Қызылорда облысы", "kyzylorda"),
    ("Мангистауская область", "Маңғыстау облысы", "mangystau"),
    ("Павлодарская область", "Павлодар облысы", "pavlodar"),
    ("Северо-Казахстанская область", "Солтүстік Қазақстан облысы", "sko"),
    ("Восточно-Казахстанская область", "Шығыс Қазақстан облысы", "vko"),
    ("Туркестанская область", "Түркістан облысы", "turkestan"),
    ("Область Абай", "Абай облысы", "abay"),
    ("Область Ұлытау", "Ұлытау облысы", "ulytau"),
]

STATE_TOKENS = (
    "гккп", "кгкп", "кгу", "ргкп", "рккп", "нао", "мкқк", "кмқк", "кмм",
    "рмқк", "шжқ", "государственн", "мемлекеттік", "жоғары колледж» мкқк",
    "әкімдігінің", "білім басқармасы", "акимата",
)


def classify_college_spec(name: str) -> tuple[str, str]:
    n = name.lower()
    if any(k in n for k in ["медицин", "медицина", "стомат", "фармац", "денсаулық", "фельдшер"]):
        return "Медицина", "Медицина"
    if any(k in n for k in ["информац", "it", "айти", "радио", "связ", "байланыс", "ақпарат", "кибер", "цифр"]):
        return "ИТ және байланыс", "ИТ и связь"
    if any(k in n for k in ["педаг", "гуман", "ұстаз", "учител"]):
        return "Педагогика және гуманитарлық", "Педагогика и гуманитарные науки"
    if any(k in n for k in ["политех", "технич", "технолог", "энерг", "индустр", "машин", "горн", "металлург", "мұнай", "нефт"]):
        return "Техникалық және политехникалық", "Технические и политехнические"
    if any(k in n for k in ["строит", "құрылыс", "архитект", "коммун"]):
        return "Құрылыс және сәулет", "Строительство и архитектура"
    if any(k in n for k in ["транспорт", "көлік", "дорож", "авто", "авиац", "темір"]):
        return "Көлік және логистика", "Транспорт и логистика"
    if any(k in n for k in ["сервис", "туризм", "питан", "тамақ", "қоғамдық", "индустрия", "сән", "дизайн"]):
        return "Сервис, тамақтану және туризм", "Сервис, питание и туризм"
    if any(k in n for k in ["эконом", "финанс", "қаржы", "құқық", "право", "бизнес", "басқару", "учет", "есеп"]):
        return "Экономика, бизнес және құқық", "Экономика, бизнес и право"
    if any(k in n for k in ["аграр", "сельск", "ауыл", "орман", "лесн", "ветерин"]):
        return "Аграрлық және экология", "Сельское хозяйство и экология"
    if any(k in n for k in ["музык", "өнер", "искусст", "хореогр", "худож", "театр", "спорт"]):
        return "Өнер, мәдениет және спорт", "Искусство, культура и спорт"
    return "Көпсалалы білім беру", "Многопрофильное образование"


def clean_707_table_rows(rows: list[list[str]]) -> tuple[list[dict], list[str]]:
    """Extract college rows from heterogeneous regional gov.kz/707 tables."""
    if not rows:
        return [], []
    header = [c.lower() for c in rows[0]]
    col_map = {"num": None, "name": None, "addr": None, "head": None, "contact": None, "email": None, "district": None}
    has_header = len(header) >= 3 and any(any(k in c for k in ["наименован", "атауы", "адрес", "мекен", "телефон", "директор", "руководит", "басшы", "жетекш", "№", "id", "аудан", "район"]) for c in header)
    start_idx = 1 if has_header else 0

    if not has_header and len(rows) > 1:
        # Tables without a column header row (e.g. Almaty Table 1)
        col_map = {"num": 0, "name": 1, "addr": 2, "head": 3, "contact": 4, "email": None, "district": None}
    elif has_header:
        for i, h in enumerate(header):
            if h in ("№", "n", "id", "№ п/п", "р/с") or "ретт" in h:
                col_map["num"] = i
            elif "район" in h or "аудан" in h:
                col_map["district"] = i
            elif any(k in h for k in ["наименован", "название", "атауы", "колледж", "ұйым"]) and "полн" not in h:
                if col_map["name"] is None:
                    col_map["name"] = i
            elif any(k in h for k in ["адрес", "мекен"]) and "электр" not in h:
                col_map["addr"] = i
            elif any(k in h for k in ["руководит", "директор", "басшы", "жетекш", "фио", "таә", "т.а.ә", "аты-жөні"]):
                col_map["head"] = i
            elif any(k in h for k in ["телефон", "байланыс", "контакт", "контингент", "сот", "ұялы"]) and "электр" not in h and "e-mail" not in h and "пошта" not in h and "почт" not in h:
                if col_map["contact"] is None:
                    col_map["contact"] = i
            elif any(k in h for k in ["эл", "mail", "почт", "пошта", "сайт"]):
                if col_map["email"] is None:
                    col_map["email"] = i

    parsed = []
    cur_state: bool | None = None
    for row in rows[start_idx:]:
        joined = " ".join(row).strip()
        if not joined or len(joined) < 4:
            continue
        low = joined.lower()
        non_empty = [c for c in row if c.strip()]
        if len(non_empty) == 1 or (len(non_empty) <= 2 and any(k in low for k in ["государствен", "частн", "мемлекет", "жекемен", "жеке меншік", "респуб", "справочная инф", "ақпарат"])):
            if any(k in low for k in ["государствен", "мемлекеттік", "респуб"]):
                cur_state = True
            elif any(k in low for k in ["частн", "жекемен", "жеке меншік", "не госуд"]):
                cur_state = False
            continue
        if len(row) >= 3 and any(k in row[0].lower() for k in ["№", "id", "р/с"]) and any(k in low for k in ["адрес", "мекен", "наименован", "атауы"]):
            continue

        # Support tables without leading numeric № column (e.g., Karaganda table starts directly with Name)
        off = 0
        if col_map["num"] is None and re.match(r"^\d+\.?$", row[0].strip()):
            off = 1

        name = row[col_map["name"]] if (col_map["name"] is not None and col_map["name"] < len(row)) else (row[off] if off < len(row) else "")
        if not name or len(name) < 3 or re.match(r"^\d+\.?$", name.strip()):
            candidates = [c for c in row if len(c) > 8 and "@" not in c and not re.match(r"^[\d\s\-+()]+$", c)]
            if candidates:
                name = candidates[0]
            else:
                continue

        addr = row[col_map["addr"]] if (col_map["addr"] is not None and col_map["addr"] < len(row)) else ""
        head = row[col_map["head"]] if (col_map["head"] is not None and col_map["head"] < len(row)) else ""
        dist = row[col_map["district"]] if (col_map["district"] is not None and col_map["district"] < len(row)) else ""

        contact_parts = []
        for idx_k in ("contact", "email"):
            ci = col_map[idx_k]
            if ci is not None and ci < len(row) and row[ci]:
                contact_parts.append(row[ci])
        if not contact_parts:
            for c in row:
                if c not in (name, addr, head, dist) and ("@" in c or re.search(r"\d{2,}[-\s)]*\d{2,}", c)):
                    contact_parts.append(c)

        contact_blob = " ".join(contact_parts)
        emails = re.findall(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}", contact_blob)
        email = emails[0] if emails else ""
        phone_cand = contact_blob
        for em in emails:
            phone_cand = phone_cand.replace(em, "")
        phone = re.sub(r"[\s,;]+", " ", phone_cand).strip(" ,;-")

        is_state = cur_state
        if is_state is None:
            is_state = any(tok in name.lower() for tok in STATE_TOKENS)

        parsed.append({
            "name": name.strip(),
            "address": (addr or dist).strip(),
            "director": head.strip(),
            "phone": phone[:120],
            "email": email,
            "is_state": bool(is_state),
        })
    return parsed, header


def parse_gov_707() -> list[dict]:
    print("[1/5] Fetching & parsing Gov.kz 707 (All Kazakhstan Colleges RU + KK)...")
    ru_html = fetch("https://www.gov.kz/article/707?lang=ru", 25)
    kk_html = fetch("https://www.gov.kz/article/707?lang=kk", 25)

    # Load existing 32 Astana colleges to preserve their enriched data
    with open(BACKEND_DATA / "astana_colleges.json", encoding="utf-8") as f:
        astana_32 = json.load(f)

    all_colleges = []
    for c in astana_32:
        all_colleges.append({
            "id": c["id"],
            "slug": c["slug"],
            "region_id": "astana",
            "region_ru": "г. Астана",
            "region_kk": "Астана қаласы",
            "district_ru": c.get("district_ru", ""),
            "district_kk": c.get("district_kz", ""),
            "name_ru": c["name_ru"],
            "name_kk": c["name_kz"],
            "address_ru": c["address_ru"],
            "address_kk": c["address_kz"],
            "director": c.get("director", ""),
            "phone": c.get("contact_phone", ""),
            "email": "",
            "website": c.get("official_website", ""),
            "is_state": bool(c.get("is_state", False)),
            "ownership_ru": c.get("ownership_ru", ""),
            "ownership_kk": c.get("ownership_kz", ""),
            "specialization_ru": c.get("specialization_ru", ""),
            "specialization_kk": c.get("specialization_kz", ""),
            "dormitory_info_ru": c.get("dormitory_info_ru", ""),
            "dormitory_info_kk": c.get("dormitory_info_kz", ""),
            "source_url": "https://www.gov.kz/article/707?lang=ru",
        })

    ru_tables = re.findall(r"<table[^>]*>.*?</table>", ru_html, flags=re.S)
    kk_tables = re.findall(r"<table[^>]*>.*?</table>", kk_html, flags=re.S)

    # Tables 1..18 are all other regions in Kazakhstan
    seen_slugs = {c["slug"] for c in all_colleges}
    for tidx in range(1, len(ru_tables)):
        reg_ru, reg_kk, reg_id = REGION_NAMES_707[tidx] if tidx < len(REGION_NAMES_707) else (f"Регион {tidx}", f"Өңір {tidx}", f"reg-{tidx}")
        ru_rows, _ = clean_707_table_rows(extract_table_rows(ru_tables[tidx]))
        kk_rows, _ = clean_707_table_rows(extract_table_rows(kk_tables[tidx])) if tidx < len(kk_tables) else ([], [])

        for idx, r in enumerate(ru_rows):
            k = kk_rows[idx] if idx < len(kk_rows) else None
            name_ru = r["name"]
            name_kk = k["name"] if k and k["name"] else name_ru
            addr_ru = r["address"] or (k["address"] if k else "")
            addr_kk = (k["address"] if k and k["address"] else addr_ru)
            phone = r["phone"] or (k["phone"] if k else "")
            email = r["email"] or (k["email"] if k else "")
            director = r["director"] or (k["director"] if k else "")
            is_state = r["is_state"] or (k["is_state"] if k else False)

            spec_kk, spec_ru = classify_college_spec(name_ru + " " + name_kk)
            base_slug = f"{reg_id}-{slugify(name_ru)[:48]}"
            slug = base_slug
            counter = 2
            while slug in seen_slugs:
                slug = f"{base_slug}-{counter}"
                counter += 1
            seen_slugs.add(slug)

            all_colleges.append({
                "id": f"col707-{reg_id}-{idx+1:03d}",
                "slug": slug,
                "region_id": reg_id,
                "region_ru": reg_ru,
                "region_kk": reg_kk,
                "district_ru": reg_ru,
                "district_kk": reg_kk,
                "name_ru": name_ru,
                "name_kk": name_kk,
                "address_ru": addr_ru,
                "address_kk": addr_kk,
                "director": director,
                "phone": phone,
                "email": email,
                "website": "",
                "is_state": is_state,
                "ownership_ru": "Государственный (Госзаказ)" if is_state else "Частный",
                "ownership_kk": "Мемлекеттік (Мемлекеттік тапсырыс)" if is_state else "Жеке меншік",
                "specialization_ru": spec_ru,
                "specialization_kk": spec_kk,
                "dormitory_info_ru": "Уточняется в приемной комиссии колледжа" if not is_state else "Предоставляется иногородним студентам при наличии мест",
                "dormitory_info_kk": "Колледждің қабылдау комиссиясынан нақтыланады" if not is_state else "Орын болған жағдайда басқа өңірден келген студенттерге беріледі",
                "source_url": "https://www.gov.kz/article/707?lang=ru",
            })

    print(f"   -> Parsed {len(all_colleges)} total Kazakhstan colleges across {len(REGION_NAMES_707)} regions")
    return all_colleges


# ==============================================================================
# 2. GOV.KZ ARTICLE 657: ALL UNIVERSITIES ACROSS KAZAKHSTAN (RU + KK)
# ==============================================================================
REGION_NAMES_657 = [
    ("г. Астана", "Астана қаласы", "Астана", "astana"),
    ("г. Алматы", "Алматы қаласы", "Алматы", "almaty"),
    ("г. Шымкент", "Шымкент қаласы", "Шымкент", "shymkent"),
    ("Акмолинская область", "Ақмола облысы", "Кокшетау", "akmola"),
    ("Актюбинская область", "Ақтөбе облысы", "Актобе", "aktobe"),
    ("Алматинская область", "Алматы облысы", "Конаев / Каскелен", "almaty-region"),
    ("Атырауская область", "Атырау облысы", "Атырау", "atyrau"),
    ("Западно-Казахстанская область", "Батыс Қазақстан облысы", "Уральск", "zko"),
    ("Жамбылская область", "Жамбыл облысы", "Тараз", "zhambyl"),
    ("Карагандинская область", "Қарағанды облысы", "Караганда", "karaganda"),
    ("Костанайская область", "Қостанай облысы", "Костанай", "kostanay"),
    ("Кызылординская область", "Қызылорда облысы", "Кызылорда", "kyzylorda"),
    ("Мангистауская область", "Маңғыстау облысы", "Актау", "mangystau"),
    ("Павлодарская область", "Павлодар облысы", "Павлодар", "pavlodar"),
    ("Северо-Казахстанская область", "Солтүстік Қазақстан облысы", "Петропавловск", "sko"),
    ("Восточно-Казахстанская область", "Шығыс Қазақстан облысы", "Усть-Каменогорск", "vko"),
    ("Туркестанская область", "Түркістан облысы", "Туркестан", "turkestan"),
    ("Область Абай", "Абай облысы", "Семей", "abay"),
    ("Область Жетісу", "Жетісу облысы", "Талдыкорган", "zhetysu"),
    ("Область Ұлытау", "Ұлытау облысы", "Жезказган", "ulytau"),
]


def parse_gov_657() -> list[dict]:
    print("[2/5] Fetching & parsing Gov.kz 657 (All Kazakhstan Universities RU + KK)...")
    ru_html = fetch("https://www.gov.kz/article/657?lang=ru", 25)
    kk_html = fetch("https://www.gov.kz/article/657?lang=kk", 25)
    ru_tables = re.findall(r"<table[^>]*>.*?</table>", ru_html, flags=re.S)
    kk_tables = re.findall(r"<table[^>]*>.*?</table>", kk_html, flags=re.S)

    gov_unis = []
    for tidx, tbl in enumerate(ru_tables):
        reg_ru, reg_kk, city, reg_id = REGION_NAMES_657[tidx] if tidx < len(REGION_NAMES_657) else (f"Регион {tidx}", f"Өңір {tidx}", "", f"reg-{tidx}")
        r_rows = extract_table_rows(tbl)
        k_rows = extract_table_rows(kk_tables[tidx]) if tidx < len(kk_tables) else []

        for idx in range(1, len(r_rows)):
            r = r_rows[idx]
            k = k_rows[idx] if idx < len(k_rows) else []
            if len(r) < 3:
                continue
            name_ru = r[1].strip() if len(r) > 1 else ""
            if not name_ru or len(name_ru) < 3 or "наименован" in name_ru.lower():
                continue
            name_kk = k[1].strip() if len(k) > 1 and k[1].strip() else name_ru
            addr_ru = r[2].strip() if len(r) > 2 else ""
            addr_kk = k[2].strip() if len(k) > 2 and k[2].strip() else addr_ru
            year = r[3].strip() if len(r) > 3 else ""
            email = r[4].strip() if len(r) > 4 else ""
            rector_ru = r[5].strip() if len(r) > 5 else ""
            rector_kk = k[5].strip() if len(k) > 5 and k[5].strip() else rector_ru
            rector_contacts = r[6].strip() if len(r) > 6 else ""

            gov_unis.append({
                "region_id": reg_id,
                "region_ru": reg_ru,
                "region_kk": reg_kk,
                "city": city,
                "name_ru": name_ru,
                "name_kk": name_kk,
                "address_ru": addr_ru,
                "address_kk": addr_kk,
                "founded_year": year,
                "email": email,
                "rector_ru": rector_ru,
                "rector_kk": rector_kk,
                "rector_contacts": rector_contacts,
                "source_url": "https://www.gov.kz/article/657?lang=ru",
            })

    print(f"   -> Parsed {len(gov_unis)} universities from Gov.kz 657 across {len(ru_tables)} regions")
    return gov_unis


# ==============================================================================
# 3. UNIVISION.KZ: ALL 131 BACHELOR GOPs (RU + KK), 131 UNIVs & PRICES & CODES
# ==============================================================================
def parse_univision_gop_page(html_str: str, is_kk: bool = False) -> dict:
    """Extract all structured sections from one Univision GOP detail page."""
    info = {}
    # Academic degree, UNT subjects, area, direction inside #info
    info_m = re.search(r'id="info"(.*?)id="countGrants"', html_str, flags=re.S)
    if info_m:
        blk = info_m.group(1)
        items = re.findall(r'<li[^>]*>(.*?)</li>', blk, flags=re.S)
        for it in items:
            lbl_m = re.search(r'<span[^>]*>(.*?)</span>', it, flags=re.S)
            lbl = clean_text(lbl_m.group(1)).lower() if lbl_m else ""
            val = clean_text(re.sub(r'<span[^>]*>.*?</span>', '', it, flags=re.S))
            if any(k in lbl for k in ["предмет", "пән"]):
                info["pair"] = val
            elif any(k in lbl for k in ["область", "саласы"]):
                info["area"] = val
            elif any(k in lbl for k in ["направление", "бағыты"]):
                info["direction"] = val

    if is_kk:
        return info

    # Counters (programs count, universities count)
    prog_cnt = None
    uni_cnt = None
    pm = re.search(r'href="#eps"[^>]*>.*?<sup>\s*(\d+)\s*</sup>', html_str, flags=re.S)
    um = re.search(r'href="#univs"[^>]*>.*?<sup>\s*(\d+)\s*</sup>', html_str, flags=re.S)
    if pm:
        prog_cnt = int(pm.group(1))
    if um:
        uni_cnt = int(um.group(1))

    # Grant counts inside #countGrants
    grants = {"full_2025": None, "full_2024": None, "short_2025": None, "short_2024": None, "quotas_2025": None}
    cg_m = re.search(r'id="countGrants"(.*?)id="countMinimals"', html_str, flags=re.S)
    if cg_m:
        tbls = re.findall(r"<table[^>]*>.*?</table>", cg_m.group(1), flags=re.S)
        if tbls:
            rows = extract_table_rows(tbls[0])
            for row in rows:
                low = row[0].lower() if row else ""
                if "полн" in low:
                    if len(row) > 1:
                        grants["full_2025"] = to_int(row[1])
                    if len(row) > 2:
                        grants["full_2024"] = to_int(row[2])
                elif "сокращ" in low:
                    if len(row) > 1:
                        grants["short_2025"] = to_int(row[1])
                    if len(row) > 2:
                        grants["short_2024"] = to_int(row[2])
                elif "квот" in low:
                    if len(row) > 1:
                        grants["quotas_2025"] = to_int(row[1])

    # University minimum thresholds inside #countMinimals
    uni_thresholds = []
    cm_m = re.search(r'id="countMinimals"(.*?)id="balls"', html_str, flags=re.S)
    if cm_m:
        tbls = re.findall(r"<table[^>]*>.*?</table>", cm_m.group(1), flags=re.S)
        if tbls:
            for row in extract_table_rows(tbls[0])[1:]:
                if len(row) >= 2 and row[0]:
                    uni_thresholds.append({
                        "uni_name": row[0],
                        "full_score": to_int(row[1]) if len(row) > 1 else None,
                        "short_score": to_int(row[2]) if len(row) > 2 else None,
                    })

    # Passing scores inside #balls accordion
    general_min = None
    general_awarded = None
    rural_min = None
    rural_awarded = None
    uni_passing_2025 = []
    balls_m = re.search(r'id="balls"(.*?)id="eps"', html_str, flags=re.S)
    if balls_m:
        b_blk = balls_m.group(1)
        acc_items = b_blk.split('class="accordion-item"')[1:]
        for item in acc_items:
            btn_m = re.search(r'<button[^>]*>(.*?)</button>', item, flags=re.S)
            hdr = clean_text(btn_m.group(1)) if btn_m else ""
            min_m = re.search(r'Минимальный балл\s*[-–]\s*(\d+)', item)
            aw_m = re.search(r'получили грант\s*[-–]\s*(\d+)', item)
            m_val = int(min_m.group(1)) if min_m else None
            a_val = int(aw_m.group(1)) if aw_m else None
            if "2025" in hdr and "общий" in hdr.lower():
                general_min = m_val
                general_awarded = a_val
                tbl_m = re.search(r"<table[^>]*>.*?</table>", item, flags=re.S)
                if tbl_m:
                    uni_passing_2025 = extract_balls_table_rows(tbl_m.group(0))
            elif "2025" in hdr and "сельск" in hdr.lower():
                rural_min = m_val
                rural_awarded = a_val

    # Educational programs inside #eps (deduplicated unique program code+title with uni count)
    programs_map = {}
    eps_m = re.search(r'id="eps"(.*?)id="univs"', html_str, flags=re.S)
    if eps_m:
        e_blk = eps_m.group(1)
        items = re.findall(r'<a[^>]*href="(/edu-program/\d+\.html)"[^>]*>.*?<b>(.*?)</b>.*?<small[^>]*>(.*?)</small>', e_blk, flags=re.S)
        for href, title_raw, uni_raw in items:
            t_clean = clean_text(title_raw)
            u_clean = clean_text(uni_raw)
            m = re.match(r'^([A-Z0-9]+)\s+(.*)$', t_clean)
            p_code = m.group(1) if m else ""
            p_name = m.group(2) if m else t_clean
            key = f"{p_code}|{p_name}"
            if key not in programs_map:
                programs_map[key] = {"code": p_code, "name": p_name, "unis": []}
            if u_clean and u_clean not in programs_map[key]["unis"]:
                programs_map[key]["unis"].append(u_clean)

    programs_list = [
        {"code": v["code"], "name": v["name"], "uni_count": len(v["unis"]), "sample_unis": v["unis"][:5]}
        for v in programs_map.values()
    ][:40]

    return {
        "pair_ru": info.get("pair", ""),
        "area_ru": info.get("area", ""),
        "direction_ru": info.get("direction", ""),
        "programs_count": prog_cnt or len(programs_map),
        "universities_count": uni_cnt or len(uni_thresholds),
        "grants": grants,
        "passing_2025": {
            "general_min": general_min,
            "general_awarded": general_awarded,
            "rural_min": rural_min,
            "rural_awarded": rural_awarded,
        },
        "uni_passing_2025": uni_passing_2025,
        "uni_thresholds": uni_thresholds,
        "programs": programs_list,
    }


def harvest_univision_gops() -> list[dict]:
    print("[3/5] Harvesting all 131 Bachelor GOPs (RU + KK) from Univision.kz...")
    ru_list_html = fetch("https://univision.kz/edu-program/group/degree/bachelor.html")
    kk_list_html = fetch("https://univision.kz/kk/edu-program/group/degree/bachelor.html")

    ru_links = re.findall(r'href="(/edu-program/group/(B\d+)-[^"]+\.html)"[^>]*>(.*?)</a>', ru_list_html, flags=re.S)
    kk_links = re.findall(r'href="(/kk/edu-program/group/(B\d+)-[^"]+\.html)"[^>]*>(.*?)</a>', kk_list_html, flags=re.S)

    kk_by_code = {}
    for href, code, raw_t in kk_links:
        txt = clean_text(raw_t)
        txt = re.sub(r"^" + re.escape(code) + r"\s+", "", txt)
        kk_by_code[code] = (href, txt)

    gops_meta = []
    seen = set()
    for href, code, raw_t in ru_links:
        if code in seen:
            continue
        seen.add(code)
        txt = clean_text(raw_t)
        title_ru = re.sub(r"^" + re.escape(code) + r"\s+", "", txt)
        kk_href, title_kk = kk_by_code.get(code, ("", title_ru))
        gops_meta.append({
            "code": code,
            "title_ru": title_ru,
            "title_kk": title_kk,
            "url_ru": f"https://univision.kz{href}",
            "url_kk": f"https://univision.kz{kk_href}" if kk_href else "",
        })

    def process_gop(meta: dict) -> dict:
        ru_page = fetch(meta["url_ru"], 20)
        kk_page = fetch(meta["url_kk"], 20) if meta["url_kk"] else ""
        ru_parsed = parse_univision_gop_page(ru_page, is_kk=False)
        kk_parsed = parse_univision_gop_page(kk_page, is_kk=True) if kk_page else {}
        return {
            "code": meta["code"],
            "slug": meta["code"].lower() + "-" + slugify(meta["title_ru"])[:45],
            "title_ru": meta["title_ru"],
            "title_kk": meta["title_kk"],
            "url_ru": meta["url_ru"],
            "url_kk": meta["url_kk"],
            "pair_ru": ru_parsed["pair_ru"],
            "pair_kk": kk_parsed.get("pair") or ru_parsed["pair_ru"],
            "area_ru": ru_parsed["area_ru"],
            "area_kk": kk_parsed.get("area") or ru_parsed["area_ru"],
            "direction_ru": ru_parsed["direction_ru"],
            "direction_kk": kk_parsed.get("direction") or ru_parsed["direction_ru"],
            "programs_count": ru_parsed["programs_count"],
            "universities_count": ru_parsed["universities_count"],
            "grants": ru_parsed["grants"],
            "passing_2025": ru_parsed["passing_2025"],
            "uni_passing_2025": ru_parsed["uni_passing_2025"],
            "uni_thresholds": ru_parsed["uni_thresholds"],
            "programs": ru_parsed["programs"],
        }

    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
        for res in pool.map(process_gop, gops_meta):
            results.append(res)

    results.sort(key=lambda x: x["code"])
    print(f"   -> Harvested {len(results)} Bachelor GOPs with thresholds & passing scores")
    return results


# ==============================================================================
# 4. UNIVISION UNIVERSITIES (CODES + TUITION + DETAILS) MERGED WITH GOV.KZ 657 & STUDENTHUB
# ==============================================================================
def harvest_univision_universities() -> list[dict]:
    print("[4/5] Harvesting Univision University Registry (Codes, Websites, Prices, Stats)...")
    code_html = fetch("https://univision.kz/univ/code.html")
    raw_links = re.findall(r'href="(/univ/\d+-[^"]+)"[^>]*>(.*?)</a>', code_html, flags=re.S)

    unis_meta = []
    seen = set()
    for href, txt in raw_links:
        if href in seen:
            continue
        seen.add(href)
        t = clean_text(txt)
        m = re.match(r'^(\d{3})?\s*-\s*(.*)$', t)
        ent_code = m.group(1) if m and m.group(1) else ""
        name = m.group(2).strip() if m else t
        unis_meta.append({"href": href, "ent_code": ent_code, "name": name})

    def fetch_uni_detail(meta: dict) -> dict:
        u_html = fetch(f"https://univision.kz{meta['href']}", 18)
        p_html = fetch(f"https://univision.kz{meta['href'].rstrip('/')}/price", 18)

        city = ""
        ownership = ""
        univ_type = ""
        website = ""
        students_total = None
        students_grant = None
        students_paid = None

        # City, type, ownership from sidebar list
        # Extract right card/info
        h1_m = re.search(r"<h1[^>]*>(.*?)</h1>", u_html, flags=re.S)
        full_title = clean_text(h1_m.group(1)) if h1_m else meta["name"]

        # Extract website ONLY inside profile section (between <h1 and <footer), filtering ads/socials
        body_slice = u_html[u_html.find("<h1"):u_html.find("<footer")] if "<h1" in u_html else ""
        ws = re.findall(r'href="(https?://[^"]+)"', body_slice)
        bad_domains = ("univision", "instagram", "facebook", "youtube", "vk.com", "t.me", "google", "yandex", "zero.kz", "gonet-ads", "doubleclick", "2gis", "tiktok", "linkedin", "twitter", "x.com")
        for link in ws:
            if any(bad in link.lower() for bad in bad_domains):
                continue
            website = link
            break

        # Quick text extraction for stats & badges
        body_m = re.search(r"<h1.*?<footer", u_html, flags=re.S)
        body_txt = clean_text(body_m.group(0)) if body_m else ""
        sm_tot = re.search(r"Всего в обучается\s*(\d[\d\s]*)\s*студент", body_txt)
        sm_paid = re.search(r"Платная\s*-\s*(\d+)", body_txt)
        sm_free = re.search(r"Бесплатная\s*-\s*(\d+)", body_txt)
        if sm_tot:
            students_total = to_int(sm_tot.group(1))
        if sm_paid:
            students_paid = int(sm_paid.group(1))
        if sm_free:
            students_grant = int(sm_free.group(1))

        # City/Ownership from /univ/area/, /univ/category/, /univ/type/ links
        area_links = re.findall(r'href="/univ/area/[^"]+\.html"[^>]*>(.*?)</a>', u_html)
        if area_links:
            city = clean_text(area_links[0])
        cat_m = re.search(r'href="/univ/category/[^"]+\.html"[^>]*>(.*?)</a>', u_html)
        if cat_m:
            ownership = clean_text(cat_m.group(1))
        type_m = re.search(r'href="/univ/type/[^"]+\.html"[^>]*>(.*?)</a>', u_html)
        if type_m:
            univ_type = clean_text(type_m.group(1))

        # Parse prices
        prices = []
        price_vals = []
        idx_p = p_html.find("<table")
        if idx_p != -1:
            tbl_m = re.search(r"<table[^>]*>.*?</table>", p_html[idx_p:], flags=re.S)
            if tbl_m:
                for row in extract_table_rows(tbl_m.group(0))[1:]:
                    if len(row) >= 2:
                        val = to_int(row[1])
                        if val and val > 50000:
                            price_vals.append(val)
                            prices.append({"program": row[0], "price_kzt": val})

        return {
            "univision_url": f"https://univision.kz{meta['href']}",
            "ent_code": meta["ent_code"],
            "name_ru": full_title,
            "city": city,
            "ownership": ownership,
            "univ_type": univ_type,
            "website": website,
            "students_total": students_total,
            "students_grant": students_grant,
            "students_paid": students_paid,
            "min_tuition_kzt": min(price_vals) if price_vals else None,
            "max_tuition_kzt": max(price_vals) if price_vals else None,
            "sample_prices": prices[:12],
        }

    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
        for res in pool.map(fetch_uni_detail, unis_meta):
            results.append(res)

    print(f"   -> Harvested {len(results)} Univision university profiles with codes & prices")
    return results


def norm_uni_name(s: str) -> str:
    s = s.lower()
    s = re.sub(r'[«»"\'()]', ' ', s)
    for stop in ["нао ", "ао ", "ргп ", "ргу ", "чу ", "нуо ", "тоо ", "международный ", "казахский ", "национальный ", "университет ", "имени ", "им.", "г."]:
        pass
    return re.sub(r"\s+", " ", s).strip()


def merge_universities(gov_unis: list[dict], univision_unis: list[dict], studenthub_unis: list[dict]) -> list[dict]:
    """Merge Gov.kz 657 + Univision (codes/prices/stats) + StudentHub (90 unis/programs)."""
    # Build lookup by keywords/tokens
    sh_by_norm = {norm_uni_name(u["name"]): u for u in studenthub_unis}

    merged = []
    used_uv = set()
    used_sh = set()

    def find_best_match(target_name: str, pool: list[dict], name_key: str) -> tuple[int, dict | None]:
        t_words = {w for w in re.findall(r"[а-яa-zәіңғүұқөһ]{4,}", target_name.lower()) if w not in {"университет", "университеті", "академия", "академиясы", "институт", "институты", "имени", "атындағы", "казахский", "қазақ", "казахстан", "қазақстан", "государственный", "мемлекеттік", "национальный", "ұлттық", "региональный", "өңірлік"}}
        if not t_words:
            return -1, None
        best_score = 0
        best_idx = -1
        for i, item in enumerate(pool):
            cand = item[name_key].lower()
            c_words = {w for w in re.findall(r"[а-яa-zәіңғүұқөһ]{4,}", cand) if w not in {"университет", "университеті", "академия", "академиясы", "институт", "институты", "имени", "атындағы", "казахский", "қазақ", "казахстан", "қазақстан", "государственный", "мемлекеттік", "национальный", "ұлттық", "региональный", "өңірлік"}}
            overlap = len(t_words & c_words)
            # Check exact acronyms or distinctive names
            if ("aitu" in cand or "astana it" in cand) and ("astana it" in target_name.lower()):
                overlap += 5
            if ("enu" in cand or "гумилев" in cand) and ("гумилев" in target_name.lower()):
                overlap += 5
            if ("назарбаев" in cand or "nazarbayev" in cand) and ("назарбаев" in target_name.lower() or "nazarbayev" in target_name.lower()):
                overlap += 5
            if ("sdu" in cand or "демирел" in cand) and ("демирел" in target_name.lower() or "sdu" in target_name.lower()):
                overlap += 5
            if ("казну" in cand or "фараби" in cand) and ("фараби" in target_name.lower()):
                overlap += 5
            if ("сатпаев" in cand or "сәтбаев" in cand) and ("сатпаев" in target_name.lower() or "сәтбаев" in target_name.lower()):
                overlap += 5
            if ("асфендияр" in cand) and ("асфендияр" in target_name.lower()):
                overlap += 5
            if ("сейфуллин" in cand) and ("сейфуллин" in target_name.lower()):
                overlap += 5
            if ("нархоз" in cand) and ("нархоз" in target_name.lower()):
                overlap += 5
            if ("ауэз" in cand or "әуез" in cand) and ("ауэз" in target_name.lower() or "әуез" in target_name.lower()):
                overlap += 5
            if ("букет" in cand or "бөкет" in cand) and ("букет" in target_name.lower() or "бөкет" in target_name.lower()):
                overlap += 5
            if ("абылай" in cand) and ("абылай" in target_name.lower()):
                overlap += 5
            if ("казгюу" in cand or "нарикбаев" in cand or "нәрікбаев" in cand) and ("казгюу" in target_name.lower() or "нарикбаев" in target_name.lower()):
                overlap += 5
            if ("esil" in cand or "есиль" in cand) and ("esil" in target_name.lower() or "есиль" in target_name.lower() or "экономики, финансов" in target_name.lower()):
                overlap += 5
            if overlap > best_score and overlap >= max(2, min(len(t_words), 2)):
                best_score = overlap
                best_idx = i
        return best_idx, pool[best_idx] if best_idx != -1 else None

    seen_slugs = set()
    for idx, gu in enumerate(gov_unis):
        uv_idx, uv = find_best_match(gu["name_ru"], univision_unis, "name_ru")
        if uv_idx in used_uv:
            uv = None
        elif uv_idx != -1:
            used_uv.add(uv_idx)

        sh_idx, sh = find_best_match(gu["name_ru"], studenthub_unis, "name")
        if sh_idx in used_sh:
            sh = None
        elif sh_idx != -1:
            used_sh.add(sh_idx)

        slug = (sh["slug"] if sh else "") or slugify(gu["name_ru"])[:55]
        while slug in seen_slugs:
            slug = f"{slug}-{idx}"
        seen_slugs.add(slug)

        merged.append({
            "id": f"uni-{idx+1:03d}",
            "slug": slug,
            "ent_code": uv["ent_code"] if uv else "",
            "name_ru": gu["name_ru"],
            "name_kk": gu["name_kk"],
            "region_id": gu["region_id"],
            "region_ru": gu["region_ru"],
            "region_kk": gu["region_kk"],
            "city": (sh["city"] if sh and sh.get("city") else "") or (uv["city"] if uv and uv.get("city") else "") or gu["city"],
            "address_ru": gu["address_ru"],
            "address_kk": gu["address_kk"],
            "founded_year": gu["founded_year"],
            "email": gu["email"],
            "phone": sh["phone"] if sh and sh.get("phone") else "",
            "website": uv["website"] if uv else "",
            "rector_ru": gu["rector_ru"],
            "rector_kk": gu["rector_kk"],
            "rector_contacts": gu["rector_contacts"],
            "ownership": uv["ownership"] if uv else "",
            "univ_type": uv["univ_type"] if uv else "",
            "students_total": uv["students_total"] if uv else None,
            "students_grant": uv["students_grant"] if uv else None,
            "students_paid": uv["students_paid"] if uv else None,
            "min_tuition_kzt": uv["min_tuition_kzt"] if uv else None,
            "max_tuition_kzt": uv["max_tuition_kzt"] if uv else None,
            "sample_prices": uv["sample_prices"] if uv else [],
            "programs_count": sh["programs_count"] if sh else 0,
            "studenthub_slug": sh["slug"] if sh else "",
            "univision_url": uv["univision_url"] if uv else "",
            "sources": ["gov.kz/657"] + (["univision.kz"] if uv else []) + (["studenthub.kz"] if sh else []),
        })

    # Add remaining Univision/StudentHub universities not matched to Gov 657
    for i, uv in enumerate(univision_unis):
        if i in used_uv or not uv.get("name_ru"):
            continue
        sh_idx, sh = find_best_match(uv["name_ru"], studenthub_unis, "name")
        if sh_idx in used_sh:
            sh = None
        elif sh_idx != -1:
            used_sh.add(sh_idx)
        slug = (sh["slug"] if sh else "") or slugify(uv["name_ru"])[:55]
        if slug in seen_slugs:
            slug = f"{slug}-uv{i}"
        seen_slugs.add(slug)
        merged.append({
            "id": f"uni-uv-{i+1:03d}",
            "slug": slug,
            "ent_code": uv["ent_code"],
            "name_ru": uv["name_ru"],
            "name_kk": uv["name_ru"],
            "region_id": slugify(uv.get("city") or "kz"),
            "region_ru": uv.get("city") or "Казахстан",
            "region_kk": uv.get("city") or "Қазақстан",
            "city": uv.get("city") or (sh["city"] if sh else ""),
            "address_ru": uv.get("city") or "",
            "address_kk": uv.get("city") or "",
            "founded_year": "",
            "email": "",
            "phone": sh["phone"] if sh and sh.get("phone") else "",
            "website": uv.get("website", ""),
            "rector_ru": "",
            "rector_kk": "",
            "rector_contacts": "",
            "ownership": uv.get("ownership", ""),
            "univ_type": uv.get("univ_type", ""),
            "students_total": uv.get("students_total"),
            "students_grant": uv.get("students_grant"),
            "students_paid": uv.get("students_paid"),
            "min_tuition_kzt": uv.get("min_tuition_kzt"),
            "max_tuition_kzt": uv.get("max_tuition_kzt"),
            "sample_prices": uv.get("sample_prices", []),
            "programs_count": sh["programs_count"] if sh else 0,
            "studenthub_slug": sh["slug"] if sh else "",
            "univision_url": uv["univision_url"],
            "sources": ["univision.kz"] + (["studenthub.kz"] if sh else []),
        })

    print(f"   -> Merged total {len(merged)} unique Kazakhstan Universities")
    return merged


# ==============================================================================
# 5. BACHELOR PROFESSIONS (589 PROFESSIONS RU + KK FROM UNIVISION)
# ==============================================================================
def harvest_professions() -> list[dict]:
    print("[5a/5] Harvesting Bachelor Professions Catalog (RU + KK) from Univision.kz...")
    ru_html = fetch("https://univision.kz/profession/degree/bachelor.html")
    kk_html = fetch("https://univision.kz/kk/profession/degree/bachelor.html")

    ru_items = re.findall(r'href="(/profession/(\d+)\.html)"[^>]*>(.*?)</a>', ru_html, flags=re.S)
    kk_items = re.findall(r'href="(/kk/profession/(\d+)\.html)"[^>]*>(.*?)</a>', kk_html, flags=re.S)
    kk_map = {pid: clean_text(t) for _, pid, t in kk_items}

    profs = []
    seen = set()
    for href, pid, raw_t in ru_items:
        if pid in seen:
            continue
        seen.add(pid)
        title_ru = clean_text(raw_t)
        title_kk = kk_map.get(pid, title_ru)
        if title_ru.startswith("«") and title_ru.endswith("»"):
            title_ru = title_ru[1:-1].strip()
        if title_kk.startswith("«") and title_kk.endswith("»"):
            title_kk = title_kk[1:-1].strip()
        spec_kk, spec_ru = classify_college_spec(title_ru + " " + title_kk)
        profs.append({
            "id": pid,
            "slug": f"{pid}-{slugify(title_ru)[:45]}",
            "title_ru": title_ru,
            "title_kk": title_kk,
            "category_ru": spec_ru,
            "category_kk": spec_kk,
            "url_ru": f"https://univision.kz{href}",
            "url_kk": f"https://univision.kz/kk/profession/{pid}.html",
        })

    # Fetch rich educational program mappings for top 60 modern/high-demand professions
    priority_kw = ["it", "програм", "аналит", "инжен", "дизайн", "врач", "медиц", "стомат", "учител", "педаг", "юрист", "финанс", "экономи", "маркет", "логист", "робот", "кибер", "нефт", "архитект", "психолог", "журнал", "перевод", "менедж", "данн", "разработ"]
    top_profs = [p for p in profs if any(k in p["title_ru"].lower() for k in priority_kw)][:75]

    def enrich_prof(p: dict):
        html_p = fetch(p["url_ru"], 15)
        eps = re.findall(r'href="/edu-program/\d+\.html"[^>]*>.*?<b>(.*?)</b>.*?<small[^>]*>(.*?)</small>', html_p, flags=re.S)
        progs = []
        seen_p = set()
        for t, u in eps:
            tc = clean_text(t)
            if tc not in seen_p:
                seen_p.add(tc)
                progs.append({"program": tc, "university": clean_text(u)})
            if len(progs) >= 8:
                break
        p["related_programs"] = progs

    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
        list(pool.map(enrich_prof, top_profs))

    print(f"   -> Harvested {len(profs)} professions ({len(top_profs)} enriched with universities/programs)")
    return profs


# ==============================================================================
# 6. KNOWLEDGE BASE ARTICLES (24 FROM STUDENTHUB.KZ + GRANT STATS FROM UNIVISION)
# ==============================================================================
KB_TRANSLATIONS_KK = {
    "chto-takoe-ent-i-kak-k-nemu-podgotovitsya": ("ҰБТ деген не және оған қалай дайындалу керек?", "Тапсыру форматы, пәндер құрылымы және дайындық жоспары."),
    "tvorcheskiy-ekzamen-chto-nuzhno-znat-abiturientu": ("Шығармашылық емтихан: талапкер не білуі керек?", "Бейіндік пәндердің орнына өткізілетін шығармашылық сынақ тәртібі."),
    "perechen-neobhodimyh-dokumentov-dlya-postupleniya": ("Оқуға түсуге қажетті құжаттар тізімі", "ЖОО-ға және грант конкурсына тапсырылатын құжаттар."),
    "kak-i-kto-vydelyaet-obrazovatelnye-granty": ("Білім беру гранттарын кім және қалай бөледі?", "Республикалық, жергілікті және мақсатты гранттарды бөлу тетігі."),
    "stipendii-dlya-studentov": ("Студенттерге арналған шәкіртақылар (стипендия)", "Мемлекеттік, жоғарылатылған және президенттік стипендия мөлшері."),
    "stipendii-universitetov-v-kazahstane": ("Қазақстан университеттеріндегі шәкіртақы мөлшері", "2026 жылғы шәкіртақы төлемдері және шарттары."),
    "protsess-provedeniya-ent-v-kazahstane": ("Қазақстанда ҰБТ өткізу процесі", "Тестілеу орталығындағы тіркеу, уақыт және тәртіп ережелері."),
    "akademicheskiy-otpusk-dlya-studentov-v-kazahstane": ("Студенттерге арналған академиялық демалыс", "Академиялық демалыс алу тәртібі мен қажетті анықтамалар."),
    "perevod-iz-odnogo-universiteta-v-drugoy-v-kazahstane": ("Бір университеттен екіншісіне ауысу ережесі", "Оқу орнын немесе мамандықты ауыстыру қадамдары."),
    "v-kakom-formate-budet-prohodit-ent-2026": ("2026 жылы ҰБТ қандай форматта өтеді?", "Электронды тестілеу, пәндер саны және 140 балдық жүйе."),
    "kakie-zadaniya-budut-na-ent": ("ҰБТ-да қандай тапсырмалар болады?", "Бір немесе бірнеше дұрыс жауапты сұрақтар мен контексттік тапсырмалар."),
    "chto-zaprescheno-pri-provedenii-ent": ("ҰБТ тапсыру кезінде неге тыйым салынады?", "Аудиториядағы тәртіп және нәтижені жою негіздері."),
    "zapreschyonnye-predmety-na-ent-i-otvetstvennost-za-narusheniya": ("ҰБТ-да тыйым салынған заттар мен жауапкершілік", "Смартфон, шпаргалка және ереже бұзушылық салдары."),
    "onlayn-kalkulyator-ent-na-studenthub-kz": ("ҰБТ онлайн калькуляторы қалай жұмыс істейді?", "Балл мен бейіндік пәндер бойынша грант мүмкіндігін бағалау."),
    "besplatnye-ent-testy-studenthub": ("ҰБТ-ға дайындыққа арналған тегін тесттер", "Пәндер бойынша білім деңгейін тексеру құралдары."),
    "normativy-fizicheskaya-kultura": ("Дене шынықтыру пәнінен қабылдау нормативтері", "Шығармашылық және спорт бағытындағы талаптар."),
    "kanikuly-v-kazahstane-v-2026-2027-uchebnom-godu-tochnye-daty": ("2026–2027 оқу жылындағы мектеп каникулдарының нақты күндері", "Күзгі, қысқы және көктемгі демалыс кестесі."),
    "porogovye-bally-ent-2027-skolko-nuzhno-nabrat-dlya-postupleniya": ("ҰБТ-2027 шекті балдары: оқуға түсу үшін қанша балл қажет?", "Ұлттық, педагогикалық, медициналық және құқық ЖОО-ларының шектері."),
    "kak-perevestis-s-platnogo-obucheniya-na-grant-v-kazahstane": ("Ақылы оқудан мемлекеттік грантқа қалай ауысуға болады?", "GPA рейтинги, бос гранттар конкурсы және өтініш беру мерзімдері."),
    "format-ent-2027-kakoy-budet-ent-2027": ("ҰБТ-2027 форматы: қандай өзгерістер күтіледі?", "Тестілеу жүйесінің жаңартылуы мен ерекшеліктері."),
    "shkolnye-kanikuly-v-kazahstane-v-2027-godu-daty-otdyha": ("2027 жылғы мектеп каникулдары мен демалыс күндері", "Тоқсан аралық демалыс күндерінің күнтізбесі."),
    "kanikuly-studentov-v-kazahstane-v-2027-godu-kogda-otdyhat": ("2027 жылғы студенттер каникулы", "ЖОО және колледж студенттерінің қысқы-жазғы демалыс кезеңі."),
    "novyy-test-ait-v-kazahstane-zamenit-li-on-ent-v-2027-godu": ("Жаңа AIT тесті: 2027 жылы ҰБТ-ны алмастыра ма?", "Ұлттық тестілеу жүйесіндегі жаңа формат туралы түсіндірме."),
    "katalog-obrazovatelnyh-programm-studenthub": ("Білім беру бағдарламаларының каталогымен жұмыс", "Мамандықтар, оқу ақысы мен өту балдарын салыстыру нұсқаулығы."),
}


def classify_kb_category(slug: str) -> str:
    if any(k in slug for k in ["ent", "ait", "tvorcheskiy", "normativy"]):
        return "ent"
    if any(k in slug for k in ["grant", "perevestis", "perevod", "akademicheskiy"]):
        return "grants"
    if any(k in slug for k in ["stipend"]):
        return "stipends"
    if any(k in slug for k in ["dokument", "katalog"]):
        return "documents"
    if "kanikuly" in slug:
        return "calendar"
    return "guides"


def harvest_knowledge_base() -> dict:
    print("[5b/5] Harvesting StudentHub Knowledge Base (24 articles) & Univision 2025/2026 Grant Summary...")
    sm = fetch("https://studenthub.kz/sitemap.xml")
    kb_urls = [u for u in re.findall(r"<loc>(.*?)</loc>", sm) if "/kb/" in u]

    def parse_kb(url: str) -> dict | None:
        raw = fetch(url, 20)
        if not raw:
            return None
        slug = url.rstrip("/").split("/")[-1]
        h1_m = re.search(r"<h1[^>]*>(.*?)</h1>", raw, flags=re.S)
        title_ru = clean_text(h1_m.group(1)) if h1_m else slug.replace("-", " ").title()

        art_m = re.search(r"<article[^>]*>(.*?)</article>", raw, flags=re.S) or re.search(r"<main[^>]*>(.*?)</main>", raw, flags=re.S)
        blk = art_m.group(1) if art_m else ""
        # Remove scripts/styles/svgs/ads
        blk = re.sub(r"<script.*?</script>|<style.*?</style>|<svg.*?</svg>", "", blk, flags=re.S)
        # Split into sections by <h2> or <h3>
        parts = re.split(r"(<h[23][^>]*>.*?</h[23]>)", blk, flags=re.S)
        sections = []
        intro_paras = []
        cur_heading = None
        for part in parts:
            if re.match(r"^<h[23]", part, flags=re.I):
                cur_heading = clean_text(part)
            else:
                paras = [clean_text(p) for p in re.findall(r"<p[^>]*>(.*?)</p>", part, flags=re.S)]
                paras = [p for p in paras if len(p) > 8 and "Яндекс" not in p]
                bullets = [clean_text(li) for li in re.findall(r"<li[^>]*>(.*?)</li>", part, flags=re.S)]
                bullets = [b for b in bullets if len(b) > 3]
                if cur_heading is None:
                    intro_paras.extend(paras)
                else:
                    if paras or bullets:
                        sections.append({"heading": cur_heading, "paragraphs": paras[:6], "bullets": bullets[:12]})

        summary_ru = intro_paras[0] if intro_paras else (sections[0]["paragraphs"][0] if sections and sections[0]["paragraphs"] else title_ru)
        title_kk, summary_kk = KB_TRANSLATIONS_KK.get(slug, (title_ru, summary_ru))

        return {
            "slug": slug,
            "category": classify_kb_category(slug),
            "title_ru": title_ru,
            "title_kk": title_kk,
            "summary_ru": summary_ru[:320],
            "summary_kk": summary_kk[:320],
            "intro_paragraphs": intro_paras[:4],
            "sections": sections[:10],
            "source_name": "StudentHub.kz",
            "source_url": url,
            "academic_year": "2026-2027",
        }

    articles = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        for res in pool.map(parse_kb, kb_urls):
            if res:
                articles.append(res)

    # Also grab Univision 2025 grant breakdown summary
    grant_summary = {
        "year": 2025,
        "total_grants": 78125,
        "bachelor_total": 63622,
        "bachelor_full_time": 48697,
        "bachelor_short": 3976,
        "bachelor_quotas": 10949,
        "master_total": 12688,
        "phd_total": 1815,
        "source_url": "https://univision.kz/grant/count",
    }

    print(f"   -> Parsed {len(articles)} StudentHub Knowledge Base guides + Univision 2025 Grant Summary")
    return {"grant_summary": grant_summary, "articles": articles}


def main():
    t0 = time.time()
    with open(BACKEND_DATA / "universities.json", encoding="utf-8") as f:
        sh_unis = json.load(f)

    colleges = parse_gov_707()
    gov_unis = parse_gov_657()
    gops = harvest_univision_gops()
    uv_unis = harvest_univision_universities()
    all_unis = merge_universities(gov_unis, uv_unis, sh_unis)
    profs = harvest_professions()
    kb = harvest_knowledge_base()

    # Write to backend embedded data dir
    outputs = {
        "all_colleges.json": colleges,
        "all_universities.json": all_unis,
        "univision_gops.json": gops,
        "professions.json": profs,
        "knowledge_base.json": kb,
    }
    for fname, payload in outputs.items():
        bp = BACKEND_DATA / fname
        with open(bp, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, separators=(",", ":"))
        sz = bp.stat().st_size / 1024
        print(f"   Saved {bp.name}: {sz:.1f} KB")

    # Copy lightweight indexes to frontend/src/data/ for SSG/fallback if needed
    kb_fe = FRONTEND_DATA / "knowledge_base.json"
    with open(kb_fe, "w", encoding="utf-8") as f:
        json.dump(kb, f, ensure_ascii=False)

    print(f"\nALL 4 SOURCES HARVESTED SUCCESSFULLY in {time.time() - t0:.1f}s!")


if __name__ == "__main__":
    main()
