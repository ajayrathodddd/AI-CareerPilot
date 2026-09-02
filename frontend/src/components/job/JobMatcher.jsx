import { useState } from "react";
import {
  Target,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  FileText,
  ArrowRight,
  Plus,
  Trash2,
} from "lucide-react";

export default function JobMatcher({
  resumeResult,
  onMatchSuccess,
}) {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "",
      description: "",
      result: null,
      loading: false,
      error: "",
    },
  ]);

  const addJob = () => {
    setJobs((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        description: "",
        result: null,
        loading: false,
        error: "",
      },
    ]);
  };

  const removeJob = (id) => {
    if (jobs.length === 1) return;

    setJobs((prev) => prev.filter((job) => job.id !== id));
  };

  const updateJob = (id, field, value) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? {
              ...job,
              [field]: value,
              error: "",
            }
          : job
      )
    );
  };

  const handleMatch = async (jobId) => {
    const currentJob = jobs.find((job) => job.id === jobId);

    if (!resumeResult?.resume_id) {
      updateJob(
        jobId,
        "error",
        "Please upload your resume from the Dashboard first."
      );
      return;
    }

    if (!currentJob?.description.trim()) {
      updateJob(jobId, "error", "Please enter a job description.");
      return;
    }

    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              loading: true,
              error: "",
              result: null,
            }
          : job
      )
    );

    try {
      const params = new URLSearchParams({
        resume_id: resumeResult.resume_id,
        job_description: currentJob.description,
      });

      const response = await fetch(
        `http://localhost:8000/api/v1/job/match?${params.toString()}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Job matching failed.");
      }

      const matchResult = data.match_result;

      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId
            ? {
                ...job,
                result: matchResult,
                loading: false,
                error: "",
              }
            : job
        )
      );

      if (onMatchSuccess) {
        onMatchSuccess(matchResult);
      }
    } catch (err) {
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId
            ? {
                ...job,
                loading: false,
                error: err.message || "Job matching failed.",
              }
            : job
        )
      );
    }
  };

  if (!resumeResult?.resume_id) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <FileText className="mx-auto mb-4 h-12 w-12 text-slate-400" />

        <h2 className="text-xl font-bold text-slate-900">
          Upload Your Resume First
        </h2>

        <p className="mt-2 text-slate-500">
          Upload a resume from the Dashboard before matching it with a job.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <Target className="h-7 w-7 text-indigo-600" />

          <h1 className="text-2xl font-bold text-slate-900">
            Job Matcher
          </h1>
        </div>

        <p className="mt-1 text-slate-500">
          Compare your resume against multiple job opportunities.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-indigo-600" />

          <div>
            <p className="font-semibold text-slate-900">
              {resumeResult.filename}
            </p>

            <p className="text-sm text-slate-500">
              {resumeResult.skills_analysis?.total_skills || 0} skills detected
            </p>
          </div>
        </div>
      </div>

      {jobs.map((job, index) => (
        <div
          key={job.id}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Job {index + 1}
            </h2>

            {jobs.length > 1 && (
              <button
                onClick={() => removeJob(job.id)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            )}
          </div>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Job Title
          </label>

          <input
            type="text"
            value={job.title}
            onChange={(e) =>
              updateJob(job.id, "title", e.target.value)
            }
            placeholder="e.g. React Developer"
            className="mb-5 w-full rounded-xl border border-slate-300 p-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Job Description
          </label>

          <textarea
            value={job.description}
            onChange={(e) =>
              updateJob(job.id, "description", e.target.value)
            }
            placeholder="Paste the job description here..."
            rows={10}
            className="w-full resize-none rounded-xl border border-slate-300 p-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          {job.error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-5 w-5" />
              {job.error}
            </div>
          )}

          <button
            onClick={() => handleMatch(job.id)}
            disabled={job.loading}
            className="mt-4 flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {job.loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Target className="h-5 w-5" />
                Analyze Job Match
              </>
            )}
          </button>

          {job.result && (
            <div className="mt-6 space-y-6 border-t border-slate-200 pt-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
                <p className="text-sm font-medium text-slate-500">
                  Resume Match Score
                </p>

                <div className="mt-3 text-6xl font-bold text-indigo-600">
                  {job.result.match_score}%
                </div>

                <p className="mt-2 text-slate-500">
                  {job.title || "Job Opportunity"}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Matched Skills
                  </h2>

                  {job.result.matched_skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {job.result.matched_skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-green-50 px-3 py-2 text-sm font-medium text-green-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">
                      No matching skills detected.
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                    <XCircle className="h-5 w-5 text-red-600" />
                    Missing Skills
                  </h2>

                  {job.result.missing_skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {job.result.missing_skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">
                      No missing skills detected.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-sm text-slate-500">
                    Your Skills
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {job.result.resume_skill_count}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-sm text-slate-500">
                    Job Skills Required
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {job.result.job_skill_count}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    if (onMatchSuccess) {
                      onMatchSuccess(job.result);
                    }
                  }}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  View Learning Roadmap
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addJob}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50 px-6 py-4 font-semibold text-indigo-700 transition hover:bg-indigo-100"
      >
        <Plus className="h-5 w-5" />
        Add Another Job
      </button>
    </div>
  );
}