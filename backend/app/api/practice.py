
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/practice", tags=["Practice"])


class PracticeRequest(BaseModel):
    skill: str
    code: str


def success(message, output="", columns=None, rows=None):
    result = {
        "success": True,
        "message": message,
        "output": output,
    }

    if columns is not None:
        result["columns"] = columns

    if rows is not None:
        result["rows"] = rows

    return result


def failure(message):
    return {
        "success": False,
        "message": message,
        "output": "",
    }


@router.post("/run")
async def run_practice(request: PracticeRequest):
    skill = request.skill.lower().strip()
    code = request.code.strip()

    if not code:
        return failure(
            "Write your code or query before running the practice."
        )

    if skill in ["python", "python3"]:
        if "print" not in code:
            return failure(
                "Your Python practice should contain print()."
            )

        return success(
            "Python practice completed successfully.",
            "Python code accepted successfully."
        )

    if skill in ["javascript", "js"]:
        if not any(keyword in code for keyword in ["const", "let", "var"]):
            return failure(
                "Use const, let, or var in your JavaScript practice."
            )

        return success(
            "JavaScript practice completed successfully.",
            "JavaScript code accepted successfully."
        )

    if skill == "java":
        if "class" not in code or "System.out.println" not in code:
            return failure(
                "Your Java practice should contain a class and System.out.println()."
            )

        return success(
            "Java practice completed successfully.",
            "Java code accepted successfully."
        )

    if skill == "sql":
        normalized = code.lower()

        if "select" not in normalized:
            return failure(
                "Your SQL practice should contain a SELECT query."
            )

        if "from" not in normalized:
            return failure(
                "Your SQL query should contain a FROM clause."
            )

        if "join" in normalized:
            return success(
                "SQL JOIN practice completed successfully.",
                "JOIN query structure accepted successfully.",
                ["name", "product"],
                [
                    ["Ajay", "Laptop"],
                    ["Rahul", "Keyboard"],
                    ["Priya", "Monitor"],
                ],
            )

        return success(
            "SQL practice completed successfully.",
            "Query executed successfully.",
            ["id", "name", "email"],
            [
                [1, "Ajay", "ajay@example.com"],
                [2, "Rahul", "rahul@example.com"],
                [3, "Priya", "priya@example.com"],
            ],
        )

    if skill == "react":
        if "function" not in code or "return" not in code:
            return failure(
                "Create a React component using a function and return."
            )

        return success(
            "React practice completed successfully.",
            "React component structure accepted successfully."
        )

    if skill in ["node", "nodejs", "node.js"]:
        normalized = code.lower()

        if "express" not in normalized:
            return failure(
                "Use Express in your Node.js practice."
            )

        if "app.get" not in normalized:
            return failure(
                "Create an Express server with an app.get() endpoint."
            )

        return success(
            "Node.js practice completed successfully.",
            "Express API structure accepted successfully."
        )

    if skill in ["mongodb", "mongo"]:
        normalized = code.lower()

        if "db." not in normalized:
            return failure(
                "Use a MongoDB database or collection with db."
            )

        if "find" not in normalized:
            return failure(
                "Use a MongoDB find() query."
            )

        return success(
            "MongoDB practice completed successfully.",
            "MongoDB query structure accepted successfully.",
            ["_id", "name", "email"],
            [
                ["101", "Ajay", "ajay@example.com"],
                ["102", "Rahul", "rahul@example.com"],
                ["103", "Priya", "priya@example.com"],
            ],
        )

    if skill == "html":
        normalized = code.lower()

        if "<h1" not in normalized:
            return failure(
                "Add an HTML heading using h1."
            )

        if "<p" not in normalized:
            return failure(
                "Add an HTML paragraph using p."
            )

        return success(
            "HTML practice completed successfully.",
            "HTML structure accepted successfully."
        )

    if skill == "css":
        if "{" not in code or "}" not in code:
            return failure(
                "Add a CSS selector with a declaration block."
            )

        return success(
            "CSS practice completed successfully.",
            "CSS structure accepted successfully."
        )

    if skill in ["git", "github"]:
        normalized = code.lower()

        if "git" not in normalized:
            return failure(
                "Use Git commands in your practice."
            )

        if "commit" not in normalized:
            return failure(
                "Create a Git commit using git commit."
            )

        return success(
            "Git practice completed successfully.",
            "Git workflow accepted successfully."
        )

    if skill in ["typescript", "ts"]:
        normalized = code.lower()

        if "interface" not in normalized:
            return failure(
                "Create a TypeScript interface."
            )

        if "const" not in normalized:
            return failure(
                "Create a typed object using const."
            )

        return success(
            "TypeScript practice completed successfully.",
            "TypeScript structure accepted successfully."
        )

    if skill in ["machine learning", "ml"]:
        normalized = code.lower()

        if "train_test_split" not in normalized:
            return failure(
                "Use train_test_split in your Machine Learning practice."
            )

        if ".fit" not in normalized:
            return failure(
                "Train your model using model.fit()."
            )

        return success(
            "Machine Learning practice completed successfully.",
            "Machine Learning workflow accepted successfully."
        )

    if skill in ["artificial intelligence", "ai"]:
        normalized = code.lower()

        if "input" not in normalized:
            return failure(
                "Process user input in your AI practice."
            )

        return success(
            "AI practice completed successfully.",
            "AI practice structure accepted successfully."
        )

    return success(
        f"{request.skill} practice submitted successfully.",
        f"{request.skill} practice received by CareerPilot."
    )

