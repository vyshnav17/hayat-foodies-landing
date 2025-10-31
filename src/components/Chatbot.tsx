import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm the Hayat Foods assistant. I can help you with information about our products, contact details, delivery, and more. What would you like to know?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    // Contact information
    if (message.includes("contact") || message.includes("phone") || message.includes("number")) {
      return "You can reach us at:\n📞 Phone: +91 98765 43210\n📧 Email: info@hayatfoods.com\n📍 Address: Kannur, Kerala\n\nWe also have WhatsApp ordering available!";
    }

    // Products
    if (message.includes("product") || message.includes("bread") || message.includes("bun") || message.includes("chapati")) {
      return "We offer fresh bakery products including:\n🍞 Bread (₹40)\n🥖 Chapati (₹20)\n🥐 Cream Buns (₹30)\n🍩 Chocolate Buns (₹25)\n🧁 Baby Chocolate Buns (₹15)\n🥨 Rusk (₹35)\n\nAll products are freshly baked daily!";
    }

    // Delivery
    if (message.includes("delivery") || message.includes("shipping") || message.includes("order")) {
      return "We deliver fresh products throughout Kannur district daily. Minimum order: ₹100\n\nDelivery charges: ₹20 (within city)\nFree delivery for orders above ₹500\n\nOperating hours: 7 AM - 8 PM";
    }

    // Location/Availability
    if (message.includes("location") || message.includes("where") || message.includes("find")) {
      return "Our manufacturing unit is located in Kannur, Kerala. We serve the entire Kannur district with fresh daily deliveries.\n\nAvailable at select retail outlets and stores near you!";
    }

    // About
    if (message.includes("about") || message.includes("company") || message.includes("hayat")) {
      return "Hayat Foods India has been providing premium bakery products since our establishment. We're committed to quality, freshness, and serving the Kannur community with love.\n\nOur state-of-the-art manufacturing unit ensures the freshest products daily!";
    }

    // Pricing
    if (message.includes("price") || message.includes("cost") || message.includes("rate")) {
      return "Our pricing includes GST:\n🍞 Bread: ₹44 (₹40 + ₹4 GST)\n🥖 Chapati: ₹22 (₹20 + ₹2 GST)\n🥐 Cream Buns: ₹33 (₹30 + ₹3 GST)\n🍩 Normal Buns: ₹27.50 (₹25 + ₹2.50 GST)\n🧁 Baby Chocolate Buns: ₹16.50 (₹15 + ₹1.50 GST)\n🥨 Rusk: ₹38.50 (₹35 + ₹3.50 GST)";
    }

    // Ingredients
    if (message.includes("ingredient") || message.includes("made") || message.includes("quality")) {
      return "All our products use premium ingredients:\n• Fresh flour and yeast\n• Pure butter and cream\n• Natural flavors and colors\n• No artificial preservatives\n• Traditional recipes with modern techniques";
    }

    // Default responses
    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return "Hello! Welcome to Hayat Foods. How can I help you today?";
    }

    if (message.includes("thank") || message.includes("thanks")) {
      return "You're welcome! We're here to serve you with the freshest bakery products. Have a great day! 🍞";
    }

    // Fallback
    return "I'd be happy to help you with information about Hayat Foods! You can ask me about our products, contact details, delivery information, pricing, or anything else related to our bakery services.";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.div
        className="fixed bottom-6 left-6 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3.2, duration: 0.5, type: "spring" }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 transform"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 left-6 w-80 h-96 bg-card border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Hayat Foods Assistant</h3>
                  <p className="text-xs opacity-90">Online</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                        message.isBot
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <div className="whitespace-pre-line">{message.text}</div>
                      <div
                        className={`text-xs mt-1 ${
                          message.isBot ? "text-muted-foreground/70" : "text-primary-foreground/70"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-muted p-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about Hayat Foods..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="sm"
                  className="px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
