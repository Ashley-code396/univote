"use client"

import { useState, useEffect } from "react"
import { Transaction } from "@mysten/sui/transactions"
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client"

// Smart Contract Types (matching your Move structs)
export interface StudentVoterNFT {
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

export interface Candidate {
  id: string
  student_id: number
  name: string
  campaign_promises: string[]
  vote_count: number
}

export interface Vote {
  id: string
  voter_id: number
  candidate_id: number
  voting_power: number
}

export interface ElectionResult {
  id: string
  candidate_id: number
  total_votes: number
}

// Contract Events
export interface StudentVoterNFTCreated {
  student_id: number
  voting_power: number
}

export interface VotingPowerUpdated {
  student_id: number
  new_voting_power: number
}

export interface StudentGraduated {
  student_id: number
}

export interface CandidateRegistered {
  student_id: number
  name: string
}

export interface VoteCast {
  voter_id: number
  candidate_id: number
  voting_power: number
}

export interface ElectionResultsTallied {
  candidate_id: number
  total_votes: number
}

export function useSuiContract() {
  const [client, setClient] = useState<SuiClient | null>(null)
  const [currentEpoch, setCurrentEpoch] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Your contract package ID (replace with actual deployed package ID)
  const PACKAGE_ID = "0x..." // Replace with your deployed package ID
  const MODULE_NAME = "university"

  useEffect(() => {
    const suiClient = new SuiClient({ url: getFullnodeUrl("testnet") })
    setClient(suiClient)

    // Get current epoch
    const fetchEpoch = async () => {
      try {
        const epoch = await suiClient.getLatestSuiSystemState()
        setCurrentEpoch(Number(epoch.epoch))
      } catch (err) {
        console.error("Failed to fetch epoch:", err)
      }
    }

    fetchEpoch()
    const interval = setInterval(fetchEpoch, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  // ADMIN FUNCTIONS

  const createStudentVotingNFT = async (adminCapId: string, studentId: number, signerAddress: string) => {
    if (!client) throw new Error("Client not initialized")

    setIsLoading(true)
    setError(null)

    try {
      const tx = new Transaction()

      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::create_student_voting_nft`,
        arguments: [tx.object(adminCapId), tx.pure.u64(studentId)],
      })

      // In a real app, you would sign and execute this transaction
      console.log("Transaction prepared:", tx)

      // Mock response for demo
      return {
        success: true,
        digest: "mock_digest",
        nft: {
          id: `0x${Math.random().toString(16).substr(2, 8)}`,
          name: "University Voter ID",
          description: "This is a unique voter ID for university elections",
          image_url: "https://i.ibb.co/fzq9JmxX/element5-digital-T9-CXBZLUvic-unsplash.jpg",
          student_id: studentId,
          voting_power: 1,
          is_graduated: false,
          last_updated: currentEpoch,
          has_voted: false,
        } as StudentVoterNFT,
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const tallyVotes = async (adminCapId: string, votes: Vote[], candidates: Candidate[]) => {
    if (!client) throw new Error("Client not initialized")

    setIsLoading(true)
    setError(null)

    try {
      const tx = new Transaction()

      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::tally_votes`,
        arguments: [
          tx.object(adminCapId),
          tx.pure.vector("string", votes.map((v) => v.id)),
          tx.pure.vector("string", candidates.map((c) => c.id))
        ],
      })

      console.log("Tally votes transaction prepared:", tx)

      // Mock response
      return {
        success: true,
        digest: "mock_digest",
        results: candidates.map(
          (c) => ({
            id: `0x${Math.random().toString(16).substr(2, 8)}`,
            candidate_id: c.student_id,
            total_votes: c.vote_count,
          }) as ElectionResult,
        ),
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // STUDENT FUNCTIONS

  const updateVotingPower = async (nftId: string, currentTime: number) => {
    if (!client) throw new Error("Client not initialized")

    setIsLoading(true)
    setError(null)

    try {
      const tx = new Transaction()

      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::update_voting_power`,
        arguments: [tx.object(nftId), tx.pure.u64(currentTime)],
      })

      console.log("Update voting power transaction prepared:", tx)

      return {
        success: true,
        digest: "mock_digest",
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const graduateStudent = async (nftId: string) => {
    if (!client) throw new Error("Client not initialized")

    setIsLoading(true)
    setError(null)

    try {
      const tx = new Transaction()

      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::graduate_student`,
        arguments: [tx.object(nftId)],
      })

      console.log("Graduate student transaction prepared:", tx)

      return {
        success: true,
        digest: "mock_digest",
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const registerCandidate = async (nftId: string, name: string, campaignPromises: string[]) => {
    if (!client) throw new Error("Client not initialized")

    setIsLoading(true)
    setError(null)

    try {
      const tx = new Transaction()

      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::register_candidate`,
        arguments: [
          tx.object(nftId),
          tx.pure.string(name),
          tx.pure.vector("string", campaignPromises)
        ],
      })

      console.log("Register candidate transaction prepared:", tx)

      return {
        success: true,
        digest: "mock_digest",
        candidate: {
          id: `0x${Math.random().toString(16).substr(2, 8)}`,
          student_id: Math.floor(Math.random() * 100000),
          name,
          campaign_promises: campaignPromises,
          vote_count: 0,
        } as Candidate,
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const castVote = async (voterNftId: string, candidateId: string) => {
    if (!client) throw new Error("Client not initialized")

    setIsLoading(true)
    setError(null)

    try {
      const tx = new Transaction()

      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::cast_vote`,
        arguments: [tx.object(voterNftId), tx.object(candidateId)],
      })

      console.log("Cast vote transaction prepared:", tx)

      return {
        success: true,
        digest: "mock_digest",
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // QUERY FUNCTIONS

  const getStudentNFT = async (ownerAddress: string): Promise<StudentVoterNFT | null> => {
    if (!client) return null

    try {
      // Query for StudentVoterNFT objects owned by the address
      const objects = await client.getOwnedObjects({
        owner: ownerAddress,
        filter: {
          StructType: `${PACKAGE_ID}::${MODULE_NAME}::StudentVoterNFT`,
        },
        options: {
          showContent: true,
          showType: true,
        },
      })

      if (objects.data.length === 0) return null

      // Parse the first NFT found
      const nftData = objects.data[0]
      if (nftData.data?.content && "fields" in nftData.data.content) {
        const fields = nftData.data.content.fields as any
        return {
          id: fields.id.id,
          name: fields.name,
          description: fields.description,
          image_url: fields.image_url,
          student_id: Number(fields.student_id),
          voting_power: Number(fields.voting_power),
          is_graduated: fields.is_graduated,
          last_updated: Number(fields.last_updated),
          has_voted: fields.has_voted,
        }
      }

      return null
    } catch (err) {
      console.error("Failed to fetch student NFT:", err)
      return null
    }
  }

  const getCandidates = async (): Promise<Candidate[]> => {
    if (!client) return []

    try {
      // In a real implementation, you would query all Candidate objects
      // For now, return mock data that matches the contract structure
      return [
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
        },
      ]
    } catch (err) {
      console.error("Failed to fetch candidates:", err)
      return []
    }
  }

  const getElectionResults = async (): Promise<ElectionResult[]> => {
    if (!client) return []

    try {
      // Query for ElectionResult objects
      // For now, return mock data
      return [
        {
          id: "0xresult1",
          candidate_id: 67890,
          total_votes: 45,
        },
        {
          id: "0xresult2",
          candidate_id: 54321,
          total_votes: 58,
        },
      ]
    } catch (err) {
      console.error("Failed to fetch election results:", err)
      return []
    }
  }

  return {
    client,
    currentEpoch,
    isLoading,
    error,
    // Admin functions
    createStudentVotingNFT,
    tallyVotes,
    // Student functions
    updateVotingPower,
    graduateStudent,
    registerCandidate,
    castVote,
    // Query functions
    getStudentNFT,
    getCandidates,
    getElectionResults,
  }
}