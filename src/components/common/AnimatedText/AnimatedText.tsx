import React, { useState, useEffect } from "react";
import styles from "./AnimatedText.module.css";

interface AnimatedTextProps {
  text: string;
  typingSpeed?: number;
  delay?: number;
  cursor?: boolean;
  onComplete?: () => void;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  typingSpeed = 20,
  delay = 0,
  cursor = true,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Reset component state when text prop changes
    setDisplayedText("");
    setCurrentIndex(0);
    setIsTyping(false);
  }, [text]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    // Initial delay before typing starts
    if (currentIndex === 0 && !isTyping) {
      timer = setTimeout(() => {
        setIsTyping(true);
      }, delay);
      return () => clearTimeout(timer);
    }

    // Typing effect
    if (isTyping && currentIndex < text.length) {
      timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timer);
    }

    // Typing complete
    if (isTyping && currentIndex === text.length) {
      onComplete?.();
    }
  }, [text, currentIndex, delay, typingSpeed, isTyping, onComplete]);

  return (
    <div className={styles.AnimatedTextContainer}>
      <span className={styles["animated-text"]}>{displayedText}</span>
      {cursor && isTyping && currentIndex < text.length && (
        <span className={styles.cursor}>|</span>
      )}
      {cursor && currentIndex === text.length && (
        <span className={`${styles.cursor} ${styles.blinking}`}>|</span>
      )}
    </div>
  );
};

export default AnimatedText;
