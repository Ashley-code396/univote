import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type { StudentVoterNFT, Candidate, Vote, ElectionResult } from "../hooks/use-sui-contract"

interface ContractState {
  // Connection state
  isConnected: boolean
  walletAddress: string | null
  adminCapId: string | null

  // Contract data
  studentNFT: StudentVoterNFT | null
  candidates: Candidate[]
  votes: Vote[]
  electionResults: ElectionResult[]

  // UI state
  isLoading: boolean
  error: string | null

  // Actions
  connectWallet: (address: string, adminCapId?: string) => void
  disconnectWallet: () => void
  setStudentNFT: (nft: StudentVoterNFT | null) => void
  setCandidates: (candidates: Candidate[]) => void
  addCandidate: (candidate: Candidate) => void
  setVotes: (votes: Vote[]) => void
  addVote: (vote: Vote) => void
  setElectionResults: (results: ElectionResult[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updateNFTVotingPower: (newPower: number) => void
  markNFTAsVoted: () => void
  graduateNFT: () => void
}

export const useContractStore = create<ContractState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isConnected: false,
        walletAddress: null,
        adminCapId: null,
        studentNFT: null,
        candidates: [],
        votes: [],
        electionResults: [],
        isLoading: false,
        error: null,

        // Actions
        connectWallet: (address: string, adminCapId?: string) => {
          set({
            isConnected: true,
            walletAddress: address,
            adminCapId: adminCapId || null,
          })
        },

        disconnectWallet: () => {
          set({
            isConnected: false,
            walletAddress: null,
            adminCapId: null,
            studentNFT: null,
          })
        },

        setStudentNFT: (nft: StudentVoterNFT | null) => {
          set({ studentNFT: nft })
        },

        setCandidates: (candidates: Candidate[]) => {
          set({ candidates })
        },

        addCandidate: (candidate: Candidate) => {
          set((state) => ({
            candidates: [...state.candidates, candidate],
          }))
        },

        setVotes: (votes: Vote[]) => {
          set({ votes })
        },

        addVote: (vote: Vote) => {
          set((state) => ({
            votes: [...state.votes, vote],
          }))
        },

        setElectionResults: (results: ElectionResult[]) => {
          set({ electionResults: results })
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading })
        },

        setError: (error: string | null) => {
          set({ error })
        },

        updateNFTVotingPower: (newPower: number) => {
          const state = get()
          if (state.studentNFT) {
            set({
              studentNFT: {
                ...state.studentNFT,
                voting_power: newPower,
                last_updated: Date.now(),
                description: `Your voting power is now: ${newPower}`,
              },
            })
          }
        },

        markNFTAsVoted: () => {
          const state = get()
          if (state.studentNFT) {
            set({
              studentNFT: {
                ...state.studentNFT,
                has_voted: true,
              },
            })
          }
        },

        graduateNFT: () => {
          const state = get()
          if (state.studentNFT) {
            set({
              studentNFT: {
                ...state.studentNFT,
                is_graduated: true,
                voting_power: 0,
                name: "Graduated",
                description: "You are no longer eligible to vote.",
                image_url: "https://i.ibb.co/fzq9JmxX/element5-digital-T9-CXBZLUvic-unsplash.jpg",
              },
            })
          }
        },
      }),
      {
        name: "contract-storage",
        partialize: (state) => ({
          walletAddress: state.walletAddress,
          adminCapId: state.adminCapId,
          studentNFT: state.studentNFT,
        }),
      },
    ),
    { name: "contract-store" },
  ),
)
