"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  })
  const [twoFactor, setTwoFactor] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const { toast } = useToast()

  // Handlers for each section
  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading("profile")
    setTimeout(() => {
      setLoading(null)
      toast({ title: "Profile updated", description: "Your profile information has been saved." })
    }, 1000)
  }
  const handleAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading("account")
    setTimeout(() => {
      setLoading(null)
      toast({ title: "Account updated", description: "Your account details have been updated." })
    }, 1000)
  }
  const handleNotifications = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading("notifications")
    setTimeout(() => {
      setLoading(null)
      toast({ title: "Notifications updated", description: "Your notification preferences have been saved." })
    }, 1000)
  }
  const handleSecurity = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading("security")
    setTimeout(() => {
      setLoading(null)
      toast({ title: "Security updated", description: "Your security settings have been updated." })
    }, 1000)
  }

  return (
    <DashboardLayout>
      <Toaster />
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground transition-colors">Settings</h1>
          <p className="text-muted-foreground mt-1 transition-colors">Manage your account settings and preferences</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Section */}
          <form onSubmit={handleProfile}>
            <Card className="bg-card text-foreground transition-colors">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" className="bg-background text-foreground transition-colors" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" className="bg-background text-foreground transition-colors" />
                </div>
                <Button className="bg-primary text-primary-foreground transition-colors" type="submit" disabled={loading === "profile"}>
                  {loading === "profile" ? "Saving..." : "Save Profile"}
                </Button>
              </CardContent>
            </Card>
          </form>

          {/* Account Section */}
          <form onSubmit={handleAccount}>
            <Card className="bg-card text-foreground transition-colors">
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Change your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="Username" className="bg-background text-foreground transition-colors" />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="New password" className="bg-background text-foreground transition-colors" />
                </div>
                <Button className="bg-primary text-primary-foreground transition-colors" type="submit" disabled={loading === "account"}>
                  {loading === "account" ? "Updating..." : "Update Account"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Notifications Section */}
          <form onSubmit={handleNotifications}>
            <Card className="bg-card text-foreground transition-colors">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Control your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Email Notifications</Label>
                  <Switch checked={notifications.email} onCheckedChange={v => setNotifications(n => ({ ...n, email: v }))} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>SMS Notifications</Label>
                  <Switch checked={notifications.sms} onCheckedChange={v => setNotifications(n => ({ ...n, sms: v }))} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Push Notifications</Label>
                  <Switch checked={notifications.push} onCheckedChange={v => setNotifications(n => ({ ...n, push: v }))} />
                </div>
                <Button className="bg-primary text-primary-foreground transition-colors" type="submit" disabled={loading === "notifications"}>
                  {loading === "notifications" ? "Saving..." : "Save Notifications"}
                </Button>
              </CardContent>
            </Card>
          </form>

          {/* Security Section */}
          <form onSubmit={handleSecurity}>
            <Card className="bg-card text-foreground transition-colors">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Two-Factor Authentication</Label>
                  <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                </div>
                <div>
                  <Label htmlFor="recovery">Recovery Email</Label>
                  <Input id="recovery" type="email" placeholder="recovery@example.com" className="bg-background text-foreground transition-colors" />
                </div>
                <Button className="bg-primary text-primary-foreground transition-colors" type="submit" disabled={loading === "security"}>
                  {loading === "security" ? "Updating..." : "Update Security"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
} 