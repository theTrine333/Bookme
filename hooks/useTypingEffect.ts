import { useEffect, useRef, useState } from "react";
import TypingEffectProps from "./interfaces";

interface MultiTypingEffectProps extends Omit<TypingEffectProps, "text"> {
  texts: string[];
}

const useTypingEffect = ({
  texts = [],
  typingDelay = 200,
  cursorDelay = 800,
  onEndTyping,
}: MultiTypingEffectProps) => {
  const [typedText, setTypedText] = useState("");
  const currentTextIndex = useRef(0);
  const currentCharIndex = useRef(0);
  const isDeleting = useRef(false);
  const [isCursor, setisCursor] = useState(false);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      const currentText = texts[currentTextIndex.current] || "";

      if (!isDeleting.current) {
        if (currentCharIndex.current < currentText.length) {
          currentCharIndex.current += 1;
          setTypedText(currentText.slice(0, currentCharIndex.current));
        } else {
          // Finished typing, start deleting after pause
          isDeleting.current = true;
        }
      } else {
        if (currentCharIndex.current > 0) {
          currentCharIndex.current -= 1;
          setTypedText(currentText.slice(0, currentCharIndex.current));
        } else {
          // Finished deleting, go to next text
          isDeleting.current = false;
          currentTextIndex.current =
            (currentTextIndex.current + 1) % texts.length;
          onEndTyping && onEndTyping();
        }
      }
    }, typingDelay);

    const cursorInterval = setInterval(() => {
      setisCursor((prev) => !prev);
    }, cursorDelay);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, [texts, typingDelay, cursorDelay, onEndTyping]);

  return {
    typedText,
    isCursor,
  };
};

export default useTypingEffect;
