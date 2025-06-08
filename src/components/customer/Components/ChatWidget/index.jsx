import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

// WebSocket server URL
const SOCKET_SERVER_URL = "http://localhost:8080";

// Giả lập danh sách cuộc trò chuyện (có thể lấy từ API)
const dummyChats = [
    { id: 1, name: "Shop ABC", lastMessage: "Chào bạn!" },
    { id: 2, name: "User 123", lastMessage: "Bạn còn hàng không?" },
];

// CSS styles
const styles = {
    chatButton: {
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: "50%",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        fontSize: 28,
        cursor: "pointer",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        zIndex: 1000,
    },
    widgetContainer: {
        position: "fixed",
        bottom: 90,
        right: 20,
        width: 450,
        height: 550,
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        backgroundColor: "white",
        borderRadius: 12,
        display: "flex",
        flexDirection: "row",
        fontFamily: "'Roboto', sans-serif",
        zIndex: 9999,
    },
    chatList: {
        width: "35%",
        borderRight: "1px solid #e0e0e0",
        overflowY: "auto",
        backgroundColor: "#f9f9f9",
        display: "flex",
        flexDirection: "column",
    },
    chatListItem: {
        padding: 12,
        cursor: "pointer",
        borderBottom: "1px solid #eee",
        transition: "background-color 0.2s",
    },
    chatListItemActive: {
        backgroundColor: "#e3f2fd",
        fontWeight: "600",
    },
    chatHeader: {
        padding: "12px 20px",
        borderBottom: "1px solid #ddd",
        fontWeight: "700",
        fontSize: 18,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#1976d2",
        color: "white",
    },
    closeButton: {
        background: "transparent",
        border: "none",
        color: "white",
        fontSize: 22,
        cursor: "pointer",
    },
    chatDetail: {
        width: "65%",
        display: "flex",
        flexDirection: "column",
    },
    messagesContainer: {
        flex: 1,
        padding: 16,
        overflowY: "auto",
        backgroundColor: "#fafafa",
    },
    messageBubble: {
        maxWidth: "75%",
        marginBottom: 12,
        padding: 10,
        borderRadius: 12,
        fontSize: 14,
        lineHeight: 1.4,
    },
    messageFromMe: {
        backgroundColor: "#1976d2",
        color: "white",
        marginLeft: "auto",
    },
    messageFromOther: {
        backgroundColor: "#e0e0e0",
        color: "#333",
    },
    inputContainer: {
        borderTop: "1px solid #ddd",
        padding: 12,
        display: "flex",
        gap: 8,
    },
    input: {
        flex: 1,
        padding: 10,
        borderRadius: 20,
        border: "1px solid #ccc",
        fontSize: 14,
    },
    sendButton: {
        backgroundColor: "#1976d2",
        border: "none",
        color: "white",
        padding: "0 16px",
        borderRadius: 20,
        cursor: "pointer",
        fontWeight: "600",
    },
};

// Giao diện nút mở chat
const ChatButton = ({ onClick }) => (
    <button style={styles.chatButton} onClick={onClick} aria-label="Open chat">
        💬
    </button>
);

// Danh sách cuộc trò chuyện
const ChatList = ({ chats, selectedChatId, onSelect }) => {
    return (
        <div style={styles.chatList}>
            {chats.map((chat) => {
                const isSelected = chat.id === selectedChatId;
                return (
                    <div
                        key={chat.id}
                        style={{
                            ...styles.chatListItem,
                            ...(isSelected ? styles.chatListItemActive : {}),
                        }}
                        onClick={() => onSelect(chat.id)}
                    >
                        <strong>{chat.name}</strong>
                        <p style={{ margin: "6px 0 0", color: "#555", fontSize: 13 }}>
                            {chat.lastMessage}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

// Chi tiết cuộc trò chuyện
const ChatDetail = ({ chat, onClose, socket }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!socket || !chat) return;

        // Lắng nghe tin nhắn đến
        const handleIncoming = (message) => {
            if (message.chatId === chat.id) {
                setMessages((prev) => [...prev, { ...message, fromMe: false }]);
            }
        };

        socket.on("receiveMessage", handleIncoming);

        return () => {
            socket.off("receiveMessage", handleIncoming);
        };
    }, [socket, chat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim()) return;
        const message = {
            chatId: chat.id,
            text: input,
        };
        setMessages((prev) => [...prev, { ...message, fromMe: true }]);
        socket.emit("sendMessage", message);
        setInput("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    if (!chat) {
        return (
            <div
                style={{
                    ...styles.chatDetail,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#888",
                    fontSize: 18,
                    fontStyle: "italic",
                    padding: 20,
                }}
            >
                Chat ngay nhé!
            </div>
        );
    }

    return (
        <div style={styles.chatDetail}>
            <div style={styles.chatHeader}>
                <span>{chat.name}</span>
                <button style={styles.closeButton} onClick={onClose} aria-label="Close chat">
                    &times;
                </button>
            </div>

            <div style={styles.messagesContainer}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.messageBubble,
                            ...(msg.fromMe ? styles.messageFromMe : styles.messageFromOther),
                        }}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>

            <div style={styles.inputContainer}>
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button style={styles.sendButton} onClick={sendMessage}>
                    Gửi
                </button>
            </div>
        </div>
    );
};

// Widget tổng
const ChatWidget = () => {
    const [open, setOpen] = useState(false);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [socket, setSocket] = useState(null);

    const selectedChat = dummyChats.find((c) => c.id === selectedChatId);

    useEffect(() => {
        const socketIo = io(SOCKET_SERVER_URL);
        setSocket(socketIo);

        return () => {
            socketIo.disconnect();
        };
    }, []);

    return (
        <>
            <ChatButton onClick={() => setOpen((v) => !v)} />

            {open && (
                <div style={styles.widgetContainer}>
                    <ChatList
                        chats={dummyChats}
                        selectedChatId={selectedChatId}
                        onSelect={setSelectedChatId}
                    />
                    <ChatDetail chat={selectedChat} onClose={() => setOpen(false)} socket={socket} />
                </div>
            )}
        </>
    );
};

export default ChatWidget;
