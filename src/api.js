// src/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://101.6.41.93:22500',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

export default {
  sendMessage(chatId, userId, senderType, messageContent) {
    return apiClient.post('/messages', {
      chat_id: chatId,
      sender_id: userId,
      sender_type: senderType,
      content: messageContent
    });
  },
  createChat(parentId, expertId) {
    return apiClient.post('/create_chats', {
      parent_id: parentId,
      expert_id: expertId
    });
  },
  getMessages(chatId) {
    return apiClient.get(`/chats/${chatId}/messages`);
  },
  getUserChats(userId) {
    return apiClient.get(`/users/${userId}/get_chats`);
  },
};