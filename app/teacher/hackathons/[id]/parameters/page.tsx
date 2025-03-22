"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Slider } from "@/components/ui/slider"
import { Plus, Trash2, Save } from "lucide-react"

export default function ParametersPage({ params }: { params: { id: string } }) {
  // Sample parameters data
  const [parameters, setParameters] = useState([
    {
      id: 1,
      name: "Innovation",
      description: "Originality and creativity of the solution",
      score: 25,
    },
    {
      id: 2,
      name: "Technical Complexity",
      description: "Complexity and sophistication of the implementation",
      score: 20,
    },
    {
      id: 3,
      name: "User Experience",
      description: "Usability and design of the solution",
      score: 15,
    },
    {
      id: 4,
      name: "Impact",
      description: "Potential impact and relevance to the problem domain",
      score: 25,
    },
    {
      id: 5,
      name: "Presentation",
      description: "Quality of documentation and presentation",
      score: 15,
    },
  ])

  const [newParameter, setNewParameter] = useState({
    name: "",
    description: "",
    score: 10,
  })

  const totalScore = parameters.reduce((sum, param) => sum + param.score, 0)

  const handleScoreChange = (index: number, value: number[]) => {
    const updatedParameters = [...parameters]
    updatedParameters[index].score = value[0]
    setParameters(updatedParameters)
  }

  const handleAddParameter = () => {
    if (newParameter.name && newParameter.description) {
      setParameters([
        ...parameters,
        {
          id: parameters.length + 1,
          ...newParameter,
        },
      ])
      setNewParameter({
        name: "",
        description: "",
        score: 10,
      })
    }
  }

  const handleRemoveParameter = (id: number) => {
    setParameters(parameters.filter((param) => param.id !== id))
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Judging Parameters</h2>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Parameters
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>AI Innovation Challenge Parameters</CardTitle>
          <CardDescription>Define the criteria for judging submissions in this hackathon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Criteria</TableHead>
                    <TableHead className="max-w-[300px]">Description</TableHead>
                    <TableHead className="w-[200px]">Score Weight</TableHead>
                    <TableHead className="w-[80px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parameters.map((param, index) => (
                    <TableRow key={param.id}>
                      <TableCell className="font-medium">{param.name}</TableCell>
                      <TableCell>{param.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Slider
                            value={[param.score]}
                            max={50}
                            step={5}
                            className="w-[120px]"
                            onValueChange={(value) => handleScoreChange(index, value)}
                          />
                          <span className="w-8 text-right">{param.score}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveParameter(param.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm">
                Total Score Weight:{" "}
                <span className={totalScore === 100 ? "font-bold text-green-600" : "font-bold text-red-600"}>
                  {totalScore}%
                </span>
                {totalScore !== 100 && <span className="ml-2 text-red-600">(Should be 100%)</span>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Parameter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Parameter Name</Label>
              <Input
                id="name"
                placeholder="e.g., Code Quality"
                value={newParameter.name}
                onChange={(e) => setNewParameter({ ...newParameter, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Quality and readability of the code"
                value={newParameter.description}
                onChange={(e) => setNewParameter({ ...newParameter, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="score">Score Weight (%)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="score"
                  value={[newParameter.score]}
                  max={50}
                  step={5}
                  onValueChange={(value) => setNewParameter({ ...newParameter, score: value[0] })}
                />
                <span className="w-8 text-right">{newParameter.score}%</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddParameter}>
            <Plus className="mr-2 h-4 w-4" />
            Add Parameter
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

