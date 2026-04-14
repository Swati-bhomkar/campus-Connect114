import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { USERS, getUsersByRole } from "@/lib/mock-data";
import { LayoutDashboard, Search, Users, FileText, Newspaper, PlusCircle, User, Upload } from "lucide-react";
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
const ALUMNI = getUsersByRole("alumni").filter(u => u.availableForReferrals);

export default function CreateReferralRequest() {
  const navigate = useNavigate();
  const [selectedAlumni, setSelectedAlumni] = useState("");

  const alumni = selectedAlumni ? USERS.find(u => u.id === selectedAlumni) : null;
  const matchScore = alumni ? Math.floor(Math.random() * 30 + 55) : 0;

  return (
    <DashboardLayout navItems={NAV} groupLabel="Student" userName={STUDENT.name} userRole="Student" userAvatar={STUDENT.avatar} currentUser={STUDENT}>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-foreground mb-1">New Referral Request</h2>
        <p className="text-sm text-muted-foreground mb-6">Submit a structured referral request to an alumni</p>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Request Details</CardTitle>
            <CardDescription>All fields are required</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Select Alumni</Label>
              <Select value={selectedAlumni} onValueChange={setSelectedAlumni}>
                <SelectTrigger><SelectValue placeholder="Choose an alumni..." /></SelectTrigger>
                <SelectContent>
                  {ALUMNI.map(a => (
                    <SelectItem key={a.id} value={a.id}>{a.name} — {a.company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Job ID / Posting ID</Label>
                <Input placeholder="e.g. GOO-SWE-2025" />
              </div>
              <div className="space-y-2">
                <Label>Job Role</Label>
                <Input placeholder="e.g. Software Engineer L3" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Company</Label>
              <Input value={alumni?.company || ""} readOnly className="bg-secondary/50" placeholder="Auto-filled from alumni" />
            </div>

            <div className="space-y-2">
              <Label>Upload Resume</Label>
              <div className="rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">PDF only, max 5MB</p>
              </div>
            </div>

            {alumni && (
              <div className="rounded-lg bg-secondary/50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Auto-generated Skills Match</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-border">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${matchScore}%` }} />
                  </div>
                  <span className="text-lg font-bold tabular-nums text-foreground">{matchScore}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Based on your skills vs job requirements</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => navigate("/student/referrals")}>Cancel</Button>
              <Button className="flex-1">Submit Request</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
