import { useState } from "react";
import SourceCard from "./SourceCard";

interface Message {
    role: "user" | "assistant";
    content: string;
    sources?: {
        filePath: string;
        chunkIndex: number;
        content: string;
    }[];
}

export default function ChatInterface() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    
    async function handleSubmit() {
        if (!input.trim()) {return;}
    
        setMessages(messages => [...messages, { role: "user", content: input }]);

        setLoading(true);

        setInput("");

        try {
            const res = await fetch("/api/query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: input })
            })

            const data = await res.json();

            setMessages(prev => [...prev, { role: "assistant", content: data.answer, sources: data.sources }]);

            setLoading(false);
        } catch (error) {
            setMessages(prev => [...prev, { role: "assistant", content: "Failed fetching data." }]);
            setLoading(false);
        }
    }   

    return (
        <div className="w-full p-4 m-4 border rounded-lg">
            <div className="flex flex-col gap-2 mb-4">
            {messages.map((message, index) => (
                <div key={index} className = {`w-3/5 rounded p-3 flex ${message.role === "user" ? "ml-auto bg-gray-100" : "mr-auto"} overflow-auto`} >
                {message.content} 
                {message.role === "assistant" && message.sources?.map((source, i) => (
                    <SourceCard key={i} filePath={source.filePath} chunkIndex={source.chunkIndex} content={source.content}/>
                ))}
                </div>
            ))}
            {loading && <p className="text-sm text-gray-400">Thinking...</p>}
            </div>
            <div>
                <input className="w-full border rounded p-2" placeholder="Ask a question about the codebase..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            </div>
            <div>
                <button className="mt-2 px-4 py-2 bg-black text-white rounded text-sm" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
}