"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, BarChart3, Users, Settings, Database, Activity, LogOut } from "lucide-react"
import { AdminConsole } from "../components/admin-console"
import { ElectionAnalytics } from "../components/election-analytics"
import { NetworkStatus } from "../components/network-status"
import { useVotingStore } from "../store/voting-store"
import { useSuiConnection } from "../hooks/use-sui-connection"
import { useRouter } from "next/navigation"

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState("overview")
  const { candidates, electionStats, disconnectWallet, isConnected, connectWallet } = useVotingStore()
  const { currentEpoch, networkHealth } = useSuiConnection()
  const router = useRouter()

  // Auto-connect for demo purposes
  useEffect(() => {
    if (!isConnected) {
      const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`
      connectWallet(mockAddress)
    }
  }, [isConnected, connectWallet])

  const handleLogout = () => {
    disconnectWallet()
    router.push("/")
  }

  const navigationItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "students", label: "Students", icon: Users },
    { id: "election", label: "Election", icon: Settings },
    { id: "system", label: "System", icon: Database },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-100">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="p-6 border-b border-white/20 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="p-2 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  Admin Portal
                </h1>
                <p className="text-sm text-gray-600">System Administration & Management</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-2 px-3 py-1 bg-red-100 rounded-full">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-red-700">Admin Access</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </motion.div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-6">
          {/* Network Status */}
          <NetworkStatus currentEpoch={currentEpoch} networkHealth={networkHealth} />

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {[
              {
                title: "Total Students",
                value: electionStats.totalStudents,
                icon: Users,
                color: "bg-blue-500",
                change: "+12",
              },
              {
                title: "Active Votes",
                value: electionStats.totalVotes,
                icon: Activity,
                color: "bg-green-500",
                change: "+8",
              },
              {
                title: "Candidates",
                value: candidates.length,
                icon: Users,
                color: "bg-purple-500",
                change: "+2",
              },
              {
                title: "System Health",
                value: "100%",
                icon: Shield,
                color: "bg-orange-500",
                change: "Optimal",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                className="relative overflow-hidden"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-green-600 font-medium">+{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Navigation */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                {navigationItems.map((item) => (
                  <TabsTrigger
                    key={item.id}
                    value={item.id}
                    className="data-[state=active]:bg-red-500 data-[state=active]:text-white flex items-center gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="overview" className="mt-0">
                    <ElectionAnalytics candidates={candidates} electionStats={electionStats} />
                  </TabsContent>

                  <TabsContent value="students" className="mt-0">
                    <AdminConsole />
                  </TabsContent>

                  <TabsContent value="election" className="mt-0">
                    <AdminConsole />
                  </TabsContent>

                  <TabsContent value="system" className="mt-0">
                    <AdminConsole />
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
