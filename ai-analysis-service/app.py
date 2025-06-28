from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from analyzer import analyze_medical_image, generate_chat_response

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ New schema to receive image URL
class ImageRequest(BaseModel):
    image_url: str

@app.post("/analyze")
async def analyze(request: ImageRequest):
    report = analyze_medical_image(request.image_url)
    return {"report": report}

class ChatRequest(BaseModel):
    question: str
    report_context: str

@app.post("/chat")
async def chat_with_report(req: ChatRequest):
    try:
        answer = generate_chat_response(req.report_context, req.question)
        return {"answer": answer}
    except Exception as e:
        return {"error": str(e)}
