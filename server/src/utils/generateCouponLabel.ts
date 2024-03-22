export function generateLabel(name: string): string {
  const length = 12;
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Define the character set for the username
  let result = `RANGOON-${name.toUpperCase()}-`;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}
