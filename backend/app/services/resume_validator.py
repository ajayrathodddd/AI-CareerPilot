
import re


SECTION_KEYWORDS = [
    "experience",
    "work experience",
    "education",
    "skills",
    "technical skills",
    "projects",
    "project",
    "certifications",
    "summary",
    "objective",
    "achievements",
    "internship",
    "profile",
    "career objective",
]


INVALID_PHRASES = [
    "lorem ipsum",
    "brandon johnson",
    "sara wilsson",
    "iportfolio",
    "bootstrapmade",
    "all rights reserved",
    "localhost",
    "magnam dolores commodi suscipit",
    "necessitatibus eius consequatur",
]


def normalize_text(text: str) -> str:
    text = text.lower()

    text = text.replace("\r\n", "\n")
    text = text.replace("\r", "\n")

    text = re.sub(r"[ \t]+", " ", text)

    return text.strip()


def has_email(text: str) -> bool:
    email_pattern = (
        r"[A-Za-z0-9._%+-]+"
        r"[@\s]+"
        r"[A-Za-z0-9.-]+"
        r"[.\s]+"
        r"[A-Za-z]{2,}"
    )

    return bool(re.search(email_pattern, text))


def has_phone(text: str) -> bool:
    phone_patterns = [
        r"\+?\d[\d\s().-]{8,}\d",
        r"\b\d{10}\b",
        r"\b\d{3}[\s.-]\d{3}[\s.-]\d{4}\b",
    ]

    return any(
        re.search(pattern, text)
        for pattern in phone_patterns
    )


def count_resume_sections(text: str) -> int:
    found_sections = set()

    for section in SECTION_KEYWORDS:
        if section in text:
            found_sections.add(section)

    return len(found_sections)


def validate_resume(text: str) -> dict:
    if not text or not text.strip():
        return {
            "valid": False,
            "message": (
                "This PDF does not contain readable resume text. "
                "Please upload a readable resume PDF."
            ),
        }

    normalized = normalize_text(text)

    words = normalized.split()

    if len(words) < 120:
        return {
            "valid": False,
            "message": (
                "This does not appear to be a complete resume. "
                "Please upload your resume PDF."
            ),
        }

    invalid_phrase_count = 0

    for phrase in INVALID_PHRASES:
        if phrase in normalized:
            invalid_phrase_count += 1

    if invalid_phrase_count >= 2:
        return {
            "valid": False,
            "message": (
                "This PDF appears to be a template or demo document. "
                "Please upload your actual resume."
            ),
        }

    section_count = count_resume_sections(normalized)

    if section_count < 2:
        return {
            "valid": False,
            "message": (
                "The PDF does not contain enough resume sections. "
                "Please upload a valid resume PDF."
            ),
        }

    email_found = has_email(normalized)
    phone_found = has_phone(normalized)

    contact_score = 0

    if email_found:
        contact_score += 1

    if phone_found:
        contact_score += 1

    if contact_score == 0:
        return {
            "valid": False,
            "message": (
                "No contact information was detected. "
                "Please upload a valid resume PDF containing your email or phone number."
            ),
        }

    return {
        "valid": True,
        "message": "Valid resume detected.",
        "checks": {
            "word_count": len(words),
            "resume_sections": section_count,
            "email_detected": email_found,
            "phone_detected": phone_found,
        },
    }

