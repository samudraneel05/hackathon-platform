"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, X, Calendar, Clock } from "lucide-react"

// Create a simple DatePicker component since it's not included in shadcn/ui by default
function DatePicker({ value, onChange }: { value: Date; onChange: (date: Date) => void }) {
  return (
    <div className="relative">
      <Input
        type="date"
        value={value.toISOString().split("T")[0]}
        onChange={(e) => onChange(new Date(e.target.value))}
        className="w-full"
      />
      <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  )
}

export default function EditHackathonPage({ params }: { params: { id: string } }) {
  // Sample hackathon data (in a real app, you would fetch this from an API)
  const [title, setTitle] = useState("AI Innovation Challenge")
  const [description, setDescription] = useState(
    "Create innovative AI solutions for real-world problems. Participants will work in teams to develop AI-powered applications that address real-world challenges. The hackathon will focus on machine learning, natural language processing, and computer vision.",
  )
  const [startDate, setStartDate] = useState(new Date("2023-06-01"))
  const [endDate, setEndDate] = useState(new Date("2023-06-30"))
  const [submissionDeadline, setSubmissionDeadline] = useState(new Date("2023-06-30T23:59:59"))
  const [acceptedMediaTypes, setAcceptedMediaTypes] = useState<string[]>(["PDF", "GitHub Repository", "Video"])
  const [newMediaType, setNewMediaType] = useState("")
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>(["1", "2"])

  // Sample teachers data
  const teachers = [
    { id: "1", name: "John Smith", email: "john@example.com" },
    { id: "2", name: "Jane Doe", email: "jane@example.com" },
    { id: "3", name: "Robert Johnson", email: "robert@example.com" },
    { id: "4", name: "Emily Davis", email: "emily@example.com" },
  ]

  const handleAddMediaType = () => {
    if (newMediaType && !acceptedMediaTypes.includes(newMediaType)) {
      setAcceptedMediaTypes([...acceptedMediaTypes, newMediaType])
      setNewMediaType("")
    }
  }

  const handleRemoveMediaType = (typeToRemove: string) => {
    setAcceptedMediaTypes(acceptedMediaTypes.filter((type) => type !== typeToRemove))
  }

  const handleTeacherSelection = (teacherId: string) => {
    if (selectedTeachers.includes(teacherId)) {
      setSelectedTeachers(selectedTeachers.filter((id) => id !== teacherId))
    } else {
      setSelectedTeachers([...selectedTeachers, teacherId])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit the form data to update the hackathon
    console.log({
      title,
      description,
      startDate,
      endDate,
      submissionDeadline,
      acceptedMediaTypes,
      selectedTeachers,
    })
    // Redirect to the hackathon details page
    // router.push(`/admin/hackathons/${params.id}`)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/admin/hackathons/${params.id}`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Hackathon
          </Link>
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Edit Hackathon</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update the basic details for the hackathon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Hackathon Title</Label>
                <Input
                  id="title"
                  placeholder="Enter hackathon title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter hackathon description"
                  className="min-h-[150px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Duration</CardTitle>
              <CardDescription>Update the start and end dates for the hackathon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <DatePicker value={startDate} onChange={setStartDate} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <DatePicker value={endDate} onChange={setEndDate} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="submission-deadline">Submission Deadline</Label>
                <div className="relative">
                  <Input
                    id="submission-deadline"
                    type="datetime-local"
                    value={submissionDeadline.toISOString().slice(0, 16)}
                    onChange={(e) => setSubmissionDeadline(new Date(e.target.value))}
                    className="w-full"
                  />
                  <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accepted Media Types</CardTitle>
              <CardDescription>Update the types of media that participants can submit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {acceptedMediaTypes.map((type) => (
                  <Badge key={type} variant="secondary" className="flex items-center gap-1">
                    {type}
                    <button
                      type="button"
                      onClick={() => handleRemoveMediaType(type)}
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {type}</span>
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add media type (e.g., PDF, Video)"
                  value={newMediaType}
                  onChange={(e) => setNewMediaType(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={handleAddMediaType}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Assigned Teachers</CardTitle>
              <CardDescription>Update the teachers who will be responsible for this hackathon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teachers.map((teacher) => (
                  <div key={teacher.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`teacher-${teacher.id}`}
                      checked={selectedTeachers.includes(teacher.id)}
                      onCheckedChange={() => handleTeacherSelection(teacher.id)}
                    />
                    <Label
                      htmlFor={`teacher-${teacher.id}`}
                      className="flex flex-1 items-center justify-between cursor-pointer"
                    >
                      <span>{teacher.name}</span>
                      <span className="text-sm text-muted-foreground">{teacher.email}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Additional Settings</CardTitle>
              <CardDescription>Update additional settings for the hackathon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="max-team-size">Maximum Team Size</Label>
                <Select defaultValue="4">
                  <SelectTrigger id="max-team-size" className="w-full">
                    <SelectValue placeholder="Select maximum team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 (Individual)</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select defaultValue="public">
                  <SelectTrigger id="visibility" className="w-full">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private (Invite Only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="auto-publish-results" defaultChecked />
                <Label htmlFor="auto-publish-results">
                  Automatically publish results when all submissions are reviewed
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" asChild>
                <Link href={`/admin/hackathons/${params.id}`}>Cancel</Link>
              </Button>
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}

