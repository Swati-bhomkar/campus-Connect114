import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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

const BLOCKED_DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "protonmail.com", "icloud.com"];

export default function AlumniRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1: Basic Info + College Verification
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("idle");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Step 2: Credentials
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [collegeEmail, setCollegeEmail] = useState("");
  const [passOutYear, setPassOutYear] = useState("");

  // Step 3: Status Selection
  const [accountStatus, setAccountStatus] = useState<"working" | "higher_studies" | "freelancer" | "not_working" | "">("");

  // Step 4: Dynamic Fields
  const [companyName, setCompanyName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [workEmailValid, setWorkEmailValid] = useState<boolean | null>(null);
  const [collegeName, setCollegeName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [freelanceSkills, setFreelanceSkills] = useState<string[]>([]);
  const [freelanceDomain, setFreelanceDomain] = useState("");
  const [summary, setSummary] = useState("");

  // Step 5: Domain & Skills (optional)
  const [domain, setDomain] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const passwordsMatch = password.length >= 8 && password === confirmPassword;

  const handleVerifyAlumni = async () => {
    setIsVerifying(true);
    setVerificationError(null);
    setVerificationStatus("idle");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-alumni`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          registrationNumber: regNumber.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setVerificationStatus("error");
        setVerificationError(data.message || "Verification failed");
      } else {
        setVerificationStatus("success");
        setTimeout(() => setStep(2), 800);
      }
    } catch (error) {
      setVerificationStatus("error");
      setVerificationError(error instanceof Error ? error.message : "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const validateWorkEmail = (email: string) => {
    setWorkEmail(email);
    if (email.includes("@") && email.length > 5) {
      const emailDomain = email.split("@")[1]?.toLowerCase();
      const blocked = BLOCKED_DOMAINS.includes(emailDomain);
      setWorkEmailValid(!blocked && emailDomain.includes("."));
    } else {
      setWorkEmailValid(null);
    }
  };

  const toggleFreelanceSkill = (skill: string) => {
    setFreelanceSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleRegister = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register-alumni`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          registrationNumber: regNumber.trim(),
          password,
          confirmPassword,
          collegeEmail: collegeEmail || null,
          passOutYear: parseInt(passOutYear),
          accountStatus,
          companyName: accountStatus === "working" ? companyName : null,
          workEmail: accountStatus === "working" ? workEmail : null,
          collegeName: accountStatus === "higher_studies" ? collegeName : null,
          courseName: accountStatus === "higher_studies" ? courseName : null,
          freelanceSkills: accountStatus === "freelancer" ? freelanceSkills : [],
          freelanceDomain: accountStatus === "freelancer" ? freelanceDomain : null,
          summary: accountStatus === "freelancer" ? summary : null,
          domain: domain || null,
          skills: selectedSkills,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSubmissionSuccess(true);
      setTimeout(() => navigate("/alumni"), 1500);
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedStep4 = () => {
    if (accountStatus === "working") {
      return companyName && workEmail && workEmailValid;
    }
    if (accountStatus === "higher_studies") {
      return collegeName && courseName;
    }
    if (accountStatus === "freelancer") {
      return freelanceDomain && freelanceSkills.length > 0;
    }
    return true; // not_working
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
            CC
          </div>
          <h1 className="text-2xl font-bold text-foreground">Alumni Registration</h1>
          <p className="mt-1 text-sm text-muted-foreground">Step {step} of 5</p>
        </div>

        {/* Progress */}
        <div className="mb-6 flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i + 1 <= step ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              {step === 1 && "College Verification"}
              {step === 2 && "Account Credentials"}
              {step === 3 && "Current Status"}
              {step === 4 && "Professional Details"}
              {step === 5 && "Domain & Skills"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Verify your college identity"}
              {step === 2 && "Create your password"}
              {step === 3 && "What are you doing now?"}
              {step === 4 && accountStatus === "working" ? "Your employment details"
                : accountStatus === "higher_studies" ? "Your education details"
                : accountStatus === "freelancer" ? "Your freelance profile"
                : "Complete your profile"}
              {step === 5 && "Select your domain and skills (optional)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* STEP 1: College Verification */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      placeholder="Anjali"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={verificationStatus === "success"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      placeholder="Jartarghar"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={verificationStatus === "success"}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Registration Number</Label>
                  <Input
                    placeholder="222123"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    disabled={verificationStatus === "success"}
                  />
                </div>

                {verificationStatus === "success" && (
                  <div className="rounded-md border border-green-300 bg-green-50 p-3">
                    <p className="text-sm text-green-700 flex items-center gap-2 font-medium">
                      <CheckCircle2 className="h-4 w-4" /> Verification Successful
                    </p>
                  </div>
                )}

                {verificationStatus === "error" && (
                  <div className="rounded-md border border-red-300 bg-red-50 p-3">
                    <p className="text-sm text-red-700 flex items-center gap-2 font-medium">
                      <AlertCircle className="h-4 w-4" /> {verificationError}
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleVerifyAlumni}
                  disabled={!firstName || !lastName || !regNumber || isVerifying || verificationStatus === "success"}
                  className="w-full"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : verificationStatus === "success" ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Verified
                    </>
                  ) : (
                    "Verify & Continue"
                  )}
                </Button>
              </div>
            )}

            {/* STEP 2: Credentials */}
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
                    <p className="text-xs text-red-600 flex items-center gap-1">
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
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Passwords do not match
                    </p>
                  )}
                  {passwordsMatch && confirmPassword.length > 0 && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Passwords match
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Pass-out Year</Label>
                  <Input
                    type="number"
                    placeholder="2025"
                    value={passOutYear}
                    onChange={(e) => setPassOutYear(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>College Email (optional)</Label>
                  <Input
                    type="email"
                    placeholder="name@college.edu"
                    value={collegeEmail}
                    onChange={(e) => setCollegeEmail(e.target.value)}
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!password || !confirmPassword || !passwordsMatch || !passOutYear}
                    className="flex-1"
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: Status Selection */}
            {step === 3 && (
              <div className="space-y-4">
                <RadioGroup value={accountStatus} onValueChange={(val) => setAccountStatus(val as any)}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-accent">
                      <RadioGroupItem value="working" id="working" />
                      <Label htmlFor="working" className="flex-1 cursor-pointer">
                        <div className="font-medium">Working Professional</div>
                        <div className="text-sm text-muted-foreground">Employed at a company</div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-accent">
                      <RadioGroupItem value="higher_studies" id="higher_studies" />
                      <Label htmlFor="higher_studies" className="flex-1 cursor-pointer">
                        <div className="font-medium">Higher Studies</div>
                        <div className="text-sm text-muted-foreground">Pursuing further education</div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-accent">
                      <RadioGroupItem value="freelancer" id="freelancer" />
                      <Label htmlFor="freelancer" className="flex-1 cursor-pointer">
                        <div className="font-medium">Freelancer / Self-employed</div>
                        <div className="text-sm text-muted-foreground">Independent professional</div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-accent">
                      <RadioGroupItem value="not_working" id="not_working" />
                      <Label htmlFor="not_working" className="flex-1 cursor-pointer">
                        <div className="font-medium">Not Working</div>
                        <div className="text-sm text-muted-foreground">Currently preparing for opportunities</div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={() => setStep(4)} disabled={!accountStatus} className="flex-1">
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4: Dynamic Fields */}
            {step === 4 && (
              <div className="space-y-4">
                {accountStatus === "working" && (
                  <>
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input
                        placeholder="Tech Corp Ltd"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Work Email</Label>
                      <Input
                        type="email"
                        placeholder="name@company.com"
                        value={workEmail}
                        onChange={(e) => validateWorkEmail(e.target.value)}
                      />
                      {workEmail && !workEmailValid && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> Use your corporate email, not personal
                        </p>
                      )}
                      {workEmailValid && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Valid work email
                        </p>
                      )}
                    </div>
                  </>
                )}

                {accountStatus === "higher_studies" && (
                  <>
                    <div className="space-y-2">
                      <Label>College/University Name</Label>
                      <Input
                        placeholder="University of Example"
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Course Name</Label>
                      <Input
                        placeholder="M.Tech Computer Science"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {accountStatus === "freelancer" && (
                  <>
                    <div className="space-y-2">
                      <Label>Domain/Specialization</Label>
                      <Input
                        placeholder="Web Development"
                        value={freelanceDomain}
                        onChange={(e) => setFreelanceDomain(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Skills (select at least 1)</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {["React", "Node.js", "Python", "Java", "AWS", "Docker", "UI/UX", "Data Analysis"].map(
                          (skill) => (
                            <button
                              key={skill}
                              onClick={() => toggleFreelanceSkill(skill)}
                              className={`rounded border px-3 py-2 text-sm transition ${
                                freelanceSkills.includes(skill)
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-background hover:bg-accent"
                              }`}
                            >
                              {skill}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>About Your Work</Label>
                      <Input
                        placeholder="Brief summary of your freelance work"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {accountStatus === "not_working" && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                    <p className="text-sm text-blue-700">
                      You can update your status and details later when your situation changes.
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={() => setStep(5)} disabled={!canProceedStep4()} className="flex-1">
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 5: Domain & Skills */}
            {step === 5 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Professional Domain (optional)</Label>
                  <Select value={domain} onValueChange={setDomain}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(SKILLS_MAP).map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {domain && (
                  <div className="space-y-2">
                    <Label>Skills</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {SKILLS_MAP[domain]?.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`rounded border px-3 py-2 text-sm transition ${
                            selectedSkills.includes(skill)
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background hover:bg-accent"
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {submissionError && (
                  <div className="rounded-md border border-red-300 bg-red-50 p-3">
                    <p className="text-sm text-red-700 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" /> {submissionError}
                    </p>
                  </div>
                )}

                {submissionSuccess && (
                  <div className="rounded-md border border-green-300 bg-green-50 p-3">
                    <p className="text-sm text-green-700 flex items-center gap-2 font-medium">
                      <CheckCircle2 className="h-4 w-4" /> Registration successful! Redirecting to login...
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(4)} className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    onClick={handleRegister}
                    disabled={isSubmitting || submissionSuccess}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Complete Registration
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
