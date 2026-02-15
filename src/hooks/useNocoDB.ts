import { useState, useEffect, useCallback } from 'react';
import NOCODB_CONFIG, { TABLES } from '@/lib/nocodb';

interface NocoDBRecord {
  Id?: number;
  [key: string]: unknown;
}

interface UseNocoDBOptions {
  tableId: string;
  autoFetch?: boolean;
}

export function useNocoDB({ tableId, autoFetch = false }: UseNocoDBOptions) {
  const [records, setRecords] = useState<NocoDBRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async (query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${NOCODB_CONFIG.baseUrl}/api/v2/tables/${tableId}/records?offset=0&limit=100${query ? '&' + query : ''}`;
      const response = await fetch(url, {
        headers: {
          'xc-token': NOCODB_CONFIG.token,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setRecords(data.list || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [tableId]);

  const createRecord = useCallback(async (record: NocoDBRecord) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${NOCODB_CONFIG.baseUrl}/api/v2/tables/${tableId}/records`, {
        method: 'POST',
        headers: {
          'xc-token': NOCODB_CONFIG.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      await fetchRecords();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tableId, fetchRecords]);

  const updateRecord = useCallback(async (id: number, record: Partial<NocoDBRecord>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${NOCODB_CONFIG.baseUrl}/api/v2/tables/${tableId}/records/${id}`, {
        method: 'PATCH',
        headers: {
          'xc-token': NOCODB_CONFIG.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      await fetchRecords();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tableId, fetchRecords]);

  const deleteRecord = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${NOCODB_CONFIG.baseUrl}/api/v2/tables/${tableId}/records/${id}`, {
        method: 'DELETE',
        headers: {
          'xc-token': NOCODB_CONFIG.token,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      await fetchRecords();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tableId, fetchRecords]);

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

export default useNocoDB;
