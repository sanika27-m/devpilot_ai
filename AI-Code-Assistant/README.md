# AI-Based Code Assistant

A complete, self-contained AI-powered development workspace that enables developers to generate code, fix bugs, optimize performance, explain algorithms, inspect syntax errors, and review best practices in real time.

---

## 🌟 Key Features

1. **AI Code Generator**: Instantly generate clean, commented code in any supported language from natural descriptions.
2. **Auto Bug Fixer**: Analyze broken code, discover logical/runtime flaws, explain the bug, and provide a fixed version.
3. **Algorithm Explainer**: Request step-by-step walkthroughs, comprehensive dry runs, complexity bounds, and real-world applications of algorithms.
4. **Code Optimizer**: Detect execution bottlenecks and generate high-performance equivalents with comparisons.
5. **Best Practices Recommender**: Verify structure, naming conventions, duplicate loops, SOLID design, and exception handling.
6. **Syntax Error Detector**: Scan and repair syntax mistakes, indentation anomalies, and missing parameters.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React.js, Tailwind CSS (Glassmorphism & Dark Mode theme), Lucide Icons, Vite builder.
- **Backend**: Python Flask REST API, Flask-CORS, python-dotenv, SQLite3.
- **AI Integration**: OpenAI client with automatic Google Gemini Developer API key routing.

---

## 📂 Project Structure

```text
AI-Code-Assistant/
├── database/
│   └── history.db (SQLite database, auto-created)
├── backend/
│   ├── app.py           (Flask server configuration)
│   ├── routes.py        (API endpoints & SQLite queries)
│   ├── ai.py            (LLM Client initialization & prompts)
│   ├── requirements.txt (Python backend dependencies)
│   └── .env             (Environment configuration)
├── frontend/
│   ├── src/             (React pages & components)
│   ├── index.html       (Main DOM entry & SEO meta tags)
│   ├── tailwind.config.js
│   └── package.json     (Vite and React dependencies)
└── README.md            (This instruction document)
```

---

## 🚀 Setup & Deployment

### 📋 Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher)
- **Python** (v3.10 or higher)
- A **Google Gemini API Key** or **OpenAI API Key**

---

### 🐍 1. Backend Configuration
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Upgrade pip and install dependencies:
   ```bash
   python -m pip install --upgrade pip
   pip install -r requirements.txt
   ```
4. Create a `.env` file inside the `backend/` directory:
   ```env
   OPENAI_API_KEY=YOUR_API_KEY
   PORT=5000
   ```
5. Launch the Flask API server:
   ```bash
   python app.py
   ```
   *The backend will run on `http://localhost:5000` and automatically create the SQLite database directory.*

---

### ⚛️ 2. Frontend Configuration
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

---

## 🤖 API Key Routing Mechanism
The backend features an automatic routing mechanism inside `backend/ai.py` that processes API keys:
- **Gemini Key** (starts with `AQ.` or `AIzaSy`): Configures the client to connect via the official Google OpenAI compatibility layer (`https://generativelanguage.googleapis.com/v1beta/openai/`) using `gemini-3.5-flash` or similar.
- **OpenAI Key** (starts with `sk-`): Standard route targeting official OpenAI API endpoints using `gpt-4o-mini`.
