"use client"

import { useState, useEffect } from "react"

interface NetworkHealth {
  status: "healthy" | "degraded" | "down"
  latency: number
  blockHeight: number
  validators: number
}

export function useSuiConnection() {
  const [currentEpoch, setCurrentEpoch] = useState<number>(0)
  const [networkHealth, setNetworkHealth] = useState<NetworkHealth>({
    status: "healthy",
    latency: 45,
    blockHeight: 1234567,
    validators: 100,
  })

  useEffect(() => {
    // Simulate real-time epoch updates
    const updateEpoch = () => {
      setCurrentEpoch((prev) => prev + 1)
    }

    // Simulate network health monitoring
    const updateNetworkHealth = () => {
      setNetworkHealth((prev) => ({
        ...prev,
        latency: Math.floor(Math.random() * 100) + 20,
        blockHeight: prev.blockHeight + Math.floor(Math.random() * 5) + 1,
        validators: 100 + Math.floor(Math.random() * 10) - 5,
      }))
    }

    const epochInterval = setInterval(updateEpoch, 5000)
    const healthInterval = setInterval(updateNetworkHealth, 10000)

    // Initial epoch fetch
    setCurrentEpoch(Math.floor(Date.now() / 1000))

    return () => {
      clearInterval(epochInterval)
      clearInterval(healthInterval)
    }
  }, [])

  return { currentEpoch, networkHealth }
}
