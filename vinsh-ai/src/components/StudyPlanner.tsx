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
  Target,
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Flame,
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
  const [formErrors, setFormErrors] = useState<{ title?: string; description?: string; target?: string; deadline?: string }>({});
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Goal> | null>(null);
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

  // Achievements removed per request

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
    const errors: { title?: string; description?: string; target?: string; deadline?: string } = {};
    if (!newGoal.title) errors.title = "Title is required";
    if (!newGoal.description) errors.description = "Description is required";
    if (!newGoal.target || newGoal.target <= 0) errors.target = "Target must be > 0";
    if (!newGoal.deadline) errors.deadline = "Deadline is required";
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
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
      setFormErrors({});
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

  const startEditGoal = (id: string) => {
    const g = goals.find(g => g.id === id);
    if (g) {
      setEditingGoal(id);
      setEditDraft({ ...g });
    }
  };

  const applyEditGoal = () => {
    if (!editingGoal || !editDraft) return;
    setGoals(prev => prev.map(g => g.id === editingGoal ? {
      ...g,
      title: editDraft.title ?? g.title,
      description: editDraft.description ?? g.description,
      category: (editDraft.category as any) ?? g.category,
      priority: (editDraft.priority as any) ?? g.priority,
      target: editDraft.target ?? g.target,
      current: editDraft.current ?? g.current,
      unit: editDraft.unit ?? g.unit,
      deadline: editDraft.deadline ?? g.deadline,
    } : g));
    setEditingGoal(null);
    setEditDraft(null);
  };

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
          <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/20 rounded-full p-1">
            <TabsTrigger value="goals" className="text-white rounded-full px-6 py-2 data-[state=active]:bg-white/20">
              Goals
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-white rounded-full px-6 py-2 data-[state=active]:bg-white/20">
              Progress
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

            {/* Add Goal Modal (overlay) */}
            {showAddGoal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowAddGoal(false)}>
                <div className="absolute inset-0 bg-black/70" />
                <div
                  className="relative z-10 w-full max-w-2xl text-white p-6 rounded-2xl shadow-xl border border-gray-700"
                  style={{ backgroundColor: "rgb(0, 0, 0)", opacity: 1 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-2xl font-bold" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>Add New Goal</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-gray-200 mb-2 block">Goal Title</label>
                      <Input
                        value={newGoal.title}
                        onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                        placeholder="Enter goal title"
                        className="bg-black border-gray-600 text-white placeholder:text-gray-400"
                      />
                      {formErrors.title && <p className="text-xs text-red-600 mt-1">{formErrors.title}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-200 mb-2 block">Category</label>
                      <Select value={newGoal.category} onValueChange={(value) => setNewGoal({...newGoal, category: value as any})}>
                        <SelectTrigger className="bg-black border-gray-600 text-white">
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
                    <label className="text-sm font-medium text-gray-200 mb-2 block">Description</label>
                    <Input
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                      placeholder="Describe your goal"
                      className="bg-black border-gray-600 text-white placeholder:text-gray-400"
                    />
                    {formErrors.description && <p className="text-xs text-red-600 mt-1">{formErrors.description}</p>}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-gray-200 mb-2 block">Target</label>
                      <Input
                        type="number"
                        value={newGoal.target}
                        onChange={(e) => setNewGoal({...newGoal, target: parseInt(e.target.value) || 0})}
                        placeholder="Target value"
                        className="bg-black border-gray-600 text-white placeholder:text-gray-400"
                      />
                      {formErrors.target && <p className="text-xs text-red-600 mt-1">{formErrors.target}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-200 mb-2 block">Unit</label>
                      <Input
                        value={newGoal.unit}
                        onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                        placeholder="e.g., hours, problems"
                        className="bg-black border-gray-600 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-200 mb-2 block">Priority</label>
                      <Select value={newGoal.priority} onValueChange={(value) => setNewGoal({...newGoal, priority: value as any})}>
                        <SelectTrigger className="bg-black border-gray-600 text-white">
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
                      <label className="text-sm font-medium text-gray-200 mb-2 block">Deadline</label>
                      <Input
                        type="date"
                        value={newGoal.deadline}
                        onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                        className="bg-black border-gray-600 text-white"
                      />
                      {formErrors.deadline && <p className="text-xs text-red-600 mt-1">{formErrors.deadline}</p>}
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddGoal(false)}
                      className="bg-white text-black border-white hover:bg-black hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddGoal}
                      className="text-white border-0 rounded-full"
                      style={{ background: 'linear-gradient(135deg, rgb(34, 197, 94), rgb(16, 185, 129))' }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Add Goal
                    </Button>
                  </div>
                </div>
              </div>
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
                        onClick={() => startEditGoal(goal.id)}
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

        {/* Edit Goal Modal */}
        {editingGoal && editDraft && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => { setEditingGoal(null); setEditDraft(null); }}>
            <div className="absolute inset-0 bg-black/70" />
            <div
              className="relative z-10 w-full max-w-2xl text-white p-6 rounded-2xl shadow-xl border border-gray-700"
              style={{ backgroundColor: 'rgb(0, 0, 0)', opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-2xl font-bold" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>Edit Goal</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-200 mb-2 block">Title</label>
                  <Input value={editDraft.title as string} onChange={(e) => setEditDraft({ ...editDraft, title: e.target.value })} className="bg-black border-gray-600 text-white" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-200 mb-2 block">Category</label>
                  <Select value={editDraft.category as any} onValueChange={(v) => setEditDraft({ ...editDraft, category: v as any })}>
                    <SelectTrigger className="bg-black border-gray-600 text-white"><SelectValue /></SelectTrigger>
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
                <label className="text-sm font-medium text-gray-200 mb-2 block">Description</label>
                <Input value={editDraft.description as string} onChange={(e) => setEditDraft({ ...editDraft, description: e.target.value })} className="bg-black border-gray-600 text-white" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-200 mb-2 block">Target</label>
                  <Input type="number" value={editDraft.target as number} onChange={(e) => setEditDraft({ ...editDraft, target: parseInt(e.target.value) || 0 })} className="bg-black border-gray-600 text-white" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-200 mb-2 block">Current</label>
                  <Input type="number" value={editDraft.current as number} onChange={(e) => setEditDraft({ ...editDraft, current: parseInt(e.target.value) || 0 })} className="bg-black border-gray-600 text-white" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-200 mb-2 block">Unit</label>
                  <Input value={editDraft.unit as string} onChange={(e) => setEditDraft({ ...editDraft, unit: e.target.value })} className="bg-black border-gray-600 text-white" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-200 mb-2 block">Deadline</label>
                  <Input type="date" value={editDraft.deadline as string} onChange={(e) => setEditDraft({ ...editDraft, deadline: e.target.value })} className="bg-black border-gray-600 text-white" />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" className="bg-white text-black border-white hover:bg-black hover:text-white" onClick={() => { setEditingGoal(null); setEditDraft(null); }}>Cancel</Button>
                <Button className="text-white border-0 rounded-full" style={{ background: 'linear-gradient(135deg, rgb(34, 197, 94), rgb(16, 185, 129))' }} onClick={applyEditGoal}>Save Changes</Button>
              </div>
            </div>
          </div>
        )}

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

          
        </Tabs>
      </div>
    </div>
  );
}
