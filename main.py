from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

app = FastAPI(title="Kwok Assistant")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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

Always follow these rules strictly. Keep every reply short, clear, and practical."""

@app.get("/")
def root():
    return {"status": "Kwok Assistant running", "phase": "1-real-chat"}

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    user_msg = req.message.strip()
    if not user_msg:
        raise HTTPException(400, "Empty message")

    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(500, "OPENAI_API_KEY not set")

    messages = [{"role": "system", "content": build_system_prompt()}]
    for h in req.history[-6:]:
        messages.append(h)
    messages.append({"role": "user", "content": user_msg})

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.4,
            max_tokens=300
        )
        reply = response.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(500, f"Model error: {str(e)}")

    # Simple flag if the model asked a clarifying question
    needs_clear = "?" in reply and len(reply) < 200

    return ChatResponse(reply=reply, needs_clarification=needs_clear)

@app.get("/rules")
def get_rules():
    return {"rules": DEFAULT_RULES}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
