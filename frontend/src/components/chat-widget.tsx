"use client";

import { useCallback, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseId, setResponseId] = useState<string | null>(null);
  const messagesEnd = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => messagesEnd.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;
      const userMsg: Message = { role: "user", content: text.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);
      scrollToBottom();

      try {
        const data = await apiFetch<{
          reply: string;
          responseId?: string;
          actions?: { type: string; productId?: string }[];
        }>("/chat", {
          method: "POST",
          body: JSON.stringify({
            message: text.trim(),
            previousResponseId: responseId,
          }),
        });

        if (data.responseId) setResponseId(data.responseId);

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Ursäkta, något gick fel. Försök igen eller kontakta oss på hej@1753skincare.com.",
          },
        ]);
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    },
    [loading, responseId, scrollToBottom]
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-brand-900 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl",
          isOpen && "hidden"
        )}
        aria-label="Öppna chatt"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[70] bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-6 right-6 z-[80] flex h-[500px] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl max-md:inset-x-4 max-md:bottom-4 max-md:right-auto max-md:w-auto">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="text-sm font-bold">1753 SKINCARE</p>
                <p className="text-xs text-muted-foreground">
                  Hudvårdsrådgivare &middot; Svar kan vara AI-genererade
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-brand-50"
                aria-label="Stäng chatt"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-3 pt-12 text-center">
                  <MessageCircle className="h-10 w-10 text-brand-300" />
                  <p className="text-sm text-muted-foreground">
                    Hej! Hur kan jag hjälpa dig med din hudvård idag?
                  </p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "mb-3 max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "ml-auto bg-brand-900 text-white"
                      : "bg-brand-50 text-brand-900"
                  )}
                >
                  {msg.content}
                </div>
              ))}
              {loading && (
                <div className="mb-3 max-w-[85%] rounded-2xl bg-brand-50 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-brand-400" />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-brand-400 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-brand-400 [animation-delay:300ms]" />
                  </div>
                </div>
              )}
              <div ref={messagesEnd} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="border-t border-border px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Skriv ditt meddelande..."
                  className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-900 text-white transition-all hover:bg-brand-800 disabled:opacity-40"
                  aria-label="Skicka"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}
