import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, BarChart } from "lucide-react"

export default function TeacherHackathonsPage() {
  // Sample hackathons data
  const hackathons = [
    {
      id: 1,
      title: "AI Innovation Challenge",
      description: "Create innovative AI solutions for real-world problems",
      image: "/placeholder.svg?height=200&width=400&text=AI+Challenge",
      status: "active",
      deadline: "June 30, 2023",
      participants: 120,
      submissions: 45,
    },
    {
      id: 2,
      title: "Web Development Hackathon",
      description: "Build responsive and accessible web applications",
      image: "/placeholder.svg?height=200&width=400&text=Web+Dev",
      status: "upcoming",
      deadline: "July 30, 2023",
      participants: 85,
      submissions: 0,
    },
    {
      id: 3,
      title: "Mobile App Challenge",
      description: "Develop mobile applications for social good",
      image: "/placeholder.svg?height=200&width=400&text=Mobile+App",
      status: "active",
      deadline: "July 15, 2023",
      participants: 150,
      submissions: 72,
    },
    {
      id: 4,
      title: "Blockchain Hackathon",
      description: "Create innovative blockchain solutions",
      image: "/placeholder.svg?height=200&width=400&text=Blockchain",
      status: "upcoming",
      deadline: "August 15, 2023",
      participants: 90,
      submissions: 0,
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Assigned Hackathons</h2>
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
            <CardContent className="p-4 pt-2 text-sm space-y-2">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Deadline: {hackathon.deadline}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Participants: {hackathon.participants}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <BarChart className="h-4 w-4" />
                <span>Submissions: {hackathon.submissions}</span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 mt-auto">
              <div className="flex gap-2 w-full">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href={`/teacher/hackathons/${hackathon.id}`}>View Details</Link>
                </Button>
                <Button className="flex-1" asChild>
                  <Link href={`/teacher/hackathons/${hackathon.id}/submissions`}>Review Submissions</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

