

# Plan: Bevestigingsmail naar boeker + WhatsApp verwijderen

## Wat er verandert

### 1. WhatsApp-redirect verwijderen
De `window.open(wa.me/...)` aanroep na het opslaan van een boeking wordt verwijderd uit `handleBookingSubmit` in `src/pages/Index.tsx`. De WhatsApp-links in de contactsectie en footer blijven gewoon staan (die zijn voor algemeen contact, niet voor boekingen).

### 2. E-maildomein instellen
Er is nog geen e-maildomein geconfigureerd. Om bevestigingsmails te kunnen versturen moet er eerst een afzenderdomein worden ingesteld (bijv. `casavalencia.es` of een subdomein). Dit is een eenmalige stap met DNS-verificatie.

### 3. Bevestigingsmail edge function
Na het instellen van het e-maildomein wordt er een backend-functie aangemaakt (`send-booking-confirmation`) die:
- De boekingsgegevens ontvangt (naam, dates, gasten, prijs)
- Een nette HTML-bevestigingsmail rendert in de stijl van de website
- Deze verstuurt naar het e-mailadres van de boeker

### 4. Boekingsflow aanpassen
Na succesvol opslaan in de database roept de frontend de backend-functie aan om de bevestigingsmail te versturen. De gebruiker ziet een bedankmelding op de pagina.

### 5. Admin (al klaar)
De boekingen zijn al zichtbaar in het admin-paneel met statusbeheer — daar hoeft niets te veranderen.

## Volgorde
1. E-maildomein instellen (vereist jouw actie: DNS records toevoegen)
2. E-mail infrastructuur opzetten
3. Edge function voor bevestigingsmail bouwen
4. WhatsApp-redirect verwijderen en mail-aanroep toevoegen
5. Deployen en testen

## Eerste stap
We beginnen met het instellen van je e-maildomein. Heb je een eigen domein (bijv. casavalencia.es) dat je wilt gebruiken als afzender?

