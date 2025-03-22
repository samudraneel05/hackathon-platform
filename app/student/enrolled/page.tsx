import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, FileUp, Award } from "lucide-react"

export default function EnrolledHackathonsPage() {
  // Sample enrolled hackathons data
  const enrolledHackathons = [
    {
      id: 1,
      title: "AI Innovation Challenge",
      description: "Create innovative AI solutions for real-world problems",
      image: "/placeholder.svg?height=200&width=400&text=AI+Challenge",
      status: "active",
      deadline: "June 30, 2023",
      submitted: false,
      daysLeft: 5,
    },
    {
      id: 3,
      title: "Mobile App Challenge",
      description: "Develop mobile applications for social good",
      image: "/placeholder.svg?height=200&width=400&text=Mobile+App",
      status: "active",
      deadline: "July 15, 2023",
      submitted: true,
      daysLeft: 20,
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Enrolled Hackathons</h2>
      </div>

      {enrolledHackathons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Award className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No Enrolled Hackathons</h3>
          <p className="text-sm text-muted-foreground max-w-md mt-1 mb-4">
            You haven't enrolled in any hackathons yet. Browse available hackathons and register to participate.
          </p>
          <Button asChild>
            <Link href="/student/dashboard">Browse Hackathons</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrolledHackathons.map((hackathon) => (
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
                    className={hackathon.submitted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                  >
                    {hackathon.submitted ? "Submitted" : "Not Submitted"}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">{hackathon.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    Deadline: {hackathon.deadline} ({hackathon.daysLeft} days left)
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 mt-auto">
                <div className="flex gap-2 w-full">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href={`/student/enrolled/${hackathon.id}`}>View Details</Link>
                  </Button>
                  {!hackathon.submitted ? (
                    <Button className="flex-1" asChild>
                      <Link href={`/student/enrolled/${hackathon.id}/submit`}>
                        <FileUp className="mr-2 h-4 w-4" />
                        Submit Project
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/student/enrolled/${hackathon.id}/submission`}>View Submission</Link>
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

