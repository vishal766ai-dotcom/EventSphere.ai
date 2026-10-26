import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  MapPin, 
  Clock, 
  Car, 
  Utensils, 
  Gift, 
  CheckCheck, 
  Smile, 
  Phone
} from 'lucide-react';
import { api } from '../services/api';

export default function GuestAssistantBot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "👋 Namaste! I am your AI Event Concierge for Aarav's 1st Birthday Bash at Clubhouse Terrace. How can I help you today?",
      time: "15:40"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickChips = [
    { label: "🚗 Where is parking?", query: "Where is the guest parking and valet?" },
    { label: "🎂 Cake cutting time?", query: "What time does the cake cutting start?" },
    { label: "📍 Live location pin?", query: "Can you share the exact Google Maps venue location?" },
    { label: "🍛 Dinner & food menu?", query: "What are the dinner menu items and is it veg?" },
    { label: "👗 Dress code theme?", query: "What is the dress code or theme for today?" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (queryText = null) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await api.askGuestBot(textToSend);
      setIsTyping(false);

      const botReply = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.answer || "Thank you for asking! We look forward to seeing you at the event.",
        source: response.source,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botReply]);
    } catch (err) {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: "Parking is located at Basement B1/B2. Cake cutting is at 7:30 PM sharp!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[600px]">
      
      {/* WhatsApp Styled Header */}
      <div className="bg-[#075e54] px-4 py-3 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-emerald-700 border-2 border-white/40 flex items-center justify-center font-bold text-sm">
              🎉
            </div>
            <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#075e54] absolute bottom-0 right-0" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="font-bold text-sm">Aarav's Celebration Concierge</h3>
              <span className="text-[10px] bg-emerald-500/30 px-1.5 py-0.2 rounded font-semibold">BOT</span>
            </div>
            <p className="text-[11px] text-emerald-100 flex items-center space-x-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Google Gemini AI • Instant Replies</span>
            </p>
          </div>
        </div>

        <div className="text-right text-[11px] text-emerald-200">
          <span>Day-of Host Desk</span>
        </div>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="bg-slate-950/80 p-2 border-b border-slate-800 flex space-x-1.5 overflow-x-auto scrollbar-none">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip.query)}
            className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-emerald-900/40 border border-slate-700/80 text-[11px] text-slate-300 hover:text-emerald-300 font-medium whitespace-nowrap transition"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Messages Chat Area */}
      <div 
        className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0b141a]"
        style={{
          backgroundImage: "radial-gradient(#1e293b 0.75px, transparent 0.75px)",
          backgroundSize: "16px 16px"
        }}
      >
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          return (
            <div 
              key={msg.id} 
              className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-md leading-relaxed ${
                  isBot 
                    ? 'bg-[#202c33] text-slate-100 rounded-tl-sm' 
                    : 'bg-[#005c4b] text-white rounded-tr-sm'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <div className={`flex items-center space-x-1 mt-1 text-[10px] ${isBot ? 'justify-start text-slate-400' : 'justify-end text-emerald-200'}`}>
                  <span>{msg.time}</span>
                  {!isBot && <CheckCheck className="w-3.5 h-3.5 text-sky-400" />}
                  {isBot && msg.source && (
                    <span className="text-[9px] text-emerald-400 font-mono ml-2">• {msg.source}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#202c33] rounded-2xl px-4 py-2 text-xs text-slate-300 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[10px] text-slate-400 ml-1">AI concierge typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-[#202c33] border-t border-slate-700/60 flex items-center space-x-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Ask anything about parking, timings, menu..."
          className="flex-1 px-4 py-2.5 rounded-full bg-[#2a3942] text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim()}
          className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white flex items-center justify-center shadow-lg transition disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
