export const API_URL = 'http://localhost:8080/api/v1';
export const WORKSPACE_ID = 'badcde1e-7dbc-4f83-961c-8ab522964df8'; // Replace with actual ID
export const API_KEY = 'key_badcde1eLsvD6tg25stpUbNL3JdeZBMVh5xFkyIw'; // Replace with public Key

const headers = {
    'Authorization': API_KEY,
    'X-Workspace-ID': WORKSPACE_ID
};

export async function fetchServicios() {
    const response = await fetch(`${API_URL}/workspaces/${WORKSPACE_ID}/data/servicios`, {
        headers
    });
    if (!response.ok) {
        throw new Error('Failed to fetch services');
    }
    const result = await response.json();
    return result.data || [];
}

export async function fetchEmpleados() {
    const response = await fetch(`${API_URL}/workspaces/${WORKSPACE_ID}/data/empleados`, {
        headers
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
            ...headers
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
    }
    return await response.json();
}
