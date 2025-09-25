import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Beams from "./Beams";
import TrueFocus from "./TrueFocus";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface AuthPageProps {
  onSuccess: () => void;
  onBack: () => void;
}

export default function AuthPage({ onSuccess, onBack }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-50">
        <Beams />
      </div>

      <div className="relative z-10 min-h-screen flex">
        <div className="hidden lg:flex lg:w-3/5 flex-col justify-center items-center p-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login-content"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <motion.h1
                    className="text-8xl font-bold mb-8"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    vinsh<span className="text-[#E50914]">-ai</span>
                  </motion.h1>
                  <motion.p
                    className="text-2xl text-gray-300 mb-12 max-w-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    Welcome back! Sign in to continue your AI journey
                  </motion.p>
                  <motion.div className="mx-auto mb-8 relative" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
                    <TrueFocus sentence="VINSH-AI Study smarter achieve higher" borderColor="#E50914" glowColor="rgba(229, 9, 20, 0.6)" />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="signup-content"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <motion.h1
                    className="text-8xl font-bold mb-8"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    Join<span className="text-[#E50914]"> vinsh-ai</span>
                  </motion.h1>
                  <motion.p
                    className="text-2xl text-gray-300 mb-12 max-w-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    Create your account and unlock the power of AI
                  </motion.p>
                  <motion.div className="mx-auto mb-8 relative" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
                    <TrueFocus sentence="VINSH-AI Study smarter achieve higher" borderColor="#E50914" glowColor="rgba(229, 9, 20, 0.6)" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="w-full lg:w-2/5 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="lg:hidden text-center mb-12">
              <h1 className="text-4xl font-bold">
                vinsh<span className="text-[#E50914]">-ai</span>
              </h1>
            </div>

            <div className="flex mb-8 bg-gray-900 rounded-lg p-1">
              <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 px-6 rounded-md text-sm font-medium transition-all duration-300 ${isLogin ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"}`}>
                Log In
              </button>
              <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 px-6 rounded-md text-sm font-medium transition-all duration-300 ${!isLogin ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"}`}>
                Sign Up
              </button>
            </div>

            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                {isLogin ? (
                  <motion.div key="login" initial={{ x: -300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                    <LoginForm onSuccess={onSuccess} />
                  </motion.div>
                ) : (
                  <motion.div key="register" initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                    <RegisterForm onSuccess={onSuccess} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


