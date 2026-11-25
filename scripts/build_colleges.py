import json
import re

with open("/tmp/astana_colleges.json", "r", encoding="utf-8") as f:
    raw_colleges = json.load(f)

district_map = {
    "Алматинский район": ("Алматы ауданы", "Алматинский район"),
    "Сарыаркинский район": ("Сарыарқа ауданы", "Сарыаркинский район"),
    "Байконурский район": ("Байқоңыр ауданы", "Байконурский район"),
    "Есильский район": ("Есіл ауданы", "Есильский район"),
    "Нуринский район": ("Нұра ауданы", "Нуринский район"),
    "Сарайшыкский район": ("Сарайшық ауданы", "Сарайшыкский район")
}

def clean_phone(ph):
    return ph.replace(";", ", ").replace("  ", " ").strip()

enriched = []
for c in raw_colleges:
    num = c["num"]
    dist_ru = c["district"].strip()
    dist_kz, dist_ru = district_map.get(dist_ru, (dist_ru, dist_ru))
    
    fullname = c["fullname"].replace("\n", " ").strip()
    name = c["name"].replace("\n", " ").strip()
    address = c["address"].replace("\n", " ").strip()
    phone = clean_phone(c["phone"])
    director = c["director"].replace("\n", " ").strip()

    is_state = ("ГКП на ПХВ" in name) or ("НАО" in name)
    
    # Specific slugs
    slug = f"astana-college-{num}"
    name_l = name.lower()
    if "polytechnic" in name_l:
        slug = "astana-polytechnic-college"
    elif "транспорта и коммуникаций" in name_l and is_state:
        slug = "astana-transport-college"
    elif "высший медицинский колледж" in name_l and is_state:
        slug = "astana-medical-college"
    elif "astana it university" in name_l:
        slug = "astana-aitu-college"
    elif "гумилёва" in name_l:
        slug = "enu-college"
    elif "евразийского гуманитарного" in name_l:
        slug = "eagi-college"
    elif "кунаева" in name_l:
        slug = "kunaev-college"
    elif "педагогический колледж астанинского международного" in name_l:
        slug = "aiu-pedagogical-college"
    elif "общественного питания" in name_l:
        slug = "astana-catering-college"
    elif "технический колледж" in name_l and is_state:
        slug = "astana-technical-college"
    elif "сервиса и туризма" in name_l:
        slug = "astana-service-tourism-college"
    elif "технологический колледж" in name_l:
        slug = "astana-technological-college"
    elif "строительно-технический" in name_l:
        slug = "astana-construction-technical-college"
    elif "профессионально-технический" in name_l:
        slug = "astana-professional-technical-college"
    elif "казпотребсоюза" in name_l:
        slug = "kazpotrebsoyuz-college"
    elif "туран" in name_l:
        slug = "turan-college"
    elif "даналык" in name_l:
        slug = "danalyk-medical-college"
    elif "шипагер" in name_l:
        slug = "shipager-medical-college"
    elif "томирис" in name_l:
        slug = "tomiris-medical-college"
    elif "экономики и права" in name_l:
        slug = "astana-economy-law-college"
    elif "менеджмента, бизнеса" in name_l:
        slug = "astana-management-business-college"
    elif "управления" in name_l:
        slug = "astana-management-college"
    elif "urban" in name_l:
        slug = "urban-college"
    elif "медико-технический" in name_l:
        slug = "astana-medico-technical-college"
    elif "жумабаева" in name_l:
        slug = "zhumabayev-college"
    elif "республиканская медицинская академия" in name_l:
        slug = "rma-medical-college"
    elif "кулажанова" in name_l or "казутб" in name_l:
        slug = "kazutb-college"
    elif "швейцарско" in name_l:
        slug = "ksac-college"
    elif "коммунального хозяйства" in name_l or "профи" in name_l:
        slug = "astana-profi-college"
    elif "международный колледж" in name_l:
        slug = "kazakhstan-international-college"
    elif "медресе" in name_l:
        slug = "astana-medrese-college"
    elif "альт" in name_l or "тынышпаева" in name_l:
        slug = "alt-transport-college"

    # Category / Specialization
    spec_kz = "Көпсалалы"
    spec_ru = "Многопрофильный"
    if "медицин" in name_l or "медресе" in name_l:
        spec_kz = "Медицина және денсаулық"
        spec_ru = "Медицина и здравоохранение"
    elif "it" in name_l or "информацион" in name_l:
        spec_kz = "IT және цифрлық технологиялар"
        spec_ru = "ИТ и цифровые технологии"
    elif "педагог" in name_l:
        spec_kz = "Педагогика және тәрбие"
        spec_ru = "Педагогика и воспитание"
    elif "транспорт" in name_l:
        spec_kz = "Көлік, логистика және байланыс"
        spec_ru = "Транспорт, логистика и связь"
    elif "питания" in name_l or "сервис" in name_l or "туризм" in name_l:
        spec_kz = "Қоғамдық тамақтану, сервис және туризм"
        spec_ru = "Общественное питание, сервис и туризм"
    elif "политех" in name_l or "техник" in name_l or "технолог" in name_l:
        spec_kz = "Техникалық ғылымдар және инженерия"
        spec_ru = "Технические науки и инженерия"
    elif "строитель" in name_l or "коммунал" in name_l or "urban" in name_l:
        spec_kz = "Құрылыс, сәулет және ТКШ"
        spec_ru = "Строительство, архитектура и ЖКХ"
    elif "эконом" in name_l or "бизнес" in name_l or "менеджмент" in name_l or "казпотребсоюз" in name_l:
        spec_kz = "Экономика, қаржы және менеджмент"
        spec_ru = "Экономика, финансы и менеджмент"
    elif "прав" in name_l or "управлен" in name_l:
        spec_kz = "Құқықтану және басқару"
        spec_ru = "Юриспруденция и право"

    # Name in Kazakh
    name_kz = name
    clean_n = name.replace("Учреждение «", "«").replace("ГКП на ПХВ «", "«").replace("ТОО «", "«").replace("Частное учреждение «", "«")
    if "Высший колледж" in clean_n:
        name_kz = clean_n.replace("Высший колледж", "жоғары колледжі")
    elif "Колледж" in clean_n:
        name_kz = clean_n.replace("Колледж", "колледжі")

    # Clean up Russian name for nice card presentation
    clean_name_ru = name.replace("Учреждение «", "«").replace("ГКП на ПХВ «", "«").replace("ТОО «", "«").replace("Частное учреждение «", "«")

    enriched.append({
        "id": f"d0000002-0000-0000-0000-{num:012d}",
        "slug": slug,
        "num": num,
        "name_ru": clean_name_ru,
        "name_kz": name_kz,
        "fullname_ru": fullname,
        "fullname_kz": fullname,
        "district_kz": dist_kz,
        "district_ru": dist_ru,
        "address_ru": address,
        "address_kz": address.replace("г. Астана", "Астана қ.").replace("Алматинский район", "Алматы ауданы").replace("Сарыаркинский район", "Сарыарқа ауданы").replace("Байконурский район", "Байқоңыр ауданы").replace("Есильский район", "Есіл ауданы").replace("Нуринский район", "Нұра ауданы").replace("район Сарайшык", "Сарайшық ауданы").replace("ул.", "көшесі,").replace("проспект", "даңғылы,"),
        "contact_phone": phone,
        "director": director,
        "is_state": is_state,
        "ownership_kz": "Мемлекеттік (Астана әкімдігі гранты / Госзаказ)" if is_state else "Жеке меншік (Ақылы / Жекелеген гранттар)",
        "ownership_ru": "Государственный (Госзаказ/грант акимата Астаны)" if is_state else "Частный (Платное отделение / Гранты)",
        "specialization_kz": spec_kz,
        "specialization_ru": spec_ru,
        "institution_type": "college",
        "official_website": "https://astana.bilim.gov.kz",
        "has_dormitory": is_state or ("медицин" in name_l) or ("политех" in name_l) or ("транспорт" in name_l),
        "dormitory_info_kz": "Студенттер жатақханасы бар (немесе серіктес жатақхана орындары бөлінеді)." if (is_state or "политех" in name_l) else "Жатақхана орындарын қабылдау комиссиясынан нақтылаңыз.",
        "dormitory_info_ru": "Предоставляется студенческое общежитие (или места в партнерском кампусе)." if (is_state or "политех" in name_l) else "Уточняйте наличие мест в общежитии в приемной комиссии.",
        "admission_kz": "9 және 11-сыныптан кейін. ҰБТ ТАПСЫРУ ҚАЖЕТ ЕМЕС! Қабылдау аттестаттың орташа балы бойынша жүргізіледі.",
        "admission_ru": "После 9 и 11 классов. ЕНТ СДАВАТЬ НЕ НУЖНО! Прием ведется по среднему баллу школьного аттестата.",
        "source_url": "https://www.gov.kz/article/707?lang=ru",
        "status": "verified"
    })

import os
os.makedirs("backend/internal/handlers/data", exist_ok=True)
with open("backend/internal/handlers/data/astana_colleges.json", "w", encoding="utf-8") as out:
    json.dump(enriched, out, ensure_ascii=False, indent=2)

# Also save directly to frontend public/data so it can be used statically or via API
os.makedirs("frontend/src/data", exist_ok=True)
with open("frontend/src/data/colleges.json", "w", encoding="utf-8") as out:
    json.dump(enriched, out, ensure_ascii=False, indent=2)

print(f"Successfully generated {len(enriched)} enriched colleges in backend and frontend!")
