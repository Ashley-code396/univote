"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Vote, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StudentVoterNFT {
  id: string
  name: string
  description: string
  image_url: string
  student_id: number
  voting_power: number
  is_graduated: boolean
  last_updated: number
  has_voted: boolean
}

interface Candidate {
  id: string
  student_id: number
  name: string
  campaign_promises: string[]
  vote_count: number
}

interface VotingInterfaceProps {
  studentNFT: StudentVoterNFT | null
  candidates: Candidate[]
  onVoteCast: (candidateId: string) => void
}

export function VotingInterface({ studentNFT, candidates, onVoteCast }: VotingInterfaceProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const { toast } = useToast()

  const canVote = studentNFT && !studentNFT.is_graduated && !studentNFT.has_voted

  const handleVote = async (candidateId: string) => {
    if (!canVote) return

    setIsVoting(true)
    try {
      // This would call the smart contract function
      await new Promise((resolve) => setTimeout(resolve, 2000))

      onVoteCast(candidateId)

      toast({
        title: "Vote Cast Successfully!",
        description: `Your vote has been recorded with ${studentNFT.voting_power} voting power.`,
      })
    } catch (error) {
      toast({
        title: "Voting Failed",
        description: "There was an error casting your vote.",
        variant: "destructive",
      })
    } finally {
      setIsVoting(false)
    }
  }

  if (!studentNFT) {
    return (
      <Card>
        <CardContent className="text-center p-8">
          <p className="text-gray-600">Connect your wallet to vote</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="h-5 w-5" />
            Cast Your Vote
          </CardTitle>
          <CardDescription>Select a candidate to vote for in the student government election</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="font-medium">Your Voting Power</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < studentNFT.voting_power ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {studentNFT.voting_power} vote{studentNFT.voting_power !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <Badge variant={canVote ? "default" : "destructive"}>
              {studentNFT.has_voted ? "Already Voted" : studentNFT.is_graduated ? "Graduated" : "Eligible"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {!canVote && (
        <Card>
          <CardContent className="text-center p-6">
            <p className="text-gray-600">
              {studentNFT.has_voted
                ? "You have already cast your vote in this election."
                : "You are not eligible to vote."}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {candidates.map((candidate) => (
          <Card
            key={candidate.id}
            className={`cursor-pointer transition-all ${
              selectedCandidate === candidate.id ? "ring-2 ring-blue-500" : ""
            } ${!canVote ? "opacity-50" : ""}`}
            onClick={() => canVote && setSelectedCandidate(candidate.id)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{candidate.name}</CardTitle>
                  <CardDescription>Student ID: {candidate.student_id}</CardDescription>
                </div>
                <Badge variant="outline">{candidate.vote_count} votes</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Campaign Promises:</h4>
                  <ul className="space-y-1">
                    {candidate.campaign_promises.map((promise, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
                        {promise}
                      </li>
                    ))}
                  </ul>
                </div>

                {canVote && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleVote(candidate.id)
                    }}
                    disabled={isVoting}
                    className="w-full"
                    variant={selectedCandidate === candidate.id ? "default" : "outline"}
                  >
                    {isVoting ? "Voting..." : "Vote for this candidate"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {candidates.length === 0 && (
        <Card>
          <CardContent className="text-center p-8">
            <p className="text-gray-600">No candidates have registered yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
