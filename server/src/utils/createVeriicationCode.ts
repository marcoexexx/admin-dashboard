import crypto from 'crypto'

export function createVerificationCode() {
  const verificationCode = crypto.randomBytes(32).toString("hex")

  const hashedVerificationCode = crypto
    .createHash("sha256")
    .update(verificationCode)
    .digest("hex")

  return { verificationCode, hashedVerificationCode }
}
