-- 003_fix_opportunity_urls.sql: Fix and update verified opportunity URLs and sources
UPDATE opportunities 
SET application_url = 'https://alem.ai'
WHERE slug = 'tomorrow-school-alem';

UPDATE sources 
SET url = 'https://alem.ai'
WHERE id = 'a0000001-0000-0000-0000-000000000011';

UPDATE opportunities 
SET application_url = 'https://astanahub.com/ru/l/startup-garage'
WHERE slug = 'astana-hub-startup-garage';

UPDATE opportunities 
SET application_url = 'https://www.joltap.kz/'
WHERE slug = 'joltap-astana-project';

UPDATE sources 
SET url = 'https://www.joltap.kz/'
WHERE id = 'a0000001-0000-0000-0000-000000000012';

-- Ensure Daryn has its own dedicated official source URL
INSERT INTO sources (id, url, title, organization, source_type, academic_year, publication_date, excerpt, verification_status) 
VALUES ('a0000001-0000-0000-0000-000000000018', 'https://daryn.kz', 'РНПЦ «Дарын» Минпросвещения РК ресми порталы', 'РНПЦ «Дарын»', 'authority', '2026-2027', '2026-02-01', 'Республикалық оқушылар олимпиадасының ережелері мен қорытындылары.', 'verified')
ON CONFLICT (id) DO UPDATE SET url = 'https://daryn.kz';

UPDATE opportunities 
SET source_id = 'a0000001-0000-0000-0000-000000000018'
WHERE slug = 'daryn-informatics-olympiad';
