/**
 * Offline storage utility using IndexedDB for local data persistence
 */

const DB_NAME = 'congicore-offline';
const DB_VERSION = 1;
const STORES = {
  memories: 'memories',
  documents: 'documents',
  syncQueue: 'syncQueue',
};

export interface OfflineMemory {
  id?: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  synced: boolean;
}

export interface OfflineDocument {
  id?: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  synced: boolean;
}

export interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  resource: 'memory' | 'document';
  data: Record<string, unknown>;
  timestamp: string;
}

/**
 * Initialize IndexedDB
 */
export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORES.memories)) {
        db.createObjectStore(STORES.memories, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORES.documents)) {
        db.createObjectStore(STORES.documents, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORES.syncQueue)) {
        db.createObjectStore(STORES.syncQueue, { keyPath: 'id' });
      }
    };
  });
}

/**
 * Save memory to offline storage
 */
export async function saveOfflineMemory(memory: OfflineMemory): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.memories, 'readwrite');
    const store = transaction.objectStore(STORES.memories);
    const request = store.put(memory);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Get all offline memories
 */
export async function getOfflineMemories(): Promise<OfflineMemory[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.memories, 'readonly');
    const store = transaction.objectStore(STORES.memories);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

/**
 * Save document to offline storage
 */
export async function saveOfflineDocument(document: OfflineDocument): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.documents, 'readwrite');
    const store = transaction.objectStore(STORES.documents);
    const request = store.put(document);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Get all offline documents
 */
export async function getOfflineDocuments(): Promise<OfflineDocument[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.documents, 'readonly');
    const store = transaction.objectStore(STORES.documents);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

/**
 * Add operation to sync queue
 */
export async function addToSyncQueue(operation: SyncOperation): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.syncQueue, 'readwrite');
    const store = transaction.objectStore(STORES.syncQueue);
    const request = store.add(operation);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Get all sync operations
 */
export async function getSyncQueue(): Promise<SyncOperation[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.syncQueue, 'readonly');
    const store = transaction.objectStore(STORES.syncQueue);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

/**
 * Remove operation from sync queue
 */
export async function removeFromSyncQueue(id: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.syncQueue, 'readwrite');
    const store = transaction.objectStore(STORES.syncQueue);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Check if online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Listen for online/offline events
 */
export function onOnlineStatusChange(callback: (online: boolean) => void): () => void {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}
