# 📄 Chat With PDF - RAG System

A **Retrieval-Augmented Generation (RAG)** application built with **Node.js**, **Express.js**, **Google Gemini API**, and **Qdrant Vector Database**. Users can upload PDF documents and ask natural language questions. The application extracts text, splits it into overlapping chunks, generates embeddings using Gemini, stores them in Qdrant, performs semantic vector search, and retrieves the most relevant context before generating accurate answers with Gemini.

---

## 🚀 Features

- 📂 Upload PDF documents
- 📖 Extract text using `pdf-parse`
- ✂️ Intelligent text chunking with overlap
- 🧠 Generate embeddings using Gemini Embedding Model
- 🗄️ Store embeddings in **Qdrant Vector Database**
- 🔍 Semantic vector search using Qdrant
- 🤖 Context-aware question answering with Gemini
- ⚡ Express.js REST API
- 🏗️ Beginner-friendly implementation of a production-style RAG pipeline

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- Multer
- pdf-parse
- Google Gemini API
- Gemini Embedding Model
- Qdrant Vector Database
- JavaScript

---

# 📌 RAG Workflow

```text
                 User Uploads PDF
                        │
                        ▼
               Extract Text from PDF
                        │
                        ▼
             Split into Overlapping Chunks
                        │
                        ▼
        Generate Embeddings for Every Chunk
                        │
                        ▼
      Store Embeddings in Qdrant Vector DB
                        │
──────────────────────────────────────────────

                User Asks Question
                        │
                        ▼
       Generate Question Embedding
                        │
                        ▼
      Perform Semantic Search in Qdrant
                        │
                        ▼
      Retrieve Most Relevant Chunk
                        │
                        ▼
     Send Context + Question to Gemini
                        │
                        ▼
              Generate Final Answer
```

---

## 📂 Project Structure

```text
Chat-With-PDF/
│
├── uploads/
├── .env
├── .gitignore
├── package.json
├── index.js
└── README.md
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/your-username/Chat-With-PDF.git
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file:

```env
GoogleGenAI=YOUR_GEMINI_API_KEY
QDRANT_URL=YOUR_QDRANT_URL
QDRANT_API_KEY=YOUR_QDRANT_API_KEY
```

### Start the server

```bash
node index.js
```

---

## 📡 API Endpoints

### Create Qdrant Collection

```http
GET /create-collection
```

Creates a vector collection for storing document embeddings.

---

### Upload PDF & Ask Question

```http
POST /upload
```

**Form Data**

| Key | Type |
|------|------|
| pdf | File |
| question | Text |

---

## 🧠 How It Works

1. Upload a PDF.
2. Extract text using `pdf-parse`.
3. Split the document into overlapping chunks.
4. Generate embeddings for each chunk.
5. Store chunk embeddings in Qdrant.
6. Generate an embedding for the user's question.
7. Perform semantic vector search in Qdrant.
8. Retrieve the most relevant chunk.
9. Send the retrieved context to Gemini.
10. Return the generated answer.

---

## 🚧 Future Improvements

- Store embeddings only once per document
- Retrieve Top-K relevant chunks instead of one
- Multi-document support
- React/Next.js frontend
- Chat history & conversational memory
- Hybrid Search (Keyword + Vector Search)
- Metadata filtering
- Streaming responses
- Docker deployment

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Vedant Varma**

If you found this project useful, consider giving it a ⭐ on GitHub!
