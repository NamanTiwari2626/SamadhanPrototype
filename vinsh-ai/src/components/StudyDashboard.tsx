import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Users,
  BookOpen,
  Calendar,
  Target,
  GraduationCap,
  FileText,
  ArrowLeft,
  Brain,
  Clock,
  Trophy,
  Star,
  TrendingUp,
  CheckCircle,
  BookMarked,
  BarChart3,
  Lightbulb,
  Timer,
  Award,
  Zap,
  Flame,
} from "lucide-react";

interface StudyDashboardProps {
  onBack: () => void;
  onNavigate: (section: string) => void;
}

export function StudyDashboard({ onBack, onNavigate }: StudyDashboardProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const sections = [
    {
      id: "counseling",
      title: "Counseling",
      description: "Get personalized career guidance and exam preparation advice",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      stats: "500+ Students Helped",
      features: ["Career Assessment", "Exam Strategy", "Motivation Support"]
    },
    {
      id: "question-bank",
      title: "Smart Question Bank",
      description: "Access thousands of practice questions across all subjects",
      icon: BookOpen,
      color: "from-purple-500 to-pink-500",
      stats: "10,000+ Questions",
      features: ["Subject-wise Practice", "Difficulty Levels", "Detailed Solutions"]
    },
    {
      id: "timetable",
      title: "Timetable Maker",
      description: "Create personalized study schedules and manage your time",
      icon: Calendar,
      color: "from-green-500 to-emerald-500",
      stats: "Smart Scheduling",
      features: ["Custom Schedules", "Time Management", "Progress Tracking"]
    },
    {
      id: "study-planner",
      title: "Study Planner",
      description: "Plan your study goals and track your preparation progress",
      icon: Target,
      color: "from-orange-500 to-red-500",
      stats: "Goal Tracking",
      features: ["Goal Setting", "Progress Analytics", "Milestone Rewards"]
    },
    {
      id: "quizzes",
      title: "Quizzes",
      description: "Take practice tests and mock exams to assess your preparation",
      icon: GraduationCap,
      color: "from-indigo-500 to-purple-500",
      stats: "50+ Mock Tests",
      features: ["Mock Exams", "Instant Results", "Performance Analysis"]
    },
    {
      id: "syllabus",
      title: "Syllabus",
      description: "Comprehensive syllabus coverage for all major competitive exams",
      icon: FileText,
      color: "from-teal-500 to-blue-500",
      stats: "All Major Exams",
      features: ["Complete Syllabus", "Topic-wise Coverage", "Exam Updates"]
    }
  ];

  const quickStats = [
    { label: "Active Students", value: "2,500+", icon: Users, color: "text-blue-400" },
    { label: "Questions Solved", value: "1M+", icon: BookOpen, color: "text-purple-400" },
    { label: "Success Rate", value: "85%", icon: Trophy, color: "text-yellow-400" },
    { label: "Study Hours", value: "50K+", icon: Clock, color: "text-green-400" }
  ];

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
                Study Dashboard
              </h1>
              <p className="text-gray-300 mt-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                Your comprehensive exam preparation hub
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1">
              <Flame className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="bg-white/10 border-white/20 p-4 text-center backdrop-blur-lg">
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-300" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                {stat.label}
              </div>
            </Card>
          ))}
        </div>

        {/* Main Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Card
              key={section.id}
              className={`relative overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                hoveredCard === section.id ? 'shadow-2xl' : 'shadow-lg'
              }`}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              onMouseEnter={() => setHoveredCard(section.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => onNavigate(section.id)}
            >
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-10`}></div>
              
              <div className="relative p-6">
                {/* Icon and Title */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${section.color} shadow-lg`}>
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-300" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                      {section.stats}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-200 mb-4 text-sm leading-relaxed" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  {section.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  {section.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-xs text-gray-300" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <Button
                  className="w-full text-white border-0 rounded-full shadow-lg hover:opacity-90 transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${section.color.split(' ')[0].replace('from-', '')}, ${section.color.split(' ')[2].replace('to-', '')})`
                  }}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </div>

              {/* Hover Effect */}
              {hoveredCard === section.id && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
              )}
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Card className="bg-white/10 border-white/20 p-8 backdrop-blur-lg max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
                <Award className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              Ready to Ace Your Exams?
            </h3>
            <p className="text-gray-300 mb-6" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
              Join thousands of successful students who achieved their goals with our comprehensive study platform
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                className="text-white border-0 px-8 py-3 rounded-full shadow-lg hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, rgb(114, 4, 85), rgb(145, 10, 103))"
                }}
              >
                <Brain className="w-4 h-4 mr-2" />
                Start Learning
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-3 rounded-full"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Progress
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
