import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Save,
  Download,
  Share2,
  Target,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  BarChart3,
  TrendingUp,
  BookOpen,
  Brain,
  Zap,
  Timer,
  Award,
  Star,
  ChevronRight,
  ChevronLeft,
  Settings,
  Bell,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";

interface TimetableMakerProps {
  onBack: () => void;
}

interface StudySession {
  id: string;
  subject: string;
  topic: string;
  startTime: string;
  endTime: string;
  duration: number;
  priority: "high" | "medium" | "low";
  completed: boolean;
  notes?: string;
}

export function TimetableMaker({ onBack }: TimetableMakerProps) {
  const [selectedTab, setSelectedTab] = useState("create");
  const [selectedDay, setSelectedDay] = useState(0);
  const [showAddSession, setShowAddSession] = useState(false);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [newSession, setNewSession] = useState<Partial<StudySession>>({
    subject: "",
    topic: "",
    startTime: "",
    endTime: "",
    priority: "medium",
    notes: ""
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  const subjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", "English", 
    "General Knowledge", "Reasoning", "Computer Science", "History", "Geography"
  ];

  const [studySessions, setStudySessions] = useState<StudySession[]>([
    {
      id: "1",
      subject: "Mathematics",
      topic: "Calculus",
      startTime: "09:00",
      endTime: "11:00",
      duration: 120,
      priority: "high",
      completed: false,
      notes: "Focus on derivatives and integration"
    },
    {
      id: "2",
      subject: "Physics",
      topic: "Mechanics",
      startTime: "11:30",
      endTime: "13:00",
      duration: 90,
      priority: "high",
      completed: true,
      notes: "Newton's laws and motion"
    },
    {
      id: "3",
      subject: "Chemistry",
      topic: "Organic Chemistry",
      startTime: "14:00",
      endTime: "15:30",
      duration: 90,
      priority: "medium",
      completed: false,
      notes: "Reaction mechanisms"
    },
    {
      id: "4",
      subject: "English",
      topic: "Grammar",
      startTime: "16:00",
      endTime: "17:00",
      duration: 60,
      priority: "low",
      completed: false,
      notes: "Practice exercises"
    }
  ]);

  const weeklyStats = {
    totalHours: 42,
    completedHours: 28,
    subjectsCovered: 6,
    sessionsCompleted: 12,
    averageSessionLength: 90,
    productivity: 85
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400 bg-red-500/20";
      case "medium": return "text-yellow-400 bg-yellow-500/20";
      case "low": return "text-green-400 bg-green-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  const getTimeSlotColor = (hour: number) => {
    if (hour >= 6 && hour < 12) return "bg-blue-500/20 border-blue-500/30";
    if (hour >= 12 && hour < 18) return "bg-green-500/20 border-green-500/30";
    if (hour >= 18 && hour < 22) return "bg-orange-500/20 border-orange-500/30";
    return "bg-gray-500/20 border-gray-500/30";
  };

  const handleAddSession = () => {
    if (newSession.subject && newSession.topic && newSession.startTime && newSession.endTime) {
      const session: StudySession = {
        id: Date.now().toString(),
        subject: newSession.subject,
        topic: newSession.topic,
        startTime: newSession.startTime,
        endTime: newSession.endTime,
        duration: calculateDuration(newSession.startTime, newSession.endTime),
        priority: newSession.priority || "medium",
        completed: false,
        notes: newSession.notes
      };
      setStudySessions([...studySessions, session]);
      setNewSession({
        subject: "",
        topic: "",
        startTime: "",
        endTime: "",
        priority: "medium",
        notes: ""
      });
      setShowAddSession(false);
    }
  };

  const calculateDuration = (start: string, end: string) => {
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    return (endTime.getTime() - startTime.getTime()) / (1000 * 60);
  };

  const toggleSessionComplete = (id: string) => {
    setStudySessions(sessions =>
      sessions.map(session =>
        session.id === id ? { ...session, completed: !session.completed } : session
      )
    );
  };

  const deleteSession = (id: string) => {
    setStudySessions(sessions => sessions.filter(session => session.id !== id));
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
                Timetable Maker
              </h1>
              <p className="text-gray-300 mt-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                Create and manage your personalized study schedule
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1">
              <Calendar className="w-3 h-3 mr-1" />
              Smart Scheduling
            </Badge>
          </div>
        </div>

        {/* Weekly Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {weeklyStats.totalHours}h
            </div>
            <div className="text-sm text-gray-300">Total Hours</div>
          </Card>
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {weeklyStats.completedHours}h
            </div>
            <div className="text-sm text-gray-300">Completed</div>
          </Card>
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {weeklyStats.subjectsCovered}
            </div>
            <div className="text-sm text-gray-300">Subjects</div>
          </Card>
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {weeklyStats.sessionsCompleted}
            </div>
            <div className="text-sm text-gray-300">Sessions</div>
          </Card>
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {weeklyStats.averageSessionLength}m
            </div>
            <div className="text-sm text-gray-300">Avg. Length</div>
          </Card>
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {weeklyStats.productivity}%
            </div>
            <div className="text-sm text-gray-300">Productivity</div>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 border-white/20">
            <TabsTrigger value="create" className="text-white data-[state=active]:bg-white/20">
              Create
            </TabsTrigger>
            <TabsTrigger value="view" className="text-white data-[state=active]:bg-white/20">
              View
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-white/20">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="templates" className="text-white data-[state=active]:bg-white/20">
              Templates
            </TabsTrigger>
          </TabsList>

          {/* Create Tab */}
          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add Session Form */}
              <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  Add Study Session
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Subject</label>
                    <Select value={newSession.subject} onValueChange={(value) => setNewSession({...newSession, subject: value})}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Topic</label>
                    <Input
                      value={newSession.topic}
                      onChange={(e) => setNewSession({...newSession, topic: e.target.value})}
                      placeholder="Enter topic"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Start Time</label>
                      <Input
                        type="time"
                        value={newSession.startTime}
                        onChange={(e) => setNewSession({...newSession, startTime: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">End Time</label>
                      <Input
                        type="time"
                        value={newSession.endTime}
                        onChange={(e) => setNewSession({...newSession, endTime: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Priority</label>
                    <Select value={newSession.priority} onValueChange={(value) => setNewSession({...newSession, priority: value as "high" | "medium" | "low"})}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Notes (Optional)</label>
                    <Input
                      value={newSession.notes}
                      onChange={(e) => setNewSession({...newSession, notes: e.target.value})}
                      placeholder="Add notes..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>

                  <Button
                    onClick={handleAddSession}
                    className="w-full text-white border-0 rounded-full"
                    style={{ background: 'linear-gradient(135deg, rgb(34, 197, 94), rgb(16, 185, 129))' }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Session
                  </Button>
                </div>
              </Card>

              {/* Current Sessions */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                    Today's Sessions
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {studySessions.map((session) => (
                    <Card key={session.id} className="bg-white/10 border-white/20 p-4 backdrop-blur-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={session.completed}
                            onCheckedChange={() => toggleSessionComplete(session.id)}
                            className="border-white/40"
                          />
                          <div>
                            <h4 className="text-lg font-semibold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                              {session.subject}
                            </h4>
                            <p className="text-sm text-gray-300">{session.topic}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-400">
                                {session.startTime} - {session.endTime} ({session.duration} min)
                              </span>
                              <Badge className={`text-xs ${getPriorityColor(session.priority)}`}>
                                {session.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/10"
                            onClick={() => setEditingSession(session.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:bg-red-500/20"
                            onClick={() => deleteSession(session.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {session.notes && (
                        <div className="mt-3 p-2 bg-white/5 rounded border border-white/10">
                          <p className="text-sm text-gray-300">{session.notes}</p>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* View Tab */}
          <TabsContent value="view" className="space-y-6">
            <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  Weekly View
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-white font-medium">Week of Dec 16, 2024</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Weekly Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {days.map((day, index) => (
                  <div key={day} className="text-center">
                    <div className={`p-2 rounded-lg ${
                      index === selectedDay ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-white/5'
                    }`}>
                      <div className="text-sm font-medium text-white">{day.slice(0, 3)}</div>
                      <div className="text-xs text-gray-400">{16 + index}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                {Array.from({ length: 16 }, (_, i) => {
                  const hour = i + 6;
                  const timeString = `${hour.toString().padStart(2, '0')}:00`;
                  const sessions = studySessions.filter(s => 
                    parseInt(s.startTime.split(':')[0]) === hour
                  );
                  
                  return (
                    <div key={hour} className="flex items-center gap-4">
                      <div className="w-16 text-sm text-gray-400 font-mono">
                        {timeString}
                      </div>
                      <div className={`flex-1 p-3 rounded-lg border ${getTimeSlotColor(hour)}`}>
                        {sessions.length > 0 ? (
                          <div className="space-y-2">
                            {sessions.map((session) => (
                              <div key={session.id} className="flex items-center justify-between">
                                <div>
                                  <span className="text-white font-medium">{session.subject}</span>
                                  <span className="text-gray-300 ml-2">- {session.topic}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={`text-xs ${getPriorityColor(session.priority)}`}>
                                    {session.priority}
                                  </Badge>
                                  {session.completed && <CheckCircle className="w-4 h-4 text-green-400" />}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm">No sessions scheduled</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  Study Time Distribution
                </h3>
                <div className="space-y-3">
                  {subjects.slice(0, 5).map((subject, index) => {
                    const hours = Math.floor(Math.random() * 10) + 1;
                    return (
                      <div key={subject}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-300">{subject}</span>
                          <span className="text-sm text-white">{hours}h</span>
                        </div>
                        <Progress value={hours * 10} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  Productivity Trends
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">This Week</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">+12%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Last Week</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">+8%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">This Month</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">+25%</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  Goals & Achievements
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Daily Goal</span>
                    <span className="text-sm text-white">8h / 10h</span>
                  </div>
                  <Progress value={80} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Weekly Goal</span>
                    <span className="text-sm text-white">42h / 50h</span>
                  </div>
                  <Progress value={84} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Streak</span>
                    <span className="text-sm text-white">15 days</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                    JEE Main Preparation
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">8 hours daily, 6 subjects</p>
                  <Button className="w-full text-white border-0 rounded-full" style={{ background: 'linear-gradient(135deg, rgb(59, 130, 246), rgb(6, 182, 212))' }}>
                    Use Template
                  </Button>
                </div>
              </Card>

              <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                    NEET Preparation
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">10 hours daily, 3 subjects</p>
                  <Button className="w-full text-white border-0 rounded-full" style={{ background: 'linear-gradient(135deg, rgb(147, 51, 234), rgb(236, 72, 153))' }}>
                    Use Template
                  </Button>
                </div>
              </Card>

              <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                    UPSC Preparation
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">12 hours daily, all subjects</p>
                  <Button className="w-full text-white border-0 rounded-full" style={{ background: 'linear-gradient(135deg, rgb(34, 197, 94), rgb(16, 185, 129))' }}>
                    Use Template
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
