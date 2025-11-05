import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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

    // Individual product details
    if (message.includes("chapati")) {
      // Scroll to products section and open chapati modal
      setTimeout(() => {
        const productsSection = document.getElementById("products");
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: "smooth" });
          // Trigger click on chapati card
          const chapatiCard = productsSection.querySelector('[data-product="chapati"]') as HTMLElement;
          if (chapatiCard) {
            chapatiCard.click();
          }
        }
      }, 1000);
      return "🍞 Chapati Details:\n• Price: ₹60 (₹66 including GST)\n• Weight: 450g\n• Description: Soft, fresh chapati made daily with premium ingredients\n• Ingredients: Whole wheat flour, Water, Salt, Oil\n• GST: ₹6\n\nPerfect for traditional meals and pairs wonderfully with curries!\n\nI've opened the chapati product details for you to see the images!";
    }

    if (message.includes("cream bun") || message.includes("cream")) {
      return "🥐 Cream Bun Details:\n• Price: ₹45 (₹49.50 including GST)\n• Quantity: 4 pieces\n• Description: Delicious cream-filled buns with smooth vanilla cream\n• Ingredients: Flour, Cream, Sugar, Yeast, Vanilla\n• GST: ₹4.50\n\nA creamy delight that's perfect for any time of day!";
    }

    if (message.includes("normal bun") || message.includes("bun") && !message.includes("chocolate") && !message.includes("cream")) {
      return "🍩 Normal Buns Details:\n• Price: ₹20 (₹22 including GST)\n• Quantity: 2 pieces\n• Description: Freshly baked, delightfully soft—your perfect companion for any meal\n• Ingredients: Flour, Sugar, Yeast, Milk, Butter\n• GST: ₹2\n\nSimple, soft, and utterly delicious!";
    }

    if (message.includes("baby chocolate") || message.includes("chocolate bun")) {
      return "🧁 Baby Chocolate Bun Details:\n• Price: ₹40 (₹44 including GST)\n• Quantity: 5 pieces\n• Description: Soft, rich, and perfectly sized for a satisfying chocolate treat\n• Ingredients: Flour, Chocolate, Sugar, Yeast, Butter\n• GST: ₹4\n\nIndulge in these bite-sized chocolate wonders!";
    }

    if (message.includes("bread")) {
      return "🍞 Bread Details:\n• Price: ₹40 (₹44 including GST)\n• Weight: 300g\n• Description: Fresh, soft bread baked to perfection every day\n• Ingredients: Flour, Water, Yeast, Salt, Sugar\n• GST: ₹4\n\nVersatile and perfect for sandwiches or toast!";
    }

    if (message.includes("rusk")) {
      return "🥨 Rusk Details:\n• Price: ₹45 (₹49.50 including GST)\n• Weight: 250g\n• Description: Crispy, golden rusk perfect for tea time\n• Ingredients: Flour, Sugar, Butter, Eggs, Yeast\n• GST: ₹4.50\n\nThe perfect crunchy companion for your tea or coffee!";
    }

    // Products
    if (message.includes("product") || message.includes("bread") || message.includes("bun") || message.includes("chapati") || message.includes("rusk")) {
      return "We offer fresh bakery products including:\n🍞 Bread (₹40) - Fresh, soft bread baked to perfection\n🥖 Chapati (₹60) - Soft, fresh chapati made daily with premium ingredients\n🥐 Cream Bun (₹45) - Delicious cream-filled buns with smooth vanilla cream\n🍩 Normal Buns (₹20) - Freshly baked, delightfully soft buns\n🧁 Baby Chocolate Bun (₹40) - Soft, rich chocolate treat perfectly sized\n🥨 Rusk (₹45) - Crispy, golden rusk perfect for tea time\n\nAll products are freshly baked daily with premium ingredients!\n\nAsk about any specific product for detailed information!";
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
      return "Our pricing includes GST:\n🍞 Bread: ₹44 (₹40 + ₹4 GST)\n🥖 Chapati: ₹66 (₹60 + ₹6 GST)\n🥐 Cream Bun: ₹49.50 (₹45 + ₹4.50 GST)\n🍩 Normal Buns: ₹22 (₹20 + ₹2 GST)\n🧁 Baby Chocolate Bun: ₹44 (₹40 + ₹4 GST)\n🥨 Rusk: ₹49.50 (₹45 + ₹4.50 GST)\n\nPrices may vary slightly based on quantity and location.";
    }

    // Ingredients
    if (message.includes("ingredient") || message.includes("made") || message.includes("quality")) {
      return "All our products use premium ingredients:\n• Fresh flour and yeast\n• Pure butter and cream\n• Natural flavors and colors\n• No artificial preservatives\n• Traditional recipes with modern techniques\n\nEach product has specific ingredients - ask about a particular item for details!";
    }

    // Health benefits
    if (message.includes("health") || message.includes("nutrition") || message.includes("diet") || message.includes("healthy")) {
      return "Our products are made with natural ingredients and traditional methods:\n• Fresh daily baking ensures maximum freshness\n• No artificial preservatives or colors\n• High-quality ingredients for better nutrition\n• Perfect for breakfast, snacks, or meals\n\nWe recommend consuming in moderation as part of a balanced diet!";
    }

    // Ordering
    if (message.includes("how to order") || message.includes("place order") || message.includes("buy")) {
      return "Easy ways to order from Hayat Foods:\n📞 Call us: +91 98765 43210\n💬 WhatsApp: Send your order details\n🚚 Home delivery available\n🏪 Visit our retail outlets\n\nMinimum order: ₹100 for delivery\nBulk orders welcome for events!";
    }

    // Customization
    if (message.includes("custom") || message.includes("special") || message.includes("bulk")) {
      return "We offer customization options:\n• Bulk orders for events and celebrations\n• Special packaging for gifts\n• Custom quantities available\n• Event catering services\n\nContact us for special requirements and pricing!";
    }

    // Freshness
    if (message.includes("fresh") || message.includes("freshness") || message.includes("baked")) {
      return "Freshness is our priority! ✨\n• Baked fresh every morning\n• Delivered same day\n• No day-old products\n• State-of-the-art manufacturing\n• Quality control at every step\n\nThat's why our customers love Hayat Foods!";
    }

    // Recommendations
    if (message.includes("recommend") || message.includes("suggest") || message.includes("best")) {
      return "Our customer favorites:\n🥇 Cream Bun - Rich and creamy delight\n🥈 Baby Chocolate Bun - Perfect bite-sized treat\n🥉 Bread - Versatile for any meal\n\nTry our combo packs for the best experience! What's your occasion?";
    }

    // Opening hours
    if (message.includes("time") || message.includes("open") || message.includes("close") || message.includes("hour")) {
      return "Our operating hours:\n🏭 Manufacturing: 5 AM - 6 PM daily\n🚚 Delivery: 7 AM - 8 PM daily\n📞 Phone support: 8 AM - 8 PM\n💬 WhatsApp: 24/7 for orders\n\nWe're here to serve you fresh!";
    }

    // Special occasions
    if (message.includes("birthday") || message.includes("party") || message.includes("celebration") || message.includes("event")) {
      return "Special occasions call for special treats! 🎉\n• Birthday cakes and custom decorations\n• Party packs with assorted buns\n• Bulk orders for celebrations\n• Gift packaging available\n\nLet us make your special day even sweeter!";
    }

    // Customer service
    if (message.includes("complaint") || message.includes("issue") || message.includes("problem") || message.includes("feedback")) {
      return "We're sorry to hear that! 😔\nYour feedback is important to us. Please contact our customer service:\n📞 +91 98765 43210\n📧 info@hayatfoods.com\n\nWe strive to provide the best quality and service!";
    }

    // Loyalty/Repeat customers
    if (message.includes("regular") || message.includes("daily") || message.includes("subscription") || message.includes("loyal")) {
      return "We love our regular customers! 💝\n• Special discounts for daily orders\n• Priority delivery service\n• Custom order preferences\n• Loyalty rewards program\n\nContact us to set up your regular delivery schedule!";
    }

    // Fun responses
    if (message.includes("joke") || message.includes("funny") || message.includes("laugh")) {
      return "Why did the baker go to therapy? 🤪\nBecause he kneaded help with his dough-pression! 🍞\n\nNeed help with anything else? We're here to make your day better!";
    }

    // Weather/food suggestions
    if (message.includes("weather") || message.includes("rain") || message.includes("hot") || message.includes("cold")) {
      return "Weather-appropriate suggestions:\n🌧️ Rainy day: Warm bread with tea\n☀️ Hot day: Cool cream buns\n❄️ Cold day: Fresh chapati with curry\n\nStay comfortable and enjoy our fresh products!";
    }

    // Default responses
    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return "Hello! Welcome to Hayat Foods. How can I help you today?";
    }

    if (message.includes("thank") || message.includes("thanks")) {
      return "You're welcome! We're here to serve you with the freshest bakery products. Have a great day! 🍞";
    }

    // Fallback
    return "I'd be happy to help you with information about Hayat Foods! You can ask me about our products, contact details, delivery information, pricing, health benefits, recommendations, or anything else related to our bakery services. What would you like to know?";
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
      {/* Chatbot Toggle Button - Hidden on mobile, shown on desktop */}
      <motion.div
        className="fixed bottom-6 left-6 z-50 hidden md:block"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3.2, duration: 0.5, type: "spring" }}
      >
        <motion.button
          data-chatbot-toggle
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
