"use client";

import { useEffect, useRef, useState } from "react";

// Definimos la interfaz para las props
interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export default function TypewriterText({
  text,
  speed = 40,
  onComplete,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const doneRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // reset al cambiar el texto
    setDisplayed("");
    doneRef.current = false;
    const chars = Array.from(text ?? ""); // seguro con acentos/emoji

    let i = 0;

    const tick = () => {
      const nextDisplayed = chars.slice(0, i + 1).join("");

      setDisplayed(nextDisplayed);
      i += 1;

      if (i < chars.length) {
        timeoutRef.current = window.setTimeout(tick, speed);
      } else if (!doneRef.current) {
        doneRef.current = true;
        onComplete?.();
      }
    };

    timeoutRef.current = window.setTimeout(tick, speed);

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [text, speed]); //sin onComplete en deps

  return <span>{displayed}</span>;
}