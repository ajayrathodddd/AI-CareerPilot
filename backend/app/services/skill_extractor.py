import re


SKILL_CATEGORIES = {
    "programming_languages": [
        "python",
        "javascript",
        "typescript",
        "java",
        "c",
        "c++",
        "c#",
        "go",
        "rust",
        "php",
        "ruby",
        "kotlin",
        "swift",
    ],
    "frontend": [
        "react",
        "react.js",
        "angular",
        "vue",
        "next.js",
        "html",
        "css",
        "tailwind css",
        "bootstrap",
    ],
    "backend": [
        "node.js",
        "nodejs",
        "express.js",
        "express",
        "fastapi",
        "django",
        "flask",
        "spring boot",
        ".net",
    ],
    "databases": [
        "mongodb",
        "mysql",
        "postgresql",
        "postgres",
        "sqlite",
        "redis",
        "firebase",
    ],
    "ai_ml": [
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
        "opencv",
        "generative ai",
        "llm",
    ],
    "tools": [
        "git",
        "github",
        "docker",
        "postman",
        "linux",
        "visual studio code",
        "vs code",
        "jira",
    ],
    "cloud": [
        "aws",
        "azure",
        "google cloud",
        "gcp",
        "vercel",
        "netlify",
    ],
}


def normalize_text(text: str) -> str:
    """
    Normalize resume text before skill matching.
    """

    text = text.lower()

    # Normalize common variations.
    text = text.replace("react.js", "react")
    text = text.replace("nodejs", "node.js")
    text = text.replace("vs code", "visual studio code")

    # Replace unusual whitespace.
    text = re.sub(r"\s+", " ", text)

    return text.strip()


def extract_skills(text: str) -> dict:
    """
    Detect skills from resume text and organize them by category.
    """

    normalized_text = normalize_text(text)

    detected_skills = {}
    all_skills = set()

    for category, skills in SKILL_CATEGORIES.items():
        category_matches = []

        for skill in skills:
            pattern = r"(?<![a-zA-Z0-9])" + re.escape(skill.lower()) + r"(?![a-zA-Z0-9])"

            if re.search(pattern, normalized_text):
                category_matches.append(skill)
                all_skills.add(skill)

        if category_matches:
            detected_skills[category] = sorted(set(category_matches))

    return {
        "total_skills": len(all_skills),
        "skills": sorted(all_skills),
        "categories": detected_skills,
    }