function generateUuid(length: number = 24): string {
  const bytes = new Uint8Array(length / 2);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}
