
-- Hide old location_map and text blocks on omgeving page
UPDATE page_blocks SET is_visible = false WHERE page_id = 'a1000000-0000-0000-0000-000000000003' AND type IN ('location_map', 'text');

-- Insert Destinations block (position 1)
INSERT INTO page_blocks (id, page_id, type, position, is_visible, data) VALUES (
  gen_random_uuid(),
  'a1000000-0000-0000-0000-000000000003',
  'destinations',
  1,
  true,
  '{
    "destinations": [
      {
        "title": {"nl": "Valencia Centrum", "en": "Valencia City Center", "es": "Centro de Valencia"},
        "description": {"nl": "Dwaal door de smalle straatjes van El Carmen, bewonder de moderne kunst in de City of Arts and Sciences, of geniet van een Agua de Valencia op een historisch terras.", "en": "Wander through the narrow streets of El Carmen, admire modern art at the City of Arts and Sciences, or enjoy an Agua de Valencia on a historic terrace.", "es": "Pasea por las estrechas calles de El Carmen, admira el arte moderno en la Ciudad de las Artes y las Ciencias, o disfruta de un Agua de Valencia en una terraza histórica."},
        "travelTime": {"nl": "25 min met de metro", "en": "25 min by metro", "es": "25 min en metro"},
        "icon": "train",
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuClMprIlHmAxY0IvpD3ctbvG-KpPEFcmNcT2_pkcDiyph4oDRc3RZisb-rSBoNWumGvc8y8uGbp1CQvnr6R_FrvI5WU7kOEQ-CxCDT5Sjs3RlztIFI0TJnMFcCst1NUXDhFLPoRUZSPNiXoxORBgFQqkAmjUrvalyqXDeeyuMl8B1ueV3yx74ljC3sub_a6J3c-qU63g4MB2om8Cq2CQ_GlQnpOyq_eJfChI-Sr51_RoxGto21T1a3ge84AjkA75MRItZXXCBaLybVD"
      },
      {
        "title": {"nl": "Het Strand", "en": "The Beach", "es": "La Playa"},
        "description": {"nl": "Van de brede boulevards van Malvarrosa tot de ongerepte duinen van El Saler. De Middellandse Zee roept voor een dag vol ontspanning en verse paella.", "en": "From the wide boulevards of Malvarrosa to the pristine dunes of El Saler. The Mediterranean Sea calls for a day of relaxation and fresh paella.", "es": "Desde los amplios bulevares de la Malvarrosa hasta las dunas vírgenes de El Saler. El mar Mediterráneo invita a un día de relax y paella fresca."},
        "travelTime": {"nl": "20 min met de auto", "en": "20 min by car", "es": "20 min en coche"},
        "icon": "car",
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBhma1EKR3htCLNmpVJDTbyo1SBad1jBkHlGh9O0ZapEb2WDzH57D1tb9Y9nElaf0ezcM-eLbFmURRWuwHMbazBnA_nCB1dROF27skXPqLyQ5qf1quv7_d7hQRfB0Gas8TM6Yf9Hxcea69g2aHhLKTbMfvO778sCyj7OAn1j8lS3r0gkC22vuQ83GVjFFmm1qjlWFAQ6DoPtQBvkxGxUDP61apcPceSB_aIw2MN4wIVwBIL6x-5spqZQIbGQmX4VKMmqxt-DUZQRs1-"
      },
      {
        "title": {"nl": "Vliegveld", "en": "Airport", "es": "Aeropuerto"},
        "description": {"nl": "Een zorgeloze reis van en naar huis. Het vliegveld van Valencia is snel en efficiënt bereikbaar, zodat je vakantie direct bij aankomst begint.", "en": "A carefree journey to and from home. Valencia airport is quickly and efficiently accessible, so your holiday starts the moment you arrive.", "es": "Un viaje sin preocupaciones de ida y vuelta. El aeropuerto de Valencia es rápido y eficiente, para que tus vacaciones comiencen desde el momento de tu llegada."},
        "travelTime": {"nl": "20 min met de auto", "en": "20 min by car", "es": "20 min en coche"},
        "icon": "plane",
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBAh4BzcZ7eIzugN7AB2ZNNPP4FaAMXxx7_s5t3K3qag6O2Tn0AUGmeclh70iJwjEeegdQ6xU1Bd6ZMWSPrcGpsYEKQ_7kwSvOZF7dXJNiA27nFE0gJyLgyMjLDj3qutgQ-sUQ6m8lbBXf0opq-QxyoZsJ5RAu3yPUhQAZIMhrRK5lLtvOSRkANqz1MJ64rWbyr34335ks44xG6Sy4QXa2fxJdOcEcnoP0C1H_cwdkXhqGRx3NRqJUlsiobMPY-6sblmDKiGF7jQim6"
      }
    ]
  }'::jsonb
);

-- Insert Tips block (position 2)
INSERT INTO page_blocks (id, page_id, type, position, is_visible, data) VALUES (
  gen_random_uuid(),
  'a1000000-0000-0000-0000-000000000003',
  'tips',
  2,
  true,
  '{
    "sidebarLabel": {"nl": "Curated by Charmaine", "en": "Curated by Charmaine", "es": "Seleccionado por Charmaine"},
    "heading": {"nl": "Lokale tips van Charmaine", "en": "Local tips from Charmaine", "es": "Consejos locales de Charmaine"},
    "description": {"nl": "Als gastvrouw ken ik de verborgen plekjes die je niet in de standaard reisgidsen vindt. Laat me je meenemen naar mijn favoriete hoekjes van Valencia.", "en": "As your host, I know the hidden spots you won''t find in standard travel guides. Let me take you to my favorite corners of Valencia.", "es": "Como anfitriona, conozco los rincones escondidos que no encontrarás en las guías de viaje estándar. Déjame llevarte a mis rincones favoritos de Valencia."},
    "highlightTitle": {"nl": "Verborgen Parels", "en": "Hidden Gems", "es": "Joyas Ocultas"},
    "highlightDescription": {"nl": "Ontdek de plekken waar de locals samenkomen.", "en": "Discover the places where the locals gather.", "es": "Descubre los lugares donde se reúnen los locales."},
    "tips": [
      {
        "category": {"nl": "Restaurants", "en": "Restaurants", "es": "Restaurantes"},
        "name": "Casa Carmela",
        "description": {"nl": "De beste traditionele paella gebakken op houtvuur. Reserveren is een must!", "en": "The best traditional paella cooked over wood fire. Reservations are a must!", "es": "La mejor paella tradicional cocinada a leña. ¡Reservar es imprescindible!"},
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCF1Gz_ZBr-5MXVGFuYIZqVzNHssifZirKOreMbeeoS4q92PkbFVSlVVtAgP3AA92stfHeFJmE9G6ynfg2_wjC50_cbTVw1R8DVPGseR07J7BsLY2ih3jdhUlIQ7YDYfiZoVup9cEw7Mfx7ueo7A4TIEwqAgrZ4za0BxlIpoGHMWHLIoh8iJZoPlYOcPt7wUk_5sCyI_9RHGq5HhsO0iigDdii1aDRUcce1rtyn47-SwsfbG4gTcDwe3InpTNFgeSOkjUdd6xcY0DfH"
      },
      {
        "category": {"nl": "Markten", "en": "Markets", "es": "Mercados"},
        "name": "Mercado Central",
        "description": {"nl": "Een architectonisch hoogstandje vol verse lokale producten. Ga vroeg voor de lekkerste churros.", "en": "An architectural masterpiece full of fresh local produce. Go early for the best churros.", "es": "Una obra maestra arquitectónica llena de productos locales frescos. Ve temprano para los mejores churros."},
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAG-I8T1kG9pjw4h_bfMOPz4dlHhkqFd_jZjwaOpkXCePqKNYJjwIOq6aaw9YnG9VGQGte3ZVYRdBIfJVT09dSFnpdvipN6ZYK3pHh1gzYxkIi_mwg7m1Escs-n_FmI7ZZq_xxK04DewTP9jSQtK0d63HE3j4i3KVkM2satcSY4n0D81jnvx-6jHzLX0d8bijJ7zjJ08JoAHKfF5vk9R24ig63DRZXKDVl7Of8NAvbd8XZhOg9K7FE4B2FUAtbjWZc1UZ89_EcvqqKH"
      },
      {
        "category": {"nl": "Verborgen Plekken", "en": "Hidden Gems", "es": "Joyas Ocultas"},
        "name": "Plaza de la Virgen",
        "description": {"nl": "Bezoek dit plein na zonsondergang voor een magische sfeer en prachtige verlichting.", "en": "Visit this square after sunset for a magical atmosphere and beautiful lighting.", "es": "Visita esta plaza al atardecer para una atmósfera mágica e iluminación preciosa."},
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDfsM_F-x6txkvVwF7OJDSkgG2ib7PYsn0wh6jy72CzugIBo01cFteWPBlGxFnjPxYN9V7XwqvJf4m_WhZ4yWohcSk6dxSWwQpuybqHsRhtnogCnCGYa4xbzvgjZzqzerVEnqrOTV6zpWkiJIoIYQImu8evEjZKAUAZ16GF-y8na0VrusCqA5I1sccOE-m7hDEPhQoJOj8edYnkqZ5b8-IsfvFgUXKVki6ItJt-RJGwPd-g6_mTpXpWM_v9b9Zg7lrmUAUbBRXgc_6m"
      },
      {
        "category": {"nl": "Drankjes", "en": "Drinks", "es": "Bebidas"},
        "name": "Café de las Horas",
        "description": {"nl": "Beroemd om hun Agua de Valencia in een weelderig neo-barok interieur.", "en": "Famous for their Agua de Valencia in a lavish neo-baroque interior.", "es": "Famoso por su Agua de Valencia en un lujoso interior neobarroco."},
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBPUz9yvnni6rrwDpn54_AD_ao1c58UPZu-Yn2gV_SxJcxQAUglDwbHiiAEwnEB3IgbfLZy0JJruncVxqUV_enM_jeqbtKnwF5Qi1XqAFwuNVb3yK29x_ZlA-zbn6k6cNCovtJcJOLuLzP4vDIU3S96LpGDRMyvL2AA9eesE5LjMHqYa3d0H4aJCR9NBACGZ-PRYh65j-QNgYZhAb0qiZcWjbk8FMz1Mmv-w0uaoIzVjRq-rv_9hJofS3xUzsp2BbZE5v5N72q0OeKz"
      }
    ]
  }'::jsonb
);

-- Insert Location/Find Us block (position 3) - reuse location_map type
UPDATE page_blocks SET position = 3 WHERE page_id = 'a1000000-0000-0000-0000-000000000003' AND type = 'location_map';
UPDATE page_blocks SET is_visible = true WHERE page_id = 'a1000000-0000-0000-0000-000000000003' AND type = 'location_map';
