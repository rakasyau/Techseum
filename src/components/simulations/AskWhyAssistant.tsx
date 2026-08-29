"use client";

import { useState, useRef, useEffect } from "react";
import { type Topic } from "@/data/topics";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./AskWhyAssistant.module.css";

interface AskWhyAssistantProps {
  topic: Topic;
  currentLevelName: string;
}

export default function AskWhyAssistant({ topic, currentLevelName }: AskWhyAssistantProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    {
      role: "assistant",
      text: language === "id"
        ? `Halo! Saya adalah Pemandu Museum AI Techseum untuk "${topic.title}". Tanyakan pertanyaan apapun, dan saya akan menjelaskan sesuai level "${currentLevelName}" Anda.`
        : `Hello! I'm your Techseum Museum Guide for "${topic.title}". Ask me any follow-up question, and I'll explain it matching your current "${currentLevelName}" reading level.`,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = language === "id"
    ? [
        `Mengapa teknologi ini penting saat ini?`,
        `Apa hambatan fisik terbesar dalam ${topic.category}?`,
        `Bagaimana teknologi ini ditemukan secara historis?`,
      ]
    : [
        `Why is this technology important today?`,
        `What is the biggest physical bottleneck in ${topic.category}?`,
        `How was this invented historically?`,
      ];

  // Auto-scroll internally inside messages list when new messages arrive (without moving window)
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (userText: string) => {
    if (!userText.trim() || isTyping) return;

    const newMsgs: Array<{ role: "user" | "assistant"; text: string }> = [
      ...messages,
      { role: "user", text: userText },
    ];
    setMessages(newMsgs);
    setQuestion("");
    setIsTyping(true);
    setError(null);

    try {
      // Send only the last 10 messages for context window efficiency
      const chatHistory = newMsgs.slice(-10).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch("/api/ai-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userText,
          topicTitle: topic.title,
          topicCategory: topic.category,
          currentLevel: currentLevelName,
          chatHistory: chatHistory.slice(0, -1), // exclude current question (sent separately)
        }),
      });

      const data = await res.json();

      if (data.success && data.reply) {
        setMessages([...newMsgs, { role: "assistant", text: data.reply }]);
      } else {
        const fallback = language === "id"
          ? "Maaf, saya tidak dapat memproses pertanyaan Anda saat ini. Silakan coba lagi."
          : "I apologize, I couldn't process your question at the moment. Please try again.";
        setMessages([...newMsgs, { role: "assistant", text: fallback }]);
        setError(data.error || "Unknown error");
      }
    } catch (err) {
      console.error("AI Guide fetch error:", err);
      const fallback = language === "id"
        ? "Koneksi ke AI Guide terputus. Periksa koneksi internet Anda dan coba lagi."
        : "Connection to AI Guide failed. Please check your internet connection and try again.";
      setMessages([...newMsgs, { role: "assistant", text: fallback }]);
      setError("Network error");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={styles.container} id="ask-why-assistant">
      {!isOpen ? (
        <button
          className={styles.triggerBtn}
          onClick={() => setIsOpen(true)}
          id="open-ask-why-btn"
        >
          <span className={styles.sparkleIcon}>✦</span>
          <span className={styles.triggerText}>
            {language === "id" ? "Tanya Pemandu AI: \"Mengapa?\"" : "Ask AI Guide: \"Why?\""}
          </span>
          <span className={styles.levelBadge}>{currentLevelName} Level</span>
        </button>
      ) : (
        <div className={styles.chatBox}>
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderLeft}>
              <span className={styles.aiAvatar}>◉</span>
              <div className={styles.chatHeaderInfo}>
                <h4 className={styles.chatTitle}>
                  {language === "id" ? "Pemandu AI Museum" : "Museum AI Guide"}
                </h4>
                <span className={styles.chatSubtitle}>
                  {language === "id" ? "Didukung oleh" : "Powered by"} Gemini · {topic.title} ({currentLevelName})
                </span>
              </div>
            </div>
            <button
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
            >
              ✕
            </button>
          </div>

          <div ref={messagesContainerRef} className={styles.messagesList}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`${styles.message} ${m.role === "user" ? styles.msgUser : styles.msgAssistant}`}
              >
                <p className={styles.msgText}>{m.text}</p>
              </div>
            ))}
            {isTyping && (
              <div className={`${styles.message} ${styles.msgAssistant}`}>
                <div className={styles.typingDots}>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>

          {messages.length === 1 && (
            <div className={styles.suggestions}>
              <span className={styles.suggLabel}>
                {language === "id" ? "Pertanyaan yang disarankan:" : "Suggested queries:"}
              </span>
              <div className={styles.suggPills}>
                {sampleQuestions.map((q, i) => (
                  <button
                    key={i}
                    className={styles.suggBtn}
                    onClick={() => handleSend(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className={styles.errorBar}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form
            className={styles.inputArea}
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(question);
            }}
          >
            <input
              type="text"
              placeholder={language === "id"
                ? `Tanya tentang ${topic.title}...`
                : `Ask a question about ${topic.title}...`}
              className={styles.input}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isTyping}
              id="ask-why-input"
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={!question.trim() || isTyping}
              id="ask-why-send-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
