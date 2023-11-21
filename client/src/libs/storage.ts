export function getStore<T extends any>(key: string): undefined | T {
  const raw = localStorage.getItem(key);
  if (raw) return JSON.parse(raw);
}

export function setStore<T>(key: string, data: T): T {
  const raw = JSON.stringify(data);
  localStorage.setItem(key, raw);
  return data;
}
