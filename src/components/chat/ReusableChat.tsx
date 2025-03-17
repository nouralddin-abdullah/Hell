import React, { useState, useEffect, useRef, FormEvent } from "react";
import { io, Socket } from "socket.io-client";
import { Send, Trash2, Edit2, X } from "lucide-react";
import "../../styles/chat/style.css";
import useAuthStore from "../../store/authTokenStore";
import { Link, useParams } from "react-router-dom";
import { baseURL } from "../../constants/baseURL";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";

interface Message {
  id: string;
  _id: string;
  content: string;
  sender?: {
    id: string;
    photo: string;
    username: string;
  };
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  replyTo: {
    content: string;
    sender: {
      id: string;
      username: string;
    };
  };
}

interface ReplyPayload {
  replyTo: string;
  content: string;
}

interface UpdatePayload {
  _id: string;
  content: string;
}

const ReusableChat: React.FC = () => {
  const { courseName } = useParams() || "general";
  const { data: currentUser } = useGetCurrentUser();
  const userToken = useAuthStore((state) => state.token);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [newEditingMessage, setNewEditingMessage] = useState("");
  const [selectedMsgForReply, setSelectedMsgForReply] =
    useState<Message | null>();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedMsgForReply(null);
    setMessages([]);
    setNewMessage("");

    // Initialize socket connection
    socketRef.current = io("https://api.bishell.online", {
      query: { course: `${courseName ? courseName : "general"}` },
      auth: {
        token: userToken,
      },
    });

    // Set up event listeners
    socketRef.current.on("load", (loadedMessages: Message[]) => {
      setMessages((prevState) => [...loadedMessages, ...prevState]);
      console.log("Socket Connected, messages loaded");
    });

    socketRef.current.on("receivedMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on("deletedMessage", (message: Message) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === message._id
            ? { ...msg, deletedAt: Date.now().toString() }
            : msg
        )
      );
    });

    socketRef.current.on("updatedMessage", (updatedMsg: Message) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === updatedMsg._id
            ? { ...msg, content: updatedMsg.content }
            : msg
        )
      );
    });

    socketRef.current.on("error", (errorMsg: string) => {
      console.error("Socket error:", errorMsg);
    });

    // Load initial messages
    socketRef.current.emit("loadMessages");

    return () => {
      socketRef.current?.disconnect();
    };
  }, [courseName, userToken]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus on input when reply is selected
  useEffect(() => {
    if (selectedMsgForReply) {
      messageInputRef.current?.focus();
    }
  }, [selectedMsgForReply]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!editingMessage && !newMessage.trim()) return;
    if (editingMessage && !newEditingMessage.trim()) return;

    if (editingMessage) {
      const updateObject: UpdatePayload = {
        _id: editingMessage._id,
        content: newEditingMessage,
      };
      socketRef.current?.emit("updateMessage", updateObject);
      setEditingMessage(null);
    } else if (selectedMsgForReply) {
      handleReply(selectedMsgForReply._id);
    } else {
      socketRef.current?.emit("sendMessage", newMessage);
      setNewMessage("");
    }
  };

  const startReply = (message: Message) => {
    setSelectedMsgForReply(message);
  };

  const handleReply = (messageId: string) => {
    const replyPayload: ReplyPayload = {
      replyTo: messageId,
      content: newMessage,
    };
    socketRef.current?.emit("sendReply", replyPayload);
    setSelectedMsgForReply(null);
    setNewMessage("");
  };

  const handleDelete = (messageId: string) => {
    socketRef.current?.emit("deleteMessage", messageId);
  };

  const startEdit = (message: Message) => {
    if (!editingMessage || editingMessage._id !== message._id) {
      setEditingMessage(message);
      setNewEditingMessage(message.content);
    } else {
      setEditingMessage(null);
    }
  };

  const isSelfMessage = (message: Message) => {
    return message.sender?.username === currentUser?.user.username;
  };

  return (
    <>
      <div className="chat-container">
        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-wrapper ${
                isSelfMessage(message) ? "self-message" : ""
              }`}
              draggable={!message.deletedAt}
              onDragStart={(e) =>
                e.dataTransfer.setData("messageId", message._id)
              }
              onDrop={(e) => {
                e.preventDefault();
                const draggedMessageId = e.dataTransfer.getData("messageId");
                const draggedMessage = messages.find(
                  (msg) => msg._id === draggedMessageId
                );
                if (draggedMessage) {
                  startReply(draggedMessage);
                }
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="message">
                <div className="message-header">
                  <Link
                    to={`/profile/${message.sender?.username}`}
                    className="username"
                  >
                    <img
                      src={`${baseURL}/profilePics/${message.sender?.photo}`}
                      alt={message.sender?.username || "User"}
                    />
                    {message.sender?.username === currentUser?.user.username
                      ? `${message.sender?.username} (You)`
                      : message.sender?.username || "User"}
                  </Link>

                  {!message.deletedAt && isSelfMessage(message) && (
                    <div className="message-actions">
                      <button
                        type="button"
                        onClick={() => startEdit(message)}
                        className="action-button"
                        aria-label="Edit message"
                      >
                        <Edit2 className="icon" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(message._id)}
                        className="action-button"
                        aria-label="Delete message"
                      >
                        <Trash2 className="icon" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="content-reply-container">
                  {message.replyTo && (
                    <div className="selected-reply-container">
                      <p>{message.replyTo.sender.username}</p>
                      <p>{message.replyTo.content}</p>
                    </div>
                  )}

                  <div className="message-content">
                    {message.deletedAt ? (
                      <span className="deleted-message">
                        This message was deleted
                      </span>
                    ) : editingMessage?._id === message._id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSendMessage(e);
                        }}
                        className="edit-form"
                      >
                        <input
                          type="text"
                          value={newEditingMessage}
                          onChange={(e) => setNewEditingMessage(e.target.value)}
                          placeholder="Edit message..."
                          className="message-input"
                          autoFocus
                          required
                        />
                        <div className="edit-actions">
                          <button type="submit" className="edit-button">
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingMessage(null)}
                            className="cancel-button"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>

                <span className="timestamp">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div>
          {selectedMsgForReply && (
            <div className="selected-reply-container">
              <button
                onClick={() => setSelectedMsgForReply(null)}
                className="close-reply"
                aria-label="Cancel reply"
              >
                <X size={14} />
              </button>
              <p>{selectedMsgForReply.sender?.username}</p>
              <p>{selectedMsgForReply.content}</p>
            </div>
          )}
          <form onSubmit={handleSendMessage} className="message-form">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="message-input"
              ref={messageInputRef}
            />
            <button
              type="submit"
              className="send-button"
              aria-label="Send message"
            >
              <Send className="icon" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ReusableChat;
