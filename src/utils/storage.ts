import type { Contact } from '../types/Contact';

const STORAGE_KEY = 'contact-management-data';

export function saveContacts(contacts: Contact[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

export function loadContacts(): Contact[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  
  try {
    const contacts = JSON.parse(data);
    return contacts.map((contact: any) => ({
      ...contact,
      createdAt: new Date(contact.createdAt)
    }));
  } catch (error) {
    console.error('Error loading contacts:', error);
    return [];
  }
}