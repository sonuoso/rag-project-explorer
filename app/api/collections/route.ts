import { ChromaClient } from "chromadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const chromaClient = new ChromaClient({
      host: "localhost",
      port: 8000,
      ssl: false,
    });

    const collections = await chromaClient.listCollections();

    return NextResponse.json({ message: "Collections fetched", collections: collections })
  } catch (error) {
    console.error("Fetching error: ", error);
    return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 })
  }
}
