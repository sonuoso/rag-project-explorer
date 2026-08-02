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
  const [isExpanded, setIsExpanded] = useState(false);

  async function handleSubmit() {
    if (!input.trim()) {
      return;
    }

    setMessages((messages) => [...messages, { role: "user", content: input }]);

    setLoading(true);

    setInput("");

    setIsExpanded(false);

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
        className={`flex ${messages.length > 0 ? "flex-1" : ""} flex-col overflow-auto scrollbar-thin scrollbar-thumb-[#202020] scrollbar-track-transparent px-2 pt-8 pb-12 gap-2`}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`rounded-xl mb-4 px-4 py-3 ${message.role === "user" ? "max-w-3xl ml-auto bg-[#212121]" : "w-full mr-auto"}`}
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
      <div
        className={`w-full flex bg-[#1a1a1a] border border-neutral-800 ${messages.length === 0 && !isExpanded ? "py-2 rounded-full" : "pt-4 flex-col rounded-xl"}`}
      >
        <textarea
          className={`w-full justify-center ${messages.length === 0 && !isExpanded && "py-2"} px-4 text-base text-neutral-200 bg-transparent focus:outline-none resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-[#202020] scrollbar-track-transparent`}
          placeholder="Ask a question about the codebase..."
          value={input}
          rows={1}
          ref={textareaRef}
          style={{ height: "2.5rem", minHeight: "2.5rem", maxHeight: "20rem" }}
          onChange={(e) => {
            setInput(e.target.value);
            e.target.style.height = "auto";
            const newHeight = Math.min(e.target.scrollHeight, 320);
            e.target.style.height = newHeight + "px";
            setIsExpanded(newHeight > 40); // 2.5rem = 40px
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        {((messages.length === 0 && input) || messages.length !== 0) && (
          <div className="flex justify-end">
            <button
              className={`${messages.length === 0 && !isExpanded ? "my-1 rounded-full" : "my-4 rounded-lg"} mx-4 px-2 py-2 bg-[#008235] hover:bg-green-600 text-white text-sm`}
              onClick={handleSubmit}
            >
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
