"use client";

import { useEffect, useMemo, useState } from "react";

type ArticleAudioProps = {
  title: string;
  summary: string;
  brief: string[];
  content: string[];
};

export function ArticleAudio({ title, summary, brief, content }: ArticleAudioProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  const narration = useMemo(() => {
    const sections = [
      `Now playing: ${title}.`,
      summary,
      ...(brief.length > 0 ? ["Read in sixty seconds.", ...brief] : []),
      ...content,
    ];

    return sections.join(" ");
  }, [title, summary, brief, content]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function stopPlayback() {
    if (!isSupported) {
      return;
    }

    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }

  function startPlayback() {
    if (!isSupported) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(narration);
    utterance.rate = 0.98;
    utterance.pitch = 1;
    utterance.lang = "en-IN";
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  }

  if (!isSupported) {
    return <p className="text-xs text-muted">Audio brief works on supported modern browsers.</p>;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={isPlaying ? stopPlayback : startPlayback}
        className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-soft"
      >
        {isPlaying ? "Stop audio" : "Listen"}
      </button>
      <span className="text-xs text-muted">English (India)</span>
    </div>
  );
}
