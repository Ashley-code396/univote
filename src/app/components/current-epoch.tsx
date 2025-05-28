"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Activity, Zap, Shield } from "lucide-react"
import { useSuiContract } from "../hooks/use-sui-contract"

export function CurrentEpoch() {
  const { currentEpoch, client, isLoading } = useSuiContract()

  const getNetworkStatus = () => {
    if (!client) return { status: "disconnected", color: "bg-red-500" }
    if (isLoading) return { status: "syncing", color: "bg-yellow-500" }
    return { status: "connected", color: "bg-green-500" }
  }

  const networkStatus = getNetworkStatus()

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Current Epoch */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Epoch</p>
                <motion.p
                  className="text-xl font-bold font-mono"
                  key={currentEpoch}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentEpoch.toLocaleString()}
                </motion.p>
              </div>
            </div>

            {/* Network Status */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Network Status</p>
                <div className="flex items-center gap-2">
                  <motion.div
                    className={`h-2 w-2 rounded-full ${networkStatus.color}`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <Badge variant="outline" className="capitalize">
                    {networkStatus.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contract Status */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Smart Contract</p>
                <p className="text-xl font-bold">Active</p>
              </div>
            </div>

            {/* Blockchain */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Shield className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Blockchain</p>
                <p className="text-xl font-bold">Sui Testnet</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
