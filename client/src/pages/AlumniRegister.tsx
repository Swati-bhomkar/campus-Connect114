import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Check, AlertCircle, CheckCircle2,
  Briefcase, GraduationCap, Laptop, Clock, Upload, Shield, ShieldCheck, ShieldAlert, ShieldOff,
  Search, XCircle, FileText, Lock,
} from "lucide-react";

const BLOCKED_DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "protonmail.com", "icloud.com", "aol.com", "mail.com", "yandex.com"];

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

// Pre-uploaded student/alumni CSV database for verification
const ALUMNI_DATABASE = [
  { regNo: "CSE2018001", name: "Rahul Sharma", batch: "2018" },
  { regNo: "CSE2018002", name: "Priya Patel", batch: "2018" },
  { regNo: "CSE2019001", name: "Aman Gupta", batch: "2019" },
  { regNo: "CSE2019002", name: "Sneha Kulkarni", batch: "2019" },
  { regNo: "CSE2020001", name: "Vikram Desai", batch: "2020" },
  { regNo: "CSE2020002", name: "Ananya Reddy", batch: "2020" },
  { regNo: "ISE2019001", name: "Kiran Naik", batch: "2019" },
  { regNo: "ISE2020001", name: "Megha Joshi", batch: "2020" },
  { regNo: "ECE2018001", name: "Rohan Hegde", batch: "2018" },
  { regNo: "ECE2019001", name: "Divya Patil", batch: "2019" },
];

type AlumniStatus = "working" | "higher_studies" | "freelancer" | "not_working";
type CollegeVerification = "verified" | "pending" | "none";

const STATUS_OPTIONS: { value: AlumniStatus; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: "working", label: "Working Professional", icon: <Briefcase className="h-5 w-5" />, desc: "Employed at a company" },
  { value: "higher_studies", label: "Higher Studies", icon: <GraduationCap className="h-5 w-5" />, desc: "Pursuing further education" },
  { value: "freelancer", label: "Freelancer / Self-employed", icon: <Laptop className="h-5 w-5" />, desc: "Independent professional" },
  { value: "not_working", label: "Not Working / Preparing", icon: <Clock className="h-5 w-5" />, desc: "Currently preparing for opportunities" },
];

const BADGE_INFO: Record<AlumniStatus, { label: string; color: string; icon: React.ReactNode; canRefer: boolean }> = {
  working: { label: "Verified Professional", color: "text-[hsl(var(--success))]", icon: <ShieldCheck className="h-4 w-4" />, canRefer: true },
  higher_studies: { label: "Verified Higher Studies", color: "text-primary", icon: <Shield className="h-4 w-4" />, canRefer: false },
  freelancer: { label: "Self-declared", color: "text-[hsl(var(--warning))]", icon: <ShieldAlert className="h-4 w-4" />, canRefer: false },
  not_working: { label: "Unverified Alumni", color: "text-muted-foreground", icon: <ShieldOff className="h-4 w-4" />, canRefer: false },
};

export default function AlumniRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1: Basic Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2: College Verification
  const [collegeEmail, setCollegeEmail] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [passOutYear, setPassOutYear] = useState("");
  const [collegeVerification, setCollegeVerification] = useState<CollegeVerification>("none");
  const [regVerified, setRegVerified] = useState<boolean | null>(null);
  const [matchedName, setMatchedName] = useState("");
  const [collegeDocUploaded, setCollegeDocUploaded] = useState(false);

  // Step 3: Current Status
  const [currentStatus, setCurrentStatus] = useState<AlumniStatus | "">("");

  // Step 4: Dynamic fields
  const [companyName, setCompanyName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [workEmailValid, setWorkEmailValid] = useState<boolean | null>(null);
  const [documentUploaded] = useState(false);
  const [collegeName, setCollegeName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [collegeProofUploaded, setCollegeProofUploaded] = useState(false);
  const [freelanceDomain, setFreelanceDomain] = useState("");
  const [freelanceSkills, setFreelanceSkills] = useState<string[]>([]);

  // Step 5/6: Domain & Skills
  const [domain, setDomain] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const passwordsMatch = password.length >= 8 && password === confirmPassword;

  const verifyRegNumber = (reg: string) => {
    setRegNumber(reg);
    if (reg.length >= 6) {
      const match = ALUMNI_DATABASE.find(
        (s) => s.regNo.toLowerCase() === reg.toLowerCase()
      );
      if (match) {
        setRegVerified(true);
        setMatchedName(match.name);
        setCollegeVerification("verified");
      } else {
        setRegVerified(false);
        setMatchedName("");
        setCollegeVerification("none");
      }
    } else {
      setRegVerified(null);
      setMatchedName("");
      setCollegeVerification("none");
    }
  };

  const validateWorkEmail = (email: string) => {
    setWorkEmail(email);
    if (email.includes("@") && email.length > 5) {
      const emailDomain = email.split("@")[1]?.toLowerCase();
      const blocked = BLOCKED_DOMAINS.some((d) => emailDomain === d);
      setWorkEmailValid(!blocked && emailDomain.includes("."));
    } else {
      setWorkEmailValid(null);
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleFreelanceSkill = (skill: string) => {
    setFreelanceSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  // Steps: 1-Basic, 2-College, 3-Status, 4-DynamicFields, 5-Verification(if needed), 6-Skills
  const needsVerification = currentStatus === "working" || currentStatus === "higher_studies";
  const totalSteps = needsVerification ? 6 : 5;

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Personal Information";
      case 2: return "College Verification";
      case 3: return "Current Status";
      case 4: return "Professional Details";
      case 5: return needsVerification ? "Verification" : "Domain & Skills";
      case 6: return "Domain & Skills";
      default: return "";
    }
  };

  const getStepDesc = () => {
    switch (step) {
      case 1: return "Tell us about yourself";
      case 2: return "Verify your college identity";
      case 3: return "What are you doing now?";
      case 4: return currentStatus === "working" ? "Your current employment details"
        : currentStatus === "higher_studies" ? "Your current education details"
        : currentStatus === "freelancer" ? "Your freelance skills & domain"
        : "We'll match you with relevant opportunities";
      case 5: return needsVerification
        ? (currentStatus === "working" ? "Verify your work status" : "Verify your education status")
        : "Select your professional domain (optional)";
      case 6: return "Select your professional domain (optional)";
      default: return "";
    }
  };

  const isLastStep = () => step === totalSteps;
  const skillsStep = totalSteps;

  const canProceedStep2 = () => {
    return (collegeVerification === "verified" || collegeDocUploaded) && passOutYear !== "";
  };

  const getAccountStatus = () => {
    if (collegeVerification !== "verified" && !collegeDocUploaded) return { label: "Incomplete", access: "No access" };
    if (collegeDocUploaded && collegeVerification !== "verified") return { label: "Pending Admin Approval", access: "Limited access — cannot give referrals" };
    if (currentStatus === "working") {
      if (workEmailValid || documentUploaded) return { label: "Verified Professional", access: "Full access — can give referrals" };
      return { label: "Pending Verification", access: "Limited access — cannot give referrals until verified" };
    }
    if (currentStatus === "higher_studies") {
      if (collegeProofUploaded) return { label: "Verified Higher Studies", access: "Can provide guidance — cannot give referrals" };
      return { label: "Pending Verification", access: "Limited access" };
    }
    if (currentStatus === "freelancer") return { label: "Self-declared", access: "Can provide guidance — cannot give referrals" };
    return { label: "Unverified Alumni", access: "Limited access — guidance only" };
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
            CC
          </div>
          <h1 className="text-2xl font-bold text-foreground">Alumni Registration</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Step {Math.min(step, totalSteps)} of {totalSteps}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6 flex gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i + 1 <= step ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{getStepTitle()}</CardTitle>
            <CardDescription>{getStepDesc()}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input placeholder="Rahul" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input placeholder="Sharma" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
                  {password.length > 0 && password.length < 8 && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Must be at least 8 characters
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
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
              </div>
            )}

            {/* Step 2: College Verification */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Registration Number <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Input
                      placeholder="CSE2020001"
                      value={regNumber}
                      onChange={(e) => verifyRegNumber(e.target.value)}
                      className="pr-10"
                    />
                    {regVerified === true && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--success))]" />}
                    {regVerified === false && <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />}
                  </div>
                  {regVerified === true && (
                    <div className="rounded-md border border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5 p-3">
                      <p className="text-sm text-[hsl(var(--success))] flex items-center gap-2 font-medium">
                        <CheckCircle2 className="h-4 w-4" /> Match Found — College Verified Alumni
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Matched: {matchedName}</p>
                    </div>
                  )}
                  {regVerified === false && (
                    <div className="space-y-3">
                      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
                        <p className="text-sm text-destructive flex items-center gap-2 font-medium">
                          <XCircle className="h-4 w-4" /> No Match — Registration number not found in college database
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          You can still register by uploading a college document for admin review.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Upload College ID / Marks Card</Label>
                        <div
                          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 cursor-pointer transition-colors ${
                            collegeDocUploaded
                              ? "border-[hsl(var(--success))]/50 bg-[hsl(var(--success))]/5"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => { setCollegeDocUploaded(true); setCollegeVerification("pending"); }}
                        >
                          {collegeDocUploaded ? (
                            <>
                              <CheckCircle2 className="h-6 w-6 text-[hsl(var(--success))] mb-1" />
                              <p className="text-sm font-medium text-foreground">Document uploaded</p>
                              <p className="text-xs text-muted-foreground">college_id.pdf — Pending admin approval</p>
                            </>
                          ) : (
                            <>
                              <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                              <p className="text-sm font-medium text-foreground">Click to upload</p>
                              <p className="text-xs text-muted-foreground">PDF, JPG, PNG — Max 5MB</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Pass-out Year <span className="text-destructive">*</span></Label>
                  <Select value={passOutYear} onValueChange={setPassOutYear}>
                    <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                    <SelectContent>
                      {[2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].map((y) => (
                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>College Email <span className="text-xs text-muted-foreground">(optional but preferred)</span></Label>
                  <Input type="email" placeholder="name@klebcahubli.in" value={collegeEmail} onChange={(e) => setCollegeEmail(e.target.value)} />
                  {collegeEmail && !collegeEmail.endsWith("@klebcahubli.in") && collegeEmail.includes("@") && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Must end with @klebcahubli.in
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Current Status */}
            {step === 3 && (
              <div className="space-y-4">
                <RadioGroup value={currentStatus} onValueChange={(v) => setCurrentStatus(v as AlumniStatus)}>
                  {STATUS_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-colors ${
                        currentStatus === opt.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-secondary/50"
                      }`}
                    >
                      <RadioGroupItem value={opt.value} />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-primary">{opt.icon}</div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{opt.label}</p>
                          <p className="text-xs text-muted-foreground">{opt.desc}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </RadioGroup>

                {currentStatus && (
                  <div className={`rounded-md border p-3 flex items-center gap-2 text-sm ${
                    BADGE_INFO[currentStatus].canRefer ? "border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5" : "border-border bg-secondary/30"
                  }`}>
                    <span className={BADGE_INFO[currentStatus].color}>{BADGE_INFO[currentStatus].icon}</span>
                    <div>
                      <p className={`font-medium ${BADGE_INFO[currentStatus].color}`}>
                        Badge: {BADGE_INFO[currentStatus].label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {BADGE_INFO[currentStatus].canRefer
                          ? "You will be able to give referrals after verification."
                          : "You can provide career guidance but cannot give referrals."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Dynamic Fields Based on Status */}
            {step === 4 && currentStatus === "working" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Company Name <span className="text-destructive">*</span></Label>
                  <Input placeholder="e.g. Google, Infosys, TCS" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Work Email <span className="text-destructive">*</span></Label>
                  <Input
                    type="email"
                    placeholder="name@company.com"
                    value={workEmail}
                    onChange={(e) => validateWorkEmail(e.target.value)}
                  />
                  {workEmailValid === true && (
                    <p className="text-xs text-[hsl(var(--success))] flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Valid work email domain
                    </p>
                  )}
                  {workEmailValid === false && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Personal email domains (Gmail, Yahoo, etc.) are not allowed
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">Must be a corporate email — no gmail/yahoo/outlook</p>
                </div>
              </div>
            )}

            {step === 4 && currentStatus === "higher_studies" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>University / Institution Name <span className="text-destructive">*</span></Label>
                  <Input placeholder="e.g. IIT Bombay, MIT" value={collegeName} onChange={(e) => setCollegeName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Course / Program <span className="text-destructive">*</span></Label>
                  <Input placeholder="e.g. M.Tech Computer Science" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
                </div>
              </div>
            )}

            {step === 4 && currentStatus === "freelancer" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Primary Domain <span className="text-destructive">*</span></Label>
                  <Select value={freelanceDomain} onValueChange={(v) => { setFreelanceDomain(v); setFreelanceSkills([]); }}>
                    <SelectTrigger><SelectValue placeholder="Select your domain" /></SelectTrigger>
                    <SelectContent>
                      {DOMAINS.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {freelanceDomain && (
                  <div className="space-y-2">
                    <Label>Key Skills</Label>
                    <div className="flex flex-wrap gap-2">
                      {(SKILLS_MAP[freelanceDomain] || []).map((skill) => (
                        <button
                          key={skill}
                          onClick={() => toggleFreelanceSkill(skill)}
                          className={`inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm transition-colors ${
                            freelanceSkills.includes(skill)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-foreground hover:bg-secondary"
                          }`}
                        >
                          {freelanceSkills.includes(skill) && <Check className="h-3 w-3" />}
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 4 && currentStatus === "not_working" && (
              <div className="space-y-4">
                <div className="rounded-md border border-border bg-secondary/30 p-4 text-center">
                  <Clock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium text-foreground">No additional details required</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You'll be assigned the <strong>Unverified Alumni</strong> badge. You can update your status later when your situation changes.
                  </p>
                </div>
                <div className="rounded-md border border-border bg-secondary/10 p-3 flex items-center gap-2 text-sm">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Unverified alumni have limited access — you can browse and receive guidance but cannot give referrals.
                  </p>
                </div>
              </div>
            )}

            {/* Step 5: Verification (Working Professional) */}
            {step === 5 && needsVerification && currentStatus === "working" && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
                    <p className="text-sm text-foreground flex items-center gap-2">
                      <Search className="h-4 w-4 text-primary" />
                      Verifying: <strong>{workEmail || "—"}</strong>
                    </p>
                    {workEmailValid && companyName && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Domain matches company profile for <strong>{companyName}</strong>
                      </p>
                    )}
                  </div>
                  {workEmailValid ? (
                    <div className="rounded-md border border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5 p-3">
                      <p className="text-sm text-[hsl(var(--success))] flex items-center gap-2 font-medium">
                        <CheckCircle2 className="h-4 w-4" /> Work email verified
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        A verification link will be sent to {workEmail}. Badge: <strong>Verified Professional</strong>
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-md border border-border bg-secondary/30 p-3">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" /> Enter a valid work email in Step 4 to verify via email
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Verification (Higher Studies) */}
            {step === 5 && needsVerification && currentStatus === "higher_studies" && (
              <div className="space-y-4">
                <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
                  <p className="text-sm text-foreground">
                    Verifying enrollment at <strong>{collegeName || "—"}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Program: {courseName || "—"}</p>
                </div>
                <div className="space-y-3">
                  <Label>Upload College ID / Admission Letter</Label>
                  <div
                    className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors ${
                      collegeProofUploaded
                        ? "border-[hsl(var(--success))]/50 bg-[hsl(var(--success))]/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setCollegeProofUploaded(true)}
                  >
                    {collegeProofUploaded ? (
                      <>
                        <CheckCircle2 className="h-8 w-8 text-[hsl(var(--success))] mb-2" />
                        <p className="text-sm font-medium text-foreground">Document uploaded</p>
                        <p className="text-xs text-muted-foreground">college_id.pdf — Pending admin review</p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium text-foreground">Click to upload</p>
                        <p className="text-xs text-muted-foreground">PDF, JPG, PNG — Max 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Final Step: Domain & Skills */}
            {step === skillsStep && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Domain</Label>
                  <Select value={domain} onValueChange={(v) => { setDomain(v); setSelectedSkills([]); }}>
                    <SelectTrigger><SelectValue placeholder="Select your domain" /></SelectTrigger>
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

                {/* Account Status Summary */}
                <div className="mt-4 rounded-lg border border-border bg-secondary/20 p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Account Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span className="text-foreground font-medium">{firstName} {lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">College Status</span>
                      <Badge variant={collegeVerification === "verified" ? "default" : "outline"} className="text-xs">
                        {collegeVerification === "verified" ? "College Verified" : "Pending Approval"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Status</span>
                      <span className="text-foreground text-xs">{STATUS_OPTIONS.find(o => o.value === currentStatus)?.label || "—"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Verification Badge</span>
                      {currentStatus && (
                        <span className={`flex items-center gap-1 text-xs font-medium ${BADGE_INFO[currentStatus].color}`}>
                          {BADGE_INFO[currentStatus].icon} {BADGE_INFO[currentStatus].label}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Access Level</span>
                      <span className="text-xs text-foreground">{getAccountStatus().access.split("—")[0]}</span>
                    </div>
                  </div>
                  {currentStatus && !BADGE_INFO[currentStatus].canRefer && (
                    <div className="rounded-md border border-border bg-secondary/30 p-2 flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        Referral privileges require <strong>Verified Professional</strong> status.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-6 flex gap-3">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              )}
              {isLastStep() ? (
                <Button className="flex-1" onClick={() => navigate("/alumni")}>
                  Create Account
                </Button>
              ) : (
                <Button
                  className="flex-1"
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 2 && !canProceedStep2()) ||
                    (step === 3 && !currentStatus)
                  }
                >
                  Next <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <button className="text-primary hover:underline" onClick={() => navigate("/login", { state: { role: "alumni" } })}>
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
