---
title: Todo AI Chatbot API
emoji: 🤖
colorFrom: blue
colorTo: purple
sdk: docker
app_port: 7860
---

# Todo AI Chatbot Backend

FastAPI backend for the AI-powered Todo chatbot.

## Features

- JWT authentication with Better Auth
- OpenAI GPT-4o-mini powered chat
- Task management via natural language
- Conversation history persistence

## Environment Variables

Configure these in your Hugging Face Space settings:

- `DATABASE_URL` - Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET` - JWT signing secret (must match frontend)
- `OPENAI_API_KEY` - OpenAI API key
- `CORS_ORIGINS` - Frontend URL (e.g., https://your-app.vercel.app)
- `BETTER_AUTH_URL` - Frontend URL for auth redirects
