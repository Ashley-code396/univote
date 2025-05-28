"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Shield, Zap, Users, X, Sparkles } from "lucide-react"
import { useVotingStore } from "../store/voting-store"
import { useRouter } from "next/navigation"

const walletOptions = [
  {
    name: "Suiet Wallet",
    icon: "🦊",
    description: "The most popular Sui wallet",
    features: ["Secure", "Fast", "User-friendly"],
    gradient: "from-orange-500 to-red-500",
  },
  {
    name: "Ethos Wallet",
    icon: "⚡",
    description: "Built for Sui ecosystem",
    features: ["Native Sui", "DeFi Ready", "Mobile Support"],
    gradient: "from-blue-500 to-purple-500",
  },
  {
    name: "Sui Wallet",
    icon: "🌊",
    description: "Official Sui wallet",
    features: ["Official", "Secure", "Full Features"],
    gradient: "from-cyan-500 to-blue-500",
  },
]

interface WalletConnectionProps {
  onClose?: () => void
}

export function WalletConnection({ onClose }: WalletConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const { connectWallet } = useVotingStore()
  const router = useRouter()

  const handleConnect = async (walletName: string) => {
    setIsConnecting(true)
    setSelectedWallet(walletName)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`
      connectWallet(mockAddress)

      const isAdmin = Math.random() > 0.8

      onClose?.()

      if (isAdmin) {
        router.push("/admin")
      } else {
        router.push("/student")
      }
    } catch (error) {
      console.error("Connection failed:", error)
    } finally {
      setIsConnecting(false)
      setSelectedWallet(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="border-0 shadow-2xl bg-gray-900/95 backdrop-blur-xl relative overflow-hidden border border-gray-800">
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(6, 182, 212, 0.1))",
              "linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1))",
              "linear-gradient(45deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))",
            ],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />

        {onClose && (
          <motion.div
            className="absolute top-4 right-4 z-20"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        <CardHeader className="text-center pb-8 relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-4 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-fit relative"
          >
            <Wallet className="h-8 w-8 text-white" />
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: ["0 0 0 0 rgba(59, 130, 246, 0.7)", "0 0 0 20px rgba(59, 130, 246, 0)"],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Connect Your Wallet
            </CardTitle>
            <motion.p
              className="text-gray-400 text-lg"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              Choose your preferred Sui wallet to access the voting system
            </motion.p>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-6 relative z-10">
          <div className="grid md:grid-cols-3 gap-4">
            {walletOptions.map((wallet, index) => (
              <motion.div
                key={wallet.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  className={`cursor-pointer transition-all border-2 bg-gray-800/50 backdrop-blur-sm relative overflow-hidden group ${
                    selectedWallet === wallet.name
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                  onClick={() => handleConnect(wallet.name)}
                >
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${wallet.gradient} opacity-0 group-hover:opacity-10`}
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  <CardContent className="p-6 text-center relative z-10">
                    <motion.div
                      className="text-4xl mb-3"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                    >
                      {wallet.icon}
                    </motion.div>

                    <motion.h3
                      className="font-semibold text-lg mb-2 text-white group-hover:text-blue-400 transition-colors"
                      whileHover={{ scale: 1.05 }}
                    >
                      {wallet.name}
                    </motion.h3>

                    <p className="text-gray-400 text-sm mb-4 group-hover:text-gray-300 transition-colors">
                      {wallet.description}
                    </p>

                    <div className="space-y-1 mb-4">
                      {wallet.features.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-center justify-center gap-1 text-xs text-gray-500 group-hover:text-gray-400 transition-colors"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + idx * 0.1 }}
                        >
                          <motion.div
                            className="w-1 h-1 bg-green-500 rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: idx * 0.3 }}
                          />
                          {feature}
                        </motion.div>
                      ))}
                    </div>

                    <Button
                      className={`w-full relative overflow-hidden group/btn ${
                        selectedWallet === wallet.name
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                      disabled={isConnecting}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover/btn:opacity-20"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                      <span className="relative z-10 flex items-center justify-center">
                        {isConnecting && selectedWallet === wallet.name ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              className="mr-2"
                            >
                              <Sparkles className="h-4 w-4" />
                            </motion.div>
                            Connecting...
                          </>
                        ) : (
                          "Connect"
                        )}
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="grid md:grid-cols-3 gap-6 pt-6 border-t border-gray-800"
          >
            {[
              { icon: Shield, title: "Secure", desc: "Your keys, your crypto", color: "text-blue-500" },
              { icon: Zap, title: "Fast", desc: "Lightning-fast transactions", color: "text-yellow-500" },
              { icon: Users, title: "Trusted", desc: "Used by thousands", color: "text-green-500" },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.3 }}
                >
                  <item.icon className={`h-8 w-8 mx-auto mb-2 ${item.color}`} />
                </motion.div>
                <h4 className="font-semibold text-white">{item.title}</h4>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
