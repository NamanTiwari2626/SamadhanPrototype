import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import {
  ArrowLeft,
  FileText,
  BookOpen,
  Search,
  Filter,
  CheckCircle,
  Circle,
  Clock,
  Target,
  TrendingUp,
  BarChart3,
  BookMarked,
  Download,
  Share2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  Star,
  Award,
  Trophy,
  Calendar,
  Users,
  Book,
  Brain,
  Zap,
  Lightbulb,
  AlertCircle,
  Info,
  CheckSquare,
  Square,
  Play,
  Pause,
  RotateCcw,
  Flag,
  Bookmark,
  Settings,
  RefreshCw,
  Copy,
} from "lucide-react";

interface SyllabusProps {
  onBack: () => void;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  estimatedTime: number; // in hours
  difficulty: "easy" | "medium" | "hard";
  resources: string[];
  subtopics?: Topic[];
}

interface Subject {
  id: string;
  name: string;
  icon: any;
  color: string;
  totalTopics: number;
  completedTopics: number;
  estimatedTime: number;
  topics: Topic[];
}

interface Exam {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  duration: string;
  subjects: number;
  totalTopics: number;
  lastUpdated: string;
  subjects: Subject[];
}

export function Syllabus({ onBack }: SyllabusProps) {
  const [selectedTab, setSelectedTab] = useState("exams");
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [showCompleted, setShowCompleted] = useState(true);

  const exams: Exam[] = [
    {
      id: "jee-main",
      name: "JEE Main",
      description: "Joint Entrance Examination for Engineering",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      duration: "3 hours",
      subjects: 3,
      totalTopics: 45,
      lastUpdated: "2024-12-01",
      subjects: [
        {
          id: "math",
          name: "Mathematics",
          icon: BookOpen,
          color: "from-blue-500 to-cyan-500",
          totalTopics: 15,
          completedTopics: 8,
          estimatedTime: 120,
          topics: [
            {
              id: "algebra",
              title: "Algebra",
              description: "Quadratic equations, sequences, series, complex numbers",
              completed: true,
              estimatedTime: 20,
              difficulty: "medium",
              resources: ["Textbook Chapter 1", "Video Lectures", "Practice Problems"],
              subtopics: [
                {
                  id: "quadratic",
                  title: "Quadratic Equations",
                  description: "Solving quadratic equations and their properties",
                  completed: true,
                  estimatedTime: 8,
                  difficulty: "easy",
                  resources: ["Video 1", "Practice Set 1"]
                },
                {
                  id: "sequences",
                  title: "Sequences and Series",
                  description: "Arithmetic and geometric progressions",
                  completed: false,
                  estimatedTime: 12,
                  difficulty: "medium",
                  resources: ["Video 2", "Practice Set 2"]
                }
              ]
            },
            {
              id: "calculus",
              title: "Calculus",
              description: "Limits, derivatives, integrals, and applications",
              completed: false,
              estimatedTime: 25,
              difficulty: "hard",
              resources: ["Textbook Chapter 2", "Video Lectures", "Practice Problems"],
              subtopics: [
                {
                  id: "limits",
                  title: "Limits and Continuity",
                  description: "Understanding limits and continuity concepts",
                  completed: false,
                  estimatedTime: 10,
                  difficulty: "medium",
                  resources: ["Video 3", "Practice Set 3"]
                },
                {
                  id: "derivatives",
                  title: "Derivatives",
                  description: "Differentiation rules and applications",
                  completed: false,
                  estimatedTime: 15,
                  difficulty: "hard",
                  resources: ["Video 4", "Practice Set 4"]
                }
              ]
            }
          ]
        },
        {
          id: "physics",
          name: "Physics",
          icon: BookOpen,
          color: "from-purple-500 to-pink-500",
          totalTopics: 15,
          completedTopics: 5,
          estimatedTime: 100,
          topics: [
            {
              id: "mechanics",
              title: "Mechanics",
              description: "Motion, forces, energy, and momentum",
              completed: true,
              estimatedTime: 30,
              difficulty: "medium",
              resources: ["Textbook Chapter 1", "Video Lectures", "Practice Problems"]
            },
            {
              id: "thermodynamics",
              title: "Thermodynamics",
              description: "Heat, temperature, and thermodynamic processes",
              completed: false,
              estimatedTime: 20,
              difficulty: "hard",
              resources: ["Textbook Chapter 2", "Video Lectures", "Practice Problems"]
            }
          ]
        },
        {
          id: "chemistry",
          name: "Chemistry",
          icon: BookOpen,
          color: "from-green-500 to-emerald-500",
          totalTopics: 15,
          completedTopics: 3,
          estimatedTime: 80,
          topics: [
            {
              id: "organic",
              title: "Organic Chemistry",
              description: "Carbon compounds, reactions, and mechanisms",
              completed: false,
              estimatedTime: 25,
              difficulty: "hard",
              resources: ["Textbook Chapter 1", "Video Lectures", "Practice Problems"]
            },
            {
              id: "inorganic",
              title: "Inorganic Chemistry",
              description: "Elements, compounds, and their properties",
              completed: true,
              estimatedTime: 20,
              difficulty: "medium",
              resources: ["Textbook Chapter 2", "Video Lectures", "Practice Problems"]
            }
          ]
        }
      ]
    },
    {
      id: "neet",
      name: "NEET",
      description: "National Eligibility cum Entrance Test",
      icon: BookOpen,
      color: "from-red-500 to-pink-500",
      duration: "3 hours",
      subjects: 3,
      totalTopics: 40,
      lastUpdated: "2024-12-01",
      subjects: [
        {
          id: "physics",
          name: "Physics",
          icon: BookOpen,
          color: "from-purple-500 to-pink-500",
          totalTopics: 12,
          completedTopics: 4,
          estimatedTime: 80,
          topics: []
        },
        {
          id: "chemistry",
          name: "Chemistry",
          icon: BookOpen,
          color: "from-green-500 to-emerald-500",
          totalTopics: 14,
          completedTopics: 6,
          estimatedTime: 70,
          topics: []
        },
        {
          id: "biology",
          name: "Biology",
          icon: BookOpen,
          color: "from-orange-500 to-red-500",
          totalTopics: 14,
          completedTopics: 8,
          estimatedTime: 90,
          topics: []
        }
      ]
    },
    {
      id: "upsc",
      name: "UPSC CSE",
      description: "Union Public Service Commission Civil Services Examination",
      icon: BookOpen,
      color: "from-indigo-500 to-purple-500",
      duration: "3 hours",
      subjects: 5,
      totalTopics: 60,
      lastUpdated: "2024-12-01",
      subjects: [
        {
          id: "gs",
          name: "General Studies",
          icon: BookOpen,
          color: "from-indigo-500 to-purple-500",
          totalTopics: 20,
          completedTopics: 5,
          estimatedTime: 120,
          topics: []
        },
        {
          id: "history",
          name: "History",
          icon: BookOpen,
          color: "from-yellow-500 to-orange-500",
          totalTopics: 15,
          completedTopics: 3,
          estimatedTime: 80,
          topics: []
        },
        {
          id: "geography",
          name: "Geography",
          icon: BookOpen,
          color: "from-teal-500 to-blue-500",
          totalTopics: 15,
          completedTopics: 2,
          estimatedTime: 70,
          topics: []
        },
        {
          id: "polity",
          name: "Polity",
          icon: BookOpen,
          color: "from-pink-500 to-rose-500",
          totalTopics: 10,
          completedTopics: 1,
          estimatedTime: 50,
          topics: []
        }
      ]
    }
  ];

  const userStats = {
    totalTopics: 145,
    completedTopics: 35,
    inProgressTopics: 12,
    remainingTopics: 98,
    completionRate: 24,
    studyHours: 180,
    currentStreak: 8,
    level: 5
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-400 bg-green-500/20";
      case "medium": return "text-yellow-400 bg-yellow-500/20";
      case "hard": return "text-red-400 bg-red-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  const toggleTopicComplete = (examId: string, subjectId: string, topicId: string) => {
    // This would update the completion status in a real app
    console.log(`Toggle topic ${topicId} in ${subjectId} of ${examId}`);
  };

  const toggleTopicExpansion = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return (completed / total) * 100;
  };

  const filteredExams = exams.filter(exam =>
    exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exam.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedExamData = exams.find(exam => exam.id === selectedExam);

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
                Syllabus & Curriculum
              </h1>
              <p className="text-gray-300 mt-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                Comprehensive syllabus coverage for all major competitive exams
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30 px-3 py-1">
              <FileText className="w-3 h-3 mr-1" />
              All Major Exams
            </Badge>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {userStats.totalTopics}
            </div>
            <div className="text-sm text-gray-300">Total Topics</div>
          </Card>
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {userStats.completedTopics}
            </div>
            <div className="text-sm text-gray-300">Completed</div>
          </Card>
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {userStats.inProgressTopics}
            </div>
            <div className="text-sm text-gray-300">In Progress</div>
          </Card>
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {userStats.completionRate}%
            </div>
            <div className="text-sm text-gray-300">Completion Rate</div>
          </Card>
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {userStats.studyHours}h
            </div>
            <div className="text-sm text-gray-300">Study Hours</div>
          </Card>
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              Level {userStats.level}
            </div>
            <div className="text-sm text-gray-300">Current Level</div>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20">
            <TabsTrigger value="exams" className="text-white data-[state=active]:bg-white/20">
              Exams
            </TabsTrigger>
            <TabsTrigger value="subjects" className="text-white data-[state=active]:bg-white/20">
              Subjects
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-white data-[state=active]:bg-white/20">
              Progress
            </TabsTrigger>
          </TabsList>

          {/* Exams Tab */}
          <TabsContent value="exams" className="space-y-6">
            {/* Search and Filter */}
            <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search exams or subjects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={showCompleted}
                    onCheckedChange={setShowCompleted}
                    className="border-white/40"
                  />
                  <label className="text-sm text-gray-300">Show completed topics</label>
                </div>
              </div>
            </Card>

            {/* Exams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExams.map((exam) => (
                <Card key={exam.id} className="bg-white/10 border-white/20 p-6 backdrop-blur-lg hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${exam.color}`}>
                      <exam.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                        {exam.name}
                      </h3>
                      <p className="text-sm text-gray-300">{exam.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Duration</span>
                      <span className="text-sm text-white">{exam.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Subjects</span>
                      <span className="text-sm text-white">{exam.subjects}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Total Topics</span>
                      <span className="text-sm text-white">{exam.totalTopics}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Last Updated</span>
                      <span className="text-sm text-white">{exam.lastUpdated}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setSelectedExam(exam.id)}
                    className="w-full text-white border-0 rounded-full"
                    style={{ background: `linear-gradient(135deg, ${exam.color.split(' ')[0].replace('from-', '')}, ${exam.color.split(' ')[2].replace('to-', '')})` }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Syllabus
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Subjects Tab */}
          <TabsContent value="subjects" className="space-y-6">
            {selectedExamData ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                    {selectedExamData.name} - Subjects
                  </h3>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedExam(null)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Exams
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedExamData.subjects.map((subject) => (
                    <Card key={subject.id} className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${subject.color}`}>
                          <subject.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                            {subject.name}
                          </h4>
                          <p className="text-sm text-gray-300">{subject.totalTopics} topics</p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Progress</span>
                          <span className="text-sm text-white">
                            {subject.completedTopics}/{subject.totalTopics}
                          </span>
                        </div>
                        <Progress value={getProgressPercentage(subject.completedTopics, subject.totalTopics)} className="h-2" />
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Estimated Time</span>
                          <span className="text-sm text-white">{subject.estimatedTime}h</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => setSelectedSubject(subject.id)}
                        className="w-full text-white border-0 rounded-full"
                        style={{ background: `linear-gradient(135deg, ${subject.color.split(' ')[0].replace('from-', '')}, ${subject.color.split(' ')[2].replace('to-', '')})` }}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        View Topics
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  Select an Exam
                </h3>
                <p className="text-gray-300 mb-6">
                  Choose an exam to view its subjects and syllabus
                </p>
                <Button
                  onClick={() => setSelectedTab("exams")}
                  className="text-white border-0 rounded-full"
                  style={{ background: 'linear-gradient(135deg, rgb(99, 102, 241), rgb(139, 92, 246))' }}
                >
                  Browse Exams
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  Overall Progress
                </h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                      {userStats.completionRate}%
                    </div>
                    <Progress value={userStats.completionRate} className="h-3" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-white">{userStats.completedTopics}</div>
                      <div className="text-sm text-gray-300">Completed</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">{userStats.remainingTopics}</div>
                      <div className="text-sm text-gray-300">Remaining</div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  Study Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Total Study Hours</span>
                    <span className="text-sm text-white">{userStats.studyHours}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Current Streak</span>
                    <span className="text-sm text-white">{userStats.currentStreak} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Level</span>
                    <span className="text-sm text-white">{userStats.level}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">In Progress</span>
                    <span className="text-sm text-white">{userStats.inProgressTopics}</span>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Completed Algebra topic</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Started Calculus chapter</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-300">Set daily study goal</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Trophy className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-300">Earned "Math Master" badge</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Subject-wise Progress */}
            <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
              <h3 className="text-xl font-bold text-white mb-6" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                Subject-wise Progress
              </h3>
              <div className="space-y-4">
                {exams.slice(0, 2).map((exam) => (
                  <div key={exam.id}>
                    <h4 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                      {exam.name}
                    </h4>
                    <div className="space-y-3">
                      {exam.subjects.map((subject) => (
                        <div key={subject.id} className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">{subject.name}</span>
                          <div className="flex items-center gap-3">
                            <Progress value={getProgressPercentage(subject.completedTopics, subject.totalTopics)} className="w-32 h-2" />
                            <span className="text-sm text-white w-12 text-right">
                              {Math.round(getProgressPercentage(subject.completedTopics, subject.totalTopics))}%
                            </span>
                          </div>
                        </div>
                      ))}
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
