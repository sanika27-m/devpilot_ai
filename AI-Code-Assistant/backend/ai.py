import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

# Check if it's a Google Gemini key (starts with AQ. or AIzaSy)
if api_key and (api_key.startswith("AIzaSy") or api_key.startswith("AQ.")):
    client = OpenAI(
        api_key=api_key,
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
    )
    # Use gemini-3.1-flash-lite for speed and structural capabilities
    model_name = "gemini-3.1-flash-lite"
else:
    client = OpenAI(api_key=api_key)
    model_name = "gpt-4o-mini"

def process_code_request(feature, language, prompt, code=""):
    """
    Sends the request to the AI model and returns a structured JSON dictionary.
    """
    system_instruction = (
        "You are an expert AI Coding Assistant. Your task is to process the user's request "
        "and return a response strictly as a JSON object. Do not include any markdown backticks "
        "or formatting outside the JSON object itself. The JSON object must contain exactly these keys:\n"
        "{\n"
        '  "code": "The generated/fixed/optimized/refactored code snippet. Must be well-commented, clean, and run successfully.",\n'
        '  "explanation": "A detailed step-by-step explanation of the code, algorithm, or changes.",\n'
        '  "time_complexity": "The time complexity analysis (e.g., O(n log n) or O(1)). Provide details where appropriate.",\n'
        '  "space_complexity": "The space complexity analysis (e.g., O(n) or O(1)). Provide details where appropriate.",\n'
        '  "best_practices": "A list of best practice recommendations (e.g., naming conventions, SOLID principles, code style).",\n'
        '  "errors_fixed": "A summary of what was wrong, why it happened, and what was fixed (or N/A if not applicable)."\n'
        "}\n\n"
        f"Ensure that any code you generate is in the programming language: {language}.\n"
        "Return ONLY the raw JSON. Do not prefix or suffix the JSON with ```json or ```."
    )

    user_content = f"Feature to use: {feature}\n"
    if language:
        user_content += f"Programming Language: {language}\n"
    if prompt:
        user_content += f"User Prompt/Input: {prompt}\n"
    if code:
        user_content += f"Source Code Provided:\n```\n{code}\n```\n"

    # Add specific instructions for the selected feature
    feature_prompts = {
        "generator": (
            "Generate optimized code matching the user's prompt. "
            "Analyze and populate 'time_complexity', 'space_complexity', and 'explanation'. "
            "Set 'errors_fixed' to 'N/A'."
        ),
        "fixer": (
            "Analyze the provided source code, identify bugs (logical, runtime, or syntax), and provide the fixed code. "
            "Detail what was wrong and why it happened in 'errors_fixed'. "
            "Explain the fix in 'explanation'. "
            "State the time and space complexity of the fixed code."
        ),
        "explainer": (
            "Provide a step-by-step explanation of the algorithm or topic mentioned in the prompt. "
            "Include a clean implementation in the 'code' field. "
            "Provide a step-by-step dry run in 'explanation'. "
            "Detail time and space complexity, and discuss real-world applications in 'best_practices'."
        ),
        "optimizer": (
            "Analyze the provided source code for performance bottlenecks. "
            "Provide an optimized version in 'code'. "
            "Explain the better approach in 'explanation'. "
            "Compare the old and new time/space complexities in the complexity fields."
        ),
        "best_practices": (
            "Review the provided code for styling, naming conventions, SOLID principles, duplicate loops, "
            "exception handling, and general best practices. "
            "List these recommendations in 'best_practices'. "
            "Provide a refactored version of the code in 'code', and explain the improvements in 'explanation'."
        ),
        "syntax_detector": (
            "Scan the provided code for syntax errors. "
            "Provide the code with syntax errors corrected in 'code'. "
            "Detail what syntax errors were detected and how they were corrected in 'errors_fixed'."
        )
    }

    user_content += f"\nInstruction: {feature_prompts.get(feature, 'Process the request and output the structured JSON.')}"

    try:
        kwargs = {
            "model": model_name,
            "messages": [
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": user_content}
            ],
            "temperature": 0.2
        }
        
        # Use json_object response format if the client is standard OpenAI
        if "gemini" not in model_name:
            kwargs["response_format"] = {"type": "json_object"}

        response = client.chat.completions.create(**kwargs)
        response_text = response.choices[0].message.content.strip()
        
        # Clean any accidental markdown code fence surrounding the JSON block
        if response_text.startswith("```"):
            lines = response_text.splitlines()
            if lines[0].startswith("```json") or lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            response_text = "\n".join(lines).strip()

        # Parse JSON to ensure it is valid
        parsed_json = json.loads(response_text)
        return parsed_json

    except json.JSONDecodeError as je:
        print(f"Failed to parse AI JSON response: {response_text}. Error: {je}")
        return {
            "code": code or "",
            "explanation": f"Failed to parse AI response as JSON. Raw response: {response_text}",
            "time_complexity": "Error",
            "space_complexity": "Error",
            "best_practices": "Error parsing JSON response.",
            "errors_fixed": f"JSONDecodeError: {str(je)}"
        }
    except Exception as e:
        print(f"Error calling AI API: {e}")
        return {
            "code": code or "",
            "explanation": f"An error occurred while calling the AI API: {str(e)}",
            "time_complexity": "Error",
            "space_complexity": "Error",
            "best_practices": "Please check your backend configuration and API keys.",
            "errors_fixed": str(e)
        }
