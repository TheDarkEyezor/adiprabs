"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Page() {
  const [messages, setMessages] = useState<{ type: 'user' | 'agent'; content: string }[]>([]);
  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([
    "Could you give me a general breakdown of my business?",
    "Could you explain to me what you can do?",
    "Are there any upcoming regulations that I should be aware of?",
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { type: 'user', content: text }]);
    setInputText("");

    try {
      const response = await fetch("http://127.0.0.1:10000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setMessages((prev) => [...prev, { type: 'agent', content: data.answer || "No response" }]);
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessages((prev) => [...prev, { type: 'agent', content: "Error retrieving data." }]);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col min-h-[calc(100vh-112px)]">
        {/* Chat container */}
        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-6 py-8 gap-4">
          {/* Header */}
          <div className="border-b border-ink-line pb-4 mb-2">
            <h1 className="font-mono text-mono-sm text-ink-muted">// Finance Assistant</h1>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
            {messages.length === 0 && (
              <p className="font-mono text-mono-sm text-ink-muted text-center py-12">
                Ask me anything about your business.
              </p>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-sm border text-ink-fg text-sm leading-relaxed ${
                    msg.type === 'user'
                      ? 'bg-ink-surface2 border-ink-line2'
                      : 'bg-ink-surface border-ink-line'
                  }`}
                >
                  <span className="block font-mono text-[10px] tracking-wide2 uppercase text-ink-muted mb-1.5">
                    {msg.type === 'user' ? 'you' : 'agent'}
                  </span>
                  {msg.type === 'agent' ? (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <span>{msg.content}</span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(s)}
                  className="px-3 py-1.5 border border-ink-line rounded-sm font-mono text-mono-sm text-ink-fg2 hover:border-teal-dim hover:text-teal transition-colors text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 border border-ink-line rounded-sm bg-ink-surface focus-within:border-teal-dim transition-colors">
            <input
              className="flex-1 bg-transparent px-4 py-3 font-sans text-sm text-ink-fg placeholder:text-ink-muted focus:outline-none"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
              placeholder="Type a message..."
            />
            <button
              className="px-4 py-3 font-mono text-mono-sm text-teal-dim border-l border-ink-line hover:text-teal transition-colors"
              onClick={() => handleSendMessage(inputText)}
            >
              send →
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
