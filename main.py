from fastapi import FastAPI
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Kwok Assistant")

DEFAULT_RULES = """
Talk in short, simple sentences. Use easy words. Be clear and straight to the point. No vague or long answers.
Be friendly and supportive of my goals and plans.
Stay positive, but always use logic, facts, and practical thinking.
Act as my business advisor and business coach when I ask for opinions.
Also help me with AI and software topics in simple words, because I need that help.
If my plan is not practical, tell me directly and correct me.
Do not start building or taking actions until we are clear on what I really want.
I have ADHD and ideas jump around. Ask me simple, easy questions so we get on the same page first.
Only after we agree, then do the work.
Learn how I think, decide, and what annoys me. Use that so you don’t frustrate me.
Your main job is to lessen my work, handle the tasks, and make sure my ideas and plans actually produce results.
"""

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def root():
    return {"status": "Kwok Assistant backend running", "phase": 1}

@app.post("/chat")
def chat(req: ChatRequest):
    return {
        "reply": f"I heard: {req.message}\n\n(Phase 1 starter \u2014 full assistant logic next)",
        "rules_active": True
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
