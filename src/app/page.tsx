"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Shield, Users, Vote, Star, ArrowRight, Sparkles, Wallet } from "lucide-react";
import { useVotingStore } from "./store/voting-store";
import { useRouter } from "next/navigation";
import { ConnectButton } from '@mysten/dapp-kit';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';

// Animated background component
const AnimatedBackground = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState(false);

  // Store random values for dots and particles
  const [dots, setDots] = useState<
    { initial: { x: number; y: number; opacity: number }; animate: { x: number; y: number; opacity: number[] }; transition: { duration: number; repeat: number; ease: string } }[]
  >([]);
  const [particles, setParticles] = useState<
    { initial: { x: number; y: number }; animate: { x: number; y: number }; transition: { duration: number; repeat: number; ease: string; delay: number } }[]
  >([]);

  useEffect(() => {
    setIsMounted(true);
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateWindowSize(); // Set initial size
    window.addEventListener("resize", updateWindowSize);
    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  // Generate random values only on client
  useEffect(() => {
    if (windowSize.width === 0 || windowSize.height === 0) return;

    setDots(
      Array.from({ length: 20 }).map(() => {
        const initialX = Math.random() * windowSize.width;
        const initialY = Math.random() * windowSize.height;
        const animateX = Math.random() * windowSize.width;
        const animateY = Math.random() * windowSize.height;
        const duration = Math.random() * 10 + 5;
        return {
          initial: { x: initialX, y: initialY, opacity: 0 },
          animate: { x: animateX, y: animateY, opacity: [0, 1, 0] },
          transition: { duration, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
        };
      })
    );

    setParticles(
      Array.from({ length: 50 }).map(() => {
        const initialX = Math.random() * windowSize.width;
        const animateX = Math.random() * windowSize.width;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        return {
          initial: { x: initialX, y: windowSize.height + 10 },
          animate: { y: -10, x: animateX },
          transition: { duration, repeat: Number.POSITIVE_INFINITY, ease: "linear", delay },
        };
      })
    );
  }, [windowSize]);

  if (!isMounted || windowSize.width === 0 || windowSize.height === 0) {
    return null; // Don't render until mounted and dimensions are available
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Geometric network pattern */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <motion.path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="rgba(59, 130, 246, 0.1)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Animated dots */}
      {dots.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full"
          initial={dot.initial}
          animate={dot.animate}
          transition={dot.transition}
        />
      ))}

      {/* Floating particles */}
      {particles.map((particle, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-0.5 h-0.5 bg-blue-300 rounded-full"
          initial={particle.initial}
          animate={particle.animate}
          transition={particle.transition}
        />
      ))}
    </div>
  );
};

// FloatingElements component (hydration-safe)
const FloatingElements = () => {
  const [positions, setPositions] = useState<{ left: string; top: string; x: number; y: number }[]>([]);

  useEffect(() => {
    setPositions(
      Array.from({ length: 6 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
      }))
    );
  }, []);

  return (
    <>
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: [0, pos.x],
            y: [0, pos.y],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
          style={{
            left: pos.left,
            top: pos.top,
          }}
        >
          <div className="w-2 h-2 bg-blue-400 rounded-full blur-sm" />
        </motion.div>
      ))}
    </>
  );
};

function ConnectedAccount() {
  const account = useCurrentAccount();

  if (!account) {
    return null;
  }

  return (
    <div className="mt-2 text-sm text-blue-300 text-right">
      <div>Connected to {account.address}</div>
      <OwnedObjects address={account.address} />
    </div>
  );
}

function OwnedObjects({ address }: { address: string }) {
  const { data, isLoading, error } = useSuiClientQuery('getOwnedObjects', {
    owner: address,
  });
  if (isLoading) return <div>Loading objects...</div>;
  if (error) return <div>Error loading objects</div>;
  if (!data) return null;

  return (
    <ul className="mt-2 text-xs text-blue-200">
      {data.data.map((object: any) => (
        <li key={object.data?.objectId}>
          <a
            href={`https://suiexplorer.com/object/${object.data?.objectId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {object.data?.objectId}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function LandingPage() {
  const { isConnected, studentNFT } = useVotingStore();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const router = useRouter();
  const controls = useAnimation();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      icon: Vote,
      title: "Secure Voting",
      description: "Blockchain-powered voting ensures transparency and immutability",
      color: "bg-blue-500",
    },
    {
      icon: Star,
      title: "Weighted Democracy",
      description: "Academic progression increases your voting power over time",
      color: "bg-yellow-500",
    },
    {
      icon: Shield,
      title: "Verified Identity",
      description: "NFT-based student verification prevents fraud and duplicate voting",
      color: "bg-green-500",
    },
    {
      icon: Users,
      title: "Fair Representation",
      description: "Every student voice matters in university governance decisions",
      color: "bg-purple-500",
    },
  ];

  const stats = [
    { value: "1,247", label: "Registered Students" },
    { value: "892", label: "Votes Cast" },
    { value: "71.5%", label: "Participation Rate" },
    { value: "100%", label: "Transparency" },
  ];

  const handleGetStarted = () => {
    if (isConnected) {
      const isAdmin = Math.random() > 0.8;
      if (isAdmin) {
        router.push("/admin");
      } else {
        router.push("/student");
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      <FloatingElements />

      {/* Mouse follower */}
      <motion.div
        className="fixed w-6 h-6 bg-blue-400 rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      <div className="relative z-10">
        {/* Navigation */}
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="p-6"
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="p-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl"
              >
                <GraduationCap className="h-6 w-6 text-white" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
              >
                SUI Votes
              </motion.span>
            </motion.div>

            <ConnectButton />
            <ConnectedAccount />
          </div>
        </motion.nav>
        {/* Hero Section */}
        <section className="px-6 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-8"
            >
              <motion.h1
                className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <motion.span
                  className="inline-block"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                  style={{
                    background: "linear-gradient(90deg, #ffffff, #60a5fa, #ffffff)",
                    backgroundSize: "200% 100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  University Voting System
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12"
              >
                Transparent university elections powered by Sui blockchain. Your voting power increases with academic
                progression. NFT-based voter verification ensures fair and secure elections.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            >
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-white text-black hover:bg-gray-100 border-0 relative overflow-hidden group"
                  onClick={() => router.push("/student")}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-20"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Student Dashboard
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="ml-2"
                    >
                      <Sparkles className="h-5 w-5" />
                    </motion.div>
                  </span>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-red-500 text-red-400 hover:bg-red-500/10 relative overflow-hidden group"
                  onClick={() => router.push("/admin")}
                >
                  <motion.div
                    className="absolute inset-0 bg-red-500"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 0.1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Admin Dashboard
                  </span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Animated Stats */}
            <motion.div
              style={{ y: y1 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 + index * 0.1, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.1, y: -10 }}
                  className="text-center group cursor-pointer"
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.2 }}
                    className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-gray-400 group-hover:text-gray-300 transition-colors">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <motion.section style={{ y: y2 }} className="px-6 py-20 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.h2
                className="text-4xl md:text-6xl font-bold mb-6"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
                style={{
                  background: "linear-gradient(90deg, #ffffff, #3b82f6, #ffffff)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Why Choose SUI Votes?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-xl text-gray-300 max-w-3xl mx-auto"
              >
                Built on cutting-edge blockchain technology, ensuring every vote counts while maintaining the highest
                standards of security and transparency.
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
                  }}
                  className="group perspective-1000"
                >
                  <Card className="border-0 shadow-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 h-full relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <CardContent className="p-8 text-center relative z-10">
                      <motion.div
                        className={`inline-flex p-4 rounded-2xl ${feature.color} mb-6 relative`}
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.8 }}
                      >
                        <feature.icon className="h-8 w-8 text-white" />
                        <motion.div
                          className="absolute inset-0 rounded-2xl"
                          animate={{
                            boxShadow: ["0 0 0 0 rgba(59, 130, 246, 0.7)", "0 0 0 10px rgba(59, 130, 246, 0)"],
                          }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        />
                      </motion.div>
                      <motion.h3
                        className="text-xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        {feature.title}
                      </motion.h3>
                      <motion.p
                        className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors"
                        initial={{ opacity: 0.8 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {feature.description}
                      </motion.p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="px-6 py-20 relative"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"
            animate={{
              background: [
                "linear-gradient(90deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))",
                "linear-gradient(90deg, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2))",
              ],
            }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.h2
                className="text-4xl md:text-6xl font-bold mb-6 text-white"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                Ready to Make Your Voice Heard?
              </motion.h2>
              <motion.p
                className="text-xl mb-8 text-gray-300"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Join thousands of students already participating in the future of university governance.
              </motion.p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white border-0 relative overflow-hidden group"
                  onClick={handleGetStarted}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10 flex items-center">
                    <Vote className="h-5 w-5 mr-2" />
                    Get Started Now
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      className="ml-2"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}