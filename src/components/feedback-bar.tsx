"use client";

import { useState, useRef, useEffect } from "react";

export function FeedbackBubble() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const bubbleRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (bubbleRef.current && !bubbleRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  async function handleSubmit() {
    if (!message.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (res.ok) {
        setStatus("sent");
        setMessage("");
        setTimeout(() => {
          setOpen(false);
          setStatus("idle");
        }, 2000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="relative" ref={bubbleRef}>
      <button
        onClick={() => { setOpen(!open); setStatus("idle"); }}
        className="text-[11px] font-medium text-primary border border-primary/30 rounded-full px-2.5 py-px hover:bg-primary/5 cursor-pointer transition-all"
      >
        Deja un comentario
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 sm:left-1/2 sm:-translate-x-1/2 w-72 sm:w-80 bg-surface-container-lowest rounded-xl shadow-ambient-hover p-4 z-50">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="¿Qué opinas? ¿Qué te gustaría ver?"
            className="w-full h-24 text-sm text-on-surface bg-surface-container-low rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
            disabled={status === "sending" || status === "sent"}
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-on-surface-variant">
              {status === "sent" && "¡Gracias por tu comentario!"}
              {status === "error" && "Error al enviar. Intenta de nuevo."}
            </span>
            <button
              onClick={handleSubmit}
              disabled={!message.trim() || status === "sending" || status === "sent"}
              className="px-4 py-1.5 bg-primary text-on-primary text-xs font-bold rounded-lg hover:bg-primary-container disabled:opacity-40 transition-all cursor-pointer"
            >
              {status === "sending" ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
