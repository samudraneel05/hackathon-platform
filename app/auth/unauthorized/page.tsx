"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"

export default function UnauthorizedPage() {
  const { data: session } = useSession()
  const userRole = session?.user?.role || "guest"

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-destructive">Access Denied</CardTitle>
          <CardDescription>
            You do not have permission to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="mb-4">
              Your current role ({userRole.toLowerCase()}) does not have the required permissions to access this resource.
            </p>

            <div className="flex flex-col space-y-2">
              <Link href="/" className="w-full">
                <Button className="w-full">Go to Homepage</Button>
              </Link>
              
              {session ? (
                <Link href={`/${userRole.toLowerCase()}/dashboard`} className="w-full">
                  <Button variant="outline" className="w-full">
                    Go to {userRole} Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/login" className="w-full">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
