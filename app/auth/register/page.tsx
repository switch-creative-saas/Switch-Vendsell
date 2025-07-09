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
      // 1. Create user
      // 2. Insert store into 'stores' table (if table exists)
      router.push(`/store/${formData.storeSlug}`)
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.message || "Please try again", variant: "destructive" })
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
                        placeholder="My Store"
                        value={formData.storeName}
                        onChange={(e) => handleInputChange("storeName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="storeSlug">Store URL</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          https://
                        </span>
                        <Input
                          id="storeSlug"
                          type="text"
                          placeholder="mystore"
                          className="rounded-l-none"
                          value={formData.storeSlug}
                          onChange={(e) => handleInputChange("storeSlug", e.target.value)}
                          required
                        />
                        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          .switch.store
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">This will be your store's web address</p>
                    </div>
                    <div>
                      <Label htmlFor="storeCategory">Store Category</Label>
                      <Select
                        value={formData.storeCategory}
                        onValueChange={(value) => handleInputChange("storeCategory", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your store category" />
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
                        placeholder="Tell customers what your store is about..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={3}
                        value={formData.storeDescription}
                        onChange={(e) => handleInputChange("storeDescription", e.target.value)}
                      />
                    </div>
                  </>
                )}

                {/* Step 3: Final Steps */}
                {step === 3 && (
                  <>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Review Your Information</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <strong>Name:</strong> {formData.firstName} {formData.lastName}
                        </p>
                        <p>
                          <strong>Email:</strong> {formData.email}
                        </p>
                        <p>
                          <strong>Store:</strong> {formData.storeName}
                        </p>
                        <p>
                          <strong>URL:</strong> {formData.storeSlug}.switch.store
                        </p>
                        <p>
                          <strong>Category:</strong> {formData.storeCategory}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="agreeTerms"
                          checked={formData.agreeTerms}
                          onCheckedChange={(checked) => handleInputChange("agreeTerms", checked as boolean)}
                          required
                        />
                        <Label htmlFor="agreeTerms" className="text-sm leading-5">
                          I agree to the{" "}
                          <button type="button" className="text-blue-500 hover:underline" onClick={() => setTermsOpen(true)}>
                            Terms of Service
                          </button>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-blue-500 hover:underline">
                            Privacy Policy
                          </Link>
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="agreeMarketing"
                          checked={formData.agreeMarketing}
                          onCheckedChange={(checked) => handleInputChange("agreeMarketing", checked as boolean)}
                        />
                        <Label htmlFor="agreeMarketing" className="text-sm leading-5">
                          I want to receive marketing emails about new features and tips
                        </Label>
                      </div>
                    </div>
                    {/* Terms and Conditions Dialog */}
                    <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Terms and Conditions</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                          <div className="max-h-64 overflow-y-auto text-sm text-muted-foreground space-y-2">
                            <p>Welcome to Switch VendSell! By creating an account, you agree to the following terms and conditions:</p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>You are responsible for all activity on your account and store.</li>
                              <li>You will comply with all applicable laws and regulations.</li>
                              <li>Switch VendSell is not liable for any loss or damages resulting from your use of the platform.</li>
                              <li>You may not use the platform for illegal or prohibited activities.</li>
                              <li>We reserve the right to suspend or terminate accounts that violate our terms.</li>
                              <li>For full details, please visit our <Link href="/terms" className="text-blue-500 hover:underline">Terms of Service</Link>.</li>
                            </ul>
                            <p className="mt-2">If you have any questions, contact us at support@switchvendsell.com.</p>
                          </div>
                        </DialogDescription>
                      </DialogContent>
                    </Dialog>
                  </>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  {step > 1 && (
                    <Button type="button" variant="outline" onClick={handlePrevStep}>
                      Previous
                    </Button>
                  )}
                  {step < 3 ? (
                    <Button type="button" onClick={handleNextStep} className="ml-auto bg-blue-500 hover:bg-blue-600">
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="ml-auto bg-blue-500 hover:bg-blue-600"
                      disabled={!formData.agreeTerms || loading}
                    >
                      {loading ? "Creating..." : "Create My Store"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-500 hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
