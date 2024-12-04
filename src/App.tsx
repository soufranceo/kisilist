import React, { useState, useEffect } from 'react';
import { Users, PlusCircle } from 'lucide-react';
import { ContactForm } from './components/ContactForm';
import { ContactList } from './components/ContactList';
import { ExcelImport } from './components/ExcelImport';
import { BulkMessage } from './components/BulkMessage';
import { LoginForm } from './components/LoginForm';
import type { Contact, AuthState } from './types/Contact';

export default function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [auth, setAuth] = useState<AuthState>({ isAuthenticated: false });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      const parsedAuth = JSON.parse(savedAuth);
      const lastLoginTime = new Date(parsedAuth.lastLoginTime);
      const now = new Date();
      const hoursSinceLogin = (now.getTime() - lastLoginTime.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLogin < 24) {
        setAuth({ isAuthenticated: true, lastLoginTime });
      }
    }
  }, []);

  const handleLogin = () => {
    const newAuth = { 
      isAuthenticated: true, 
      lastLoginTime: new Date() 
    };
    setAuth(newAuth);
    localStorage.setItem('auth', JSON.stringify(newAuth));
  };

  const addContact = (newContact: Omit<Contact, 'id' | 'createdAt'>) => {
    const contact: Contact = {
      ...newContact,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setContacts([...contacts, contact]);
    setShowForm(false);
  };

  const deleteContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    setSelectedContacts(selectedContacts.filter(contactId => contactId !== id));
  };

  const handleExcelImport = (importedContacts: Omit<Contact, 'id' | 'createdAt'>[]) => {
    const newContacts = importedContacts.map(contact => ({
      ...contact,
      id: crypto.randomUUID(),
      createdAt: new Date()
    }));
    setContacts([...contacts, ...newContacts]);
  };

  const toggleSelectContact = (id: string) => {
    setSelectedContacts(prev =>
      prev.includes(id)
        ? prev.filter(contactId => contactId !== id)
        : [...prev, id]
    );
  };

  const handleMessageSent = (contactId: string) => {
    setContacts(contacts.map(contact => 
      contact.id === contactId 
        ? { ...contact, lastMessageDate: new Date() }
        : contact
    ));
  };

  if (!auth.isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

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