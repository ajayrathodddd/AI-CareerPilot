from pathlib import Path

from pypdf import PdfReader
from pdf2image import convert_from_path
import pytesseract


TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from a PDF.

    First tries normal PDF text extraction.
    If no readable text is found, automatically uses OCR.
    """

    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(
            f"Resume file not found: {file_path}"
        )

    # --------------------------------
    # STEP 1: Normal PDF text extraction
    # --------------------------------

    reader = PdfReader(str(path))

    extracted_text = []

    for page in reader.pages:
        text = page.extract_text()

        if text:
            extracted_text.append(text)

    normal_text = "\n".join(extracted_text).strip()

    # If normal extraction worked, return it
    if normal_text:
        return normal_text

    # --------------------------------
    # STEP 2: OCR for scanned PDFs
    # --------------------------------

    try:
        images = convert_from_path(
    str(path),
    dpi=200,
    poppler_path=r"C:\Users\Ajay Rathod\Downloads\Release-26.02.0-0\poppler-26.02.0\Library\bin"
)

        ocr_text = []

        for image in images:
            text = pytesseract.image_to_string(image)

            if text:
                ocr_text.append(text)

        return "\n".join(ocr_text).strip()

    except Exception as error:
        raise RuntimeError(
            f"Could not extract text using OCR: {str(error)}"
        )