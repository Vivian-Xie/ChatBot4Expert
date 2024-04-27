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
  createMessage(chat_id, sender_type, sender_id, content) {
    return apiClient.post('/create_message', {
      chat_id: chat_id,
      sender_type: sender_type,
      sender_id: sender_id,
      content: content
    });
  },
  getExpertChats(expert_id) {
    return apiClient.get(`/experts/${expert_id}/get_chats`);
  },
  getChatMessages(chat_id) {
    return apiClient.get(`/chats/${chat_id}/get_messages`);
  },
  setChatChecked(chat_id) {
    return apiClient.post(`/chats/${chat_id}/set_checked`);
  },
};