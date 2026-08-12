"use client";

import TypewriterAnimation from "./TypewriterAnimation";
export default function Homeface() {
  const languages = [
    { iconClass: "devicon-typescript-plain", label: "TypeScript" },
    { iconClass: "devicon-javascript-plain", label: "JavaScript" },
    { iconClass: "devicon-python-plain", label: "Python" },
    { iconClass: "devicon-go-original-wordmark", label: "Go" },
    { iconClass: "devicon-rust-plain", label: "Rust" },
    { iconClass: "devicon-java-plain", label: "Java" },
    { iconClass: "devicon-markdown-plain", label: "Markdown" },
    { iconClass: "devicon-json-plain", label: "JSON" },
    { iconClass: "devicon-html5-plain", label: "HTML" },
    { iconClass: "devicon-css3-plain", label: "CSS" },
  ];

  return (
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
  );
}
