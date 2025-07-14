"use client"

import { useState, useRef } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function ProfilePage() {
  const [name, setName] = useState("Adunni Okafor")
  const [email, setEmail] = useState("adunni@example.com")
  const [avatar, setAvatar] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState<string | null>(null)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading("profile")
    setTimeout(() => {
      setLoading(null)
      toast({ title: "Profile updated", description: "Your profile information has been saved." })
    }, 1000)
  }

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast({ title: "Passwords do not match", description: "Please make sure both passwords are the same.", variant: "destructive" })
      return
    }
    setLoading("password")
    setTimeout(() => {
      setLoading(null)
      setPassword("")
      setConfirmPassword("")
      toast({ title: "Password changed", description: "Your password has been updated." })
    }, 1000)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setAvatar(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <DashboardLayout>
      <Toaster />
      <div className="space-y-8 max-w-2xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-foreground transition-colors">Profile</h1>
          <p className="text-muted-foreground mt-1 transition-colors">Manage your personal information and account security</p>
        </div>
        <form onSubmit={handleProfile}>
          <Card className="bg-card text-foreground transition-colors">
            <CardHeader>
              <CardTitle>Personal Info</CardTitle>
              <CardDescription>Update your name, email, and avatar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative w-20 h-20">
                  <img
                    src={avatar || "/placeholder-user.jpg"}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border border-border"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="absolute bottom-0 right-0 text-xs px-2 py-1"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={e => setName(e.target.value)} className="bg-background text-foreground transition-colors" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-background text-foreground transition-colors" />
                  </div>
                </div>
              </div>
              <Button className="bg-primary text-primary-foreground transition-colors" type="submit" disabled={loading === "profile"}>
                {loading === "profile" ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </form>
        <form onSubmit={handlePassword}>
          <Card className="bg-card text-foreground transition-colors">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-background text-foreground transition-colors" />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="bg-background text-foreground transition-colors" />
              </div>
              <Button className="bg-primary text-primary-foreground transition-colors" type="submit" disabled={loading === "password"}>
                {loading === "password" ? "Updating..." : "Change Password"}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  )
} 