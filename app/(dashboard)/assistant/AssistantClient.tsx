// @ts-nocheck
"use client";

import { useRef, useEffect, useState } from "react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { formatCFA } from "@/lib/utils/format";
import { cn } from "@/lib/utils/format";
import { useChat } from "@ai-sdk/react";

interface BusinessContext {
  todaySales: number;
  todayExpenses: number;
  weekSales: number;
  weekExpenses: number;
  monthSales: number;
  activeDebts: { name: string; amount: number }[];
  totalDebt: number;
  lowStockProducts: string[];
}

interface AssistantClientProps {
  context: BusinessContext;
  userId: string;
}

const SUGGESTIONS = [
  "Quel est mon bilan d'aujourd'hui ?",
  "Combien j'ai vendu cette semaine ?",
  "Quels clients me doivent de l'argent ?",
  "Comment augmenter mes ventes ?",
];

export default function AssistantClient({ context, userId }: AssistantClientProps) {
  const { messages, status, sendMessage, error } = useChat({
    api: "/api/chat",
    body: { context }, // On passe le contexte Ã  chaque requÃªte
    onError: (err) => {
      console.error("Chat error:", err);
    },
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: `Bonjour ! ðŸ‘‹ Je suis votre assistant FADIMA.\n\nAujourd'hui, vos ventes sont de **${formatCFA(
          context.todaySales
        )}**. Comment puis-je vous aider ?`,
      },
    ],
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [status]);

  const formatMessageContent = (msg: any) => {
    console.log("Rendering message:", msg);
    // Si msg a des "parts" (nouveau format de l'API), on extrait le texte de toutes les parties texte
    let text = msg.content || "";
    if (msg.parts && Array.isArray(msg.parts)) {
      const textParts = msg.parts.filter((p: any) => p.type === "text").map((p: any) => p.text);
      if (textParts.length > 0) {
        text = textParts.join("");
      }
    }

    if (!text) return null;
    return text.split("\n").map((line: string, i: number) => {
      // Basic markdown bold formatting for React
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={i} className="min-h-[1.5rem]">
          {parts.map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={j}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </div>
      );
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage({
      role: "user",
      content: suggestion,
    });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    sendMessage({
      role: "user",
      content: inputValue,
    });
    setInputValue("");
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 gradient-primary rounded-2xl flex items-center justify-center shadow-sm">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Assistant FADIMA</h1>
          <p className="text-gray-500 text-xs">PropulsÃ© par Google Gemini</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <div className={cn("max-w-xs sm:max-w-md lg:max-w-lg space-y-2")}>
              <div
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-primary-600 text-white rounded-br-sm"
                    : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm"
                )}
              >
                <div className="space-y-0.5">{formatMessageContent(msg)}</div>
              </div>
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex gap-3">
            <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="flex gap-2 overflow-x-auto pb-3 pt-1 scrollbar-hide">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => handleSuggestionClick(s)}
            disabled={isLoading}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 hover:border-primary-400 hover:text-primary-700 transition-colors whitespace-nowrap disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleFormSubmit}
        className="flex gap-3 bg-white border border-gray-200 rounded-2xl p-2"
      >
        <input
          type="text"
          className="flex-1 bg-transparent px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none"
          placeholder="Posez une question sur votre business..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center disabled:opacity-40 transition-opacity hover:opacity-90"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </form>
    </div>
  );
}

