/**
 * Generates a universally unique identifier (UUID) string of specified length.
 *
 * @param length The length of the UUID to be generated. Defaults to 24.
 * @returns A string representing the generated UUID.
 */
export function generateRandomHex(length: number = 24): string {
  const bytes = new Uint8Array(length / 2); // [0u8; length/2]

  window.crypto.getRandomValues(bytes); // rand::rng_thread().fill_bytes(&mut bytes)

  // hex::encode(&bytes)
  return Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Generates a universally unique identifier (UUID) string in the format 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.
 *
 * @returns A string representing the generated UUID.
 */
export function generateUuid4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    },
  );
}
