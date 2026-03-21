
ALTER TABLE pages 
  ADD COLUMN title_en TEXT DEFAULT '',
  ADD COLUMN title_es TEXT DEFAULT '',
  ADD COLUMN slug_en TEXT DEFAULT '',
  ADD COLUMN slug_es TEXT DEFAULT '',
  ADD COLUMN meta_description_en TEXT DEFAULT '',
  ADD COLUMN meta_description_es TEXT DEFAULT '';
