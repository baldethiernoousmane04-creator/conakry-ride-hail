import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, User, Check, CheckCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ChatMessage } from '../types';

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  currentUserId: string;
  otherUserName: string;
  otherUserAvatar?: string;
  onSendMessage?: (text: string) => void;
}

export const Chat: React.FC<ChatProps> = ({
  isOpen,
  onClose,
  tripId,
  currentUserId,
  otherUserName,
  otherUserAvatar,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Initial greeting or history
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Mock history or auto-greeting
      setMessages([
        {
          id: 'msg-1',
          senderId: 'system',
          receiverId: currentUserId,
          tripId,
          text: `Chat sécurisé avec ${otherUserName} activé.`,
          createdAt: new Date().toISOString(),
          isRead: true
        }
      ]);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      receiverId: 'other-id',
      tripId,
      text: inputText,
      createdAt: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate response
    setTimeout(() => {
      const response: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        senderId: 'other-id',
        receiverId: currentUserId,
        tripId,
        text: getMockResponse(inputText),
        createdAt: new Date().toISOString(),
        isRead: true
      };
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  const getMockResponse = (text: string): string => {
    const t = text.toLowerCase();
    if (t.includes('où') || t.includes('ou es')) return "J'arrive, je suis à 2 minutes !";
    if (t.includes('bonjour') || t.includes('salut')) return "Bonjour ! Je suis en route.";
    if (t.includes('ok') || t.includes('daccord')) return "Parfait, à tout de suite.";
    return "Bien reçu, je fais au plus vite !";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[300] bg-white flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X size={24} />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border">
                  {otherUserAvatar ? (
                    <img src={otherUserAvatar} alt={otherUserName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <User size={20} />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">{otherUserName}</h3>
                  <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">En ligne</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50/50"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'} ${msg.senderId === 'system' ? 'justify-center' : ''}`}
              >
                {msg.senderId === 'system' ? (
                  <div className="bg-gray-200/50 text-gray-500 text-[10px] px-3 py-1 rounded-full font-medium">
                    {msg.text}
                  </div>
                ) : (
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.senderId === currentUserId
                        ? 'bg-black text-white rounded-tr-none shadow-sm'
                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-sm'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 ${msg.senderId === currentUserId ? 'text-gray-400' : 'text-gray-400'}`}>
                      <span className="text-[8px]">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.senderId === currentUserId && (
                        msg.isRead ? <CheckCheck size={10} className="text-blue-400" /> : <Check size={10} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Replies */}
          <div className="p-2 border-t bg-white overflow-x-auto no-scrollbar flex gap-2">
            {["J'arrive !", "Je suis là", "D'accord", "Où êtes-vous ?"].map((text) => (
              <button
                key={text}
                onClick={() => {
                  setInputText(text);
                }}
                className="whitespace-nowrap px-4 py-1.5 rounded-full border border-gray-200 text-xs font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                {text}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-white pb-8">
            <div className="flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Écrivez un message..."
                className="rounded-full bg-gray-100 border-none focus-visible:ring-1 focus-visible:ring-gray-300"
              />
              <Button 
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="rounded-full w-12 h-10 p-0 bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};