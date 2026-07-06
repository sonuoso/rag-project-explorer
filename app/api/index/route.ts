import { ingestDirectory } from "@/lib/ingest";
import { embedAndStore } from "@/lib/embeddings";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const  { dirPath } = await request.json(); 

        const chunks = await ingestDirectory(dirPath); // executing ingestion (walking and chunking files and returning an array of ChunkWithMetadata objects) with the provided directory path

        await embedAndStore(chunks); // embedding chunks and storing vectors in ChromaDB

        return NextResponse.json({ message: "Indexed successfully.", chunks: chunks.length });
    } catch (error) {
        console.error("Indexing error: ", error);
        return NextResponse.json({ error: "Indexing failed." }, { status: 500 });
    }
}