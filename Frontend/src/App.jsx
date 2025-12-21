import React, { useEffect, useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Challenges from "./pages/Challenges";
import CategoryChallenges from "./pages/CategoryChallenges";
import Challenge from "./pages/Challenge";
import Progress from "./pages/Progress";
import Hints from "./pages/Hints";
import Leaderboard from "./pages/Leaderboard";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Tutorials from "./pages/Tutorials";
import Tutorial from "./pages/Tutorial";
import Lessons from "./pages/Lessons";
import Lesson from "./pages/Lesson";
import About from "./pages/About";
import AIChallenge from "./pages/AIChallenge";
import WebChallenge from "./pages/WebChallenge";
import CryptoChallenge from "./pages/CryptoChallenge";
import ForensicsChallenge from "./pages/ForensicsChallenge";
import ReverseChallenge from "./pages/ReverseChallenge";
import MiscChallenge from "./pages/MiscChallenge";
import ChakraTerminal from "./pages/ChakraTerminal";



function parseHash() {
  const h = window.location.hash || "#/";
  const parts = h.replace("#", "").split("/").filter(Boolean);

  console.log("Parsing hash:", h, "Parts:", parts);

  if (parts.length === 0 || parts[0] === "") return { route: "landing" };
  if (parts[0] === "login") return { route: "login" };
  if (parts[0] === "signup") return { route: "signup" };
  if (parts[0] === "dashboard") return { route: "dashboard" };
  if (parts[0] === "about") return { route: "about" };

  if (parts[0] === "challenges" && parts[1]) {
    return { route: "category", params: { category: decodeURIComponent(parts[1]) } };
  }
  if (parts[0] === "challenges") return { route: "challenges" };

  if (parts[0] === "progress") return { route: "progress" };
  if (parts[0] === "hints") return { route: "hints" };
  if (parts[0] === "leaderboard") return { route: "leaderboard" };
  if (parts[0] === "challenge") return { route: "challenge", params: { id: parts[1] || "1" } };
  if (parts[0] === "profile") return { route: "profile" };
  if (parts[0] === "tutorials") return { route: "tutorials" };
  if (parts[0] === "tutorial") return { route: "tutorial", params: { id: parts[1] || "1" } };
  if (parts[0] === "lessons") return { route: "lessons" };
  if (parts[0] === "lesson") return { route: "lesson", params: { id: parts[1] || "1" } };

  // AI Challenge with level parameter
  if (parts[0] === "ai-challenge") {
    const level = parts[1] ? parseInt(parts[1]) : 1;
    console.log("AI Challenge route detected, level:", level);
    return { route: "ai-challenge", params: { level: level } };
  }

  // Web Challenge with level parameter
  if (parts[0] === "web-challenge") {
    const level = parts[1] ? parseInt(parts[1]) : 1;
    return { route: "web-challenge", params: { level: level } };
  }

  // Crypto Challenge
  if (parts[0] === "crypto-challenge") {
    const level = parts[1] ? parseInt(parts[1]) : 1;
    return { route: "crypto-challenge", params: { level: level } };
  }

  // Forensics Challenge
  if (parts[0] === "forensics-challenge") {
    const level = parts[1] ? parseInt(parts[1]) : 1;
    return { route: "forensics-challenge", params: { level: level } };
  }

  // Reverse Challenge
  if (parts[0] === "reverse-challenge") {
    const level = parts[1] ? parseInt(parts[1]) : 1;
    return { route: "reverse-challenge", params: { level: level } };
  }

  // Misc Challenge
  if (parts[0] === "misc-challenge") {
    const level = parts[1] ? parseInt(parts[1]) : 1;
    return { route: "misc-challenge", params: { level: level } };
  }

  // PwnBox / Bandit
  if (parts[0] === "pwnbox") return { route: "pwnbox" };

  if (parts[0] === "admin") return { route: "admin" };

  return { route: "landing" };
}



export default function App() {
  const [route, setRoute] = useState(parseHash());

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const onHashChange = () => {
      const newRoute = parseHash();
      console.log("Hash changed, new route:", newRoute);
      setRoute(newRoute);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const isAuthed = user && Object.prototype.hasOwnProperty.call(user, "user_id");
  const isAdmin = user?.role === "admin";

  const protectedRoutes = [
    "dashboard", "challenges", "category", "challenge", "progress", "hints", "leaderboard", "admin", "profile", "tutorials", "tutorial", "lessons", "lesson", "ai-challenge", "web-challenge", "crypto-challenge", "forensics-challenge", "reverse-challenge", "misc-challenge", "pwnbox", "about"
  ];

  if (protectedRoutes.includes(route.route) && !isAuthed) {
    window.location.hash = "#/login";
    return <Login />;
  }

  console.log("Current route:", route);

  const renderRoute = () => {
    switch (route.route) {
      case "login": return <Login />;
      case "signup": return <Signup />;
      case "dashboard": return <Dashboard />;
      case "challenges": return <Challenges />;
      case "category": return <CategoryChallenges category={route.params?.category} />;
      case "challenge": return <Challenge id={route.params?.id} />;
      case "progress": return <Progress />;
      case "hints": return <Hints />;
      case "leaderboard": return <Leaderboard />;
      case "profile": return <Profile />;
      case "tutorials": return <Tutorials />;
      case "tutorial": return <Tutorial id={route.params?.id} />;
      case "lessons": return <Lessons />;
      case "lesson": return <Lesson id={route.params?.id} />;
      case "about": return <About />;
      case "ai-challenge":
        console.log("Rendering AIChallenge with level:", route.params?.level);
        return <AIChallenge level={route.params?.level} />;
      case "web-challenge":
        return <WebChallenge level={route.params?.level} />;
      case "crypto-challenge":
        return <CryptoChallenge level={route.params?.level} />;
      case "forensics-challenge":
        return <ForensicsChallenge level={route.params?.level} />;
      case "reverse-challenge":
        return <ReverseChallenge level={route.params?.level} />;
      case "misc-challenge":
        return <MiscChallenge level={route.params?.level} />;
      case "pwnbox":
        return <ChakraTerminal />;
      case "admin":
        if (!isAdmin) {
          window.location.hash = "#/dashboard";
          return <Dashboard />;
        }
        return <Admin />;
      default: return <Landing />;
    }
  };

  return (
    <ThemeProvider>
      {renderRoute()}
    </ThemeProvider>
  );
}