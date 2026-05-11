import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AlumniRegister from "./pages/AlumniRegister";
import AlumniVerification from "./pages/AlumniVerification";
import Notifications from "./pages/Notifications";
import ProfileView from "./pages/ProfileView";
import NotFound from "./pages/NotFound";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentDiscovery from "./pages/student/StudentDiscovery";
import StudentConnections from "./pages/student/StudentConnections";
import StudentReferrals from "./pages/student/StudentReferrals";
import CreateReferralRequest from "./pages/student/CreateReferralRequest";
import StudentPosts from "./pages/student/StudentPosts";
import CreatePost from "./pages/student/CreatePost";
import StudentProfile from "./pages/student/StudentProfile";

import AlumniDashboard from "./pages/alumni/AlumniDashboard";
import AlumniRequests from "./pages/alumni/AlumniRequests";
import AlumniSettings from "./pages/alumni/AlumniSettings";
import AlumniPosts from "./pages/alumni/AlumniPosts";
import AlumniFeed from "./pages/alumni/AlumniFeed";
import AlumniProfile from "./pages/alumni/AlumniProfile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminVerifications from "./pages/admin/AdminVerifications";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSpam from "./pages/admin/AdminSpam";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminPosts from "./pages/admin/AdminPosts";

const queryClient = new QueryClient();

const roleHome = (role: string) => {
  if (role === "alumni") return "/alumni";
  if (role === "admin") return "/admin";
  return "/student";
};

function RequireRole({ allowedRoles, children }: { allowedRoles?: string[]; children: ReactNode }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!currentUser) return <Navigate to="/login" replace state={{ from: location }} />;

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    const target = currentUser.role === "alumni" && location.pathname === "/student/referrals"
      ? "/alumni/requests"
      : roleHome(currentUser.role);

    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
          {/* Auth */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/student" element={<Register />} />
          <Route path="/register/alumni" element={<AlumniRegister />} />
          <Route path="/verify" element={<AlumniVerification />} />

          {/* Student */}
          <Route path="/student" element={<RequireRole allowedRoles={["student"]}><StudentDashboard /></RequireRole>} />
          <Route path="/student/discovery" element={<RequireRole allowedRoles={["student"]}><StudentDiscovery /></RequireRole>} />
          <Route path="/student/connections" element={<RequireRole allowedRoles={["student"]}><StudentConnections /></RequireRole>} />
          <Route path="/student/referrals" element={<RequireRole allowedRoles={["student"]}><StudentReferrals /></RequireRole>} />
          <Route path="/student/create-referral-request/:postId" element={<RequireRole allowedRoles={["student"]}><CreateReferralRequest /></RequireRole>} />
          <Route path="/student/posts" element={<RequireRole allowedRoles={["student"]}><StudentPosts /></RequireRole>} />
          <Route path="/student/create-post" element={<RequireRole allowedRoles={["student"]}><CreatePost /></RequireRole>} />
          <Route path="/student/profile" element={<RequireRole allowedRoles={["student"]}><StudentProfile /></RequireRole>} />

          {/* Alumni */}
          <Route path="/alumni" element={<RequireRole allowedRoles={["alumni"]}><AlumniDashboard /></RequireRole>} />
          <Route path="/alumni/discovery" element={<RequireRole allowedRoles={["alumni"]}><StudentDiscovery /></RequireRole>} />
          <Route path="/alumni/requests" element={<RequireRole allowedRoles={["alumni"]}><AlumniRequests /></RequireRole>} />
          <Route path="/alumni/connections" element={<RequireRole allowedRoles={["alumni"]}><StudentConnections /></RequireRole>} />
          <Route path="/alumni/posts" element={<RequireRole allowedRoles={["alumni"]}><AlumniPosts /></RequireRole>} />
          <Route path="/alumni/feed" element={<RequireRole allowedRoles={["alumni"]}><AlumniFeed /></RequireRole>} />
          <Route path="/alumni/create-post" element={<RequireRole allowedRoles={["alumni"]}><CreatePost /></RequireRole>} />
          <Route path="/alumni/create-referral-request/:postId" element={<RequireRole allowedRoles={["alumni"]}><CreateReferralRequest /></RequireRole>} />
          <Route path="/alumni/settings" element={<RequireRole allowedRoles={["alumni"]}><AlumniSettings /></RequireRole>} />
          <Route path="/alumni/profile" element={<RequireRole allowedRoles={["alumni"]}><AlumniProfile /></RequireRole>} />

          {/* Admin */}
          <Route path="/admin" element={<RequireRole allowedRoles={["admin"]}><AdminDashboard /></RequireRole>} />
          <Route path="/admin/users" element={<RequireRole allowedRoles={["admin"]}><AdminUsers /></RequireRole>} />
          <Route path="/admin/verifications" element={<RequireRole allowedRoles={["admin"]}><AdminVerifications /></RequireRole>} />
          <Route path="/admin/analytics" element={<RequireRole allowedRoles={["admin"]}><AdminAnalytics /></RequireRole>} />
          <Route path="/admin/spam" element={<RequireRole allowedRoles={["admin"]}><AdminSpam /></RequireRole>} />
          <Route path="/admin/posts" element={<RequireRole allowedRoles={["admin"]}><AdminPosts /></RequireRole>} />
          <Route path="/admin/settings" element={<RequireRole allowedRoles={["admin"]}><AdminSettings /></RequireRole>} />

          {/* Shared */}
          <Route path="/profile/:id" element={<RequireRole><ProfileView /></RequireRole>} />
          <Route path="/notifications" element={<RequireRole><Notifications /></RequireRole>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
