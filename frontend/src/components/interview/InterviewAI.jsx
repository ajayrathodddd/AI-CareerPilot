import { useState } from "react";
import {
  Brain,
  Send,
  CheckCircle2,
  User,
  Bot,
  Sparkles,
} from "lucide-react";

export default function InterviewAI({ resumeResult, jobMatchResult }) {
  const [messages, setMessages] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");

  const skills = resumeResult?.skills_analysis?.skills || [];
  const missingSkills = jobMatchResult?.missing_skills || [];

  const questions = [
    {
      question: "Tell me about yourself and your technical background.",
      type: "Introduction",
    },
    {
      question: `Explain your experience with ${skills[0] || "your main technical skill"}.`,
      type: "Technical",
    },
    {
      question: `How would you build a real-world application using ${
        skills[1] || "your technical skills"
      }?`,
      type: "Technical",
    },
    {
      question: missingSkills.length
        ? `You are missing ${missingSkills[0]}. How would you learn and use it in a project?`
        : "How do you approach learning a new technology?",
      type: "Problem Solving",
    },
    {
      question:
        "Describe a difficult programming problem you solved and how you solved it.",
      type: "Behavioral",
    },
  ];

  const currentQuestion = questions[questionIndex];

  const submitAnswer = () => {
    if (!answer.trim()) return;

    const newMessages = [
      ...messages,
      {
        type: "question",
        text: currentQuestion.question,
      },
      {
        type: "answer",
        text: answer,
      },
    ];

    setMessages(newMessages);
    setAnswer("");

    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    }
  };

  const restartInterview = () => {
    setMessages([]);
    setQuestionIndex(0);
    setAnswer("");
  };

  if (!resumeResult?.resume_id) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <Brain className="mx-auto mb-4 h-12 w-12 text-slate-400" />

        <h2 className="text-xl font-bold text-slate-900">
          Upload Your Resume First
        </h2>

        <p className="mt-2 text-slate-500">
          Upload your resume from the Dashboard before starting an interview.
        </p>
      </div>
    );
  }

  const interviewFinished = questionIndex >= questions.length;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <Brain className="h-7 w-7 text-indigo-600" />

          <h1 className="text-2xl font-bold text-slate-900">
            Interview AI
          </h1>
        </div>

        <p className="mt-1 text-slate-500">
          Practice technical and behavioral interview questions generated from
          your career profile.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Questions</p>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {questions.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Completed</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {Math.min(questionIndex, questions.length)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Resume Skills</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {skills.length}
          </p>
        </div>
      </div>

      {!interviewFinished ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                {currentQuestion.type}
              </span>

              <p className="mt-3 text-sm text-slate-500">
                Question {questionIndex + 1} of {questions.length}
              </p>
            </div>

            <Sparkles className="h-6 w-6 text-indigo-500" />
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                <Bot className="h-5 w-5 text-indigo-600" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Interview AI
                </p>

                <p className="mt-2 text-base leading-7 text-slate-700">
                  {currentQuestion.question}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your interview answer..."
              rows={6}
              className="w-full resize-none rounded-xl border border-slate-300 p-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <button
              onClick={submitAnswer}
              disabled={!answer.trim()}
              className="mt-4 flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              Submit Answer
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
          <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-green-600" />

          <h2 className="text-2xl font-bold text-green-800">
            Interview Completed
          </h2>

          <p className="mt-2 text-green-700">
            Great job! You completed all interview questions.
          </p>

          <button
            onClick={restartInterview}
            className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            Practice Again
          </button>
        </div>
      )}

      {messages.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-slate-900">
            Interview History
          </h2>

          <div className="space-y-5">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.type === "answer" ? "justify-end" : ""
                }`}
              >
                <div
                  className={`max-w-2xl rounded-2xl p-4 ${
                    message.type === "answer"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2 text-xs font-semibold">
                    {message.type === "answer" ? (
                      <>
                        <User className="h-4 w-4" />
                        You
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4" />
                        Interview AI
                      </>
                    )}
                  </div>

                  <p className="text-sm leading-6">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}