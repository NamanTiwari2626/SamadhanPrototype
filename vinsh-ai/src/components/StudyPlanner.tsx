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
  Target,
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Star,
  Award,
  TrendingUp,
  BarChart3,
  BookOpen,
  Brain,
  Zap,
  Flame,
  Trophy,
  Users,
  BookMarked,
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  Settings,
  Bell,
  RefreshCw,
  Eye,
  EyeOff,
  Play,
  Pause,
  RotateCcw,
  Flag,
  Share2,
  Download,
} from "lucide-react";

interface StudyPlannerProps {
  onBack: () => void;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: "daily" | "weekly" | "monthly" | "long-term";
  priority: "high" | "medium" | "low";
  target: number;
  current: number;
  unit: string;
  deadline: string;
  completed: boolean;
  createdAt: string;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  targetDate: string;
}

export function StudyPlanner({ onBack }: StudyPlannerProps) {
  const [selectedTab, setSelectedTab] = useState("goals");
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    title: "",
    description: "",
    category: "daily",
    priority: "medium",
    target: 0,
    current: 0,
    unit: "",
    deadline: "",
    milestones: []
  });

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Complete Mathematics Chapter 5",
      description: "Finish all exercises and practice problems in Calculus chapter",
      category: "weekly",
      priority: "high",
      target: 100,
      current: 75,
      unit: "problems",
      deadline: "2024-12-22",
      completed: false,
      createdAt: "2024-12-15",
      milestones: [
        { id: "1-1", title: "Read theory", completed: true, targetDate: "2024-12-16" },
        { id: "1-2", title: "Solve basic problems", completed: true, targetDate: "2024-12-17" },
        { id: "1-3", title: "Solve advanced problems", completed: false, targetDate: "2024-12-20" },
        { id: "1-4", title: "Take practice test", completed: false, targetDate: "2024-12-22" }
      ]
    },
    {
      id: "2",
      title: "Improve Physics Accuracy",
      description: "Achieve 90% accuracy in Physics practice tests",
      category: "monthly",
      priority: "high",
      target: 90,
      current: 78,
      unit: "%",
      deadline: "2024-12-31",
      completed: false,
      createdAt: "2024-12-01",
      milestones: [
        { id: "2-1", title: "Identify weak areas", completed: true, targetDate: "2024-12-05" },
        { id: "2-2", title: "Practice weak topics", completed: true, targetDate: "2024-12-15" },
        { id: "2-3", title: "Take mock tests", completed: false, targetDate: "2024-12-25" },
        { id: "2-4", title: "Achieve target accuracy", completed: false, targetDate: "2024-12-31" }
      ]
    },
    {
      id: "3",
      title: "Daily Study Hours",
      description: "Study for 8 hours every day",
      category: "daily",
      priority: "medium",
      target: 8,
      current: 6.5,
      unit: "hours",
      deadline: "2024-12-31",
      completed: false,
      createdAt: "2024-12-01",
      milestones: [
        { id: "3-1", title: "Morning session (3h)", completed: true, targetDate: "2024-12-16" },
        { id: "3-2", title: "Afternoon session (3h)", completed: true, targetDate: "2024-12-16" },
        { id: "3-3", title: "Evening session (2h)", completed: false, targetDate: "2024-12-16" }
      ]
    }
  ]);

  const userStats = {
    totalGoals: 12,
    completedGoals: 8,
    activeGoals: 4,
    completionRate: 67,
    streak: 15,
    points: 2450,
    level: 8,
    nextLevelPoints: 3000
  };

  const achievements = [
    {
      id: 1,
      title: "Goal Crusher",
      description: "Complete 10 goals",
      icon: Trophy,
      color: "from-yellow-400 to-orange-500",
      unlocked: true,
      progress: 8,
      target: 10
    },
    {
      id: 2,
      title: "Streak Master",
      description: "Maintain 30-day streak",
      icon: Flame,
      color: "from-red-400 to-pink-500",
      unlocked: false,
      progress: 15,
      target: 30
    },
    {
      id: 3,
      title: "High Achiever",
      description: "Complete 5 high-priority goals",
      icon: Star,
      color: "from-purple-400 to-indigo-500",
      unlocked: true,
      progress: 5,
      target: 5
    },
    {
      id: 4,
      title: "Consistent Learner",
      description: "Study 7 days in a row",
      icon: Calendar,
      color: "from-green-400 to-emerald-500",
      unlocked: true,
      progress: 7,
      target: 7
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400 bg-red-500/20";
      case "medium": return "text-yellow-400 bg-yellow-500/20";
      case "low": return "text-green-400 bg-green-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "daily": return "from-blue-500 to-cyan-500";
      case "weekly": return "from-purple-500 to-pink-500";
      case "monthly": return "from-green-500 to-emerald-500";
      case "long-term": return "from-orange-500 to-red-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.description && newGoal.target && newGoal.deadline) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category || "daily",
        priority: newGoal.priority || "medium",
        target: newGoal.target,
        current: newGoal.current || 0,
        unit: newGoal.unit || "",
        deadline: newGoal.deadline,
        completed: false,
        createdAt: new Date().toISOString().split('T')[0],
        milestones: newGoal.milestones || []
      };
      setGoals([...goals, goal]);
      setNewGoal({
        title: "",
        description: "",
        category: "daily",
        priority: "medium",
        target: 0,
        current: 0,
        unit: "",
        deadline: "",
        milestones: []
      });
      setShowAddGoal(false);
    }
  };

  const toggleGoalComplete = (id: string) => {
    setGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const toggleMilestoneComplete = (goalId: string, milestoneId: string) => {
    setGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === goalId
          ? {
              ...goal,
              milestones: goal.milestones.map(milestone =>
                milestone.id === milestoneId
                  ? { ...milestone, completed: !milestone.completed }
                  : milestone
              )
            }
          : goal
      )
    );
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
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
                Study Planner
              </h1>
              <p className="text-gray-300 mt-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                Set goals, track progress, and achieve your study targets
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 px-3 py-1">
              <Target className="w-3 h-3 mr-1" />
              Goal Tracking
            </Badge>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {userStats.totalGoals}
            </div>
            <div className="text-sm text-gray-300">Total Goals</div>
          </Card>
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {userStats.completedGoals}
            </div>
            <div className="text-sm text-gray-300">Completed</div>
          </Card>
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {userStats.activeGoals}
            </div>
            <div className="text-sm text-gray-300">Active</div>
          </Card>
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {userStats.completionRate}%
            </div>
            <div className="text-sm text-gray-300">Success Rate</div>
          </Card>
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              {userStats.streak}
            </div>
            <div className="text-sm text-gray-300">Day Streak</div>
          </Card>
          <Card className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              Level {userStats.level}
            </div>
            <div className="text-sm text-gray-300">Current Level</div>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 border-white/20">
            <TabsTrigger value="goals" className="text-white data-[state=active]:bg-white/20">
              Goals
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-white data-[state=active]:bg-white/20">
              Progress
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-white data-[state=active]:bg-white/20">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-white/20">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                My Goals
              </h3>
              <Button
                onClick={() => setShowAddGoal(true)}
                className="text-white border-0 rounded-full"
                style={{ background: 'linear-gradient(135deg, rgb(34, 197, 94), rgb(16, 185, 129))' }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </div>

            {/* Add Goal Modal */}
            {showAddGoal && (
              <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                <h4 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  Add New Goal
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Goal Title</label>
                    <Input
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                      placeholder="Enter goal title"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Category</label>
                    <Select value={newGoal.category} onValueChange={(value) => setNewGoal({...newGoal, category: value as any})}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="long-term">Long-term</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Description</label>
                  <Input
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    placeholder="Describe your goal"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Target</label>
                    <Input
                      type="number"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({...newGoal, target: parseInt(e.target.value) || 0})}
                      placeholder="Target value"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Unit</label>
                    <Input
                      value={newGoal.unit}
                      onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                      placeholder="e.g., hours, problems"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Priority</label>
                    <Select value={newGoal.priority} onValueChange={(value) => setNewGoal({...newGoal, priority: value as any})}>
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
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Deadline</label>
                    <Input
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddGoal}
                    className="text-white border-0 rounded-full"
                    style={{ background: 'linear-gradient(135deg, rgb(34, 197, 94), rgb(16, 185, 129))' }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Add Goal
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddGoal(false)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            )}

            {/* Goals List */}
            <div className="space-y-4">
              {goals.map((goal) => (
                <Card key={goal.id} className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={goal.completed}
                        onCheckedChange={() => toggleGoalComplete(goal.id)}
                        className="border-white/40 mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                            {goal.title}
                          </h4>
                          <Badge className={`text-xs ${getPriorityColor(goal.priority)}`}>
                            {goal.priority}
                          </Badge>
                          <Badge className="text-xs bg-white/10 text-white border-white/20">
                            {goal.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-300 mb-3">{goal.description}</p>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-300">
                              {goal.current} / {goal.target} {goal.unit}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-300">
                              Due: {new Date(goal.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-300">Progress</span>
                            <span className="text-sm text-white">
                              {Math.round(getProgressPercentage(goal.current, goal.target))}%
                            </span>
                          </div>
                          <Progress value={getProgressPercentage(goal.current, goal.target)} className="h-2" />
                        </div>

                        {/* Milestones */}
                        <div className="space-y-2">
                          <h5 className="text-sm font-semibold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                            Milestones:
                          </h5>
                          {goal.milestones.map((milestone) => (
                            <div key={milestone.id} className="flex items-center gap-2">
                              <Checkbox
                                checked={milestone.completed}
                                onCheckedChange={() => toggleMilestoneComplete(goal.id, milestone.id)}
                                className="border-white/40"
                              />
                              <span className={`text-sm ${milestone.completed ? 'text-gray-400 line-through' : 'text-gray-300'}`}>
                                {milestone.title}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({new Date(milestone.targetDate).toLocaleDateString()})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/10"
                        onClick={() => setEditingGoal(goal.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:bg-red-500/20"
                        onClick={() => deleteGoal(goal.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  Weekly Progress
                </h3>
                <div className="space-y-3">
                  {goals.slice(0, 3).map((goal) => (
                    <div key={goal.id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-300">{goal.title}</span>
                        <span className="text-sm text-white">
                          {Math.round(getProgressPercentage(goal.current, goal.target))}%
                        </span>
                      </div>
                      <Progress value={getProgressPercentage(goal.current, goal.target)} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  Level Progress
                </h3>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                    Level {userStats.level}
                  </div>
                  <div className="text-sm text-gray-300">
                    {userStats.points} / {userStats.nextLevelPoints} points
                  </div>
                </div>
                <Progress value={(userStats.points / userStats.nextLevelPoints) * 100} className="h-3" />
                <div className="text-center mt-2">
                  <span className="text-sm text-gray-300">
                    {userStats.nextLevelPoints - userStats.points} points to next level
                  </span>
                </div>
              </Card>

              <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  Streak & Consistency
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Current Streak</span>
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <span className="text-sm text-white">{userStats.streak} days</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Completion Rate</span>
                    <span className="text-sm text-white">{userStats.completionRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Active Goals</span>
                    <span className="text-sm text-white">{userStats.activeGoals}</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              Achievements & Badges
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={`bg-white/10 border-white/20 p-6 backdrop-blur-lg ${
                  achievement.unlocked ? 'ring-2 ring-yellow-400/50' : ''
                }`}>
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center ${
                      !achievement.unlocked ? 'opacity-50' : ''
                    }`}>
                      <achievement.icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-gray-300 mb-3">{achievement.description}</p>
                    
                    {achievement.unlocked ? (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Unlocked
                      </Badge>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-300">Progress</span>
                          <span className="text-white">{achievement.progress}/{achievement.target}</span>
                        </div>
                        <Progress value={(achievement.progress / achievement.target) * 100} className="h-2" />
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  Goal Categories
                </h3>
                <div className="space-y-3">
                  {['daily', 'weekly', 'monthly', 'long-term'].map((category) => {
                    const count = goals.filter(g => g.category === category).length;
                    const completed = goals.filter(g => g.category === category && g.completed).length;
                    return (
                      <div key={category}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-300 capitalize">{category}</span>
                          <span className="text-sm text-white">{completed}/{count}</span>
                        </div>
                        <Progress value={count > 0 ? (completed / count) * 100 : 0} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  Priority Distribution
                </h3>
                <div className="space-y-3">
                  {['high', 'medium', 'low'].map((priority) => {
                    const count = goals.filter(g => g.priority === priority).length;
                    const completed = goals.filter(g => g.priority === priority && g.completed).length;
                    return (
                      <div key={priority}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-300 capitalize">{priority}</span>
                          <span className="text-sm text-white">{completed}/{count}</span>
                        </div>
                        <Progress value={count > 0 ? (completed / count) * 100 : 0} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Completed "Daily Study Hours" goal</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-300">Earned "Goal Crusher" achievement</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Created new weekly goal</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-gray-300">Extended streak to 15 days</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
