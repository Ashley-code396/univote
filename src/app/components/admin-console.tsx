"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, UserPlus, BarChart3, Users, Settings, Database, Activity, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useVotingStore } from "../store/voting-store"

export function AdminConsole() {
  const [studentId, setStudentId] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isTallying, setIsTallying] = useState(false)
  const { toast } = useToast()
  const { isAdmin, electionStats } = useVotingStore()

  const createStudentNFT = async () => {
    if (!studentId.trim()) return

    setIsCreating(true)
    try {
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

  // Mock admin check - in real app this would check wallet permissions
  const hasAdminAccess = true

  if (!hasAdminAccess) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="border-0 shadow-lg">
          <CardContent className="text-center p-12">
            <Shield className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">Admin Access Required</h3>
            <p className="text-gray-600 mb-4">You need admin privileges to access this panel.</p>
            <Badge variant="destructive">Not Authorized</Badge>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-0 shadow-lg bg-gradient-to-r from-red-500 to-pink-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Admin Console
            </CardTitle>
            <CardDescription className="text-red-100">
              Administrative functions for managing the voting system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge className="bg-white/20 text-white border-white/30">Admin Access Granted</Badge>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="election">Election</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* System Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  System Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-2xl font-bold">{electionStats.totalStudents}</p>
                    <p className="text-sm text-gray-600">Total Students</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <p className="text-2xl font-bold">{electionStats.totalVotes}</p>
                    <p className="text-sm text-gray-600">Votes Cast</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                    <p className="text-2xl font-bold">{electionStats.participationRate.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">Participation</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <p className="text-2xl font-bold">Active</p>
                    <p className="text-sm text-gray-600">System Status</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: "Student NFT created", details: "ID: 12345", time: "2 minutes ago", type: "success" },
                    { action: "Vote cast", details: "Candidate: Alice Johnson", time: "5 minutes ago", type: "info" },
                    { action: "Candidate registered", details: "Bob Smith", time: "1 hour ago", type: "info" },
                    {
                      action: "System backup",
                      details: "Completed successfully",
                      time: "2 hours ago",
                      type: "success",
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.details}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={activity.type === "success" ? "default" : "secondary"}>{activity.type}</Badge>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Create Student NFT */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="border-0 shadow-lg">
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
            </motion.div>

            {/* Student Management */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Student Management
                  </CardTitle>
                  <CardDescription>Manage existing student records</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    View All Students
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Update Voting Power
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    Export Student Data
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="election" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Election Control */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Election Control
                  </CardTitle>
                  <CardDescription>Manage election lifecycle and results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Caution</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      This action will finalize the election and calculate results for all candidates.
                    </p>
                  </div>
                  <Button onClick={tallyVotes} disabled={isTallying} className="w-full" variant="destructive">
                    {isTallying ? "Tallying..." : "Tally All Votes"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Election Settings */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Election Settings
                  </CardTitle>
                  <CardDescription>Configure election parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Election Schedule
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Candidate Requirements
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Voting Rules
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          {/* System Health */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="h-3 w-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                    <p className="font-medium">Blockchain</p>
                    <p className="text-sm text-gray-600">Healthy</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="h-3 w-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                    <p className="font-medium">Database</p>
                    <p className="text-sm text-gray-600">Operational</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="h-3 w-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                    <p className="font-medium">API</p>
                    <p className="text-sm text-gray-600">Online</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>System Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Backup System
                </Button>
                <Button variant="outline" className="justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  View Logs
                </Button>
                <Button variant="outline" className="justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </Button>
                <Button variant="outline" className="justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Audit
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
