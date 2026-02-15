import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://127.0.0.1:8090');

export const PB_URL = 'http://127.0.0.1:8090';

export interface User {
  id: string;
  email: string;
  nombre: string;
  telefono: string;
  role: 'admin' | 'recepcionista' | 'empleado';
}

export async function login(email: string, password: string): Promise<User> {
  const authData = await pb.collection('usuarios').authWithPassword(email, password);
  
  const user = authData.record as unknown as User;
  
  localStorage.setItem('pb_token', pb.authStore.token);
  localStorage.setItem('pb_user', JSON.stringify(user));
  
  return user;
}

export function logout(): void {
  pb.authStore.clear();
  localStorage.removeItem('pb_token');
  localStorage.removeItem('pb_user');
}

export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('pb_user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem('pb_token');
  if (!token) return false;
  
  pb.authStore.save(token, getCurrentUser());
  return pb.authStore.isValid;
}

export function getToken(): string | null {
  return localStorage.getItem('pb_token');
}
