import { DashboardLayout } from "@/components/DashboardLayout";
import { ReferralRequestCard } from "@/components/ReferralRequestCard";
import { Button } from "@/components/ui/button";
import { USERS, getReferralRequestsForUser } from "@/lib/mock-data";
import { LayoutDashboard, Search, Users, FileText, Newspaper, PlusCircle, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NAV = [
  { title: "Overview", url: "/student", icon: LayoutDashboard },
  { title: "Discovery", url: "/student/discovery", icon: Search },
  { title: "Connections", url: "/student/connections", icon: Users },
  { title: "My Referrals", url: "/student/referrals", icon: FileText },
  { title: "Posts", url: "/student/posts", icon: Newspaper },
  { title: "Create Post", url: "/student/create-post", icon: PlusCircle },
  { title: "My Profile", url: "/student/profile", icon: User },
];

const STUDENT = USERS.find(u => u.id === "u4")!;

export default function StudentReferrals() {
  const navigate = useNavigate();
  const referrals = getReferralRequestsForUser(STUDENT.id, "sent");

  return (
    <DashboardLayout navItems={NAV} groupLabel="Student" userName={STUDENT.name} userRole="Student" userAvatar={STUDENT.avatar} currentUser={STUDENT}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">My Referral Requests</h2>
          <p className="text-sm text-muted-foreground">{referrals.length} request{referrals.length !== 1 ? "s" : ""} sent</p>
        </div>
        <Button onClick={() => navigate("/student/create-referral")}>
          <PlusCircle className="h-4 w-4 mr-1.5" /> New Request
        </Button>
      </div>

      <div className="space-y-3">
        {referrals.map(r => (
          <ReferralRequestCard key={r.id} request={r} perspective="sender" />
        ))}
        {referrals.length === 0 && (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">No referral requests yet.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
