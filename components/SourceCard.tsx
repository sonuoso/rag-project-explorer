"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

interface SourceCardProps {
  filePath: string;
  chunkIndex: number;
  content: string;
}

export default function SourceCard({
  filePath,
  chunkIndex,
  content,
}: SourceCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full bg-neutral-900 hover:bg-neutral-800 my-4 p-2 border border-neutral-800 rounded-lg">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex justify-between items-center px-4 py-2 text-left"
      >
        <div>
          <p className="text-sm text-neutral-200">{filePath}</p>
          <p className="text-xs mt-1 text-neutral-400">Chunk {chunkIndex}</p>
        </div>
        <span className="pl-4 text-xs text-neutral-400">
          {expanded ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )}
        </span>
      </button>

      {expanded && (
        <div className="bg-[#101010] rounded-lg p-2">
          <pre className="p-2 mt-2 text-xs overflow-auto scrollbar-thin scrollbar-thumb-[#404040] scrollbar-track-transparent">
            <code>{content}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
