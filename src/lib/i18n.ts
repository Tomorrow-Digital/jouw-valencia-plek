export type Language = 'nl' | 'en' | 'es';

const translations: Record<string, Record<Language, string>> = {
  // Sidebar
  'nav.overview': { nl: 'Overzicht', en: 'Overview', es: 'Resumen' },
  'nav.management': { nl: 'Beheer', en: 'Management', es: 'Gestión' },
  'nav.crm': { nl: 'CRM', en: 'CRM', es: 'CRM' },
  'nav.integrations': { nl: 'Integraties', en: 'Integrations', es: 'Integraciones' },
  'nav.privacy': { nl: 'Privacy & AVG', en: 'Privacy & GDPR', es: 'Privacidad y RGPD' },

  // CRM
  'crm.inbox': { nl: 'Inbox', en: 'Inbox', es: 'Bandeja de entrada' },
  'crm.guests': { nl: 'Gasten', en: 'Guests', es: 'Huéspedes' },
  'crm.templates': { nl: 'Templates', en: 'Templates', es: 'Plantillas' },
  'crm.sendMessage': { nl: 'Verstuur', en: 'Send', es: 'Enviar' },
  'crm.typeMessage': { nl: 'Typ een bericht...', en: 'Type a message...', es: 'Escribe un mensaje...' },
  'crm.windowOpen': { nl: 'Venster open', en: 'Window open', es: 'Ventana abierta' },
  'crm.windowClosed': { nl: 'Venster gesloten', en: 'Window closed', es: 'Ventana cerrada' },
  'crm.windowClosedInfo': { nl: 'Het 24-uurs venster is gesloten. Alleen templates mogelijk.', en: 'The 24h window is closed. Only templates allowed.', es: 'La ventana de 24h está cerrada. Solo plantillas.' },
  'crm.searchConversations': { nl: 'Zoek gesprekken...', en: 'Search conversations...', es: 'Buscar conversaciones...' },
  'crm.noConversations': { nl: 'Nog geen gesprekken.', en: 'No conversations yet.', es: 'Aún no hay conversaciones.' },
  'crm.selectConversation': { nl: 'Selecteer een gesprek', en: 'Select a conversation', es: 'Selecciona una conversación' },
  'crm.addGuest': { nl: 'Gast toevoegen', en: 'Add guest', es: 'Añadir huésped' },
  'crm.noGuests': { nl: 'Nog geen gasten. Gasten worden automatisch aangemaakt wanneer ze via WhatsApp contact opnemen.', en: 'No guests yet. Guests are created automatically when they contact you via WhatsApp.', es: 'Aún no hay huéspedes. Se crean automáticamente cuando contactan por WhatsApp.' },
  'crm.guestProfile': { nl: 'Gastprofiel', en: 'Guest profile', es: 'Perfil del huésped' },
  'crm.chooseTemplate': { nl: 'Template kiezen', en: 'Choose template', es: 'Elegir plantilla' },
  'crm.syncTemplates': { nl: 'Synchroniseren', en: 'Synchronize', es: 'Sincronizar' },
  'crm.noTemplates': { nl: 'Geen templates gevonden. Klik op \'Synchroniseren\' om templates op te halen via N8N.', en: 'No templates found. Click \'Synchronize\' to fetch templates via N8N.', es: 'No se encontraron plantillas. Haz clic en \'Sincronizar\' para obtener plantillas.' },
  'crm.openConversation': { nl: 'Open gesprek', en: 'Open conversation', es: 'Abrir conversación' },
  'crm.deleteGuest': { nl: 'Verwijder gast', en: 'Delete guest', es: 'Eliminar huésped' },
  'crm.deleteGuestConfirm': { nl: 'Weet je zeker dat je deze gast wilt verwijderen? Alle gesprekken worden ook verwijderd.', en: 'Are you sure? All conversations will also be deleted.', es: '¿Estás seguro? Todas las conversaciones también se eliminarán.' },
  'crm.guestAdded': { nl: 'Gast toegevoegd', en: 'Guest added', es: 'Huésped añadido' },
  'crm.guestDeleted': { nl: 'Gast verwijderd', en: 'Guest deleted', es: 'Huésped eliminado' },
  'crm.profileSaved': { nl: 'Profiel opgeslagen', en: 'Profile saved', es: 'Perfil guardado' },
  'crm.notesSaved': { nl: 'Notities opgeslagen', en: 'Notes saved', es: 'Notas guardadas' },
  'crm.templatesSynced': { nl: 'Templates gesynchroniseerd', en: 'Templates synchronized', es: 'Plantillas sincronizadas' },

  // Integraties
  'integrations.connected': { nl: 'Verbonden', en: 'Connected', es: 'Conectado' },
  'integrations.disconnected': { nl: 'Niet verbonden', en: 'Disconnected', es: 'Desconectado' },
  'integrations.error': { nl: 'Fout', en: 'Error', es: 'Error' },
  'integrations.comingSoon': { nl: 'Binnenkort beschikbaar', en: 'Coming soon', es: 'Próximamente' },
  'integrations.save': { nl: 'Opslaan', en: 'Save', es: 'Guardar' },
  'integrations.testConnection': { nl: 'Test connectie', en: 'Test connection', es: 'Probar conexión' },
  'integrations.saved': { nl: 'Configuratie opgeslagen', en: 'Configuration saved', es: 'Configuración guardada' },
  'integrations.configureN8NFirst': { nl: 'Configureer eerst N8N onder Integraties', en: 'Configure N8N first under Integrations', es: 'Configura N8N primero en Integraciones' },

  // Algemeen
  'common.loading': { nl: 'Laden...', en: 'Loading...', es: 'Cargando...' },
  'common.save': { nl: 'Opslaan', en: 'Save', es: 'Guardar' },
  'common.cancel': { nl: 'Annuleren', en: 'Cancel', es: 'Cancelar' },
  'common.delete': { nl: 'Verwijderen', en: 'Delete', es: 'Eliminar' },
  'common.search': { nl: 'Zoeken...', en: 'Search...', es: 'Buscar...' },
  'common.all': { nl: 'Alle', en: 'All', es: 'Todos' },
  'common.today': { nl: 'Vandaag', en: 'Today', es: 'Hoy' },
  'common.yesterday': { nl: 'Gisteren', en: 'Yesterday', es: 'Ayer' },
  'common.view': { nl: 'Bekijk', en: 'View', es: 'Ver' },
  'common.name': { nl: 'Naam', en: 'Name', es: 'Nombre' },
  'common.phone': { nl: 'Telefoon', en: 'Phone', es: 'Teléfono' },
  'common.email': { nl: 'E-mail', en: 'Email', es: 'Correo' },
  'common.language': { nl: 'Taal', en: 'Language', es: 'Idioma' },
  'common.notes': { nl: 'Notities', en: 'Notes', es: 'Notas' },
  'common.marketing': { nl: 'Marketing', en: 'Marketing', es: 'Marketing' },
  'common.lastMessage': { nl: 'Laatste bericht', en: 'Last message', es: 'Último mensaje' },
  'common.noMessages': { nl: 'Geen berichten', en: 'No messages', es: 'Sin mensajes' },
  'common.actions': { nl: 'Acties', en: 'Actions', es: 'Acciones' },
  'common.profile': { nl: 'Profiel', en: 'Profile', es: 'Perfil' },
  'common.messages': { nl: 'Berichten', en: 'Messages', es: 'Mensajes' },
};

let currentLanguage: Language = 'nl';

export function setLanguage(lang: Language) {
  currentLanguage = lang;
  localStorage.setItem('admin-lang', lang);
}

export function getLanguage(): Language {
  return (localStorage.getItem('admin-lang') as Language) || currentLanguage;
}

export function t(key: string, lang?: Language): string {
  const useLang = lang || getLanguage();
  return translations[key]?.[useLang] || translations[key]?.['nl'] || key;
}
