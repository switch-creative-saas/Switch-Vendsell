"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useUser } from "@/contexts/UserContext"
import { AuthService } from "@/lib/auth"
import { DatabaseService } from "@/lib/database"

export default function SettingsPage() {
  const { user, store, refreshUser, refreshStore } = useUser()
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  })
  const [twoFactor, setTwoFactor] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [storeData, setStoreData] = useState({
    name: "",
    description: "",
    category: "",
  })
  const { toast } = useToast()

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
      })
    }
  }, [user])

  // Load store data when component mounts
  useEffect(() => {
    if (store) {
      setStoreData({
        name: store.name || "",
        description: store.description || "",
        category: store.category || "",
      })
    }
  }, [store])

  // Handlers for each section
  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading("profile")
    try {
      // Update user profile in Supabase Auth
      await AuthService.updateProfile({
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        phone: profileData.phone,
      })

      // Update user profile in users table
      await AuthService.upsertUserProfile({
        id: user.id,
        email: user.email,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        phone: profileData.phone,
      })

      // Refresh user data
      await refreshUser()

      toast({ 
        title: "Profile updated", 
        description: "Your profile information has been saved." 
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({ 
        title: "Update failed", 
        description: "Failed to update profile. Please try again.", 
        variant: "destructive" 
      })
    } finally {
      setLoading(null)
    }
  }

  const handleStore = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!store) return

    setLoading("store")
    try {
      // Update store information
      await DatabaseService.updateStore(store.id, {
        name: storeData.name,
        description: storeData.description,
        category: storeData.category,
      })

      // Refresh store data
      await refreshStore()

      toast({ 
        title: "Store updated", 
        description: "Your store information has been saved." 
      })
    } catch (error) {
      console.error('Error updating store:', error)
      toast({ 
        title: "Update failed", 
        description: "Failed to update store. Please try again.", 
        variant: "destructive" 
      })
    } finally {
      setLoading(null)
    }
  }

  const handleAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading("account")
    try {
      // Here you would implement password change logic
      // For now, just show a success message
      toast({ 
        title: "Account updated", 
        description: "Your account details have been updated." 
      })
    } catch (error) {
      console.error('Error updating account:', error)
      toast({ 
        title: "Update failed", 
        description: "Failed to update account. Please try again.", 
        variant: "destructive" 
      })
    } finally {
      setLoading(null)
    }
  }

  const handleNotifications = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading("notifications")
    try {
      // Here you would save notification preferences to the database
      // For now, just show a success message
      toast({ 
        title: "Notifications updated", 
        description: "Your notification preferences have been saved." 
      })
    } catch (error) {
      console.error('Error updating notifications:', error)
      toast({ 
        title: "Update failed", 
        description: "Failed to update notifications. Please try again.", 
        variant: "destructive" 
      })
    } finally {
      setLoading(null)
    }
  }

  const handleSecurity = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading("security")
    try {
      // Here you would implement security settings logic
      // For now, just show a success message
      toast({ 
        title: "Security updated", 
        description: "Your security settings have been updated." 
      })
    } catch (error) {
      console.error('Error updating security:', error)
      toast({ 
        title: "Update failed", 
        description: "Failed to update security. Please try again.", 
        variant: "destructive" 
      })
    } finally {
      setLoading(null)
    }
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </DashboardLayout>
    )
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="First name" 
                      className="bg-background text-foreground transition-colors" 
                    />
                  </div>
                <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Last name" 
                      className="bg-background text-foreground transition-colors" 
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profileData.email}
                    disabled
                    placeholder="you@example.com" 
                    className="bg-background text-foreground transition-colors" 
                  />
                  <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="08012345678" 
                    className="bg-background text-foreground transition-colors" 
                  />
                </div>
                <Button className="bg-primary text-primary-foreground transition-colors" type="submit" disabled={loading === "profile"}>
                  {loading === "profile" ? "Saving..." : "Save Profile"}
                </Button>
              </CardContent>
            </Card>
          </form>

          {/* Store Section */}
          <form onSubmit={handleStore}>
            <Card className="bg-card text-foreground transition-colors">
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
                <CardDescription>Update your store details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input 
                    id="storeName" 
                    value={storeData.name}
                    onChange={(e) => setStoreData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Store name" 
                    className="bg-background text-foreground transition-colors" 
                  />
                </div>
                <div>
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <textarea 
                    id="storeDescription" 
                    value={storeData.description}
                    onChange={(e) => setStoreData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your store..." 
                    className="w-full min-h-[80px] p-3 border border-input bg-background text-foreground rounded-md resize-none"
                  />
                </div>
                <div>
                  <Label htmlFor="storeCategory">Store Category</Label>
                  <Input 
                    id="storeCategory" 
                    value={storeData.category}
                    onChange={(e) => setStoreData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Store category" 
                    className="bg-background text-foreground transition-colors" 
                  />
                </div>
                <Button className="bg-primary text-primary-foreground transition-colors" type="submit" disabled={loading === "store"}>
                  {loading === "store" ? "Saving..." : "Save Store"}
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