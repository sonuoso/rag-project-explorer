import fs from "fs";
import path from "path";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const ALLOWED_EXTENSIONS = new Set<string>([
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".py",
    ".md",
    ".json",
    ".html",
    ".css"
])

const IGNORED_DIRS = new Set<string>([
    "node_modules",
    ".git",
    ".next",
    "dist",
    "build"
])

export function walkFiles(dir: string): string[] {
    const results: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
           if (!IGNORED_DIRS.has(entry.name)) {
            results.push(...walkFiles(path.join(dir, entry.name)));
           }
        } else {
            if (ALLOWED_EXTENSIONS.has(path.extname(entry.name))) {
                results.push(path.join(dir, entry.name))
            }
        }
    }
    return results;
}

export interface ChunkWithMetadata {
    content: string;
    filePath: string;
    chunkIndex: number;
    language: string;
}

export async function chunkFile(filePath: string): Promise<ChunkWithMetadata[]> {
    const content = fs.readFileSync(filePath, "utf-8");
    if (!content.trim()) {
        return [];
    }

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 700,
        chunkOverlap: 100,
    })

    const chunks = await splitter.splitText(content);

    //This is how I approached with traditional for loop to iterate over each chunk in the chunks list and turn it into a ChunkWithMetadata object.
    // const chunkList: ChunkWithMetadata[] = [];

    // for (let i = 0; i < chunks.length; i++) {
    //     const chunkObj: ChunkWithMetadata = {
    //         content: chunks[i],
    //         filePath: filePath,
    //         chunkIndex: i,
    //         language: path.extname(filePath).replace(".","")
    //     }
    //     chunkList.push(chunkObj)
    // }

    // return chunkList

    return chunks.map((chunk,index) => ({
        content: chunk,
        filePath: filePath,
        chunkIndex: index,
        language: path.extname(filePath).replace(".","")
    }))
}

export async function ingestDirectory(dir: string): Promise<ChunkWithMetadata[]> {
    const files = walkFiles(dir);
    console.log(`${files.length} files Found.`);

    const allChunks: ChunkWithMetadata[] = [];

    for (const file of files) {
        const fileChunks = await chunkFile(file);
        allChunks.push(...fileChunks);
    }

    console.log(`${allChunks.length} chunks found.`);

    return allChunks;
}
