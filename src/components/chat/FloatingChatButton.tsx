import React, { useState, useEffect, useRef } from 'react';
import { useGeminiChat, ChatMessage } from '../../hooks/chat/useGeminiChat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faTimes, faPaperPlane, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../../styles/chat/floating-chat.css';

const FloatingChatButton: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, sendMessage, clearChat } = useGeminiChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [messages, isChatOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && !isLoading) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="floating-chat-container">
      {isChatOpen && (
        <div className="floating-chat-window">
          <div className="chat-header">
            <h3>الدحيح - المساعد الذكي</h3>
            <div className="chat-actions">
              <button onClick={clearChat} className="clear-chat-button">
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button onClick={toggleChat} className="close-chat-button">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
          
          <div className="chat-messages">
            {messages.map((message: ChatMessage) => (
              <div
                key={message.id}
                className={`chat-message ${message.role === 'assistant' ? 'assistant' : 'user'}`}
              >
                {message.role === 'assistant' && (
                  <div className="assistant-avatar">
                    <img src="/icons/logo.png" alt="Elda7e7" />
                  </div>
                )}
                <div className="message-content">
                  <p dangerouslySetInnerHTML={{ 
                    __html: message.content
                      .replace(/\n/g, '<br/>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }} />
                  <span className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString('ar-EG', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
              </div>
            ))}
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
              <FontAwesomeIcon icon={faPaperPlane} className={isLoading ? 'fa-spin' : ''} />
            </button>
          </form>
        </div>
      )}
      
      <button 
        className={`floating-chat-button ${isChatOpen ? 'active' : ''}`} 
        onClick={toggleChat}
        aria-label="Chat with AI Assistant"
      >
        <FontAwesomeIcon icon={faComment} />
      </button>
    </div>
  );
};

export default FloatingChatButton;