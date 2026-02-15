import { useState, useEffect, useCallback } from 'react';
import { pb, PB_URL } from '@/lib/pocketbase';

interface PocketBaseRecord {
  id: string;
  [key: string]: unknown;
}

interface UsePocketBaseOptions {
  collection: string;
  autoFetch?: boolean;
}

export function usePocketBase({ collection, autoFetch = false }: UsePocketBaseOptions) {
  const [records, setRecords] = useState<PocketBaseRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async (query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await pb.collection(collection).getList(1, 100, {
        sort: '-created',
        filter: query || '',
      });
      setRecords(result.items as PocketBaseRecord[]);
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
      const result = await pb.collection(collection).create(record);
      await fetchRecords();
      return result;
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
      const result = await pb.collection(collection).update(id, record);
      await fetchRecords();
      return result;
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
      await pb.collection(collection).delete(id);
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

export default usePocketBase;
