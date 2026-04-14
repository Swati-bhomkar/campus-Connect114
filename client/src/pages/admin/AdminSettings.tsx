import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { USERS } from "@/lib/mock-data";
import { LayoutDashboard, Users, BadgeCheck, BarChart3, ShieldAlert, Settings, Plus, X, Save } from "lucide-react";

const ADMIN = USERS.find(u => u.id === "u15")!;
const NAV = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Verifications", url: "/admin/verifications", icon: BadgeCheck },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Spam & Abuse", url: "/admin/spam", icon: ShieldAlert },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export default function AdminSettings() {
  const [domains, setDomains] = useState(["college.edu"]);
  const [newDomain, setNewDomain] = useState("");
  const [globalMaxReferrals, setGlobalMaxReferrals] = useState([10]);
  const [autoAlumni, setAutoAlumni] = useState(true);

  const addDomain = () => {
    if (newDomain && !domains.includes(newDomain)) {
      setDomains([...domains, newDomain]);
      setNewDomain("");
    }
  };

  return (
    <DashboardLayout navItems={NAV} groupLabel="Admin" userName={ADMIN.name} userRole="Admin" userAvatar={ADMIN.avatar}>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-foreground mb-1">System Settings</h2>
        <p className="text-sm text-muted-foreground mb-6">Configure platform rules and constraints</p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Allowed Email Domains</CardTitle>
              <CardDescription>Only users with these email domains can register</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {domains.map(d => (
                  <Badge key={d} variant="secondary" className="gap-1 pr-1">
                    @{d}
                    <button onClick={() => setDomains(domains.filter(x => x !== d))} className="ml-1 rounded-full hover:bg-foreground/10 p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={newDomain} onChange={e => setNewDomain(e.target.value)} placeholder="e.g. university.ac.in" onKeyDown={e => e.key === "Enter" && addDomain()} />
                <Button variant="outline" size="icon" onClick={addDomain}><Plus className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Referral Limits</CardTitle>
              <CardDescription>System-wide hard caps that override individual settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Global Max Referrals Per Alumni Per Month</Label>
                  <span className="text-sm font-bold tabular-nums text-foreground">{globalMaxReferrals[0]}</span>
                </div>
                <Slider value={globalMaxReferrals} onValueChange={setGlobalMaxReferrals} min={1} max={30} step={1} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Role Management</CardTitle>
              <CardDescription>Automatic role transitions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Auto-promote to Alumni</p>
                  <p className="text-sm text-muted-foreground">Automatically upgrade Student → Alumni when pass-out year is crossed</p>
                </div>
                <Switch checked={autoAlumni} onCheckedChange={setAutoAlumni} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Anti-Abuse</CardTitle>
              <CardDescription>Community flagging and auto-suspension rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Auto-review threshold</p>
                  <p className="text-xs text-muted-foreground">Flags needed to auto-review a user</p>
                </div>
                <span className="text-sm font-bold text-foreground">3</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Auto-suspend threshold</p>
                  <p className="text-xs text-muted-foreground">Flags needed to auto-suspend</p>
                </div>
                <span className="text-sm font-bold text-foreground">5</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Reputation decay</p>
                  <p className="text-xs text-muted-foreground">Monthly decay for inactive alumni</p>
                </div>
                <span className="text-sm font-bold text-foreground">-2 pts/month</span>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full"><Save className="h-4 w-4 mr-1.5" /> Save Settings</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
