/**
 * Helper para manejar localStorage de forma segura
 * Compatible con SSR y Node.js 25+ que tiene localStorage experimental
 */

/**
 * Verifica si estamos en un navegador real (no SSR, no Node.js)
 */
export function isBrowser(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    typeof window.document.createElement !== 'undefined'
  );
}

/**
 * Verifica si localStorage está disponible y funciona correctamente
 */
export function isLocalStorageAvailable(): boolean {
  if (!isBrowser()) return false;
  
  try {
    const storage = window.localStorage;
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Obtiene un valor de localStorage de forma segura
 */
export function getStorageItem(key: string): string | null {
  if (!isLocalStorageAvailable()) return null;
  
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Guarda un valor en localStorage de forma segura
 */
export function setStorageItem(key: string, value: string): boolean {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Elimina un valor de localStorage de forma segura
 */
export function removeStorageItem(key: string): boolean {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Limpia todo el localStorage de forma segura
 */
export function clearStorage(): boolean {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    window.localStorage.clear();
    return true;
  } catch {
    return false;
  }
}
