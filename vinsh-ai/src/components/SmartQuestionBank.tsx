import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import Threads from "./Threads";
import {
  ArrowLeft,
  BookOpen,
  Search,
  Brain,
  Calculator,
  Atom,
  Globe,
  Book,
} from "lucide-react";

interface SmartQuestionBankProps {
  onBack: () => void;
}

export function SmartQuestionBank({ onBack }: SmartQuestionBankProps) {
  const [selectedTab, setSelectedTab] = useState("subjects");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});

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

  // Frequently repeated topics/questions bank with counts and answers
  const frequentBank: Record<string, { id: string; text: string; times: number; answer: string }[]> = {
    mathematics: [
      { id: "quad-roots", text: "Sum and product of roots of quadratic equation", times: 18, answer: "For ax^2+bx+c=0: sum = -b/a, product = c/a." },
      { id: "def-int-basic", text: "Basic properties of definite integrals", times: 15, answer: "∫_a^b f(x) dx = F(b)-F(a); if f is even: ∫_-a^a f = 2∫_0^a f; if odd: 0." },
      { id: "limits-lhopital", text: "Indeterminate limits using L'Hôpital's Rule", times: 12, answer: "If limit yields 0/0 or ∞/∞ and f,g differentiable near a: lim f/g = lim f'/g' (when latter exists)." },
      { id: "trig-identities", text: "Fundamental trigonometric identities", times: 14, answer: "sin²θ + cos²θ = 1, tan θ = sin θ/cos θ, sec²θ - tan²θ = 1" },
      { id: "derivative-rules", text: "Chain rule and product rule applications", times: 16, answer: "Chain: (f(g(x)))' = f'(g(x))·g'(x); Product: (fg)' = f'g + fg'" },
      { id: "matrix-determinant", text: "Properties of determinants", times: 11, answer: "det(AB) = det(A)det(B); if row/column all zeros, det = 0" }
    ],
    physics: [
      { id: "proj-range", text: "Range of projectile and angle relations", times: 14, answer: "R = (u^2 sin 2θ)/g; for same range: θ and 90°-θ give equal R." },
      { id: "ohms-law", text: "Equivalent resistance in series/parallel", times: 16, answer: "Series: R_eq = ΣR_i; Parallel: 1/R_eq = Σ(1/R_i)." },
      { id: "wave-equation", text: "Wave speed and frequency relationship", times: 13, answer: "v = fλ where v is speed, f is frequency, λ is wavelength" },
      { id: "energy-conservation", text: "Conservation of mechanical energy", times: 12, answer: "KE + PE = constant in conservative force fields" },
      { id: "doppler-effect", text: "Doppler shift for sound waves", times: 10, answer: "f' = f(v ± v_observer)/(v ± v_source)" }
    ],
    chemistry: [
      { id: "lechat", text: "Le Châtelier's principle applications", times: 13, answer: "System shifts to oppose change: inc. pressure favors fewer moles; inc. temp favors endothermic direction." },
      { id: "pka-ph", text: "pH, pKa and buffer calculations", times: 11, answer: "Henderson–Hasselbalch: pH = pKa + log([A-]/[HA])." },
      { id: "orbital-hybridization", text: "Types of hybridization in organic molecules", times: 9, answer: "sp³: tetrahedral, sp²: trigonal planar, sp: linear" },
      { id: "reaction-kinetics", text: "Rate law and order of reaction", times: 15, answer: "Rate = k[A]^m[B]^n; order = m+n" },
      { id: "electrochemistry", text: "Electrode potential and cell EMF", times: 8, answer: "E°cell = E°cathode - E°anode; ΔG° = -nFE°" }
    ],
    biology: [
      { id: "dna-replication", text: "DNA replication enzymes and direction", times: 10, answer: "Occurs 5'→3'; DNA polymerase, helicase, primase; leading/lagging (Okazaki fragments)." },
      { id: "photosynthesis", text: "Light and dark reactions of photosynthesis", times: 12, answer: "Light: H₂O → O₂ + ATP + NADPH; Dark: CO₂ + ATP + NADPH → glucose" },
      { id: "protein-synthesis", text: "Transcription and translation process", times: 11, answer: "DNA → mRNA (transcription) → protein (translation at ribosomes)" },
      { id: "mendel-laws", text: "Mendelian inheritance patterns", times: 9, answer: "Law of segregation: alleles separate; Law of independent assortment" },
      { id: "enzyme-kinetics", text: "Enzyme activity and factors affecting it", times: 8, answer: "Rate affected by temp, pH, substrate concentration, competitive/non-competitive inhibition" }
    ],
    english: [
      { id: "subject-verb", text: "Subject–verb agreement pitfalls", times: 9, answer: "Singular subjects take singular verbs; phrases between subject and verb do not affect agreement." },
      { id: "active-passive", text: "Active and passive voice conversion", times: 8, answer: "Active: Subject + Verb + Object → Passive: Object + be + past participle + by + Subject" },
      { id: "tenses-usage", text: "Perfect tense usage and formation", times: 7, answer: "Present perfect: has/have + past participle; Past perfect: had + past participle" },
      { id: "prepositions", text: "Common preposition usage errors", times: 6, answer: "Different from (not than); in time vs on time; at/on/in for time and place" },
      { id: "reported-speech", text: "Direct to indirect speech conversion", times: 10, answer: "Tense shifts back: present→past, past→past perfect; pronouns and time expressions change" }
    ],
    "general-knowledge": [
      { id: "indian-constitution", text: "Key articles of Indian Constitution (e.g., Article 21)", times: 8, answer: "Art. 21: Protection of life and personal liberty; no person deprived except per procedure established by law." },
      { id: "world-capitals", text: "Capital cities of major countries", times: 12, answer: "France-Paris, Germany-Berlin, Australia-Canberra, Canada-Ottawa, Brazil-Brasília" },
      { id: "indian-geography", text: "Rivers, mountains, and states of India", times: 11, answer: "Ganges-Ganga, Himalayas northern border, 28 states + 8 union territories" },
      { id: "current-affairs", text: "Recent government schemes and policies", times: 9, answer: "PM-KISAN, Ayushman Bharat, Digital India, Make in India initiatives" },
      { id: "sports-awards", text: "Major sports awards and achievements", times: 7, answer: "Bharat Ratna (highest), Padma awards, Khel Ratna, Arjuna Award for sports" }
    ]
  };

  const getFrequentItems = (subjectId: string) => {
    const base = frequentBank[subjectId] || [];
    if (base.length >= 30) return base.slice(0, 30);
    const generated: { id: string; text: string; times: number; answer: string }[] = [...base];
    let i = 0;
    while (generated.length < 30) {
      const seed = base[i % (base.length || 1)] || {
        id: `gen-${i}`,
        text: `Important topic ${i + 1}`,
        times: 7 + ((i * 3) % 11),
        answer: "Review the standard solution approach and key formulae.",
      };
      generated.push({
        id: `${seed.id}-${generated.length + 1}`,
        text: seed.text,
        times: seed.times,
        answer: seed.answer,
      });
      i++;
    }
    return generated.slice(0, 30);
  };

  const getVisibleCount = (subjectId: string) => (visibleCounts[subjectId] ?? 5); // Start with more items

  const handleListScroll = (subjectId: string) => (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const { scrollTop, clientHeight, scrollHeight } = target;
    
    // More sensitive scroll detection - trigger when 80% scrolled
    if (scrollTop + clientHeight >= scrollHeight * 0.8) {
      setVisibleCounts(prev => {
        const current = prev[subjectId] ?? 5;
        const max = getFrequentItems(subjectId).length;
        const next = Math.min(current + 5, max); // Load 5 more at a time
        if (next === current) return prev;
        return { ...prev, [subjectId]: next };
      });
    }
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return (completed / total) * 100;
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
        <style>{`
          .custom-scrollable {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE and Edge */
          }
          .custom-scrollable::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
          .custom-scrollable {
            overflow-y: auto;
            overscroll-behavior: contain;
          }
        `}</style>
        
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

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="w-full flex justify-center gap-3 bg-transparent">
            <TabsTrigger value="subjects" className="text-white rounded-full px-5 py-2 bg-white/10 border border-white/20 backdrop-blur-lg hover:bg-white/15 data-[state=active]:bg-white/20 data-[state=active]:border-white/30 transition">
              Subjects
            </TabsTrigger>
          </TabsList>

          {/* Subjects Tab */}
          <TabsContent value="subjects" className="space-y-6">
            {/* Search and Filter */}
            <Card className="bg-white/10 border-white/20 p-6 backdrop-blur-lg">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search subjects or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
            {(() => {
              const query = searchQuery.trim().toLowerCase();
              const filtered = subjects
                .filter((s) => {
                  const subjectFilterOk = selectedSubject ? s.id === selectedSubject : true;
                  if (!subjectFilterOk) return false;
                  if (!query) return true;
                  const nameMatch = s.name.toLowerCase().includes(query);
                  const topicMatch = s.topics.some((t) => t.toLowerCase().includes(query));
                  const freqMatch = getFrequentItems(s.id).some((it) => it.text.toLowerCase().includes(query));
                  return nameMatch || topicMatch || freqMatch;
                })
                .map((s) => {
                  const query = searchQuery.trim().toLowerCase();
                  const nameMatch = query ? (s.name.toLowerCase().includes(query) ? 2 : 0) : 0;
                  const topicMatch = query ? (s.topics.some((t) => t.toLowerCase().includes(query)) ? 3 : 0) : 0;
                  const freqMatch = query ? (getFrequentItems(s.id).some((it) => it.text.toLowerCase().includes(query)) ? 4 : 0) : 0;
                  const score = nameMatch + topicMatch + freqMatch;
                  return { s, score };
                })
                .sort((a, b) => {
                  if (b.score !== a.score) return b.score - a.score;
                  return a.s.name.localeCompare(b.s.name);
                })
                .map(({ s }) => s);
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((subject) => (
                    <Card key={subject.id} className="bg-white/10 border-white/20 p-6 backdrop-blur-lg hover:scale-105 transition-transform duration-300 relative">
                      <Button
                        onClick={() => setSelectedSubject(subject.id)}
                        className="absolute top-4 right-4 text-white border-0 rounded-full px-3 py-1 text-xs shadow-md hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, rgb(99, 102, 241), rgb(139, 92, 246))' }}
                        title="Open Question Bank"
                      >
                        <BookOpen className="w-3 h-3 mr-1" />
                        Open
                      </Button>
                      
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
                        <h4 className="text-sm font-semibold text-white" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>
                          Frequently Repeated
                        </h4>
                        <div 
                          className="custom-scrollable space-y-2 max-h-80 overflow-y-auto pr-2"
                          onScroll={handleListScroll(subject.id)}
                          style={{ 
                            minHeight: '200px',
                            maxHeight: '320px'
                          }}
                        >
                          {getFrequentItems(subject.id).slice(0, getVisibleCount(subject.id)).map((item, index) => (
                            <div key={item.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-start justify-between gap-3">
                                <div className="text-sm text-gray-100 flex-1">{item.text}</div>
                                <Badge className="bg-white/10 text-white border-white/20 text-xs shrink-0">
                                  {item.times}x
                                </Badge>
                              </div>
                              <div className="mt-2 text-xs text-gray-300">
                                <span className="text-gray-400">Answer: </span>
                                {item.answer}
                              </div>
                            </div>
                          ))}
                          {getFrequentItems(subject.id).length === 0 && (
                            <div className="text-xs text-gray-400 p-4 text-center">
                              No frequent items available.
                            </div>
                          )}
                          {getVisibleCount(subject.id) < getFrequentItems(subject.id).length && (
                            <div className="text-xs text-gray-400 p-2 text-center">
                              Scroll down for more items...
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              );
            })()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}