import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import type { Contact } from '../types/Contact';
import { formatPhoneForWhatsApp } from '../utils/phoneFormat';

interface ContactFormProps {
  onSubmit: (contact: Omit<Contact, 'id' | 'createdAt'>) => void;
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState({
    facebookId: '',
    name: '',
    lastname: '',
    phone: '',
    gender: '',
    hometown: '',
    location: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Telefon numarasını formatla
    const formattedData = {
      ...formData,
      phone: formatPhoneForWhatsApp(formData.phone)
    };
    onSubmit(formattedData);
    setFormData({ 
      facebookId: '',
      name: '', 
      lastname: '', 
      phone: '', 
      gender: '', 
      hometown: '', 
      location: '' 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Yeni Kişi Ekle</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Facebook ID"
          value={formData.facebookId}
          onChange={(e) => setFormData({ ...formData, facebookId: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Ad"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Soyad"
            value={formData.lastname}
            onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <input
          type="tel"
          placeholder="Telefon Numarası"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          required
        />
        <select
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Cinsiyet Seçin</option>
          <option value="Erkek">Erkek</option>
          <option value="Kadın">Kadın</option>
        </select>
        <input
          type="text"
          placeholder="Memleket"
          value={formData.hometown}
          onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Konum"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
        >
          <PlusCircle size={20} />
          Kişi Ekle
        </button>
      </div>
    </form>
  );
}