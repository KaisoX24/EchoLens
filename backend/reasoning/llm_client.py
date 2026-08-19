from langchain.chat_models import init_chat_model
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from functools import lru_cache

load_dotenv()

@lru_cache
def get_table_model():
    return init_chat_model(
        model='gemini-3.1-flash-lite',
        model_provider='google_genai',
    )

@lru_cache
def get_vision_model():
    return ChatGoogleGenerativeAI(
        model='gemini-3.5-flash',
    )