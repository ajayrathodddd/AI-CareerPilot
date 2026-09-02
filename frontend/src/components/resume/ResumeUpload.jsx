import { useRef, useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Target,
  BriefcaseBusiness,
  GraduationCap,
  LayoutList,
} from "lucide-react";

function ResumeUpload({
  showUpload = true,
  onUploadSuccess,
  resumeResult,
  onContinue,
}) {
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const getDisplayText = (value) => {
    if (typeof value === "string") {
      return value;
    }

    if (typeof value === "number") {
      return String(value);
    }

    if (value && typeof value === "object") {
      return (
        value.name ||
        value.skill ||
        value.title ||
        value.label ||
        value.message ||
        value.detail ||
        JSON.stringify(value)
      );
    }

    return "";
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setError("");
    setSelectedFile(null);

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF resume files are supported.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume PDF must be smaller than 5 MB.");
      return;
    }

    setSelectedFile(file);
  };

  const saveResumeHistory = async (data) => {
    const savedUser = localStorage.getItem("careerpilot_user");

    if (!savedUser) {
      throw new Error("User session not found.");
    }

    const loggedInUser = JSON.parse(savedUser);

    const userId =
      loggedInUser.id ||
      loggedInUser._id ||
      loggedInUser.email;

    if (!userId) {
      throw new Error("User ID not found.");
    }

    const score = Number(data.ats_analysis?.score || 0);

    const response = await fetch(
      "http://localhost:8000/api/v1/history",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          analysis_type: "resume",
          title: data.filename || "Resume Analysis",
          score: score,
          resume_id: data.resume_id || null,
          summary: `Resume ATS score: ${score}/100`,
        }),
      }
    );

    const historyData = await response.json();

    if (!response.ok) {
      let errorMessage = "Could not save resume history.";

      if (Array.isArray(historyData.detail)) {
        errorMessage = historyData.detail
          .map((item) => {
            if (typeof item === "string") {
              return item;
            }

            return (
              item?.msg ||
              item?.message ||
              JSON.stringify(item)
            );
          })
          .join(", ");
      } else if (typeof historyData.detail === "string") {
        errorMessage = historyData.detail;
      } else if (historyData.detail) {
        errorMessage =
          historyData.detail?.msg ||
          historyData.detail?.message ||
          JSON.stringify(historyData.detail);
      }

      throw new Error(errorMessage);
    }

    return historyData;
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please choose a resume PDF first.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(
        "http://localhost:8000/api/v1/resume/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "Resume upload failed.";

        if (Array.isArray(data.detail)) {
          errorMessage = data.detail
            .map((item) => getDisplayText(item))
            .filter(Boolean)
            .join(", ");
        } else if (typeof data.detail === "string") {
          errorMessage = data.detail;
        } else if (data.detail) {
          errorMessage = getDisplayText(data.detail);
        }

        throw new Error(errorMessage);
      }

      if (!data.success) {
        throw new Error("Resume analysis failed.");
      }

      await saveResumeHistory(data);

      setSelectedFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      if (onUploadSuccess) {
        onUploadSuccess(data);
      }
    } catch (uploadError) {
      console.error("Resume upload/history error:", uploadError);
      setError(
        uploadError.message || "Something went wrong."
      );
    } finally {
      setUploading(false);
    }
  };

  if (showUpload) {
    return (
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FileText className="h-6 w-6 text-indigo-600" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-slate-900">
              Upload Resume PDF
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Upload your resume to calculate your real ATS score.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800">
                {selectedFile
                  ? selectedFile.name
                  : "Upload your resume and get an AI-powered ATS analysis."}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Only PDF resume files are supported. Maximum size: 5 MB.
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <Upload className="h-4 w-4" />
                Choose PDF
              </button>

              <button
                type="button"
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? "Analyzing..." : "Upload"}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (!resumeResult) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50">
            <FileText className="h-7 w-7 text-indigo-600" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            No Resume Analysis Yet
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Upload your resume from the Dashboard first. Your complete ATS
            analysis will appear here.
          </p>
        </div>
      </div>
    );
  }

  const ats = resumeResult.ats_analysis || {};
  const breakdown = ats.breakdown || {};
  const skillsAnalysis = resumeResult.skills_analysis || {};

  const skills = Array.isArray(skillsAnalysis.skills)
    ? skillsAnalysis.skills
        .map((skill) => getDisplayText(skill))
        .filter(Boolean)
    : [];

  const suggestions = Array.isArray(ats.suggestions)
    ? ats.suggestions
        .map((suggestion) => getDisplayText(suggestion))
        .filter(Boolean)
    : [];

  const breakdownItems = [
    {
      label: "Content",
      value: Number(breakdown.content || 0),
      max: 25,
      icon: LayoutList,
    },
    {
      label: "Skills",
      value: Number(breakdown.skills || 0),
      max: 25,
      icon: Sparkles,
    },
    {
      label: "Experience",
      value: Number(breakdown.experience || 0),
      max: 20,
      icon: BriefcaseBusiness,
    },
    {
      label: "Education",
      value: Number(breakdown.education || 0),
      max: 15,
      icon: GraduationCap,
    },
    {
      label: "Formatting",
      value: Number(breakdown.formatting || 0),
      max: 15,
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">
          Resume Analyzer
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Resume Analysis
        </h1>

        <p className="mt-2 text-slate-500">
          AI-powered ATS analysis of your uploaded resume.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50">
              <FileText className="h-7 w-7 text-indigo-600" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Uploaded Resume
              </p>

              <h2 className="mt-1 break-all text-lg font-bold text-slate-900">
                {resumeResult.filename || "Resume PDF"}
              </h2>

              <div className="mt-2 flex items-center gap-2 text-sm text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                Analysis completed
              </div>
            </div>
          </div>

          <div className="flex h-32 w-32 shrink-0 flex-col items-center justify-center rounded-full border-8 border-indigo-100">
            <span className="text-3xl font-bold text-indigo-600">
              {ats.score || 0}
            </span>

            <span className="text-xs font-medium text-slate-500">
              / 100 ATS
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-3">
              <Target className="h-5 w-5 text-indigo-600" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                ATS Score
              </h2>

              <p className="text-sm text-slate-500">
                Resume compatibility score
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold text-slate-900">
                {ats.score || 0}
              </span>

              <span className="mb-2 text-sm text-slate-400">
                /100
              </span>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all"
                style={{
                  width: `${Math.min(
                    Math.max(Number(ats.score || 0), 0),
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-50 p-3">
              <Sparkles className="h-5 w-5 text-violet-600" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Detected Skills
              </h2>

              <p className="text-sm text-slate-500">
                {skills.length} skills detected
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                No technical skills detected.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Score Breakdown
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            See how your resume performed in each ATS category.
          </p>
        </div>

        <div className="mt-6 space-y-5">
          {breakdownItems.map((item) => {
            const Icon = item.icon;
            const percentage = (item.value / item.max) * 100;

            return (
              <div key={item.label}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-100 p-2">
                      <Icon className="h-4 w-4 text-slate-600" />
                    </div>

                    <span className="text-sm font-semibold text-slate-800">
                      {item.label}
                    </span>
                  </div>

                  <span className="text-sm font-bold text-slate-700">
                    {item.value}/{item.max}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-600"
                    style={{
                      width: `${Math.min(
                        Math.max(percentage, 0),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-50 p-3">
            <Sparkles className="h-5 w-5 text-amber-600" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Improvement Suggestions
            </h2>

            <p className="text-sm text-slate-500">
              Recommendations to improve your ATS score.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-xl bg-slate-50 p-4"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />

                <p className="text-sm leading-6 text-slate-700">
                  {suggestion}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">
              No improvement suggestions available.
            </p>
          )}
        </div>
      </div>

      {onContinue && (
        <div className="flex justify-end">
          <button
            onClick={onContinue}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Continue to Job Matcher →
          </button>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;