"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import {
  CheckCircle,
  Download,
  Mail,
  Calendar,
  CreditCard,
  Crown,
  Star,
  Home,
  AlertCircle,
} from "lucide-react";

export default function BillingSuccessPage() {
  const router = useRouter();
  const [planInfo, setPlanInfo] = useState({
    plan: "pro",
    price: "$19",
    cycle: "monthly",
    transactionId: "",
    date: new Date().toLocaleDateString(),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const sessionId = localStorage.getItem("checkout-session") || "";
      const savedPlan = localStorage.getItem("subscription-plan");
      const savedCycle = localStorage.getItem("billing-cycle");

      if (sessionId) {
        const response = await api.verifyPayment(sessionId);
        
        const prices = {
          free: "$0",
          pro: savedCycle === "yearly" ? "$182.40" : "$19",
          team: savedCycle === "yearly" ? "$470.40" : "$49",
        };

        setPlanInfo({
          plan: savedPlan || "pro",
          price: prices[savedPlan as keyof typeof prices] || "$19",
          cycle: savedCycle || "monthly",
          transactionId: sessionId,
          date: new Date().toLocaleDateString(),
        });

        localStorage.removeItem("checkout-session");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify payment");
    } finally {
      setLoading(false);
    }
  };

  const planIcons = {
    free: <CheckCircle className="h-8 w-8" />,
    pro: <Crown className="h-8 w-8" />,
    team: <Star className="h-8 w-8" />,
  };

  const planNames = {
    free: "Free",
    pro: "Pro",
    team: "Team",
  };

  const handleDownloadInvoice = () => {
    // Simulate invoice download
    const invoiceData = {
      transactionId: planInfo.transactionId,
      plan: planNames[planInfo.plan as keyof typeof planNames],
      price: planInfo.price,
      cycle: planInfo.cycle,
      date: planInfo.date,
    };

    const blob = new Blob([JSON.stringify(invoiceData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${planInfo.transactionId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AuthGuard>
      <Layout>
        {loading ? (
          <div className="max-w-2xl mx-auto space-y-6 pt-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-lg font-medium">Verifying payment...</p>
            </div>
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <div>
                <p className="font-medium text-red-900">Payment Verification Failed</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
            <Button onClick={verifyPayment}>Retry Verification</Button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Success Header */}
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Payment Successful!
                </h1>
                <p className="text-muted-foreground">
                  Your subscription has been upgraded successfully
                </p>
              </div>
            </div>

          {/* Plan Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="text-primary">
                  {planIcons[planInfo.plan as keyof typeof planIcons]}
                </div>
                <span>
                  {planNames[planInfo.plan as keyof typeof planNames]} Plan
                  Activated
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Plan Type</p>
                    <p className="font-semibold">
                      {planNames[planInfo.plan as keyof typeof planNames]} Plan
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Billing Cycle
                    </p>
                    <p className="font-semibold capitalize">{planInfo.cycle}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Amount Paid</p>
                    <p className="font-semibold">{planInfo.price}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Transaction ID
                    </p>
                    <p className="font-mono text-sm">
                      {planInfo.transactionId}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Paid on {planInfo.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                    <CreditCard className="h-4 w-4" />
                    <span>Payment processed securely</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card>
            <CardHeader>
              <CardTitle>What&apos;s Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Explore New Features</p>
                    <p className="text-sm text-muted-foreground">
                      Your new features are now available. Start exploring the
                      enhanced capabilities.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Check Your Email</p>
                    <p className="text-sm text-muted-foreground">
                      We&apos;ve sent a confirmation email with your receipt and
                      plan details.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Manage Your Subscription</p>
                    <p className="text-sm text-muted-foreground">
                      Visit billing settings anytime to manage your subscription
                      or cancel.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleDownloadInvoice}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </Button>
            <Button
              className="w-full"
              onClick={() => router.push("/dashboard")}
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </div>

          {/* Support Info */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Need Help?</p>
                  <p className="text-sm text-blue-800">
                    If you have any questions about your subscription, our
                    support team is here to help.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => router.push("/support")}
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Thank you for choosing AI Knowledge Twin! 🎉
            </p>
            <p className="text-xs text-muted-foreground">
              You can manage your subscription anytime in{" "}
              <button
                onClick={() => router.push("/billing")}
                className="text-primary hover:underline"
              >
                billing settings
              </button>
            </p>
          </div>
        </div>
        )}
      </Layout>
    </AuthGuard>
  );
}
