"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, TrendingUp, Users } from "lucide-react"

interface Candidate {
  id: string
  student_id: number
  name: string
  campaign_promises: string[]
  vote_count: number
}

interface ElectionResultsProps {
  candidates: Candidate[]
}

export function ElectionResults({ candidates }: ElectionResultsProps) {
  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.vote_count, 0)
  const sortedCandidates = [...candidates].sort((a, b) => b.vote_count - a.vote_count)
  const winner = sortedCandidates[0]

  const getVotePercentage = (votes: number) => {
    return totalVotes > 0 ? (votes / totalVotes) * 100 : 0
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Election Results
          </CardTitle>
          <CardDescription>Real-time results from the student government election</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">{totalVotes}</p>
              <p className="text-sm text-gray-600">Total Votes</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold">{candidates.length}</p>
              <p className="text-sm text-gray-600">Candidates</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <p className="text-lg font-bold">{winner?.name || "TBD"}</p>
              <p className="text-sm text-gray-600">Leading Candidate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {sortedCandidates.map((candidate, index) => (
          <Card key={candidate.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                    {candidate.name}
                    {index === 0 && <Badge className="bg-yellow-500">Leading</Badge>}
                  </CardTitle>
                  <CardDescription>Student ID: {candidate.student_id}</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{candidate.vote_count}</p>
                  <p className="text-sm text-gray-600">
                    {getVotePercentage(candidate.vote_count).toFixed(1)}% of votes
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Progress value={getVotePercentage(candidate.vote_count)} className="h-3" />
                <div>
                  <h4 className="font-medium mb-2">Campaign Promises:</h4>
                  <ul className="grid md:grid-cols-2 gap-1">
                    {candidate.campaign_promises.map((promise, promiseIndex) => (
                      <li key={promiseIndex} className="text-sm text-gray-600">
                        • {promise}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {candidates.length === 0 && (
        <Card>
          <CardContent className="text-center p-8">
            <p className="text-gray-600">No election results available yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
