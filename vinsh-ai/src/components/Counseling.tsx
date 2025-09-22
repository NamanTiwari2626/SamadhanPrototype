import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  ArrowLeft,
  Users,
  Target,
  BookOpen,
  TrendingUp,
  Award,
  MessageCircle,
  Calendar,
  Clock,
  CheckCircle,
  Star,
  Lightbulb,
  Brain,
  Heart,
  Zap,
  BarChart3,
  FileText,
  Video,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Briefcase,
  User,
  ChevronRight,
  Quote,
  ThumbsUp,
  Eye,
  BookMarked,
} from "lucide-react";

interface CounselingProps {
  onBack: () => void;
}

export function Counseling({ onBack }: CounselingProps) {
  const [selectedTab, setSelectedTab] = useState("overview");

  const careerPaths = [
    {
      id: "engineering",
      title: "Engineering",
      description: "JEE Main, JEE Advanced, BITSAT, VITEEE",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      difficulty: "High",
      duration: "2-3 years",
      successRate: "15%",
      salary: "₹6-15 LPA"
    },
    {
      id: "medical",
      title: "Medical",
      description: "NEET, AIIMS, JIPMER, AIIMS Delhi",
      icon: Heart,
      color: "from-red-500 to-pink-500",
      difficulty: "Very High",
      duration: "3-4 years",
      successRate: "5%",
      salary: "₹8-20 LPA"
    },
    {
      id: "civil-services",
      title: "Civil Services",
      description: "UPSC CSE, State PSC, SSC CGL",
      icon: Award,
      color: "from-purple-500 to-indigo-500",
      difficulty: "Very High",
      duration: "2-4 years",
      successRate: "0.1%",
      salary: "₹5-12 LPA"
    },
    {
      id: "defense",
      title: "Defense",
      description: "NDA, CDS, AFCAT, INET",
      icon: Target,
      color: "from-green-500 to-emerald-500",
      difficulty: "High",
      duration: "1-2 years",
      successRate: "8%",
      salary: "₹4-10 LPA"
    },
    {
      id: "banking",
      title: "Banking",
      description: "IBPS PO, SBI PO, RBI Grade B",
      icon: Briefcase,
      color: "from-orange-500 to-yellow-500",
      difficulty: "Medium",
      duration: "6-12 months",
      successRate: "25%",
      salary: "₹3-8 LPA"
    },
    {
      id: "management",
      title: "Management",
      description: "CAT, XAT, SNAP, IIFT",
      icon: TrendingUp,
      color: "from-teal-500 to-blue-500",
      difficulty: "High",
      duration: "1-2 years",
      successRate: "12%",
      salary: "₹8-25 LPA"
    }
  ];

  const counselors = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      specialization: "Career Guidance Expert",
      experience: "15+ years",
      rating: 4.9,
      students: 2500,
      image: "👩‍💼",
      availability: "Available",
      nextSlot: "2:00 PM Today"
    },
    {
      id: 2,
      name: "Prof. Rajesh Kumar",
      specialization: "Exam Strategy Specialist",
      experience: "12+ years",
      rating: 4.8,
      students: 1800,
      image: "👨‍🏫",
      availability: "Available",
      nextSlot: "4:30 PM Today"
    },
    {
      id: 3,
      name: "Ms. Anjali Mehta",
      specialization: "Motivation & Psychology",
      experience: "10+ years",
      rating: 4.9,
      students: 1200,
      image: "👩‍⚕️",
      availability: "Busy",
      nextSlot: "10:00 AM Tomorrow"
    }
  ];

  const studyTips = [
    {
      category: "Time Management",
      tips: [
        "Create a realistic study schedule",
        "Use the Pomodoro Technique (25 min study, 5 min break)",
        "Prioritize difficult subjects during peak energy hours",
        "Take regular breaks to maintain focus"
      ]
    },
    {
      category: "Exam Strategy",
      tips: [
        "Practice previous year papers regularly",
        "Focus on weak areas but don't ignore strong subjects",
        "Learn to manage exam time effectively",
        "Stay calm and confident during the exam"
      ]
    },
    {
      category: "Motivation",
      tips: [
        "Set short-term and long-term goals",
        "Celebrate small achievements",
        "Join study groups for peer support",
        "Visualize your success regularly"
      ]
    }
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
                Career Counseling
              </h1>
              <p className="text-gray-300 mt-1" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                Get personalized guidance for your competitive exam journey
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1">
              <Users className="w-3 h-3 mr-1" />
              Expert Guidance
            </Badge>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 border-white/20">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="careers" className="text-white data-[state=active]:bg-white/20">
              Career Paths
            </TabsTrigger>
            <TabsTrigger value="counselors" className="text-white data-[state=active]:bg-white/20">
              Our Counselors
            </TabsTrigger>
            <TabsTrigger value="tips" className="text-white data-[state=active]:bg-white/20">
              Study Tips
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                      Career Assessment
                    </h3>
                    <p className="text-sm text-gray-300">Find your ideal path</p>
                  </div>
                </div>
                <p className="text-gray-200 text-sm mb-4" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  Take our comprehensive assessment to discover which career path aligns best with your interests, skills, and goals.
                </p>
                <Button className="w-full text-white border-0 rounded-full" style={{ background: 'linear-gradient(135deg, rgb(59, 130, 246), rgb(6, 182, 212))' }}>
                  Start Assessment
                </Button>
              </Card>

              <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                      Exam Strategy
                    </h3>
                    <p className="text-sm text-gray-300">Master your preparation</p>
                  </div>
                </div>
                <p className="text-gray-200 text-sm mb-4" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  Get personalized study plans and strategies tailored to your chosen exam and current preparation level.
                </p>
                <Button className="w-full text-white border-0 rounded-full" style={{ background: 'linear-gradient(135deg, rgb(147, 51, 234), rgb(236, 72, 153))' }}>
                  Get Strategy
                </Button>
              </Card>

              <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                      Motivation Support
                    </h3>
                    <p className="text-sm text-gray-300">Stay motivated</p>
                  </div>
                </div>
                <p className="text-gray-200 text-sm mb-4" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                  Access motivational content, success stories, and connect with peers to stay motivated throughout your journey.
                </p>
                <Button className="w-full text-white border-0 rounded-full" style={{ background: 'linear-gradient(135deg, rgb(34, 197, 94), rgb(16, 185, 129))' }}>
                  Get Support
                </Button>
              </Card>
            </div>

            {/* Success Stories */}
            <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
              <h3 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                Success Stories
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl">
                      👨‍🎓
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                        Rahul Kumar
                      </h4>
                      <p className="text-sm text-gray-300 mb-2">JEE Advanced - AIR 45</p>
                      <p className="text-sm text-gray-200" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                        "The counseling helped me choose the right strategy and stay focused. The personalized study plan was a game-changer."
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-2xl">
                      👩‍⚕️
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                        Priya Singh
                      </h4>
                      <p className="text-sm text-gray-300 mb-2">NEET - AIR 12</p>
                      <p className="text-sm text-gray-200" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                        "The motivation support and study tips kept me going during tough times. Highly recommended!"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Career Paths Tab */}
          <TabsContent value="careers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careerPaths.map((path) => (
                <Card key={path.id} className="bg-white/10 border-white/20 p-6 backdrop-blur-lg hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${path.color}`}>
                      <path.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                        {path.title}
                      </h3>
                      <p className="text-sm text-gray-300">{path.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Difficulty</span>
                      <Badge className={`${
                        path.difficulty === 'Very High' ? 'bg-red-500/20 text-red-400' :
                        path.difficulty === 'High' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {path.difficulty}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Duration</span>
                      <span className="text-sm text-white">{path.duration}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Success Rate</span>
                      <span className="text-sm text-white">{path.successRate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Avg. Salary</span>
                      <span className="text-sm text-white">{path.salary}</span>
                    </div>
                  </div>

                  <Button className="w-full text-white border-0 rounded-full" style={{ background: `linear-gradient(135deg, ${path.color.split(' ')[0].replace('from-', '')}, ${path.color.split(' ')[2].replace('to-', '')})` }}>
                    Learn More
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Counselors Tab */}
          <TabsContent value="counselors" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {counselors.map((counselor) => (
                <Card key={counselor.id} className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl">
                      {counselor.image}
                    </div>
                    <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                      {counselor.name}
                    </h3>
                    <p className="text-sm text-gray-300">{counselor.specialization}</p>
                    <p className="text-xs text-gray-400">{counselor.experience}</p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-white">{counselor.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Students Helped</span>
                      <span className="text-sm text-white">{counselor.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Status</span>
                      <Badge className={`${
                        counselor.availability === 'Available' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {counselor.availability}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Next Slot</span>
                      <span className="text-sm text-white">{counselor.nextSlot}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full text-white border-0 rounded-full" style={{ background: 'linear-gradient(135deg, rgb(59, 130, 246), rgb(147, 51, 234))' }}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Book Session
                    </Button>
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                      <Video className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Study Tips Tab */}
          <TabsContent value="tips" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {studyTips.map((category, index) => (
                <Card key={index} className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                      <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                      {category.category}
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {category.tips.map((tip, tipIndex) => (
                      <div key={tipIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-200" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                          {tip}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            {/* Additional Resources */}
            <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
              <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                Additional Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-auto p-4 flex flex-col items-center gap-2">
                  <FileText className="w-6 h-6" />
                  <span className="text-sm">Study Guides</span>
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-auto p-4 flex flex-col items-center gap-2">
                  <Video className="w-6 h-6" />
                  <span className="text-sm">Video Tutorials</span>
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-auto p-4 flex flex-col items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-sm">Discussion Forums</span>
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-auto p-4 flex flex-col items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  <span className="text-sm">Webinars</span>
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
