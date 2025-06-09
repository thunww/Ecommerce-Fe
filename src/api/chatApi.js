import axiosClient from "./axiosClient";

const chatApi = {
    // Lấy danh sách các cuộc trò chuyện của user
    getChatListByUserId: (userId) =>
        axiosClient.get(`/chats/user/${userId}`),

    // Lấy toàn bộ tin nhắn trong một cuộc trò chuyện
    getMessagesByChatId: (chatId) =>
        axiosClient.get(`/messages/chat/${chatId}`),

    // Gửi tin nhắn mới
    sendMessage: ({ chat_id, sender_id, receiver_id, message }) =>
        axiosClient.post("/messages/send", {
            chat_id,
            sender_id,
            receiver_id,
            message,
        }),

    // Tạo cuộc trò chuyện mới giữa user và shop (nếu chưa có)
    createChatIfNotExist: ({ user_id, shop_id }) =>
        axiosClient.post("/chats/create", {
            user_id,
            shop_id,
        }),

    // Lấy thông tin cuộc trò chuyện theo user_id và shop_id
    getChatByUserAndShop: ({ user_id, shop_id }) =>
        axiosClient.get("/chats/by-user-shop", {
            params: {
                user_id,
                shop_id,
            },
        }),
};

export default chatApi;
