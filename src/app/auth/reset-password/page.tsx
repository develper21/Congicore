"use client"

import { useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Brain
} from "lucide-react"

function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate password reset
    setTimeout(() => {
      setIsSuccess(true)
      setIsLoading(false)
    }, 2000)
  }

  if (isSuccess) {
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
              <h2 className="text-2xl font-bold mb-2">Password reset successful!</h2>
              <p className="text-muted-foreground mb-6">
                Your password has been successfully updated.<br />
                You can now sign in with your new password.
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
          <h1 className="text-2xl font-bold">Set new password</h1>
          <p className="text-muted-foreground">
            Create a strong password for your account
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="text-sm font-medium">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-12 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Must be at least 8 characters long
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="w-full pl-10 pr-12 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium mb-2">Password requirements:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                    At least 8 characters
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                    Contains uppercase and lowercase
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                    Contains at least one number
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                    Contains at least one special character
                  </li>
                </ul>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Reset Password"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6">
              <Button variant="ghost" className="w-full" onClick={() => router.push("/auth/login")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to sign in
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 p-4">
        <div className="flex flex-col items-center space-y-4">
          <Brain className="h-12 w-12 text-primary animate-pulse" />
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
