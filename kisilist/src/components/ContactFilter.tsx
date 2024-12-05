import React from 'react';
import { Search } from 'lucide-react';

interface ContactFilterProps {
  filters: {
    search: string;
    field: string;
    gender: string;
    hometown: string;
    location: string;
  };
  onFilterChange: (filters: {
    search: string;
    field: string;
    gender: string;
    hometown: string;
    location: string;
  }) => void;
}

export function ContactFilter({ filters, onFilterChange }: ContactFilterProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            placeholder="Ara..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <select
          value={filters.gender}
          onChange={(e) => onFilterChange({ ...filters, gender: e.target.value })}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tüm Cinsiyetler</option>
          <option value="Erkek">Erkek</option>
          <option value="Kadın">Kadın</option>
        </select>

        <select
          value={filters.hometown}
          onChange={(e) => onFilterChange({ ...filters, hometown: e.target.value })}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tüm Memleketler</option>
          <option value="İstanbul">İstanbul</option>
          <option value="Ankara">Ankara</option>
          <option value="İzmir">İzmir</option>
          <option value="Bursa">Bursa</option>
          <option value="Antalya">Antalya</option>
          <option value="Adana">Adana</option>
          <option value="Konya">Konya</option>
        </select>

        <select
          value={filters.location}
          onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tüm Konumlar</option>
          <option value="İstanbul">İstanbul</option>
          <option value="Ankara">Ankara</option>
          <option value="İzmir">İzmir</option>
          <option value="Bursa">Bursa</option>
          <option value="Antalya">Antalya</option>
          <option value="Adana">Adana</option>
          <option value="Konya">Konya</option>
        </select>

        <button
          onClick={() => onFilterChange({
            search: '',
            field: 'all',
            gender: '',
            hometown: '',
            location: ''
          })}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
        >
          Filtreleri Temizle
        </button>
      </div>
    </div>
  );
}