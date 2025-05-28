"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, X, UserPlus, Users, MessageSquare } from "lucide-react"
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

interface CandidateHubProps {
  studentNFT: ExtendedStudentVoterNFT | null
  candidates: ExtendedCandidate[]
}

export function CandidateHub({ studentNFT, candidates }: CandidateHubProps) {
  const [showRegistration, setShowRegistration] = useState(false)
  const [candidateName, setCandidateName] = useState("")
  const [campaignPromises, setCampaignPromises] = useState([""])
  const [isRegistering, setIsRegistering] = useState(false)
  const { toast } = useToast()
  const { addCandidate } = useVotingStore()

  const canRegister = studentNFT && studentNFT.voting_power >= 3 && !studentNFT.is_graduated && !studentNFT.has_voted

  const addPromise = () => {
    setCampaignPromises([...campaignPromises, ""])
  }

  const updatePromise = (index: number, value: string) => {
    const updated = [...campaignPromises]
    updated[index] = value
    setCampaignPromises(updated)
  }

  const removePromise = (index: number) => {
    setCampaignPromises(campaignPromises.filter((_, i) => i !== index))
  }

  // Candidate registration handler
  const handleRegister = async () => {
    setIsRegistering(true)
    try {
      const newCandidate: ExtendedCandidate = {
        id: `0x${Math.random().toString(16).substr(2, 8)}`,
        student_id: studentNFT!.student_id,
        name: candidateName,
        campaign_promises: campaignPromises.filter((p) => p.trim()),
        vote_count: 0,
        weighted_votes: 0, // Ensure this is always a number
        profile_image: studentNFT?.image_url || "/placeholder.svg",
        social_links: {},
        endorsements: []
      }

      addCandidate({
        ...newCandidate,
        weighted_votes: newCandidate.weighted_votes ?? 0, // Explicitly ensure number type
        profile_image: newCandidate.profile_image ?? "/placeholder.svg",
        social_links: newCandidate.social_links ?? { twitter: undefined, instagram: undefined, linkedin: undefined },
        endorsements: newCandidate.endorsements ?? []
      })

      toast({
        title: "Registration Successful!",
        description: "You have been registered as a candidate.",
      })

      setCandidateName("")
      setCampaignPromises([""])
      setShowRegistration(false)
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error registering your candidacy.",
        variant: "destructive",
      })
    } finally {
      setIsRegistering(false)
    }
  }

  // Calculate academic year based on voting power (frontend-only)
  const getAcademicYear = (votingPower: number) => {
    if (votingPower >= 3) return "Senior"
    if (votingPower >= 2) return "Junior"
    return "Sophomore"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="h-6 w-6" />
              Candidate Hub
            </CardTitle>
            <CardDescription className="text-purple-100">
              Meet the candidates running for student government
            </CardDescription>
          </CardHeader>
          <CardContent>
            {canRegister && (
              <Button
                onClick={() => setShowRegistration(!showRegistration)}
                variant="secondary"
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {showRegistration ? "Cancel Registration" : "Register as Candidate"}
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Registration Form */}
      <AnimatePresence>
        {showRegistration && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Candidate Registration
                </CardTitle>
                <CardDescription>Register to run for student government (Juniors and Seniors only)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!canRegister ? (
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-2">Registration Requirements Not Met</p>
                    {studentNFT?.is_graduated && (
                      <Badge variant="destructive">Graduated students cannot register</Badge>
                    )}
                    {studentNFT && studentNFT.voting_power < 3 && (
                      <Badge variant="secondary">Minimum voting power of 3 required (Junior/Senior status)</Badge>
                    )}
                    {studentNFT?.has_voted && (
                      <Badge variant="destructive">Students who have voted cannot register</Badge>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Candidate Name</label>
                      <Input
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Campaign Promises</label>
                      <div className="space-y-2">
                        {campaignPromises.map((promise, index) => (
                          <div key={index} className="flex gap-2">
                            <Textarea
                              value={promise}
                              onChange={(e) => updatePromise(index, e.target.value)}
                              placeholder={`Campaign promise ${index + 1}`}
                              className="min-h-[80px]"
                            />
                            {campaignPromises.length > 1 && (
                              <Button type="button" variant="outline" size="sm" onClick={() => removePromise(index)}>
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addPromise} className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Promise
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={handleRegister}
                      disabled={!candidateName.trim() || isRegistering}
                      className="w-full"
                    >
                      {isRegistering ? "Registering..." : "Register as Candidate"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Candidates List */}
      <div className="grid gap-6">
        {candidates.map((candidate, index) => (
          <motion.div
            key={candidate.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
              <CardHeader>
                <div className="flex items-start gap-4">
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
                        <CardDescription>
                          Student ID: {candidate.student_id} • {studentNFT?.academic_year || getAcademicYear(studentNFT?.voting_power || 1)}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{candidate.vote_count} votes</Badge>
                        {candidate.weighted_votes !== undefined && (
                          <Badge variant="outline" className="ml-2">{candidate.weighted_votes.toFixed(1)} weighted</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Campaign Promises */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Campaign Promises
                  </h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {candidate.campaign_promises.map((promise, promiseIndex) => (
                      <div key={promiseIndex} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{promise}</span>
                      </div>
                    ))}
                  </div>
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
              <h3 className="text-xl font-semibold mb-2">No Candidates Yet</h3>
              <p className="text-gray-600 mb-4">Be the first to register as a candidate!</p>
              {canRegister && (
                <Button onClick={() => setShowRegistration(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register Now
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}