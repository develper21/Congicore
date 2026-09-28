"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import {
  CreditCard,
  Check,
  X,
  Crown,
  Star,
  Download,
  Calendar,
  Loader2,
  Sparkles,
  Zap,
  ShieldCheck,
} from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Free Explorer",
    priceMonthly: "$0",
    priceYearly: "$0",
    description: "Essential knowledge storage & basic chat",
    features: [
      "100 MB encrypted storage",
      "Standard AI chat (GPT-4o mini)",
      "10 documents per month",
      "Basic Knowledge Graph",
      "Community support",
    ],
    notIncluded: [
      "Advanced RAG vector synthesis",
      "Spaced repetition analytics",
      "Unlimited file storage",
      "Audio & video transcription",
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro Twin",
    priceMonthly: "$19",
    priceYearly: "$15",
    description: "Autonomous second brain for researchers & pros",
    features: [
      "10 GB encrypted storage",
      "Advanced RAG reasoning (GPT-4o)",
      "Unlimited document indexing",
      "3D Interactive Knowledge Graph",
      "SuperMemo-2 Spaced Repetition",
      "Voice & Audio transcription",
      "Cognitive gap analysis",
      "Priority customer support",
    ],
    notIncluded: ["Team workspace collaboration"],
    popular: true,
  },
  {
    id: "team",
    name: "Team & Lab",
    priceMonthly: "$49",
    priceYearly: "$39",
    description: "Shared collective intelligence for organizations",
    features: [
      "100 GB multi-tenant storage",
      "Everything in Pro Twin",
      "Multi-user shared knowledge graph",
      "Role-based access & permissions",
      "Custom embedding model endpoints",
      "Dedicated account manager",
      "SSO & audit logs",
    ],
    notIncluded: [],
    popular: false,
  },
];

interface BillingData {
  currentPlan: string;
  billingHistory: Array<{
    id: string;
    description: string;
    amount: number;
    date: string;
  }>;
  paymentMethods: Array<{
    id: string;
    last4: string;
    brand: string;
    expiry: string;
  }>;
}

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [billingData, setBillingData] = useState<BillingData>({
    currentPlan: "free",
    billingHistory: [
      {
        id: "inv-001",
        description: "Congicore Free Plan - Welcome Credit",
        amount: 0.0,
        date: new Date().toISOString(),
      },
    ],
    paymentMethods: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchBilling();
  }, []);

  const fetchBilling = async () => {
    try {
      setLoading(true);
      setError(null);
      const [billing] = await Promise.all([api.getBilling()]);
      setBillingData({
        currentPlan: billing.billing?.currentPlan || "free",
        billingHistory: billing.billingHistory?.length
          ? billing.billingHistory
          : [
              {
                id: "inv-001",
                description: "Congicore Free Tier Subscription",
                amount: 0.0,
                date: new Date().toISOString(),
              },
            ],
        paymentMethods: [],
      });
      setSelectedPlan(billing.billing?.currentPlan || "free");
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    router.push(`/billing/checkout?plan=${planId}&cycle=${billingCycle}`);
  };

  return (
    <AuthGuard>
      <Layout>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-xs">Loading billing portal...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center glass-panel rounded-2xl max-w-md mx-auto space-y-3">
            <p className="text-rose-400 text-xs">{error}</p>
            <Button onClick={fetchBilling} variant="outline" size="sm">
              Retry
            </Button>
          </div>
        ) : (
          <div className="space-y-8 pb-12 max-w-6xl mx-auto">
            {/* Header & Billing Cycle Toggle */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-mintFoam/15 text-mintFoam border border-mintFoam/30 shadow-glow-mint">
                <Crown className="h-3.5 w-3.5 text-skinSand" /> Transparent Subscription Tiers
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-softChrome">
                Choose the Right Mind Power
              </h1>
              <p className="text-sm text-softChrome/65 max-w-xl mx-auto leading-relaxed">
                Scale your AI second brain. Upgrade or cancel anytime with prorated billing.
              </p>

              {/* Monthly vs Yearly Toggle Pill */}
              <div className="pt-2 inline-flex items-center p-1 rounded-2xl bg-carbonTeal-dark border border-softChrome/15 shadow-inner-glow">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    billingCycle === "monthly"
                      ? "bg-gradient-to-r from-chromeViolet to-hyperCobalt text-white shadow-glow-violet"
                      : "text-softChrome/60 hover:text-glassBlue"
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    billingCycle === "yearly"
                      ? "bg-gradient-to-r from-chromeViolet to-hyperCobalt text-white shadow-glow-violet"
                      : "text-softChrome/60 hover:text-glassBlue"
                  }`}
                >
                  <span>Yearly Billing</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-mintFoam/20 text-mintFoam border border-mintFoam/30 shadow-glow-mint font-bold">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid gap-6 md:grid-cols-3 pt-4">
              {plans.map((plan) => {
                const isCurrent = billingData.currentPlan === plan.id;
                const isPro = plan.id === "pro";
                const price =
                  billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;

                return (
                  <Card
                    key={plan.id}
                    className={`relative p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 border-softChrome/10 bg-carbonTeal/60 ${
                      isPro
                        ? "border-chromeViolet/60 shadow-glow-violet bg-gradient-to-b from-toxicViolet/30 via-carbonTeal/90 to-carbonTeal scale-[1.02]"
                        : "hover:border-softChrome/25"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-chromeViolet to-hyperCobalt text-white shadow-glow-violet border border-glassBlue/30">
                          Recommended
                        </span>
                      </div>
                    )}

                    <div className="space-y-5">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-softChrome flex items-center gap-2">
                            {plan.name}
                            {isPro && <Sparkles className="h-4 w-4 text-mintFoam" />}
                          </h3>
                          {isCurrent && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-mintFoam/15 text-mintFoam border border-mintFoam/30 shadow-glow-mint">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-softChrome/60 mt-1 leading-relaxed">
                          {plan.description}
                        </p>
                      </div>

                      {/* Pricing Amount */}
                      <div className="pt-2">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-extrabold text-softChrome font-mono">
                            {price}
                          </span>
                          <span className="text-xs text-softChrome/50">
                            / month {billingCycle === "yearly" && "(billed annually)"}
                          </span>
                        </div>
                      </div>

                      {/* Features List */}
                      <div className="pt-4 border-t border-softChrome/10 space-y-2.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-softChrome/70">
                          Included In Plan:
                        </p>
                        {plan.features.map((feat, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs text-softChrome/90">
                            <Check className="h-3.5 w-3.5 text-mintFoam flex-shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                        {plan.notIncluded.map((notFeat, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs text-softChrome/40">
                            <X className="h-3.5 w-3.5 text-softChrome/30 flex-shrink-0 mt-0.5" />
                            <span className="line-through">{notFeat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-6">
                      <Button
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={isCurrent}
                        variant={isPro ? "default" : "outline"}
                        className={`w-full h-11 font-semibold text-sm ${
                          isPro ? "shadow-glow-violet" : "border-softChrome/15 text-softChrome hover:text-glassBlue"
                        }`}
                      >
                        {isCurrent ? "Current Active Plan" : `Upgrade to ${plan.name}`}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Invoices & History */}
            <div className="grid gap-6 md:grid-cols-2 pt-6">
              {/* Payment Method */}
              <Card className="p-6 space-y-4 border-softChrome/10 bg-carbonTeal/60">
                <CardTitle className="text-base flex items-center gap-2 text-softChrome">
                  <CreditCard className="h-4 w-4 text-chromeViolet" /> Payment Methods
                </CardTitle>
                <div className="p-4 rounded-xl border border-softChrome/10 bg-carbonTeal/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-chromeViolet/15 border border-chromeViolet/30 text-glassBlue">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-softChrome">Default Card</p>
                      <p className="text-[11px] text-softChrome/50 font-mono">Visa ending in •••• 4242</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs text-glassBlue hover:text-mintFoam">
                    Update
                  </Button>
                </div>
              </Card>

              {/* Invoices */}
              <Card className="p-6 space-y-4 border-softChrome/10 bg-carbonTeal/60">
                <CardTitle className="text-base flex items-center gap-2 text-softChrome">
                  <Calendar className="h-4 w-4 text-mintFoam" /> Billing Invoices
                </CardTitle>
                <div className="space-y-2">
                  {billingData.billingHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-softChrome/10 bg-carbonTeal/40 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-softChrome">{item.description}</p>
                        <p className="text-[10px] text-softChrome/50 font-mono">
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-semibold text-softChrome">
                          ${item.amount.toFixed(2)}
                        </span>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-softChrome/50 hover:text-softChrome">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}
      </Layout>
    </AuthGuard>
  );
}
