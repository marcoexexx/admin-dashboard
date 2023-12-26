export function generateCouponLabel(length: number = 3): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Define the character set for the username
  let result = 'RANGOON-COUPON-';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

