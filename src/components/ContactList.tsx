import React, { useState } from 'react';
import { MessageCircle, Trash2, Facebook, AlertCircle, ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import type { Contact } from '../types/Contact';
import { formatPhoneForWhatsApp } from '../utils/phoneFormat';

interface ContactListProps {
  contacts: Contact[];
  onDelete: (id: string) => void;
  selectedContacts: string[];
  onToggleSelect: (id: string) => void;
  onMessageSent: (contactId: string) => void;
}

export function ContactList({ contacts, onDelete, selectedContacts, onToggleSelect, onMessageSent }: ContactListProps) {
  const [showWarning, setShowWarning] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{ field: keyof Contact; direction: 'asc' | 'desc' } | null>(null);

  const getUniqueValues = (field: keyof Contact) => {
    return Array.from(new Set(contacts.map(contact => String(contact[field] || '')))).filter(Boolean).sort();
  };

  const handleSort = (field: keyof Contact) => {
    setSortConfig(current => {
      if (current?.field === field) {
        return current.direction === 'asc' 
          ? { field, direction: 'desc' } 
          : null;
      }
      return { field, direction: 'asc' };
    });
  };

  const filteredAndSortedContacts = contacts
    .filter(contact => {
      return Object.entries(filters).every(([field, value]) => {
        if (!value) return true;
        const contactValue = String(contact[field as keyof Contact] || '').toLowerCase();
        return contactValue === value.toLowerCase();
      });
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const { field, direction } = sortConfig;
      const aValue = String(a[field] || '');
      const bValue = String(b[field] || '');
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

  const openWhatsApp = async (contact: Contact) => {
    if (contact.lastMessageDate) {
      setShowWarning(contact.id);
      return;
    }
    const formattedPhone = formatPhoneForWhatsApp(contact.phone);
    window.open(`https://wa.me/${formattedPhone}`, '_blank');
    onMessageSent(contact.id);
  };

  const confirmSendMessage = (contact: Contact) => {
    if (window.confirm('Bu kişiye daha önce mesaj gönderilmiş. Tekrar göndermek istiyor musunuz?')) {
      const formattedPhone = formatPhoneForWhatsApp(contact.phone);
      window.open(`https://wa.me/${formattedPhone}`, '_blank');
      onMessageSent(contact.id);
    }
    setShowWarning(null);
  };

  const openFacebook = (facebookId: string) => {
    window.open(`https://facebook.com/${facebookId}`, '_blank');
  };

  const renderColumnHeader = (field: keyof Contact, label: string) => {
    const activeFilter = filters[field];
    const sortDirection = sortConfig?.field === field ? sortConfig.direction : null;
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    return (
      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        <div className="flex items-center gap-1">
          <div 
            onClick={() => handleSort(field)} 
            className="cursor-pointer hover:text-gray-700 flex items-center gap-1"
          >
            {label}
            {sortDirection === 'asc' && <ChevronUp size={14} />}
            {sortDirection === 'desc' && <ChevronDown size={14} />}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`p-1 rounded hover:bg-gray-100 ${activeFilter ? 'text-blue-500' : ''}`}
            >
              <Filter size={14} />
            </button>
            {showFilterMenu && (
              <div className="absolute z-10 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="p-2 max-h-48 overflow-y-auto">
                  {getUniqueValues(field).map((value) => (
                    <div
                      key={value}
                      onClick={() => {
                        setFilters(prev => ({ ...prev, [field]: value }));
                        setShowFilterMenu(false);
                      }}
                      className={`px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 ${
                        activeFilter === value ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                    >
                      {value}
                    </div>
                  ))}
                </div>
                {activeFilter && (
                  <div className="p-2 border-t">
                    <button
                      onClick={() => {
                        const newFilters = { ...filters };
                        delete newFilters[field];
                        setFilters(newFilters);
                        setShowFilterMenu(false);
                      }}
                      className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
                    >
                      <X size={14} />
                      Filtreyi Temizle
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {activeFilter && (
            <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
              {activeFilter}
            </span>
          )}
        </div>
      </th>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 w-10">
                <input
                  type="checkbox"
                  checked={contacts.length > 0 && selectedContacts.length === contacts.length}
                  onChange={() => {
                    const allIds = contacts.map(c => c.id);
                    if (selectedContacts.length === contacts.length) {
                      allIds.forEach(id => onToggleSelect(id));
                    } else {
                      allIds.forEach(id => {
                        if (!selectedContacts.includes(id)) {
                          onToggleSelect(id);
                        }
                      });
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-2 w-24">İşlemler</th>
              {renderColumnHeader('facebookId', 'Facebook ID')}
              {renderColumnHeader('name', 'Ad')}
              {renderColumnHeader('lastname', 'Soyad')}
              {renderColumnHeader('phone', 'Telefon')}
              {renderColumnHeader('gender', 'Cinsiyet')}
              {renderColumnHeader('hometown', 'Memleket')}
              {renderColumnHeader('location', 'Konum')}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedContacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={() => onToggleSelect(contact.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openFacebook(contact.facebookId)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Facebook profilini aç"
                    >
                      <Facebook size={18} />
                    </button>
                    <button
                      onClick={() => openWhatsApp(contact)}
                      className="text-green-600 hover:text-green-900 relative"
                      title="WhatsApp'ta mesaj gönder"
                    >
                      <MessageCircle size={18} />
                      {contact.lastMessageDate && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </button>
                    <button
                      onClick={() => onDelete(contact.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Kişiyi sil"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  {showWarning === contact.id && (
                    <div className="absolute bg-white p-4 rounded-lg shadow-lg border border-yellow-500 z-10">
                      <div className="flex items-center gap-2 text-yellow-600 mb-2">
                        <AlertCircle size={20} />
                        <span>Uyarı</span>
                      </div>
                      <p className="text-sm mb-2">Bu kişiye daha önce mesaj gönderilmiş. Devam etmek istiyor musunuz?</p>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowWarning(null)}
                          className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                        >
                          İptal
                        </button>
                        <button
                          onClick={() => confirmSendMessage(contact)}
                          className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Devam Et
                        </button>
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-4 py-2">{contact.facebookId}</td>
                <td className="px-4 py-2">{contact.name}</td>
                <td className="px-4 py-2">{contact.lastname}</td>
                <td className="px-4 py-2">{contact.phone}</td>
                <td className="px-4 py-2">{contact.gender}</td>
                <td className="px-4 py-2">{contact.hometown}</td>
                <td className="px-4 py-2">{contact.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}