"use client";

import { useState, useRef } from "react";
import SourceCard from "./SourceCard";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit() {
    if (!input.trim()) {
      return;
    }

    setMessages((messages) => [...messages, { role: "user", content: input }]);

    setLoading(true);

    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "2.5rem";
    }

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
    <div
      className={`w-full h-[calc(100vh-96px)] flex flex-col ${messages.length === 0 ? "justify-center items-center" : ""} px-4`}
    >
      {messages.length === 0 && <h1>AI Project</h1>}
      <div
        className={`flex ${messages.length > 0 ? "flex-1" : ""} flex-col overflow-auto scrollbar-thin scrollbar-thumb-[#202020] scrollbar-track-[#020202] px-2 pt-8 pb-12 gap-2`}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`rounded-xl mb-4 px-4 py-3 ${message.role === "user" ? "max-w-3xl ml-auto bg-[#202020]" : "w-full mr-auto"}`}
          >
            <div className="markdown">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {message.content}
              </ReactMarkdown>
            </div>
            {message.role === "assistant" && (
              <div className="pt-8">
                <h5 className="font-light">References:</h5>
                {message.sources?.map((source, i) => (
                  <SourceCard
                    key={i}
                    filePath={source.filePath}
                    chunkIndex={source.chunkIndex}
                    content={source.content}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && <p className="text-sm text-gray-400">Thinking...</p>}
      </div>
      <div className="w-full pt-4 bg-[#202020] border border-neutral-700 rounded-xl">
        <textarea
          className="w-full px-4 text-base text-neutral-200 bg-transparent focus:outline-none resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-[#202020] scrollbar-track-[#141414]"
          placeholder="Ask a question about the codebase..."
          value={input}
          rows={1}
          ref={textareaRef}
          style={{ height: "2.5rem", minHeight: "2.5rem", maxHeight: "20rem" }}
          onChange={(e) => {
            setInput(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 320) + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <div className="flex pt-2 justify-end">
          <button
            className="mb-4 mr-4 px-2 py-2 bg-[#008235] hover:bg-green-600 text-white rounded-lg text-sm"
            onClick={handleSubmit}
          >
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
