# AI Workplace Productivity Assistant

## Project Overview

**AI Workplace Productivity Assistant** is a modern, responsive SaaS-style web application designed to help professionals automate everyday workplace tasks using artificial intelligence.

The application provides a single dashboard with three core AI productivity tools:

* **Smart Email Generator** – Creates professional emails based on user-provided context, key points, and selected tone.
* **AI Research Assistant** – Summarises topics, article content, and supported webpage URLs while providing key insights and recommendations.
* **AI Workplace Chatbot** – Provides an interactive AI assistant for workplace questions, writing tasks, brainstorming, and productivity support.

The application is designed as a lightweight frontend-focused solution with **no database, authentication, or persistent data storage**.

All generated responses should be dynamically produced by an AI model rather than using hardcoded or generic responses.

---

## Features Implemented

### Smart Email Generator

* Generate professional emails using AI
* User-provided context and key points
* Tone selection:

  * Formal
  * Friendly
  * Persuasive
* Editable AI-generated output
* Copy generated email
* Regenerate response
* Loading and error states

### AI Research Assistant

* Research topics using AI
* Paste article or document content
* Enter supported webpage URLs
* Generate AI-powered:

  * Summary
  * Key insights
  * Recommendations
* Editable results
* Copy generated results
* Loading and error states

### AI Workplace Chatbot

* Interactive workplace AI assistant
* Dynamic AI-generated responses
* Workplace questions and productivity assistance
* Writing and communication support
* Brainstorming and idea generation
* Suggested starter prompts
* Regenerate responses
* Clear conversation interface

### Dashboard & UI

* Modern SaaS dashboard
* Dark/navy-blue professional theme
* Sidebar navigation
* Responsive desktop, tablet, and mobile layouts
* Reusable UI components
* Clear navigation between AI tools
* Current-session interaction without persistent storage

### Responsible AI

The application displays the following disclaimer:

> **AI-generated content may contain errors. Review and verify important information before using it.**

---

## Technologies and Tools Used

### Frontend

* **React** – Component-based user interface
* **TypeScript** – Type-safe application development
* **Vite** – Frontend development and build tooling
* **Tailwind CSS** – Responsive styling and UI design
* **shadcn/ui** – Reusable modern interface components

### AI

* **AI API / Lovable-supported AI integration** – Generates dynamic responses for emails, research, and chatbot conversations.
* AI responses are generated based on the user's actual prompts and inputs.

### Development Platform

* **Lovable** – Application development and AI-assisted implementation
* **Git/GitHub** – Optional source-code version control

### Data Architecture

The application intentionally does **not** use:

* Database
* User authentication
* Backend server
* Persistent user profiles
* Persistent chat history
* Persistent email history
* Persistent research history

User inputs and generated results are intended to remain available only during the current session.

---

## Setup Instructions

### 1. Clone or Open the Project

Open the project in Lovable or clone the project repository locally.

```bash
git clone <repository-url>
cd ai-workplace-productivity-assistant
```

### 2. Install Dependencies

Install the required packages:

```bash
npm install
```

### 3. Configure AI Integration

Configure the AI provider/API using the AI integration supported by the project environment.

Store API credentials securely using environment variables where required.

**Do not expose private API keys directly in frontend source code.**

For example:

```env
AI_API_KEY=your_api_key_here
```

Use the exact environment variable and integration configuration required by the selected AI provider.

### 4. Start the Development Server

Run:

```bash
npm run dev
```

The application should then be available through the local development URL provided by Vite.

### 5. Build for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## Important Implementation Requirements

The application should always generate responses dynamically through the connected AI model.

Do **not** replace AI functionality with:

* Hardcoded responses
* Generic placeholder responses
* Static chatbot messages
* Predefined research results
* Mock AI output

If an AI request fails, display a clear error message and allow the user to retry.

For URL-based research, the application must retrieve and analyse the webpage content through an appropriate supported integration before asking the AI to summarise it. A URL alone should not result in a generic response.

---

## Project Goal

The goal of this project is to provide professionals with a simple, modern, and accessible AI workspace for automating common workplace communication, research, and productivity tasks while keeping the application lightweight and free from unnecessary data storage.

