import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { getCurrentUser, getNotifications, markAllNotificationsRead } from "@/lib/api";
import { LayoutDashboard, Search, Users, FileText, Newspaper, PlusCircle, User as UserIcon, Bell, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

const typeConfig: Record<string, { cls: string }> = {
  connection_request: { cls: "bg-blue-50 text-blue-700 border-blue-200" },
  referral_update: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  admin_notice: { cls: "bg-amber-50 text-amber-700 border-amber-200" },
  post_relevant: { cls: "bg-purple-50 text-purple-700 border-purple-200" },
};

export default function Notifications() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserAndNotifications = async () => {
      try {
        const [userData, notificationsData] = await Promise.all([
          getCurrentUser(),
          getNotifications()
        ]);
        setCurrentUser(userData);
        setNotifications(notificationsData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load notifications",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndNotifications();
  }, [toast]);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error?.message || "Failed to mark notifications as read",
        variant: "destructive",
      });
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout navItems={NAV} groupLabel="Student" userName={currentUser.name} userRole="Student" userAvatar={currentUser.avatar}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Notifications</h2>
          <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
          <Check className="h-3.5 w-3.5 mr-1.5" /> Mark all read
        </Button>
      </div>

      <div className="max-w-2xl space-y-3">
        {notifications.map(n => (
          <div key={n.id} className={cn("flex items-start gap-3 rounded-lg border p-4", !n.read && "bg-secondary/30")}>
            <Bell className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">{n.title}</p>
                <Badge variant="outline" className={cn("text-xs capitalize", typeConfig[n.type]?.cls)}>{n.type.replace("_", " ")}</Badge>
                {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
