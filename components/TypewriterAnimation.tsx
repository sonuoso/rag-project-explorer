"use client";
import { useState, useEffect } from "react";

interface TypewriterProps {
  phrases: string[];
}

export default function TypewriterAnimation({ phrases }: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timeout = setTimeout(
      () => {
        const currentPhrase = phrases[currentIndex];

        if (!isDeleting) {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));

          if (displayText.length + 1 === currentPhrase.length) {
            setIsPaused(true);
            setTimeout(() => {
              setIsPaused(false);
              setIsDeleting(true);
            }, 500)
          }
        }

        if (isDeleting) {
          setDisplayText(displayText.slice(0, displayText.length - 1));

          if (displayText.length === 0) {
            setIsDeleting(false);
            setCurrentIndex((prev) => (prev + 1) % phrases.length);
          }
        }
      },
      isDeleting ? 150 : 200,
    );

    return () => clearTimeout(timeout);
  }, [displayText, currentIndex, isDeleting, isPaused]);

  return (
    <>
      <span className="font-brains text-2xl text-[#008235]">
        {displayText}
        <span id="Blink" className="font-brains text-neutral-400">
          |
        </span>
      </span>
    </>
  );
}
