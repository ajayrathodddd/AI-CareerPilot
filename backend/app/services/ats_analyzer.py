import re


def calculate_ats_score(resume_text: str) -> dict:
    """
    Calculate an ATS-style resume score out of 100.
    """

    if not resume_text or not resume_text.strip():
        return {
            "score": 0,
            "breakdown": {
                "content": 0,
                "skills": 0,
                "experience": 0,
                "education": 0,
                "formatting": 0,
            },
            "suggestions": [
                "Upload a readable resume PDF first."
            ],
        }

    text = resume_text.lower()

    # -----------------------------
    # 1. CONTENT SCORE - 25 points
    # -----------------------------
    content_keywords = [
        "summary",
        "objective",
        "profile",
        "skills",
        "experience",
        "education",
        "projects",
        "certifications",
        "achievements",
    ]

    content_found = sum(
        1 for keyword in content_keywords
        if keyword in text
    )

    content_score = min(
        round((content_found / len(content_keywords)) * 25),
        25
    )

    # -----------------------------
    # 2. SKILLS SCORE - 25 points
    # -----------------------------
    common_skills = [
        "python",
        "javascript",
        "java",
        "c++",
        "react",
        "node.js",
        "nodejs",
        "express",
        "django",
        "fastapi",
        "mongodb",
        "mysql",
        "postgresql",
        "html",
        "css",
        "git",
        "github",
        "docker",
        "aws",
        "machine learning",
        "artificial intelligence",
        "sql",
    ]

    skills_found = sum(
        1 for skill in common_skills
        if skill in text
    )

    skills_score = min(
        round((skills_found / 8) * 25),
        25
    )

    # -----------------------------
    # 3. EXPERIENCE SCORE - 20 points
    # -----------------------------
    experience_keywords = [
        "experience",
        "work experience",
        "professional experience",
        "employment",
        "internship",
        "intern",
        "developer",
        "engineer",
    ]

    experience_found = sum(
        1 for keyword in experience_keywords
        if keyword in text
    )

    experience_score = min(
        round((experience_found / 3) * 20),
        20
    )

    # -----------------------------
    # 4. EDUCATION SCORE - 15 points
    # -----------------------------
    education_keywords = [
        "education",
        "bachelor",
        "b.e",
        "b.tech",
        "master",
        "m.e",
        "m.tech",
        "degree",
        "university",
        "college",
    ]

    education_found = sum(
        1 for keyword in education_keywords
        if keyword in text
    )

    education_score = min(
        round((education_found / 3) * 15),
        15
    )

    # -----------------------------
    # 5. FORMATTING SCORE - 15 points
    # -----------------------------
    formatting_score = 0

    # Email
    if re.search(
        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
        resume_text
    ):
        formatting_score += 4

    # Phone number
    if re.search(
        r"\+?\d[\d\s().-]{8,}\d",
        resume_text
    ):
        formatting_score += 4

    # Reasonable resume length
    word_count = len(resume_text.split())

    if 200 <= word_count <= 1500:
        formatting_score += 4

    # Bullet points
    if "•" in resume_text or "\n-" in resume_text:
        formatting_score += 3

    formatting_score = min(formatting_score, 15)

    # -----------------------------
    # FINAL SCORE
    # -----------------------------
    total_score = (
        content_score
        + skills_score
        + experience_score
        + education_score
        + formatting_score
    )

    # -----------------------------
    # SUGGESTIONS
    # -----------------------------
    suggestions = []

    if content_score < 18:
        suggestions.append(
            "Add important resume sections such as Summary, Skills, Projects and Certifications."
        )

    if skills_score < 18:
        suggestions.append(
            "Add more relevant technical skills and technologies."
        )

    if experience_score < 14:
        suggestions.append(
            "Add detailed work experience, internships or practical project experience."
        )

    if education_score < 10:
        suggestions.append(
            "Add your degree, college/university and education details."
        )

    if formatting_score < 10:
        suggestions.append(
            "Improve contact information and resume formatting."
        )

    if not suggestions:
        suggestions.append(
            "Your resume has a strong ATS-friendly structure."
        )

    return {
        "score": total_score,
        "breakdown": {
            "content": content_score,
            "skills": skills_score,
            "experience": experience_score,
            "education": education_score,
            "formatting": formatting_score,
        },
        "suggestions": suggestions,
    }