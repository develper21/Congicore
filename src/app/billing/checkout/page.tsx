"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Layout } from "@/components/layout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CreditCard,
  Check,
  ArrowLeft,
  Shield,
  Zap,
  Crown,
  Star,
  AlertCircle,
  Brain
} from "lucide-react"

const planDetails = {
  free: {
    name: "Free",
    price: "$0",
    features: ["100 MB storage", "Basic AI chat", "5 documents per month"],
    icon: <Check className="h-5 w-5" />
  },
  pro: {
    name: "Pro",
    price: "$19",
    features: ["10 GB storage", "Advanced AI chat", "Unlimited documents", "Spaced repetition"],
    icon: <Crown className="h-5 w-5" />
  },
  team: {
    name: "Team",
    price: "$49",
    features: ["100 GB storage", "Team collaboration", "API access", "Priority support"],
    icon: <Star className="h-5 w-5" />
  }
}

function CheckoutForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedPlan] = useState(searchParams.get("plan") || "free")
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
    country: "",
    zip: ""
  })

  const [paypalEmail, setPaypalEmail] = useState("")

  const plan = planDetails[selectedPlan as keyof typeof planDetails]
  const finalPrice = billingCycle === "yearly"
    ? parseInt(plan.price.replace("$", "")) * 12 * 0.8
    : parseInt(plan.price.replace("$", ""))

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.push("/billing")
    }
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      // Store subscription info
      localStorage.setItem("subscription-plan", selectedPlan)
      localStorage.setItem("billing-cycle", billingCycle)

      // Redirect to success page
      router.push("/billing/success")
    }, 3000)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <span>Review Your Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                        {plan.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{plan.name} Plan</h3>
                        <p className="text-muted-foreground">
                          {billingCycle === "yearly" ? "Yearly billing (Save 20%)" : "Monthly billing"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        ${finalPrice}
                        <span className="text-sm font-normal text-muted-foreground">
                          /{billingCycle === "yearly" ? "year" : "month"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="cycle"
                      checked={billingCycle === "monthly"}
                      onChange={() => setBillingCycle("monthly")}
                      className="h-4 w-4"
                    />
                    <span>Monthly</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="cycle"
                      checked={billingCycle === "yearly"}
                      onChange={() => setBillingCycle("yearly")}
                      className="h-4 w-4"
                    />
                    <span>Yearly (Save 20%)</span>
                  </label>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Plans
                  </Button>
                  <Button onClick={handleNext}>
                    Continue to Payment
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span>Payment Method</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card
                    className={`cursor-pointer border-2 ${paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <CardContent className="p-6 text-center">
                      <CreditCard className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold">Credit/Debit Card</h3>
                      <p className="text-sm text-muted-foreground">
                        Visa, Mastercard, Amex, Discover
                      </p>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer border-2 ${paymentMethod === "paypal" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    onClick={() => setPaymentMethod("paypal")}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="h-8 w-8 mx-auto mb-2 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                        P
                      </div>
                      <h3 className="font-semibold">PayPal</h3>
                      <p className="text-sm text-muted-foreground">
                        Pay with your PayPal account
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {paymentMethod === "card" ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Card Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Card Number</label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={cardDetails.number}
                            onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                            className="w-full mt-1 p-3 border border-border rounded-lg bg-background"
                            maxLength={19}
                          />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="text-sm font-medium">Expiry Date</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              value={cardDetails.expiry}
                              onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                              className="w-full mt-1 p-3 border border-border rounded-lg bg-background"
                              maxLength={5}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">CVV</label>
                            <input
                              type="text"
                              placeholder="123"
                              value={cardDetails.cvv}
                              onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                              className="w-full mt-1 p-3 border border-border rounded-lg bg-background"
                              maxLength={4}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Cardholder Name</label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            value={cardDetails.name}
                            onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full mt-1 p-3 border border-border rounded-lg bg-background"
                          />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="text-sm font-medium">Country</label>
                            <select
                              value={cardDetails.country}
                              onChange={(e) => setCardDetails(prev => ({ ...prev, country: e.target.value }))}
                              className="w-full mt-1 p-3 border border-border rounded-lg bg-background"
                            >
                              <option value="">Select Country</option>
                              <option value="US">United States</option>
                              <option value="UK">United Kingdom</option>
                              <option value="CA">Canada</option>
                              <option value="AU">Australia</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">ZIP/Postal Code</label>
                            <input
                              type="text"
                              placeholder="12345"
                              value={cardDetails.zip}
                              onChange={(e) => setCardDetails(prev => ({ ...prev, zip: e.target.value }))}
                              className="w-full mt-1 p-3 border border-border rounded-lg bg-background"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>PayPal Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">PayPal Email</label>
                          <input
                            type="email"
                            placeholder="your@email.com"
                            value={paypalEmail}
                            onChange={(e) => setPaypalEmail(e.target.value)}
                            className="w-full mt-1 p-3 border border-border rounded-lg bg-background"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          You&apos;ll be redirected to PayPal to complete your payment securely.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex items-center space-x-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <p className="text-sm text-blue-800">
                    Your payment information is encrypted and secure. We never store your card details.
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={handleNext}>
                    Review Order
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span>Review & Confirm</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Order Summary</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Plan</span>
                      <span className="font-medium">{plan.name} Plan</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Billing Cycle</span>
                      <span className="font-medium">
                        {billingCycle === "yearly" ? "Yearly" : "Monthly"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Method</span>
                      <span className="font-medium">
                        {paymentMethod === "card" ? "Credit/Debit Card" : "PayPal"}
                      </span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${finalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">What happens next?</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-start space-x-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Immediate access to all {plan.name} features</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Payment confirmation sent to your email</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Can cancel anytime from billing settings</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    By clicking &quot;Complete Purchase&quot;, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="min-w-[150px]"
                  >
                    {isProcessing ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Complete Purchase
                        <Zap className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <AuthGuard>
      <Layout>
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
            <p className="text-muted-foreground">
              Complete your subscription upgrade in just a few steps
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${step <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
                  }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`h-1 w-full mx-2 ${step < currentStep ? "bg-primary" : "bg-muted"
                    }`} />
                )}
              </div>
            ))}
          </div>

          {renderStepContent()}
        </div>
      </Layout>
    </AuthGuard>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="max-w-2xl mx-auto space-y-6 pt-12">
          <div className="flex flex-col items-center space-y-4">
            <Brain className="h-12 w-12 text-primary animate-pulse" />
            <p className="text-lg font-medium">Preparing checkout...</p>
          </div>
        </div>
      </Layout>
    }>
      <CheckoutForm />
    </Suspense>
  )
}
