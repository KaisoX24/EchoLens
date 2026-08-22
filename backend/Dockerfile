FROM python:3.12-slim

RUN apt-get update && apt-get install -y espeak-ng && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .
RUN pip install uv && uv sync --frozen

CMD uv run uvicorn main:app --host 0.0.0.0 --port $PORT
