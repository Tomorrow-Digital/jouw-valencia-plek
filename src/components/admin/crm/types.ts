export interface CrmGuest {
  id: string;
  name: string;
  phone_e164: string;
  wa_id: string | null;
  language: string;
  email: string | null;
  notes: string | null;
  opted_in_marketing: boolean;
  opted_in_at: string | null;
  booking_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CrmConversation {
  id: string;
  guest_id: string;
  status: "active" | "closed" | "archived";
  channel: "whatsapp" | "email" | "contact_form";
  csw_expires_at: string | null;
  last_message_at: string | null;
  unread_count: number;
  created_at: string;
  guest: CrmGuest;
}

export interface CrmMessage {
  id: string;
  conversation_id: string;
  wamid: string | null;
  direction: "inbound" | "outbound";
  message_type: string;
  content: string | null;
  metadata: Record<string, any>;
  status: "pending" | "sent" | "delivered" | "read" | "failed";
  sent_at: string;
  delivered_at: string | null;
  read_at: string | null;
}

export interface CrmTemplate {
  id: string;
  template_name: string;
  category: "marketing" | "utility" | "authentication";
  language: string;
  status: "pending" | "approved" | "rejected" | "paused";
  body_text: string | null;
  header_type: string | null;
  buttons: any[];
  last_synced_at: string;
  created_at: string;
}
