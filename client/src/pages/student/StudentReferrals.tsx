import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ReferralRequestCard } from "@/components/ReferralRequestCard";
import { Button } from "@/components/ui/button";
import { getSentReferralRequests } from "@/lib/api";
import { LayoutDashboard, Search, Users, FileText, Newspaper, PlusCircle, User, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const NAV = [
  { title: "Overview", url: "/student", icon: LayoutDashboard },
  { title: "Discovery", url: "/student/discovery", icon: Search },
  { title: "Connections", url: "/student/connections", icon: Users },
  { title: "My Referrals", url: "/student/referrals", icon: FileText },
  { title: "Posts", url: "/student/posts", icon: Newspaper },
  { title: "Create Post", url: "/student/create-post", icon: PlusCircle },
  { title: "My Profile", url: "/student/profile", icon: User },
];

export default function StudentReferrals() {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !currentUser) return;

    const fetchReferrals = async () => {
      try {
        setLoading(true);
        const requests = await getSentReferralRequests();
        setReferrals(requests);
      } catch (error) {
        console.error("Failed to fetch sent referral requests:", error);
        toast.error("Failed to load referral requests");
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [authLoading, currentUser]);

  if (authLoading || !currentUser) {
    return null;
  }

  return (
    <DashboardLayout navItems={NAV} groupLabel="Student" userName={currentUser.name} userRole="Student" userAvatar={currentUser.avatar} currentUser={currentUser}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">My Referral Requests</h2>
          <p className="text-sm text-muted-foreground">{referrals.length} request{referrals.length !== 1 ? "s" : ""} sent</p>
        </div>
        <Button onClick={() => navigate("/student/posts")}>
          <PlusCircle className="h-4 w-4 mr-1.5" /> New Request
        </Button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading referral requests...
            </div>
          </div>
        ) : referrals.length > 0 ? (
          referrals.map(request => (
            <ReferralRequestCard key={request.id || request._id} request={request} perspective="sender" />
          ))
        ) : (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">No sent requests yet.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
