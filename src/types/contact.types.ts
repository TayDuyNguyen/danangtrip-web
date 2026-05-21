/**
 * Contact entity and related types
 */

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: 'new' | 'read' | 'replied';
  reply: string | null;
  replied_by: number | null;
  replied_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Interface for contact submission request
 */
export interface ContactInput {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}
