// Store OTP temporarily (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export function storeOTP(phone: string, otp: string): void {
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore.set(phone, { otp, expiresAt });
}

export function getOTP(phone: string): string | null {
  const stored = otpStore.get(phone);
  if (!stored) return null;

  // Check if expired
  if (stored.expiresAt < Date.now()) {
    otpStore.delete(phone);
    return null;
  }

  return stored.otp;
}

export function clearOTP(phone: string): void {
  otpStore.delete(phone);
}
