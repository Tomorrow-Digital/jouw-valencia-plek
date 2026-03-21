export type SiteLang = "nl" | "en" | "es";

export function detectSiteLang(): SiteLang {
  const saved = localStorage.getItem("site-lang") as SiteLang | null;
  if (saved && ["nl", "en", "es"].includes(saved)) return saved;
  const browserLang = navigator.language?.slice(0, 2).toLowerCase();
  if (browserLang === "nl") return "nl";
  if (browserLang === "es") return "es";
  return "en";
}

export function saveSiteLang(lang: SiteLang) {
  localStorage.setItem("site-lang", lang);
}

type Translations = Record<string, Record<SiteLang, string>>;

const t: Translations = {
  // Navbar
  "nav.rooms": { nl: "Kamers", en: "Rooms", es: "Habitaciones" },
  "nav.surroundings": { nl: "Omgeving", en: "Surroundings", es: "Alrededores" },
  "nav.pricing": { nl: "Prijzen", en: "Pricing", es: "Precios" },
  "nav.contact": { nl: "Contact", en: "Contact Us", es: "Contacto" },
  "nav.bookNow": { nl: "Boek Nu", en: "Book Now", es: "Reservar" },

  // Homepage Hero
  "hero.line1": { nl: "Tapas in de stad.", en: "Tapas in the city.", es: "Tapas en la ciudad." },
  "hero.line2": { nl: "Relaxen aan het zwembad.", en: "Relax by the pool.", es: "Relájate en la piscina." },
  "hero.arrival": { nl: "Aankomst", en: "Arrival", es: "Llegada" },
  "hero.chooseDate": { nl: "Kies je datum", en: "Choose your date", es: "Elige tu fecha" },
  "hero.guests": { nl: "Gasten", en: "Guests", es: "Huéspedes" },
  "hero.guestsDefault": { nl: "2 Volwassenen", en: "2 Adults", es: "2 Adultos" },
  "hero.cta": { nl: "Kies je dates", en: "Choose your dates", es: "Elige tus fechas" },

  // De Ruimte section
  "space.label": { nl: "Ontdek de Rust", en: "Discover Tranquility", es: "Descubre la Tranquilidad" },
  "space.title": { nl: "De Ruimte", en: "The Space", es: "El Espacio" },
  "space.description": { nl: "Onze B&B combineert authentieke Spaanse elementen met een modern, minimalistisch interieur. Elke hoek is ontworpen om rust te stralen.", en: "Our B&B combines authentic Spanish elements with a modern, minimalist interior. Every corner is designed to radiate calm.", es: "Nuestro B&B combina elementos españoles auténticos con un interior moderno y minimalista. Cada rincón está diseñado para irradiar calma." },
  "space.room": { nl: "De Kamer", en: "The Room", es: "La Habitación" },
  "space.roomSub": { nl: "Zachte texturen & Ochtendlicht", en: "Soft textures & Morning light", es: "Texturas suaves y luz matutina" },
  "space.bathroom": { nl: "De Badkamer", en: "The Bathroom", es: "El Baño" },
  "space.bathroomSub": { nl: "Spa-gevoel", en: "Spa feeling", es: "Sensación de spa" },
  "space.outdoor": { nl: "Het Buitenleven", en: "The Outdoors", es: "El Exterior" },
  "space.outdoorSub": { nl: "Al fresco dineren", en: "Al fresco dining", es: "Cena al aire libre" },

  // Discover Valencia
  "discover.title": { nl: "Ontdek Valencia", en: "Discover Valencia", es: "Descubre Valencia" },
  "discover.center": { nl: "Valencia Centrum", en: "Valencia Center", es: "Centro de Valencia" },
  "discover.centerDesc": { nl: "Slechts 15 minuten verwijderd van de historische pracht en bruisende pleinen.", en: "Just 15 minutes from the historic splendor and vibrant squares.", es: "A solo 15 minutos del esplendor histórico y las plazas vibrantes." },
  "discover.beach": { nl: "Het Strand", en: "The Beach", es: "La Playa" },
  "discover.beachDesc": { nl: "Geniet van de uitgestrekte zandstranden en de verfrissende Balearen Zee.", en: "Enjoy the vast sandy beaches and the refreshing Balearic Sea.", es: "Disfruta de las amplias playas de arena y el refrescante mar Balear." },
  "discover.tips": { nl: "Lokale Tips", en: "Local Tips", es: "Consejos Locales" },
  "discover.tipsDesc": { nl: "Wij delen graag onze verborgen parels, van authentieke tapasbar tot boetiek.", en: "We love sharing our hidden gems, from authentic tapas bars to boutiques.", es: "Nos encanta compartir nuestras joyas ocultas, desde bares de tapas auténticos hasta boutiques." },

  // Testimonial
  "testimonial.label": { nl: "Wat onze gasten zeggen", en: "What our guests say", es: "Lo que dicen nuestros huéspedes" },
  "testimonial.quote": { nl: "\"Een verborgen paradijs vlakbij de stad. De rust bij het zwembad na een dagje Valencia is onbetaalbaar. De gastheren weten precies hoe ze je thuis laten voelen.\"", en: "\"A hidden paradise near the city. The tranquility by the pool after a day in Valencia is priceless. The hosts know exactly how to make you feel at home.\"", es: "\"Un paraíso escondido cerca de la ciudad. La tranquilidad junto a la piscina después de un día en Valencia no tiene precio. Los anfitriones saben exactamente cómo hacerte sentir en casa.\"" },
  "testimonial.author": { nl: "Sophie & Mark", en: "Sophie & Mark", es: "Sophie & Mark" },
  "testimonial.origin": { nl: "Gasten uit Amsterdam", en: "Guests from Amsterdam", es: "Huéspedes de Ámsterdam" },

  // FAQ
  "faq.title": { nl: "Veelgestelde vragen", en: "Frequently asked questions", es: "Preguntas frecuentes" },
  "faq.parking.q": { nl: "Is er parkeergelegenheid?", en: "Is there parking available?", es: "¿Hay aparcamiento disponible?" },
  "faq.parking.a": { nl: "Ja, we bieden gratis beveiligde parkeergelegenheid op het terrein voor al onze gasten.", en: "Yes, we offer free secure parking on the premises for all our guests.", es: "Sí, ofrecemos aparcamiento seguro y gratuito en las instalaciones para todos nuestros huéspedes." },
  "faq.center.q": { nl: "Hoe ver is het centrum?", en: "How far is the center?", es: "¿A qué distancia está el centro?" },
  "faq.center.a": { nl: "Valencia centrum is op slechts 15 minuten rijden. Er is ook een directe busverbinding.", en: "Valencia center is just 15 minutes by car. There is also a direct bus connection.", es: "El centro de Valencia está a solo 15 minutos en coche. También hay una conexión directa de autobús." },
  "faq.children.q": { nl: "Zijn kinderen welkom?", en: "Are children welcome?", es: "¿Se admiten niños?" },
  "faq.children.a": { nl: "Ja, kinderen zijn van harte welkom. We hebben een zwembad, dus toezicht is vereist.", en: "Yes, children are very welcome. We have a pool, so supervision is required.", es: "Sí, los niños son bienvenidos. Tenemos piscina, por lo que se requiere supervisión." },

  // Footer
  "footer.tagline": { nl: "Boutique hospitality in het hart van de Valenciaanse kust. Zon, architectuur en sereniteit.", en: "Boutique hospitality in the heart of the Valencian coast. Sun, architecture and serenity.", es: "Hospitalidad boutique en el corazón de la costa valenciana. Sol, arquitectura y serenidad." },
  "footer.connect": { nl: "Contact", en: "Connect", es: "Conectar" },
  "footer.instagram": { nl: "Instagram", en: "Instagram", es: "Instagram" },
  "footer.contactUs": { nl: "Contacteer ons", en: "Contact Us", es: "Contáctanos" },
  "footer.newsletter": { nl: "Nieuwsbrief", en: "Newsletter", es: "Boletín" },
  "footer.location": { nl: "Locatie", en: "Location", es: "Ubicación" },
  "footer.address": { nl: "Calle de la Mar, 14\n46003 Valencia, Spain", en: "Calle de la Mar, 14\n46003 Valencia, Spain", es: "Calle de la Mar, 14\n46003 Valencia, España" },
  "footer.rights": { nl: "Casita Valencia. Alle rechten voorbehouden.", en: "Casita Valencia. All rights reserved.", es: "Casita Valencia. Todos los derechos reservados." },

  // Rooms page
  "rooms.experienceLabel": { nl: "De Ervaring", en: "The Experience", es: "La Experiencia" },
  "rooms.title": { nl: "De Kamer", en: "The Room", es: "La Habitación" },
  "rooms.description": { nl: "Een oase van rust waar zacht linnen hand-gebakken terracotta ontmoet. Onze hoofdkamer is ontworpen om het gouden Valenciaanse licht te vangen, met een kingsize bed en zorgvuldig geselecteerde artisanale decoratie.", en: "An oasis of tranquility where soft linen meets hand-fired terracotta. Our main guest room is designed to capture the golden Valencian light, featuring a king-size bed and curated artisanal decor.", es: "Un oasis de tranquilidad donde el lino suave se encuentra con la terracota hecha a mano. Nuestra habitación principal está diseñada para captar la luz dorada valenciana, con una cama king-size y decoración artesanal." },
  "rooms.comfortsTitle": { nl: "Modern Comfort", en: "Modern Comforts", es: "Comodidades Modernas" },
  "rooms.comfortsSub": { nl: "Alles wat je nodig hebt voor een naadloos verblijf.", en: "Everything you need for a seamless stay.", es: "Todo lo que necesitas para una estancia perfecta." },
  "rooms.wifi": { nl: "WiFi High-speed", en: "WiFi High-speed", es: "WiFi de alta velocidad" },
  "rooms.parking": { nl: "Gratis Parkeren", en: "Free Parking", es: "Aparcamiento Gratuito" },
  "rooms.privateBath": { nl: "Privé Badkamer", en: "Private Bathroom", es: "Baño Privado" },
  "rooms.airco": { nl: "Airconditioning", en: "Air Conditioning", es: "Aire Acondicionado" },
  "rooms.kitchen": { nl: "Buitenkeuken", en: "Outdoor Kitchen", es: "Cocina Exterior" },
  "rooms.pool": { nl: "Zwembad", en: "Swimming Pool", es: "Piscina" },
  "rooms.coffee": { nl: "Koffie & Thee", en: "Coffee & Tea", es: "Café y Té" },
  "rooms.breakfast": { nl: "Ontbijt Optioneel", en: "Breakfast Optional", es: "Desayuno Opcional" },
  "rooms.outdoorKitchen": { nl: "De Buitenkeuken", en: "The Outdoor Kitchen", es: "La Cocina Exterior" },
  "rooms.outdoorKitchenDesc": { nl: "Omarm de 'al fresco' levensstijl. Onze volledig uitgeruste buitenkeuken stelt je in staat om lokale marktproducten te bereiden terwijl je geniet van de zachte bries.", en: "Embrace the 'al fresco' lifestyle. Our fully equipped outdoor kitchen allows you to prepare local market finds while enjoying the gentle breeze.", es: "Abraza el estilo de vida 'al fresco'. Nuestra cocina exterior totalmente equipada te permite preparar productos del mercado local mientras disfrutas de la brisa." },
  "rooms.pricingTitle": { nl: "Prijzen & Seizoenen", en: "Pricing & Seasons", es: "Precios y Temporadas" },
  "rooms.pricingSub": { nl: "Transparante tarieven voor jouw perfecte verblijf.", en: "Transparent rates for your perfect getaway.", es: "Tarifas transparentes para tu escapada perfecta." },
  "rooms.season": { nl: "Seizoen", en: "Season", es: "Temporada" },
  "rooms.perNight": { nl: "Per Nacht", en: "Per Night", es: "Por Noche" },
  "rooms.lowSeason": { nl: "Laagseizoen", en: "Low Season", es: "Temporada Baja" },
  "rooms.lowDates": { nl: "Nov – Feb (excl. feestdagen)", en: "Nov – Feb (excl. holidays)", es: "Nov – Feb (excl. festivos)" },
  "rooms.midSeason": { nl: "Tussenseizoen", en: "Mid Season", es: "Temporada Media" },
  "rooms.midDates": { nl: "Mar – Mei, Sep – Okt", en: "Mar – May, Sep – Oct", es: "Mar – May, Sep – Oct" },
  "rooms.highSeason": { nl: "Hoogseizoen", en: "High Season", es: "Temporada Alta" },
  "rooms.highDates": { nl: "Jun – Aug, feestdagen", en: "Jun – Aug, holidays", es: "Jun – Ago, festivos" },
  "rooms.pricingNote": { nl: "* Minimum verblijf van 3 nachten in het hoogseizoen.", en: "* Minimum stay of 3 nights during high season.", es: "* Estancia mínima de 3 noches en temporada alta." },
  "rooms.ctaTitle": { nl: "Klaar om wakker te worden in Valencia?", en: "Ready to wake up in Valencia?", es: "¿Listo para despertar en Valencia?" },
  "rooms.ctaButton": { nl: "Boek Deze Kamer", en: "Book This Room", es: "Reserva Esta Habitación" },

  // Surroundings page
  "surr.heroLabel": { nl: "Ontdek de omgeving", en: "Discover the surroundings", es: "Descubre los alrededores" },
  "surr.title": { nl: "De Omgeving", en: "The Surroundings", es: "Los Alrededores" },
  "surr.heroDesc": { nl: "Gelegen tussen de bergen en de zee, biedt Casita Valencia de perfecte uitvalsbasis om de authentieke Spaanse cultuur, zonovergoten stranden en de bruisende stad te verkennen.", en: "Located between the mountains and the sea, Casita Valencia offers the perfect base to explore authentic Spanish culture, sun-drenched beaches and the vibrant city.", es: "Situado entre las montañas y el mar, Casita Valencia ofrece la base perfecta para explorar la auténtica cultura española, playas bañadas por el sol y la vibrante ciudad." },
  "surr.center": { nl: "Valencia Centrum", en: "Valencia Center", es: "Centro de Valencia" },
  "surr.centerDesc": { nl: "Dwaal door de smalle straatjes van El Carmen, bewonder de moderne kunst in de City of Arts and Sciences, of geniet van een 'Agua de Valencia' op een historisch terras.", en: "Wander through the narrow streets of El Carmen, admire modern art at the City of Arts and Sciences, or enjoy an 'Agua de Valencia' on a historic terrace.", es: "Pasea por las estrechas calles de El Carmen, admira el arte moderno en la Ciudad de las Artes y las Ciencias, o disfruta de un 'Agua de Valencia' en una terraza histórica." },
  "surr.centerTime": { nl: "25 min met de metro", en: "25 min by metro", es: "25 min en metro" },
  "surr.beach": { nl: "Het Strand", en: "The Beach", es: "La Playa" },
  "surr.beachDesc": { nl: "Van de brede boulevards van Malvarrosa tot de ongerepte duinen van El Saler. De Middellandse Zee roept voor een dag vol ontspanning en verse paella.", en: "From the wide boulevards of Malvarrosa to the pristine dunes of El Saler. The Mediterranean Sea calls for a day of relaxation and fresh paella.", es: "Desde los amplios bulevares de Malvarrosa hasta las dunas vírgenes de El Saler. El Mediterráneo llama para un día de relajación y paella fresca." },
  "surr.beachTime": { nl: "20 min met de auto", en: "20 min by car", es: "20 min en coche" },
  "surr.airport": { nl: "Vliegveld", en: "Airport", es: "Aeropuerto" },
  "surr.airportDesc": { nl: "Een zorgeloze reis van en naar huis. Het vliegveld van Valencia is snel en efficiënt bereikbaar, zodat je vakantie direct bij aankomst begint.", en: "A carefree journey to and from home. Valencia airport is quick and easy to reach, so your vacation starts the moment you arrive.", es: "Un viaje sin preocupaciones. El aeropuerto de Valencia es rápido y fácil de alcanzar, así que tus vacaciones comienzan al llegar." },
  "surr.airportTime": { nl: "20 min met de auto", en: "20 min by car", es: "20 min en coche" },
  "surr.tipsLabel": { nl: "Samengesteld door Charmaine", en: "Curated by Charmaine", es: "Seleccionado por Charmaine" },
  "surr.tipsTitle": { nl: "Lokale tips van Charmaine", en: "Local tips from Charmaine", es: "Consejos locales de Charmaine" },
  "surr.tipsDesc": { nl: "Als gastvrouw ken ik de verborgen plekjes die je niet in de standaard reisgidsen vindt. Laat me je meenemen naar mijn favoriete hoekjes van Valencia.", en: "As your host, I know the hidden spots you won't find in standard travel guides. Let me take you to my favorite corners of Valencia.", es: "Como anfitriona, conozco los rincones ocultos que no encontrarás en las guías de viaje estándar. Déjame llevarte a mis rincones favoritos de Valencia." },
  "surr.hiddenGems": { nl: "Verborgen Parels", en: "Hidden Gems", es: "Joyas Ocultas" },
  "surr.hiddenGemsDesc": { nl: "Ontdek de plekken waar de locals samenkomen.", en: "Discover the places where the locals gather.", es: "Descubre los lugares donde se reúnen los locales." },
  "surr.findUs": { nl: "Vind Ons", en: "Find Us", es: "Encuéntranos" },
  "surr.findUsDesc": { nl: "Onze Casita ligt in een rustige enclave, precies op de grens van de natuur en de stad. De perfecte balans voor je verblijf.", en: "Our Casita is located in a quiet enclave, right on the border of nature and the city. The perfect balance for your stay.", es: "Nuestra Casita está ubicada en un enclave tranquilo, justo en el límite entre la naturaleza y la ciudad. El equilibrio perfecto para tu estancia." },
  "surr.viewRoute": { nl: "Bekijk Route in Maps", en: "View Route in Maps", es: "Ver Ruta en Maps" },

  // Booking page
  "book.label": { nl: "Reservering & Tarieven", en: "Reservation & Rates", es: "Reserva y Tarifas" },
  "book.title1": { nl: "Jouw Mediterraanse", en: "Your Mediterranean", es: "Tu Santuario" },
  "book.title2": { nl: "Toevluchtsoord Wacht", en: "Sanctuary Awaits", es: "Mediterráneo Espera" },
  "book.description": { nl: "Plan je ontsnapping naar de zonovergoten kust. Bekijk onze seizoensbeschikbaarheid en reserveer jouw gewenste data.", en: "Plan your escape to the sun-drenched coast. Review our seasonal availability and secure your preferred dates.", es: "Planifica tu escapada a la costa bañada por el sol. Consulta nuestra disponibilidad estacional y reserva tus fechas preferidas." },
  "book.calendarTitle": { nl: "Prijzen & Beschikbaarheid", en: "Pricing & Availability", es: "Precios y Disponibilidad" },
  "book.seasonalRates": { nl: "Seizoensprijzen", en: "Seasonal Rates", es: "Tarifas de Temporada" },
  "book.formTitle": { nl: "Start je reservering", en: "Start your reservation", es: "Inicia tu reserva" },
  "book.fullName": { nl: "Volledige Naam", en: "Full Name", es: "Nombre Completo" },
  "book.email": { nl: "E-mailadres", en: "Email Address", es: "Correo Electrónico" },
  "book.checkInOut": { nl: "Check-in / Check-out", en: "Check-in / Check-out", es: "Check-in / Check-out" },
  "book.numGuests": { nl: "Aantal Gasten", en: "Number of Guests", es: "Número de Huéspedes" },
  "book.specialRequests": { nl: "Speciale Verzoeken", en: "Special Requests", es: "Solicitudes Especiales" },
  "book.specialPlaceholder": { nl: "Vertel ons over je aankomst of speciale wensen...", en: "Tell us about your arrival or any special needs...", es: "Cuéntanos sobre tu llegada o necesidades especiales..." },
  "book.secure": { nl: "Beveiligde verwerking & directe bevestiging", en: "Secure processing & instant confirmation", es: "Procesamiento seguro y confirmación instantánea" },
  "book.confirm": { nl: "Bevestig Verblijf", en: "Confirm Stay Details", es: "Confirmar Estancia" },
  "book.available": { nl: "Beschikbaar", en: "Available", es: "Disponible" },
  "book.booked": { nl: "Geboekt", en: "Booked", es: "Reservado" },
  "book.selected": { nl: "Geselecteerd", en: "Selected Dates", es: "Fechas Seleccionadas" },
  "book.minStay": { nl: "* Minimum verblijf van 3 nachten in het hoogseizoen. Schoonmaakkosten van €45 voor alle boekingen.", en: "* Minimum stay of 3 nights during high season. Cleaning fee of €45 applied to all bookings.", es: "* Estancia mínima de 3 noches en temporada alta. Tarifa de limpieza de €45 para todas las reservas." },

  // Contact page
  "contact.label": { nl: "Neem contact op", en: "Get in touch", es: "Ponte en contacto" },
  "contact.title1": { nl: "We helpen je graag om je", en: "We're here to make your", es: "Estamos aquí para hacer tu" },
  "contact.title2": { nl: "verblijf onvergetelijk te maken.", en: "stay unforgettable.", es: "estancia inolvidable." },
  "contact.hostTitle": { nl: "Een bericht van Charmaine", en: "A Note from Charmaine", es: "Un mensaje de Charmaine" },
  "contact.hostMsg": { nl: "\"Welkom in mijn stukje Valencia. Ik geloof dat gastvrijheid een kunstvorm is. Of je nu de beste lokale tapas-aanbevelingen nodig hebt of hulp bij je aankomst, ik sta persoonlijk voor je klaar.\"", en: "\"Welcome to my slice of Valencia. I believe hospitality is an art form. Whether you need the best local tapas recommendations or help with your arrival, I am here to assist you personally.\"", es: "\"Bienvenido a mi rincón de Valencia. Creo que la hospitalidad es un arte. Ya sea que necesites las mejores recomendaciones de tapas locales o ayuda con tu llegada, estoy aquí para asistirte personalmente.\"" },
  "contact.formTitle": { nl: "Stuur een Bericht", en: "Send a Message", es: "Envía un Mensaje" },
  "contact.name": { nl: "Volledige Naam", en: "Full Name", es: "Nombre Completo" },
  "contact.email": { nl: "E-mailadres", en: "Email Address", es: "Correo Electrónico" },
  "contact.subject": { nl: "Onderwerp", en: "Subject", es: "Asunto" },
  "contact.message": { nl: "Bericht", en: "Message", es: "Mensaje" },
  "contact.send": { nl: "Verstuur Bericht", en: "Send Inquiry", es: "Enviar Consulta" },
  "contact.rulesTitle": { nl: "Huisregels", en: "House Rules", es: "Reglas de la Casa" },
  "contact.checkTimes": { nl: "Inchecken / Uitchecken", en: "Check-in / Check-out", es: "Check-in / Check-out" },
  "contact.checkTimesDesc": { nl: "Check-in: 15:00 — Check-out: 11:00", en: "Check-in: 15:00 — Check-out: 11:00", es: "Check-in: 15:00 — Check-out: 11:00" },
  "contact.noSmoking": { nl: "Niet roken", en: "No smoking", es: "No fumar" },
  "contact.noSmokingDesc": { nl: "Het is verboden te roken binnen de Casita.", en: "Smoking is not allowed inside the Casita.", es: "Está prohibido fumar dentro de la Casita." },
  "contact.noParties": { nl: "Geen feesten", en: "No parties", es: "Sin fiestas" },
  "contact.noPartiesDesc": { nl: "Respecteer de rust van onze buren.", en: "Respect the peace of our neighbors.", es: "Respeta la tranquilidad de nuestros vecinos." },
  "contact.pets": { nl: "Huisdieren", en: "Pets", es: "Mascotas" },
  "contact.petsDesc": { nl: "Huisdieren zijn welkom na voorafgaand overleg.", en: "Pets are welcome after prior consultation.", es: "Las mascotas son bienvenidas previa consulta." },
  "contact.rulesNote": { nl: "We streven ernaar een oase van rust te bieden. Door deze regels te volgen, helpt u ons de authentieke sfeer van Casita Valencia te behouden.", en: "We strive to offer an oasis of peace. By following these rules, you help us preserve the authentic atmosphere of Casita Valencia.", es: "Nos esforzamos por ofrecer un oasis de paz. Al seguir estas reglas, nos ayudas a preservar la atmósfera auténtica de Casita Valencia." },
  "contact.faqTitle": { nl: "Veelgestelde vragen", en: "Frequently Asked Questions", es: "Preguntas Frecuentes" },
  "contact.faqSub": { nl: "Alles wat u moet weten voor uw verblijf bij ons.", en: "Everything you need to know for your stay with us.", es: "Todo lo que necesitas saber para tu estancia con nosotros." },
  "contact.faq1q": { nl: "Is er parkeergelegenheid beschikbaar?", en: "Is there parking available?", es: "¿Hay aparcamiento disponible?" },
  "contact.faq1a": { nl: "Ja, we bieden gratis beveiligde parkeergelegenheid op het terrein voor al onze gasten.", en: "Yes, we offer free secure parking on the premises for all our guests.", es: "Sí, ofrecemos aparcamiento seguro y gratuito en las instalaciones para todos nuestros huéspedes." },
  "contact.faq2q": { nl: "Bieden jullie ontbijt aan?", en: "Do you offer breakfast?", es: "¿Ofrecéis desayuno?" },
  "contact.faq2a": { nl: "Zeker! Elke ochtend serveren we een vers, lokaal geïnspireerd mediterraan ontbijt op de patio tussen 08:30 en 10:30.", en: "Absolutely! Every morning we serve a fresh, locally inspired Mediterranean breakfast on the patio between 08:30 and 10:30.", es: "¡Por supuesto! Cada mañana servimos un desayuno mediterráneo fresco e inspirado localmente en el patio entre las 08:30 y las 10:30." },
  "contact.faq3q": { nl: "Hoe ver is de Casita van het strand?", en: "How far is the Casita from the beach?", es: "¿A qué distancia está la Casita de la playa?" },
  "contact.faq3a": { nl: "We bevinden ons op slechts 15 minuten rijden van de prachtige stranden van Valencia. Er is ook een directe busverbinding vlakbij.", en: "We are just a 15-minute drive from the beautiful beaches of Valencia. There is also a direct bus connection nearby.", es: "Estamos a solo 15 minutos en coche de las hermosas playas de Valencia. También hay una conexión directa de autobús cerca." },
  "contact.faq4q": { nl: "Zijn er fietsen te huur?", en: "Are bikes available for rent?", es: "¿Hay bicicletas disponibles para alquilar?" },
  "contact.faq4a": { nl: "Ja, we hebben een selectie stadsfietsen die gasten gratis kunnen gebruiken om de omgeving en de sinaasappelboomgaarden te verkennen.", en: "Yes, we have a selection of city bikes that guests can use for free to explore the area and the orange groves.", es: "Sí, tenemos una selección de bicicletas urbanas que los huéspedes pueden usar gratuitamente para explorar la zona y los naranjales." },
  "contact.moreQ": { nl: "Staat uw vraag er niet bij?", en: "Can't find your question?", es: "¿No encuentras tu pregunta?" },
  "contact.emailUs": { nl: "Mail ons direct", en: "Email us directly", es: "Envíanos un email" },
};

export function st(key: string, lang: SiteLang): string {
  return t[key]?.[lang] || t[key]?.["en"] || key;
}
