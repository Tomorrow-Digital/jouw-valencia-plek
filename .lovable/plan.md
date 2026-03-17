

# Plan: Boekingen opslaan in database + WhatsApp notificatie

## Wat er nu mist
Het boekingsformulier valideert wel, maar slaat niets op en stuurt niets. We gaan dit oplossen.

## Aanpak

### 1. Database: `bookings` tabel aanmaken
Nieuwe tabel met kolommen:
- `id` (uuid, primary key)
- `first_name`, `last_name`, `email`, `phone` (text)
- `guests` (integer)
- `check_in`, `check_out` (date)
- `arrival_time` (text)
- `message` (text, nullable)
- `total_price` (numeric, nullable)
- `status` (text, default 'pending' — mogelijke waarden: pending, confirmed, cancelled)
- `created_at` (timestamptz)

RLS: iedereen mag INSERT (publiek formulier), alleen authenticated mag SELECT/UPDATE/DELETE (admin).

### 2. Frontend: formulier koppelen aan database
De `handleBookingSubmit` functie aanpassen zodat na validatie de data via `supabase.insert()` naar de `bookings` tabel wordt geschreven. Bij succes: bedankmelding tonen. Bij fout: foutmelding.

### 3. WhatsApp notificatie
Na succesvolle insert wordt een edge function `notify-booking` aangeroepen die een WhatsApp-bericht stuurt via de WhatsApp API link (`https://wa.me/...`). 

Twee opties hiervoor:
- **Simpel (aanbevolen)**: na succesvolle insert opent de frontend automatisch een `wa.me` link met een vooringevuld bericht met de boekingsdetails — dit werkt zonder API keys
- **Geavanceerd**: een edge function die via Twilio/WhatsApp Business API een bericht stuurt — vereist een Twilio account

De simpele aanpak: na opslaan in de database tonen we de bedankmelding én openen we een WhatsApp link (`https://wa.me/JOUW_NUMMER?text=...`) met de samenvatting van de boeking (naam, dates, gasten, prijs).

### 4. Admin-paneel
Het bestaande admin-paneel uitbreiden met een "Boekingen" tab waar alle boekingsaanvragen zichtbaar zijn met status (pending/confirmed/cancelled) en de mogelijkheid om de status te wijzigen.

## Samenvatting stappen
1. Migratie: `bookings` tabel + RLS policies
2. Frontend: formulier schrijft naar database
3. Frontend: na succes opent WhatsApp met vooringevuld bericht
4. Admin: boekingen overzicht + statusbeheer

