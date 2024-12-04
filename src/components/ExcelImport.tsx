import React, { useRef } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { Contact } from '../types/Contact';

interface ExcelImportProps {
  onImport: (contacts: Omit<Contact, 'id' | 'createdAt'>[]) => void;
}

export function ExcelImport({ onImport }: ExcelImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const contacts = jsonData.map((row: any) => ({
        facebookId: row['id'] || '',
        phone: row['phone'] || '',
        name: row['name'] || '',
        lastname: row['lastname'] || '',
        gender: row['gender'] || '',
        hometown: row['hometown'] || '',
        location: row['location'] || ''
      }));

      onImport(contacts);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="mb-4">
      <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer">
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
        />
        <FileSpreadsheet className="w-6 h-6 mr-2 text-blue-500" />
        <span className="text-gray-600">Excel Dosyası Yükle</span>
      </label>
    </div>
  );
}