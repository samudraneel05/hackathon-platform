import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Users, Clock, FileText, Bell, Award, Pencil } from "lucide-react"
import Link from "next/link"

export default function HackathonDetail({ params }: { params: { id: string } }) {
  // Sample hackathon data
  const hackathon = {
    id: Number.parseInt(params.id),
    title: "AI Innovation Challenge",
    description:
      "Create innovative AI solutions for real-world problems. Participants will work in teams to develop AI-powered applications that address real-world challenges. The hackathon will focus on machine learning, natural language processing, and computer vision.",
    status: "active",
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    participants: 120,
    submissions: 45,
    acceptedMedia: ["PDF", "Video", "GitHub Repository"],
    deadline: "2023-06-30T23:59:59Z",
    teachers: [
      { id: 1, name: "John Smith", email: "john@example.com" },
      { id: 2, name: "Jane Doe", email: "jane@example.com" },
    ],
    students: [
      { id: 1, name: "Alice Johnson", email: "alice@example.com", status: "registered" },
      { id: 2, name: "Bob Williams", email: "bob@example.com", status: "submitted" },
      { id: 3, name: "Charlie Brown", email: "charlie@example.com", status: "registered" },
    ],
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold tracking-tight">{hackathon.title}</h2>
            <Badge className="bg-green-100 text-green-800">
              {hackathon.status.charAt(0).toUpperCase() + hackathon.status.slice(1)}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">ID: {hackathon.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/hackathons/${hackathon.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button>Publish Results</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hackathon.participants}</div>
            <p className="text-xs text-muted-foreground">
              {hackathon.submissions} submissions ({Math.round((hackathon.submissions / hackathon.participants) * 100)}
              %)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submission Deadline</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">{new Date(hackathon.deadline).toLocaleString()}</div>
            <Button variant="link" className="p-0 h-auto text-xs">
              Change Deadline
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{hackathon.description}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="teachers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="teachers">Assigned Teachers</TabsTrigger>
          <TabsTrigger value="students">Registered Students</TabsTrigger>
          <TabsTrigger value="media">Accepted Media</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        <TabsContent value="teachers" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Assigned Teachers</CardTitle>
              <Button size="sm">Assign Teachers</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hackathon.teachers.map((teacher) => (
                  <div key={teacher.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/placeholder.svg?text=${teacher.name.charAt(0)}`} alt={teacher.name} />
                        <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-sm text-muted-foreground">{teacher.email}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Registered Students</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Export List
                </Button>
                <Button size="sm">Add Students</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hackathon.students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/placeholder.svg?text=${student.name.charAt(0)}`} alt={student.name} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                    <Badge
                      className={
                        student.status === "submitted" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                      }
                    >
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Accepted Media Types</CardTitle>
              <Button size="sm">Update Media Types</Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {hackathon.acceptedMedia.map((media, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    <FileText className="mr-1 h-3 w-3" />
                    {media}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Notifications</CardTitle>
              <Button size="sm">Send Notification</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 border-b pb-4">
                  <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Submission deadline reminder</p>
                    <p className="text-sm text-muted-foreground">
                      Reminder: The submission deadline is approaching. Please submit your projects by June 30, 2023.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Sent on: June 25, 2023</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Welcome to AI Innovation Challenge</p>
                    <p className="text-sm text-muted-foreground">
                      Welcome to the AI Innovation Challenge! We're excited to have you participate in this hackathon.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Sent on: June 1, 2023</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Results</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Preview Results
                </Button>
                <Button size="sm">Publish Results</Button>
              </div>
            </CardHeader>
            <CardContent>
              {hackathon.status === "completed" ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 border-b pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                      <Award className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">First Place: Team Alpha</p>
                      <p className="text-sm text-muted-foreground">AI-powered healthcare assistant</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Submission
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 border-b pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                      <Award className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Second Place: Team Beta</p>
                      <p className="text-sm text-muted-foreground">Smart energy management system</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Submission
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                      <Award className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Third Place: Team Gamma</p>
                      <p className="text-sm text-muted-foreground">AI-driven educational platform</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Submission
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Results Not Available Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-md mt-1">
                    The hackathon is still in progress. Results will be available after the submission deadline and
                    evaluation process.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

