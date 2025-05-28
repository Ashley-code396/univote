import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

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
  academic_year: string
  gpa: number
  enrollment_date: number
}

interface Candidate {
  id: string
  student_id: number
  name: string
  campaign_promises: string[]
  vote_count: number
  weighted_votes: number
  profile_image: string
  social_links: {
    twitter?: string
    instagram?: string
    linkedin?: string
  }
  campaign_video?: string
  endorsements: string[]
}

interface Vote {
  id: string
  voter_id: number
  candidate_id: string
  voting_power: number
  timestamp: number
  transaction_hash: string
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

interface VotingState {
  // Connection state
  isConnected: boolean
  walletAddress: string | null
  isAdmin: boolean

  // User data
  studentNFT: StudentVoterNFT | null

  // Election data
  candidates: Candidate[]
  votes: Vote[]
  electionStats: ElectionStats

  // UI state
  isLoading: boolean
  error: string | null

  // Actions
  connectWallet: (address: string) => void
  disconnectWallet: () => void
  setStudentNFT: (nft: StudentVoterNFT) => void
  addCandidate: (candidate: Candidate) => void
  castVote: (candidateId: string, votingPower: number) => void
  updateVotingPower: (newPower: number) => void
  graduateStudent: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useVotingStore = create<VotingState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isConnected: false,
        walletAddress: null,
        isAdmin: false,
        studentNFT: null,
        candidates: [
          {
            id: "0x456",
            student_id: 67890,
            name: "Alice Johnson",
            campaign_promises: [
              "Implement 24/7 library access with enhanced study spaces",
              "Establish mental health support programs",
              "Create sustainable campus initiatives",
              "Improve campus food quality and diversity",
            ],
            vote_count: 15,
            weighted_votes: 42,
            profile_image: "/placeholder.svg?height=200&width=200",
            social_links: {
              twitter: "@alice_johnson",
              instagram: "@alice.campaigns",
              linkedin: "alice-johnson-student",
            },
            endorsements: ["Student Environmental Club", "Academic Excellence Society"],
          },
          {
            id: "0x789",
            student_id: 54321,
            name: "Bob Smith",
            campaign_promises: [
              "Reduce student fees and increase financial aid",
              "Modernize campus technology infrastructure",
              "Expand career services and internship programs",
              "Enhance campus safety and security measures",
            ],
            vote_count: 22,
            weighted_votes: 58,
            profile_image: "/placeholder.svg?height=200&width=200",
            social_links: {
              twitter: "@bob_smith_2024",
              linkedin: "bob-smith-candidate",
            },
            endorsements: ["Tech Innovation Club", "Student Finance Committee"],
          },
        ],
        votes: [],
        electionStats: {
          totalStudents: 1247,
          totalVotes: 892,
          participationRate: 71.5,
          averageVotingPower: 2.3,
          electionStartDate: Date.now() - 7 * 24 * 60 * 60 * 1000,
          electionEndDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
          isActive: true,
        },
        isLoading: false,
        error: null,

        // Actions
        connectWallet: (address: string) => {
          set({
            isConnected: true,
            walletAddress: address,
            studentNFT: {
              id: "0x123",
              name: "University Voter ID",
              description: "Senior year student with maximum voting power",
              image_url: "https://i.ibb.co/fzq9JmxX/element5-digital-T9-CXBZLUvic-unsplash.jpg",
              student_id: 12345,
              voting_power: 4,
              is_graduated: false,
              last_updated: Date.now() - 365 * 24 * 60 * 60 * 1000,
              has_voted: false,
              academic_year: "Senior",
              gpa: 3.8,
              enrollment_date: Date.now() - 4 * 365 * 24 * 60 * 60 * 1000,
            },
          })
        },

        disconnectWallet: () => {
          set({
            isConnected: false,
            walletAddress: null,
            studentNFT: null,
            isAdmin: false,
          })
        },

        setStudentNFT: (nft: StudentVoterNFT) => {
          set({ studentNFT: nft })
        },

        addCandidate: (candidate: Candidate) => {
          set((state) => ({
            candidates: [...state.candidates, candidate],
          }))
        },

        castVote: (candidateId: string, votingPower: number) => {
          const state = get()
          if (!state.studentNFT || state.studentNFT.has_voted) return

          const vote: Vote = {
            id: `vote_${Date.now()}`,
            voter_id: state.studentNFT.student_id,
            candidate_id: candidateId,
            voting_power: votingPower,
            timestamp: Date.now(),
            transaction_hash: `0x${Math.random().toString(16).substr(2, 64)}`,
          }

          set((state) => ({
            votes: [...state.votes, vote],
            studentNFT: state.studentNFT ? { ...state.studentNFT, has_voted: true } : null,
            candidates: state.candidates.map((candidate) =>
              candidate.id === candidateId
                ? {
                    ...candidate,
                    vote_count: candidate.vote_count + 1,
                    weighted_votes: candidate.weighted_votes + votingPower,
                  }
                : candidate,
            ),
            electionStats: {
              ...state.electionStats,
              totalVotes: state.electionStats.totalVotes + 1,
              participationRate: ((state.electionStats.totalVotes + 1) / state.electionStats.totalStudents) * 100,
            },
          }))
        },

        updateVotingPower: (newPower: number) => {
          set((state) => ({
            studentNFT: state.studentNFT
              ? {
                  ...state.studentNFT,
                  voting_power: newPower,
                  last_updated: Date.now(),
                  academic_year: ["Freshman", "Sophomore", "Junior", "Senior"][newPower - 1] || "Graduate",
                }
              : null,
          }))
        },

        graduateStudent: () => {
          set((state) => ({
            studentNFT: state.studentNFT
              ? {
                  ...state.studentNFT,
                  is_graduated: true,
                  voting_power: 0,
                  academic_year: "Graduate",
                }
              : null,
          }))
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading })
        },

        setError: (error: string | null) => {
          set({ error })
        },
      }),
      {
        name: "voting-storage",
        partialize: (state) => ({
          walletAddress: state.walletAddress,
          studentNFT: state.studentNFT,
          votes: state.votes,
        }),
      },
    ),
    { name: "voting-store" },
  ),
)
