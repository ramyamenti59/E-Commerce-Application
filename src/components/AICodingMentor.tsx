import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Send, Sparkles, User, BrainCircuit, Play, Check, Copy } from 'lucide-react';

interface AICodingMentorProps {
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  activeContext?: string;
}

export default function AICodingMentor({ 
  chatHistory, 
  onSendMessage, 
  isLoading,
  activeContext 
}: AICodingMentorProps) {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Suggested prompt pills
  const suggestions = [
    { label: "React Product Catalog layout", prompt: "Can you provide a React code template for a responsive ShopEZ Product Catalog with filters?" },
    { label: "Mongoose Order schema validation", prompt: "How do I design a MongoDB Order and User collection schema with validation?" },
    { label: "JWT Token authorization routes", prompt: "Explain how to write a secure JWT verification middleware in Express.js." },
    { label: "Postman testing guide", prompt: "What are the key endpoints and headers I should verify in Postman for the checkout flow?" }
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleSuggestionClick = (prompt: string) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  const handleCopyCode = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Simple Markdown-like block helper to format code snippets elegantly in the chat
  const formatMessageText = (message: ChatMessage) => {
    const text = message.text;
    const parts = text.split("```");
    
    return parts.map((part, index) => {
      // If index is odd, it's code block
      if (index % 2 === 1) {
        // Strip out optional language tag
        const lines = part.split("\n");
        const firstLine = lines[0].trim();
        const hasLang = ["typescript", "javascript", "tsx", "jsx", "ts", "js", "html", "css", "mongodb"].includes(firstLine.toLowerCase());
        const codeContent = hasLang ? lines.slice(1).join("\n") : part;
        const blockId = `${message.id}-${index}`;

        return (
          <div key={index} className="my-3 bg-gray-900 border border-gray-800 rounded-lg overflow-hidden text-left font-mono text-xs text-[#e0f2fe] shadow-md">
            <div className="flex items-center justify-between bg-gray-950 px-3.5 py-1.5 border-b border-gray-800 text-gray-400 text-[10px]">
              <span>{hasLang ? firstLine.toUpperCase() : 'CODE SNIPPET'}</span>
              <button 
                onClick={() => handleCopyCode(codeContent, blockId)}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                {copiedId === blockId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 overflow-x-auto whitespace-pre custom-scrollbar leading-relaxed">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      // Normal text with bold formats and carriage returns
      return (
        <span key={index} className="whitespace-pre-wrap leading-relaxed block text-xs font-medium tracking-wide">
          {part.split('\n').map((line, lIdx) => {
            // Very simple list bullet styling
            if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
              return (
                <span key={lIdx} className="block pl-4 py-0.5 relative">
                  <span className="absolute left-1.5 top-2.5 w-1.5 h-1.5 bg-[#0035c5] rounded-full" />
                  {line.trim().substring(2)}
                </span>
              );
            }
            
            // Bold headings formatting
            if (line.trim().startsWith('###')) {
              return (
                <span key={lIdx} className="block text-sm font-black font-headline text-[#0035c5] mt-3.5 mb-1.5">
                  {line.trim().substring(3).trim()}
                </span>
              );
            }
            
            if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
              return (
                <strong key={lIdx} className="block text-gray-800 font-bold mt-1.5">
                  {line.replace(/\*\*/g, '')}
                </strong>
              );
            }

            return <span key={lIdx} className="block min-h-[4px]">{line}</span>;
          })}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl h-[calc(100vh-10rem)] shadow-sm overflow-hidden">
      {/* Mentor Header */}
      <div className="bg-[#0035c5] p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center border border-white/10">
            <BrainCircuit className="w-5 h-5 text-[#6aff88]" />
          </div>
          <div>
            <h3 className="font-bold font-headline text-sm tracking-wide flex items-center gap-1.5">
              <span>AI Coding Mentor</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            </h3>
            <span className="text-[10px] text-blue-100 font-semibold tracking-wide">
              Powered by Gemini • {activeContext ? `Context: ${activeContext}` : 'ShopEZ Spec Advisor'}
            </span>
          </div>
        </div>
      </div>

      {/* Suggestion pills if chat history is small */}
      {chatHistory.length <= 1 && (
        <div className="p-3 bg-blue-50/50 border-b border-blue-100/30">
          <span className="text-[10px] font-black uppercase text-gray-400 block mb-2">Suggested Mentor Queries:</span>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(s.prompt)}
                className="text-[10px] font-bold text-[#0035c5] bg-white border border-blue-100 hover:border-[#0035c5] hover:bg-blue-50/20 px-2.5 py-1 rounded transition-all text-left cursor-pointer"
              >
                {s.label} ➔
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/30">
        {chatHistory.map((message) => {
          const isUser = message.sender === 'user';
          return (
            <div 
              key={message.id} 
              className={`flex items-start gap-2.5 max-w-[85%] ${
                isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Profile/Mentor Avatar */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border text-[10px] font-bold ${
                isUser 
                  ? 'bg-blue-100 text-blue-700 border-blue-200' 
                  : 'bg-emerald-100 text-emerald-800 border-emerald-200'
              }`}>
                {isUser ? <User className="w-3.5 h-3.5" /> : 'AI'}
              </div>

              {/* Message Box */}
              <div className={`rounded-2xl p-3.5 shadow-sm text-xs leading-relaxed ${
                isUser 
                  ? 'bg-[#0035c5] text-white rounded-tr-none' 
                  : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
              }`}>
                {formatMessageText(message)}
                <span className={`block text-[8px] mt-1.5 ${isUser ? 'text-blue-200/80' : 'text-gray-400'} text-right font-medium`}>
                  {message.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Gemini API thinking dots */}
        {isLoading && (
          <div className="flex items-center gap-2.5 max-w-[80%]">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold text-[10px]">
              AI
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-3 shadow-sm text-xs text-gray-500 flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 bg-[#0035c5] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-[#0035c5] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-[#0035c5] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="ml-1 text-[10px] uppercase tracking-wider text-gray-400">Mentor is drafting guide...</span>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleSubmit} className="p-3.5 bg-white border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isLoading ? 'Drafting response...' : 'Ask your AI Mentor a code or database design question...'}
          disabled={isLoading}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-[#0035c5] focus:border-[#0035c5] outline-none transition-all text-gray-800 placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 bg-[#0035c5] hover:bg-opacity-95 disabled:opacity-40 text-white rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
