import { useState, useEffect, useCallback } from 'react';
import { API_URL, WORKSPACE_ID, adminHeaders } from '@/lib/hornerodb';

interface DBRecord {
    id: string;
    [key: string]: any;
}

interface UseDBOptions {
    collection: string;
    autoFetch?: boolean;
}

export function useHorneroDB({ collection, autoFetch = false }: UseDBOptions) {
    const [records, setRecords] = useState<DBRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRecords = useCallback(async (query?: string) => {
        setLoading(true);
        setError(null);
        try {
            const qs = query ? `?query=${encodeURIComponent(query)}` : '';
            const response = await fetch(`${API_URL}/workspaces/${WORKSPACE_ID}/data/${collection}${qs}`, {
                headers: adminHeaders()
            });
            if (!response.ok) throw new Error('Error al cargar datos');
            const result = await response.json();
            // Assume result.data is an array
            setRecords(Array.isArray(result.data) ? result.data : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, [collection]);

    const createRecord = useCallback(async (record: Record<string, unknown>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/workspaces/${WORKSPACE_ID}/data/${collection}`, {
                method: 'POST',
                headers: adminHeaders(),
                body: JSON.stringify(record)
            });
            if (!response.ok) throw new Error('Error al crear registro');
            const result = await response.json();
            await fetchRecords();
            return result.data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [collection, fetchRecords]);

    const updateRecord = useCallback(async (id: string, record: Partial<Record<string, unknown>>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/workspaces/${WORKSPACE_ID}/data/${collection}/${id}`, {
                method: 'PATCH',
                headers: adminHeaders(),
                body: JSON.stringify(record)
            });
            if (!response.ok) throw new Error('Error al actualizar registro');
            const result = await response.json();
            await fetchRecords();
            return result.data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [collection, fetchRecords]);

    const deleteRecord = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/workspaces/${WORKSPACE_ID}/data/${collection}/${id}`, {
                method: 'DELETE',
                headers: adminHeaders(),
            });
            if (!response.ok) throw new Error('Error al eliminar registro');
            await fetchRecords();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [collection, fetchRecords]);

    useEffect(() => {
        if (autoFetch) {
            fetchRecords();
        }
    }, [autoFetch, fetchRecords]);

    return {
        records,
        loading,
        error,
        fetchRecords,
        createRecord,
        updateRecord,
        deleteRecord,
    };
}

export default useHorneroDB;
