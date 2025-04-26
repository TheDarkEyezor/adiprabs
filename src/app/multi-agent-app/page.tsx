"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import CatContainer from '../components/CatContainer';

export default function Page() {
  const [messages, setMessages] = useState<{type: 'user' | 'agent', content: string}[]>([]);
  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>(["Could you give me a general breakdown of my business?", "Could you explain to me what you can do?", "Are there any upcoming regulations that I should be aware of?"]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Load initial suggestions when the component mounts

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, {type: 'user', content: text}]);
    setInputText("");

    try {
      const response = await fetch("http://127.0.0.1:10000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          { 
            'query': text,
          }
        ),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setMessages((prev) => [...prev, {type: 'agent', content: data.answer || "No response"}]);
      
      // Update suggestions if available in response
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessages((prev) => [...prev, {type: 'agent', content: "Error retrieving data."}]);
    }
  };

  return (
    <main className="h-screen flex flex-col bg-gray-50">
      {/* Header with login dropdown */}
      <header className="bg-indigo-600 text-white py-3 px-4 flex justify-between items-center">
        <h1 className="font-semibold text-xl">Finance Assistant</h1>
        <div className="relative">
          <button 
            onClick={() => setIsLoginOpen(!isLoginOpen)}
            className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-md transition-colors"
          >
            Account
          </button>
          {isLoginOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
              <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-indigo-100">Login</a>
              <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-indigo-100">Register</a>
              <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-indigo-100">Profile</a>
            </div>
          )}
        </div>
      </header>
      
      {/* Chat container - takes remaining height */}
      <div className="flex-grow flex flex-col p-4 overflow-hidden">
        {/* Messages area */}
        <div className="flex-grow bg-white rounded-t shadow p-4 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div key={idx} className={`py-1 ${msg.type === 'agent' ? 'pl-2 border-l-2 border-indigo-500' : ''}`}>
              <strong>{msg.type === 'user' ? 'You: ' : 'Agent: '}</strong>
              {msg.type === 'agent' ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Suggestions */}
        <div className="bg-gray-100 p-3 flex flex-wrap gap-2 justify-center">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(suggestion)}
              className="bg-indigo-500 text-white px-3 py-1.5 rounded hover:bg-indigo-600 transition-colors text-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>
        
        {/* Input area */}
        <div className="flex bg-white rounded-b shadow p-2">
          <input
            className="flex-grow border rounded-l px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
            placeholder="Type a message..."
          />
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded-r hover:bg-indigo-600 transition-colors"
            onClick={() => handleSendMessage(inputText)}
          >
            Send
          </button>
        </div>
      </div>
      
      <CatContainer catCount={4} />
    </main>
  );
}