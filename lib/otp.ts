// Generate a 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Get expiry timestamp (default 10 minutes from now)
export function getOTPExpiry(minutes = 10): Date {
  const now = new Date()
  now.setMinutes(now.getMinutes() + minutes)
  return now
} 