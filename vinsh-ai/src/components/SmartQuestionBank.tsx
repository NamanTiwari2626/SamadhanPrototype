import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  ArrowLeft,
  BookOpen,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Target,
  TrendingUp,
  BarChart3,
  Zap,
  Brain,
  Calculator,
  Atom,
  Globe,
  BookMarked,
  Award,
  Timer,
  RefreshCw,
  Eye,
  Book,
  FileText,
  Lightbulb,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Flag,
  Bookmark,
  Share2,
} from "lucide-react";

interface SmartQuestionBankProps {
  onBack: () => void;
}

export function SmartQuestionBank({ onBack }: SmartQuestionBankProps) {
  const [selectedTab, setSelectedTab] = useState("subjects");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);

  const subjects = [
    {
      id: "mathematics",
      name: "Mathematics",
      icon: Calculator,
      color: "from-blue-500 to-cyan-500",
      questions: 2500,
      completed: 850,
      accuracy: 78,
      topics: ["Algebra", "Calculus", "Geometry", "Trigonometry", "Statistics"]
    },
    {
      id: "physics",
      name: "Physics",
      icon: Atom,
      color: "from-purple-500 to-pink-500",
      questions: 1800,
      completed: 620,
      accuracy: 82,
      topics: ["Mechanics", "Thermodynamics", "Electromagnetism", "Optics", "Modern Physics"]
    },
    {
      id: "chemistry",
      name: "Chemistry",
      icon: Globe,
      color: "from-green-500 to-emerald-500",
      questions: 1600,
      completed: 480,
      accuracy: 75,
      topics: ["Organic", "Inorganic", "Physical", "Biochemistry", "Analytical"]
    },
    {
      id: "biology",
      name: "Biology",
      icon: BookOpen,
      color: "from-orange-500 to-red-500",
      questions: 1200,
      completed: 320,
      accuracy: 80,
      topics: ["Botany", "Zoology", "Cell Biology", "Genetics", "Ecology"]
    },
    {
      id: "english",
      name: "English",
      icon: Book,
      color: "from-indigo-500 to-purple-500",
      questions: 800,
      completed: 250,
      accuracy: 85,
      topics: ["Grammar", "Vocabulary", "Comprehension", "Literature", "Writing"]
    },
    {
      id: "general-knowledge",
      name: "General Knowledge",
      icon: Brain,
      color: "from-teal-500 to-blue-500",
      questions: 2000,
      completed: 680,
      accuracy: 72,
      topics: ["History", "Geography", "Current Affairs", "Science", "Sports"]
    }
  ];

  const difficultyLevels = [
    { id: "easy", name: "Easy", color: "text-green-400", bgColor: "bg-green-500/20" },
    { id: "medium", name: "Medium", color: "text-yellow-400", bgColor: "bg-yellow-500/20" },
    { id: "hard", name: "Hard", color: "text-red-400", bgColor: "bg-red-500/20" }
  ];

  const sampleQuestions = [
    {
      id: 1,
      question: "What is the derivative of x² + 3x + 2?",
      options: ["2x + 3", "x + 3", "2x + 2", "x² + 3"],
      correct: "2x + 3",
      explanation: "The derivative of x² is 2x, derivative of 3x is 3, and derivative of constant 2 is 0. So, d/dx(x² + 3x + 2) = 2x + 3",
      difficulty: "medium",
      subject: "mathematics",
      topic: "Calculus"
    },
    {
      id: 2,
      question: "Which of the following is not a noble gas?",
      options: ["Helium", "Neon", "Chlorine", "Argon"],
      correct: "Chlorine",
      explanation: "Noble gases are elements in group 18 of the periodic table. Chlorine is in group 17 (halogens), not group 18.",
      difficulty: "easy",
      subject: "chemistry",
      topic: "Periodic Table"
    },
    {
      id: 3,
      question: "What is the SI unit of electric current?",
      options: ["Volt", "Ampere", "Ohm", "Watt"],
      correct: "Ampere",
      explanation: "The SI unit of electric current is Ampere (A), named after André-Marie Ampère.",
      difficulty: "easy",
      subject: "physics",
      topic: "Electricity"
    }
  ];

  const userStats = {
    totalQuestions: 12000,
    completed: 3200,
    accuracy: 78,
    streak: 15,
    rank: 1250,
    points: 15800
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return (completed / total) * 100;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-400";
      case "medium": return "text-yellow-400";
      case "hard": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(to right, rgb(15, 23, 42), rgb(51, 65, 85))' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
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
                Smart Question Bank
              </h1>
              <p className="text-gray-300 mt-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                Practice with thousands of questions across all subjects
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-3 py-1">
              <BookOpen className="w-3 h-3 mr-1" />
              10,000+ Questions
            </Badge>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {userStats.completed.toLocaleString()}
            </div>
            <div className="text-sm text-gray-300">Questions Solved</div>
          </Card>
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {userStats.accuracy}%
            </div>
            <div className="text-sm text-gray-300">Accuracy</div>
          </Card>
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {userStats.streak}
            </div>
            <div className="text-sm text-gray-300">Day Streak</div>
          </Card>
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              #{userStats.rank}
            </div>
            <div className="text-sm text-gray-300">Rank</div>
          </Card>
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {userStats.points.toLocaleString()}
            </div>
            <div className="text-sm text-gray-300">Points</div>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20">
            <TabsTrigger value="subjects" className="text-white data-[state=active]:bg-white/20">
              Subjects
            </TabsTrigger>
            <TabsTrigger value="practice" className="text-white data-[state=active]:bg-white/20">
              Practice Mode
            </TabsTrigger>
            <TabsTrigger value="quiz" className="text-white data-[state=active]:bg-white/20">
              Quiz Mode
            </TabsTrigger>
          </TabsList>

          {/* Subjects Tab */}
          <TabsContent value="subjects" className="space-y-6">
            {/* Search and Filter */}
            <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search questions or topics..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyLevels.map((level) => (
                      <SelectItem key={level.id} value={level.id}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="text-white border-0 rounded-full" style={{ background: 'linear-gradient(135deg, rgb(147, 51, 234), rgb(236, 72, 153))' }}>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </Card>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <Card key={subject.id} className="bg-white/10 border-white/20 p-6 backdrop-blur-lg hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${subject.color}`}>
                      <subject.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                        {subject.name}
                      </h3>
                      <p className="text-sm text-gray-300">{subject.questions} Questions</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Progress</span>
                      <span className="text-sm text-white">{subject.completed}/{subject.questions}</span>
                    </div>
                    <Progress value={getProgressPercentage(subject.completed, subject.questions)} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Accuracy</span>
                      <span className="text-sm text-white">{subject.accuracy}%</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-white mb-2" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                      Topics Covered:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {subject.topics.slice(0, 3).map((topic, index) => (
                        <Badge key={index} className="bg-white/10 text-white border-white/20 text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {subject.topics.length > 3 && (
                        <Badge className="bg-white/10 text-white border-white/20 text-xs">
                          +{subject.topics.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button className="w-full text-white border-0 rounded-full" style={{ background: `linear-gradient(135deg, ${subject.color.split(' ')[0].replace('from-', '')}, ${subject.color.split(' ')[2].replace('to-', '')})` }}>
                    <Play className="w-4 h-4 mr-2" />
                    Start Practice
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Practice Mode Tab */}
          <TabsContent value="practice" className="space-y-6">
            <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  Practice Questions
                </h3>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    Question {currentQuestion + 1} of {sampleQuestions.length}
                  </Badge>
                </div>
              </div>

              {sampleQuestions.length > 0 && (
                <div className="space-y-6">
                  {/* Question */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className={`${getDifficultyColor(sampleQuestions[currentQuestion].difficulty)} bg-opacity-20`}>
                        {sampleQuestions[currentQuestion].difficulty.charAt(0).toUpperCase() + sampleQuestions[currentQuestion].difficulty.slice(1)}
                      </Badge>
                      <Badge className="bg-white/10 text-white border-white/20">
                        {sampleQuestions[currentQuestion].topic}
                      </Badge>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                      {sampleQuestions[currentQuestion].question}
                    </h4>
                    
                    {/* Options */}
                    <div className="space-y-3">
                      {sampleQuestions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                            selectedAnswer === option
                              ? 'border-blue-400 bg-blue-500/20 text-white'
                              : 'border-white/20 bg-white/5 text-gray-200 hover:bg-white/10'
                          }`}
                          onClick={() => setSelectedAnswer(option)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedAnswer === option ? 'border-blue-400 bg-blue-400' : 'border-white/40'
                            }`}>
                              {selectedAnswer === option && <CheckCircle className="w-4 h-4 text-white" />}
                            </div>
                            <span className="font-medium">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Answer and Explanation */}
                  {showAnswer && (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                      <h5 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                        Explanation
                      </h5>
                      <p className="text-gray-200 mb-4" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                        {sampleQuestions[currentQuestion].explanation}
                      </p>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-medium">Correct Answer: {sampleQuestions[currentQuestion].correct}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => setShowAnswer(!showAnswer)}
                      className="text-white border-0 rounded-full"
                      style={{ background: 'linear-gradient(135deg, rgb(59, 130, 246), rgb(147, 51, 234))' }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {showAnswer ? 'Hide' : 'Show'} Answer
                    </Button>
                    <Button
                      onClick={() => {
                        setCurrentQuestion((prev) => (prev + 1) % sampleQuestions.length);
                        setSelectedAnswer("");
                        setShowAnswer(false);
                      }}
                      className="text-white border-0 rounded-full"
                      style={{ background: 'linear-gradient(135deg, rgb(34, 197, 94), rgb(16, 185, 129))' }}
                    >
                      <ChevronRight className="w-4 h-4 mr-2" />
                      Next Question
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Bookmark className="w-4 h-4 mr-2" />
                      Bookmark
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      Report
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Quiz Mode Tab */}
          <TabsContent value="quiz" className="space-y-6">
            <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
              <h3 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                Quiz Mode
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-white/5 border-white/10 p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Timer className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                      Quick Quiz
                    </h4>
                    <p className="text-sm text-gray-300 mb-4">10 questions, 15 minutes</p>
                    <Button className="w-full text-white border-0 rounded-full" style={{ background: 'linear-gradient(135deg, rgb(59, 130, 246), rgb(6, 182, 212))' }}>
                      Start Quiz
                    </Button>
                  </div>
                </Card>

                <Card className="bg-white/5 border-white/10 p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                      Subject Quiz
                    </h4>
                    <p className="text-sm text-gray-300 mb-4">50 questions, 60 minutes</p>
                    <Button className="w-full text-white border-0 rounded-full" style={{ background: 'linear-gradient(135deg, rgb(147, 51, 234), rgb(236, 72, 153))' }}>
                      Start Quiz
                    </Button>
                  </div>
                </Card>

                <Card className="bg-white/5 border-white/10 p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                      Mock Test
                    </h4>
                    <p className="text-sm text-gray-300 mb-4">100 questions, 3 hours</p>
                    <Button className="w-full text-white border-0 rounded-full" style={{ background: 'linear-gradient(135deg, rgb(34, 197, 94), rgb(16, 185, 129))' }}>
                      Start Test
                    </Button>
                  </div>
                </Card>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
