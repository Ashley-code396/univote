"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GraduationCap, Star, Clock, CheckCircle, TrendingUp, Calendar, Award, BookOpen } from "lucide-react"
import Image from "next/image"
import { useSuiContract, type StudentVoterNFT } from "../hooks/use-sui-contract"
import { useContractStore } from "../store/contract-store"
import { useToast } from "@/hooks/use-toast"

interface ContractStudentDashboardProps {
  studentNFT: StudentVoterNFT | null
  currentEpoch: number
}

export function ContractStudentDashboard({ studentNFT, currentEpoch }: ContractStudentDashboardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const { updateVotingPower, graduateStudent } = useSuiContract()
  const { updateNFTVotingPower, graduateNFT } = useContractStore()
  const { toast } = useToast()

  if (!studentNFT) {
    return (
      <Card>
        <CardContent className="text-center p-8">
          <p className="text-gray-600">No student NFT found. Please contact admin to create your voter ID.</p>
        </CardContent>
      </Card>
    )
  }

  const yearLabels = ["Freshman", "Sophomore", "Junior", "Senior"]
  const currentYear = yearLabels[studentNFT.voting_power - 1] || "Graduate"

  const timeUntilNextPowerUp = () => {
    const oneYear = 365 * 24 * 60 * 60 // seconds in a year
    const timeSinceUpdate = currentEpoch - studentNFT.last_updated
    const timeLeft = oneYear - timeSinceUpdate

    if (timeLeft <= 0 || studentNFT.voting_power >= 4) return null

    const daysLeft = Math.floor(timeLeft / (24 * 60 * 60))
    return daysLeft
  }

  const daysLeft = timeUntilNextPowerUp()
  const yearsEnrolled = Math.floor((currentEpoch - studentNFT.last_updated) / (365 * 24 * 60 * 60)) + 1

  const handleUpdatePower = async () => {
    if (!studentNFT) return

    setIsUpdating(true)
    try {
      await updateVotingPower(studentNFT.id, currentEpoch)
      updateNFTVotingPower(Math.min(studentNFT.voting_power + 1, 4))

      toast({
        title: "Voting Power Updated!",
        description: `Your voting power has been increased to ${Math.min(studentNFT.voting_power + 1, 4)}.`,
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating your voting power.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleGraduation = async () => {
    if (!studentNFT) return

    setIsUpdating(true)
    try {
      await graduateStudent(studentNFT.id)
      graduateNFT()

      toast({
        title: "Congratulations!",
        description: "You have been marked as graduated. Your voting privileges have been deactivated.",
      })
    } catch (error) {
      toast({
        title: "Graduation Failed",
        description: "There was an error processing your graduation.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main NFT Card */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={studentNFT.image_url || "/placeholder.svg"} />
                <AvatarFallback>
                  <GraduationCap className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{studentNFT.name}</CardTitle>
                <CardDescription className="text-lg">Student ID: {studentNFT.student_id}</CardDescription>
                <Badge variant={studentNFT.is_graduated ? "secondary" : "default"} className="mt-2">
                  {currentYear}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* NFT Image */}
            <div className="relative h-64 w-full rounded-xl overflow-hidden">
              <Image
                src={studentNFT.image_url || "/placeholder.svg?height=256&width=400"}
                alt="Student NFT"
                fill
                className="object-cover"
              />
              {studentNFT.is_graduated && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Badge variant="secondary" className="text-xl px-4 py-2">
                    GRADUATED
                  </Badge>
                </div>
              )}
              <div className="absolute top-4 right-4">
                <Badge className="bg-black/50 text-white">NFT #{studentNFT.id.slice(-6)}</Badge>
              </div>
            </div>

            {/* Voting Power */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Voting Power</span>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}>
                      <Star
                        className={`h-6 w-6 ${
                          i < studentNFT.voting_power ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </motion.div>
                  ))}
                  <span className="ml-2 text-lg font-bold">{studentNFT.voting_power}/4</span>
                </div>
              </div>
              <Progress value={(studentNFT.voting_power / 4) * 100} className="h-3" />
            </div>

            {/* Status Indicators */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="font-medium">Voting Status</span>
                <div className="flex items-center gap-2">
                  {studentNFT.has_voted ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-green-600 font-medium">Voted</span>
                    </>
                  ) : (
                    <Badge variant="outline">Eligible to Vote</Badge>
                  )}
                </div>
              </div>

              {daysLeft !== null && (
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium">Next Power Up</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span className="text-blue-600 font-medium">{daysLeft} days</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {daysLeft === 0 && studentNFT.voting_power < 4 && (
                <Button onClick={handleUpdatePower} disabled={isUpdating} className="flex-1">
                  {isUpdating ? "Updating..." : "Update Voting Power"}
                </Button>
              )}
              {!studentNFT.is_graduated && studentNFT.voting_power === 4 && (
                <Button onClick={handleGraduation} variant="outline" disabled={isUpdating} className="flex-1">
                  {isUpdating ? "Processing..." : "Graduate"}
                </Button>
              )}
            </div>

            {/* Contract Info */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Smart Contract Details</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <strong>NFT ID:</strong> {studentNFT.id}
                </p>
                <p>
                  <strong>Last Updated:</strong> Epoch {studentNFT.last_updated}
                </p>
                <p>
                  <strong>Description:</strong> {studentNFT.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Sidebar */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
        {/* Academic Stats */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Academic Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Current Year</span>
              <span className="font-bold text-lg">{currentYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Years Enrolled</span>
              <span className="font-bold">{yearsEnrolled}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Graduation Status</span>
              <Badge variant={studentNFT.is_graduated ? "default" : "secondary"}>
                {studentNFT.is_graduated ? "Graduated" : "Active"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Blockchain Info */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Blockchain Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
              <div className="p-1 bg-blue-200 rounded">
                <Star className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm">Sui Blockchain NFT</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
              <div className="p-1 bg-green-200 rounded">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm">Weighted Voting Power</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
              <div className="p-1 bg-purple-200 rounded">
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-sm">Epoch-based Updates</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <GraduationCap className="h-4 w-4 mr-2" />
              View NFT Details
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <CheckCircle className="h-4 w-4 mr-2" />
              Voting History
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Award className="h-4 w-4 mr-2" />
              Export Certificate
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
