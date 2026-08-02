import React, { useState, useEffect } from "react";

export function TypewriterText({
  words = [
    "Accelerate your tech career with 1-on-1 expert guidance.",
    "Book verified 60-minute mentorship slots in real time.",
    "Master System Design, Coding & Resume Reviews.",
    "Bridge the gap between campus and tech industry."
  ],
  typingSpeed = 40,
  deletingSpeed = 20,
  pauseDuration = 2200,
  className = ""
}) {
  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const targetWord = words[wordIndex % words.length];

    let timer;

    if (isDeleting) {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(targetWord.slice(0, currentText.length - 1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    } else {
      if (currentText.length < targetWord.length) {
        timer = setTimeout(() => {
          setCurrentText(targetWord.slice(0, currentText.length + 1));
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={`inline-flex items-center min-h-[1.5em] whitespace-pre-wrap ${className}`}>
      <span>{currentText}</span>
      <span
        className="ml-1 inline-block h-[1.1em] w-[2.5px] rounded-full bg-amber-400 animate-pulse align-middle shrink-0 shadow-[0_0_8px_rgba(245,166,35,0.8)]"
        aria-hidden="true"
      />
    </span>
  );
}

export default TypewriterText;

