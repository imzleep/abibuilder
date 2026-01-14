
-- ID Düzeltme Sorgusu
-- Eğer eski 'CZ 807' silinip yeni 'ZC807' açıldıysa, build'lerin ID'si boşa düşmüş olabilir.
-- Bu sorgu, ismi 'CZ 807' veya 'ZC807' olan buildleri bulup,
-- 'ZC807' isimli silahın GÜNCEL ID'sine bağlar.

UPDATE builds
SET weapon_id = (SELECT id FROM weapons WHERE name = 'ZC807' LIMIT 1)
WHERE weapon_name ILIKE '%CZ%807%' OR weapon_name = 'ZC807';
