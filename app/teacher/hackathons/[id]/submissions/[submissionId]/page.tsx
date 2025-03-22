"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, FileText, Github, Globe, Check, Star } from "lucide-react"

export default function SubmissionReviewPage({ params }: { params: { id: string; submissionId: string } }) {
  // Sample submission data
  const submission = {
    id: params.submissionId,
    title: "AI-powered Healthcare Assistant",
    team: "Team Alpha",
    tags: ["AI", "Healthcare", "Machine Learning"],
    overview:
      "An AI assistant that helps healthcare professionals diagnose diseases and recommend treatments based on patient symptoms and medical history.",
    format: "GitHub Repository",
    githubUrl: "https://github.com/team-alpha/healthcare-ai",
    demoUrl: "https://healthcare-ai-demo.vercel.app",
    submittedAt: "June 25, 2023",
    reviewed: params.submissionId === "SUB001" || params.submissionId === "SUB003",
  }

  // Sample parameters data
  const parameters = [
    {
      id: 1,
      name: "Innovation",
      description: "Originality and creativity of the solution",
      score: 22,
      maxScore: 25,
    },
    {
      id: 2,
      name: "Technical Complexity",
      description: "Complexity and sophistication of the implementation",
      score: 18,
      maxScore: 20,
    },
    {
      id: 3,
      name: "User Experience",
      description: "Usability and design of the solution",
      score: 12,
      maxScore: 15,
    },
    {
      id: 4,
      name: "Impact",
      description: "Potential impact and relevance to the problem domain",
      score: 23,
      maxScore: 25,
    },
    {
      id: 5,
      name: "Presentation",
      description: "Quality of documentation and presentation",
      score: 13,
      maxScore: 15,
    },
  ]

  const [scores, setScores] = useState(parameters.map((param) => param.score))
  const [feedback, setFeedback] = useState(
    "Excellent project with innovative use of AI for healthcare. The solution is well-implemented and has great potential for real-world impact. The user interface could be improved for better accessibility.",
  )

  const totalScore = scores.reduce((sum, score) => sum + score, 0)
  const maxTotalScore = parameters.reduce((sum, param) => sum + param.maxScore, 0)

  const handleScoreChange = (index: number, value: number[]) => {
    const newScores = [...scores]
    newScores[index] = value[0]
    setScores(newScores)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/teacher/hackathons/${params.id}/submissions`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Submissions
          </Link>
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{submission.title}</h2>
          <p className="text-muted-foreground">
            Submitted by {submission.team} on {submission.submittedAt}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {submission.reviewed ? (
            <Button variant="outline" className="gap-2">
              <Check className="h-4 w-4" />
              Reviewed
            </Button>
          ) : (
            <Button className="gap-2">
              <Star className="h-4 w-4" />
              Submit Review
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {submission.tags.map((tag, index) => (
          <Badge key={index} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>

      <Tabs defaultValue="submission" className="space-y-4">
        <TabsList>
          <TabsTrigger value="submission">Submission</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
        </TabsList>
        <TabsContent value="submission" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{submission.overview}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Github className="h-5 w-5 text-muted-foreground" />
                <a
                  href={submission.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {submission.githubUrl}
                </a>
              </div>
              {submission.demoUrl && (
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <a
                    href={submission.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {submission.demoUrl}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submission Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">project-documentation.pdf</span>
                    <span className="text-xs text-muted-foreground ml-2">(2.5 MB)</span>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">presentation-slides.pdf</span>
                    <span className="text-xs text-muted-foreground ml-2">(1.8 MB)</span>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Criteria</CardTitle>
              <CardDescription>Score the submission based on the following criteria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {parameters.map((param, index) => (
                <div key={param.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{param.name}</h3>
                      <p className="text-sm text-muted-foreground">{param.description}</p>
                    </div>
                    <div className="font-medium">
                      {scores[index]}/{param.maxScore}
                    </div>
                  </div>
                  <Slider
                    value={[scores[index]]}
                    max={param.maxScore}
                    step={1}
                    onValueChange={(value) => handleScoreChange(index, value)}
                  />
                </div>
              ))}
              <div className="flex items-center justify-between pt-4 border-t">
                <h3 className="font-medium">Total Score</h3>
                <div className="font-medium text-lg">
                  {totalScore}/{maxTotalScore} ({Math.round((totalScore / maxTotalScore) * 100)}%)
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feedback</CardTitle>
              <CardDescription>Provide detailed feedback for the submission</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter your feedback here..."
                className="min-h-[150px]"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Save Draft</Button>
              <Button>Submit Review</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

