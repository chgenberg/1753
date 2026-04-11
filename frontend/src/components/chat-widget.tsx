"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { API_URL } from "@/lib/api";
import { getProduct, productDisplayName, productPrice } from "@/lib/products";
import { formatPrice } from "@/lib/currency";
import { useCart } from "@/providers/cart-provider";
import { useLocale } from "@/providers/locale-provider";

const MAX_MESSAGES = 40;

type ChatRow =
  | { key: string; kind: "user"; text: string }
  | { key: string; kind: "assistant"; html: string }
  | { key: string; kind: "product"; productId: string };

type ChatAction = { type: "add_to_cart"; productId: string };

type ChatResponse = {
  content?: string;
  responseId?: string | null;
  actions?: ChatAction[];
};

function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>)/g, (m) =>
      m.startsWith("<ul>") ? m : "<ul>" + m + "</ul>"
    )
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>");
}

export function ChatWidget() {
  const id = useId();
  const { t, path, locale, messages } = useLocale();
  const { addItem } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [rows, setRows] = useState<ChatRow[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [responseId, setResponseId] = useState<string | null>(null);

  const bubbleCountRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const localeRef = useRef(locale);

  useEffect(() => {
    if (localeRef.current === locale) return;
    localeRef.current = locale;
    setRows([]);
    setResponseId(null);
    bubbleCountRef.current = 0;
    setTipsOpen(false);
    setInput("");
    setTyping(false);
  }, [locale]);

  const scrollToEnd = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToEnd();
  }, [rows, typing, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setRows((prev) => {
      if (prev.length > 0) return prev;
      bubbleCountRef.current = 1;
      return [
        {
          key: `${id}-welcome`,
          kind: "assistant",
          html: formatMarkdown(messages.chatWidget.welcome),
        },
      ];
    });
  }, [isOpen, id, messages.chatWidget.welcome]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (tipsOpen) {
        setTipsOpen(false);
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, tipsOpen]);

  const appendAssistant = useCallback((text: string) => {
    bubbleCountRef.current += 1;
    setRows((r) => [
      ...r,
      {
        key: `${id}-a-${Date.now()}-${Math.random()}`,
        kind: "assistant",
        html: formatMarkdown(text),
      },
    ]);
  }, [id]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      if (bubbleCountRef.current >= MAX_MESSAGES) {
        appendAssistant(messages.chatWidget.maxMessages);
        return;
      }

      bubbleCountRef.current += 1;
      setRows((r) => [
        ...r,
        {
          key: `${id}-u-${Date.now()}-${Math.random()}`,
          kind: "user",
          text: trimmed,
        },
      ]);
      setInput("");
      setTyping(true);

      try {
        const res = await fetch(`${API_URL}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            previousResponseId: responseId,
          }),
        });

        setTyping(false);

        if (!res.ok) {
          const err = (await res.json().catch(() => ({}))) as { message?: string };
          throw new Error(err.message || "Chat error");
        }

        const data = (await res.json()) as ChatResponse;
        if (data.responseId) setResponseId(data.responseId);

        if (data.actions?.length) {
          for (const action of data.actions) {
            if (action.type === "add_to_cart" && action.productId) {
              addItem(action.productId);
              setRows((r) => [
                ...r,
                {
                  key: `${id}-p-${action.productId}-${Date.now()}`,
                  kind: "product",
                  productId: action.productId,
                },
              ]);
            }
          }
        }

        if (data.content) {
          appendAssistant(data.content);
        }
      } catch {
        setTyping(false);
        appendAssistant(messages.chatWidget.error);
      }
    },
    [
      addItem,
      appendAssistant,
      id,
      messages.chatWidget.error,
      messages.chatWidget.maxMessages,
      responseId,
      locale,
    ]
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const tips = messages.chatWidget.tips;

  return (
    <div id="cw">
      <button
        type="button"
        className={`cw-trigger ${isOpen ? "cw-trigger--open" : ""}`}
        aria-label={isOpen ? messages.chatWidget.closeChat : messages.chatWidget.openChat}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((o) => !o)}
      >
        <svg
          className="cw-trigger-icon cw-trigger-icon--chat"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <svg
          className="cw-trigger-icon cw-trigger-icon--close"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <button
        type="button"
        className={`cw-backdrop ${isOpen ? "cw-backdrop--open" : ""}`}
        aria-hidden
        tabIndex={-1}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`cw-modal ${isOpen ? "cw-modal--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={messages.chatWidget.dialogLabel}
        hidden={!isOpen}
      >
        <div className="cw-modal-inner">
          <div className="cw-header">
            <div className="cw-header-left">
              <div className="cw-avatar">1753</div>
              <div>
                <div className="cw-header-title">{messages.chatWidget.title}</div>
                <div className="cw-header-sub">{messages.chatWidget.subtitle}</div>
              </div>
            </div>
            <button
              type="button"
              className="cw-close"
              aria-label={messages.chatWidget.closeChat}
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>
          </div>

          <div className="cw-messages" aria-live="polite">
            {rows.map((row) => {
              if (row.kind === "user") {
                return (
                  <div key={row.key} className="cw-bubble cw-bubble--user">
                    {row.text}
                  </div>
                );
              }
              if (row.kind === "assistant") {
                return (
                  <div
                    key={row.key}
                    className="cw-bubble cw-bubble--assistant"
                    dangerouslySetInnerHTML={{ __html: row.html }}
                  />
                );
              }
              const p = getProduct(row.productId);
              if (!p) return null;
              const name = productDisplayName(p, locale);
              return (
                <div key={row.key} className="cw-product-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={name} loading="lazy" />
                  <div className="cw-product-info">
                    <div className="cw-product-name">{name}</div>
                    <div className="cw-product-price">
                      {formatPrice(productPrice(p, locale), locale)}
                    </div>
                  </div>
                  <Link href={path("product", { productId: row.productId })} className="cw-product-link">
                    {messages.chatWidget.viewProduct}
                  </Link>
                </div>
              );
            })}
            {typing ? (
              <div className="cw-typing" aria-hidden>
                <span />
                <span />
                <span />
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          <div className={`cw-tips-overlay ${tipsOpen ? "cw-tips-overlay--open" : ""}`}>
            <div className="cw-tips-header">
              <span className="cw-tips-title">{messages.chatWidget.tipsTitle}</span>
              <button
                type="button"
                className="cw-tips-close"
                aria-label={messages.chatWidget.closeTips}
                onClick={() => setTipsOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="cw-tips-grid">
              {tips.map((tip) => (
                <button
                  key={tip}
                  type="button"
                  className="cw-tip"
                  onClick={() => {
                    setTipsOpen(false);
                    void sendMessage(tip);
                  }}
                >
                  {tip}
                </button>
              ))}
            </div>
          </div>

          <form className="cw-form" autoComplete="off" onSubmit={onSubmit}>
            <button
              type="button"
              className="cw-tips-btn"
              aria-label={messages.chatWidget.showTips}
              onClick={() => setTipsOpen((o) => !o)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </button>
            <textarea
              ref={textareaRef}
              className="cw-input"
              placeholder={messages.chatWidget.placeholder}
              maxLength={5000}
              rows={1}
              aria-label={messages.chatWidget.placeholder}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                const el = e.target;
                el.style.height = "auto";
                el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim()) {
                    const form = e.currentTarget.closest("form");
                    form?.requestSubmit();
                  }
                }
              }}
            />
            <button type="submit" className="cw-send" aria-label={messages.chatWidget.send}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
