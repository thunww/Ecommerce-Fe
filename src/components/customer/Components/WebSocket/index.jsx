import React, { useState, useEffect, useRef } from 'react';

const WEBSOCKET_URL = 'ws://localhost:8080'; // Đổi thành URL thật nếu cần

const ChatWebSocket = ({ token, receiverId }) => {
    const ws = useRef(null);
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]); // Lưu danh sách tin nhắn
    const [inputMessage, setInputMessage] = useState('');
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        // Tạo kết nối WebSocket
        ws.current = new WebSocket(WEBSOCKET_URL);

        ws.current.onopen = () => {
            console.log('WebSocket connected');
            // Gửi auth token ngay khi kết nối mở
            ws.current.send(JSON.stringify({
                type: 'auth',
                token: token
            }));
        };

        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // Xử lý các loại message từ server
                if (data.type === 'auth_success') {
                    setConnected(true);
                    setAuthError(null);
                    console.log('Auth thành công:', data.data);
                } else if (data.type === 'error') {
                    setAuthError(data.message);
                    console.error('WebSocket error:', data.message);
                } else if (data.type === 'new_message') {
                    setMessages(prev => [...prev, data.data]);
                } else if (data.type === 'message_sent') {
                    // Tin nhắn vừa gửi được xác nhận, bạn có thể update UI nếu muốn
                    setMessages(prev => [...prev, data.data]);
                }
            } catch (error) {
                console.error('Lỗi xử lý tin nhắn từ WS:', error);
            }
        };

        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
            setConnected(false);
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // Cleanup khi component unmount
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [token]);

    const sendMessage = () => {
        if (!inputMessage.trim()) return;
        if (!connected) {
            alert('Chưa kết nối WebSocket hoặc chưa xác thực');
            return;
        }
        // Gửi message theo định dạng backend yêu cầu
        ws.current.send(JSON.stringify({
            type: 'message',
            receiver_id: receiverId,
            message: inputMessage.trim()
        }));
        setInputMessage('');
    };

    return (
        <div style={{ maxWidth: 400, margin: 'auto' }}>
            <h2>WebSocket Chat</h2>

            {authError && <p style={{ color: 'red' }}>Lỗi xác thực: {authError}</p>}

            <div style={{ border: '1px solid #ccc', padding: 10, height: 300, overflowY: 'auto', marginBottom: 10 }}>
                {messages.length === 0 && <p>Chưa có tin nhắn nào</p>}
                {messages.map((msg, idx) => (
                    <div key={idx} style={{ marginBottom: 6 }}>
                        <b>{msg.senderType === 'user' ? 'User' : 'Shop'} {msg.senderId}:</b> {msg.message}
                    </div>
                ))}
            </div>

            <input
                type="text"
                placeholder="Nhập tin nhắn..."
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                style={{ width: '100%', padding: '8px' }}
                disabled={!connected}
            />
            <button onClick={sendMessage} disabled={!connected || !inputMessage.trim()} style={{ marginTop: 6, width: '100%' }}>
                Gửi
            </button>
        </div>
    );
};

export default ChatWebSocket;
