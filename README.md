# 📄 Chat With PDF - RAG System

A **Retrieval-Augmented Generation (RAG)** application built with **Node.js**, **Express.js**, and **Google Gemini API** that allows users to upload PDF documents and ask questions about their content using natural language.

Instead of sending the entire PDF to the LLM, the system retrieves only the most relevant sections of the document using **embeddings** and **semantic search**, resulting in more accurate and efficient responses.

---

## 🚀 Features

- 📂 Upload PDF documents
- 📖 Extract text from PDFs
- ✂️ Split text into overlapping chunks
- 🧠 Generate embeddings using Gemini Embedding Model
- 🔍 Perform semantic search using cosine similarity
- 🤖 Generate context-aware answers using Gemini
- ⚡ Express.js REST API
- 🏗️ Beginner-friendly implementation of a RAG pipeline

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **Multer**
- **pdf-parse**
- **Google Gemini API**
- **Gemini Embedding Model**
- **JavaScript**

---

# 📌 Project Workflow

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
           Store Chunk + Embedding in Memory
                        │
──────────────────────────────────────────────────────

                User Asks a Question
                        │
                        ▼
       Generate Question Embedding
                        │
                        ▼
     Compare with Chunk Embeddings
     (Cosine Similarity Search)
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
├── uploads/              # Temporary uploaded PDFs
├── .env                  # API Keys (Ignored)
├── .gitignore
├── package.json
├── index.js              # Main Server
└── README.md
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/your-username/Chat-With-PDF.git
```

### Navigate into the project

```bash
cd Chat-With-PDF
```

### Install dependencies

```bash
npm install
```

### Create a `.env` file

```env
GoogleGenAI=YOUR_API_KEY
```

### Start the server

```bash
node index.js
```

---

## 📡 API Endpoint

### Upload PDF & Ask Question

**POST**

```http
POST /upload
```

### Form Data

| Key | Type |
|------|------|
| pdf | File |
| question | Text |

Example:

```
Question:
What is Machine Learning?
```

---

## 🧠 RAG Architecture

This project follows the Retrieval-Augmented Generation (RAG) workflow:

1. Upload PDF
2. Extract PDF text
3. Chunk the document
4. Generate embeddings for each chunk
5. Generate embedding for the user's question
6. Compute cosine similarity
7. Retrieve the most relevant chunk
8. Send the retrieved context to Gemini
9. Return the generated answer

---

## 🚧 Future Improvements

- ✅ Vector Database Integration (FAISS / Pinecone / ChromaDB)
- ✅ Store embeddings permanently
- ✅ Retrieve Top-K relevant chunks
- ✅ Multiple PDF support
- ✅ Conversation history
- ✅ Streaming responses
- ✅ Hybrid Search (Keyword + Vector Search)
- ✅ Better chunking strategies
- ✅ Frontend using React or Next.js

---

## 📸 Demo

_Add screenshots or a demo GIF here._

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

Feel free to fork this repository and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Vedant Varma**

If you found this project useful, consider giving it a ⭐ on GitHub!
