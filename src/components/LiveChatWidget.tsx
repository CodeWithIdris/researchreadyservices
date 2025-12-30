import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender_type: "visitor" | "support";
  message: string;
  created_at: string;
}

const LiveChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [visitorId, setVisitorId] = useState<string>("");
  const [visitorName, setVisitorName] = useState("");
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Generate or retrieve visitor ID
  useEffect(() => {
    let storedVisitorId = localStorage.getItem("chat_visitor_id");
    if (!storedVisitorId) {
      storedVisitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("chat_visitor_id", storedVisitorId);
    }
    setVisitorId(storedVisitorId);

    // Check for existing session
    const storedSessionId = localStorage.getItem("chat_session_id");
    if (storedSessionId) {
      verifyAndLoadSession(storedVisitorId, storedSessionId);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll for new messages when chat is active
  const pollMessages = useCallback(async () => {
    if (!sessionId || !visitorId) return;

    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { action: "get_messages", visitor_id: visitorId, session_id: sessionId },
      });

      if (!error && data?.messages) {
        setMessages(data.messages.map((msg: Message) => ({
          ...msg,
          sender_type: msg.sender_type as "visitor" | "support"
        })));
      }
    } catch (error) {
      console.error("Error polling messages:", error);
    }
  }, [sessionId, visitorId]);

  // Set up polling when session is active
  useEffect(() => {
    if (sessionId && hasStartedChat && isOpen && !isMinimized) {
      // Poll every 3 seconds
      pollingRef.current = window.setInterval(pollMessages, 3000);
      
      return () => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      };
    }
  }, [sessionId, hasStartedChat, isOpen, isMinimized, pollMessages]);

  const verifyAndLoadSession = async (vId: string, sId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { action: "verify_session", visitor_id: vId, session_id: sId },
      });

      if (error || !data?.valid) {
        localStorage.removeItem("chat_session_id");
        return;
      }

      setSessionId(sId);
      setHasStartedChat(true);
      loadMessages(vId, sId);
    } catch (error) {
      console.error("Error verifying session:", error);
      localStorage.removeItem("chat_session_id");
    }
  };

  const loadMessages = async (vId: string, sId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { action: "get_messages", visitor_id: vId, session_id: sId },
      });

      if (error) {
        console.error("Error loading messages:", error);
        return;
      }

      if (data?.messages) {
        setMessages(data.messages.map((msg: Message) => ({
          ...msg,
          sender_type: msg.sender_type as "visitor" | "support"
        })));
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const startChat = async () => {
    if (!visitorName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to start the chat.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { 
          action: "create_session", 
          visitor_id: visitorId, 
          visitor_name: visitorName.trim() 
        },
      });

      if (error || !data?.session) {
        throw new Error("Failed to create session");
      }

      setSessionId(data.session.id);
      localStorage.setItem("chat_session_id", data.session.id);
      setHasStartedChat(true);
      loadMessages(visitorId, data.session.id);
    } catch (error) {
      console.error("Error creating session:", error);
      toast({
        title: "Error",
        description: "Failed to start chat. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !sessionId) return;

    const messageText = newMessage.trim();
    setNewMessage("");
    
    // Optimistically add the message to UI
    const optimisticMessage: Message = {
      id: `temp_${Date.now()}`,
      sender_type: "visitor",
      message: messageText,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const { error } = await supabase.functions.invoke("chat", {
        body: {
          action: "send_message",
          visitor_id: visitorId,
          session_id: sessionId,
          message: messageText,
          sender_type: "visitor",
        },
      });

      if (error) {
        throw error;
      }
      
      // Refresh messages after sending
      await pollMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      // Remove optimistic message and restore input
      setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
      setNewMessage(messageText);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (hasStartedChat) {
        sendMessage();
      } else {
        startChat();
      }
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        aria-label="Open live chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-96 bg-background border border-border rounded-2xl shadow-2xl flex flex-col transition-all ${
        isMinimized ? "h-14" : "h-[min(500px,calc(100vh-6rem))]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground rounded-t-2xl shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="font-semibold text-sm sm:text-base">Live Chat</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-primary-foreground/10 rounded transition-colors"
            aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-primary-foreground/10 rounded transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {!hasStartedChat ? (
            /* Start Chat Form */
            <div className="flex-1 p-4 flex flex-col justify-center overflow-auto">
              <div className="text-center mb-6">
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-primary mb-2">
                  Start a Conversation
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Enter your name to begin chatting with our support team.
                </p>
              </div>
              <div className="space-y-4">
                <Input
                  placeholder="Your name"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="text-base"
                />
                <Button 
                  onClick={startChat} 
                  className="w-full" 
                  variant="gold"
                  disabled={isLoading}
                >
                  {isLoading ? "Starting..." : "Start Chat"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-4">
                    Loading messages...
                  </div>
                )}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender_type === "visitor" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                        msg.sender_type === "visitor"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 sm:p-4 border-t border-border shrink-0">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 text-base"
                  />
                  <Button
                    onClick={sendMessage}
                    size="icon"
                    variant="gold"
                    disabled={!newMessage.trim()}
                    className="shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default LiveChatWidget;
