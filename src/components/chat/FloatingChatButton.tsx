import React, { useState, useEffect, useRef, useCallback } from "react"; // Import useCallback
import { useGeminiChat, ChatMessage } from "../../hooks/chat/useGeminiChat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faTimes,
  faPaperPlane,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/chat/floating-chat.css";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import AnimatedText from "../common/AnimatedText/AnimatedText";

// Helper function for consistent message formatting
const formatMessageContent = (content: string) => {
  // Use dangerouslySetInnerHTML requires the object format
  return {
    __html: content
      .replace(/\n/g, "<br/>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
  };
};

const FloatingChatButton: React.FC = () => {
  const { data: currentUser } = useGetCurrentUser();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    isLoading,
    sendMessage,
    clearChat: originalClearChat,
  } = useGeminiChat();

  // State to track IDs of messages whose animation has completed
  const [animatedMessageIds, setAnimatedMessageIds] = useState<Set<string>>(
    new Set()
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isChatOpen) {
      // Scroll to bottom needs to happen after potential animations start/finish
      // Using a small timeout can help ensure layout is stable
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100); // Adjust timing if needed
      return () => clearTimeout(timer);
    }
  }, [messages, isChatOpen]); // Keep dependencies

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && !isLoading) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    // Optional: When opening, ensure the latest messages are considered "animated"
    // if they were already present. This prevents re-animation on open.
    if (!isChatOpen && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant") {
        // Add the last message ID immediately if it's an assistant one
        // This assumes it was already fully displayed before closing.
        setAnimatedMessageIds((prev) => new Set(prev).add(lastMessage.id));
      }
    }
  };

  // Wrapper for clearChat to also clear animation state
  const handleClearChat = () => {
    originalClearChat();
    setAnimatedMessageIds(new Set()); // Clear the animated IDs set
  };

  // Callback for when animation completes
  const handleAnimationComplete = useCallback((messageId: string) => {
    setAnimatedMessageIds((prev) => {
      // Check if already added to prevent potential infinite loops if onComplete fires multiple times
      if (prev.has(messageId)) {
        return prev;
      }
      const newSet = new Set(prev);
      newSet.add(messageId);
      return newSet;
    });
  }, []); // Empty dependency array means this function reference is stable

  if (!currentUser) return null; // Return null instead of nothing

  return (
    <div className="floating-chat-container">
      {isChatOpen && (
        <div className="floating-chat-window">
          <div className="chat-header">
            <h3>الدحيح - المساعد الذكي</h3>
            <div className="chat-actions">
              {/* Use the wrapped clear function */}
              <button onClick={handleClearChat} className="clear-chat-button">
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button onClick={toggleChat} className="close-chat-button">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((message: ChatMessage, index: number) => {
              const isLastMessage = index === messages.length - 1;
              const hasBeenAnimated = animatedMessageIds.has(message.id);

              const shouldAnimate =
                message.role === "assistant" &&
                isLastMessage &&
                !hasBeenAnimated;

              return (
                <div
                  key={message.id} // Key should be on the outermost element in the map
                  className={`chat-message ${
                    message.role === "assistant" ? "assistant" : "user"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="assistant-avatar">
                      <img src="/icons/logo.png" alt="Elda7e7" />
                    </div>
                  )}
                  <div className="message-content">
                    {message.role === "assistant" ? (
                      shouldAnimate ? (
                        <AnimatedText
                          text={message.content}
                          // Pass the callback with the message ID
                          onComplete={() => handleAnimationComplete(message.id)}
                        />
                      ) : (
                        // Render previously animated or older messages statically
                        <p
                          dangerouslySetInnerHTML={formatMessageContent(
                            message.content
                          )}
                        />
                      )
                    ) : (
                      // User message (already static)
                      <p
                        dangerouslySetInnerHTML={formatMessageContent(
                          message.content
                        )}
                      />
                    )}
                    <span className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString("ar-EG", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="chat-message assistant typing-indicator">
                <div className="assistant-avatar">
                  {/* Optional: Add a loading class for avatar animation */}
                  <div className="assistant-avatar loading">
                    <img src="/icons/logo.png" alt="Elda7e7 Typing" />
                  </div>
                </div>
                <div className="message-content">
                  {/* Animated dots */}
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="chat-input-form">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="اكتب سؤالك هنا..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !newMessage.trim()}>
              <FontAwesomeIcon
                icon={faPaperPlane}
                className={isLoading ? "fa-spin" : ""} // Keep loading indicator
              />
            </button>
          </form>
        </div>
      )}

      <button
        className={`floating-chat-button ${isChatOpen ? "active" : ""}`}
        onClick={toggleChat}
        aria-label="Chat with AI Assistant"
      >
        <FontAwesomeIcon icon={faComment} />
      </button>
    </div>
  );
};

export default FloatingChatButton;
