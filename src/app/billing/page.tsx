"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Layout } from "@/components/layout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  CreditCard, 
  Check, 
  X, 
  Zap, 
  Crown,
  Star,
  ArrowRight,
  Download,
  Calendar
} from "lucide-react"

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "100 MB storage",
      "Basic AI chat",
      "5 documents per month",
      "Email support",
      "Basic knowledge graph"
    ],
    notIncluded: [
      "Advanced AI features",
      "Priority support",
      "Unlimited storage",
      "Team collaboration"
    ],
    current: true,
    popular: false
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    description: "For serious learners",
    features: [
      "10 GB storage",
      "Advanced AI chat",
      "Unlimited documents",
      "Priority email support",
      "Advanced knowledge graph",
      "Spaced repetition",
      "AI-powered insights",
      "Export capabilities"
    ],
    notIncluded: [
      "Team collaboration",
      "API access",
      "Custom integrations"
    ],
    current: false,
    popular: true
  },
  {
    id: "team",
    name: "Team",
    price: "$49",
    description: "For teams and organizations",
    features: [
      "100 GB storage",
      "Everything in Pro",
      "Team collaboration",
      "API access",
      "Custom integrations",
      "Dedicated support",
      "Advanced analytics",
      "Custom branding",
      "SSO authentication"
    ],
    notIncluded: [],
    current: false,
    popular: false
  }
]

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState("free")
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const router = useRouter()

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId)
    // Handle upgrade logic
  }

  return (
    <AuthGuard>
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
            <p className="text-muted-foreground">
              Manage your subscription and billing information
            </p>
          </div>

          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold">Free Plan</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You're currently on the free plan. Upgrade to unlock more features.
                  </p>
                </div>
                <Button>
                  Upgrade Plan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm ${billingCycle === "monthly" ? "font-medium" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                  billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === "yearly" ? "font-medium" : "text-muted-foreground"}`}>
              Yearly
              <span className="ml-1 px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                Save 20%
              </span>
            </span>
          </div>

          {/* Pricing Plans */}
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''} ${
                  plan.current ? 'ring-2 ring-primary' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                {plan.current && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Current Plan
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center space-x-2">
                    <span>{plan.name}</span>
                    {plan.id === "pro" && <Crown className="h-5 w-5 text-primary" />}
                    {plan.id === "team" && <Star className="h-5 w-5 text-primary" />}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{billingCycle === "monthly" ? "month" : "year"}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 opacity-50">
                        <X className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={() => router.push(`/billing/checkout?plan=${plan.id}`)}
                    disabled={plan.current}
                  >
                    {plan.current ? "Current Plan" : `Upgrade to ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Free Plan Activation</p>
                      <p className="text-sm text-muted-foreground">Account created</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$0.00</p>
                    <p className="text-sm text-muted-foreground">Jan 1, 2024</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Download className="mr-2 h-4 w-4" />
                Download Invoices
              </Button>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  No payment methods on file. Add a payment method to upgrade your plan.
                </p>
                <Button>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </AuthGuard>
  )
}
