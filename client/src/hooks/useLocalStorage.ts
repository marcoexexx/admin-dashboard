type LocalStorageKey =
  | "CART"
  | "PICKUP_FORM"
  | "CHECKOUT_FORM_ACTIVE_STEP"
  | "VERIFICATION_CODE";

export function useLocalStorage() {
  const get = <T>(key: LocalStorageKey): T | undefined => {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
    return undefined;
  };

  const set = <T>(key: LocalStorageKey, payload: T) => {
    localStorage.setItem(key, JSON.stringify(payload));
  };

  const remove = (key: LocalStorageKey) => {
    localStorage.removeItem(key);
  };

  return { get, set, remove };
}
