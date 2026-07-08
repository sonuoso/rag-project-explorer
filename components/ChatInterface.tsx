"use client";

import { useState } from "react";
import SourceCard from "./SourceCard";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

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
    if (!input.trim()) {
      return;
    }

    setMessages((messages) => [...messages, { role: "user", content: input }]);

    setLoading(true);

    setInput("");

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer, sources: data.sources },
      ]);

      setLoading(false);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Failed fetching data." },
      ]);
      setLoading(false);
    }
  }

  return (
    <div className="w-auto flex flex-col h-[calc(100vh-72px)]">
      <div className="flex flex-1 flex-col overflow-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-[#101010] p-2 gap-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-full rounded p-3 ${message.role === "user" ? "ml-auto bg-gray-800" : "mr-auto"}`}
          >
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {message.content}
            </ReactMarkdown>
            {message.role === "assistant" &&
              message.sources?.map((source, i) => (
                <SourceCard
                  key={i}
                  filePath={source.filePath}
                  chunkIndex={source.chunkIndex}
                  content={source.content}
                />
              ))}
          </div>
        ))}
        {loading && <p className="text-sm text-gray-400">Thinking...</p>}
      </div>
      <div className="h-32 border rounded-xl mb-10">
        <textarea
          className="w-full p-2 text-sm resize-none overflow-hidden"
          placeholder="Ask a question about the codebase..."
          value={input}
          rows={1}
          onChange={(e) => {
            setInput(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <button
          className="mt-2 px-4 py-2 bg-black text-white rounded text-sm"
          onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
