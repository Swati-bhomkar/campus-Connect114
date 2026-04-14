import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Briefcase } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
            CC
          </div>
          <h1 className="text-3xl font-bold text-foreground">CampusConnect Pro</h1>
          <p className="mt-2 text-muted-foreground">
            College-verified professional networking
          </p>
        </div>

        <p className="mb-6 text-center text-sm font-medium text-foreground">
          I am a…
        </p>

        <div className="grid grid-cols-2 gap-4">
          <Card
            className="cursor-pointer border-2 border-transparent transition-colors hover:border-primary"
            onClick={() => navigate("/login", { state: { role: "student" } })}
          >
            <CardContent className="flex flex-col items-center gap-3 py-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <GraduationCap className="h-7 w-7" />
              </div>
              <span className="text-lg font-semibold text-foreground">Student</span>
              <span className="text-xs text-muted-foreground text-center">
                Current college student
              </span>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer border-2 border-transparent transition-colors hover:border-primary"
            onClick={() => navigate("/login", { state: { role: "alumni" } })}
          >
            <CardContent className="flex flex-col items-center gap-3 py-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Briefcase className="h-7 w-7" />
              </div>
              <span className="text-lg font-semibold text-foreground">Alumni</span>
              <span className="text-xs text-muted-foreground text-center">
                Passed out &amp; working / studying
              </span>
            </CardContent>
          </Card>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Only verified members of <span className="font-medium text-foreground">KLE BCA Hubli</span> can access this platform.
        </p>
      </div>
    </div>
  );
}
