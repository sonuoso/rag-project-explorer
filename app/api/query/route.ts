import { retrieve } from "@/lib/retriever";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { question } = await request.json(); // destructuring (extracting a specific property from an object without the dot notation) question from request body

        const result = await retrieve(question); // call retrieve on question and get the answer string with relevant file paths and code chunks

        return NextResponse.json({ message: "Answer generated.", answer: result.content, sources: result.sources });
    } catch (error) {
        console.error("Generating error: ", error);
        return NextResponse.json({ error: "Generating failed." }, { status: 500 });
    }
}