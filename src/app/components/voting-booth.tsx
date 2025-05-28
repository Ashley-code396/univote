"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Vote, Star, CheckCircle, AlertCircle, Users, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useVotingStore } from "../store/voting-store"

// Extended interface for StudentVoterNFT with frontend-only properties
interface ExtendedStudentVoterNFT {
  id: string
  name: string
  description: string
  image_url: string
  student_id: number
  voting_power: number
  is_graduated: boolean
  last_updated: number
  has_voted: boolean
  // Frontend-only properties
  academic_year?: string
  gpa?: number
  enrollment_date?: string
}

// Extended interface for Candidate with frontend-only properties
interface ExtendedCandidate {
  id: string
  student_id: number
  name: string
  campaign_promises: string[]
  vote_count: number
  // Frontend-only properties
  weighted_votes?: number
  profile_image?: string
  social_links?: {
    twitter?: string
    instagram?: string
    linkedin?: string
  }
  endorsements?: string[]
}

interface VotingBoothProps {
  studentNFT: ExtendedStudentVoterNFT | null
  candidates: ExtendedCandidate[]
}

export function VotingBooth({ studentNFT, candidates }: VotingBoothProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { toast } = useToast()
  const { castVote } = useVotingStore()

  const canVote = studentNFT && !studentNFT.is_graduated && !studentNFT.has_voted

  const handleVoteClick = (candidateId: string) => {
    if (!canVote) return
    setSelectedCandidate(candidateId)
    setShowConfirmation(true)
  }

  const confirmVote = async () => {
    if (!canVote || !selectedCandidate || !studentNFT) return

    setIsVoting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      castVote(selectedCandidate, studentNFT.voting_power)

      toast({
        title: "Vote Cast Successfully!",
        description: `Your vote has been recorded with ${studentNFT.voting_power} voting power.`,
      })

      setShowConfirmation(false)
      setSelectedCandidate(null)
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

  const selectedCandidateData = candidates.find((c) => c.id === selectedCandidate)

  if (!studentNFT) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="text-center p-12">
          <Lock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">Wallet Required</h3>
          <p className="text-gray-600">Connect your wallet to access the voting booth</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Voting Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Vote className="h-6 w-6" />
              Voting Booth
            </CardTitle>
            <CardDescription className="text-green-100">
              Cast your vote for the next student government representative
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div>
                <p className="font-medium">Your Voting Power</p>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < studentNFT.voting_power ? "fill-yellow-300 text-yellow-300" : "text-white/30"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-bold">
                    {studentNFT.voting_power} vote{studentNFT.voting_power !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <Badge variant={canVote ? "secondary" : "destructive"} className="bg-white/20 text-white">
                {studentNFT.has_voted ? "Already Voted" : studentNFT.is_graduated ? "Graduated" : "Eligible"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Voting Status */}
      {!canVote && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="border-0 shadow-lg border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <div>
                  <h3 className="font-semibold text-red-700">Voting Not Available</h3>
                  <p className="text-red-600">
                    {studentNFT.has_voted
                      ? "You have already cast your vote in this election."
                      : "You are not eligible to vote in this election."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Candidates */}
      <div className="grid gap-6">
        {candidates.map((candidate, index) => (
          <motion.div
            key={candidate.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`border-0 shadow-lg transition-all cursor-pointer hover:shadow-xl ${
                selectedCandidate === candidate.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
              } ${!canVote ? "opacity-60" : ""}`}
              onClick={() => canVote && handleVoteClick(candidate.id)}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={candidate.profile_image || "/placeholder.svg"} />
                    <AvatarFallback>
                      {candidate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{candidate.name}</CardTitle>
                        <CardDescription>Student ID: {candidate.student_id}</CardDescription>
                      </div>
                      <div className="text-right">
                        {candidate.weighted_votes !== undefined && (
                          <div className="flex items-center gap-2 mb-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-bold">{candidate.weighted_votes.toFixed(1)}</span>
                          </div>
                        )}
                        <Badge variant="outline">{candidate.vote_count} votes</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Key Campaign Promises:</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {candidate.campaign_promises.slice(0, 4).map((promise, promiseIndex) => (
                        <div key={promiseIndex} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                          <span>{promise}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {canVote && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleVoteClick(candidate.id)
                      }}
                      className="w-full"
                      variant={selectedCandidate === candidate.id ? "default" : "outline"}
                    >
                      <Vote className="h-4 w-4 mr-2" />
                      Vote for {candidate.name}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {candidates.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center p-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No Candidates Available</h3>
              <p className="text-gray-600">No candidates have registered for this election yet.</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && selectedCandidateData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <Vote className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                <h3 className="text-xl font-bold mb-2">Confirm Your Vote</h3>
                <p className="text-gray-600">Are you sure you want to vote for this candidate?</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar>
                    <AvatarImage src={selectedCandidateData.profile_image || "/placeholder.svg"} />
                    <AvatarFallback>
                      {selectedCandidateData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{selectedCandidateData.name}</h4>
                    <p className="text-sm text-gray-600">Student ID: {selectedCandidateData.student_id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Your voting power:</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: studentNFT.voting_power }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="font-bold">{studentNFT.voting_power}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowConfirmation(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={confirmVote} disabled={isVoting} className="flex-1">
                  {isVoting ? "Voting..." : "Confirm Vote"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}