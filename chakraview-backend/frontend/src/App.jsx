import React, { useEffect, useState } from "react";
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

function parseHash() {
  const h = window.location.hash || "#/";
  const parts = h.replace("#", "").split("/").filter(Boolean);

  if (parts.length === 0 || parts[0] === "") return { route: "landing" };
  if (parts[0] === "login") return { route: "login" };
  if (parts[0] === "signup") return { route: "signup" };
  if (parts[0] === "dashboard") return { route: "dashboard" };

  if (parts[0] === "challenges" && parts[1]) {
    return { route: "category", params: { category: parts[1] } };
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

  if (parts[0] === "admin") return { route: "admin" };

  return { route: "landing" };
}

export default function App() {
  const [route, setRoute] = useState(parseHash());

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const isAuthed = user && Object.prototype.hasOwnProperty.call(user, "user_id");
  const isAdmin  = user?.role === "admin";

  const protectedRoutes = [
    "dashboard","challenges","category","challenge","progress","hints","leaderboard","admin","profile","tutorials","tutorial","lessons","lesson"
  ];

  if (protectedRoutes.includes(route.route) && !isAuthed) {
    window.location.hash = "#/login";
    return <Login />;
  }
  if (route.route === "admin" && !isAdmin) {
    window.location.hash = "#/login";
    return <Login />;
  }

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
    case "admin": return <Admin />;
    default: return <Landing />;
  }
}