export const API_URL = 'http://localhost:8080/api/v1';
export const WORKSPACE_ID = 'badcde1e-7dbc-4f83-961c-8ab522964df8'; // Replace with actual ID
export const API_KEY = 'key_badcde1eLsvD6tg25stpUbNL3JdeZBMVh5xFkyIw'; // Replace with public Key

// ---- Public Config Helpers ----
const publicHeaders = {
    'Authorization': API_KEY,
    'X-Workspace-ID': WORKSPACE_ID
};

// ---- Auth Helpers (PocketID) ----
export function getAuthToken(): string | null {
    return localStorage.getItem('demo_admin_token');
}

export function setAuthToken(token: string) {
    localStorage.setItem('demo_admin_token', token);
}

export function logout() {
    localStorage.removeItem('demo_admin_token');
    localStorage.removeItem('demo_admin_user');
}

export function loginWithPocketID() {
    const callbackUrl = encodeURIComponent(window.location.origin + '/admin');
    window.location.href = `${API_URL}/auth/oidc/login?redirect=${callbackUrl}`;
}

export async function fetchCurrentUser() {
    const token = getAuthToken();
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        logout();
        throw new Error('Invalid session');
    }

    const result = await response.json();
    localStorage.setItem('demo_admin_user', JSON.stringify(result.data));
    return result.data;
}

export function getCurrentUser() {
    const userStr = localStorage.getItem('demo_admin_user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
}

export function isAuthenticated(): boolean {
    return !!getAuthToken() && !!getCurrentUser();
}

// ---- Admin API Helpers ----
export const adminHeaders = () => ({
    'Authorization': `Bearer ${getAuthToken()}`,
    'Content-Type': 'application/json'
});

export async function fetchServicios() {
    const response = await fetch(`${API_URL}/workspaces/${WORKSPACE_ID}/data/servicios`, {
        headers: publicHeaders
    });
    if (!response.ok) {
        throw new Error('Failed to fetch services');
    }
    const result = await response.json();
    return result.data || [];
}

export async function fetchEmpleados() {
    const response = await fetch(`${API_URL}/workspaces/${WORKSPACE_ID}/data/empleados`, {
        headers: publicHeaders
    });
    if (!response.ok) {
        throw new Error('Failed to fetch employees');
    }
    const result = await response.json();
    return result.data || [];
}

export async function createTurno(data: any) {
    const response = await fetch(`${API_URL}/workspaces/${WORKSPACE_ID}/data/turnos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...publicHeaders
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
    }
    return await response.json();
}
