import crypto from 'crypto'

export function generateUuid(length: number = 24) {
  const bytes = crypto.randomBytes(length / 2)
  return bytes.toString("hex")
}
