import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { getCurrentUser, getNotifications, markAllNotificationsRead, acceptConnection, rejectConnection } from "@/lib/api";
import { LayoutDashboard, Search, Users, FileText, Newspaper, PlusCircle, User as UserIcon, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/lib/mock-data";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  connectionId?: string;
}

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
  connection_accepted: { cls: "bg-green-50 text-green-700 border-green-200" },
  referral_update: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  admin_notice: { cls: "bg-amber-50 text-amber-700 border-amber-200" },
  post_relevant: { cls: "bg-purple-50 text-purple-700 border-purple-200" },
};

export default function Notifications() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingActions, setProcessingActions] = useState<Set<string>>(new Set());
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

        // Auto-mark all notifications as read when page loads
        if (notificationsData.length > 0) {
          await markAllNotificationsRead();
          // Update local state to reflect read status
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }
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

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleAcceptConnection = async (notification: Notification) => {
    if (!notification.connectionId) return;

    setProcessingActions(prev => new Set(prev).add(notification.id));

    try {
      await acceptConnection(notification.connectionId);
      toast({
        title: "Connection Accepted",
        description: "You are now connected!",
      });
      // Update notification to remove action buttons (simulate by changing type or adding flag)
      setNotifications(prev => prev.map(n =>
        n.id === notification.id ? { ...n, type: "connection_accepted", title: "Connection Accepted", message: "You accepted this connection request" } : n
      ));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept connection",
        variant: "destructive",
      });
    } finally {
      setProcessingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(notification.id);
        return newSet;
      });
    }
  };

  const handleRejectConnection = async (notification: Notification) => {
    if (!notification.connectionId) return;

    setProcessingActions(prev => new Set(prev).add(notification.id));

    try {
      await rejectConnection(notification.connectionId);
      toast({
        title: "Connection Rejected",
        description: "Connection request rejected",
      });
      // Remove the notification from UI
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject connection",
        variant: "destructive",
      });
    } finally {
      setProcessingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(notification.id);
        return newSet;
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

  return (
    <DashboardLayout navItems={NAV} groupLabel="Student" userName={currentUser.name} userRole="Student" userAvatar={currentUser.avatar}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Notifications</h2>
        <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
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
              {n.type === "connection_request" && n.connectionId && (
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={() => handleAcceptConnection(n)}
                    disabled={processingActions.has(n.id)}
                  >
                    {processingActions.has(n.id) ? "Processing..." : "Accept"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRejectConnection(n)}
                    disabled={processingActions.has(n.id)}
                  >
                    {processingActions.has(n.id) ? "Processing..." : "Reject"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
