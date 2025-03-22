"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, Filter, Search, Check, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function SubmissionsPage({ params }: { params: { id: string } }) {
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [perPage, setPerPage] = useState("10")

  // Sample submissions data
  const submissions = [
    {
      id: "SUB001",
      title: "AI-powered Healthcare Assistant",
      tags: ["AI", "Healthcare", "Machine Learning"],
      format: "GitHub Repository",
      overview: "An AI assistant that helps healthcare professionals diagnose diseases.",
      reviewed: true,
    },
    {
      id: "SUB002",
      title: "Smart Energy Management System",
      tags: ["IoT", "Energy", "Sustainability"],
      format: "PDF + Demo Video",
      overview: "A system that optimizes energy usage in buildings using IoT sensors.",
      reviewed: false,
    },
    {
      id: "SUB003",
      title: "Educational Platform for Kids",
      tags: ["Education", "AI", "Web App"],
      format: "Web Application",
      overview: "An interactive platform that helps children learn programming concepts.",
      reviewed: true,
    },
    {
      id: "SUB004",
      title: "Blockchain-based Supply Chain",
      tags: ["Blockchain", "Supply Chain", "Logistics"],
      format: "GitHub Repository",
      overview: "A blockchain solution for transparent supply chain management.",
      reviewed: false,
    },
    {
      id: "SUB005",
      title: "AR Navigation App",
      tags: ["AR", "Navigation", "Mobile"],
      format: "Mobile App + Video",
      overview: "An augmented reality app that provides navigation assistance.",
      reviewed: false,
    },
  ]

  // Filter submissions based on filter and search
  const filteredSubmissions = submissions.filter((submission) => {
    if (filter === "reviewed" && !submission.reviewed) return false
    if (filter === "unreviewed" && submission.reviewed) return false

    if (search) {
      const searchLower = search.toLowerCase()
      return (
        submission.title.toLowerCase().includes(searchLower) ||
        submission.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        submission.overview.toLowerCase().includes(searchLower)
      )
    }

    return true
  })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Submissions</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline">Export</Button>
          <Button>Shortlist Top 10</Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>AI Innovation Challenge Submissions</CardTitle>
          <CardDescription>Review and manage submissions for this hackathon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search submissions..."
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Submissions</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="unreviewed">Not Reviewed</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="score">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score">Overall Score</SelectItem>
                    <SelectItem value="innovation">Innovation</SelectItem>
                    <SelectItem value="technical">Technical Complexity</SelectItem>
                    <SelectItem value="ux">User Experience</SelectItem>
                    <SelectItem value="impact">Impact</SelectItem>
                    <SelectItem value="presentation">Presentation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="shortlist-count" className="text-sm whitespace-nowrap">
                    Shortlist top:
                  </Label>
                  <Select defaultValue="10">
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm">Apply</Button>
                </div>
                <Label htmlFor="per-page" className="text-sm">
                  Show:
                </Label>
                <Select value={perPage} onValueChange={setPerPage}>
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead className="max-w-[200px]">Overview</TableHead>
                    <TableHead className="w-[100px] text-center">View More</TableHead>
                    <TableHead className="w-[100px] text-center">Reviewed</TableHead>
                    <TableHead className="w-[100px] text-center">Shortlist</TableHead>
                    <TableHead className="w-[150px] text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.id}</TableCell>
                      <TableCell>{submission.title}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {submission.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{submission.format}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={submission.overview}>
                        {submission.overview}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/teacher/hackathons/${params.id}/submissions/${submission.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                      <TableCell className="text-center">
                        {submission.reviewed ? (
                          <Check className="mx-auto h-4 w-4 text-green-500" />
                        ) : (
                          <X className="mx-auto h-4 w-4 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={submission.id === "SUB001" || submission.id === "SUB003"}
                          onCheckedChange={() => {}}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="outline" size="sm">
                          {submission.reviewed ? "Edit Review" : "Review"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{filteredSubmissions.length}</span> of{" "}
                <span className="font-medium">{submissions.length}</span> submissions
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

