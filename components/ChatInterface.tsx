"use client";

import { useState, useRef, useEffect } from "react";
import SourceCard from "./SourceCard";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import RepoceryAnimation from "./RepoceryAnimation";
import Homeface from "./Homeface";

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
  const bottomRef = useRef<HTMLDivElement>(null);
  const [indexing, setIndexing] = useState(false);
  const [collections, setCollections] = useState<string[]>([]);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);

  // Chat should auto scroll to the bottom when the loading indicator appears
  useEffect(() => {
    if (loading) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading]);

  async function handleSubmit() {
    if (!input.trim() || !activeCollection) {
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
        body: JSON.stringify({
          question: input,
          collectionName: activeCollection,
        }),
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

  async function handleIndex(dirPath: string) {
    const folderName = dirPath.split(/[\\/]/).filter(Boolean).pop();
    const collectionId = `${folderName}-${Math.random().toString(36).slice(2, 6)}`;

    try {
      setIndexing(true);
      const res = await fetch("/api/index", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dirPath, repoName: collectionId }),
      });

      if (!res.ok) throw new Error("Indexing failed");
      setActiveCollection(collectionId);
    } catch (error) {
      console.error("Indexing failed: ", error);
    } finally {
      setIndexing(false);
    }
  }

  return (
    <div
      className={`w-full h-[calc(100vh-96px)] flex flex-col ${activeCollection === null && "items-center justify-center"} p-4`}
    >
      {activeCollection === null && (
        <Homeface onIndex={handleIndex} indexing={indexing} />
      )}
      {activeCollection && (
        <>
          <div
            className={`flex flex-1 flex-col overflow-auto scrollbar-thin scrollbar-thumb-[#202020] scrollbar-track-transparent px-2 pt-8 pb-12 gap-2`}
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
                    <h5 className="font-light italic">References:</h5>
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
            {loading && (
              <div className="mb-4">
                <RepoceryAnimation size={50} />
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div
            className={`w-full flex bg-[#1a1a1a] border border-neutral-800 pt-4 flex-col rounded-xl`}
          >
            <textarea
              className={`w-full justify-center px-4 text-base text-neutral-200 bg-transparent focus:outline-none resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-[#202020] scrollbar-track-transparent`}
              placeholder="Ask a question about the codebase..."
              value={input}
              rows={1}
              ref={textareaRef}
              style={{
                height: "2.5rem",
                minHeight: "2.5rem",
                maxHeight: "20rem",
              }}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                const newHeight = Math.min(e.target.scrollHeight, 320);
                e.target.style.height = newHeight + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <div className="flex justify-end">
              <button
                className={`my-4 rounded-lg mx-4 px-2 py-2 bg-[#008235] hover:bg-green-600 text-white text-sm`}
                onClick={handleSubmit}
              >
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
