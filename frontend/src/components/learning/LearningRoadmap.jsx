
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleCheck,
  Clock,
  Code2,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  Lock,
  PlayCircle,
  RotateCcw,
  Target,
  Terminal,
  Trophy,
  Youtube,
} from "lucide-react";

const skillResources = {
  python: {
    title: "Python",
    description: "Learn Python programming fundamentals and problem solving.",
    duration: "2 weeks",
    level: "Beginner",
    video: "https://www.youtube.com/embed/rfscVS0vtbw",
    topics: [
      "Python fundamentals",
      "Variables and data types",
      "Conditions and loops",
      "Functions",
      "Lists, tuples and dictionaries",
      "Object-oriented programming",
    ],
    practice: {
      title: "Python Programming Practice",
      task: "Write a Python program that prints a greeting message.",
      starter: 'print("Hello CareerPilot")',
    },
  },

  javascript: {
    title: "JavaScript",
    description: "Build strong JavaScript fundamentals for modern web development.",
    duration: "2 weeks",
    level: "Beginner",
    video: "https://www.youtube.com/embed/PkZNo7MFNFg",
    topics: [
      "JavaScript fundamentals",
      "Variables and data types",
      "Functions",
      "Arrays and objects",
      "DOM manipulation",
      "Async JavaScript",
    ],
    practice: {
      title: "JavaScript Practice",
      task: "Create a variable and store your name in it.",
      starter: 'const name = "Ajay";',
    },
  },

  java: {
    title: "Java",
    description: "Learn Java programming and object-oriented concepts.",
    duration: "3 weeks",
    level: "Beginner",
    video: "https://www.youtube.com/embed/eIrMbAQSU34",
    topics: [
      "Java fundamentals",
      "Variables and data types",
      "Conditions and loops",
      "Methods",
      "Classes and objects",
      "Object-oriented programming",
    ],
    practice: {
      title: "Java Programming Practice",
      task: "Create a Java class and print a message using System.out.println().",
      starter: `class Main {
    public static void main(String[] args) {
        System.out.println("Hello CareerPilot");
    }
}`,
    },
  },

  sql: {
    title: "SQL",
    description: "Learn database queries used in real-world applications.",
    duration: "2 weeks",
    level: "Beginner",
    video: "https://www.youtube.com/embed/HXV3zeQKqGY",
    topics: [
      "SQL fundamentals",
      "CREATE TABLE and database structure",
      "SELECT and filtering",
      "INSERT, UPDATE and DELETE",
      "JOIN queries",
      "Build database queries for an application",
    ],
    practice: {
      title: "Build Database Queries for an Application",
      task: "Create a users table and retrieve user information using SELECT.",
      starter: `CREATE TABLE users (
    id INT,
    name VARCHAR(100),
    email VARCHAR(150)
);

SELECT id, name, email
FROM users;`,
    },
  },

  react: {
    title: "React",
    description: "Build modern user interfaces using React.",
    duration: "2 weeks",
    level: "Intermediate",
    video: "https://www.youtube.com/embed/SqcY0GlETPk",
    topics: [
      "React fundamentals",
      "Components",
      "Props",
      "State",
      "Events",
      "Hooks",
    ],
    practice: {
      title: "React Component Practice",
      task: "Create a functional React component that returns JSX.",
      starter: `function Welcome() {
    return <h1>Hello CareerPilot</h1>;
}`,
    },
  },

  "node.js": {
    title: "Node.js",
    description: "Build backend APIs and server-side applications.",
    duration: "2 weeks",
    level: "Intermediate",
    video: "https://www.youtube.com/embed/Oe421EPjeBE",
    topics: [
      "Node.js fundamentals",
      "Express.js",
      "REST APIs",
      "Routes",
      "Middleware",
      "API architecture",
    ],
    practice: {
      title: "Node.js API Practice",
      task: "Create an Express GET endpoint.",
      starter: `const express = require("express");

const app = express();

app.get("/api/users", (req, res) => {
    res.json({ message: "Users API" });
});`,
    },
  },

  mongodb: {
    title: "MongoDB",
    description: "Learn NoSQL database concepts and MongoDB queries.",
    duration: "1 week",
    level: "Intermediate",
    video: "https://www.youtube.com/embed/c2M-rlkkT5o",
    topics: [
      "MongoDB fundamentals",
      "Collections and documents",
      "Insert operations",
      "Find queries",
      "Update and delete",
      "MongoDB application usage",
    ],
    practice: {
      title: "MongoDB Query Practice",
      task: "Write a MongoDB find query for users.",
      starter: `db.users.find({
    active: true
});`,
    },
  },

  html: {
    title: "HTML",
    description: "Build semantic and accessible web page structures.",
    duration: "1 week",
    level: "Beginner",
    video: "https://www.youtube.com/embed/qz0aGYrrlhU",
    topics: [
      "HTML fundamentals",
      "Semantic elements",
      "Forms",
      "Tables",
      "Links and images",
      "Accessible HTML",
    ],
    practice: {
      title: "HTML Practice",
      task: "Create a heading and paragraph.",
      starter: `<h1>CareerPilot</h1>
<p>Build your career with AI.</p>`,
    },
  },

  css: {
    title: "CSS",
    description: "Create responsive and modern user interfaces.",
    duration: "1 week",
    level: "Beginner",
    video: "https://www.youtube.com/embed/1Rs2ND1ryYc",
    topics: [
      "CSS fundamentals",
      "Selectors",
      "Box model",
      "Flexbox",
      "Grid",
      "Responsive design",
    ],
    practice: {
      title: "CSS Practice",
      task: "Create a CSS rule that styles a heading.",
      starter: `h1 {
    font-size: 32px;
    font-weight: 700;
}`,
    },
  },

  git: {
    title: "Git",
    description: "Learn version control workflows used by development teams.",
    duration: "1 week",
    level: "Beginner",
    video: "https://www.youtube.com/embed/RGOj5yH7evk",
    topics: [
      "Git fundamentals",
      "Repositories",
      "Branches",
      "Commits",
      "Merge and pull requests",
      "Git workflow",
    ],
    practice: {
      title: "Git Workflow Practice",
      task: "Write Git commands that add files and create a commit.",
      starter: `git add .
git commit -m "Add CareerPilot feature"`,
    },
  },

  github: {
    title: "GitHub",
    description: "Learn collaboration and project hosting with GitHub.",
    duration: "1 week",
    level: "Beginner",
    video: "https://www.youtube.com/embed/RGOj5yH7evk",
    topics: [
      "GitHub fundamentals",
      "Repositories",
      "Branches",
      "Pull requests",
      "Issues",
      "Collaboration",
    ],
    practice: {
      title: "GitHub Practice",
      task: "Prepare Git commands for committing project changes.",
      starter: `git add .
git commit -m "Update CareerPilot"
git push origin main`,
    },
  },

  typescript: {
    title: "TypeScript",
    description: "Add strong typing to JavaScript applications.",
    duration: "2 weeks",
    level: "Intermediate",
    video: "https://www.youtube.com/embed/30LWjhZzg50",
    topics: [
      "TypeScript fundamentals",
      "Types",
      "Interfaces",
      "Functions",
      "Objects",
      "Type-safe React",
    ],
    practice: {
      title: "TypeScript Practice",
      task: "Create an interface and a typed object.",
      starter: `interface User {
    name: string;
    age: number;
}

const user: User = {
    name: "Ajay",
    age: 21
};`,
    },
  },

  "machine learning": {
    title: "Machine Learning",
    description: "Learn the core workflow used to build machine learning models.",
    duration: "3 weeks",
    level: "Intermediate",
    video: "https://www.youtube.com/embed/i_LwzRVP7bg",
    topics: [
      "Machine learning fundamentals",
      "Data preprocessing",
      "Train and test datasets",
      "Model training",
      "Model evaluation",
      "Prediction",
    ],
    practice: {
      title: "Machine Learning Practice",
      task: "Create a basic train/test split and train a model.",
      starter: `from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

model.fit(X_train, y_train)`,
    },
  },

  "artificial intelligence": {
    title: "Artificial Intelligence",
    description: "Understand AI workflows and intelligent application development.",
    duration: "3 weeks",
    level: "Intermediate",
    video: "https://www.youtube.com/embed/2ePf9rue1Ao",
    topics: [
      "Artificial intelligence fundamentals",
      "AI problem solving",
      "Input processing",
      "Machine learning concepts",
      "AI applications",
      "AI-powered products",
    ],
    practice: {
      title: "AI Practice",
      task: "Write a small program that accepts user input.",
      starter: `user_input = input("Enter your question: ")

print("You asked:", user_input)`,
    },
  },
};

const quizData = {
  sql: [
    {
      question: "Which SQL command is used to retrieve data?",
      options: ["SELECT", "INSERT", "DELETE", "CREATE"],
      answer: "SELECT",
    },
    {
      question: "Which SQL keyword is used to combine rows from multiple tables?",
      options: ["JOIN", "GROUP", "MERGE", "CONNECT"],
      answer: "JOIN",
    },
    {
      question: "Which clause filters records?",
      options: ["WHERE", "ORDER", "GROUP", "FROM"],
      answer: "WHERE",
    },
  ],

  python: [
    {
      question: "Which function prints output in Python?",
      options: ["print()", "output()", "console()", "write()"],
      answer: "print()",
    },
    {
      question: "Which keyword defines a function?",
      options: ["def", "function", "func", "define"],
      answer: "def",
    },
    {
      question: "Which data type stores key-value pairs?",
      options: ["List", "Tuple", "Dictionary", "Set"],
      answer: "Dictionary",
    },
  ],

  javascript: [
    {
      question: "Which keyword creates a block-scoped variable?",
      options: ["let", "varx", "define", "value"],
      answer: "let",
    },
    {
      question: "Which method converts JSON text into an object?",
      options: ["JSON.parse()", "JSON.object()", "JSON.convert()", "JSON.toObject()"],
      answer: "JSON.parse()",
    },
    {
      question: "Which symbol is used for strict equality?",
      options: ["===", "=", "==", "!="],
      answer: "===",
    },
  ],

  react: [
    {
      question: "What is a React component?",
      options: [
        "Reusable UI building block",
        "Database table",
        "CSS selector",
        "Backend server",
      ],
      answer: "Reusable UI building block",
    },
    {
      question: "Which hook manages state?",
      options: ["useState", "useRoute", "useDatabase", "useServer"],
      answer: "useState",
    },
    {
      question: "What does JSX allow?",
      options: [
        "HTML-like syntax in JavaScript",
        "SQL queries",
        "Python execution",
        "Database creation",
      ],
      answer: "HTML-like syntax in JavaScript",
    },
  ],

  "node.js": [
    {
      question: "Which framework is commonly used with Node.js for APIs?",
      options: ["Express", "Django", "Laravel", "Spring"],
      answer: "Express",
    },
    {
      question: "Which object represents the HTTP response in Express?",
      options: ["res", "req", "app", "router"],
      answer: "res",
    },
    {
      question: "Which method defines a GET route?",
      options: ["app.get()", "app.fetch()", "app.routeGet()", "app.request()"],
      answer: "app.get()",
    },
  ],

  mongodb: [
    {
      question: "MongoDB stores data primarily as what?",
      options: ["Documents", "Rows", "Sheets", "Files"],
      answer: "Documents",
    },
    {
      question: "Which method retrieves documents?",
      options: ["find()", "getRows()", "selectAll()", "retrieve()"],
      answer: "find()",
    },
    {
      question: "MongoDB is which type of database?",
      options: ["NoSQL", "Only relational", "Spreadsheet", "Graph-only"],
      answer: "NoSQL",
    },
  ],

  html: [
    {
      question: "Which tag creates the largest standard heading?",
      options: ["h1", "h6", "heading", "title"],
      answer: "h1",
    },
    {
      question: "Which tag creates a paragraph?",
      options: ["p", "para", "text", "paragraph"],
      answer: "p",
    },
    {
      question: "Which HTML element is used for navigation links?",
      options: ["a", "navlink", "link", "url"],
      answer: "a",
    },
  ],

  css: [
    {
      question: "Which property changes text color?",
      options: ["color", "font-color", "text-color", "foreground"],
      answer: "color",
    },
    {
      question: "Which CSS system is useful for one-dimensional layouts?",
      options: ["Flexbox", "SQL", "DOM", "MongoDB"],
      answer: "Flexbox",
    },
    {
      question: "Which property changes the background color?",
      options: ["background-color", "bg-color", "color-background", "background"],
      answer: "background-color",
    },
  ],

  git: [
    {
      question: "Which command creates a Git commit?",
      options: ["git commit", "git save", "git store", "git snapshot"],
      answer: "git commit",
    },
    {
      question: "Which command stages files?",
      options: ["git add", "git stage-only", "git prepare", "git upload"],
      answer: "git add",
    },
    {
      question: "Which command shows repository status?",
      options: ["git status", "git check", "git info", "git state"],
      answer: "git status",
    },
  ],

  github: [
    {
      question: "What is GitHub primarily used for?",
      options: [
        "Code hosting and collaboration",
        "Database hosting only",
        "Video editing",
        "Graphic design",
      ],
      answer: "Code hosting and collaboration",
    },
    {
      question: "What is a pull request?",
      options: [
        "A request to merge code changes",
        "A database query",
        "A local file",
        "A CSS rule",
      ],
      answer: "A request to merge code changes",
    },
    {
      question: "What can GitHub Issues be used for?",
      options: [
        "Tracking tasks and bugs",
        "Compiling Java",
        "Styling websites",
        "Running SQL",
      ],
      answer: "Tracking tasks and bugs",
    },
  ],

  typescript: [
    {
      question: "TypeScript is a superset of which language?",
      options: ["JavaScript", "Python", "Java", "C++"],
      answer: "JavaScript",
    },
    {
      question: "Which keyword defines an interface?",
      options: ["interface", "contract", "typeclass", "schema"],
      answer: "interface",
    },
    {
      question: "Which keyword can define a constant?",
      options: ["const", "constant", "fixed", "static"],
      answer: "const",
    },
  ],

  "machine learning": [
    {
      question: "Which method trains a scikit-learn model?",
      options: [".fit()", ".train()", ".learn()", ".build()"],
      answer: ".fit()",
    },
    {
      question: "What is train_test_split used for?",
      options: [
        "Splitting data into training and testing sets",
        "Creating databases",
        "Rendering React",
        "Writing HTML",
      ],
      answer: "Splitting data into training and testing sets",
    },
    {
      question: "What is a model used for?",
      options: [
        "Learning patterns from data",
        "Styling a webpage",
        "Managing Git branches",
        "Creating HTML tags",
      ],
      answer: "Learning patterns from data",
    },
  ],

  "artificial intelligence": [
    {
      question: "What does AI primarily aim to create?",
      options: [
        "Systems capable of intelligent behavior",
        "Only databases",
        "Only websites",
        "Only spreadsheets",
      ],
      answer: "Systems capable of intelligent behavior",
    },
    {
      question: "What is user input?",
      options: [
        "Information provided by a user",
        "A CSS property",
        "A database table",
        "A Git branch",
      ],
      answer: "Information provided by a user",
    },
    {
      question: "Which area is commonly part of AI?",
      options: [
        "Machine learning",
        "Only HTML",
        "Only CSS",
        "Only Git",
      ],
      answer: "Machine learning",
    },
  ],
};

const normalizeSkill = (skill) => {
  const value = String(skill || "")
    .toLowerCase()
    .trim();

  const aliases = {
    js: "javascript",
    node: "node.js",
    nodejs: "node.js",
    "node.js": "node.js",
    mongo: "mongodb",
    ts: "typescript",
    ml: "machine learning",
    ai: "artificial intelligence",
  };

  return aliases[value] || value;
};

const getSkillData = (skill) => {
  const normalized = normalizeSkill(skill);

  if (skillResources[normalized]) {
    return skillResources[normalized];
  }

  return {
    title: skill,
    description: `Build practical ${skill} skills required for your target job.`,
    duration: "1 week",
    level: "Beginner",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    topics: [
      `${skill} fundamentals`,
      `${skill} core concepts`,
      `${skill} practical usage`,
      `${skill} project practice`,
    ],
    practice: {
      title: `${skill} Practice`,
      task: `Write a practical ${skill} example related to your target role.`,
      starter: "",
    },
  };
};

const getQuiz = (skill) => {
  const normalized = normalizeSkill(skill);

  return (
    quizData[normalized] || [
      {
        question: `What is an important use of ${skill}?`,
        options: [
          `Building solutions with ${skill}`,
          "Only editing images",
          "Only writing documents",
          "Only browsing websites",
        ],
        answer: `Building solutions with ${skill}`,
      },
      {
        question: `Which approach is best when learning ${skill}?`,
        options: [
          "Practice with real problems",
          "Never write code",
          "Only watch videos",
          "Avoid projects",
        ],
        answer: "Practice with real problems",
      },
    ]
  );
};

export default function LearningRoadmap({
  resumeResult,
  jobMatchResult,
  onBack,
}) {
  const missingSkills =
    jobMatchResult?.missing_skills ||
    jobMatchResult?.missing ||
    resumeResult?.missing_skills ||
    [];

  const normalizedMissingSkills = useMemo(() => {
    const unique = [];

    for (const skill of missingSkills) {
      const value = String(skill || "").trim();

      if (
        value &&
        !unique.some(
          (existing) =>
            normalizeSkill(existing) === normalizeSkill(value)
        )
      ) {
        unique.push(value);
      }
    }

    return unique;
  }, [missingSkills]);

  const recommendedSkills =
    normalizedMissingSkills.length > 0
      ? normalizedMissingSkills
      : ["sql"];

  const [activeSkillIndex, setActiveSkillIndex] = useState(0);
  const [completed, setCompleted] = useState({});
  const [activeLesson, setActiveLesson] = useState(0);
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(null);

  const [practiceCode, setPracticeCode] = useState("");
  const [practiceResult, setPracticeResult] = useState(null);
  const [practiceCompleted, setPracticeCompleted] = useState(false);

  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

const user = JSON.parse(
  localStorage.getItem("careerpilot_user") || "null"
);

const userId = user?.id;

const activeSkill = recommendedSkills[activeSkillIndex];
  const skillData = getSkillData(activeSkill);
  const quiz = getQuiz(activeSkill);
  const currentQuestion = quiz[quizIndex];

  const lessonKey = `${normalizeSkill(activeSkill)}-${activeLesson}`;

  useEffect(() => {
    setActiveLesson(0);
    setSelectedTopicIndex(null);
    setPracticeCode("");
    setPracticeResult(null);
    setPracticeCompleted(false);
    setQuizStarted(false);
    setSelectedAnswer("");
    setQuizPassed(false);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizFinished(false);
  }, [activeSkill]);
  useEffect(() => {
  const loadProgress = async () => {
    if (!userId) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/progress/${userId}`
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      const savedProgress = data?.progress || {};

      if (Array.isArray(savedProgress)) {
        const progressMap = {};

        savedProgress.forEach((item) => {
          const skill = normalizeSkill(item.skill);
          const lessonIndex = item.lesson_index;

          if (item.lesson_completed) {
            progressMap[`${skill}-${lessonIndex}`] = true;
          }

          if (item.practice_completed) {
            progressMap[`${skill}-${lessonIndex}-practice`] = true;
          }

          if (item.quiz_passed) {
            progressMap[`${skill}-${lessonIndex}-quiz`] = true;
          }
        });

        setCompleted(progressMap);
      }
    } catch (error) {
      console.error("Unable to load learning progress.", error);
    }
  };

  loadProgress();
}, [userId]);

  useEffect(() => {
    setPracticeCode(skillData.practice?.starter || "");
  }, [skillData]);

  const runPractice = async () => {
    const code = practiceCode.trim();

    if (!code) {
      setPracticeResult({
        success: false,
        message: "Write your code or query before running the practice.",
      });
      setPracticeCompleted(false);
      return;
    }

    setPracticeResult({
      loading: true,
      success: false,
      message: "Running your practice...",
      output: "",
    });

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/practice/run",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skill: activeSkill,
            code,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || "Practice request failed."
        );
      }

      setPracticeResult(data);
      setPracticeCompleted(Boolean(data.success));
if (data.success) {
  setCompleted((previous) => ({
    ...previous,
    [`${lessonKey}-practice`]: true,
  }));

  if (userId) {
    try {
      await fetch(
        "http://localhost:8000/api/v1/progress/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            skill: activeSkill,
            lesson_index: activeLesson,
            lesson_completed: Boolean(completed[lessonKey]),
            practice_completed: true,
            quiz_passed: quizPassed,
          }),
        }
      );
    } catch (error) {
      console.error("Unable to save practice progress.", error);
    }
  }
}
    } catch (error) {
      setPracticeResult({
        success: false,
        message:
          error.message ||
          "Unable to connect to the CareerPilot Practice Engine.",
        output: "",
      });

      setPracticeCompleted(false);
    }
  };

  const resetPractice = () => {
    setPracticeCode(skillData.practice?.starter || "");
    setPracticeResult(null);
    setPracticeCompleted(false);
  };

  const startQuiz = () => {
    if (!practiceCompleted) {
      return;
    }

    setQuizStarted(true);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizPassed(false);
    setQuizFinished(false);
    setSelectedAnswer("");
  };

  const selectAnswer = (answer) => {
    if (quizFinished) {
      return;
    }

    setSelectedAnswer(answer);
  };

  const nextQuestion = async () => {
    if (!selectedAnswer) {
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.answer;
    const newScore = quizScore + (isCorrect ? 1 : 0);

    if (quizIndex === quiz.length - 1) {
      const passed = newScore === quiz.length;

      setQuizScore(newScore);
      setQuizFinished(true);
      setQuizPassed(passed);

      if (passed) {
  setCompleted((previous) => ({
    ...previous,
    [`${lessonKey}-quiz`]: true,
  }));

  if (userId) {
    try {
      await fetch(
        "http://localhost:8000/api/v1/progress/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            skill: activeSkill,
            lesson_index: activeLesson,
            lesson_completed: true,
            practice_completed: true,
            quiz_passed: true,
          }),
        }
      );
    } catch (error) {
      console.error("Unable to save quiz progress.", error);
    }
  }
}

      return;
    }

    setQuizScore(newScore);
    setQuizIndex((previous) => previous + 1);
    setSelectedAnswer("");
  };

  const retryQuiz = () => {
    setQuizStarted(true);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizPassed(false);
    setQuizFinished(false);
    setSelectedAnswer("");
  };

  const markLessonComplete = async () => {
  setCompleted((previous) => ({
    ...previous,
    [lessonKey]: true,
  }));

  if (!userId) {
    return;
  }

  try {
    await fetch(
      "http://localhost:8000/api/v1/progress/save",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          skill: activeSkill,
          lesson_index: activeLesson,
          lesson_completed: true,
          practice_completed: practiceCompleted,
          quiz_passed: quizPassed,
        }),
      }
    );
  } catch (error) {
    console.error("Unable to save lesson progress.", error);
  }
};
  const nextLesson = () => {
    if (activeLesson < skillData.topics.length - 1) {
      setActiveLesson((previous) => previous + 1);
      setSelectedTopicIndex(null);
      setPracticeCode(skillData.practice?.starter || "");
      setPracticeResult(null);
      setPracticeCompleted(false);
      setQuizStarted(false);
      setSelectedAnswer("");
      setQuizPassed(false);
      setQuizIndex(0);
      setQuizScore(0);
      setQuizFinished(false);
      return;
    }

    if (activeSkillIndex < recommendedSkills.length - 1) {
      setActiveSkillIndex((previous) => previous + 1);
    }
  };

  const selectTopic = (index) => {
    setSelectedTopicIndex(index);
  };

  const getTopicPractice = () => {
    const topic = skillData.topics[selectedTopicIndex];

    if (!topic) {
      return skillData.practice;
    }

    const normalizedTopic = topic.toLowerCase();

    if (
      normalizeSkill(activeSkill) === "sql" &&
      normalizedTopic.includes("join")
    ) {
      return {
        title: "SQL JOIN Practice",
        task: "Create users and orders tables and retrieve users with their orders using JOIN.",
        starter: `CREATE TABLE users (
    id INT,
    name VARCHAR(100)
);

CREATE TABLE orders (
    id INT,
    user_id INT,
    product VARCHAR(100)
);

SELECT users.name, orders.product
FROM users
JOIN orders
ON users.id = orders.user_id;`,
      };
    }

    if (
      normalizeSkill(activeSkill) === "sql" &&
      normalizedTopic.includes("build database queries")
    ) {
      return {
        title: "Build Database Queries for an Application",
        task: "Create an application users table and retrieve user records using SELECT.",
        starter: `CREATE TABLE users (
    id INT,
    name VARCHAR(100),
    email VARCHAR(150)
);

SELECT id, name, email
FROM users;`,
      };
    }

    return skillData.practice;
  };

  const currentPractice = getTopicPractice();

  useEffect(() => {
    setPracticeCode(currentPractice?.starter || "");
    setPracticeResult(null);
    setPracticeCompleted(false);
  }, [selectedTopicIndex, activeLesson]);

  const isCurrentLessonCompleted =
    completed[lessonKey] ||
    (practiceCompleted && quizPassed);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={onBack}
            className="flex w-fit items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Target size={18} />
            CareerPilot Learning Roadmap
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-400">
                <BookOpen size={18} />
                Personalized Learning Path
              </div>

              <h1 className="text-2xl font-bold sm:text-3xl">
                Close Your Skill Gaps
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                CareerPilot identified the skills that can improve your match
                with the target job. Complete lessons, practice tasks and
                quizzes to build your roadmap progress.
              </p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Skill Progress
              </div>

              <div className="mt-1 text-2xl font-bold">
                {activeSkillIndex + 1}/{recommendedSkills.length}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recommendedSkills.map((skill, index) => {
              const active = index === activeSkillIndex;

              return (
                <button
                  key={`${skill}-${index}`}
                  onClick={() => setActiveSkillIndex(index)}
                  className={`rounded-xl border p-4 text-left transition ${
                    active
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-slate-800 bg-slate-950 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">
                      {getSkillData(skill).title}
                    </span>

                    {active ? (
                      <CircleCheck size={18} className="text-blue-400" />
                    ) : (
                      <ChevronRight size={18} className="text-slate-500" />
                    )}
                  </div>

                  <div className="mt-2 text-xs text-slate-500">
                    {getSkillData(skill).level} · {getSkillData(skill).duration}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-2xl border border-slate-800 bg-slate-900 p-4 lg:sticky lg:top-6">
            <div className="mb-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Current Skill
              </div>

              <div className="mt-1 text-lg font-bold">
                {skillData.title}
              </div>
            </div>

            <div className="space-y-2">
              {skillData.topics.map((topic, index) => {
                const selected = index === activeLesson;

                return (
                  <button
                    key={`${topic}-${index}`}
                    onClick={() => {
                      setActiveLesson(index);
                      setSelectedTopicIndex(null);
                    }}
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      selected
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-800 bg-slate-950 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          selected
                            ? "bg-blue-500 text-white"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {completed[
                          `${normalizeSkill(activeSkill)}-${index}`
                        ] ? (
                          <Check size={16} />
                        ) : (
                          index + 1
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {topic}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          Lesson {index + 1}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="space-y-6">
            <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              <div className="border-b border-slate-800 p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                    Step 1
                  </span>

                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                    <Clock className="mr-1 inline" size={13} />
                    {skillData.duration}
                  </span>

                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                    {skillData.level}
                  </span>
                </div>

                <h2 className="text-xl font-bold">
                  Watch Lesson: {skillData.topics[activeLesson]}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {skillData.description}
                </p>
              </div>

              <div className="aspect-video bg-black">
                <iframe
                  className="h-full w-full"
                  src={skillData.video}
                  title={`${skillData.title} lesson`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <PlayCircle size={18} />
                  Complete the lesson before moving to practice.
                </div>

                <button
                  onClick={markLessonComplete}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-500"
                >
                  <CheckCircle2 size={17} />
                  Mark Lesson Complete
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-purple-400">
                  <Lightbulb size={18} />
                  Step 2
                </div>

                <h2 className="text-xl font-bold">Learn Concepts</h2>

                <p className="mt-2 text-sm text-slate-400">
                  Select a topic to focus your learning and practice task.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {skillData.topics.map((topic, index) => (
                  <button
                    key={`${topic}-${index}`}
                    onClick={() => selectTopic(index)}
                    className={`rounded-xl border p-4 text-left transition ${
                      selectedTopicIndex === index
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-slate-800 bg-slate-950 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-slate-800 p-2">
                        <Code2 size={18} className="text-purple-400" />
                      </div>

                      <div>
                        <div className="font-semibold">{topic}</div>

                        <div className="mt-1 text-xs text-slate-500">
                          Topic {index + 1}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-400">
                  <Terminal size={18} />
                  Step 3
                </div>

                <h2 className="text-xl font-bold">
                  {currentPractice.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {currentPractice.task}
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
                <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Code2 size={15} />
                    {skillData.title} Practice
                  </div>

                  <span className="text-xs text-slate-600">
                    Practice Engine
                  </span>
                </div>

                <textarea
                  value={practiceCode}
                  onChange={(event) => {
                    setPracticeCode(event.target.value);
                    setPracticeResult(null);
                    setPracticeCompleted(false);
                  }}
                  spellCheck="false"
                  className="min-h-[300px] w-full resize-y bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-700"
                  placeholder="Write your code or query here..."
                />
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={runPractice}
                  disabled={practiceResult?.loading}
                  className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <PlayCircle size={18} />
                  {practiceResult?.loading
                    ? "Running..."
                    : "Run Practice"}
                </button>

                <button
                  onClick={resetPractice}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
                >
                  <RotateCcw size={17} />
                  Reset
                </button>
              </div>

              {practiceResult && !practiceResult.loading && (
                <div
                  className={`mt-5 rounded-xl border p-4 ${
                    practiceResult.success
                      ? "border-green-500/30 bg-green-500/10"
                      : "border-red-500/30 bg-red-500/10"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {practiceResult.success ? (
                      <CheckCircle2
                        size={20}
                        className="mt-0.5 shrink-0 text-green-400"
                      />
                    ) : (
                      <HelpCircle
                        size={20}
                        className="mt-0.5 shrink-0 text-red-400"
                      />
                    )}

                    <div>
                      <div className="font-semibold">
                        {practiceResult.success
                          ? "Practice Passed"
                          : "Practice Needs Changes"}
                      </div>

                      <div className="mt-1 text-sm text-slate-300">
                        {practiceResult.message}
                      </div>
                    </div>
                  </div>

                  {practiceResult.output && (
                    <pre className="mt-3 overflow-x-auto rounded-lg bg-black/30 p-3 font-mono text-xs leading-6 text-slate-200">
                      {practiceResult.output}
                    </pre>
                  )}
                </div>
              )}

              {practiceResult?.success &&
                Array.isArray(practiceResult.columns) &&
                Array.isArray(practiceResult.rows) && (
                  <div className="mt-5 overflow-hidden rounded-xl border border-slate-700">
                    <div className="border-b border-slate-700 bg-slate-950 px-4 py-3">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Terminal size={16} />
                        Query Result
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-950">
                          <tr>
                            {practiceResult.columns.map((column) => (
                              <th
                                key={column}
                                className="border-b border-slate-800 px-4 py-3 font-semibold text-slate-300"
                              >
                                {column}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {practiceResult.rows.map((row, rowIndex) => (
                            <tr
                              key={rowIndex}
                              className="border-b border-slate-800 last:border-0"
                            >
                              {row.map((value, columnIndex) => (
                                <td
                                  key={`${rowIndex}-${columnIndex}`}
                                  className="px-4 py-3 text-slate-400"
                                >
                                  {String(value)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {!practiceCompleted && (
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <Lock size={14} />
                  Run the practice successfully to unlock the quiz.
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-yellow-400">
                  <Trophy size={18} />
                  Step 4
                </div>

                <h2 className="text-xl font-bold">Take Quiz</h2>

                <p className="mt-2 text-sm text-slate-400">
                  Pass all questions to complete this learning stage.
                </p>
              </div>

              {!quizStarted ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-center">
                  {!practiceCompleted && (
                    <Lock
                      size={30}
                      className="mx-auto mb-3 text-slate-600"
                    />
                  )}

                  <h3 className="font-semibold">
                    {practiceCompleted
                      ? "Ready for the quiz?"
                      : "Complete practice first"}
                  </h3>

                  <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
                    {practiceCompleted
                      ? `This quiz contains ${quiz.length} questions. You must answer every question correctly to pass.`
                      : "The quiz unlocks automatically after your practice is accepted by the backend Practice Engine."}
                  </p>

                  <button
                    onClick={startQuiz}
                    disabled={!practiceCompleted}
                    className="mt-5 rounded-lg bg-yellow-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Start Quiz
                  </button>
                </div>
              ) : quizFinished ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-7 text-center">
                  {quizPassed ? (
                    <>
                      <CheckCircle2
                        size={48}
                        className="mx-auto text-green-400"
                      />

                      <h3 className="mt-4 text-2xl font-bold">
                        Quiz Passed
                      </h3>

                      <p className="mt-2 text-slate-400">
                        Excellent work. You answered all questions correctly.
                      </p>
                    </>
                  ) : (
                    <>
                      <HelpCircle
                        size={48}
                        className="mx-auto text-red-400"
                      />

                      <h3 className="mt-4 text-2xl font-bold">
                        Quiz Not Passed
                      </h3>

                      <p className="mt-2 text-slate-400">
                        You need to answer every question correctly.
                      </p>
                    </>
                  )}

                  <div className="mt-5 text-3xl font-bold">
                    {quizScore}/{quiz.length}
                  </div>

                  <div className="mt-1 text-sm text-slate-500">
                    {Math.round((quizScore / quiz.length) * 100)}%
                  </div>

                  {!quizPassed && (
                    <button
                      onClick={retryQuiz}
                      className="mt-6 flex mx-auto items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
                    >
                      <RotateCcw size={17} />
                      Retry Quiz
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-sm text-slate-400">
                      Question {quizIndex + 1} of {quiz.length}
                    </span>

                    <span className="text-sm font-semibold text-yellow-400">
                      Score: {quizScore}
                    </span>
                  </div>

                  <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-yellow-500 transition-all"
                      style={{
                        width: `${
                          ((quizIndex + 1) / quiz.length) * 100
                        }%`,
                      }}
                    />
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
                    <h3 className="text-lg font-semibold leading-7">
                      {currentQuestion.question}
                    </h3>

                    <div className="mt-5 space-y-3">
                      {currentQuestion.options.map((option) => {
                        const selected = selectedAnswer === option;

                        return (
                          <button
                            key={option}
                            onClick={() => selectAnswer(option)}
                            className={`w-full rounded-xl border p-4 text-left text-sm transition ${
                              selected
                                ? "border-yellow-500 bg-yellow-500/10 text-yellow-300"
                                : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-600"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span>{option}</span>

                              {selected && <Check size={18} />}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={nextQuestion}
                      disabled={!selectedAnswer}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {quizIndex === quiz.length - 1
                        ? "Finish Quiz"
                        : "Next Question"}
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Lesson Status
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-lg font-bold">
                    {isCurrentLessonCompleted ? (
                      <>
                        <CheckCircle2
                          size={20}
                          className="text-green-400"
                        />
                        Lesson Completed
                      </>
                    ) : (
                      <>
                        <Clock size={20} className="text-slate-500" />
                        In Progress
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={nextLesson}
                  disabled={
                    activeLesson === skillData.topics.length - 1 &&
                    activeSkillIndex === recommendedSkills.length - 1
                  }
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {activeLesson === skillData.topics.length - 1
                    ? activeSkillIndex === recommendedSkills.length - 1
                      ? "Roadmap Complete"
                      : "Next Skill"
                    : "Next Lesson"}
                  <ChevronRight size={18} />
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

