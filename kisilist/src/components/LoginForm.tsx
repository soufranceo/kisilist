import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { verifyPassword } from '../utils/auth';

interface LoginFormProps {
  onLogin: () => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await verifyPassword(password);
    
    if (isValid) {
      onLogin();
      setError('');
    } else {
      setError('Hatalı şifre!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex items-center justify-center mb-6">
          <Lock className="text-blue-500 w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Giriş</h2>
        <div className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifre"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Giriş Yap
          </button>
        </div>
      </form>
    </div>
  );
}