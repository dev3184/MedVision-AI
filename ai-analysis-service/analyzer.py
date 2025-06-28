import os
import re
import requests
from io import BytesIO
from dotenv import load_dotenv
from PIL import Image as PILImage
from agno.agent import Agent
from agno.models.google import Gemini
from agno.media import Image as AgnoImage

load_dotenv()

query = """
You are a board-certified medical imaging specialist. Analyze the uploaded image as per the **exact structure below**, using bullet points and avoid free-form paragraphs. Your response must strictly follow **ALL** 5 sections with headings and formatting exactly like this:

### 1. Image Type & Region
- Modality:
- Region:
- Positioning:
- Image Quality:

### 2. Key Findings
- [Bullet point list of findings]

### 3. Diagnostic Assessment
- Primary Diagnosis:
- Confidence Level:
- Differential Diagnoses:
  - [Diagnosis 1] (confidence %)
  - [Diagnosis 2] (confidence %)

### 4. Patient-Friendly Explanation
Explain findings in plain language (no jargon). Use metaphors if needed.

### 5. Research Context
Just skip this section for now.
"""

def extract_section(markdown, section):
    pattern = rf"### {re.escape(section)}\n(.*?)(?=\n###|\Z)"
    match = re.search(pattern, markdown, re.DOTALL)
    return match.group(1).strip() if match else ""

def extract_field(section_text, field_name):
    pattern = rf"- {field_name}:\s*(.*)"
    match = re.search(pattern, section_text)
    return match.group(1).strip() if match else ""

def analyze_medical_image(image_url: str):
    try:
        # ✅ Download image from Cloudinary or any URL
        response = requests.get(image_url)
        response.raise_for_status()

        image = PILImage.open(BytesIO(response.content))
        width, height = image.size
        resized = image.resize((500, int(500 / (width / height))))

        os.makedirs("temp", exist_ok=True)
        temp_path = "temp/temp_resized_image.png"
        resized.save(temp_path)

        agent = Agent(
            model=Gemini(id="gemini-2.0-flash-exp"),
            tools=[],
            markdown=True
        )

        agno_image = AgnoImage(filepath=temp_path)
        response = agent.run(query, images=[agno_image])
        markdown = response.content

        # Extract structured sections
        type_region_section = extract_section(markdown, "1. Image Type & Region")
        findings = extract_section(markdown, "2. Key Findings")
        diagnosis = extract_section(markdown, "3. Diagnostic Assessment")
        explanation = extract_section(markdown, "4. Patient-Friendly Explanation")

        # Extract fields
        modality = extract_field(type_region_section, "Modality")
        region = extract_field(type_region_section, "Region")

        return {
            "modality": modality,
            "region": region,
            "findings": findings,
            "diagnosis": diagnosis,
            "explanation": explanation,
            "references": ""  # Section 5 is skipped
        }

    except Exception as e:
        return {"error": f"⚠️ Analysis error: {e}"}
    finally:
        if os.path.exists("temp/temp_resized_image.png"):
            os.remove("temp/temp_resized_image.png")


def generate_chat_response(report_context: str, question: str) -> str:
    prompt = f"""
    You are a helpful and empathetic AI medical assistant.

    Based on the following medical report, answer the user's question in simple, friendly language.

    Medical Report:
    {report_context}

    User's Question:
    {question}

    Answer in a conversational and emotionally supportive tone:
    """

    agent = Agent(model=Gemini(id="gemini-2.0-flash-exp"))
    response = agent.run(prompt)
    return response.content.strip()
