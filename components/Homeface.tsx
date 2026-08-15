"use client";

import { useState } from "react";
import TypewriterAnimation from "./TypewriterAnimation";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

interface HomefaceProps {
  onIndex: (dirPath: string) => void;
  indexing: boolean;
}

export default function Homeface({onIndex, indexing}: HomefaceProps) {
  const languages = [
    { iconClass: "devicon-typescript-plain", label: "TypeScript" },
    { iconClass: "devicon-javascript-plain", label: "JavaScript" },
    { iconClass: "devicon-python-plain", label: "Python" },
    { iconClass: "devicon-go-original-wordmark", label: "Go" },
    { iconClass: "devicon-rust-plain", label: "Rust" },
    { iconClass: "devicon-java-plain", label: "Java" },
    { iconClass: "devicon-c-original", label: "C" },
    { iconClass: "devicon-cplusplus-plain", label: "C++" },
    { iconClass: "devicon-csharp-plain", label: "C#" },
    { iconClass: "devicon-markdown-plain", label: "Markdown" },
    { iconClass: "devicon-json-plain", label: "JSON" },
    { iconClass: "devicon-html5-plain", label: "HTML" },
    { iconClass: "devicon-css3-plain", label: "CSS" },
  ];

  const [repoName, setRepoName] = useState("");
  const [dirPath, setDirPath] = useState("");

  function handleIndex() {
    if (!dirPath.trim()) return;
    onIndex(dirPath);
  }

  return (
    <div
      className={`w-full min-h-[472px] flex flex-col gap-12 justify-center items-center overflow-auto p-4`}
    >
      <div className="self-start">
        <h2 className="font-inter-400 sm:text-xl text-neutral-200 mb-4">
          Stop reading code. Start asking.
        </h2>
        <TypewriterAnimation
          phrases={[
            "Where is the authentication logic?",
            "How does the API layer work?",
            "Explain the folder structure.",
            "Find all environment variables used.",
            "How does error handling work?",
            "What dependencies does this project use?",
          ]}
        />
        <p className="font-inter text-neutral-400 mt-12">
          Index your code repository and ask anything about it.
        </p>
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {languages.map((lang) => (
            <div
              key={lang.label}
              className="flex items-center text-lg text-neutral-400"
            >
              <i className={lang.iconClass}></i>
              <span className="font-inter-200 text-sm px-2 py-1 text-neutral-400">
                {lang.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className={"w-full flex bg-[#1a1a1a] border border-neutral-800 py-2 rounded-full"}
      >
        <textarea
          className={
            "w-full justify-center py-2 px-4 text-base text-neutral-200 bg-transparent focus:outline-none resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-[#202020] scrollbar-track-transparent"
          }
          placeholder="Paste the link to your repository here."
          value={dirPath}
          rows={1}
          style={{ height: "2.5rem", minHeight: "2.5rem", maxHeight: "20rem" }}
          onChange={(e) => {
            setDirPath(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleIndex();
            }
          }}
        />
        <div className="flex justify-end">
          <button
            className={
              "my-1 rounded-full mx-4 px-2 py-2 bg-[#008235] hover:bg-green-600 text-white text-sm"
            }
            onClick={handleIndex}
          >
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
