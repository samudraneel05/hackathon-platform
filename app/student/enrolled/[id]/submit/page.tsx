"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileUp, X, Plus, ArrowLeft, FileText } from "lucide-react"

export default function SubmitProjectPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [submissionType, setSubmissionType] = useState("github")
  const [githubUrl, setGithubUrl] = useState("")
  const [demoUrl, setDemoUrl] = useState("")

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit the form data to the server
    console.log({
      title,
      description,
      tags,
      files,
      submissionType,
      githubUrl,
      demoUrl,
    })
    // Redirect to the enrolled hackathon page
    // router.push(`/student/enrolled/${params.id}`)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/student/enrolled/${params.id}`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Hackathon
          </Link>
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Submit Project</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Innovation Challenge Submission</CardTitle>
          <CardDescription>Fill out the form below to submit your project for the hackathon</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                placeholder="Enter your project title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your project, its features, and how it addresses the hackathon challenge"
                className="min-h-[150px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Project Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {tag} tag</span>
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag (e.g., AI, Web, Mobile)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="submission-type">Submission Type</Label>
              <Select value={submissionType} onValueChange={setSubmissionType}>
                <SelectTrigger id="submission-type">
                  <SelectValue placeholder="Select submission type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="github">GitHub Repository</SelectItem>
                  <SelectItem value="file">File Upload</SelectItem>
                  <SelectItem value="demo">Demo Link</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {submissionType === "github" && (
              <div className="space-y-2">
                <Label htmlFor="github-url">GitHub Repository URL</Label>
                <Input
                  id="github-url"
                  placeholder="https://github.com/username/repository"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  required={submissionType === "github"}
                />
              </div>
            )}

            {submissionType === "demo" && (
              <div className="space-y-2">
                <Label htmlFor="demo-url">Demo URL</Label>
                <Input
                  id="demo-url"
                  placeholder="https://your-demo-url.com"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  required={submissionType === "demo"}
                />
              </div>
            )}

            {submissionType === "file" && (
              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload Files</Label>
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FileUp className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">PDF, ZIP, or other project files (MAX. 50MB)</p>
                      </div>
                      <Input
                        id="file-upload"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                        required={submissionType === "file" && files.length === 0}
                      />
                    </label>
                  </div>
                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium">Selected Files:</p>
                      <div className="space-y-2">
                        {Array.from(files).map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setFiles(files.filter((_, i) => i !== index))}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href={`/student/enrolled/${params.id}`}>Cancel</Link>
            </Button>
            <Button type="submit">Submit Project</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

