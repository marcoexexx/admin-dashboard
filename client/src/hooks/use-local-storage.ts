type LocalStorageKey = 
  | "CARTS"
  | "PICKUP_FORM"

export function useLocalStorage() {
  const get = <T>(key: LocalStorageKey): T|undefined => {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw) as T
    return undefined
  }

  const set = <T>(key: LocalStorageKey, payload: T) => {
    localStorage.setItem(key, JSON.stringify(payload))
  }

  return { get, set }
}
