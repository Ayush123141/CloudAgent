import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Sparkles, Send, X, ChevronDown, MessageSquare, Terminal, RefreshCw } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { MONO } from "../../styles/theme";

const PRESET_PROMPTS = [
  "Why did CPU reach 98% saturation?",
  "What is the rollback risk to v1.7?",
  "Show me the Git commit regression summary",
  "Summarize incident timeline in 3 bullet points",
];

const PRESET_ANSWERS = {
  "Why did CPU reach 98% saturation?": 
    "**RCA Synthesis:** At 10:18 AM, deployment v1.8 omitted an index hint on the high-throughput `order_lookup` SQL query. Under production load, PostgreSQL performed sequential table scans across 18M rows. Downstream services encountered 1.5s timeouts, triggering exponential retry storms that queued requests faster than CPU threads could drain, driving CPU from 45% to 98%.",
  
  "What is the rollback risk to v1.7?":
    "**Safety Gate Assessment:** **Low Risk (Confidence: 89%)**.\n• v1.8 introduced no destructive database schema migrations.\n• v1.7 is a certified stable release that ran for 14 days with 0 SLA violations.\n• Ephemeral sandbox simulation predicts error rates will drop from 42% to 3% within 2 minutes of rollback.",
  
  "Show me the Git commit regression summary":
    "**Commit 9f4a1c2 (release/v1.8):**\n• Modified: `src/repositories/order_lookup.sql`\n• Line 44 removed: `/*! USE INDEX (idx_tx_account_status_created) */`\n• Impact: Query execution time rose from 40ms to 640ms median latency, causing connection pool exhaustion.",

  "Summarize incident timeline in 3 bullet points":
    "• **10:18 AM - Origin:** Deployment v1.8 applied with query index regression.\n• **10:24 AM - Detection:** CloudDoctor detected 98% CPU and generated INC-1042.\n• **10:29–10:31 AM - Resolution:** Rollback to v1.7 executed with 100% telemetry recovery verified."
};

export default function IncidentCopilot({ stage }) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi, I'm **CloudDoctor AI Copilot**. I am actively monitoring production telemetry. Ask me any question about **INC-1042**, the root cause derivation, or the rollback safety gate!",
      time: "10:25:30",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = PRESET_ANSWERS[query];
      if (!botResponse) {
        botResponse = `**CloudDoctor Autonomous Analysis for "${query}":**\nBased on correlated metrics, logs, and git traces, the incident on **payment-service** is directly linked to query latency regressions in deployment **v1.8**. All telemetry signals indicate that executing the approved rollback to **v1.7** is the safest remediation path.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9998,
          background: theme.accent,
          color: "#FFFFFF",
          border: "none",
          borderRadius: "50%",
          width: 54,
          height: 54,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: `0 8px 25px ${theme.accent}60`,
        }}
        title="Open CloudDoctor AI Copilot"
      >
        <span className="relative flex items-center justify-center">
          <Bot size={26} />
          <span
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping"
            style={{ background: "#FFFFFF", opacity: 0.7 }}
          />
        </span>
      </motion.button>

      {/* Slide-out Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.94 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              bottom: 88,
              right: 24,
              width: 420,
              maxWidth: "calc(100vw - 48px)",
              height: 560,
              maxHeight: "calc(100vh - 120px)",
              background: theme.surface,
              border: `1px solid ${theme.borderStrong}`,
              borderRadius: 14,
              boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
              display: "flex",
              flexDirection: "column",
              zIndex: 9998,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: "14px 18px",
                borderBottom: `1px solid ${theme.border}`,
                background: theme.surface2,
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: theme.accentSoft,
                    border: `1px solid ${theme.accentBorder}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Sparkles size={16} style={{ color: theme.accent }} />
                </div>
                <div>
                  <div className="text-sm font-bold flex items-center gap-1.5" style={{ color: theme.text }}>
                    <span>CloudDoctor AI Copilot</span>
                    <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: theme.accentSoft, color: theme.accent, fontSize: 10 }}>
                      LIVE
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: theme.textMuted }}>
                    Autonomous Incident Telemetry Assistant
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: theme.textMuted,
                  cursor: "pointer",
                  padding: 4,
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Message List */}
            <div
              style={{
                flex: 1,
                padding: "16px 18px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {messages.map((m, idx) => {
                const isUser = m.sender === "user";
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <div
                      style={{
                        maxWidth: "88%",
                        padding: "10px 14px",
                        borderRadius: isUser ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                        background: isUser ? theme.accent : theme.surface2,
                        color: isUser ? "#FFFFFF" : theme.text,
                        border: isUser ? "none" : `1px solid ${theme.border}`,
                        fontSize: 12.5,
                        lineHeight: 1.5,
                      }}
                    >
                      <div style={{ whiteSpace: "pre-wrap" }}>
                        {m.text}
                      </div>
                    </div>
                    <span className="text-xs mt-1" style={{ color: theme.textMuted, fontSize: 10 }}>
                      {m.time}
                    </span>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs" style={{ color: theme.textMuted }}>
                  <Bot size={14} style={{ color: theme.accent }} />
                  <span>CloudDoctor is analyzing telemetry...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div
              style={{
                padding: "8px 14px",
                background: theme.surface2,
                borderTop: `1px solid ${theme.border}`,
                display: "flex",
                gap: 6,
                overflowX: "auto",
              }}
            >
              {PRESET_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer"
                  style={{
                    background: theme.surface,
                    border: `1px solid ${theme.borderStrong}`,
                    color: theme.textSecondary,
                    fontSize: 11,
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
              style={{
                padding: "12px 16px",
                borderTop: `1px solid ${theme.border}`,
                background: theme.surface,
              }}
            >
              <input
                type="text"
                placeholder="Ask about RCA, logs, or rollback risk..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{
                  flex: 1,
                  background: theme.surface2,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 8,
                  padding: "8px 12px",
                  color: theme.text,
                  fontSize: 12,
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  background: theme.accent,
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 8,
                  width: 34,
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
