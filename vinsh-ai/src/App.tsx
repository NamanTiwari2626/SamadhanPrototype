import React, { useEffect, useState } from "react";
import { ResponsiveAIAssistant } from "./components/ResponsiveAIAssistant";
import { StudyDashboard } from "./components/StudyDashboard";
import { Counseling } from "./components/Counseling";
import CommunityChat from "./components/CommunityChat";
import { SmartQuestionBank } from "./components/SmartQuestionBank";
import { TimetableMaker } from "./components/TimetableMaker";
import { StudyPlanner } from "./components/StudyPlanner";
import { Quizzes } from "./components/Quizzes";
import { Syllabus } from "./components/Syllabus";
import ClickSpark from "./components/ClickSpark";
import Stairs from "./components/Stairs";
import AuthPage from "./components/auth/AuthPage";

type AppSection = 
  | "home" 
  | "dashboard" 
  | "counseling" 
  | "question-bank" 
  | "timetable" 
  | "study-planner" 
  | "quizzes" 
  | "syllabus"
  | "community"
  | "auth";

export default function App() {
  const [currentSection, setCurrentSection] = useState<AppSection>("auth");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setHashForSection = (section: AppSection) => {
    try {
      window.location.hash = section === "home" ? "homevinsh" : section;
    } catch {}
  };

  // On initial load, derive auth from localStorage and sync the section
  useEffect(() => {
    const authed = (() => {
      try { return localStorage.getItem("vinsh_is_auth") === "1"; } catch { return false; }
    })();
    setIsAuthenticated(authed);
    const applyHash = () => {
      const raw = (window.location.hash || "").replace(/^#/, "");
      const mapped = raw === "homevinsh" || raw === ""
        ? (authed ? "home" : "auth")
        : (raw as AppSection);
      if (mapped) {
        setCurrentSection(mapped);
      }
    };
    // ensure default hash reflects auth state on first load
    if (!window.location.hash) {
      try { window.location.hash = authed ? "home" : "auth"; } catch {}
    }
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const handleNavigate = (section: string) => {
    console.log(`Navigating to: ${section}`);
    setCurrentSection(section as AppSection);
    // Keep URL hash in sync as a fallback navigation mechanism
    setHashForSection(section as AppSection);
  };

  const handleBack = () => {
    setCurrentSection("home");
    setHashForSection("home");
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
      case "community":
        return <CommunityChat onBack={handleBack} />;
      case "auth":
        return (
          <AuthPage
            onSuccess={() => {
              try { localStorage.setItem("vinsh_is_auth", "1"); } catch {}
              setIsAuthenticated(true);
              setCurrentSection("home");
              setHashForSection("home");
            }}
            onBack={handleBack}
          />
        );
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
      <Stairs triggerKey={currentSection}>
        {renderCurrentSection()}
      </Stairs>
    </ClickSpark>
  );
}