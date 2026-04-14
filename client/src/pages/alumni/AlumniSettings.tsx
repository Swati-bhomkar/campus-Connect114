import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { USERS } from "@/lib/mock-data";
import { LayoutDashboard, Search, Users, FileText, Newspaper, PlusCircle, User, Settings, Save } from "lucide-react";

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

export default function AlumniSettings() {
  const [available, setAvailable] = useState(ALUMNI.availableForReferrals);
  const [maxReferrals, setMaxReferrals] = useState([ALUMNI.maxReferralsPerMonth || 5]);
  const [maxResumes, setMaxResumes] = useState([ALUMNI.maxResumesPerDay || 3]);

  return (
    <DashboardLayout navItems={NAV} groupLabel="Alumni" userName={ALUMNI.name} userRole="Alumni" userAvatar={ALUMNI.avatar} currentUser={ALUMNI}>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-foreground mb-1">Referral Settings</h2>
        <p className="text-sm text-muted-foreground mb-6">Control your referral availability and limits</p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Availability</CardTitle>
              <CardDescription>Toggle whether you're accepting referral requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Accept Referral Requests</p>
                  <p className="text-sm text-muted-foreground">{available ? "You're visible to students seeking referrals" : "Students cannot send you referral requests"}</p>
                </div>
                <Switch checked={available} onCheckedChange={setAvailable} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rate Limits</CardTitle>
              <CardDescription>Prevent spam by setting hard caps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Max Referrals Per Month</Label>
                  <span className="text-sm font-bold tabular-nums text-foreground">{maxReferrals[0]}</span>
                </div>
                <Slider value={maxReferrals} onValueChange={setMaxReferrals} min={0} max={20} step={1} />
                <p className="text-xs text-muted-foreground">System enforced — no one can bypass this limit</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Max Resume Reviews Per Day</Label>
                  <span className="text-sm font-bold tabular-nums text-foreground">{maxResumes[0]}</span>
                </div>
                <Slider value={maxResumes} onValueChange={setMaxResumes} min={0} max={10} step={1} />
              </div>
            </CardContent>
          </Card>

          <Button className="w-full">
            <Save className="h-4 w-4 mr-1.5" /> Save Settings
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
