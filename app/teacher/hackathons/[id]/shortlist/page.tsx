"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { GripVertical, Send } from "lucide-react"

export default function ShortlistPage({ params }: { params: { id: string } }) {
  // Sample shortlisted submissions
  const [shortlist, setShortlist] = useState([
    {
      id: "SUB001",
      title: "AI-powered Healthcare Assistant",
      team: "Team Alpha",
      tags: ["AI", "Healthcare", "Machine Learning"],
      score: 92,
    },
    {
      id: "SUB003",
      title: "Educational Platform for Kids",
      team: "Team Gamma",
      tags: ["Education", "AI", "Web App"],
      score: 88,
    },
    {
      id: "SUB002",
      title: "Smart Energy Management System",
      team: "Team Beta",
      tags: ["IoT", "Energy", "Sustainability"],
      score: 85,
    },
    {
      id: "SUB005",
      title: "AR Navigation App",
      team: "Team Epsilon",
      tags: ["AR", "Navigation", "Mobile"],
      score: 82,
    },
    {
      id: "SUB004",
      title: "Blockchain-based Supply Chain",
      team: "Team Delta",
      tags: ["Blockchain", "Supply Chain", "Logistics"],
      score: 78,
    },
  ])

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(shortlist)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setShortlist(items)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Shortlisted Submissions</h2>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Send to Admin for Review
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>AI Innovation Challenge Shortlist</CardTitle>
          <CardDescription>Drag and drop to reorder the shortlisted submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="shortlist">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {shortlist.map((submission, index) => (
                    <Draggable key={submission.id} draggableId={submission.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center rounded-md border p-4 bg-card"
                        >
                          <div {...provided.dragHandleProps} className="mr-4 flex items-center self-stretch px-1">
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-bold">
                                #{index + 1}
                              </Badge>
                              <h3 className="font-medium">{submission.title}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {submission.team} • Score: {submission.score}/100
                            </p>
                            <div className="flex flex-wrap gap-1 pt-1">
                              {submission.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <div className="mt-6 flex justify-center">
            <Button variant="outline" className="w-full max-w-md">
              <Send className="mr-2 h-4 w-4" />
              Send to Admin for Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

