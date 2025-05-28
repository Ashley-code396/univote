"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Users, Trophy, Calendar, Target } from "lucide-react"

// Extended candidate interface
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

interface ElectionStats {
  totalStudents: number
  totalVotes: number
  participationRate: number
  averageVotingPower: number
  electionStartDate: number
  electionEndDate: number
  isActive: boolean
}

interface ElectionAnalyticsProps {
  candidates: ExtendedCandidate[]
  electionStats: ElectionStats
}

export function ElectionAnalytics({ candidates, electionStats }: ElectionAnalyticsProps) {
  const sortedCandidates = [...candidates].sort((a, b) =>
    (b.weighted_votes || 0) - (a.weighted_votes || 0)
  )
  const winner = sortedCandidates[0]
  const totalWeightedVotes = candidates.reduce((sum, candidate) => sum + (candidate.weighted_votes || 0), 0)

  const getVotePercentage = (votes: number | undefined) => {
    return totalWeightedVotes > 0 && votes !== undefined ? (votes / totalWeightedVotes) * 100 : 0
  }

  const daysRemaining = Math.ceil((electionStats.electionEndDate - Date.now()) / (24 * 60 * 60 * 1000))

  const analyticsCards = [
    {
      title: "Total Participation",
      value: `${electionStats.participationRate.toFixed(1)}%`,
      description: `${electionStats.totalVotes} of ${electionStats.totalStudents} students`,
      icon: Users,
      color: "bg-blue-500",
      trend: "+5.2%",
    },
    {
      title: "Weighted Votes",
      value: totalWeightedVotes.toLocaleString(),
      description: `Avg power: ${electionStats.averageVotingPower.toFixed(1)}`,
      icon: TrendingUp,
      color: "bg-green-500",
      trend: "+12.3%",
    },
    {
      title: "Leading Candidate",
      value: winner?.name || "TBD",
      description: `${winner?.weighted_votes?.toFixed(1) || 0} weighted votes`,
      icon: Trophy,
      color: "bg-yellow-500",
      trend: winner ? `${getVotePercentage(winner.weighted_votes).toFixed(1)}%` : "0%",
    },
    {
      title: "Time Remaining",
      value: daysRemaining > 0 ? `${daysRemaining} days` : "Ended",
      description: electionStats.isActive ? "Election active" : "Election closed",
      icon: Calendar,
      color: "bg-purple-500",
      trend: electionStats.isActive ? "Active" : "Closed",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Election Analytics
            </CardTitle>
            <CardDescription className="text-indigo-100">
              Real-time insights and statistics from the student government election
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Analytics Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full ${card.color}`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {card.trend}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold mb-1">{card.value}</p>
                  <p className="text-sm text-gray-500">{card.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detailed Results */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Detailed Results
            </CardTitle>
            <CardDescription>Vote breakdown by candidate with weighted voting power</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {sortedCandidates.map((candidate, index) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="space-y-3"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                    <div>
                      <h3 className="font-semibold">{candidate.name}</h3>
                      <p className="text-sm text-gray-600">Student ID: {candidate.student_id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Raw Votes</p>
                        <p className="font-bold">{candidate.vote_count}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Weighted Votes</p>
                        <p className="text-xl font-bold">{candidate.weighted_votes?.toFixed(1) || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Percentage</p>
                        <p className="font-bold">{getVotePercentage(candidate.weighted_votes).toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Vote Share</span>
                    <span>{getVotePercentage(candidate.weighted_votes).toFixed(1)}%</span>
                  </div>
                  <Progress value={getVotePercentage(candidate.weighted_votes)} className="h-3" />
                </div>

                {candidate.endorsements && candidate.endorsements.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Endorsements:</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.endorsements.map((endorsement, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {endorsement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {index < sortedCandidates.length - 1 && <hr className="my-4" />}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Participation Breakdown */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Participation Analysis</CardTitle>
            <CardDescription>Voting patterns and engagement metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">{electionStats.totalStudents}</p>
                <p className="text-sm text-gray-600">Eligible Voters</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{electionStats.totalVotes}</p>
                <p className="text-sm text-gray-600">Votes Cast</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">{electionStats.averageVotingPower.toFixed(1)}</p>
                <p className="text-sm text-gray-600">Avg Voting Power</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Participation</span>
                <span>{electionStats.participationRate.toFixed(1)}%</span>
              </div>
              <Progress value={electionStats.participationRate} className="h-3" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {candidates.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center p-12">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No Data Available</h3>
              <p className="text-gray-600">Election results will appear here once voting begins.</p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}