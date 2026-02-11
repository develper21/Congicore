"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Mail,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Brain
} from "lucide-react"

function VerifyEmailForm() {
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const handleVerify = async () => {
    setIsLoading(true)
    // Simulate email verification
    setTimeout(() => {
      setIsVerified(true)
      setIsLoading(false)
    }, 2000)
  }

  const handleResend = async () => {
    setIsLoading(true)
    // Simulate resend email
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Email verified!</h2>
              <p className="text-muted-foreground mb-6">
                Your email has been successfully verified.<br />
                You can now sign in to your account.
              </p>
              <Button className="w-full" onClick={() => router.push("/auth/login")}>
                Continue to Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Knowledge Twin</span>
          </div>
          <h1 className="text-2xl font-bold">Verify your email</h1>
          <p className="text-muted-foreground">
            We&apos;ve sent a verification link to<br />
            <span className="font-medium">{email || "your email"}</span>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Check your inbox</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Click the verification link in your email to activate your account.
                  If you don&apos;t see it, check your spam folder.
                </p>
              </div>

              <div className="space-y-3">
                <Button className="w-full" onClick={handleVerify} disabled={isLoading}>
                  {isLoading ? "Verifying..." : "I&apos;ve verified my email"}
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>

                <Button variant="outline" className="w-full" onClick={handleResend} disabled={isLoading}>
                  {isLoading ? "Sending..." : "Resend verification email"}
                  <RefreshCw className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Wrong email?{" "}
                  <a href="/auth/register" className="text-primary hover:underline">
                    Change email
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 p-4">
        <div className="flex flex-col items-center space-y-4">
          <Brain className="h-12 w-12 text-primary animate-pulse" />
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  )
}
