"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Function to get appropriate redirect URL based on user role
  const getRedirectUrl = (role: string): string => {
    switch (role.toUpperCase()) {
      case "ADMIN":
        return "/admin/dashboard"
      case "TEACHER":
        return "/teacher/dashboard"
      case "STUDENT":
        return "/student/dashboard"
      default:
        return "/"
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null) // Clear any previous errors

    try {
      // Use the credentials provider
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (!result?.error) {
        // Fetch user data to determine role-based redirect
        const userResponse = await fetch("/api/auth/session")
        const userData = await userResponse.json()
        
        if (userData.user?.role) {
          const redirectUrl = getRedirectUrl(userData.user.role)
          router.push(redirectUrl)
          toast({
            title: "Success!",
            description: `Welcome back! You've been logged in as ${userData.user.role.toLowerCase()}.`,
          })
        } else {
          router.push("/")
          toast({
            title: "Success!",
            description: "You have been logged in.",
          })
        }
      } else {
        // Handle specific errors
        setError(result.error)
        toast({
          title: "Error!",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      setError("Something went wrong. Please try again.")
      toast({
        title: "Error!",
        description: "Something went wrong.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null) // Clear any previous errors
    try {
      await signIn("google", { redirect: false })
      // Google OAuth redirects are handled by NextAuth
    } catch (error) {
      setError("Failed to sign in with Google.")
      toast({
        title: "Error!",
        description: "Failed to sign in with Google.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to determine if the error is a "not registered" error
  const isNotRegisteredError = (errorMsg: string) => {
    return errorMsg.includes("No user found") || errorMsg.includes("not registered");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>
                  {isNotRegisteredError(error) ? "Account Not Found" : "Error"}
                </AlertTitle>
                <AlertDescription>
                  {error}
                  {isNotRegisteredError(error) && (
                    <div className="mt-2">
                      <Link href="/auth/signup" className="font-medium underline">
                        Create an account
                      </Link> to get started.
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/reset-password" className="text-xs text-muted-foreground hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <div className="px-6 py-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2">
              <Button 
                variant="outline" 
                type="button" 
                className="flex items-center justify-center gap-2"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chrome"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="4" />
                  <line x1="21.17" x2="12" y1="8" y2="8" />
                  <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
                  <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
                </svg>
                Sign in with Google
              </Button>
            </div>
          </div>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
