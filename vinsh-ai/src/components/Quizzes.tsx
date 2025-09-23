import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import Threads from "./Threads";
import {
  ArrowLeft,
  GraduationCap,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  Star,
  Target,
  TrendingUp,
  BarChart3,
  Award,
  Trophy,
  BookOpen,
  Brain,
  Zap,
  Timer,
  Flag,
  Bookmark,
  Share2,
  Download,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  Settings,
  Bell,
  RefreshCw,
  Copy,
  Users,
  Calendar,
  FileText,
  Lightbulb,
  AlertCircle,
  Info,
} from "lucide-react";

interface QuizzesProps {
  onBack: () => void;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  duration: number; // in minutes
  questions: number;
  attempts: number;
  bestScore: number;
  averageScore: number;
  lastAttempted?: string;
  isCompleted: boolean;
  isActive: boolean;
  tags: string[];
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  subject: string;
  topic: string;
  timeSpent?: number;
}

export function Quizzes({ onBack }: QuizzesProps) {
  const [selectedTab, setSelectedTab] = useState("available");
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<any>(null);

  const quizzes: Quiz[] = [
    {
      id: "1",
      title: "JEE Main Mathematics Mock Test",
      description: "Complete mock test covering all topics for JEE Main Mathematics",
      subject: "Mathematics",
      difficulty: "hard",
      duration: 180,
      questions: 30,
      attempts: 0,
      bestScore: 0,
      averageScore: 0,
      isCompleted: false,
      isActive: true,
      tags: ["JEE Main", "Mock Test", "Mathematics"]
    },
    {
      id: "2",
      title: "NEET Physics Quick Quiz",
      description: "Quick 30-minute quiz on Physics fundamentals",
      subject: "Physics",
      difficulty: "medium",
      duration: 30,
      questions: 15,
      attempts: 2,
      bestScore: 85,
      averageScore: 78,
      lastAttempted: "2024-12-15",
      isCompleted: true,
      isActive: true,
      tags: ["NEET", "Physics", "Quick Quiz"]
    },
    {
      id: "3",
      title: "UPSC General Studies Practice",
      description: "Comprehensive practice test for UPSC General Studies",
      subject: "General Studies",
      difficulty: "hard",
      duration: 120,
      questions: 50,
      attempts: 1,
      bestScore: 72,
      averageScore: 72,
      lastAttempted: "2024-12-14",
      isCompleted: false,
      isActive: true,
      tags: ["UPSC", "General Studies", "Practice"]
    },
    {
      id: "4",
      title: "Chemistry Organic Reactions",
      description: "Test your knowledge of organic chemistry reactions",
      subject: "Chemistry",
      difficulty: "medium",
      duration: 45,
      questions: 20,
      attempts: 0,
      bestScore: 0,
      averageScore: 0,
      isCompleted: false,
      isActive: true,
      tags: ["Chemistry", "Organic", "Reactions"]
    },
    {
      id: "5",
      title: "English Grammar Mastery",
      description: "Comprehensive grammar test for competitive exams",
      subject: "English",
      difficulty: "easy",
      duration: 30,
      questions: 25,
      attempts: 3,
      bestScore: 92,
      averageScore: 88,
      lastAttempted: "2024-12-13",
      isCompleted: true,
      isActive: true,
      tags: ["English", "Grammar", "Competitive"]
    }
  ];

  const sampleQuestions: Question[] = [
    {
      id: "1",
      question: "What is the derivative of x² + 3x + 2?",
      options: ["2x + 3", "x + 3", "2x + 2", "x² + 3"],
      correctAnswer: 0,
      explanation: "The derivative of x² is 2x, derivative of 3x is 3, and derivative of constant 2 is 0. So, d/dx(x² + 3x + 2) = 2x + 3",
      difficulty: "medium",
      subject: "Mathematics",
      topic: "Calculus"
    },
    {
      id: "2",
      question: "Which of the following is not a noble gas?",
      options: ["Helium", "Neon", "Chlorine", "Argon"],
      correctAnswer: 2,
      explanation: "Noble gases are elements in group 18 of the periodic table. Chlorine is in group 17 (halogens), not group 18.",
      difficulty: "easy",
      subject: "Chemistry",
      topic: "Periodic Table"
    },
    {
      id: "3",
      question: "What is the SI unit of electric current?",
      options: ["Volt", "Ampere", "Ohm", "Watt"],
      correctAnswer: 1,
      explanation: "The SI unit of electric current is Ampere (A), named after André-Marie Ampère.",
      difficulty: "easy",
      subject: "Physics",
      topic: "Electricity"
    }
  ];

  const userStats = {
    totalQuizzes: 25,
    completedQuizzes: 18,
    averageScore: 82,
    bestScore: 96,
    totalTimeSpent: 1250, // in minutes
    currentStreak: 7,
    rank: 1250,
    points: 15800
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-400 bg-green-500/20";
      case "medium": return "text-yellow-400 bg-yellow-500/20";
      case "hard": return "text-red-400 bg-red-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    if (score >= 50) return "text-orange-400";
    return "text-red-400";
  };

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setTimeRemaining(quiz.duration * 60); // convert to seconds
    setIsQuizActive(true);
    setShowResults(false);
  };

  const submitAnswer = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const finishQuiz = () => {
    setIsQuizActive(false);
    setShowResults(true);
    
    // Calculate results
    let correctAnswers = 0;
    sampleQuestions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / sampleQuestions.length) * 100);
    const timeSpent = selectedQuiz ? selectedQuiz.duration * 60 - timeRemaining : 0;
    
    setQuizResults({
      score,
      correctAnswers,
      totalQuestions: sampleQuestions.length,
      timeSpent,
      accuracy: score
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isQuizActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            finishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isQuizActive, timeRemaining]);

  if (isQuizActive && selectedQuiz) {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(to right, rgb(15, 23, 42), rgb(51, 65, 85))' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        </div>

        <div className="relative z-20 p-6">
          {/* Quiz Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsQuizActive(false);
                  setSelectedQuiz(null);
                }}
                className="text-white hover:bg-white/10 border border-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Exit Quiz
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  {selectedQuiz.title}
                </h1>
                <p className="text-gray-300">Question {currentQuestion + 1} of {sampleQuestions.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-white" />
                <span className="text-xl font-bold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {selectedQuiz.difficulty.charAt(0).toUpperCase() + selectedQuiz.difficulty.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <Progress value={((currentQuestion + 1) / sampleQuestions.length) * 100} className="h-2" />
          </div>

          {/* Question */}
          <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge className={`text-xs ${getDifficultyColor(sampleQuestions[currentQuestion].difficulty)}`}>
                {sampleQuestions[currentQuestion].difficulty}
              </Badge>
              <Badge className="bg-white/10 text-white border-white/20 text-xs">
                {sampleQuestions[currentQuestion].topic}
              </Badge>
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-6" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {sampleQuestions[currentQuestion].question}
            </h3>
            
            <div className="space-y-3">
              {sampleQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                    selectedAnswers[sampleQuestions[currentQuestion].id] === index
                      ? 'border-blue-400 bg-blue-500/20 text-white'
                      : 'border-white/20 bg-white/5 text-gray-200 hover:bg-white/10'
                  }`}
                  onClick={() => submitAnswer(sampleQuestions[currentQuestion].id, index)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswers[sampleQuestions[currentQuestion].id] === index
                        ? 'border-blue-400 bg-blue-400'
                        : 'border-white/40'
                    }`}>
                      {selectedAnswers[sampleQuestions[currentQuestion].id] === index && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Flag className="w-4 h-4 mr-2" />
                Flag
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Bookmark className="w-4 h-4 mr-2" />
                Bookmark
              </Button>
            </div>
            
            <Button
              onClick={nextQuestion}
              className="text-white border-0 rounded-full"
              style={{ background: 'linear-gradient(135deg, rgb(34, 197, 94), rgb(16, 185, 129))' }}
            >
              {currentQuestion === sampleQuestions.length - 1 ? 'Finish' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && quizResults) {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(to right, rgb(15, 23, 42), rgb(51, 65, 85))' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        </div>

        <div className="relative z-20 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Results Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                Quiz Completed!
              </h1>
              <p className="text-gray-300">Here are your results</p>
            </div>

            {/* Results Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg text-center">
                <div className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  {quizResults.score}%
                </div>
                <div className="text-gray-300">Overall Score</div>
              </Card>
              
              <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg text-center">
                <div className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  {quizResults.correctAnswers}/{quizResults.totalQuestions}
                </div>
                <div className="text-gray-300">Correct Answers</div>
              </Card>
              
              <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg text-center">
                <div className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  {Math.floor(quizResults.timeSpent / 60)}m {quizResults.timeSpent % 60}s
                </div>
                <div className="text-gray-300">Time Taken</div>
              </Card>
            </div>

            {/* Performance Analysis */}
            <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg mb-8">
              <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                Performance Analysis
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Accuracy</span>
                  <div className="flex items-center gap-2">
                    <Progress value={quizResults.accuracy} className="w-32 h-2" />
                    <span className="text-white font-medium">{quizResults.accuracy}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Speed</span>
                  <div className="flex items-center gap-2">
                    <Progress value={75} className="w-32 h-2" />
                    <span className="text-white font-medium">Good</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Difficulty Handling</span>
                  <div className="flex items-center gap-2">
                    <Progress value={80} className="w-32 h-2" />
                    <span className="text-white font-medium">Excellent</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => {
                  setShowResults(false);
                  setSelectedQuiz(null);
                }}
                className="text-white border-0 rounded-full"
                style={{ background: 'linear-gradient(135deg, rgb(34, 197, 94), rgb(16, 185, 129))' }}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Take Another Quiz
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Results
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Results
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(to right, rgb(15, 23, 42), rgb(51, 65, 85))' }}>
      {/* Threaded Background */}
      <div className="absolute inset-0 z-0">
        <Threads
          amplitude={1}
          distance={0}
          enableMouseInteraction={true}
        />
      </div>

      {/* Header */}
      <div className="relative z-20 p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/10 border border-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                Quizzes & Mock Tests
              </h1>
              <p className="text-gray-300 mt-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                Test your knowledge with practice quizzes and mock exams
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 px-3 py-1">
              <GraduationCap className="w-3 h-3 mr-1" />
              50+ Tests Available
            </Badge>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {userStats.totalQuizzes}
            </div>
            <div className="text-sm text-gray-300">Total Quizzes</div>
          </Card>
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {userStats.completedQuizzes}
            </div>
            <div className="text-sm text-gray-300">Completed</div>
          </Card>
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {userStats.averageScore}%
            </div>
            <div className="text-sm text-gray-300">Avg. Score</div>
          </Card>
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {userStats.bestScore}%
            </div>
            <div className="text-sm text-gray-300">Best Score</div>
          </Card>
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {Math.floor(userStats.totalTimeSpent / 60)}h
            </div>
            <div className="text-sm text-gray-300">Time Spent</div>
          </Card>
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              #{userStats.rank}
            </div>
            <div className="text-sm text-gray-300">Rank</div>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 border-white/20">
            <TabsTrigger value="available" className="text-white data-[state=active]:bg-white/20">
              Available
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-white data-[state=active]:bg-white/20">
              Completed
            </TabsTrigger>
            <TabsTrigger value="favorites" className="text-white data-[state=active]:bg-white/20">
              Favorites
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="text-white data-[state=active]:bg-white/20">
              Leaderboard
            </TabsTrigger>
          </TabsList>

          {/* Available Quizzes Tab */}
          <TabsContent value="available" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.filter(quiz => !quiz.isCompleted).map((quiz) => (
                <Card key={quiz.id} className="bg-white/10 border-white/20 p-6 backdrop-blur-lg hover:scale-105 transition-transform duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                        {quiz.title}
                      </h3>
                      <p className="text-sm text-gray-300 mb-3">{quiz.description}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={`text-xs ${getDifficultyColor(quiz.difficulty)}`}>
                          {quiz.difficulty}
                        </Badge>
                        <Badge className="bg-white/10 text-white border-white/20 text-xs">
                          {quiz.subject}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Duration</span>
                      <span className="text-sm text-white">{quiz.duration} minutes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Questions</span>
                      <span className="text-sm text-white">{quiz.questions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Attempts</span>
                      <span className="text-sm text-white">{quiz.attempts}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {quiz.tags.map((tag, index) => (
                      <Badge key={index} className="bg-white/5 text-gray-300 border-white/10 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    onClick={() => startQuiz(quiz)}
                    className="w-full text-white border-0 rounded-full"
                    style={{ background: 'linear-gradient(135deg, rgb(99, 102, 241), rgb(139, 92, 246))' }}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Quiz
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Completed Quizzes Tab */}
          <TabsContent value="completed" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.filter(quiz => quiz.isCompleted).map((quiz) => (
                <Card key={quiz.id} className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                        {quiz.title}
                      </h3>
                      <p className="text-sm text-gray-300 mb-3">{quiz.description}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={`text-xs ${getDifficultyColor(quiz.difficulty)}`}>
                          {quiz.difficulty}
                        </Badge>
                        <Badge className="bg-white/10 text-white border-white/20 text-xs">
                          {quiz.subject}
                        </Badge>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                          Completed
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Best Score</span>
                      <span className={`text-sm font-medium ${getScoreColor(quiz.bestScore)}`}>
                        {quiz.bestScore}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Average Score</span>
                      <span className={`text-sm font-medium ${getScoreColor(quiz.averageScore)}`}>
                        {quiz.averageScore}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Attempts</span>
                      <span className="text-sm text-white">{quiz.attempts}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Last Attempted</span>
                      <span className="text-sm text-white">
                        {quiz.lastAttempted ? new Date(quiz.lastAttempted).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => startQuiz(quiz)}
                      className="flex-1 text-white border-0 rounded-full"
                      style={{ background: 'linear-gradient(135deg, rgb(99, 102, 241), rgb(139, 92, 246))' }}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Retake
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <div className="text-center py-12">
              <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                No Favorites Yet
              </h3>
              <p className="text-gray-300 mb-6">
                Bookmark quizzes you want to take later
              </p>
              <Button
                onClick={() => setSelectedTab("available")}
                className="text-white border-0 rounded-full"
                style={{ background: 'linear-gradient(135deg, rgb(99, 102, 241), rgb(139, 92, 246))' }}
              >
                Browse Quizzes
              </Button>
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
              <h3 className="text-xl font-bold text-white mb-6" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                Top Performers
              </h3>
              
              <div className="space-y-4">
                {[
                  { rank: 1, name: "Rahul Kumar", score: 98, quizzes: 25, avatar: "👨‍🎓" },
                  { rank: 2, name: "Priya Singh", score: 96, quizzes: 22, avatar: "👩‍⚕️" },
                  { rank: 3, name: "Amit Patel", score: 94, quizzes: 20, avatar: "👨‍💼" },
                  { rank: 4, name: "Sneha Sharma", score: 92, quizzes: 18, avatar: "👩‍🔬" },
                  { rank: 5, name: "Vikram Gupta", score: 90, quizzes: 16, avatar: "👨‍🏫" }
                ].map((user) => (
                  <div key={user.rank} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold">
                      {user.rank}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl">
                      {user.avatar}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                        {user.name}
                      </h4>
                      <p className="text-sm text-gray-300">{user.quizzes} quizzes completed</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                        {user.score}%
                      </div>
                      <div className="text-sm text-gray-300">Average</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
