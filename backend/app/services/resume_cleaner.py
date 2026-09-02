import re


def clean_resume_text(text: str) -> str:
    """
    Clean extracted resume text before analysis.
    """

    if not text:
        return ""

    # Normalize line endings
    text = text.replace("\r\n", "\n")
    text = text.replace("\r", "\n")

    # Remove common PDF page-number patterns
    text = re.sub(
        r"\d+/\d+",
        " ",
        text
    )

    # Remove localhost URLs and browser/dev-tool artifacts
    text = re.sub(
        r"https?://\S+",
        " ",
        text
    )

    text = re.sub(
        r"127\.0\.0\.1:\d+/\S*",
        " ",
        text
    )

    # Remove common template/demo phrases
    unwanted_phrases = [
        "lorem ipsum",
        "magnam dolores commodi suscipit",
        "necessitatibus eius consequatur",
        "sit sint consectetur velit",
        "quisquam quos quisquam cupiditate",
        "export tempor illum",
        "bootstrapmade",
        "all rights reserved",
    ]

    for phrase in unwanted_phrases:
        text = re.sub(
            re.escape(phrase),
            " ",
            text,
            flags=re.IGNORECASE
        )

    # Remove excessive special characters
    text = re.sub(
        r"[^\w\s@.+#&()/'-]",
        " ",
        text,
        flags=re.UNICODE
    )

    # Clean excessive whitespace
    text = re.sub(r"[ \t]+", " ", text)

    # Clean excessive blank lines
    text = re.sub(r"\n\s*\n+", "\n\n", text)

    return text.strip()