"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Shield, UserPlus, BarChart3, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AdminPanelProps {
  isAdmin: boolean
}

export function AdminPanel({ isAdmin }: AdminPanelProps) {
  const [studentId, setStudentId] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isTallying, setIsTallying] = useState(false)
  const { toast } = useToast()

  const createStudentNFT = async () => {
    if (!studentId.trim()) return

    setIsCreating(true)
    try {
      // This would call the smart contract function
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Student NFT Created!",
        description: `NFT created for student ID: ${studentId}`,
      })

      setStudentId("")
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "There was an error creating the student NFT.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const tallyVotes = async () => {
    setIsTallying(true)
    try {
      // This would call the smart contract function
      await new Promise((resolve) => setTimeout(resolve, 3000))

      toast({
        title: "Votes Tallied!",
        description: "Election results have been calculated and recorded.",
      })
    } catch (error) {
      toast({
        title: "Tallying Failed",
        description: "There was an error tallying the votes.",
        variant: "destructive",
      })
    } finally {
      setIsTallying(false)
    }
  }

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="text-center p-8">
          <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Admin Access Required</h3>
          <p className="text-gray-600">You need admin privileges to access this panel.</p>
          <Badge variant="destructive" className="mt-4">
            Not Authorized
          </Badge>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Panel
          </CardTitle>
          <CardDescription>Administrative functions for managing the voting system</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge className="bg-green-500">Admin Access Granted</Badge>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Create Student NFT
            </CardTitle>
            <CardDescription>Mint a new voting NFT for a student</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Student ID</label>
              <Input
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter student ID"
                type="number"
              />
            </div>
            <Button onClick={createStudentNFT} disabled={!studentId.trim() || isCreating} className="w-full">
              {isCreating ? "Creating..." : "Create Student NFT"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Tally Votes
            </CardTitle>
            <CardDescription>Calculate and record final election results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                This action will finalize the election and calculate results for all candidates.
              </p>
            </div>
            <Button onClick={tallyVotes} disabled={isTallying} className="w-full" variant="destructive">
              {isTallying ? "Tallying..." : "Tally All Votes"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            System Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold">42</p>
              <p className="text-sm text-gray-600">Total Students</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold">37</p>
              <p className="text-sm text-gray-600">Votes Cast</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold">2</p>
              <p className="text-sm text-gray-600">Candidates</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold">88%</p>
              <p className="text-sm text-gray-600">Participation</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
