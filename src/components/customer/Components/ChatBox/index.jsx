import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

const ChatBox = ({ shopName, onClose }) => {
    const [messages, setMessages] = useState([
        { from: "shop", text: "Hello! How can I assist you today?" },
    ]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);

    // Cuộn tin nhắn xuống cuối mỗi khi có tin nhắn mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        setMessages((prev) => [...prev, { from: "user", text: inputValue.trim() }]);
        setInputValue("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-5 right-5 w-[350px] max-w-full bg-white rounded-lg shadow-lg border border-gray-300 flex flex-col overflow-hidden font-sans
                    transition-transform duration-300 ease-in-out">
            {/* Header */}
            <div className="flex items-center justify-between bg-red-500 text-white px-4 py-3">
                <div className="flex items-center gap-2">
                    <MessageCircle size={20} />
                    <h3 className="font-semibold text-lg">{shopName}</h3>
                </div>
                <button
                    onClick={onClose}
                    aria-label="Close chat"
                    className="hover:bg-red-600 p-1 rounded-full transition"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div
                className="flex-1 px-4 py-3 overflow-y-auto bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300"
                style={{ maxHeight: "300px" }}
            >
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`mb-3 max-w-[80%] ${msg.from === "user"
                            ? "self-end bg-red-500 text-white rounded-t-lg rounded-bl-lg px-3 py-2"
                            : "self-start bg-white border border-gray-300 rounded-t-lg rounded-br-lg px-3 py-2"
                            }`}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-3 bg-white flex gap-2">
                <textarea
                    className="flex-1 resize-none border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                    rows={1}
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    onClick={handleSend}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold transition"
                    aria-label="Send message"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
