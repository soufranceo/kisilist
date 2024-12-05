import { AuthState } from '../types/Contact';

const CORRECT_PASSWORD = '$2a$12$K8HFh3/XzXoFvvZph0EyIOBHWUF9HHJGe6/nhPqzX9Jk7YKFp.2Hy'; // Zaq123...

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyPassword(password: string): Promise<boolean> {
  const hashedInput = await hashPassword(password);
  const hashedCorrect = await hashPassword('Zaq123...');
  return hashedInput === hashedCorrect;
}