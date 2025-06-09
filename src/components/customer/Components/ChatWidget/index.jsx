import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";


const TOKEN = localStorage.getItem("accessToken") || null;
const SOCKET_SERVER_URL = "http://localhost:8080";

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
        wordBreak: "break-word",
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

const ChatButton = ({ onClick, hasUnread }) => (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
        <button style={styles.chatButton} onClick={onClick} aria-label="Mở chat">
            💬
        </button>
        {hasUnread && (
            <span
                style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 12,
                    height: 12,
                    backgroundColor: "red",
                    borderRadius: "50%",
                }}
            />
        )}
    </div>
);

const ChatList = ({ chats, selectedChatId, onSelect }) => (
    <div style={styles.chatList}>
        {chats.map((chat) => {
            const isSelected = chat.chat_id === selectedChatId;
            return (
                <div
                    key={chat.chat_id}
                    style={{
                        ...styles.chatListItem,
                        ...(isSelected ? styles.chatListItemActive : {}),
                    }}
                    onClick={() => onSelect(chat.chat_id)}
                >
                    <strong>{chat.user?.username || chat.shop?.shop_name}</strong>
                    <p style={{ margin: "6px 0 0", color: "#555", fontSize: 13 }}>
                        {chat.last_message}
                    </p>
                </div>
            );
        })}
    </div>
);

const ChatDetail = ({ chat, onClose, socket, messages, addMessage, userId }) => {
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!socket || !chat) return;

        const handleNewMessage = (message) => {
            console.log("Nhận new_message:", message);
            const chatIdFromMessage = message.sender_id; // Shop gửi cho user
            if (chatIdFromMessage === chat.shop?.shop_id) {
                addMessage(chat.chat_id, {
                    text: message.message,
                    timestamp: message.created_at || Date.now(),
                    fromMe: message.sender_id === userId,
                });
            }
        };

        socket.on("new_message", handleNewMessage);
        return () => socket.off("new_message", handleNewMessage);
    }, [socket, chat, addMessage, userId]);

    useEffect(() => {
        if (!socket) return;

        const handleMessageSent = (msg) => {
            console.log("Nhận message_sent:", msg);
            addMessage(chat.chat_id, {
                text: msg.message,
                timestamp: msg.created_at || Date.now(),
                fromMe: true,
            });
        };

        const handleError = (msg) => {
            console.error("Lỗi từ server:", msg);
            alert("Lỗi: " + msg);
        };

        socket.on("message_sent", handleMessageSent);
        socket.on("error", handleError);
        return () => {
            socket.off("message_sent", handleMessageSent);
            socket.off("error", handleError);
        };
    }, [socket, chat, addMessage]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        console.log("chat object:", chat);
        if (!input.trim() || !socket || !chat) {
            console.log("Không gửi được:", { input: input.trim(), socket: !!socket, chat: !!chat });
            return;
        }
        if (!socket.connected) {
            console.error("Socket không kết nối!");
            return;
        }

        const data = {
            chat_id: chat.chat_id,
            sender_id: userId,
            sender_type: "user", // hoặc giá trị tương ứng với loại người gửi
            receiver_id: chat.shop?.shop_id,
            receiver_type: "shop", // hoặc giá trị phù hợp với backend
            message: input.trim(),
        };

        console.log("Gửi tin nhắn:", data);
        socket.emit("send_message", data);
        setInput("");
    };


    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            console.log("Nhấn Enter, gửi tin nhắn:", input);
            sendMessage();
        }
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
                Chọn cuộc trò chuyện để bắt đầu chat
            </div>
        );
    }

    return (
        <div style={styles.chatDetail}>
            <div style={styles.chatHeader}>
                <span>{chat.user?.username || chat.shop?.shop_name}</span>
                <button style={styles.closeButton} onClick={onClose} aria-label="Đóng chat">
                    ×
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
                        <div>{msg.text}</div>
                        {msg.timestamp && (
                            <div
                                style={{
                                    fontSize: 11,
                                    color: "#888",
                                    marginTop: 4,
                                    textAlign: msg.fromMe ? "right" : "left",
                                }}
                            >
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div style={styles.inputContainer}>
                <input
                    style={styles.input}
                    placeholder="Nhập tin nhắn..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button style={styles.sendButton} onClick={sendMessage} aria-label="Gửi tin nhắn">
                    Gửi
                </button>
            </div>
        </div>
    );
};

const ChatWidget = () => {
    const [open, setOpen] = useState(false);
    const [socket, setSocket] = useState(null);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [messages, setMessages] = useState({});
    const [chats, setChats] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {

        if (!TOKEN) {
            console.error("Không có token, vui lòng đăng nhập.");
            return;
        }

        const fetchChats = async () => {
            try {
                let payload;
                try {
                    payload = JSON.parse(atob(TOKEN.split(".")[1]));
                    console.log("Payload token:", payload);
                } catch (err) {
                    console.error("Lỗi parse token:", err);
                    return;
                }

                const userId = payload.user_id || payload.id;
                const role = payload.roles?.[0] || "customer";

                if (!userId || !role) {
                    console.error("Token thiếu user_id hoặc roles:", payload);
                    return;
                }

                setUserId(userId);
                console.log("Gửi yêu cầu với userId:", userId, "role:", role);

                const res = await fetch(`http://localhost:8080/api/v1/chat/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                    },
                });

                if (!res.ok) {
                    const text = await res.text();
                    console.error("Lỗi khi gọi API:", res.status, text);
                    throw new Error("Không lấy được danh sách chat");
                }

                const data = await res.json();
                console.log("Dữ liệu chat nhận được:", data);
                setChats(data.data || data);
            } catch (err) {
                console.error("Lỗi lấy danh sách chat:", err);
            }
        };

        fetchChats();
    }, [TOKEN]);


    useEffect(() => {
        if (selectedChatId !== null) {
            localStorage.setItem("selectedChatId", selectedChatId);
        }
    }, [selectedChatId]);

    useEffect(() => {
        const savedId = localStorage.getItem("selectedChatId");
        if (savedId) {
            setSelectedChatId(savedId);
            setOpen(true);
        }
    }, []);

    useEffect(() => {
        if (!open || !TOKEN) return;

        const socket = io(SOCKET_SERVER_URL, {
            transports: ["websocket"],
            auth: { token: TOKEN },
        });

        socket.on("connect", () => {
            console.log("Socket kết nối:", socket.id);
            socket.emit("auth", TOKEN);
        });

        socket.on("auth_success", (data) => {
            console.log("Xác thực socket thành công:", data);
        });

        socket.on("auth_error", (msg) => {
            console.error("Lỗi xác thực socket:", msg);
            alert("Xác thực socket thất bại: " + msg);
            socket.disconnect();
        });

        socket.on("connect_error", (err) => {
            console.error("Lỗi kết nối socket:", err.message);
        });

        socket.on("disconnect", () => {
            console.log("Socket ngắt kết nối");
        });

        setSocket(socket);
        return () => {
            socket.disconnect();
            setSocket(null);
        };
    }, [open]);

    const addMessage = (chatId, message) => {
        setMessages((prev) => {
            const oldMessages = prev[chatId] || [];
            return {
                ...prev,
                [chatId]: [...oldMessages, message],
            };
        });
    };

    const handleSelectChat = (chatId) => {
        setSelectedChatId(chatId);

        // Kiểm tra xem đã có tin nhắn chưa, nếu chưa thì fetch
        if (!messages[chatId]) {
            fetch(`http://localhost:8080/api/v1/chat/${chatId}`, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Lỗi khi tải tin nhắn");
                    return res.json();
                })
                .then((data) => {
                    const formattedMessages = data.data.map((msg) => ({
                        text: msg.message,
                        timestamp: msg.created_at,
                        fromMe: msg.sender_id === userId,
                    }));
                    setMessages((prev) => ({
                        ...prev,
                        [chatId]: formattedMessages,
                    }));
                })
                .catch((err) => {
                    console.error("Lỗi tải tin nhắn:", err);
                });
        }
    };

    return (
        <>
            {!open && <ChatButton onClick={() => setOpen(true)} hasUnread={false} />}
            {open && (
                <div style={styles.widgetContainer}>
                    <ChatList
                        chats={chats}
                        selectedChatId={selectedChatId}
                        onSelect={handleSelectChat}
                    />
                    <ChatDetail
                        selectedChatId={selectedChatId}
                        chat={chats.find((c) => c.chat_id === selectedChatId)}
                        onClose={() => setOpen(false)}
                        socket={socket}
                        messages={messages[selectedChatId] || []}
                        addMessage={addMessage}
                        userId={userId}
                    />
                </div>
            )}
        </>
    );
};

export default ChatWidget;