"use client"



import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Check, Star, ShoppingBag, Globe, Smartphone, CreditCard, BarChart3, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { DarkModeToggle } from "@/components/ui/toggle"

const features = [
  {
    icon: ShoppingBag,
    title: "Instant Store Setup",
    description: "Create your online store in minutes with our drag-and-drop builder",
  },
  {
    icon: CreditCard,
    title: "Nigerian Payments",
    description: "Integrated Paystack & Flutterwave for seamless Naira transactions",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Your store looks perfect on every device, especially mobile",
  },
  {
    icon: Bot,
    title: "AI-Powered Tools",
    description: "Generate product descriptions and get smart pricing suggestions",
  },
  {
    icon: BarChart3,
    title: "Sales Analytics",
    description: "Track your performance with detailed insights and reports",
  },
  {
    icon: Globe,
    title: "Custom Domains",
    description: "Use your own domain or get a free .switch.store subdomain",
  },
]

const pricingPlans = [
  {
    name: "Free",
    price: "₦0",
    period: "forever",
    description: "Perfect for testing the waters",
    features: ["1 product listing", "switch.store subdomain", "Basic analytics", "Email support"],
    popular: false,
  },
  {
    name: "Starter",
    price: "₦2,500",
    period: "per month",
    description: "Great for small businesses",
    features: ["10 products", "Brand customization", "WhatsApp integration", "Order management", "Basic AI tools"],
    popular: true,
  },
  {
    name: "Pro",
    price: "₦5,000",
    period: "per month",
    description: "For growing businesses",
    features: [
      "Unlimited products",
      "Custom domain",
      "Advanced AI tools",
      "Priority support",
      "Advanced analytics",
      "Multi-payment gateways",
    ],
    popular: false,
  },
  {
    name: "Business",
    price: "₦20,000",
    period: "per month",
    description: "For established enterprises",
    features: [
      "Multiple stores",
      "Team collaboration",
      "API access",
      "White-label options",
      "Dedicated support",
      "Custom integrations",
    ],
    popular: false,
  },
]

const testimonials = [
  {
    name: "Adunni Fashions",
    location: "Lagos, Nigeria",
    text: "Switch Creative helped me move my fashion business online in just one day. Sales increased by 300%!",
    rating: 5,
  },
  {
    name: "TechHub Gadgets",
    location: "Abuja, Nigeria",
    text: "The Paystack integration works flawlessly. My customers love the smooth checkout experience.",
    rating: 5,
  },
  {
    name: "Mama's Kitchen",
    location: "Port Harcourt, Nigeria",
    text: "From food delivery to online orders, Switch Creative made everything so simple for my restaurant.",
    rating: 5,
  },
]

export default function HomePage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50 w-full transition-colors duration-300">
        <div className="flex items-center justify-between px-4 py-4 w-full">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">Vendsell</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="hover:text-primary transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#testimonials" className="hover:text-primary transition-colors">
              Success Stories
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            <Link href="/auth/login">
              <Button className="bg-blue-500 hover:bg-blue-600">Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-8 px-4 relative overflow-hidden">
        {/* Animated Color Splash */}
        <motion.div
          aria-hidden="true"
          initial={{ scale: 1, rotate: 0, x: -100, y: -80 }}
          animate={{ scale: 1.2, rotate: 360, x: 0, y: 0 }}
          transition={{ repeat: Infinity, repeatType: "mirror", duration: 16, ease: "linear" }}
          className="pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 opacity-30 blur-3xl z-0"
        />
        <div className="container mx-auto text-center max-w-7xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-100">
              🇳🇬 Built for Nigerian Entrepreneurs
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Launch Your
              <span className="text-blue-500"> Nigerian Store </span>
              in Minutes
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            An all-in-one eCommerce platform built for African creators — accept Naira payments, sell effortlessly via WhatsApp, and reach customers across Nigeria without writing a single line of code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/register">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-lg px-8 py-4">
                  Start Your Free Store
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">No credit card required • Free forever plan available</p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="pt-8 pb-16 bg-card transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-500">100+</div>
              <div className="text-muted-foreground">Active Stores</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">₦1.5M+</div>
              <div className="text-muted-foreground">Processed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-500">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">24/7</div>
              <div className="text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed Online</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built specifically for the Nigerian market with local payment gateways, mobile-first design, and AI-powered tools.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-card/60 backdrop-blur-sm">
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300 ${
                        hoveredFeature === index ? "bg-blue-500" : "bg-muted"
                      }`}
                    >
                      <feature.icon
                        className={`h-6 w-6 ${hoveredFeature === index ? "text-white" : "text-muted-foreground"}`}
                      />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-muted-foreground">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-muted transition-colors duration-300">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Pricing That Scales With Your Business</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free and upgrade as you grow. All plans include Nigerian payment integration.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileInView={{ scale: 1.05, boxShadow: '0 8px 32px 0 rgba(59,130,246,0.15)' }}
                viewport={{ once: true, amount: 0.4 }}
              >
                <Card
                  className={`h-full relative transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-400 ${
                    plan.popular ? "border-2 border-blue-500 shadow-lg scale-105" : "border border-border"
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-500">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                    <CardDescription className="mt-2 text-muted-foreground">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="h-4 w-4 text-blue-500 mr-3 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/auth/register" className="block mt-8">
                      <Button
                        className={`w-full ${plan.popular ? "bg-blue-500 hover:bg-blue-600" : ""}`}
                        variant={plan.popular ? "default" : "outline"}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Success Stories from Nigerian Entrepreneurs</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of successful business owners who chose Switch Creative
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full bg-card/60 backdrop-blur-sm border-0 shadow-lg transition-colors duration-300">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="mb-4 italic text-muted-foreground">"{testimonial.text}"</p>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-500 transition-colors duration-300">
        <div className="container mx-auto text-center max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Your Nigerian eCommerce Journey?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of successful entrepreneurs who trust Switch VendSell to power their online stores.
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-blue-500 hover:bg-gray-100 text-lg px-8 py-4">
                Create Your Free Store Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-white/80 text-sm mt-4">Setup takes less than 5 minutes • No technical skills required</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 transition-colors duration-300">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl font-bold">Vendsell</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering Nigerian entrepreneurs to build successful online businesses.
              </p>
              <div className="text-sm text-gray-400">Made by Switch Industries</div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Templates
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    WhatsApp Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Switch Companies</h4>
              
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Switch Health 
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Switch Education
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Switch Media
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Switch VendSell. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
