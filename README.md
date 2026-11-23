# TuonTa

**A little plan. A lot of possibility.** An AI study planner and document study buddy for Build Your First AI App 2026, hosted by Yasir Insights.

## Problem and solution

Students often have exam dates in one place, notes in another, and little idea what to study next. TuonTa turns deadlines into manageable daily sessions and helps students understand their materials with a browser-based AI companion.

## Run locally

Install Node.js 20 or later, then run from this folder:

```sh
npm start
```

Open http://127.0.0.1:4173. No npm installation, account, API key, or backend service is required. Internet access is required for fonts, document readers, and the initial AI model download. Serve through HTTP or HTTPS; opening index.html directly does not support the module worker.

## Features

- Responsive coral-and-violet homepage; planner and study buddy open in separate tabs.
- Add exam dates through a calendar or form, confidence level, topic, and target study hours.
- Deadline-aware scheduling: daily time budget, sessions up to 45 minutes, no sessions on/after an exam, 90-day planning horizon, capacity warnings.
- Browser-local saved exams, sessions, and completion state; changes sync across tabs on the same origin.
- Export a CSV plan.
- Read text-based PDFs (first 80 pages), DOCX, TXT, or Markdown up to 10 MB. Analysis includes up to 150,000 characters.
- Ask questions with a relevant source excerpt; generate sampled summaries, study notes, and a practice question with a revealable suggested answer.
- Download the conversation; sample exams and biology material for a quick demo.

## AI implementation

TuonTa uses **Xenova/flan-t5-small**, an Apache-2.0 licensed, instruction-tuned open-source model, through **Hugging Face Transformers.js 3.8.1** and ONNX Runtime Web. A module Web Worker downloads quantized weights and performs inference locally using WebAssembly. There are no API secrets. Model artifacts are downloaded from Hugging Face and may be cached by the browser.

Model card: https://huggingface.co/Xenova/flan-t5-small

Runtime docs: https://huggingface.co/docs/transformers.js

The scheduler is a transparent algorithm, prioritizing exams using proximity, confidence, and remaining requested study hours. AI adds study guidance based on these dates and targets. It does not invent calendar dates or control the daily time budget. Document Q&A selects a relevant text chunk using keyword overlap, then conditions the model on that excerpt. Summaries and notes sample the beginning, middle, and end of longer files and label that coverage. Quizzes generate a question and a suggested answer with separate inference calls.

## Limitations and privacy

FLAN-T5-small is a compact model, not a large conversational assistant. Answers can be brief or inaccurate; check them against the original material. English is recommended. First AI use downloads roughly 80 MB and can take several minutes depending on network and device speed. A modern desktop browser is recommended. Model/network failures are shown to the user. No synthetic response is presented as successful model inference.

Scanned PDFs need external OCR. File contents and conversation are kept in memory in the current tab, not persisted or sent to an inference server. Exams and study progress use localStorage without accounts or cross-device sync. External CDNs receive normal resource requests for the runtime and parser libraries. Avoid loading untrusted documents. Cloud hosting starts private; make the hosting audience public before sharing with judges if appropriate.

## Technologies

Vanilla HTML/CSS/JavaScript, Node.js static preview server, Transformers.js, PDF.js 4.10.38, Mammoth.js 1.9.0. The hosted build is the `dist` folder; there is no build step. Deploy that folder to any static host that supports module workers. Sites deployment configuration is in `.openai/hosting.json`.

## Verify

```sh
npm test
node --check dist/app.js
node --check dist/ai-worker.js
```

The tests cover scheduling limits, exam boundaries, impossible time budgets, and document retrieval. Browser checks should also cover model download/inference, PDF and DOCX parsing, mobile layout, refresh persistence, and CSV export.

## Your contribution — complete before submission

This prototype was implemented with OpenAI Codex assistance for design, code, and documentation. Review the code and replace the prompts below with your personal experience; they are not claims about work or learning you have already done.

- What I contributed: [your idea, requirements, testing, changes, and demo preparation]
- What I learned: [your own experience with scheduling, local AI, document processing, or web development]
- AI-assisted tools used: OpenAI Codex; [add any others]
- Accessible source-code link: [publish this folder to your GitHub repository and insert its URL]
- Demo and screenshots: follow `DEMO.md` and include the resulting links in the submission.
