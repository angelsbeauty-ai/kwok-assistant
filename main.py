from fastapi import FastAPI, HTTPException
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
    history: list[dict] = []

class ChatResponse(BaseModel):
    reply: str
    needs_clarification: bool = False

def build_system_prompt() -> str:
    return f"""You are Kwok, a personal AI assistant.

{DEFAULT_RULES}

Always follow these rules. Keep replies short and clear."""

@app.get("/")
def root():
    return {"status": "Kwok Assistant running", "phase": "1-chat"}

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    user_msg = req.message.strip()
    if not user_msg:
        raise HTTPException(400, "Empty message")

    # Phase 1: rule-aware placeholder (real LLM call next when API key is added)
    # Detect if clarification is needed (simple heuristic for ADHD-style jumps)
    needs_clear = len(user_msg.split()) < 4 or "?" not in user_msg and len(user_msg) < 20

    if needs_clear:
        reply = "What do you want to do with this? Tell me the goal in one short sentence."
    else:
        reply = f"Got it. Goal: {user_msg[:80]}...\n\nI will keep it short and practical. What is the next step you want?"

    return ChatResponse(reply=reply, needs_clarification=needs_clear)

@app.get("/rules")
def get_rules():
    return {"rules": DEFAULT_RULES}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
