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
  // getUserChats(userId) {
  //   return apiClient.get(`/users/${userId}/get_chats`);
  // },
  setChatSuspended(chatId) {
    return apiClient.post(`/chats/${chatId}/set_suspended`);
  },
  getParentChats(parentId) {
    return apiClient.get(`/users/${parentId}/get_chats`);
  },
  getExpertChats(expertId) {
    return apiClient.get(`/users/${expertId}/get_chats`);
  },
  getParentInfo(parentId) {
    return apiClient.get(`/parents/${parentId}/get_parent_info`);
  },
  getExpertInfo(expertId) {
    return apiClient.get(`/users/${expertId}/get_expert_info`);
  },
  createParent(username, phone, passwordHash) {
    return apiClient.post('/create_parent', {
      username: username,
      phone: phone,
      password_hash: passwordHash
    });
  },
  updateExpertInfo(expertId, info) {
    return apiClient.post(`/experts/${expertId}/update_expert_info`, {
      parent_info: info
    });
  },
  createExpert(username, phone, passwordHash) {
    return apiClient.post('/create_expert', {
      username: username,
      phone: phone,
      password_hash: passwordHash
    });
  },
};