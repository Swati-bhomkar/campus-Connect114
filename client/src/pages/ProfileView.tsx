import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/PostCard";
import { ReputationBadge, VerificationBadge, AvailabilityIndicator } from "@/components/StatusBadges";
import { getUserById as getUserByIdAPI, getCurrentUser, sendConnectionRequest, getConnectionStatus, cancelConnectionRequest } from "@/lib/api";
import { renderAvatar } from "@/lib/utils";
import { LayoutDashboard, Search, Users, FileText, Newspaper, PlusCircle, User as UserIcon, UserPlus, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/lib/mock-data";

const NAV = [
  { title: "Overview", url: "/student", icon: LayoutDashboard },
  { title: "Discovery", url: "/student/discovery", icon: Search },
  { title: "Connections", url: "/student/connections", icon: Users },
  { title: "My Referrals", url: "/student/referrals", icon: FileText },
  { title: "Posts", url: "/student/posts", icon: Newspaper },
  { title: "Create Post", url: "/student/create-post", icon: PlusCircle },
  { title: "My Profile", url: "/student/profile", icon: UserIcon },
];

export default function ProfileView() {
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"none" | "pending" | "accepted">("none");
  const { toast } = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await getCurrentUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        setUserLoading(true);
        const [userData, statusData] = await Promise.all([
          getUserByIdAPI(id),
          getConnectionStatus(id)
        ]);
        setUser(userData);
        setConnectionStatus(statusData.status);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleConnect = async () => {
    if (!user || isConnecting) return;

    setIsConnecting(true);
    try {
      if (connectionStatus === "none") {
        // Send connection request
        await sendConnectionRequest(user.id, "career_guidance");
        setConnectionStatus("pending");
        toast({
          title: "Connection request sent",
          description: "The user will be notified of your request.",
        });
      } else if (connectionStatus === "pending") {
        // Cancel connection request
        await cancelConnectionRequest(user.id);
        setConnectionStatus("none");
        toast({
          title: "Connection request cancelled",
          description: "The request has been cancelled.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error?.message || "Failed to process connection request",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (userLoading) {
    return (
      <DashboardLayout navItems={NAV} groupLabel="Student" userName={currentUser.name} userRole="Student" userAvatar={currentUser.avatar} currentUser={currentUser}>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading user...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout navItems={NAV} groupLabel="Student" userName={currentUser.name} userRole="Student" userAvatar={currentUser.avatar} currentUser={currentUser}>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">User not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const userPosts = []; // TODO: Implement posts fetching

  return (
    <DashboardLayout navItems={NAV} groupLabel="Student" userName={currentUser.name} userRole="Student" userAvatar={currentUser.avatar} currentUser={currentUser}>
      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-5">
              {renderAvatar(user.avatar, user.name)}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-foreground">{user.name}</h3>
                  {user.role === "alumni" && <VerificationBadge status={user.companyVerified} />}
                  <ReputationBadge score={user.reputationScore} />
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {user.role === "alumni" ? `${user.company} · ` : "Student · "}Class of {user.passOutYear}
                </p>
                <p className="text-sm text-muted-foreground">{user.domain}</p>
                {user.bio && <p className="text-sm text-foreground mt-2">{user.bio}</p>}
                {user.role === "alumni" && <div className="mt-2"><AvailabilityIndicator available={user.availableForReferrals} /></div>}
              </div>
            </div>

            <div className="flex gap-2 mt-5 pt-4 border-t">
              <Button 
                className="flex-1" 
                onClick={handleConnect}
                disabled={connectionStatus === "accepted" || isConnecting}
              >
                <UserPlus className="h-4 w-4 mr-1.5" /> 
                {isConnecting ? (connectionStatus === "pending" ? "Cancelling..." : "Connecting...") : connectionStatus === "pending" ? "Requested" : connectionStatus === "accepted" ? "Connected" : "Connect"}
              </Button>
              <Button variant="outline" className="flex-1"><Eye className="h-4 w-4 mr-1.5" /> Follow</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Skills</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {user.skills.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Stats</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold tabular-nums text-foreground">{user.reputationScore}</p>
                <p className="text-xs text-muted-foreground">Reputation</p>
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums text-foreground">{user.referralCount}</p>
                <p className="text-xs text-muted-foreground">Referrals</p>
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums text-foreground capitalize">{user.currentStatus}</p>
                <p className="text-xs text-muted-foreground">Status</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User's Posts - Temporarily disabled */}
        {userPosts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Posts by {user.name}</h3>
            <div className="space-y-4">
              {userPosts.map(p => <PostCard key={p.id} post={p} />)}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
