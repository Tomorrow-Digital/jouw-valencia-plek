
UPDATE page_blocks
SET data = data
  || '{"alignment": "left"}'::jsonb
  || '{"heroDescription": {"nl": "Gelegen tussen de bergen en de zee, biedt Casita Valencia de perfecte uitvalsbasis om de authentieke Spaanse cultuur, zonovergoten stranden en de bruisende stad te verkennen.", "en": "Located between the mountains and the sea, Casita Valencia offers the perfect base to explore authentic Spanish culture, sun-drenched beaches and the vibrant city.", "es": "Situado entre las montañas y el mar, Casita Valencia ofrece la base perfecta para explorar la auténtica cultura española, playas bañadas por el sol y la vibrante ciudad."}}'::jsonb
WHERE page_id = 'a1000000-0000-0000-0000-000000000003' AND type = 'hero';

-- Update subtitle to be the italic label above the heading
UPDATE page_blocks
SET data = jsonb_set(data, '{subtitle}', '{"nl": "Ontdek de omgeving", "en": "Discover the surroundings", "es": "Descubre los alrededores"}'::jsonb)
WHERE page_id = 'a1000000-0000-0000-0000-000000000003' AND type = 'hero';
