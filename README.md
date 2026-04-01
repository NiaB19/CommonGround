🌱 CommonGround

CommonGround is a full-stack web application that helps users discover third spaces—welcoming environments outside of home and work—along with local community events.

Built with a focus on accessibility and inclusivity, the platform leverages an AI-powered assistant to provide personalized recommendations using real-time application data.

🚀 Why This Project Matters

Many students struggle to find spaces where they feel comfortable going alone.
CommonGround addresses this by:

Promoting inclusive, low-pressure environments
Highlighting solo-friendly and accessible spaces
Using AI to reduce decision fatigue and social anxiety
✨ Key Features

🗺️ Smart Space Discovery
Filter locations by:
Free access
ADA accessibility
Quiet environments
Solo-friendly settings

📅 Event Exploration System
Browse events by type, location, and date
Dynamically sorted and filtered on the backend

➕ User-Generated Content
Users can submit new:
Events
Third spaces
Data is persisted using structured JSON storage

🤖 AI-Powered Recommendation Engine
Integrated Google Gemini API
Custom prompt engineering using:
Live event data
Live space data
Returns contextual, human-like recommendations

🎯 Inclusive Design
Encourages solo participation
Highlights safe and welcoming spaces
Supports community-based filtering

🧠 Technical Overview

Backend
Node.js + Express.js REST API
Environment configuration via dotenv
Middleware: CORS, JSON parsing
File-based data persistence (JSON)
AI Integration
Google Gemini (@google/generative-ai)
Dynamic prompt construction using internal datasets
Controlled output (AI only recommends existing data)

Frontend
Vanilla JavaScript (DOM + Fetch API)
Form-based submission interfaces
Real-time chatbot interaction
Data Handling
Structured JSON storage:
Read/write operations handled via Node fs module

📁 Architecture
Client (HTML/JS)
      ↓
Fetch API Requests
      ↓
Express Server (Node.js)
      ↓
Routes (/api/events, /api/spaces, /api/chat)
      ↓
JSON Storage + Gemini API

🔌 API Highlights
Events
GET /api/events → filterable event retrieval
POST /api/events → dynamic event creation
Spaces
GET /api/spaces → filtered space discovery
POST /api/spaces → user-submitted locations
AI Chat
POST /api/chat
Injects application data into AI prompt
Returns contextual recommendations

⚙️ Getting Started
npm install
npm start

Create .env file:

GEMINI_API_KEY=your_api_key_here

Server runs on:

http://localhost:8000

📈 Engineering Decisions
File-based storage (JSON)
→ Chosen for simplicity and rapid prototyping
→ Easily replaceable with MongoDB/PostgreSQL
Prompt-constrained AI system
→ Prevents hallucinations by limiting responses to internal data
RESTful API design
→ Scalable and frontend-agnostic

🔮 Future Improvements
Database integration (MongoDB)
Authentication & user accounts
Map-based UI (Leaflet / Google Maps)
Image upload & media storage
Advanced recommendation system (ranking + personalization)

🧩 Skills Demonstrated
Full-stack development (Node.js + frontend JS)
REST API design
AI integration & prompt engineering
Data modeling and filtering logic
User-centered design & accessibility thinking


⭐ Takeaway

CommonGround demonstrates how AI and full-stack development can be combined to solve real-world problems around accessibility, community, and user experience.
