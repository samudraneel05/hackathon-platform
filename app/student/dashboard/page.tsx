"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"

export default function StudentDashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()
  
  useEffect(() => {
    // Redirect if not student, teacher, or admin
    if (status === "authenticated" && 
        session?.user?.role !== "STUDENT" && 
        session?.user?.role !== "TEACHER" && 
        session?.user?.role !== "ADMIN") {
      router.push("/auth/unauthorized")
    } else if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [session, status, router])

  // Show loading or return null while checking authentication
  if (status === "loading" || 
      (status === "authenticated" && 
       session?.user?.role !== "STUDENT" && 
       session?.user?.role !== "TEACHER" && 
       session?.user?.role !== "ADMIN")) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground">Verifying your credentials</p>
        </div>
      </div>
    )
  }
  
  // Sample hackathons data
  const hackathons = [
    {
      id: 1,
      title: "AI Innovation Challenge",
      description: "Create innovative AI solutions for real-world problems",
      image: "/placeholder.svg?height=200&width=400&text=AI+Challenge",
      status: "active",
      deadline: "June 30, 2023",
      enrolled: true,
    },
    {
      id: 2,
      title: "Web Development Hackathon",
      description: "Build responsive and accessible web applications",
      image: "/placeholder.svg?height=200&width=400&text=Web+Dev",
      status: "upcoming",
      deadline: "July 30, 2023",
      enrolled: false,
    },
    {
      id: 3,
      title: "Mobile App Challenge",
      description: "Develop mobile applications for social good",
      image: "/placeholder.svg?height=200&width=400&text=Mobile+App",
      status: "active",
      deadline: "July 15, 2023",
      enrolled: false,
    },
    {
      id: 4,
      title: "Blockchain Hackathon",
      description: "Create innovative blockchain solutions",
      image: "/placeholder.svg?height=200&width=400&text=Blockchain",
      status: "upcoming",
      deadline: "August 15, 2023",
      enrolled: false,
    },
    {
      id: 5,
      title: "IoT Innovation Challenge",
      description: "Build IoT solutions for smart cities",
      image: "/placeholder.svg?height=200&width=400&text=IoT",
      status: "upcoming",
      deadline: "August 30, 2023",
      enrolled: false,
    },
    {
      id: 6,
      title: "Data Science Competition",
      description: "Solve real-world problems using data science",
      image: "/placeholder.svg?height=200&width=400&text=Data+Science",
      status: "active",
      deadline: "July 20, 2023",
      enrolled: false,
    },
  ]

  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: "Submission deadline approaching",
      message: "The submission deadline for AI Innovation Challenge is in 5 days.",
      date: "June 25, 2023",
    },
    {
      id: 2,
      title: "New hackathon announced",
      message: "A new Web Development Hackathon has been announced. Check it out!",
      date: "June 20, 2023",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="bg-muted/50 border rounded-lg p-4 flex items-start gap-4">
          <Bell className="h-5 w-5 text-primary mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-medium">{notifications[0].title}</h3>
            <p className="text-sm text-muted-foreground">{notifications[0].message}</p>
          </div>
          <Button variant="ghost" size="sm" className="ml-auto">
            Dismiss
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Available Hackathons</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline">Filter</Button>
          <Button variant="outline">Sort</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hackathons.map((hackathon) => (
          <Card key={hackathon.id} className="overflow-hidden flex flex-col">
            <div className="aspect-video w-full overflow-hidden">
              <Image
                src={hackathon.image || "/placeholder.svg"}
                width={400}
                height={200}
                alt={hackathon.title}
                className="object-cover w-full h-full"
              />
            </div>
            <CardHeader className="p-4 pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{hackathon.title}</CardTitle>
                <Badge
                  className={
                    hackathon.status === "active" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }
                >
                  {hackathon.status.charAt(0).toUpperCase() + hackathon.status.slice(1)}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">{hackathon.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 text-sm">
              <p>Deadline: {hackathon.deadline}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 mt-auto">
              {hackathon.enrolled ? (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/student/enrolled/${hackathon.id}`}>View Details</Link>
                </Button>
              ) : (
                <div className="flex gap-2 w-full">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href={`/student/hackathons/${hackathon.id}`}>View</Link>
                  </Button>
                  <Button className="flex-1">Register</Button>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
