import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, AlertCircle, CheckCircle2, SkipForward, ShieldCheck } from "lucide-react";

const DOMAINS = [
  "Software Engineering", "Data Science", "Frontend Development", "Backend Engineering",
  "Full Stack Development", "DevOps", "Machine Learning", "Cybersecurity",
  "Product Management", "Mobile Development", "Cloud Computing", "Data Engineering",
];

const SKILLS_MAP: Record<string, string[]> = {
  "Software Engineering": ["React", "Node.js", "Java", "Python", "System Design", "DSA", "AWS"],
  "Data Science": ["Python", "ML", "TensorFlow", "SQL", "Statistics", "R", "Tableau"],
  "Frontend Development": ["React", "TypeScript", "Tailwind", "CSS", "Figma", "Vue", "Angular"],
  "Backend Engineering": ["Java", "Spring Boot", "Node.js", "Go", "Microservices", "Kafka", "Redis"],
  "Full Stack Development": ["MERN", "Docker", "Git", "REST APIs", "GraphQL", "PostgreSQL"],
  "DevOps": ["AWS", "Kubernetes", "CI/CD", "Terraform", "Docker", "Linux", "Ansible"],
  "Machine Learning": ["Python", "PyTorch", "NLP", "OpenCV", "Deep Learning", "MLOps"],
  "Cybersecurity": ["Networking", "Pentesting", "Linux", "Python", "OWASP", "Forensics"],
  "Product Management": ["Product Strategy", "Analytics", "SQL", "Figma", "A/B Testing"],
  "Mobile Development": ["React Native", "Flutter", "Firebase", "Swift", "Kotlin"],
  "Cloud Computing": ["AWS", "Azure", "GCP", "Docker", "Linux", "Terraform"],
  "Data Engineering": ["Spark", "Airflow", "Python", "Snowflake", "Kafka", "SQL"],
};

// Student database from uploaded CSV
const STUDENT_DATABASE = [
  { regNo: "223061", name: "ABHISHEK NIMBAL" },
  { regNo: "223062", name: "AISHAWARYA PAYAPPANAVAR" },
  { regNo: "223063", name: "AMAN THAKUR" },
  { regNo: "223064", name: "AMOGH KULKARNI" },
  { regNo: "223065", name: "ANNAPURNA MATHAD" },
  { regNo: "223066", name: "ANUPAMA CHINIWAL" },
  { regNo: "223067", name: "ARSHEEN HARIHAR" },
  { regNo: "223068", name: "ASHRAY HEGDE" },
  { regNo: "223069", name: "ASHWARYA PATIL" },
  { regNo: "223070", name: "ASHWINI SARUR" },
  { regNo: "223071", name: "ASHWINI HULAKUND" },
  { regNo: "223072", name: "BASANAGOUDA NANDIHALLI" },
  { regNo: "223073", name: "CHAITRA NALAWAD" },
  { regNo: "223074", name: "CHANDRAKANTH BHANGIGOUDAR" },
  { regNo: "223075", name: "CHANNABASAVARAJA MATHADA" },
  { regNo: "223076", name: "DARSHAN KADEMANI" },
  { regNo: "223077", name: "DEEKSHA GOUDAPPAGOUDAR" },
  { regNo: "223078", name: "DISHA RAKKASAGIMATH" },
  { regNo: "223079", name: "DURGA PARASHURAM SULAKHE" },
  { regNo: "223080", name: "GAGAN EGANAGOUDAR" },
  { regNo: "223081", name: "GURUPADESH HUBBALLI" },
  { regNo: "223082", name: "KARTHIK REVANAKAR" },
  { regNo: "223083", name: "KARTHIK MULAMUTTAL" },
  { regNo: "223084", name: "KIRAN BANAVI" },
  { regNo: "223085", name: "MAMATHA GADEKAR" },
  { regNo: "223086", name: "MANJUNATH HEDGE" },
  { regNo: "223087", name: "MANOJKUMAR MAHADEVAPPANAVAR" },
  { regNo: "223088", name: "NANDITA TANKSALI" },
  { regNo: "223089", name: "NAVEEN PATIL" },
  { regNo: "223090", name: "NAVYA KUKANUR" },
  { regNo: "223091", name: "NIDHI KULKARNI" },
  { regNo: "223092", name: "NITIN UMRANI" },
  { regNo: "223093", name: "PRAKASH KUMBAR" },
  { regNo: "223094", name: "PRASHANTH CHOUGULE" },
  { regNo: "223095", name: "PRATEEK G KALAL" },
  { regNo: "223096", name: "PRAVEENGOUDA PATIL" },
  { regNo: "223097", name: "PREETI TALIKOTE" },
  { regNo: "223098", name: "RAKSHIT PANDURANGI" },
  { regNo: "223099", name: "RAKSHITA PATIL" },
  { regNo: "223100", name: "RAKSHITHA B" },
  { regNo: "223101", name: "RAVIDARSHANSWAMY HIREMATH" },
  { regNo: "223102", name: "RUFUS K" },
  { regNo: "223103", name: "SAHANA BAVALATTI" },
  { regNo: "223104", name: "SAHANA PATIL" },
  { regNo: "223105", name: "SAHANA PATILA" },
  { regNo: "223106", name: "SAVITHA HIREMATH" },
  { regNo: "223107", name: "SELINA SATTI" },
  { regNo: "223108", name: "SHREEGOURI T" },
  { regNo: "223109", name: "SINCHANA BHAT" },
  { regNo: "223110", name: "SNEHA BELAVAL" },
  { regNo: "223111", name: "SOOKTHI IJARI" },
  { regNo: "223112", name: "SUHAS HONNALLI" },
  { regNo: "223113", name: "SWATHI BOLI" },
  { regNo: "223114", name: "SWATI BHOMKAR" },
  { regNo: "223115", name: "TANUSHREE G" },
  { regNo: "223116", name: "TUSHARAHMED BADEKHANNAVAR" },
  { regNo: "223117", name: "VAISHNAVI MATHAPATI" },
  { regNo: "223118", name: "VARSHA MANAGUNDI" },
  { regNo: "223119", name: "VIKAS PATIL" },
  { regNo: "223120", name: "VISMAY SHEELABHADRA" },
];

const normalize = (s: string) => s.trim().toUpperCase().replace(/\s+/g, " ");

export default function StudentRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1: Identity verification
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [verificationResult, setVerificationResult] = useState<"idle" | "success" | "error">("idle");
  const [matchedStudent, setMatchedStudent] = useState<typeof STUDENT_DATABASE[0] | null>(null);

  // Step 2: Account setup
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [collegeEmail, setCollegeEmail] = useState("");
  const [passOutYear, setPassOutYear] = useState("");
  const [emailValid, setEmailValid] = useState<boolean | null>(null);

  // Step 3: Domain & Skills (optional)
  const [domain, setDomain] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const handleVerify = () => {
    const enteredName = normalize(`${firstName} ${lastName}`);
    const enteredReg = regNumber.trim();

    const match = STUDENT_DATABASE.find(
      (s) => s.regNo === enteredReg && normalize(s.name) === enteredName
    );

    if (match) {
      setVerificationResult("success");
      setMatchedStudent(match);
    } else {
      setVerificationResult("error");
      setMatchedStudent(null);
    }
  };

  const validateEmail = (email: string) => {
    setCollegeEmail(email);
    if (email.length > 5) {
      setEmailValid(email.endsWith("@klebcahubli.in"));
    } else {
      setEmailValid(null);
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const passwordsMatch = password.length >= 8 && password === confirmPassword;
  const canProceedStep1 = verificationResult === "success";
  const canProceedStep2 = passwordsMatch && emailValid === true && passOutYear !== "";

  const totalSteps = 3;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
            CC
          </div>
          <h1 className="text-2xl font-bold text-foreground">Student Registration</h1>
          <p className="mt-1 text-sm text-muted-foreground">Step {step} of {totalSteps}</p>
        </div>

        {/* Progress */}
        <div className="mb-6 flex gap-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              {step === 1 && "Identity Verification"}
              {step === 2 && "Account Setup"}
              {step === 3 && "Domain & Skills"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Verify your identity against college records"}
              {step === 2 && "Set up your password and college details"}
              {step === 3 && "Select your professional domain (optional)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Identity Verification */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      placeholder="Abhishek"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        setVerificationResult("idle");
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      placeholder="Nimbal"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        setVerificationResult("idle");
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Registration Number</Label>
                  <Input
                    placeholder="223061"
                    value={regNumber}
                    onChange={(e) => {
                      setRegNumber(e.target.value);
                      setVerificationResult("idle");
                    }}
                  />
                </div>

                {verificationResult === "error" && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
                    <p className="flex items-center gap-1 text-destructive font-medium">
                      <AlertCircle className="h-4 w-4" /> You are not authorized to register.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      The name and registration number do not match any record in the college database. Contact admin if this is incorrect.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Account Setup */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password.length > 0 && password.length < 8 && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Must be at least 8 characters
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {confirmPassword.length > 0 && !passwordsMatch && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Passwords do not match
                    </p>
                  )}
                  {passwordsMatch && confirmPassword.length > 0 && (
                    <p className="text-xs text-[hsl(var(--success))] flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Passwords match
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>College Email</Label>
                  <Input
                    type="email"
                    placeholder="name@klebcahubli.in"
                    value={collegeEmail}
                    onChange={(e) => validateEmail(e.target.value)}
                  />
                  {emailValid === true && (
                    <p className="text-xs text-[hsl(var(--success))] flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Valid college email domain
                    </p>
                  )}
                  {emailValid === false && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Must end with @klebcahubli.in
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Pass-out Year</Label>
                  <Select value={passOutYear} onValueChange={setPassOutYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {[2024, 2025, 2026, 2027, 2028].map((y) => (
                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Domain & Skills (optional) */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Domain</Label>
                  <Select
                    value={domain}
                    onValueChange={(v) => {
                      setDomain(v);
                      setSelectedSkills([]);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOMAINS.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {domain && (
                  <div className="space-y-2">
                    <Label>Skills (select all that apply)</Label>
                    <div className="flex flex-wrap gap-2">
                      {(SKILLS_MAP[domain] || []).map((skill) => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm transition-colors ${
                            selectedSkills.includes(skill)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-foreground hover:bg-secondary"
                          }`}
                        >
                          {selectedSkills.includes(skill) && <Check className="h-3 w-3" />}
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="mt-6 flex gap-3">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              )}
              {step === 1 && (
                <Button
                  className="flex-1"
                  onClick={() => {
                    const enteredName = normalize(`${firstName} ${lastName}`);
                    const enteredReg = regNumber.trim();
                    const match = STUDENT_DATABASE.find(
                      (s) => s.regNo === enteredReg && normalize(s.name) === enteredName
                    );
                    if (match) {
                      setVerificationResult("success");
                      setMatchedStudent(match);
                      setStep(2);
                    } else {
                      setVerificationResult("error");
                      setMatchedStudent(null);
                    }
                  }}
                  disabled={!firstName.trim() || !lastName.trim() || !regNumber.trim()}
                >
                  Next <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
              {step === 2 && (
                <Button
                  className="flex-1"
                  onClick={() => setStep(3)}
                  disabled={!canProceedStep2}
                >
                  Next <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
              {step === 3 && (
                <div className="flex flex-1 gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/student")}
                  >
                    <SkipForward className="h-4 w-4 mr-1" /> Skip
                  </Button>
                  <Button className="flex-1" onClick={() => navigate("/student")}>
                    Create Account
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <button
            className="text-primary hover:underline"
            onClick={() => navigate("/login", { state: { role: "student" } })}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
