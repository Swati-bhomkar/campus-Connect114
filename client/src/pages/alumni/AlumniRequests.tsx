import { DashboardLayout } from "@/components/DashboardLayout";
import { ReferralRequestCard } from "@/components/ReferralRequestCard";
import { USERS, getReferralRequestsForUser } from "@/lib/mock-data";
import { LayoutDashboard, Search, Users, FileText, Newspaper, PlusCircle, User, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ALUMNI = USERS.find(u => u.id === "u1")!;
const NAV = [
  { title: "Overview", url: "/alumni", icon: LayoutDashboard },
  { title: "Discovery", url: "/alumni/discovery", icon: Search },
  { title: "Incoming Requests", url: "/alumni/requests", icon: FileText },
  { title: "Connections", url: "/alumni/connections", icon: Users },
  { title: "My Posts", url: "/alumni/posts", icon: Newspaper },
  { title: "Create Post", url: "/alumni/create-post", icon: PlusCircle },
  { title: "Referral Settings", url: "/alumni/settings", icon: Settings },
  { title: "My Profile", url: "/alumni/profile", icon: User },
];

export default function AlumniRequests() {
  const incoming = getReferralRequestsForUser(ALUMNI.id, "received");

  return (
    <DashboardLayout navItems={NAV} groupLabel="Alumni" userName={ALUMNI.name} userRole="Alumni" userAvatar={ALUMNI.avatar} currentUser={ALUMNI}>
      <h2 className="text-xl font-bold text-foreground mb-1">Incoming Referral Requests</h2>
      <p className="text-sm text-muted-foreground mb-6">{incoming.length} total requests</p>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({incoming.filter(r => r.status === "pending").length})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({incoming.filter(r => r.status === "accepted").length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({incoming.filter(r => r.status === "rejected").length})</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        {["pending", "accepted", "rejected", "all"].map(tab => (
          <TabsContent key={tab} value={tab} className="space-y-3 mt-4">
            {incoming.filter(r => tab === "all" || r.status === tab).map(r => (
              <ReferralRequestCard key={r.id} request={r} perspective="receiver" />
            ))}
            {incoming.filter(r => tab === "all" || r.status === tab).length === 0 && (
              <p className="text-sm text-muted-foreground p-4 rounded-lg bg-secondary/50">No requests in this category</p>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </DashboardLayout>
  );
}
