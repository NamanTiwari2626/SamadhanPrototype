import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import Threads from "./Threads";
import { 
  ArrowLeft, 
  Target, 
  Star, 
  BarChart3, 
  CheckCircle, 
  Lightbulb, 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  Palette,
  HelpCircle,
  ExternalLink,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface CounselingProps {
  onBack: () => void;
}

type FieldId = "engineering" | "medicine" | "commerce" | "arts";

interface QuestionOption {
  value: string;
  label: string;
  weight: Record<FieldId, number>;
}

interface Question {
  id: string;
  question: string;
  type: "single" | "multiple";
  options: QuestionOption[];
}

interface FieldInfo {
  title: string;
  description: string;
  icon: React.ReactNode;
  careers: string[];
  skills: string[];
}

export function Counseling({ onBack }: CounselingProps) {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<boolean | null>(null);
  const [activeField, setActiveField] = useState<FieldId | null>(null);

  // Field information for tooltips and detailed descriptions
  const fieldInfo: Record<FieldId, FieldInfo> = {
    engineering: {
      title: "Engineering",
      description: "Engineering involves applying scientific and mathematical principles to design, build, and maintain structures, machines, systems, and processes.",
      icon: <GraduationCap className="w-5 h-5" />,
      careers: ["Software Engineer", "Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "Chemical Engineer"],
      skills: ["Problem-solving", "Mathematical reasoning", "Analytical thinking", "Technical design", "Attention to detail"]
    },
    medicine: {
      title: "Medicine",
      description: "Medicine focuses on diagnosing, treating, and preventing disease, as well as maintaining physical and mental health through scientific knowledge and technology.",
      icon: <BookOpen className="w-5 h-5" />,
      careers: ["Doctor", "Surgeon", "Nurse", "Pharmacist", "Medical Researcher"],
      skills: ["Critical thinking", "Empathy", "Communication", "Attention to detail", "Decision making under pressure"]
    },
    commerce: {
      title: "Commerce",
      description: "Commerce involves the exchange of goods and services, including business management, finance, marketing, and economics.",
      icon: <Briefcase className="w-5 h-5" />,
      careers: ["Accountant", "Marketing Manager", "Financial Analyst", "Entrepreneur", "Business Consultant"],
      skills: ["Analytical thinking", "Communication", "Negotiation", "Financial literacy", "Strategic planning"]
    },
    arts: {
      title: "Arts",
      description: "Arts encompasses creative and cultural fields including visual arts, performing arts, literature, and design.",
      icon: <Palette className="w-5 h-5" />,
      careers: ["Graphic Designer", "Writer", "Filmmaker", "Musician", "Art Director"],
      skills: ["Creativity", "Visual thinking", "Communication", "Emotional intelligence", "Adaptability"]
    }
  };

  const questions: Question[] = [
    {
      id: "academic_strength",
      question: "What are your strongest academic subjects?",
      type: "multiple",
      options: [
        { value: "math", label: "Mathematics", weight: { engineering: 3, medicine: 1, commerce: 2, arts: 0 } },
        { value: "physics", label: "Physics", weight: { engineering: 3, medicine: 2, commerce: 0, arts: 0 } },
        { value: "chemistry", label: "Chemistry", weight: { engineering: 2, medicine: 3, commerce: 0, arts: 0 } },
        { value: "biology", label: "Biology", weight: { engineering: 0, medicine: 3, commerce: 0, arts: 1 } },
        { value: "economics", label: "Economics", weight: { engineering: 0, medicine: 0, commerce: 3, arts: 1 } },
        { value: "english", label: "English", weight: { engineering: 1, medicine: 1, commerce: 1, arts: 3 } },
      ],
    },
    {
      id: "interests",
      question: "What activities interest you most?",
      type: "multiple",
      options: [
        { value: "problem_solving", label: "Problem Solving & Logic", weight: { engineering: 3, medicine: 2, commerce: 2, arts: 1 } },
        { value: "helping_others", label: "Helping Others", weight: { engineering: 1, medicine: 3, commerce: 2, arts: 2 } },
        { value: "creativity", label: "Creative Arts & Design", weight: { engineering: 0, medicine: 0, commerce: 1, arts: 3 } },
        { value: "business", label: "Business & Finance", weight: { engineering: 1, medicine: 0, commerce: 3, arts: 1 } },
        { value: "technology", label: "Technology & Innovation", weight: { engineering: 3, medicine: 1, commerce: 2, arts: 1 } },
      ],
    },
    {
      id: "career_goals",
      question: "What are your primary career goals?",
      type: "single",
      options: [
        { value: "salary", label: "High Salary & Stability", weight: { engineering: 3, medicine: 3, commerce: 3, arts: 1 } },
        { value: "impact", label: "Social Impact & Service", weight: { engineering: 2, medicine: 3, commerce: 1, arts: 3 } },
        { value: "innovation", label: "Innovation & Technology", weight: { engineering: 3, medicine: 1, commerce: 2, arts: 1 } },
        { value: "creativity", label: "Creative Expression", weight: { engineering: 0, medicine: 0, commerce: 1, arts: 3 } },
      ],
    },
    {
      id: "study_style",
      question: "How do you prefer to study?",
      type: "single",
      options: [
        { value: "practical", label: "Hands-on & Practical", weight: { engineering: 3, medicine: 3, commerce: 2, arts: 1 } },
        { value: "theoretical", label: "Theoretical & Conceptual", weight: { engineering: 2, medicine: 2, commerce: 2, arts: 2 } },
        { value: "analytical", label: "Analytical & Problem-solving", weight: { engineering: 3, medicine: 2, commerce: 3, arts: 1 } },
        { value: "creative", label: "Creative & Expressive", weight: { engineering: 0, medicine: 0, commerce: 1, arts: 3 } },
      ],
    },
  ];

  const setAnswer = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calcScores = () => {
    const scores: Record<FieldId, number> = { engineering: 0, medicine: 0, commerce: 0, arts: 0 };
    questions.forEach(q => {
      const a = answers[q.id];
      if (!a) return;
      if (q.type === "multiple") {
        (a as string[]).forEach(v => {
          const opt = q.options.find(o => o.value === v);
          if (!opt) return;
          (Object.keys(scores) as FieldId[]).forEach(f => { scores[f] += opt.weight[f]; });
        });
      } else {
        const opt = q.options.find(o => o.value === a);
        if (opt) (Object.keys(scores) as FieldId[]).forEach(f => { scores[f] += opt.weight[f]; });
      }
    });
    return scores;
  };

  const getRecommendation = () => {
    const scores = calcScores();
    const total = (Object.values(scores) as number[]).reduce((s, n) => s + n, 0);
    if (total === 0) return null;
    const breakdown = (Object.entries(scores) as [FieldId, number][]) 
      .map(([field, score]) => ({ field, score, pct: Math.round((score / total) * 100) }))
      .sort((a, b) => b.pct - a.pct);
    return { top: breakdown[0], breakdown };
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(q => q + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) setCurrentQuestion(q => q - 1);
  };

  const rec = showResults ? getRecommendation() : null;
  
  // Get personalized recommendations based on top field
  const getPersonalizedRecommendations = () => {
    if (!rec) return [];
    
    const topField = rec.top.field as FieldId;
    
    switch(topField) {
      case 'engineering':
        return [
          "Consider taking advanced mathematics and physics courses",
          "Look into coding bootcamps or online programming courses",
          "Participate in robotics clubs or engineering competitions",
          "Research specific engineering disciplines that match your interests"
        ];
      case 'medicine':
        return [
          "Focus on biology, chemistry, and physics coursework",
          "Volunteer at hospitals or healthcare facilities",
          "Prepare for standardized tests required for medical school",
          "Research different medical specialties and requirements"
        ];
      case 'commerce':
        return [
          "Take courses in economics, accounting, and business management",
          "Develop spreadsheet and data analysis skills",
          "Participate in business competitions or start a small venture",
          "Learn about financial markets and investment strategies"
        ];
      case 'arts':
        return [
          "Build a portfolio showcasing your creative work",
          "Take courses in your specific area of interest",
          "Participate in exhibitions, performances, or publications",
          "Learn digital tools relevant to your creative field"
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(to right, rgb(15, 23, 42), rgb(51, 65, 85))" }}>
      <div className="absolute inset-0 z-0">
        <Threads amplitude={1} distance={0} enableMouseInteraction={false} />
      </div>

      <div className="relative z-20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
          <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/10 border border-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>Career Counseling</h1>
          </div>
          {/* Beta badge removed */}
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="w-full flex justify-center gap-3 bg-transparent">
            <TabsTrigger
              value="overview"
              className="text-white rounded-full px-5 py-2 bg-white/10 border border-white/20 backdrop-blur-lg hover:bg-white/15 data-[state=active]:bg-white/20 data-[state=active]:border-white/30 transition"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="assessment"
              className="text-white rounded-full px-5 py-2 bg-white/10 border border-white/20 backdrop-blur-lg hover:bg-white/15 data-[state=active]:bg-white/20 data-[state=active]:border-white/30 transition"
            >
              Career Assessment
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="text-white rounded-full px-5 py-2 bg-white/10 border border-white/20 backdrop-blur-lg hover:bg-white/15 data-[state=active]:bg-white/20 data-[state=active]:border-white/30 transition"
            >
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
              <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>What is Career Counseling?</h3>
              <p className="text-gray-200 mb-4">
                Career counseling helps you identify your strengths, interests, and values to make informed decisions about your educational and professional path. Our AI-powered assessment analyzes your responses to provide personalized recommendations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <TooltipProvider>
                  {(Object.keys(fieldInfo) as FieldId[]).map(field => (
                    <Tooltip key={field}>
                      <TooltipTrigger asChild>
                        <Card 
                          className="bg-white/5 border-white/10 p-4 cursor-pointer hover:bg-white/10 transition-colors"
                          onClick={() => setActiveField(activeField === field ? null : field)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                              {fieldInfo[field].icon}
                            </div>
                            <h4 className="text-white font-medium">{fieldInfo[field].title}</h4>
                          </div>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p>{fieldInfo[field].description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
              
              {activeField && (
                <Card className="bg-white/5 border-white/10 p-4 mb-4">
                  <h4 className="text-lg font-semibold text-white mb-2">{fieldInfo[activeField].title}</h4>
                  <p className="text-gray-300 mb-3">{fieldInfo[activeField].description}</p>
                  
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-gray-300 mb-1">Common Careers</h5>
                    <div className="flex flex-wrap gap-2">
                      {fieldInfo[activeField].careers.map(career => (
                        <Badge key={career} className="bg-white/10 text-white hover:bg-white/20">{career}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-300 mb-1">Key Skills</h5>
                    <div className="flex flex-wrap gap-2">
                      {fieldInfo[activeField].skills.map(skill => (
                        <Badge key={skill} className="bg-white/10 text-white hover:bg-white/20">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              )}
              
              <Button className="text-white border-0 rounded-full" style={{ background: "linear-gradient(135deg, rgb(59,130,246), rgb(6,182,212))" }} onClick={() => setSelectedTab("assessment")}>Start Assessment</Button>
            </Card>
          </TabsContent>

          <TabsContent value="assessment" className="space-y-6">
            {!showResults ? (
              <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                <div className="text-white mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Question {currentQuestion + 1} of {questions.length}</h3>
                    <span className="text-sm text-gray-300">{questions[currentQuestion].type === 'multiple' ? 'Select all that apply' : 'Select one'}</span>
                  </div>
                  <div className="mt-3">
                    <Progress value={((currentQuestion) / questions.length) * 100} />
                  </div>
                </div>
                  
                <h4 className="text-xl font-bold text-white mb-4">{questions[currentQuestion].question}</h4>

                <div className="space-y-3">
                  {questions[currentQuestion].options.map(opt => {
                    const q = questions[currentQuestion];
                    const isMultiple = q.type === 'multiple';
                    const current = answers[q.id];
                    const checked = isMultiple ? Array.isArray(current) && (current as string[]).includes(opt.value) : current === opt.value;
                    return (
                      <label key={opt.value} className="flex items-center gap-3 text-gray-200 cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors">
                        <input
                          type={isMultiple ? 'checkbox' : 'radio'}
                          name={q.id}
                          checked={checked}
                          onChange={(e) => {
                            if (isMultiple) {
                              const arr = Array.isArray(current) ? (current as string[]) : [];
                              if (e.target.checked) setAnswer(q.id, [...arr, opt.value]);
                              else setAnswer(q.id, arr.filter(v => v !== opt.value));
                            } else {
                              setAnswer(q.id, opt.value);
                            }
                          }}
                          className="accent-blue-500"
                        />
                        <span>{opt.label}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="flex justify-between mt-6">
                  <Button 
                    className="bg-black text-white hover:bg-white hover:text-black transition-colors" 
                    onClick={handlePrev} 
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </Button>
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white" onClick={handleNext} disabled={!answers[questions[currentQuestion].id] || (Array.isArray(answers[questions[currentQuestion].id]) && (answers[questions[currentQuestion].id] as string[]).length === 0)}>
                    {currentQuestion === questions.length - 1 ? 'Get Results' : 'Next'}
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 border-white/20 p-6 backdrop-blur-lg">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                      <Star className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-1">Your Best-Fit Field</h3>
                    {rec && (
                      <div>
                        <p className="text-gray-200 mb-2">Recommended: <span className="capitalize font-semibold">{rec.top.field}</span> • Confidence {rec.top.pct}%</p>
                        <p className="text-gray-300 text-sm">{fieldInfo[rec.top.field as FieldId].description}</p>
                      </div>
                    )}
                  </div>
                </Card>
                  
                {rec && (
                  <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                    <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5" />Score Breakdown</h4>
                    <div className="space-y-3">
                      {rec.breakdown.map((b: any, i: number) => (
                        <div key={b.field} className="flex items-center gap-4">
                          <div className="w-28 text-sm text-gray-300 capitalize">{b.field}</div>
                          <div className="flex-1 bg-gray-700 rounded-full h-3">
                            <div className="h-3 rounded-full" style={{ width: `${b.pct}%`, background: i === 0 ? "linear-gradient(90deg, rgb(236,72,153), rgb(147,51,234))" : i === 1 ? "linear-gradient(90deg, rgb(59,130,246), rgb(6,182,212))" : i === 2 ? "linear-gradient(90deg, rgb(16,185,129), rgb(5,150,105))" : "linear-gradient(90deg, rgb(234,179,8), rgb(249,115,22))" }} />
                          </div>
                          <div className="w-12 text-right text-sm text-gray-300">{b.pct}%</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                    <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" />Your Strengths</h4>
                    <ul className="text-gray-200 space-y-2">
                      <li>Analytical thinking and problem solving</li>
                      <li>Motivation aligned with your goals</li>
                      <li>Study style preferences identified</li>
                    </ul>
                  </Card>
                  
                  <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                    <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-yellow-400" />Considerations</h4>
                    <ul className="text-gray-200 space-y-2">
                      <li>Explore sample papers and past questions</li>
                      <li>Talk to seniors or mentors in the field</li>
                      <li>Balance preparation time with well-being</li>
                    </ul>
                  </Card>
                </div>

                {rec && (
                  <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                    <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-blue-400" />
                      Personalized Recommendations
                    </h4>
                    <ul className="text-gray-200 space-y-2">
                      {getPersonalizedRecommendations().map((recommendation, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="mt-1">•</div>
                          <div>{recommendation}</div>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
                  <h4 className="text-lg font-semibold text-white mb-3">Was this assessment helpful?</h4>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`bg-black text-white border-white/20 ${feedbackGiven === true ? 'bg-green-500/20 text-black' : 'hover:bg-white hover:text-black'}`}
                      onClick={() => setFeedbackGiven(true)}
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Yes, it was helpful
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`bg-black text-white border-white/20 ${feedbackGiven === false ? 'bg-red-500/20 text-white' : 'hover:bg-white hover:text-black'}`}
                      onClick={() => setFeedbackGiven(false)}
                    >
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      No, needs improvement
                    </Button>
                  </div>
                  {feedbackGiven === false && (
                    <textarea 
                      className="w-full mt-3 p-2 bg-white/5 border border-white/10 rounded-md text-white"
                      placeholder="Please tell us how we can improve..."
                      rows={3}
                    />
                  )}
                  {feedbackGiven !== null && (
                    <p className="text-green-400 text-sm mt-2">Thank you for your feedback!</p>
                  )}
                </Card>

                <div className="flex justify-center">
                  <Button variant="outline" className="bg-black text-white border-white/20 hover:bg-white hover:text-black" onClick={() => { setCurrentQuestion(0); setAnswers({}); setShowResults(false); setFeedbackGiven(null); }}>Retake Assessment</Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-6">
            <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
              <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>Career Resources</h3>
              <p className="text-gray-200 mb-4">
                Explore these resources to learn more about different career paths and make informed decisions about your future.
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    Educational Resources
                  </h4>
                  <ul className="text-gray-200 space-y-2">
                    <li className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>Khan Academy - Free courses in various subjects</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>Coursera - Online courses from top universities</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>edX - Free online courses from leading institutions</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-purple-400" />
                    Career Exploration
                  </h4>
                  <ul className="text-gray-200 space-y-2">
                    <li className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>O*NET Online - Detailed information about occupations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>LinkedIn Learning - Professional skills development</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>Glassdoor - Company reviews and salary information</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-yellow-400" />
                    Additional Support
                  </h4>
                  <ul className="text-gray-200 space-y-2">
                    <li className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>Career One Stop - Career exploration and job search resources</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>Indeed - Job search platform with career advice</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>MyPlan - Career assessment tools and resources</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// When using the Threads component in the Counseling component, make sure to set enableMouseInteraction to false:
<Threads enableMouseInteraction={false} />
