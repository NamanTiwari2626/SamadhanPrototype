import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Calendar1 } from "./icons/Calendar1";
import { UsersAnimated } from "./icons/UsersAnimated";
import { GlobeAnimated } from "./icons/GlobeAnimated";
import { FileStackAnimated } from "./icons/FileStackAnimated";
import { TargetAnimated } from "./icons/TargetAnimated";
import { GraduationCapAnimated } from "./icons/GraduationCapAnimated";
import { FileTextAnimated } from "./icons/FileTextAnimated";
import { UserAnimated } from "./icons/UserAnimated";
import { PaperclipAnimated } from "./icons/PaperclipAnimated";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { gsap } from "gsap";
//
// import { font } from "./DakotaMotorsPersonalUseRegular-K7xge.ttf";
import {
  Mic,
  MicOff,
  Send,
  Settings,
  Menu,
  X,
  MessageSquare,
  Zap,
  Volume2,
  User,
  TrendingUp,
  Award,
  Calendar,
  Target,
  BarChart3,
  Star,
  Trophy,
  Flame,
  BookOpen,
  Clock,
  GraduationCap,
  Brain,
  Users,
  FileText,
  AlignCenter,
  ChevronRight,
} from "lucide-react";
// Fallback import path for Vite static asset
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import globeImage from "../assets/ef6432358e70cd07cef418bda499a8b4438f8bd9.png";
import Threads from "./Threads";
import RotatingText from "./RotatingText";
import { Counseling } from "./Counseling";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  files?: File[];
}

interface ResponsiveAIAssistantProps {
  onNavigateToDashboard?: () => void;
  onNavigate?: (section: string) => void;
}

export function ResponsiveAIAssistant({ onNavigateToDashboard, onNavigate }: ResponsiveAIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isBubbleOpen, setIsBubbleOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showProfilePanel, setShowProfilePanel] =
    useState(false);
  const [isTimetableHover, setIsTimetableHover] = useState(false);
  const [isCounselingHover, setIsCounselingHover] = useState(false);
  const [isCommunityHover, setIsCommunityHover] = useState(false);
  const [isQuestionBankHover, setIsQuestionBankHover] = useState(false);
  const [isStudyPlannerHover, setIsStudyPlannerHover] = useState(false);
  const [isQuizzesHover, setIsQuizzesHover] = useState(false);
  const [isSyllabusHover, setIsSyllabusHover] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [recognition, setRecognition] =
    useState<any>(null);
  const [speechSynthesis, setSpeechSynthesis] =
    useState<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock user analytics data
  const userStats = {
    level: 12,
    xp: 2850,
    xpToNext: 3500,
    streak: 15,
    totalChats: 127,
    messagesThisWeek: 45,
    badges: [
      {
        id: 1,
        name: "Early Adopter",
        icon: "🚀",
        description: "One of the first users",
      },
      {
        id: 2,
        name: "Chat Master",
        icon: "💬",
        description: "100+ conversations",
      },
      {
        id: 3,
        name: "Voice Pro",
        icon: "🎤",
        description: "Voice expert user",
      },
      {
        id: 4,
        name: "Streak King",
        icon: "🔥",
        description: "10+ day streak",
      },
    ],
    recentActivity: [
      {
        action: "Completed daily challenge",
        time: "2 hours ago",
        xp: 50,
      },
      {
        action: "Had a voice conversation",
        time: "1 day ago",
        xp: 25,
      },
      {
        action: "Reached 100 chats milestone",
        time: "3 days ago",
        xp: 100,
      },
    ],
  };

  useEffect(() => {
    // Initialize speech recognition
    if (
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition
    ) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    // Initialize speech synthesis
    if ("speechSynthesis" in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi")
    ) {
      return "Hello! I'm your AI assistant. I'm here to help you with anything you need. How can I assist you today?";
    } else if (lowerMessage.includes("weather")) {
      return "I'd love to help with weather information! In a full implementation, I'd connect to a weather API to give you current conditions for your location.";
    } else if (lowerMessage.includes("time")) {
      return `The current time is ${new Date().toLocaleTimeString()}.`;
    } else if (lowerMessage.includes("help")) {
      return "I'm here to help! You can ask me questions, have a conversation, or use voice input by tapping the microphone button.";
    } else {
      return "That's an interesting question! I'm a demo AI assistant with simulated responses, but I'm designed to show how voice and chat interactions work together.";
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim() && selectedFiles.length === 0) return;

    const messageText = selectedFiles.length > 0 
      ? `${inputText}${inputText ? '\n\n' : ''}📎 Attached ${selectedFiles.length} file(s): ${selectedFiles.map(f => f.name).join(', ')}`
      : inputText;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
      files: selectedFiles.length > 0 ? [...selectedFiles] : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setShowChat(true);

    // Generate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputText || `I received ${selectedFiles.length} file(s) from you.`),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);

    setInputText("");
    setSelectedFiles([]);
  };

  const getXPProgress = () => {
    return (userStats.xp / userStats.xpToNext) * 100;
  };

  const handleVoiceInput = () => {
    if (!recognition) {
      alert(
        "Speech recognition is not supported in your browser.",
      );
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleSpeak = (text: string) => {
    if (!speechSynthesis) {
      alert(
        "Speech synthesis is not supported in your browser.",
      );
      return;
    }

    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    setSelectedFiles(prev => [...prev, ...files]);
    
    // Clear the input after selection
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const openFile = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
    // Clean up the URL after a delay to free memory
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="h-screen relative overflow-hidden" style={{ background: 'linear-gradient(to right, rgb(15, 23, 42), rgb(51, 65, 85))' }}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        accept="*/*"
      />
      
      {/* Background background: linear-gradient(to right, rgb(15, 23, 42), rgb(51, 65, 85));*/}
      <div className="absolute inset-0 z-0">
        <Threads
          amplitude={1}
          distance={0}
          enableMouseInteraction={true}
        />
      </div>
{/* Profile Analytics Panel */}
      {showProfilePanel && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setShowProfilePanel(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md backdrop-blur-lg border-l transform transition-transform duration-300 ease-out"
            style={{
              backgroundColor: "transparent",
              borderColor: "transparent",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 h-full overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-xl" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  Profile Analytics
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowProfilePanel(false)}
                  className="text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* User Avatar & Basic Info */}
              <div className="text-center mb-6">
                <div
                  className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center border-4 border-white/20"
                  style={{
                    background:
                      "linear-gradient(transparent)",
                  }}
                >
                  <UserAnimated width={40} height={40} stroke="#ffffff" />
                </div>
                <h4 className="text-white text-lg mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  Alex Thompson
                </h4>
                <p className="text-gray-300 text-sm" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  AI Enthusiast
                </p>
              </div>

              {/* Level & XP Progress */}
              <Card className="bg-white/10 border-white/20 p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-white">
                      Level {userStats.level}
                    </span>
                  </div>
                  <Badge
                    className="border"
                    style={{
                      backgroundColor:
                        "rgba(145, 10, 103, 0.2)",
                      color: "rgb(255, 182, 193)",
                      borderColor: "rgba(145, 10, 102, 0)",
                    }}
                  >
                    {userStats.xp} XP
                  </Badge>
                </div>
                <Progress
                  value={getXPProgress()}
                  className="mb-2"
                />
                <p className="text-xs text-gray-400">
                  {userStats.xpToNext - userStats.xp} XP to next
                  level
                </p>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Card className="bg-white/10 border-white/20 p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Flame className="w-5 h-5 text-orange-400" />
                  </div>
                  <p className="text-2xl text-white mb-1">
                    {userStats.streak}
                  </p>
                  <p className="text-xs text-gray-400">
                    Day Streak
                  </p>
                </Card>

                <Card className="bg-white/10 border-white/20 p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <MessageSquare
                      className="w-5 h-5"
                      style={{ color: "rgb(255, 182, 193)" }}
                    />
                  </div>
                  <p className="text-2xl text-white mb-1">
                    {userStats.totalChats}
                  </p>
                  <p className="text-xs text-gray-400">
                    Total Chats
                  </p>
                </Card>

                <Card className="bg-white/10 border-white/20 p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp
                      className="w-5 h-5"
                      style={{ color: "rgb(255, 182, 193)" }}
                    />
                  </div>
                  <p className="text-2xl text-white mb-1">
                    {userStats.messagesThisWeek}
                  </p>
                  <p className="text-xs text-gray-400">
                    This Week
                  </p>
                </Card>

                <Card className="bg-white/10 border-white/20 p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Trophy
                      className="w-5 h-5"
                      style={{ color: "rgb(255, 182, 193)" }}
                    />
                  </div>
                  <p className="text-2xl text-white mb-1">
                    {userStats.badges.length}
                  </p>
                  <p className="text-xs text-gray-400">
                    Badges
                  </p>
                </Card>
              </div>

              {/* Badges Section */}
              <div className="mb-6">
                <h5 className="text-white text-lg mb-3 flex items-center gap-2" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  <Award className="w-5 h-5 text-yellow-400" />
                  Achievements
                </h5>
                <div className="grid grid-cols-2 gap-3">
                  {userStats.badges.map((badge) => (
                    <Card
                      key={badge.id}
                      className="bg-white/10 border-white/20 p-3"
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">
                          {badge.icon}
                        </div>
                        <h6 className="text-white text-sm mb-1">
                          {badge.name}
                        </h6>
                        <p className="text-xs text-gray-400">
                          {badge.description}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h5 className="text-white text-lg mb-3 flex items-center gap-2" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  <BarChart3
                    className="w-5 h-5"
                    style={{ color: "rgb(255, 182, 193)" }}
                  />
                  Recent Activity
                </h5>
                <div className="space-y-3">
                  {userStats.recentActivity.map(
                    (activity, index) => (
                      <Card
                        key={index}
                        className="bg-white/10 border-white/20 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm">
                              {activity.action}
                            </p>
                            <p className="text-xs text-gray-400">
                              {activity.time}
                            </p>
                          </div>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            +{activity.xp} XP
                          </Badge>
                        </div>
                      </Card>
                    ),
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="space-y-3">
                  <Button
                    className="w-full text-white hover:opacity-90"
                    style={{
                      background:
                        "linear-gradient(135deg, rgb(0, 0, 0), rgb(0, 0, 0))",
                    }}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Set Daily Goal
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-black hover:bg-white/10"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    View Progress
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

     {/* UPDATED BUBBLE MENU WITH CANCEL BUTTON */}
{/* FIXED BUBBLE MENU WITH PROPER SCROLLING */}
{isBubbleOpen && (
  <div
    className="fixed inset-0 z-50"
    onClick={() => setIsBubbleOpen(false)}
    style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(5px)' }}
  >
    {/* FIXED CONTAINER WITH PROPER SCROLLING */}
    <div
      className="absolute left-4 top-4 bottom-4 w-[380px] flex flex-col gap-3 no-scrollbar"
      style={{
        maxHeight: 'calc(100vh - 32px)', // Ensure it fits in viewport
        overflowY: 'auto',
        overflowX: 'hidden', // Changed from visible to hidden
        paddingLeft: '8px',
        paddingRight: '8px',
        paddingTop: '8px',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* CANCEL BUTTON AT THE TOP */}
      <div
        className="cancel-button-item opacity-0 self-start sticky top-0 z-10"
        style={{ 
          transform: 'translateX(-150px)',
          animation: isBubbleOpen 
            ? `slideInLeft 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s forwards`
            : 'none'
        }}
      >
        <button
          className="shadow-xl p-3 flex items-center justify-center transition-all duration-300 font-semibold border-2"
          style={{
            backgroundColor: '#ffffff',
            color: '#000000',
            borderColor: '#e5e7eb',
            borderRadius: '50px',
            width: '50px',
            height: '50px',
            marginLeft: '16px',
            marginBottom: '8px',
          }}
          onClick={() => setIsBubbleOpen(false)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ef4444';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.borderColor = '#ef4444';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.color = '#000000';
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* MENU ITEMS WITH FIXED BUTTON SIZING */}
      {[
        { label: 'Counseling', icon: Users, section: 'counseling' },
        { label: 'Smart Question Bank', icon: BookOpen, section: 'question-bank' },
        { label: 'Timetable Maker', icon: Calendar, section: 'timetable' },
        { label: 'Study Planner', icon: Target, section: 'study-planner' },
        { label: 'Quizzes', icon: GraduationCap, section: 'quizzes' },
        { label: 'Syllabus', icon: FileText, section: 'syllabus' },
        { label: 'Community Chat', icon: Users, section: 'community' }
      ].map((item, index) => (
        <div
          key={index}
          className="menu-bullet-item opacity-0"
          style={{ 
            transform: 'translateX(7000px)',
            animation: isBubbleOpen 
              ? `slideInLeft 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${(index + 1) * 0.1}s forwards`
              : 'none'
          }}
        >
          <button
            className="w-full shadow-xl p-4 flex items-center gap-4 transition-all duration-300 font-semibold text-lg border-2"
            style={{
              backgroundColor: '#ffffff',
              color: '#000000',
              borderColor: '#e5e7eb',
              borderRadius: '50px',
              minHeight: '80px', // Reduced from 100px
              maxWidth: '100%',
              width: 'calc(100% - 16px)', // Account for margins
              marginLeft: '8px',
              marginRight: '8px',
              paddingLeft: '24px',
              paddingRight: '16px',
              boxSizing: 'border-box', // Important for proper width calculation
            }}
            onClick={() => {
              console.log(`Clicked: ${item.label}, Section: ${item.section}`);
              if (onNavigate) {
                onNavigate(item.section);
              }
              setTimeout(() => setIsBubbleOpen(false), 100);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#000000';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = '#000000';
              e.currentTarget.style.transform = 'scale(1.02)'; // Reduced scale
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
              if (item.section === 'timetable') setIsTimetableHover(true);
              if (item.section === 'counseling') setIsCounselingHover(true);
              if (item.section === 'community') setIsCommunityHover(true);
              if (item.section === 'question-bank') setIsQuestionBankHover(true);
              if (item.section === 'study-planner') setIsStudyPlannerHover(true);
              if (item.section === 'quizzes') setIsQuizzesHover(true);
              if (item.section === 'syllabus') setIsSyllabusHover(true);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#000000';
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              if (item.section === 'timetable') setIsTimetableHover(false);
              if (item.section === 'counseling') setIsCounselingHover(false);
              if (item.section === 'community') setIsCommunityHover(false);
              if (item.section === 'question-bank') setIsQuestionBankHover(false);
              if (item.section === 'study-planner') setIsStudyPlannerHover(false);
              if (item.section === 'quizzes') setIsQuizzesHover(false);
              if (item.section === 'syllabus') setIsSyllabusHover(false);
            }}
          >
            {item.section === 'timetable' ? (
              <div className="-m-2">{/* negate internal padding of Calendar1 */}
                <Calendar1 width={20} height={20} isHovering={isTimetableHover} />
              </div>
            ) : item.section === 'counseling' ? (
              <div className="-m-2">
                <UsersAnimated width={20} height={20} isHovering={isCounselingHover} />
              </div>
            ) : item.section === 'community' ? (
              <div className="-m-2">
                <GlobeAnimated width={20} height={20} isHovering={isCommunityHover} />
              </div>
            ) : item.section === 'question-bank' ? (
              <div className="-m-2">
                <FileStackAnimated width={20} height={20} isHovering={isQuestionBankHover} />
              </div>
            ) : item.section === 'study-planner' ? (
              <div className="-m-2">
                <TargetAnimated width={20} height={20} isHovering={isStudyPlannerHover} />
              </div>
            ) : item.section === 'quizzes' ? (
              <div className="-m-2">
                <GraduationCapAnimated width={20} height={20} isHovering={isQuizzesHover} />
              </div>
            ) : item.section === 'syllabus' ? (
              <div className="-m-2">
                <FileTextAnimated width={20} height={20} isHovering={isSyllabusHover} />
              </div>
            ) : (
              <item.icon className="w-5 h-5 flex-shrink-0" />
            )}
            <div className="text-left flex-1 min-w-0"> {/* Added min-w-0 */}
              <div style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>{item.label}</div>
              <div className="text-xs opacity-70 mt-1">Click to explore</div>
            </div>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
          </button>
        </div>
      ))}
    </div>
  </div>
)}

{/* UPDATED STYLES */}
<style>{`
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-150px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.menu-bullet-item {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.cancel-button-item {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Hide scrollbar while allowing scroll */
.no-scrollbar::-webkit-scrollbar { 
  display: none; 
}
.no-scrollbar { 
  -ms-overflow-style: none; 
  scrollbar-width: none; 
}

/* Ensure smooth scrolling */
.no-scrollbar {
  scroll-behavior: smooth;
}

/* Fix for mobile scrolling */
@supports (-webkit-overflow-scrolling: touch) {
  .no-scrollbar {
    -webkit-overflow-scrolling: touch;
  }
}

/* Hide scrollbar while keeping scroll functionality */
.scrollbar-hide {
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none;  /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Safari and Chrome */
}
`}</style>


      {/* Main Content */}
      <div className={`flex flex-col h-full transition-all duration-300 min-h-0 ${
    isBubbleOpen ? 'ml-[340px] scale-95' : ''
  }`}
>

        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 relative z-20">
        <div className="flex items-center gap-3">
            {/* Bubble Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsBubbleOpen(!isBubbleOpen)}
              className="relative w-10 h-10 rounded-full text-black border-2 border-black shadow-lg p-0 hover:text-white hover:border-white transition-all duration-300 group"
              style={{
                background: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "black";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.borderColor = "white";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.color = "black";
                e.currentTarget.style.borderColor = "black";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <Menu className="w-4 h-4 group-hover:animate-pulse" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {showChat && (
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={() => setShowChat(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            )}

            {/* User Profile Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProfilePanel(true)}
              className="relative w-10 h-10 rounded-full text-white border-2 border-white/20 shadow-lg p-0 hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, rgba(2, 0, 2, 0.76), rgba(0, 0, 0, 0.25))",
              }}
            >
              <UserAnimated width={20} height={20} stroke="#ffffff" />
              {userStats.streak > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                  <Flame className="w-3 h-3 text-white" />
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Rotating Text at Same Level as Header */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4">
          {/* VINSH-AI Text */}
          <div className="text-white font-bold text-xl tracking-wider" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
            VINSH-AI IS
          </div>
          
          {/* Rotating Text with Dynamic Box */}
          <RotatingText
            texts={['Teacher', 'Friend', 'Easy', 'Understandable']}
            mainClassName="px-2 py-1 rounded-lg shadow-lg border-2 border-gray-300"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
        </div>

        {/* Content Area - ADD blur and scale when menu is open */}
<div 
  className={`flex-1 relative z-10 px-4 lg:px-6 transition-all duration-300 min-h-0 ${
    isBubbleOpen ? 'blur-sm scale-95' : ''
  }`}
>
          {!showChat ? (
            /* Welcome Screen */
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 lg:space-y-8">
              {/* Globe */}
              <div className="relative">
                <div className="w-32 h-32 lg:w-48 lg:h-48 relative">
                  <img
                    src={globeImage}
                    alt="AI Globe"
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                  {(isListening || isSpeaking) && (
                    <div
                      className="absolute inset-0 rounded-full border-4 animate-ping"
                      style={{
                        borderColor: "rgb(255, 182, 193)",
                      }}
                    ></div>
                  )}
                  <div
                    className="absolute inset-0 blur-xl rounded-[2px]"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, transparent)", //ball color
                    }}
                  ></div>
                </div>
              </div>

              {/* Welcome Text */}
              <div className="space-y-2 lg:space-y-4">
                <h2 className="text-2xl lg:text-4xl text-white" style={{ fontFamily: 'Dakota Motors, Arial, sans-serif' }}>
                  Victory Starts with Preparation!
                </h2>
                <p className="text-lg lg:text-xl text-gray-200" style={{ fontFamily: 'Dakota Motors, Arial, sans-serif' }}>
                  Your smart study companion
                </p>
                <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20 backdrop-blur-lg">
                  <p className="font-BodoniFLF-Bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gray-300">
                    Achieve your competitive exam goals with intelligent practice, performance tracking, and expert guidance
                  </p>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-3 lg:gap-4 justify-center max-w-lg">
                <Button
                  onClick={() => setShowChat(true)}
                  className="text-white border-0 px-6 py-3 rounded-full shadow-lg hover:opacity-90"
                  style={{
                    background:
                      "linear-gradient(rgba(12, 12, 12, 0.77))",
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start Chat
                </Button>
                <Button
                  onClick={handleVoiceInput}
                  className={`${isListening ? "bg-red-600 hover:bg-black-100" : ""} text-white border-0 px-6 py-3 rounded-full shadow-lg`}
                  style={
                    !isListening
                      ? {
                          background:
                            "linear-gradient(rgba(12, 12, 12, 0.77))",
                        }
                      : {}
                  }
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4 mr-2" />
                  ) : (
                    <Mic className="w-4 h-4 mr-2" />
                  )}
                  {isListening ? "Stop" : "Voice"}
                </Button>
                
              </div>
            </div>
          ) : (
            /* Chat Interface */
            <div className="h-full flex flex-col max-h-[calc(100vh-200px)]">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 pb-4 min-h-0 scroll-smooth scrollbar-hide">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-200" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                      Start a conversation...
                    </p>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <Card
                      className={`max-w-[85%] lg:max-w-[70%] p-4 backdrop-blur-lg border-0 shadow-xl text-white ${
                        message.sender === "user"
                          ? "border border-white/20"
                          : "bg-white/10 border border-white/20"
                      }`}
                      style={
                        message.sender === "user"
                          ? {
                              background:
                                "linear-gradient(135deg, rgba(114, 4, 85, 0.8), rgba(145, 10, 103, 0.8))",
                            }
                          : {}
                      }
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm lg:text-base" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                            {message.text}
                          </p>
                          {/* File Attachments */}
                          {message.files && message.files.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.files.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 p-2 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
                                  onClick={() => openFile(file)}
                                >
                                  <span className="text-lg">📎</span>
                                  <span className="text-sm text-gray-200 truncate max-w-48">
                                    {file.name}
                                  </span>
                                  <span className="text-xs text-gray-400 ml-auto">
                                    {(file.size / 1024).toFixed(1)} KB
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {message.sender === "ai" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="shrink-0 h-8 w-8 p-0 hover:bg-white/10"
                            style={{
                              color: "rgb(255, 182, 193)",
                            }}
                            onClick={() =>
                              handleSpeak(message.text)
                            }
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </Card>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>

        {/* Chat Input - ADD compression when menu is open */}
<div className={`p-4 lg:p-6 relative z-20 transition-all duration-300 ${
    isBubbleOpen ? 'scale-95 blur-sm pointer-events-none' : ''
  }`}
>
  <Card className="backdrop-blur-lg bg-white/10 border border-white/20 p-4 shadow-xl">
            {/* Selected Files Display */}
            {selectedFiles.length > 0 && (
              <div className="mb-3 p-2 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-300">📎 Selected Files:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFiles([])}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded text-xs text-gray-300"
                    >
                      <span className="truncate max-w-32">{file.name}</span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-white ml-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 pr-20 rounded-full focus:ring-2 focus:border-transparent"
                  style={
                    {
                      "--tw-ring-color": "rgb(255, 182, 193)",
                    } as React.CSSProperties
                  }
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-10 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-white/10"
                  style={{
                    color: "rgb(255, 182, 193)",
                  }}
                  onClick={handleFileSelect}
                  title="Attach files"
                >
                  <PaperclipAnimated width={16} height={16} stroke="rgb(255, 182, 193)" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-white/10"
                  style={{
                    color: isListening
                      ? "rgb(239, 68, 68)"
                      : "rgb(255, 182, 193)",
                  }}
                  onClick={handleVoiceInput}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() && selectedFiles.length === 0}
                className="text-white border-0 rounded-full px-6 shadow-lg disabled:opacity-50 hover:opacity-90"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(114, 4, 85), rgb(145, 10, 103))",
                }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {isListening && (
              <div className="mt-3 text-center">
                <p
                  className="text-sm animate-pulse flex items-center justify-center gap-2"
                  style={{ color: "rgb(255, 182, 193)" }}
                >
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: "rgb(255, 182, 193)",
                    }}
                  ></div>
                  Listening... Speak now
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: "rgb(255, 182, 193)",
                      animationDelay: "0.1s",
                    }}
                  ></div>
                </p>
              </div>
            )}

            {isSpeaking && (
              <div className="mt-3 text-center">
                <p
                  className="text-sm animate-pulse flex items-center justify-center gap-2"
                  style={{ color: "rgb(255, 182, 193)" }}
                >
                  <Volume2 className="w-4 h-4" />
                  Speaking...
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}