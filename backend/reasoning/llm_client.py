from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from functools import lru_cache
import os

load_dotenv()

@lru_cache
def get_text_model():
    return ChatGroq(
        model='openai/gpt-oss-120b',
        groq_api_key=os.getenv("GROQ_API_KEY_120")
    )

@lru_cache
def get_table_model():
    return ChatGroq(
        model='openai/gpt-oss-20b',
        groq_api_key=os.getenv("GROQ_API_KEY_20")
    )

@lru_cache
def get_vision_model():
    return ChatGoogleGenerativeAI(
        model='gemini-3.5-flash'
    )
