"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function VerifyOtpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        toast({ title: "Verification successful!", description: "Your account is now verified." })
        router.push("/dashboard")
      } else {
        toast({ title: "Invalid or expired OTP", description: data.error || "Please try again.", variant: "destructive" })
      }
    } catch (err) {
      toast({ title: "Verification failed", description: "Please try again.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        toast({ title: "OTP resent", description: "Check your email for a new code." })
      } else {
        toast({ title: "Failed to resend OTP", variant: "destructive" })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Verify Your Email</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to <span className="font-semibold">{email}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                minLength={6}
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
                className="text-center tracking-widest text-lg font-mono"
                autoFocus
              />
              <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
                {loading ? "Verifying..." : "Verify"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Button variant="link" onClick={handleResend} disabled={loading}>
                Resend OTP
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 