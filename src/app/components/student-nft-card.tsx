"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { GraduationCap, Star, Clock, CheckCircle } from "lucide-react"
import Image from "next/image"

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

interface StudentNFTCardProps {
  nft: StudentVoterNFT
  currentEpoch: number
}

export function StudentNFTCard({ nft, currentEpoch }: StudentNFTCardProps) {
  const yearLabels = ["Freshman", "Sophomore", "Junior", "Senior"]
  const currentYear = yearLabels[nft.voting_power - 1] || "Graduate"

  const timeUntilNextPowerUp = () => {
    const oneYear = 365 * 24 * 60 * 60 * 1000
    const timeSinceUpdate = currentEpoch - nft.last_updated
    const timeLeft = oneYear - timeSinceUpdate

    if (timeLeft <= 0 || nft.voting_power >= 4) return null

    const daysLeft = Math.floor(timeLeft / (24 * 60 * 60 * 1000))
    return daysLeft
  }

  const daysLeft = timeUntilNextPowerUp()

  const updateVotingPower = () => {
    // This would call the smart contract function
    console.log("Updating voting power...")
  }

  const graduateStudent = () => {
    // This would call the smart contract function
    console.log("Graduating student...")
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          {nft.name}
        </CardTitle>
        <CardDescription>Student ID: {nft.student_id}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative h-48 w-full rounded-lg overflow-hidden">
          <Image src={nft.image_url || "/placeholder.svg"} alt="Student NFT" fill className="object-cover" />
          {nft.is_graduated && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="secondary" className="text-lg">
                GRADUATED
              </Badge>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Academic Year</span>
            <Badge variant="outline">{currentYear}</Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Voting Power</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < nft.voting_power ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
            <Progress value={(nft.voting_power / 4) * 100} className="h-2" />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Voting Status</span>
            <div className="flex items-center gap-1">
              {nft.has_voted ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Voted</span>
                </>
              ) : (
                <Badge variant="outline">Eligible to Vote</Badge>
              )}
            </div>
          </div>

          {daysLeft !== null && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Next Power Up</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-blue-600">{daysLeft} days</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {daysLeft === 0 && nft.voting_power < 4 && (
            <Button onClick={updateVotingPower} size="sm" className="flex-1">
              Update Power
            </Button>
          )}
          {!nft.is_graduated && nft.voting_power === 4 && (
            <Button onClick={graduateStudent} variant="outline" size="sm" className="flex-1">
              Graduate
            </Button>
          )}
        </div>

        <p className="text-sm text-gray-600">{nft.description}</p>
      </CardContent>
    </Card>
  )
}
