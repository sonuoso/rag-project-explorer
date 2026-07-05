import { OpenAIEmbeddings } from "@langchain/openai";
import { ChromaClient } from "chromadb";
import type { ChunkWithMetadata } from "./ingest";

const collectionName = "project-explorer";

// creating an instance of the OpenAIEmbeddings class
const embedding = new OpenAIEmbeddings({
    modelName: "text-embedding-3-small", // text-embedding-3-small is the embedding model used in this project
    openAIApiKey: process.env.OPENAI_API_KEY!
})

export async function embedAndStore(chunks: ChunkWithMetadata[]): Promise<void> {

    // creating a chromaDB instance
    const chromaClient = new ChromaClient({
        host: "localhost",
        port: 8000,
        ssl: false
    })

    // creating a collection on the ChromaDB instance
    const collection = await chromaClient.getOrCreateCollection({
        name: collectionName
    })

    // extracting just the content from each chunk as an array of strings
    const documents = chunks.map(chunk => chunk.content);

    // sending the content to emedding model to embed and get an array of vectors (arrays of numbers) in return
    const embeddings = await embedding.embedDocuments(documents);

    // recreating ids to be unique in a separate array
    const ids = chunks.map(chunk => `${chunk.filePath}-${chunk.chunkIndex}`);

    // removing content from each chunk since it's aready been extracted in documents array.
    const metadatas = chunks.map(chunk => ({
        filePath: chunk.filePath,
        chunkIndex: chunk.chunkIndex,
        language: chunk.language
    }))

    // upserting ids, embeddings, documents and metadata into ChromaDB
    await collection.upsert({
        ids, // same as ids: ids
        embeddings, // same as embeddings: embeddings
        documents, // same as documents: documents
        metadatas // same as metadatas: metadatas
    })

    console.log(`${chunks.length} Chunks stored in ChromaDB.`)
}

export async function embedQuery(query: string): Promise<number[]> {
    // embedQuery takes a single query string and returns a single vector (an array of numbers)
    const queryVector = await embedding.embedQuery(query);
    
    return queryVector;
}