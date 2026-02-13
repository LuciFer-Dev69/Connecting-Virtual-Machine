import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { NavigationProvider } from "./context/NavigationContext";

// Layouts
import RootLayout from "./layouts/RootLayout";
import RedTeamLayout from "./layouts/RedTeamLayout";
import BlueTeamLayout from "./layouts/BlueTeamLayout";
import AILabLayout from "./layouts/AILabLayout";
import RealLifeLayout from "./layouts/RealLifeLayout";
import PwnBoxLayout from "./layouts/PwnBoxLayout";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Challenges from "./pages/Challenges";
import CategoryChallenges from "./pages/CategoryChallenges";
import Challenge from "./pages/Challenge";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import ChakraTerminal from "./pages/ChakraTerminal";
import AIPromptInjectionLab from "./pages/AIPromptInjectionLab";
import AILogAnalyzer from "./pages/AILogAnalyzer";
import RealLifeChallenges from "./pages/RealLifeChallenges";
import RealLifeChallenge from "./pages/RealLifeChallenge";
import Modules from "./pages/Modules";

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAuthed = user && Object.prototype.hasOwnProperty.call(user, "user_id");

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Admin Route Wrapper
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "admin";

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default function App() {
  return (
    <ThemeProvider>
      <NavigationProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* App Routes (Protected) */}
          <Route path="/" element={<ProtectedRoute><RootLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="modules" element={<Modules />} />

            {/* Red Team Section */}
            <Route path="red-team" element={<RedTeamLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Challenges initialView="red-roadmap" />} />
              <Route path="roadmap" element={<Challenges initialView="red-roadmap" />} />
              <Route path="challenges" element={<Challenges initialView="all" />} />
              <Route path="category/:category" element={<CategoryChallenges />} />
              <Route path="challenge/:id" element={<Challenge />} />
            </Route>

            {/* Blue Team Section */}
            <Route path="blue-team" element={<BlueTeamLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Challenges initialView="blue-roadmap" />} />
              <Route path="roadmap" element={<Challenges initialView="blue-roadmap" />} />
              <Route path="forensics" element={<Challenges initialView="blue-roadmap" />} />
              <Route path="alerts" element={<Challenges initialView="blue-roadmap" />} />
            </Route>

            {/* AI Labs Section */}
            <Route path="ai-labs" element={<AILabLayout />}>
              <Route index element={<Navigate to="prompt-injection" replace />} />
              <Route path="prompt-injection" element={<AIPromptInjectionLab />} />
              <Route path="log-analysis" element={<AILogAnalyzer />} />
            </Route>

            {/* Real Life Section */}
            <Route path="real-life" element={<RealLifeLayout />}>
              <Route index element={<Navigate to="corporate" replace />} />
              <Route path="corporate" element={<RealLifeChallenges />} />
              <Route path="infrastructure" element={<RealLifeChallenges />} />
              <Route path="insider" element={<RealLifeChallenges />} />
              <Route path="challenge/:id" element={<RealLifeChallenge />} />
            </Route>

            {/* PwnBox Section (Nested in RootLayout for Top Nav access, or separate?) 
                The prompt asked for separation. But usually PwnBox needs Top Nav to exit.
                If I nest it here, it gets PwnBoxLayout INSIDE RootLayout (nested Outlet).
                Let's check if RootLayout handles nested layout properly. 
                Yes, RootLayout renders <Outlet />, which renders PwnBoxLayout, which renders <Outlet /> (Terminal). 
                Top Nav remains visible. This is good for "Platform" feel.
            */}
            <Route path="pwnbox" element={<PwnBoxLayout />}>
              <Route index element={<ChakraTerminal />} />
            </Route>

            {/* User & Admin */}
            <Route path="profile" element={<Profile />} />
            <Route path="admin" element={<AdminRoute><Admin /></AdminRoute>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </NavigationProvider>
    </ThemeProvider>
  );
}
