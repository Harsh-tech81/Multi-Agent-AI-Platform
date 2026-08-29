# AgentFlow-AI

AgentFlow-AI is a powerful Multiagent AI Platform built on a robust microservices architecture. It provides a suite of specialized AI agents to handle diverse tasks such as coding, image analysis, document generation (PDF/PPT), and conversational search.

---

## 🌟 Key Features

- **Multiagent System:** Specialized agents tailored for specific tasks, routed intelligently based on user prompts.
- **RAG Implementation:** File upload feature with Retrieval-Augmented Generation (RAG) to deeply analyze PDFs.
- **Rich Artifacts:** Code previews and generated projects are presented as interactive artifacts within the UI.
- **Cloud Storage:** Images, PDFs, and PPTs generated or uploaded are securely stored in **AWS S3**.
- **Vector Search:** High-performance vector similarity search using **Qdrant Vector DB**.
- **Real-time Web Search:** Integrated with **Tavily** for the search agent to fetch the latest information.

## 🏗️ Architecture

The platform moves beyond a simple monolith, utilizing a highly scalable **Microservices Architecture**.

- **API Gateway:** Centralized entry point routing requests to respective services.
- **Services:**
  - `agent-service`: Core AI processing and LangGraph workflows.
  - `auth-service`: Handles user authentication and security.
  - `chat-service`: Manages conversation history and real-time chat interactions.
  - `billing-service`: Manages credits and payments.
- **Shared Modules:** Common utilities (like Redis configuration) shared across services.

## 🤖 AI Agents & Models

We leverage state-of-the-art LLMs tailored for specific agentic roles:

- **Coding Agent:** Powered by **Deepseek** (`deepseek-chat`) for generating and debugging code.
- **Image Analyzer Agent:** Uses **Gemini 3.5 Flash** to analyze and extract insights from uploaded images.
- **Default/Chat/Search Agents:** Powered by **Groq** (`openai/gpt-oss-120b`) for lightning-fast reasoning and general conversation.
- **Embedding Model:** Uses Google's `gemini-embedding-001` for vectorizing PDF context.

## 💻 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Redux Toolkit
- **Backend:** Node.js, Express.js, LangChain, LangGraph
- **Database / Caching:** MongoDB, Redis, Qdrant (Vector DB)
- **AI / Search:** Groq, Gemini, Deepseek (via OpenRouter), Tavily Search
- **Cloud / Infrastructure:** AWS S3, AWS ECR, AWS ECS, CloudFront, Docker

## 🚀 CI/CD & Deployment

The platform embraces Continuous Integration and Continuous Deployment (CI/CD) to ensure rapid and reliable delivery.

- **GitHub Actions:** Automated CI/CD pipeline triggered on pushes to the `main` branch.
- **Dockerized Containers:** All microservices (Gateway, Auth, Chat, Billing, Agent) are fully containerized using Docker.
- **AWS ECR & ECS:** Backend microservices are pushed to Elastic Container Registry (ECR) and deployed seamlessly to Elastic Container Service (ECS).
- **AWS S3 & CloudFront:** The React frontend is built and deployed to an S3 bucket, served globally via a CloudFront distribution.

## 🛠️ Local Development

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- Redis (or via Docker)
- API Keys (AWS, Groq, Gemini, OpenRouter, Qdrant, Tavily)

### Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd "AgentFlow-AI"
   ```

2. **Start Redis:**
   ```bash
   docker-compose up -d
   ```

3. **Environment Variables:**
   Configure `.env` files in `frontend`, `backend/gateway`, and each `backend/services/*` directory based on required variables (e.g., API keys, DB URIs, Service URLs).

4. **Install Dependencies & Run:**
   ```bash
   # Example for Gateway
   cd backend/gateway
   npm install
   npm start
   ```

   ```bash
   # Frontend
   cd frontend
   npm install
   npm run dev
   ```

---
*Built with ❤️ utilizing the power of Multi-Agent AI Systems.*
