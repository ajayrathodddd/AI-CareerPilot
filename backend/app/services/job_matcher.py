import re

JOB_SKILLS = [
    "python",
    "javascript",
    "typescript",
    "java",
    "c++",
    "c#",
    "react",
    "react.js",
    "angular",
    "vue",
    "next.js",
    "html",
    "css",
    "tailwind css",
    "bootstrap",
    "node.js",
    "nodejs",
    "express",
    "express.js",
    "fastapi",
    "django",
    "flask",
    "mongodb",
    "mysql",
    "postgresql",
    "postgres",
    "redis",
    "firebase",
    "sql",
    "git",
    "github",
    "docker",
    "aws",
    "azure",
    "google cloud",
    "machine learning",
    "deep learning",
    "artificial intelligence",
    "natural language processing",
    "nlp",
    "scikit-learn",
    "tensorflow",
    "pytorch",
    "pandas",
    "numpy",
    "llm",
]

SKILL_ALIASES = {
    "react.js": "react",
    "reactjs": "react",
    "nodejs": "node.js",
    "node.js": "node.js",
    "express.js": "express",
    "expressjs": "express",
    "javascript": "javascript",
    "javascripts": "javascript",
    "js": "javascript",
    "typescript": "typescript",
    "ts": "typescript",
    "html5": "html",
    "css3": "css",
    "postgres": "postgresql",
    "postgresql": "postgresql",
    "mongodb database": "mongodb",
    "mongo": "mongodb",
    "scikit learn": "scikit-learn",
    "sklearn": "scikit-learn",
    "machine-learning": "machine learning",
    "deep-learning": "deep learning",
    "artificial-intelligence": "artificial intelligence",
    "natural-language-processing": "natural language processing",
}

def normalize_skill(skill: str) -> str:
    normalized = skill.lower().strip()
    normalized = re.sub(r"\s+", " ", normalized)

    return SKILL_ALIASES.get(normalized, normalized)

def normalize_text(text: str) -> str:
    text = text.lower()

    replacements = {
        "react.js": "react",
        "reactjs": "react",
        "nodejs": "node.js",
        "express.js": "express",
        "expressjs": "express",
        "javascripts": "javascript",
        "html5": "html",
        "css3": "css",
        "sklearn": "scikit-learn",
        "scikit learn": "scikit-learn",
    }

    for old_value, new_value in replacements.items():
        text = text.replace(old_value, new_value)

    text = re.sub(r"\s+", " ", text)

    return text.strip()

def extract_job_skills(job_description: str) -> list:
    normalized_text = normalize_text(job_description)

    detected_skills = []

    for skill in JOB_SKILLS:
        normalized_skill = normalize_skill(skill)

        pattern = (
            r"(?<![a-zA-Z0-9])"
            + re.escape(normalized_skill)
            + r"(?![a-zA-Z0-9])"
        )

        if re.search(pattern, normalized_text):
            detected_skills.append(normalized_skill)

    return sorted(set(detected_skills))

def match_resume_with_job(resume_skills: list, job_description: str) -> dict:
    job_skills = extract_job_skills(job_description)

    resume_normalized = {
        normalize_skill(skill)
        for skill in resume_skills
    }

    job_normalized = {
        normalize_skill(skill)
        for skill in job_skills
    }

    matched_skills = sorted(
        resume_normalized.intersection(job_normalized)
    )

    missing_skills = sorted(
        job_normalized.difference(resume_normalized)
    )

    if not job_normalized:
        match_score = 0
    else:
        match_score = round(
            (len(matched_skills) / len(job_normalized)) * 100
        )

    return {
        "match_score": match_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "resume_skill_count": len(resume_normalized),
        "job_skill_count": len(job_normalized),
    }