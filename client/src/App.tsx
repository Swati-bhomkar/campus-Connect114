import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

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
import AlumniProfile from "./pages/alumni/AlumniProfile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminVerifications from "./pages/admin/AdminVerifications";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSpam from "./pages/admin/AdminSpam";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminPosts from "./pages/admin/AdminPosts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/student" element={<Register />} />
          <Route path="/register/alumni" element={<AlumniRegister />} />
          <Route path="/verify" element={<AlumniVerification />} />

          {/* Student */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/discovery" element={<StudentDiscovery />} />
          <Route path="/student/connections" element={<StudentConnections />} />
          <Route path="/student/referrals" element={<StudentReferrals />} />
          <Route path="/student/create-referral" element={<CreateReferralRequest />} />
          <Route path="/student/posts" element={<StudentPosts />} />
          <Route path="/student/create-post" element={<CreatePost />} />
          <Route path="/student/profile" element={<StudentProfile />} />

          {/* Alumni */}
          <Route path="/alumni" element={<AlumniDashboard />} />
          <Route path="/alumni/discovery" element={<StudentDiscovery />} />
          <Route path="/alumni/requests" element={<AlumniRequests />} />
          <Route path="/alumni/connections" element={<StudentConnections />} />
          <Route path="/alumni/posts" element={<AlumniPosts />} />
          <Route path="/alumni/create-post" element={<CreatePost />} />
          <Route path="/alumni/settings" element={<AlumniSettings />} />
          <Route path="/alumni/profile" element={<AlumniProfile />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/verifications" element={<AdminVerifications />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/spam" element={<AdminSpam />} />
          <Route path="/admin/posts" element={<AdminPosts />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          {/* Shared */}
          <Route path="/profile/:id" element={<ProfileView />} />
          <Route path="/notifications" element={<Notifications />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
