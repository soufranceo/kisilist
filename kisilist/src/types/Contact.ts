export interface Contact {
  id: string;
  facebookId: string;
  phone: string;
  name: string;
  lastname: string;
  gender: string;
  hometown: string;
  location: string;
  createdAt: Date;
  lastMessageDate?: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  lastLoginTime?: Date;
}