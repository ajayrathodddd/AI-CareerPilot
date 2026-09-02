import { useEffect, useState } from "react";
import ResumeUpload from "./components/resume/ResumeUpload";
import JobMatcher from "./components/job/jobMatcher";
import LearningRoadmap from "./components/learning/LearningRoadmap";
import InterviewAI from "./components/interview/InterviewAI";
import AuthPage from "./components/auth/AuthPage";
import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  X,
  LogOut,
  Mail,
  ShieldCheck,
  Bell,
  Lock,
  Save,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Resume Analyzer", icon: FileText },
  { name: "Job Matcher", icon: BriefcaseBusiness },
  { name: "Learning Roadmap", icon: GraduationCap },
  { name: "Interview AI", icon: MessageSquareText },
  { name: "Analysis History", icon: BarChart3 },
];

function App() {
  const [active, setActive] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resumeResult, setResumeResult] = useState(null);
  const [jobMatchResult, setJobMatchResult] = useState(null);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileUsername, setProfileUsername] = useState("");
  const [profileRole, setProfileRole] = useState("Career Explorer");
  const [profileSavedLocal, setProfileSavedLocal] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("careerpilot_user");
    const token = localStorage.getItem("careerpilot_token");

    if (savedUser && token) {
      try {
        const parsedUser = JSON.parse(savedUser);

        setUser(parsedUser);
        setProfileUsername(parsedUser.username || "");
        setProfileRole(parsedUser.role || "Career Explorer");
      } catch {
        localStorage.removeItem("careerpilot_user");
        localStorage.removeItem("careerpilot_token");
      }
    }
  }, []);

  useEffect(() => {
    const savedSettings = localStorage.getItem("careerpilot_settings");

    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);

        if (typeof parsedSettings.notifications === "boolean") {
          setNotifications(parsedSettings.notifications);
        }

        if (typeof parsedSettings.emailUpdates === "boolean") {
          setEmailUpdates(parsedSettings.emailUpdates);
        }
      } catch {
        localStorage.removeItem("careerpilot_settings");
      }
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/health")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend request failed");
        }

        return response.json();
      })
      .then((data) => {
        console.log("CareerPilot API:", data);
      })
      .catch((error) => {
        console.error("CareerPilot API error:", error);
      });
  }, []);

  const loadHistory = async () => {
    if (!user) {
      return;
    }

    setHistoryLoading(true);
    setHistoryError("");

    try {
      const userId = user.id || user._id || user.email;

      const response = await fetch(
        `http://localhost:8000/api/v1/history?user_id=${encodeURIComponent(
          userId
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Could not load analysis history."
        );
      }

      setHistory(data.history || []);
    } catch (error) {
      console.error("History API error:", error);
      setHistoryError(error.message || "Could not load analysis history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (user && active === "Analysis History") {
      loadHistory();
    }
  }, [user, active]);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setProfileUsername(loggedInUser.username || "");
    setProfileRole(loggedInUser.role || "Career Explorer");
    setActive("Dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("careerpilot_token");
    localStorage.removeItem("careerpilot_user");

    setUser(null);
    setResumeResult(null);
    setJobMatchResult(null);
    setHistory([]);
    setActive("Dashboard");
  };

  const getSkillName = (skill, index) => {
    if (typeof skill === "string") {
      return skill;
    }

    if (typeof skill === "number") {
      return String(skill);
    }

    if (skill && typeof skill === "object") {
      return (
        skill.name ||
        skill.skill ||
        skill.title ||
        skill.label ||
        skill.skill_name ||
        skill.keyword ||
        `Skill ${index + 1}`
      );
    }

    return `Skill ${index + 1}`;
  };

  const normalizeResumeResult = (result) => {
    if (!result || typeof result !== "object") {
      return result;
    }

    const skills = result?.skills_analysis?.skills;

    if (!Array.isArray(skills)) {
      return result;
    }

    return {
      ...result,
      skills_analysis: {
        ...result.skills_analysis,
        skills: skills.map((skill, index) =>
          getSkillName(skill, index)
        ),
      },
    };
  };

  const handleResumeUploaded = (result) => {
    const normalizedResult = normalizeResumeResult(result);

    console.log("Resume result:", normalizedResult);

    setResumeResult(normalizedResult);
    setJobMatchResult(null);
    setActive("Resume Analyzer");
  };

  const handleJobMatchSuccess = (result) => {
    setJobMatchResult(result);
    setActive("Learning Roadmap");
  };

  const saveProfile = () => {
    const updatedUser = {
      ...user,
      username: profileUsername.trim() || user.username,
      role: profileRole.trim() || "Career Explorer",
    };

    setUser(updatedUser);
    setProfileUsername(updatedUser.username);
    setProfileRole(updatedUser.role);

    localStorage.setItem(
      "careerpilot_user",
      JSON.stringify(updatedUser)
    );

    setProfileSavedLocal(true);

    setTimeout(() => {
      setProfileSavedLocal(false);
    }, 2000);
  };

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const renderDashboard = () => {
    const score =
      Number(resumeResult?.ats_analysis?.score) || 0;

    const detectedSkills =
      resumeResult?.skills_analysis?.skills || [];

    const skills =
      resumeResult?.skills_analysis?.total_skills ??
      detectedSkills.length;

    const filename =
      resumeResult?.filename || "";

    const jobMatch =
      Number(jobMatchResult?.match_score) || 0;

    const missingSkills =
      jobMatchResult?.missing_skills?.length || 0;

    return (
      <>
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">
            Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {user.username}.
          </h1>

          <p className="mt-2 text-slate-500">
            Track your career progress and improve your job readiness.
          </p>
        </div>

        {!resumeResult && (
          <div className="mb-6">
            <ResumeUpload
              onUploadSuccess={handleResumeUploaded}
            />
          </div>
        )}

        {resumeResult && (
          <div className="mb-6 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-emerald-50 p-3">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Resume Uploaded
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {filename}
                  </p>

                  <p className="mt-1 text-xs text-emerald-600">
                    {skills} skills detected
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActive("Resume Analyzer")}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                View Resume Analysis
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-indigo-50 p-3">
                <FileText className="h-5 w-5 text-indigo-600" />
              </div>

              {resumeResult && (
                <span className="text-sm font-semibold text-emerald-600">
                  Analyzed
                </span>
              )}
            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
              Resume Score
            </p>

            <div className="mt-1 flex items-end gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {score}
              </span>

              <span className="mb-1 text-sm text-slate-400">
                /100
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-cyan-50 p-3">
                <Target className="h-5 w-5 text-cyan-600" />
              </div>

              <span className="text-sm font-semibold text-slate-400">
                {jobMatchResult ? "Analyzed" : "Ready"}
              </span>
            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
              Job Match
            </p>

            <div className="mt-1 flex items-end gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {jobMatch}%
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-violet-50 p-3">
                <BrainCircuit className="h-5 w-5 text-violet-600" />
              </div>

              <span className="text-sm font-semibold text-slate-400">
                Detected
              </span>
            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
              Skills Ready
            </p>

            <div className="mt-1 flex items-end gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {skills}
              </span>

              <span className="mb-1 text-sm text-slate-400">
                skills
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-emerald-50 p-3">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>

              <span className="text-sm font-semibold text-slate-400">
                Career
              </span>
            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
              Missing Skills
            </p>

            <div className="mt-1 flex items-end gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {missingSkills}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Career Readiness
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your current career readiness score.
                </p>
              </div>

              <div className="rounded-xl bg-indigo-50 p-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
              </div>
            </div>

            <div className="mt-6 flex h-72 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-indigo-50">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
                    <div>
                      <p className="text-3xl font-bold text-indigo-600">
                        {score}
                      </p>

                      <p className="text-xs text-slate-400">
                        / 100
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-5 font-semibold text-slate-800">
                  Career Readiness Score
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Keep improving your resume and skills.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Next Best Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Improve your profile with these actions.
            </p>

            <div className="mt-5 space-y-3">
              <button
                onClick={() => setActive("Resume Analyzer")}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition hover:border-indigo-200 hover:bg-indigo-50"
              >
                <div className="rounded-lg bg-slate-100 p-2">
                  <FileText className="h-4 w-4 text-slate-700" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    Improve your resume
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Review your ATS analysis.
                  </p>
                </div>
              </button>

              <button
                onClick={() => setActive("Job Matcher")}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition hover:border-indigo-200 hover:bg-indigo-50"
              >
                <div className="rounded-lg bg-slate-100 p-2">
                  <Target className="h-4 w-4 text-slate-700" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    Match a new job
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Compare your skills with a target role.
                  </p>
                </div>
              </button>

              <button
                onClick={() => setActive("Learning Roadmap")}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition hover:border-indigo-200 hover:bg-indigo-50"
              >
                <div className="rounded-lg bg-slate-100 p-2">
                  <BookOpen className="h-4 w-4 text-slate-700" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    Learn missing skills
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Follow your personalized roadmap.
                  </p>
                </div>
              </button>

              <button
                onClick={() => setActive("Interview AI")}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition hover:border-indigo-200 hover:bg-indigo-50"
              >
                <div className="rounded-lg bg-slate-100 p-2">
                  <MessageSquareText className="h-4 w-4 text-slate-700" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    Practice interview
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Prepare with AI-generated questions.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Top Skills
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Skills detected in your current resume.
                </p>
              </div>

              <Sparkles className="h-5 w-5 text-indigo-500" />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {detectedSkills.length > 0 ? (
                detectedSkills.map((skill, index) => {
                  const skillName = getSkillName(skill, index);

                  return (
                    <span
                      key={`${skillName}-${index}`}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700"
                    >
                      {skillName}
                    </span>
                  );
                })
              ) : (
                <p className="text-sm text-slate-400">
                  Upload your resume to detect skills.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recent Analyses
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest career activity.
                </p>
              </div>

              <BarChart3 className="h-5 w-5 text-slate-500" />
            </div>

            <div className="mt-5 space-y-3">
              {resumeResult && (
                <button
                  onClick={() => setActive("Resume Analyzer")}
                  className="flex w-full items-center justify-between rounded-xl bg-slate-50 p-4 text-left transition hover:bg-indigo-50"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Resume Analysis
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {filename}
                    </p>
                  </div>

                  <span className="font-bold text-indigo-600">
                    {score}/100
                  </span>
                </button>
              )}

              {jobMatchResult && (
                <button
                  onClick={() => setActive("Job Matcher")}
                  className="flex w-full items-center justify-between rounded-xl bg-slate-50 p-4 text-left transition hover:bg-indigo-50"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Job Match Analysis
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Latest job compatibility result
                    </p>
                  </div>

                  <span className="font-bold text-cyan-600">
                    {jobMatch}%
                  </span>
                </button>
              )}

              {!resumeResult && !jobMatchResult && (
                <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                  No career analysis yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderAnalysisHistory = () => {
    const resumeRecords = history.filter(
      (item) => item.analysis_type === "resume"
    );

    const jobRecords = history.filter(
      (item) => item.analysis_type === "job_match"
    );

    const latestResume = resumeRecords[0];
    const latestJob = jobRecords[0];

    const resumeScore =
      Number(latestResume?.score) || 0;

    const jobScore =
      Number(latestJob?.match_percentage) || 0;

    const resumeChartData = [...resumeRecords]
      .reverse()
      .map((item) => ({
        date: item.created_at
          ? new Date(item.created_at).toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
              }
            )
          : "Unknown",
        score: Number(item.score) || 0,
      }));

    const jobChartData = [...jobRecords]
      .reverse()
      .map((item) => ({
        date: item.created_at
          ? new Date(item.created_at).toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
              }
            )
          : "Unknown",
        score: Number(item.match_percentage) || 0,
      }));

    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <BarChart3 className="h-7 w-7 text-indigo-600" />

              <h1 className="text-2xl font-bold text-slate-900">
                Analysis History
              </h1>
            </div>

            <p className="mt-1 text-slate-500">
              Track your career analyses saved in your CareerPilot account.
            </p>
          </div>

          <button
            type="button"
            onClick={loadHistory}
            disabled={historyLoading}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {historyLoading ? "Loading..." : "Refresh History"}
          </button>
        </div>

        {historyError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {historyError}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-indigo-100 p-3">
                <FileText className="h-5 w-5 text-indigo-600" />
              </div>

              <span className="text-sm font-semibold text-indigo-600">
                Resume
              </span>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Latest Resume Score
            </p>

            <p className="mt-1 text-4xl font-bold text-slate-900">
              {resumeScore}

              <span className="ml-1 text-base font-medium text-slate-400">
                /100
              </span>
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-indigo-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
                style={{
                  width: `${Math.min(resumeScore, 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-cyan-100 p-3">
                <Target className="h-5 w-5 text-cyan-600" />
              </div>

              <span className="text-sm font-semibold text-cyan-600">
                Job Match
              </span>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Latest Job Match
            </p>

            <p className="mt-1 text-4xl font-bold text-slate-900">
              {jobScore}

              <span className="ml-1 text-base font-medium text-slate-400">
                %
              </span>
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-cyan-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                style={{
                  width: `${Math.min(jobScore, 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-violet-100 p-3">
                <TrendingUp className="h-5 w-5 text-violet-600" />
              </div>

              <span className="text-sm font-semibold text-violet-600">
                Activity
              </span>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Total Analyses
            </p>

            <p className="mt-1 text-4xl font-bold text-slate-900">
              {history.length}
            </p>

            <p className="mt-4 text-sm text-violet-600">
              Career activity tracked
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-100">
                    Resume Performance
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    ATS Score Trend
                  </h2>
                </div>

                <div className="rounded-xl bg-white/15 p-3">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-5 flex items-end gap-2">
                <span className="text-4xl font-bold">
                  {resumeScore}
                </span>

                <span className="mb-1 text-indigo-100">
                  /100
                </span>
              </div>
            </div>

            <div className="h-80 p-5">
              {resumeChartData.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <AreaChart data={resumeChartData}>
                    <defs>
                      <linearGradient
                        id="resumeGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#4f46e5"
                          stopOpacity={0.65}
                        />

                        <stop
                          offset="100%"
                          stopColor="#a78bfa"
                          stopOpacity={0.08}
                        />
                      </linearGradient>
                    </defs>

                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: "#64748b",
                      }}
                    />

                    <YAxis
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: "#64748b",
                      }}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: "14px",
                        border: "1px solid #e2e8f0",
                        boxShadow:
                          "0 10px 30px rgba(15, 23, 42, 0.12)",
                      }}
                      formatter={(value) => [
                        `${value}/100`,
                        "ATS Score",
                      ]}
                    />

                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#4f46e5"
                      fill="url(#resumeGradient)"
                      strokeWidth={4}
                      dot={{
                        r: 6,
                        fill: "#4f46e5",
                        strokeWidth: 3,
                        stroke: "#ffffff",
                      }}
                      activeDot={{
                        r: 8,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="mx-auto h-10 w-10 text-indigo-200" />

                    <p className="mt-3 font-semibold text-slate-700">
                      No resume trend yet
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Analyze your resume to start tracking progress.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-cyan-100 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-cyan-100">
                    Job Compatibility
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Job Match Trend
                  </h2>
                </div>

                <div className="rounded-xl bg-white/15 p-3">
                  <Target className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-5 flex items-end gap-2">
                <span className="text-4xl font-bold">
                  {jobScore}
                </span>

                <span className="mb-1 text-cyan-100">
                  %
                </span>
              </div>
            </div>

            <div className="h-80 p-5">
              {jobChartData.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <AreaChart data={jobChartData}>
                    <defs>
                      <linearGradient
                        id="jobGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#06b6d4"
                          stopOpacity={0.65}
                        />

                        <stop
                          offset="100%"
                          stopColor="#3b82f6"
                          stopOpacity={0.08}
                        />
                      </linearGradient>
                    </defs>

                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: "#64748b",
                      }}
                    />

                    <YAxis
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: "#64748b",
                      }}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: "14px",
                        border: "1px solid #e2e8f0",
                        boxShadow:
                          "0 10px 30px rgba(15, 23, 42, 0.12)",
                      }}
                      formatter={(value) => [
                        `${value}%`,
                        "Job Match",
                      ]}
                    />

                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#0891b2"
                      fill="url(#jobGradient)"
                      strokeWidth={4}
                      dot={{
                        r: 6,
                        fill: "#0891b2",
                        strokeWidth: 3,
                        stroke: "#ffffff",
                      }}
                      activeDot={{
                        r: 8,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <Target className="mx-auto h-10 w-10 text-cyan-200" />

                    <p className="mt-3 font-semibold text-slate-700">
                      No job match trend yet
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Analyze a job to start tracking compatibility.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Career Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your latest career performance.
              </p>
            </div>

            <Sparkles className="h-5 w-5 text-indigo-500" />
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-indigo-700">
                  Resume
                </span>

                <FileText className="h-5 w-5 text-indigo-600" />
              </div>

              <p className="mt-4 text-3xl font-bold text-slate-900">
                {resumeScore}/100
              </p>

              <div className="mt-4 h-2 rounded-full bg-white">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                  style={{
                    width: `${Math.min(resumeScore, 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-cyan-700">
                  Job Match
                </span>

                <Target className="h-5 w-5 text-cyan-600" />
              </div>

              <p className="mt-4 text-3xl font-bold text-slate-900">
                {jobScore}%
              </p>

              <div className="mt-4 h-2 rounded-full bg-white">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  style={{
                    width: `${Math.min(jobScore, 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-violet-700">
                  Analyses
                </span>

                <BarChart3 className="h-5 w-5 text-violet-600" />
              </div>

              <p className="mt-4 text-3xl font-bold text-slate-900">
                {history.length}
              </p>

              <p className="mt-2 text-sm text-violet-600">
                Total career analyses
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Analysis Records
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your analysis results stored in MongoDB.
              </p>
            </div>

            <BarChart3 className="h-5 w-5 text-slate-500" />
          </div>

          <div className="mt-6 space-y-3">
            {historyLoading ? (
              <div className="rounded-xl bg-slate-50 p-8 text-center">
                <p className="text-sm font-medium text-slate-500">
                  Loading your analysis history...
                </p>
              </div>
            ) : history.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-8 text-center">
                <BarChart3 className="mx-auto h-10 w-10 text-slate-400" />

                <p className="mt-3 font-semibold text-slate-700">
                  No analysis history yet
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Your resume and job analyses will appear here.
                </p>
              </div>
            ) : (
              history.map((item) => {
                const isResume =
                  item.analysis_type === "resume";

                const score = isResume
                  ? Number(item.score) || 0
                  : Number(item.match_percentage) || 0;

                const formattedDate = item.created_at
                  ? new Date(
                      item.created_at
                    ).toLocaleString("en-IN")
                  : "Unknown date";

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5 transition hover:border-indigo-100 hover:bg-indigo-50 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`rounded-xl p-3 ${
                          isResume
                            ? "bg-indigo-50"
                            : "bg-cyan-50"
                        }`}
                      >
                        {isResume ? (
                          <FileText className="h-5 w-5 text-indigo-600" />
                        ) : (
                          <Target className="h-5 w-5 text-cyan-600" />
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">
                          {item.title}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {isResume
                            ? "Resume Analysis"
                            : "Job Match Analysis"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {formattedDate}
                        </p>
                      </div>
                    </div>

                    <div className="text-left md:text-right">
                      <p
                        className={`text-2xl font-bold ${
                          isResume
                            ? "text-indigo-600"
                            : "text-cyan-600"
                        }`}
                      >
                        {score}
                        {isResume ? "/100" : "%"}
                      </p>

                      {item.summary && (
                        <p className="mt-1 max-w-md text-xs text-slate-500">
                          {item.summary}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderProfileSettings = () => {
    const initials = profileUsername
      ? profileUsername.slice(0, 2).toUpperCase()
      : "RA";

    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3">
            <UserRound className="h-7 w-7 text-indigo-600" />

            <h1 className="text-2xl font-bold text-slate-900">
              Profile & Settings
            </h1>
          </div>

          <p className="mt-1 text-slate-500">
            Manage your CareerPilot profile information.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
              {initials}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {profileUsername || "Career Explorer"}
              </h2>

              <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>

              <p className="mt-2 flex items-center gap-2 text-sm text-emerald-600">
                <ShieldCheck className="h-4 w-4" />
                {profileRole}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Account Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update your personal CareerPilot information.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Username
              </label>

              <input
                type="text"
                value={profileUsername}
                onChange={(event) =>
                  setProfileUsername(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </label>

              <input
                type="email"
                value={user.email || ""}
                readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500 outline-none"
              />

              <p className="mt-2 text-xs text-slate-400">
                Email is managed through your account authentication.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Career Role
              </label>

              <select
                value={profileRole}
                onChange={(event) =>
                  setProfileRole(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="Career Explorer">
                  Career Explorer
                </option>

                <option value="Frontend Developer">
                  Frontend Developer
                </option>

                <option value="Backend Developer">
                  Backend Developer
                </option>

                <option value="Full Stack Developer">
                  Full Stack Developer
                </option>

                <option value="Software Engineer">
                  Software Engineer
                </option>

                <option value="Data Analyst">
                  Data Analyst
                </option>

                <option value="Data Scientist">
                  Data Scientist
                </option>

                <option value="AI/ML Engineer">
                  AI/ML Engineer
                </option>

                <option value="DevOps Engineer">
                  DevOps Engineer
                </option>

                <option value="Cybersecurity Analyst">
                  Cybersecurity Analyst
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Account Status
              </label>

              <div className="flex h-[46px] items-center rounded-xl bg-emerald-50 px-4">
                <ShieldCheck className="mr-2 h-5 w-5 text-emerald-600" />

                <span className="text-sm font-semibold text-emerald-700">
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={saveProfile}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              <Save className="h-5 w-5" />

              {profileSavedLocal
                ? "Profile Saved"
                : "Save Profile"}
            </button>

            {profileSavedLocal && (
              <span className="text-sm font-medium text-emerald-600">
                Your profile has been updated successfully.
              </span>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Career Profile
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your current CareerPilot analysis status.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Resume Status
                  </p>

                  <p className="mt-2 font-bold text-slate-900">
                    {resumeResult
                      ? "Analyzed"
                      : "Not uploaded"}
                  </p>
                </div>

                <div
                  className={`rounded-xl p-3 ${
                    resumeResult
                      ? "bg-emerald-50"
                      : "bg-slate-100"
                  }`}
                >
                  <FileText
                    className={`h-5 w-5 ${
                      resumeResult
                        ? "text-emerald-600"
                        : "text-slate-500"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Job Match Status
                  </p>

                  <p className="mt-2 font-bold text-slate-900">
                    {jobMatchResult
                      ? "Analyzed"
                      : "Not analyzed"}
                  </p>
                </div>

                <div
                  className={`rounded-xl p-3 ${
                    jobMatchResult
                      ? "bg-cyan-50"
                      : "bg-slate-100"
                  }`}
                >
                  <Target
                    className={`h-5 w-5 ${
                      jobMatchResult
                        ? "text-cyan-600"
                        : "text-slate-500"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-white p-3">
              <Sparkles className="h-5 w-5 text-indigo-600" />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                CareerPilot Profile
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Keep your profile updated so CareerPilot can provide a
                better career development experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    const saveSettings = () => {
      localStorage.setItem(
        "careerpilot_settings",
        JSON.stringify({
          notifications,
          emailUpdates,
        })
      );

      setProfileSaved(true);

      setTimeout(() => {
        setProfileSaved(false);
      }, 2000);
    };

    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3">
            <Settings className="h-7 w-7 text-indigo-600" />

            <h1 className="text-2xl font-bold text-slate-900">
              Settings
            </h1>
          </div>

          <p className="mt-1 text-slate-500">
            Manage your CareerPilot preferences and account settings.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
              <Bell className="h-6 w-6 text-indigo-600" />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              Notifications
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Stay updated with your career progress.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              Security
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your CareerPilot account is protected.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50">
              <UserRound className="h-6 w-6 text-violet-600" />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              Account
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage your CareerPilot account.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Notification Preferences
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose how CareerPilot keeps you informed.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-slate-100 p-5">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-indigo-50 p-3">
                  <Bell className="h-5 w-5 text-indigo-600" />
                </div>

                <div>
                  <p className="font-semibold text-slate-800">
                    Career Notifications
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Get notifications about your career progress.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setNotifications(!notifications)
                }
                className={`relative h-7 w-12 rounded-full transition ${
                  notifications
                    ? "bg-indigo-600"
                    : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                    notifications
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-100 p-5">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-cyan-50 p-3">
                  <Mail className="h-5 w-5 text-cyan-600" />
                </div>

                <div>
                  <p className="font-semibold text-slate-800">
                    Email Updates
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Receive useful career development updates.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEmailUpdates(!emailUpdates)
                }
                className={`relative h-7 w-12 rounded-full transition ${
                  emailUpdates
                    ? "bg-indigo-600"
                    : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                    emailUpdates
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Account Security
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your account authentication is active and protected.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-indigo-600" />

                <div>
                  <p className="font-semibold text-slate-800">
                    Authentication
                  </p>

                  <p className="mt-1 text-sm text-emerald-600">
                    Active
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-indigo-600" />

                <div>
                  <p className="font-semibold text-slate-800">
                    Account Email
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Account Preferences
          </h2>

          <div className="mt-5 rounded-xl bg-slate-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">
                  Career Explorer Mode
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Your account is configured for career development.
                </p>
              </div>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={saveSettings}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            <Save className="h-5 w-5" />

            {profileSaved
              ? "Settings Saved"
              : "Save Settings"}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-6 py-3 font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    );
  };

  const renderPage = () => {
    if (active === "Dashboard") {
      return renderDashboard();
    }

    if (active === "Resume Analyzer") {
      return (
        <ResumeUpload
          showUpload={false}
          onUploadSuccess={handleResumeUploaded}
          resumeResult={resumeResult}
        />
      );
    }

    if (active === "Job Matcher") {
      return (
        <JobMatcher
          resumeResult={resumeResult}
          onMatchSuccess={handleJobMatchSuccess}
        />
      );
    }

    if (active === "Learning Roadmap") {
      return (
        <LearningRoadmap
          resumeResult={resumeResult}
          jobMatchResult={jobMatchResult}
        />
      );
    }

    if (active === "Interview AI") {
      return (
        <InterviewAI
          resumeResult={resumeResult}
          jobMatchResult={jobMatchResult}
        />
      );
    }

    if (active === "Analysis History") {
      return renderAnalysisHistory();
    }

    if (active === "Profile & Settings") {
      return renderProfileSettings();
    }

    if (active === "Settings") {
      return renderSettings();
    }

    return renderDashboard();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
                <Sparkles className="h-5 w-5 text-white" />
              </div>

              <div>
                <h1 className="font-bold text-slate-900">
                  CareerPilot
                </h1>

                <p className="text-xs text-slate-500">
                  AI Career Platform
                </p>
              </div>
            </div>

            <button
              className="lg:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Workspace
            </p>

            <nav className="mt-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const selected = active === item.name;

                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActive(item.name);
                      setMobileOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      selected
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-5 w-5" />

                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>

            <p className="mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Account
            </p>

            <nav className="mt-3 space-y-1">
              <button
                onClick={() => {
                  setActive("Profile & Settings");
                  setMobileOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  active === "Profile & Settings"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <UserRound className="h-5 w-5" />
                Profile & Settings
              </button>

              <button
                onClick={() => {
                  setActive("Settings");
                  setMobileOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  active === "Settings"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Settings className="h-5 w-5" />
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </nav>
          </div>

          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                {user.username
                  ?.slice(0, 2)
                  .toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {user.username}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {user.role || "Career Explorer"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-xl p-2 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="hidden lg:block">
              <p className="text-sm text-slate-500">
                AI-powered career development
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActive("Settings")}
                className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50"
              >
                <Settings className="h-5 w-5" />
              </button>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                {user.username
                  ?.slice(0, 2)
                  .toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;