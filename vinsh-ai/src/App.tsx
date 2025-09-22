import React, { useState } from "react";
import { ResponsiveAIAssistant } from "./components/ResponsiveAIAssistant";
import { StudyDashboard } from "./components/StudyDashboard";
import { Counseling } from "./components/Counseling";
import { SmartQuestionBank } from "./components/SmartQuestionBank";
import { TimetableMaker } from "./components/TimetableMaker";
import { StudyPlanner } from "./components/StudyPlanner";
import { Quizzes } from "./components/Quizzes";
import { Syllabus } from "./components/Syllabus";
import ClickSpark from "./components/ClickSpark";

type AppSection = 
  | "home" 
  | "dashboard" 
  | "counseling" 
  | "question-bank" 
  | "timetable" 
  | "study-planner" 
  | "quizzes" 
  | "syllabus";

export default function App() {
  const [currentSection, setCurrentSection] = useState<AppSection>("home");

  const handleNavigate = (section: string) => {
    console.log(`Navigating to: ${section}`);
    setCurrentSection(section as AppSection);
  };

  const handleBack = () => {
    if (currentSection === "dashboard") {
      setCurrentSection("home");
    } else {
      setCurrentSection("dashboard");
    }
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case "home":
        return (
          <ResponsiveAIAssistant 
            onNavigateToDashboard={() => setCurrentSection("dashboard")}
            onNavigate={handleNavigate}
          />
        );
      case "dashboard":
        return (
          <StudyDashboard 
            onBack={handleBack}
            onNavigate={handleNavigate}
          />
        );
      case "counseling":
        return <Counseling onBack={handleBack} />;
      case "question-bank":
        return <SmartQuestionBank onBack={handleBack} />;
      case "timetable":
        return <TimetableMaker onBack={handleBack} />;
      case "study-planner":
        return <StudyPlanner onBack={handleBack} />;
      case "quizzes":
        return <Quizzes onBack={handleBack} />;
      case "syllabus":
        return <Syllabus onBack={handleBack} />;
      default:
        return (
          <ResponsiveAIAssistant 
            onNavigateToDashboard={() => setCurrentSection("dashboard")}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <ClickSpark sparkColor="rgb(255, 255, 255)" sparkCount={10} sparkRadius={18} extraScale={1.2}>
      {renderCurrentSection()}
    </ClickSpark>
  );
}