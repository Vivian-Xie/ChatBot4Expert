<template>
  <div id="app" class="d-flex flex-column h-100">
    <div class="container-fluid h-100">
      <div class="row h-100">
        <div class="col-2" id="chatlist">
          <chat-list :chats="chats" :selectedChatId="selectedChatId" @chatSelected="selectChat" @createChat="createNewChat"></chat-list>
        </div>
        <div class="col-10 d-flex flex-column" id="chatwin">
          <chat-window :selectedChat="selectedChat" class="flex-grow-1 overflow-auto"></chat-window>
          <input-area v-if="selectedChat" @messageSent="sendMessage" class="mt-auto"></input-area>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import ChatList from './components/ChatList.vue';
import ChatWindow from './components/ChatWindow.vue';
import InputArea from './components/InputArea.vue';
import api from './api';

export default {
  name: 'App',
  components: {
    ChatList,
    ChatWindow,
    InputArea
  },
  data() {
    return {
      chats: [],
      selectedChatId: null,
      selectedChat: null,
    };
  },
  methods: {
    createNewChat() {
      const userId = 0;
      const expertId = 1;
      api.createChat(userId, expertId)
        .then(response => {
          const newChat = response.data;
          this.chats.push(newChat);
          this.selectedChat = newChat;
          this.selectedChatId = newChat.id;
          console.log('New chat created:', newChat);
        })
        .catch(error => {
          console.error('Error creating new chat:', error);
        });
    },
    selectChat(chat) {
      this.selectedChat = chat;
      this.selectedChatId = chat.id;
      this.fetchMessages();
    },
    sendMessage(content) {
      if (this.selectedChat && content) {
        // ToDo: get user id
        const userId = 0;

        api.sendMessage(this.selectedChat.id, userId, 'expert', content)
          .then(response => {
            console.log('Message sent:', response.data);
            this.fetchMessages();
          })
          .catch(error => {
            console.error('Error sending message:', error);
        });
      }
    },
    fetchMessages() {
      if (this.selectedChat) {
        const curId = this.selectedChat.id;
        api.getMessages(curId)
          .then(response => {
            console.log('Message received:', response.data);
            if (this.selectedChat.id == curId && response.data.length != this.selectedChat.messages.length) {
              this.selectedChat.messages = response.data;
            }
          })
          .catch(error => {
            console.error('Error fetching messages:', error);
          });
      }
    },
    fetchChatsAndMessages() {
      // ToDo: get user id
      const userId = 0;

      api.getUserChats(userId)
        .then(response => {
          console.log('Chats and messages received:', response.data);
          this.chats = response.data;
          if (this.chats.length > 0) {
            this.selectChat(this.chats[this.chats.length - 1]);
          }
        })
        .catch(error => {
          console.error('Error fetching chats and messages:', error);
        });
    },
  },
  mounted() {
    this.fetchChatsAndMessages();
    // 60s
    setInterval(this.fetchMessages, 60000);
  }
}
</script>

<style>
/* 确保整个应用程序高度占满浏览器窗口 */
html, body {
  height: 100%;
}
#app {
  height: 100%;
}
#chatlist{
  width:20%;
  height:100vh;
  overflow:scroll;

}
#chatwin{
  width:80%;
  height:100vh;
}
</style>