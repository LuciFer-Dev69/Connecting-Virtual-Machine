import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { NavigationProvider } from "./context/NavigationContext";

// Layouts
import RootLayout from "./layouts/RootLayout";
import RedTeamLayout from "./layouts/RedTeamLayout";
import BlueTeamLayout from "./layouts/BlueTeamLayout";
import AIInjectorLayout from "./layouts/AIInjectorLayout";
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
import AIInjectorDashboard from "./pages/AIInjectorDashboard";
import AIInjectorLab from "./pages/AIInjectorLab";
import RealLifeChallenges from "./pages/RealLifeChallenges";
import RealLifeChallengeDetail from "./pages/RealLifeChallengeDetail";
import RealLifeDashboard from "./pages/RealLifeDashboard";
import RealLifeRoadmap from "./pages/RealLifeRoadmap";
import RealLifeLayout from "./layouts/RealLifeLayout";
import RedTeamDashboard from "./pages/RedTeamDashboard";
import RedTeamRoadmap from "./pages/RedTeamRoadmap";
import BlueTeamDashboard from "./pages/BlueTeamDashboard";
import BlueTeamRoadmap from "./pages/BlueTeamRoadmap";
import Modules from "./pages/Modules";
import SOCDashboard from "./pages/SOCDashboard";

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
              <Route path="dashboard" element={<RedTeamDashboard />} />
              <Route path="roadmap" element={<RedTeamRoadmap />} />
              <Route path="challenges" element={<Challenges initialView="red-roadmap" />} />
              <Route path="category/:category" element={<CategoryChallenges />} />
              <Route path="challenge/:id" element={<Challenge />} />
            </Route>

            {/* Blue Team Section */}
            <Route path="blue-team" element={<BlueTeamLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<BlueTeamDashboard />} />
              <Route path="roadmap" element={<BlueTeamRoadmap />} />
              <Route path="forensics" element={<Challenges initialView="blue-roadmap" />} />
              <Route path="challenge/:id" element={<Challenge />} />
            </Route>

            {/* AI Injector Section */}
            <Route path="ai-injector" element={<AIInjectorLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AIInjectorDashboard />} />
              <Route path="lab" element={<AIInjectorLab />} />
            </Route>

            {/* PwnBox Section (Nested in RootLayout for Top Nav access, or separate?) 
                The prompt asked for separation. But usually PwnBox needs Top Nav to exit.
                If I nest it here, it gets PwnBoxLayout INSIDE RootLayout (nested Outlet).
                Let's check if RootLayout handles nested layout properly. 
                Yes, RootLayout renders <Outlet />, which renders PwnBoxLayout, which renders <Outlet /> (Terminal). 
                Top Nav remains visible. This is good for "Platform" feel.
            */}
            {/* Real Life Section */}
            <Route path="real-life" element={<RealLifeLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<RealLifeDashboard />} />
              <Route path="roadmap" element={<RealLifeRoadmap />} />
              <Route path="scenarios" element={<RealLifeChallenges />} />
              <Route path="challenge/:id" element={<RealLifeChallengeDetail />} />
            </Route>

            <Route path="soc-analyst" element={<SOCDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="admin" element={<AdminRoute><Admin /></AdminRoute>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </NavigationProvider>
    </ThemeProvider >
  );
}
