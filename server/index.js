/**
 * ============================================================================
 * PDF CHATBOT USING RAG (Retrieval-Augmented Generation)
 * ============================================================================
 *
 * Workflow:
 *
 * 1. User uploads a PDF and asks a question.
 * 2. Extract text from the uploaded PDF.
 * 3. Divide the PDF into smaller chunks.
 * 4. Generate embeddings for every chunk.
 * 5. Generate an embedding for the user's question.
 * 6. Compare question embedding with every chunk embedding.
 * 7. Retrieve the most relevant chunk.
 * 8. Send the retrieved chunk along with the question to Gemini.
 * 9. Return the generated answer.
 *
 * ============================================================================
 */

const express = require("express");
const multer = require("multer");
const {QdrantClient} = require("@qdrant/js-client-rest");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const app = express();

/**
 * Multer stores uploaded PDFs temporarily
 * inside the uploads/ folder.
 */
const upload = multer({ dest: "uploads/" });

/**
 * Create Gemini client using API Key
 */
const ai = new GoogleGenAI({
  apiKey: process.env.GoogleGenAI,
});
/**
 * ============================================================================
 * createEmbedding()
 * ============================================================================
 *
 * Embeddings convert text into vectors (list of numbers).
 *
 * Example:
 *
 * "Resume"
 * ->
 * [0.24, -0.12, 0.67, ....]
 *
 * Similar meanings produce similar vectors.
 *
 * Later we compare vectors instead of comparing words.
 * ============================================================================
 */

async function createEmbedding(text) {
  const response = await ai.models.embedContent({
       // Embedding model
    model: "gemini-embedding-001",
    // Text to convert into vector
    contents: text,
  });
     // Return only the vector  
  return response.embeddings[0].values;
}

const qrant = new QdrantClient({
    url : process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
})

/**
 * ============================================================================
 * cosineSimilarity()
 * ============================================================================
 *
 * Measures similarity between two vectors.
 *
 * Higher Score  -> More Similar
 * Lower Score   -> Less Similar
 *
 * Example:
 *
 * Question:
 * "What is Resume?"
 *
 * Compare against every chunk.
 *
 * Chunk 1 -> 0.12
 * Chunk 2 -> 0.91   <- Best
 * Chunk 3 -> 0.43
 *
 * Retrieve Chunk 2.
 *
 * NOTE:
 * Current implementation uses Dot Product.
 *
 * Replace this later with proper Cosine Similarity.
 * ============================================================================
 */

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  return dotProduct;
}
/**
 * Home Route
 */
app.get("/", (req, res) => {
  res.send("Hey i am vedant");
});

app.get("/create-collection",async(req,res)=>{
    try{ 
      await qrant.createCollection('pdf-docs' , {
        vectors : { 
          size :3072,
          distance:"Cosine",
        },
      })
      res.send("Collection is created Sucessfully");
    }catch(e){
      res.status(500).send(e);

    }
})

/**
 * ============================================================================
 * POST /upload
 * ============================================================================
 *
 * This is the heart of the application.
 *
 * Responsibilities:
 *
 * ✔ Upload PDF
 * ✔ Extract Text
 * ✔ Create Chunks
 * ✔ Generate Chunk Embeddings
 * ✔ Generate Question Embedding
 * ✔ Retrieve Best Chunk
 * ✔ Ask Gemini
 * ✔ Return Answer
 *
 * ============================================================================
 */

app.post("/upload", upload.single("pdf"), async (req, res) => {
  console.log("File:", req.file);
  console.log("Body:", req.body);

  // Extracting the text
  try {
     /**
         * ---------------------------------------------------------
         * Step 1
         * Read uploaded PDF
         * ---------------------------------------------------------
         */
    const dataBuffer = fs.readFileSync(req.file.path);
    /**
         * ---------------------------------------------------------
         * Step 2
         * Extract text from PDF
         * ---------------------------------------------------------
         */
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;

    fs.unlinkSync(req.file.path);
    console.log("Uploaded file deleted.");
     /**
         * ---------------------------------------------------------
         * Step 3
         * Chunking
         * ---------------------------------------------------------
         *
         * Why chunk?
         *
         * Large PDFs cannot be embedded efficiently.
         *
         * Therefore,
         *
         * Divide the PDF into smaller overlapping chunks.
         *
         * Example:
         *
         * Chunk 1
         * 0 ---------------------1000
         *
         * Chunk 2
         *        800----------------1800
         *
         * Notice:
         * 200 characters overlap.
         *
         * This prevents information loss between chunks.
         *
         */

    const chunkSize = 1000;
    const overlap = 200;
    const chunks = [];

    for (let i = 0; i < text.length; i += chunkSize - overlap) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    /**
         * ---------------------------------------------------------
         * Step 4
         * Generate embeddings for every chunk
         * ---------------------------------------------------------
         *
         * Structure:
         *
         * [
         *   {
         *      text: "...",
         *      embedding:[]
         *   },
         *   {
         *      text:"...",
         *      embedding:[]
         *   }
         * ]
         *
         */

    const chunkEmbeddings = [];
    for (const chunk of chunks) {
      const embedding = await createEmbedding(chunk);
      chunkEmbeddings.push({
        text: chunk,
        embedding,
      });
    }

    const points = chunkEmbeddings.map((item, index)=>({
      id : index+1,
      vector : item.embedding,
      payload : { 
        text : item.text
      }
    }))

    await qrant.upsert("pdf-docs",{
       points, 
      });

    /**
         * ---------------------------------------------------------
         * Step 5
         * Generate Question Embedding
         * ---------------------------------------------------------
         */
    const question = req.body.question;
    const questionEmbedding = await createEmbedding(question);

    const searchResult = await qrant.search('pdf-docs', {
      vector : questionEmbedding,
      limit:1
    });

    console.log(searchResult);

    const bestChunk = searchResult[0].payload.text;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `Answer the Question using the context ${bestChunk} and Questions is ${question}`,
    });
    
    // returns the answer
    res.send(response.text);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
/**
 * Start Express Server
 */
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
