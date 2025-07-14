"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Eye, EyeOff, Store, User, Mail, Phone, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AuthService } from "@/lib/auth"
import { DatabaseService } from "@/lib/database"

const storeCategories = [
  "Fashion & Clothing",
  "Electronics & Gadgets",
  "Food & Beverages",
  "Beauty & Cosmetics",
  "Home & Garden",
  "Books & Education",
  "Sports & Fitness",
  "Arts & Crafts",
  "Automotive",
  "Health & Wellness",
  "Jewelry & Accessories",
  "Baby & Kids",
  "Other",
]

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    // Store Info
    storeName: "",
    storeSlug: "",
    storeCategory: "",
    storeDescription: "",

    // Agreements
    agreeTerms: false,
    agreeMarketing: false,
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [termsOpen, setTermsOpen] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Auto-generate store slug from store name
    if (field === "storeName") {
      const slug = value
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 20)
      setFormData((prev) => ({
        ...prev,
        storeSlug: slug,
      }))
    }
  }

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword || !formData.storeName || !formData.storeSlug || !formData.storeCategory || !formData.agreeTerms) {
      toast({ title: "Please fill in all required fields", variant: "destructive" })
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" })
      return
    }
    
    setLoading(true)
    
    try {
      // Create user account with Supabase Auth
      const authData = await AuthService.signUp(
        formData.email,
        formData.password,
        {
            first_name: formData.firstName,
            last_name: formData.lastName,
          phone: formData.phone
        }
      )
      
      if (!authData || !authData.user) {
        throw new Error("Failed to create user account")
      }
      
      // Create custom store with user's preferences
      let storeCreated = false
      let storeErrorMsg = ''
      try {
        await DatabaseService.createStore({
          name: formData.storeName,
          slug: formData.storeSlug,
          description: formData.storeDescription || `Welcome to ${formData.storeName}! Start adding your products to begin selling online.`,
          category: formData.storeCategory,
          owner_id: authData.user.id,
          plan: 'free',
          status: 'active',
          settings: {
          theme: 'modern-minimal',
            customColors: {
              primary: '#3B82F6',
              secondary: '#F59E0B',
              accent: '#10B981'
            },
            showPrices: true,
            showStock: true,
            enableWishlist: true,
            enableReviews: true,
            socialProof: true,
            whatsappIntegration: true
          }
        })
        storeCreated = true
      } catch (storeError: any) {
        console.error('Error creating store:', storeError)
        storeErrorMsg = storeError?.message || 'Unknown error creating store.'
      }
      
      if (!storeCreated) {
        toast({
          title: "Store creation failed",
          description: storeErrorMsg + " Please try again or contact support.",
          variant: "destructive"
        })
        setLoading(false)
        return
      }
      
      toast({ 
        title: "Account created successfully!", 
        description: "Welcome to Switch VendSell. Redirecting to your dashboard...",
        variant: "default"
      })
      
      // Redirect to dashboard
      router.push("/dashboard")
      
    } catch (err: any) {
      console.error('Registration error:', err)
      toast({ 
        title: "Registration failed", 
        description: err.message || "Please try again", 
        variant: "destructive" 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-foreground">Switch VendSell</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Your Store</h1>
          <p className="text-muted-foreground">Join thousands of successful Nigerian entrepreneurs</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-12 h-1 mx-2 ${step > stepNumber ? "bg-blue-500" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-0 shadow-xl dark:bg-[#18181b] bg-card/80 backdrop-blur-sm transition-colors duration-300">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                {step === 1 && <User className="h-5 w-5 text-blue-500" />}
                {step === 2 && <Store className="h-5 w-5 text-orange-600" />}
                {step === 3 && <ArrowRight className="h-5 w-5 text-blue-500" />}
                <span>
                  {step === 1 && "Personal Information"}
                  {step === 2 && "Store Details"}
                  {step === 3 && "Final Steps"}
                </span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {step === 1 && "Tell us about yourself"}
                {step === 2 && "Set up your online store"}
                {step === 3 && "Review and create your account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Step 1: Personal Information */}
                {step === 1 && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="Emeka"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                          className="bg-card text-foreground"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Joel"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                          className="bg-card text-foreground"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="emekajoel@example.com"
                          className="pl-10 bg-card text-foreground"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="08012345678"
                          className="pl-10 bg-card text-foreground"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="pl-10 pr-10 bg-card text-foreground"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="pl-10 pr-10 bg-card text-foreground"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="button" onClick={handleNextStep} className="w-full">
                      Next Step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                )}

                {/* Step 2: Store Details */}
                {step === 2 && (
                  <>
                    <div>
                      <Label htmlFor="storeName">Store Name</Label>
                      <Input
                        id="storeName"
                        type="text"
                        placeholder="My Amazing Store"
                        value={formData.storeName}
                        onChange={(e) => handleInputChange("storeName", e.target.value)}
                        required
                        className="bg-card text-foreground"
                      />
                    </div>
                    <div>
                      <Label htmlFor="storeSlug">Store URL</Label>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">switch.store/</span>
                        <Input
                          id="storeSlug"
                          type="text"
                          placeholder="my-store"
                          value={formData.storeSlug}
                          onChange={(e) => handleInputChange("storeSlug", e.target.value)}
                          required
                          className="bg-card text-foreground"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="storeCategory">Store Category</Label>
                      <Select value={formData.storeCategory} onValueChange={(value) => handleInputChange("storeCategory", value)}>
                        <SelectTrigger className="bg-card text-foreground">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {storeCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="storeDescription">Store Description</Label>
                      <textarea
                        id="storeDescription"
                        placeholder="Tell customers about your store..."
                        value={formData.storeDescription}
                        onChange={(e) => handleInputChange("storeDescription", e.target.value)}
                        className="w-full min-h-[100px] p-3 border border-input bg-card text-foreground rounded-md resize-none"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <Button type="button" variant="outline" onClick={handlePrevStep} className="flex-1">
                        Previous
                      </Button>
                      <Button type="button" onClick={handleNextStep} className="flex-1">
                        Next Step
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 3: Final Steps */}
                {step === 3 && (
                  <>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <h3 className="font-semibold mb-2">Review Your Information</h3>
                        <div className="space-y-2 text-sm">
                          <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                          <p><strong>Email:</strong> {formData.email}</p>
                          <p><strong>Phone:</strong> {formData.phone}</p>
                          <p><strong>Store:</strong> {formData.storeName}</p>
                          <p><strong>URL:</strong> switch.store/{formData.storeSlug}</p>
                          <p><strong>Category:</strong> {formData.storeCategory}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                        <Checkbox
                          id="agreeTerms"
                          checked={formData.agreeTerms}
                          onCheckedChange={(checked) => handleInputChange("agreeTerms", checked as boolean)}
                          required
                        />
                          <Label htmlFor="agreeTerms" className="text-sm">
                          I agree to the{" "}
                            <button
                              type="button"
                              onClick={() => setTermsOpen(true)}
                              className="text-blue-500 hover:underline"
                            >
                            Terms of Service
                          </button>{" "}
                          and{" "}
                            <button
                              type="button"
                              onClick={() => setTermsOpen(true)}
                              className="text-blue-500 hover:underline"
                            >
                            Privacy Policy
                            </button>
                        </Label>
                      </div>
                        
                        <div className="flex items-center space-x-2">
                        <Checkbox
                          id="agreeMarketing"
                          checked={formData.agreeMarketing}
                          onCheckedChange={(checked) => handleInputChange("agreeMarketing", checked as boolean)}
                        />
                          <Label htmlFor="agreeMarketing" className="text-sm">
                            I agree to receive marketing communications from Switch VendSell
                        </Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4">
                      <Button type="button" variant="outline" onClick={handlePrevStep} className="flex-1">
                        Previous
                      </Button>
                      <Button type="submit" disabled={loading} className="flex-1">
                        {loading ? "Creating Account..." : "Create Account"}
                      </Button>
                          </div>
                  </>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Terms Dialog */}
        <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Terms of Service & Privacy Policy</DialogTitle>
              <DialogDescription>
                By using Switch VendSell, you agree to our terms and privacy policy.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-96 overflow-y-auto space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Terms of Service</h4>
                <p className="text-sm text-muted-foreground">
                  Switch VendSell provides eCommerce platform services. Users are responsible for their store content, 
                  customer data handling, and compliance with local laws. We reserve the right to suspend accounts 
                  that violate our terms.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Privacy Policy</h4>
                <p className="text-sm text-muted-foreground">
                  We collect and process your data to provide our services. Your data is protected and we never 
                  sell it to third parties. You can request data deletion at any time.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
