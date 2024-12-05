import React, { useState, useEffect } from 'react';
import { Users, PlusCircle } from 'lucide-react';
import { ContactForm } from './components/ContactForm';
import { ContactList } from './components/ContactList';
import { ExcelImport } from './components/ExcelImport';
import { BulkMessage } from './components/BulkMessage';
import type { Contact } from './types/Contact';
import { saveContacts, loadContacts } from './utils/storage';

export default function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Load contacts from localStorage on initial render
  useEffect(() => {
    const savedContacts = loadContacts();
    setContacts(savedContacts);
  }, []);

  // Save contacts to localStorage whenever they change
  useEffect(() => {
    saveContacts(contacts);
  }, [contacts]);

  const addContact = (newContact: Omit<Contact, 'id' | 'createdAt'>) => {
    const contact: Contact = {
      ...newContact,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setContacts(prevContacts => [...prevContacts, contact]);
    setShowForm(false);
  };

  const deleteContact = (id: string) => {
    setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));
    setSelectedContacts(prevSelected => prevSelected.filter(contactId => contactId !== id));
  };

  const handleExcelImport = (importedContacts: Omit<Contact, 'id' | 'createdAt'>[]) => {
    const newContacts = importedContacts.map(contact => ({
      ...contact,
      id: crypto.randomUUID(),
      createdAt: new Date()
    }));
    setContacts(prevContacts => [...prevContacts, ...newContacts]);
  };

  const toggleSelectContact = (id: string) => {
    setSelectedContacts(prev =>
      prev.includes(id)
        ? prev.filter(contactId => contactId !== id)
        : [...prev, id]
    );
  };

  const handleMessageSent = (contactId: string) => {
    setContacts(prevContacts =>
      prevContacts.map(contact =>
        contact.id === contactId
          ? { ...contact, lastMessageDate: new Date() }
          : contact
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          <header className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <Users className="text-blue-500 w-8 h-8" />
              <h1 className="text-2xl font-bold text-gray-900">Kişi Yönetimi</h1>
              <button
                onClick={() => setShowForm(!showForm)}
                className="ml-4 inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <PlusCircle size={20} />
                {showForm ? 'Listeyi Göster' : 'Yeni Kişi Ekle'}
              </button>
            </div>
            <ExcelImport onImport={handleExcelImport} />
          </header>

          <div className="grid gap-4">
            {showForm ? (
              <ContactForm onSubmit={addContact} />
            ) : (
              <>
                <BulkMessage
                  contacts={contacts}
                  selectedContacts={selectedContacts}
                  onToggleSelect={toggleSelectContact}
                />
                <ContactList
                  contacts={contacts}
                  onDelete={deleteContact}
                  selectedContacts={selectedContacts}
                  onToggleSelect={toggleSelectContact}
                  onMessageSent={handleMessageSent}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}