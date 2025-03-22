import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Clock } from "lucide-react"

export default function HackathonsList() {
  // Sample hackathon data
  const hackathons = [
    {
      id: 1,
      title: "AI Innovation Challenge",
      description: "Create innovative AI solutions for real-world problems",
      status: "active",
      startDate: "2023-06-01",
      endDate: "2023-06-30",
      participants: 120,
      submissions: 45,
    },
    {
      id: 2,
      title: "Web Development Hackathon",
      description: "Build responsive and accessible web applications",
      status: "upcoming",
      startDate: "2023-07-15",
      endDate: "2023-07-30",
      participants: 85,
      submissions: 0,
    },
    {
      id: 3,
      title: "Mobile App Challenge",
      description: "Develop mobile applications for social good",
      status: "completed",
      startDate: "2023-05-01",
      endDate: "2023-05-15",
      participants: 150,
      submissions: 72,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Hackathons</h2>
        <Button asChild>
          <Link href="/admin/hackathons/create">Create Hackathon</Link>
        </Button>
      </div>
      <div className="grid gap-4">
        {hackathons.map((hackathon) => (
          <Card key={hackathon.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-xl">{hackathon.title}</CardTitle>
                <CardDescription className="mt-1">{hackathon.description}</CardDescription>
              </div>
              <Badge className={getStatusColor(hackathon.status)}>
                {hackathon.status.charAt(0).toUpperCase() + hackathon.status.slice(1)}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <span className="font-medium">Duration:</span> {new Date(hackathon.startDate).toLocaleDateString()}{" "}
                    - {new Date(hackathon.endDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <span className="font-medium">Participants:</span> {hackathon.participants}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <span className="font-medium">Submissions:</span> {hackathon.submissions}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/hackathons/${hackathon.id}`}>View Details</Link>
                </Button>
                <Button variant="outline" size="sm">
                  Assign Teachers
                </Button>
                <Button variant="outline" size="sm">
                  View Participants
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

