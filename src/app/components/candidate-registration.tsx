"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, X, UserPlus } from "lucide-react"
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

interface CandidateRegistrationProps {
  studentNFT: StudentVoterNFT | null
  onCandidateRegistered: (candidate: Candidate) => void
}

export function CandidateRegistration({ studentNFT, onCandidateRegistered }: CandidateRegistrationProps) {
  const [candidateName, setCandidateName] = useState("")
  const [campaignPromises, setCampaignPromises] = useState([""])
  const [isRegistering, setIsRegistering] = useState(false)
  const { toast } = useToast()

  const canRegister = studentNFT && studentNFT.voting_power >= 3 && !studentNFT.is_graduated

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

  const handleRegister = async () => {
    if (!canRegister || !candidateName.trim()) return

    setIsRegistering(true)
    try {
      // This would call the smart contract function
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newCandidate: Candidate = {
        id: `0x${Math.random().toString(16).substr(2, 8)}`,
        student_id: studentNFT!.student_id,
        name: candidateName,
        campaign_promises: campaignPromises.filter((p) => p.trim()),
        vote_count: 0,
      }

      onCandidateRegistered(newCandidate)

      toast({
        title: "Registration Successful!",
        description: "You have been registered as a candidate.",
      })

      // Reset form
      setCandidateName("")
      setCampaignPromises([""])
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

  if (!studentNFT) {
    return (
      <Card>
        <CardContent className="text-center p-8">
          <p className="text-gray-600">Connect your wallet to register as a candidate</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
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
            {studentNFT.is_graduated && <Badge variant="destructive">Graduated students cannot register</Badge>}
            {studentNFT.voting_power < 3 && (
              <Badge variant="secondary">Minimum voting power of 3 required (Junior/Senior status)</Badge>
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

            <Button onClick={handleRegister} disabled={!candidateName.trim() || isRegistering} className="w-full">
              {isRegistering ? "Registering..." : "Register as Candidate"}
            </Button>
          </div>
        )}

        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <strong>Current Status:</strong>
          </p>
          <p>Voting Power: {studentNFT.voting_power}/4</p>
          <p>
            Academic Year: {["Freshman", "Sophomore", "Junior", "Senior"][studentNFT.voting_power - 1] || "Graduate"}
          </p>
          <p>Eligible: {canRegister ? "Yes" : "No"}</p>
        </div>
      </CardContent>
    </Card>
  )
}
