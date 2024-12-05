import React, { useState } from 'react';
import { MessageSquare, Copy, Download } from 'lucide-react';
import type { Contact } from '../types/Contact';
import { generateVCF, downloadVCF } from '../utils/vcf';
import { formatPhoneForWhatsApp } from '../utils/phoneFormat';

interface BulkMessageProps {
  contacts: Contact[];
  selectedContacts: string[];
  onToggleSelect: (id: string) => void;
}

export function BulkMessage({ contacts, selectedContacts }: BulkMessageProps) {
  const [message, setMessage] = useState('');
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  const getSelectedContacts = () => {
    return contacts.filter(contact => selectedContacts.includes(contact.id));
  };

  const sendMessages = () => {
    const selectedContacts = getSelectedContacts();
    const encodedMessage = encodeURIComponent(message);
    
    selectedContacts.forEach(contact => {
      const formattedPhone = formatPhoneForWhatsApp(contact.phone);
      const url = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
      window.open(url, '_blank');
    });
  };

  const exportVCF = () => {
    const selectedContactsData = getSelectedContacts();
    const vcfContent = generateVCF(selectedContactsData);
    downloadVCF(vcfContent);
  };

  const copyPhonesToClipboard = () => {
    const phones = getSelectedContacts()
      .map(contact => formatPhoneForWhatsApp(contact.phone))
      .join('\n');
    navigator.clipboard.writeText(phones).then(() => {
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Toplu Mesaj Gönder</h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mesajınızı yazın..."
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 mb-4"
          rows={4}
        />
        
        <div className="space-y-3">
          <button
            onClick={sendMessages}
            disabled={selectedContacts.length === 0 || !message}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <MessageSquare size={20} />
            WhatsApp Mesajı Gönder ({selectedContacts.length})
          </button>

          <div className="flex gap-2">
            <button
              onClick={copyPhonesToClipboard}
              className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 px-3 py-2 rounded border hover:bg-gray-50"
            >
              <Copy size={16} />
              Numaraları Kopyala
            </button>

            <button
              onClick={exportVCF}
              disabled={selectedContacts.length === 0}
              className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 px-3 py-2 rounded border hover:bg-gray-50"
            >
              <Download size={16} />
              VCF İndir
            </button>
          </div>
          
          {showCopiedMessage && (
            <div className="text-center bg-green-100 text-green-800 px-3 py-1 rounded text-sm">
              Kopyalandı!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}