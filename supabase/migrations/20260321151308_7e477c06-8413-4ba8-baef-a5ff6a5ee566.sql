UPDATE page_blocks 
SET data = jsonb_set(
  jsonb_set(
    jsonb_set(
      data,
      '{showBookingBar}', 'true'
    ),
    '{fullHeight}', 'true'
  ),
  '{headingItalicLine}', '{"nl": "Relaxen aan het zwembad.", "en": "Relax by the pool.", "es": "Relájate en la piscina."}'::jsonb
)
WHERE id = '5be17026-f5dd-471a-826a-bc4dde138b41';

-- Also fix the heading to just the first line
UPDATE page_blocks 
SET data = jsonb_set(data, '{heading}', '{"nl": "Tapas in de stad.", "en": "Tapas in the city.", "es": "Tapas en la ciudad."}'::jsonb)
WHERE id = '5be17026-f5dd-471a-826a-bc4dde138b41';