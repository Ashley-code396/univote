"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, Home, Users, Vote, BarChart3, LogOut } from "lucide-react"
import { ContractStudentDashboard } from "../components/contract-student-dashboard"
import { CandidateHub } from "../components/candidate-hub"
import { VotingBooth } from "../components/voting-booth"
import { ElectionAnalytics } from "../components/election-analytics"
import { CurrentEpoch } from "../components/current-epoch"
import { useSuiContract } from "../hooks/use-sui-contract"
import { useContractStore } from "../store/contract-store"
import { useRouter } from "next/navigation"

// Extended interface for frontend-only properties
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

// Separate AnimatedBackground component to handle client-side window access
function AnimatedBackground() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateDimensions = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }
      updateDimensions()
      window.addEventListener("resize", updateDimensions)
      return () => window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  const blobs = Array.from({ length: 3 }).map((_, index) => ({
    key: index,
    top: index === 0 ? "-top-40" : index === 1 ? "-bottom-40" : "top-40",
    left: index === 0 ? "-right-40" : index === 1 ? "-left-40" : "left-40",
    color: index === 0 ? "bg-blue-400" : index === 1 ? "bg-purple-400" : "bg-pink-400",
    delay: index === 0 ? "" : index === 1 ? "animation-delay-2000" : "animation-delay-4000",
    initialX: dimensions.width ? Math.random() * dimensions.width : 0,
    initialY: dimensions.height ? Math.random() * dimensions.height : 0,
  }))

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {blobs.map((blob) => (
        <motion.div
          key={blob.key}
          className={`absolute w-80 h-80 ${blob.color} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob ${blob.delay}`}
          initial={{
            x: blob.initialX,
            y: blob.initialY,
            opacity: 0,
          }}
          animate={{
            x: blob.initialX + (Math.random() - 0.5) * 100,
            y: blob.initialY + (Math.random() - 0.5) * 100,
            opacity: 0.2,
          }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 10,
            delay: blob.key * 2,
          }}
        />
      ))}
    </div>
  )
}

export default function StudentPortal() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { currentEpoch, getStudentNFT, getCandidates } = useSuiContract()
  const {
    studentNFT,
    candidates,
    disconnectWallet,
    isConnected,
    connectWallet,
    walletAddress,
    setStudentNFT,
    setCandidates,
  } = useContractStore()
  const router = useRouter()

  // Auto-connect for demo and fetch data
  useEffect(() => {
    if (!isConnected) {
      const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`
      connectWallet(mockAddress)
    }
  }, [isConnected, connectWallet])

  // Calculate academic year based on voting power (frontend-only)
  const getAcademicYear = (votingPower: number) => {
    if (votingPower >= 3) return "Senior"
    if (votingPower >= 2) return "Junior"
    return "Sophomore"
  }

  // Fetch student NFT when wallet is connected
  useEffect(() => {
    const fetchStudentData = async () => {
      if (walletAddress && !studentNFT) {
        try {
          const nft = await getStudentNFT(walletAddress)
          if (nft) {
            // Add frontend-only properties while preserving contract structure
            const extendedNFT: ExtendedStudentVoterNFT = {
              ...nft,
              academic_year: getAcademicYear(nft.voting_power),
              gpa: 3.0 + (nft.voting_power * 0.25), // Example calculation
              enrollment_date: new Date(Date.now() - nft.voting_power * 365 * 24 * 60 * 60 * 1000).toISOString(),
            }
            setStudentNFT(extendedNFT)
          }
        } catch (error) {
          console.error("Failed to fetch student NFT:", error)
        }
      }
    }

    fetchStudentData()
  }, [walletAddress, studentNFT, getStudentNFT, setStudentNFT, currentEpoch])

  // Fetch candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      if (candidates.length === 0) {
        try {
          const fetchedCandidates = await getCandidates()
          // Add frontend-only properties to candidates
          const extendedCandidates: ExtendedCandidate[] = fetchedCandidates.map((candidate) => ({
            ...candidate,
            weighted_votes: candidate.vote_count * 1.5, // Example calculation
            profile_image: "/placeholder.svg",
            social_links: {},
            endorsements: [],
          }))
          setCandidates(extendedCandidates)
        } catch (error) {
          console.error("Failed to fetch candidates:", error)
        }
      }
    }

    fetchCandidates()
  }, [candidates.length, getCandidates, setCandidates])

  const handleLogout = () => {
    disconnectWallet()
    router.push("/")
  }

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "candidates", label: "Candidates", icon: Users },
    { id: "vote", label: "Vote", icon: Vote },
    { id: "analytics", label: "Results", icon: BarChart3 },
  ]

  // Mock election stats for analytics
  const electionStats = {
    totalStudents: 1247,
    totalVotes: 892,
    participationRate: 71.5,
    averageVotingPower: 2.3,
    electionStartDate: Date.now() - 7 * 24 * 60 * 60 * 1000,
    electionEndDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
    isActive: true,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background */}
      <AnimatedBackground />

      <div className="relative z-10">
        {/* Header */}
        <header className="p-6 border-b border-white/20 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Student Portal
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {studentNFT?.name || "Student"} •{" "}
                  {(studentNFT as ExtendedStudentVoterNFT)?.academic_year ||
                    getAcademicYear(studentNFT?.voting_power || 1)}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="text-right">
                <p className="text-sm text-gray-600">Student ID</p>
                <p className="font-mono font-bold">{studentNFT?.student_id}</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </motion.div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-6">
          {/* Current Epoch Display */}
          <CurrentEpoch />

          {/* Navigation */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                {navigationItems.map((item) => (
                  <TabsTrigger
                    key={item.id}
                    value={item.id}
                    className="data-[state=active]:bg-blue-500 data-[state=active]:text-white flex items-center gap-2"
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
                  <TabsContent value="dashboard" className="mt-0">
                    <ContractStudentDashboard studentNFT={studentNFT} currentEpoch={currentEpoch} />
                  </TabsContent>

                  <TabsContent value="candidates" className="mt-0">
                    <CandidateHub studentNFT={studentNFT} candidates={candidates} />
                  </TabsContent>

                  <TabsContent value="vote" className="mt-0">
                    <VotingBooth studentNFT={studentNFT} candidates={candidates} />
                  </TabsContent>

                  <TabsContent value="analytics" className="mt-0">
                    <ElectionAnalytics candidates={candidates} electionStats={electionStats} />
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