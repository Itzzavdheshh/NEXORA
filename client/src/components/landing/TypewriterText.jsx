import React, { useState, useEffect } from "react";

export function TypewriterText({
  words = [
    "Accelerate your tech career with 1-on-1 expert guidance.",
    "Book verified 60-minute mentorship slots in real time.",
    "Master System Design, Coding & Resume Reviews.",
    "Bridge the gap between campus and tech industry."
  ],
  typingSpeed = 50,
  deletingSpeed = 30,
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
      // Deleting phase
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(targetWord.slice(0, currentText.length - 1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    } else {
      // Typing phase
      if (currentText.length < targetWord.length) {
        timer = setTimeout(() => {
          setCurrentText(targetWord.slice(0, currentText.length + 1));
        }, typingSpeed);
      } else {
        // Finished typing word, pause before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={`inline-flex items-center flex-wrap ${className}`}>
      <span>{currentText}</span>
      <span
        className="ml-1 inline-block h-[1.1em] w-[3px] rounded-full bg-[var(--accent-primary)] animate-blink align-middle"
        aria-hidden="true"
      />
    </span>
  );
}

export default TypewriterText;
