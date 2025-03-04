import React, { useState, useEffect, useRef, FormEvent } from "react";
import { io, Socket } from "socket.io-client";
import { Send, Trash2, Edit2 } from "lucide-react";
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
      console.log(loadedMessages);
      console.log("Socket Connected");
    });

    socketRef.current.on("receivedMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
      console.log(message);
    });

    socketRef.current.on("deletedMessage", (message: Message) => {
      console.log(message);
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === message._id
            ? { ...msg, deletedAt: Date.now().toString() }
            : msg
        )
      );
    });

    socketRef.current.on("updatedMessage", (updatedMsg: Message) => {
      console.log(updatedMsg);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === updatedMsg._id
            ? { ...msg, content: updatedMsg.content } // Use newEditingMessage here
            : msg
        )
      );
    });

    socketRef.current.on("error", (errorMsg: string) => {
      console.log(errorMsg);
    });

    // Load initial messages
    socketRef.current.emit("loadMessages");

    return () => {
      socketRef.current?.disconnect();
    };
  }, [courseName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    // setNewEditingMessage("");
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

  return (
    <>
      <h1
        style={{ textAlign: "center", margin: "1rem", color: "var(--primary)" }}
      >
        Beta Version
      </h1>

      <div className="chat-container">
        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className="message-wrapper"
              draggable={!message.deletedAt} // Make draggable only if not deleted
              onDragStart={(e) =>
                e.dataTransfer.setData("messageId", message._id)
              }
              onDrop={(e) => {
                e.preventDefault();
                const draggedMessageId = e.dataTransfer.getData("messageId");
                startReply(
                  messages.find((msg) => msg._id === draggedMessageId)!
                );
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
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                      src={`${baseURL}/profilePics/${message.sender?.photo}`}
                      alt={message.sender?.username}
                    />
                    {message.sender?.username === currentUser?.user.username
                      ? "(You)"
                      : message.sender?.username || "User"}
                  </Link>
                  <div className="message-actions">
                    <button
                      style={{
                        display: `${
                          currentUser?.user.username !==
                            message.sender?.username || message.deletedAt
                            ? "none"
                            : ""
                        }`,
                      }}
                      type="button"
                      onClick={() => startEdit(message)}
                      className="action-button"
                    >
                      <Edit2 className="icon" />
                    </button>

                    <button
                      style={{
                        display: `${
                          currentUser?.user.username !==
                            message.sender?.username || message.deletedAt
                            ? "none"
                            : ""
                        }`,
                      }}
                      type="button"
                      onClick={() => handleDelete(message._id)}
                      className="action-button"
                    >
                      <Trash2 className="icon" />
                    </button>
                  </div>
                </div>

                <div className="content-reply-container">
                  {message.replyTo && (
                    <div className="selected-reply-container">
                      <p style={{ fontSize: "12px" }}>
                        {message.replyTo.sender.username}
                      </p>
                      <p>{message.replyTo.content}</p>
                    </div>
                  )}

                  <div className="message-content">
                    {message.deletedAt ? (
                      <span>Deleted Message</span>
                    ) : editingMessage?._id === message._id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSendMessage(e);
                        }}
                      >
                        <input
                          type="text"
                          value={newEditingMessage}
                          onChange={(e) => setNewEditingMessage(e.target.value)}
                          placeholder="Edit message..."
                          className="message-input"
                          required
                        />

                        <div>
                          <button type="submit">Edit</button>
                          <button
                            type="button"
                            onClick={() => setEditingMessage(null)}
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
                  {new Date(message.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div>
          {selectedMsgForReply && (
            <div className="selected-reply-container">
              <span
                onClick={() => setSelectedMsgForReply(null)}
                style={{
                  position: "absolute",
                  top: "-20%",
                  left: "0",
                  cursor: "pointer",
                  color: "red",
                  fontWeight: "bold",
                }}
              >
                x
              </span>
              {selectedMsgForReply.content}
            </div>
          )}
          <form onSubmit={handleSendMessage} className="message-form">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={"Type a message..."}
              className="message-input"
            />
            <button type="submit" className="send-button">
              <Send className="icon" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ReusableChat;
