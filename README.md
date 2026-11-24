# TuonTa

**A little plan. A lot of possibility.** An AI study planner and document study buddy for Build Your First AI App 2026, hosted by Yasir Insights.

[Live demo](https://tuonta-study.topgerbil.chatgpt.site) · [Source code](https://github.com/kekeiscoding/build_first_ai_app)

The hosted demo currently requires owner access.

## Problem and solution

Students have exam dates in one place, notes in another, and little idea what to study next. TuonTa turns deadlines into manageable daily sessions and helps students understand their materials using hosted AI.

## Run locally

Install Node.js 22 or later. Copy `.env.example` to `.env`, add your own `GROQ_API_KEY`, and run:

```sh
node --env-file-if-exists=.env server.mjs
```

Open http://127.0.0.1:4173. No npm dependencies or package installation are needed. Internet access is required for Groq inference, document readers, and fonts. Without a key the calendar works and the chatbot displays a setup message.

## Hosted AI setup

Create a Groq key at https://console.groq.com/keys. The key belongs only in the ignored `.env` file locally and a protected `GROQ_API_KEY` runtime secret in production. Configure optional `GROQ_MODEL` to change the server-selected model; the default is `openai/gpt-oss-20b`. The browser never receives the key. Native Sites environment changes require deploying a version to apply the new environment revision.

The browser sends requests to its same-origin `/api/ai` server route, which calls `https://api.groq.com/openai/v1/chat/completions`. `/api/ai/status` reports readiness and model name without exposing credentials. Invalid requests, timeouts, quota errors, missing keys, and provider failures have user-readable messages. Costs and quotas depend on the Groq account; a key does not guarantee unlimited free usage.

## Features

- Responsive homepage; study planner and study buddy open in separate tabs.
- Calendar or form entry for exam dates, confidence, topics, and target study hours.
- Deadline-aware scheduling with daily budgets, sessions up to 45 minutes, multiple study blocks, a 90-day horizon, and capacity warnings.
- Saved exam and completion state in localStorage; changes sync across same-origin tabs.
- CSV study-plan export and AI coaching based on exam dates and available time.
- General study chat without an upload, with recent conversational context.
- Read text PDFs (first 80 pages), DOCX, TXT, and Markdown up to 10 MB; retain up to 150,000 extracted characters in the tab.
- Document questions with source labels; coherent summaries and study notes; five-question practice quizzes with revealable answers.
- Download conversation and notes. Sample exams and biology notes for demos.

## AI implementation

The AI is **OpenAI GPT-OSS 20B**, an open-weight model hosted by **Groq**, accessed through its chat-completions API with a Groq key. This integration does not use an OpenAI API key. The model runs remotely, so visitors do not download model weights.

Provider docs: https://console.groq.com/docs/text-chat

Current models: https://console.groq.com/docs/models

The scheduler is deterministic: it prioritizes deadlines, confidence, remaining study hours, and daily capacity. Hosted AI supplies study coaching and explanations. Calendar constraints remain enforced by code.

For document questions, files up to 24,000 characters are supplied in full; longer files use up to twelve relevant excerpts ranked by keyword overlap. Summaries, notes, and quizzes include up to 45,000 characters. Longer documents use selected sections across the beginning, middle, and end and label that limited coverage. The server instructs the model to treat document content as reference data and admit when information is missing. These instructions reduce, but cannot eliminate, inaccurate answers.

## Privacy and limits

Files are parsed in the browser. When a visitor requests AI assistance, selected extracted document text and up to six recent chat messages are sent through TuonTa's server to Groq. Raw uploaded file bytes are not forwarded. Application code does not persist document text or conversations on the server. Groq's own data policies apply to requests. Exam dates and completion state are stored in browser localStorage; there is no account database or cross-device sync. External CDNs serve fonts and document parsers.

Check answers against original material. Scanned PDFs need OCR before upload. English is recommended. Groq may impose account quotas or discontinue a model; use the configurable model setting as needed. The Site's existing private audience is preserved. Before making the app public, add per-user authorization and a durable rate limit for the paid API route.

## Build and deploy

```sh
node build.mjs
```

The build embeds browser assets into a dependency-free Cloudflare Worker ES module at `dist/server/index.js`, with a default fetch handler. Source routes live in `worker/api.js`; `dist/server` is generated and ignored. The manifest `.openai/hosting.json` retains the existing Sites project ID and uses server-backed deployment. Deploy the Worker using Sites rather than uploading only the static `dist` files.

## Verify

```sh
node --test tests/planner.test.mjs tests/api.test.mjs
node --check dist/app.js
node --check worker/api.js
node build.mjs
node --check dist/server/index.js
node --env-file=.env scripts/smoke-ai.mjs
```

The automated tests cover scheduling limits, exam boundaries, tight budgets, document retrieval, server request validation, credential privacy, and provider error handling. The final command makes a real Groq request using a small sample biology prompt and consumes API quota. Browser verification should cover chat, document summary, quiz reveal, and AI planner guidance after deployment.

## Technologies

HTML/CSS/JavaScript, Node.js, Cloudflare Worker, Groq Chat Completions API, PDF.js 4.10.38, and Mammoth.js 1.9.0. The original FLAN-T5 browser integration was replaced by hosted AI for more useful responses.

## Your contribution - complete before submission

This prototype was implemented with OpenAI Codex assistance for design, code, and documentation. Replace these prompts with your personal experience:

- What I contributed: [your idea, requirements, testing, changes, and demo preparation]
- What I learned: [your experience with scheduling, hosted AI, secrets, file processing, or web development]
- AI-assisted development tools: OpenAI Codex; [add any others]
- Source code: https://github.com/kekeiscoding/build_first_ai_app
- Demo and screenshots: follow `DEMO.md` and include the resulting links.
