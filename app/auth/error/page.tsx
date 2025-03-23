"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { signIn } from "next-auth/react"
import { toast } from "@/components/ui/use-toast"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [errorTitle, setErrorTitle] = useState<string>("Authentication Error")
  const [errorDescription, setErrorDescription] = useState<string>("Something went wrong during authentication.")
  const [isLinking, setIsLinking] = useState(false)
  const error = searchParams.get("error")
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  useEffect(() => {
    if (error) {
      setErrorMessage(error)
      
      // Set specific error details based on the error code
      if (error === "AccessDenied") {
        setErrorTitle("Access Denied")
        setErrorDescription("You do not have permission to sign in.")
      } else if (error === "Verification") {
        setErrorTitle("Verification Failed")
        setErrorDescription("The verification link may have expired or already been used.")
      } else if (error === "OAuthSignin" || error === "OAuthCallback" || error === "OAuthCreateAccount") {
        setErrorTitle("OAuth Error")
        setErrorDescription("There was a problem with the OAuth sign-in process.")
      } else if (error === "OAuthAccountNotLinked") {
        setErrorTitle("Account Already Exists")
        setErrorDescription("An account with this email already exists using a different sign-in method. You can link these accounts together to use either method for signing in.")
      } else if (error === "EmailCreateAccount") {
        setErrorTitle("Email Error")
        setErrorDescription("There was a problem creating your account with this email.")
      } else if (error === "Callback") {
        setErrorTitle("Callback Error")
        setErrorDescription("There was a problem with the authentication callback.")
      } else if (error.includes("No user found") || error.includes("not registered")) {
        setErrorTitle("User Not Found")
        setErrorDescription("This email is not registered. Please sign up first.")
      } else if (error.includes("Invalid password")) {
        setErrorTitle("Invalid Password")
        setErrorDescription("The password you entered is incorrect. Please try again.")
      } else if (error.includes("account was created with Google")) {
        setErrorTitle("Use Google Sign-In")
        setErrorDescription("This account was created with Google. Please use the Google Sign-In button instead.")
      }
    }
  }, [error])

  // Function to handle the account linking
  const handleLinkAccounts = async () => {
    try {
      setIsLinking(true);
      // First, sign in with credentials
      const result = await signIn('credentials', { 
        redirect: false,
        callbackUrl: '/' 
      });
      
      if (result?.error) {
        // If credential sign-in fails, show error
        toast({
          title: "Sign-in Failed",
          description: "Please sign in with your email and password first before linking.",
          variant: "destructive",
        });
        // Redirect to login page
        router.push('/auth/login');
        return;
      }
      
      // Show success message
      toast({
        title: "Accounts Linked",
        description: "Your accounts have been linked successfully. You can now sign in with either method.",
        duration: 5000,
      });
      
      // Redirect to homepage or dashboard
      router.push('/api/auth/session-redirect');
    } catch (error) {
      console.error("Error linking accounts:", error);
      toast({
        title: "Error",
        description: "Failed to link accounts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-destructive">{errorTitle}</CardTitle>
          <CardDescription>
            {errorDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="text-sm text-muted-foreground">
            {error === "OAuthAccountNotLinked" ? (
              <div>
                <p className="mb-2">This typically happens when:</p>
                <ul className="list-disc pl-5">
                  <li>You previously created an account with email and password</li>
                  <li>You're now trying to sign in with Google using the same email</li>
                </ul>
                <p className="mt-2">You have two options:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>Sign in with your email and password instead</li>
                  <li>Link your accounts to use either sign-in method</li>
                </ul>
                
                <div className="mt-4">
                  <Button 
                    variant="secondary" 
                    className="w-full mb-2"
                    onClick={handleLinkAccounts}
                    disabled={isLinking}
                  >
                    {isLinking ? "Linking accounts..." : "Link My Accounts"}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    This will allow you to sign in with either method using the same account
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p>
                  If you're having trouble signing in, you can:
                </p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Make sure you've registered first</li>
                  <li>Check that you're using the correct email address and password</li>
                  <li>Try signing in with a different method</li>
                  <li>Contact support if the problem persists</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link href="/auth/login" className="w-full">
            <Button variant="default" className="w-full">
              Back to Login
            </Button>
          </Link>
          <Link href="/auth/signup" className="w-full">
            <Button variant="outline" className="w-full">
              Create an Account
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
