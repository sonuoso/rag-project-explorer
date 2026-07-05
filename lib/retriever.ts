import { ChatOpenAI } from "@langchain/openai";
import { ChromaClient } from "chromadb";
import { embedQuery, collectionName } from "./embeddings";

// creating a ChatOpenAI instance.
const chat = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY!
})

const k = 5; // number of top chunks to retrieve from collection query

export async function retrieve(question: string): Promise<string> {
    const chromaClient = new ChromaClient({
        host: "localhost",
        port: 8000,
        ssl: false
    })

    const collection = await chromaClient.getCollection({
        name: collectionName
    })

    // embedQuery returns a single vector
    const queryVector = await embedQuery(question);

    // querying on the collection and queryEmbeddings expects an array of vectors
    // since queryVector is a single vector it's wrapped with []
    const results = await collection.query({
        queryEmbeddings: [queryVector],
        nResults: k
    })

    // results is an object with parallel arrays
    // example: results = { ids: [["chunk1-id", "chunk2-id", ...]],documents: [["chunk1 text", "chunk2 text", ...]],metadatas: [[{ filePath: "...", chunkIndex: 0 }, ...]],distances: [[0.12, 0.34, ...]] }
    // the reason for double nesting (value as an array inside an array) is ChromaDB wraps results in a [] since it supports multiple query embeddings at once
    // for generating prompts in this project, it only requires documents and metadatas

    // documents (chunk texts) and its relevant file paths are added together as a single string for gpt-4o to accept within its system content prompt
    const context = results.documents[0].map((doc, i) => {
        const fPath = results.metadatas[0][i]?.filePath; // ? (optional chaining) tells TS if results.metadatas[0][i] is null or undefined, return as undefined instead of crashing
        return `[File: ${fPath}]\n${doc}`;
    }).join("\n\n") // joins all arrays as a single string with an empty line between each formatted chunk

    // chat.invoke takes system prompt and user's question and returns naturally formatted response
    const response = await chat.invoke([
        { role: "system", content: 
            `You are a code assistant. Answer questions about the codebase below. 
            Always cite the file path when referencing code. 
            If the answer isn't in the provided code, say "I'm unable to find an answer for that.".
            ${context}`
         },
        { role: "user", content: question }
    ])

    return response.content as string; // response is an AIMessageChunk object. Its content property contains the required response string but has to be typecast to string
}