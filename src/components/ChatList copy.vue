<template>
  <div class="chat-list">
    <!-- <button @click="createChat" class="create-chat-btn">创建新对话</button> -->
    <div>专家界面demo</div>
    <div v-if="chatsToday.length > 0">
      <div class="chat-date-header">
        <img src="../assets/up.png" alt="">
        可信度不高，待真身解答
      </div>
      <div v-for="chat in chatWait" :key="chat.id"
          :class="{ 'selected': chat.id === selectedChatId }"
          class="chat-item"
          @click="selectChat(chat)">
        {{ chat.title }}
        <span id="notice">NEW</span>
      </div>
    </div>

    <div v-if="chatsYesterday.length > 0">
      <div class="chat-date-header">分身自动回复</div>
      <div v-for="chat in chatResponded" :key="chat.id"
          :class="{ 'selected': chat.id === selectedChatId }"
          class="chat-item"
          @click="selectChat(chat)">
        {{ chat.title }}
      </div>
    </div>


    <div v-if="chatsOlder.length > 0">
      <div class="chat-date-header">已解决</div>
      <div v-for="chat in chatOlder" :key="chat.id"
          :class="{ 'selected': chat.id === selectedChatId }"
          class="chat-item"
          @click="selectChat(chat)">
        {{ chat.title }}
      </div>
    </div>
  </div>

</template>


<script>
export default {
  name: 'ChatList',
  props: ['chats', 'selectedChatId'],
  methods: {
    createChat() {
      // Emit an event to the parent component to create a new chat
      this.$emit('createChat');
    },
    // isChatDate(chat, days) {
    //   const chatDate = new Date(chat.lastMessageTimestamp);
    //   const today = new Date();
    //   const dayDifference = (today - chatDate) / (1000 * 3600 * 24);
    //   if (days === 0) {
    //     return dayDifference < 1;
    //   } else if (days === 1) {
    //     return dayDifference >= 1 && dayDifference < 2;
    //   } else if (days === 7) {
    //     return dayDifference >= 2 && dayDifference < 7;
    //   } else {
    //     return dayDifference >= 7;
    //   }
    // },
    isChatDate(chat,days){
      const chatDate = new Date(chat.lastMessageTimestamp);
      const today = new Date();
      const dayDifference = (today - chatDate) / (1000 * 3600 * 24);
      if (days === 0) {
        return dayDifference < 1;
      } else if (days === 1) {
        return dayDifference >= 1 && dayDifference < 2;
      } else {
        return dayDifference >= 7;
      }
    
    },

    selectChat(chat) {
      this.$emit('chatSelected', chat);
    },
  },
  computed: {
    chatsToday() {
      return this.chats.filter(chat => this.isChatDate(chat, 0))
        .sort((a, b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp));
    },
    chatsYesterday() {
      return this.chats.filter(chat => this.isChatDate(chat, 1))
        .sort((a, b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp));
    },
    chatsWeek() {
      return this.chats.filter(chat => this.isChatDate(chat, 7))
        .sort((a, b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp));
    },
    chatsOlder() {
      return this.chats.filter(chat => this.isChatDate(chat, 8))
        .sort((a, b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp));
    },
  }
}
</script>

<style>
.create-chat-btn {
  /* 调整按钮样式为圆角方形 */
  border-radius: 10px; /* 圆角的大小 */
  border: none; /* 取消边框 */
  background-color: #87CEEB; /* 按钮的背景色 */
  color: white; /* 按钮文字颜色 */
  padding: 10px 20px; /* 按钮内边距 */
  font-size: 1rem; /* 文字大小 */
  cursor: pointer; /* 鼠标悬停时显示手型光标 */
  outline: none; /* 点击时不显示轮廓 */
  margin: 0 auto; /* 水平居中 */
  display: block; /* 使 margin:auto 生效 */
  margin-top: 10px; /* 与上方内容的间距 */
  margin-bottom: 10px; /* 与下方内容的间距 */
  width: 100%;
}

.chat-date-header {
  color: #9a9a9a; /* Light grey color for date headers */
  margin-top: 10px;
  margin-bottom: 5px;
}

.chat-item {
  cursor: pointer;
  padding: 10px 15px; /* 增加内边距让内容更有空间感 */
  margin: 10px 0; /* 增加上下边距 */
  border-radius: 8px; /* 轻微的圆角效果 */
  background-color: #f8f9fa; /* 聊天项的背景色 */
  transition: background-color 0.2s; /* 添加过渡效果使得颜色变化更平滑 */
}

.selected {
  background-color:rgb(229, 245, 255); /* 淡天蓝色 */
}
.chat-date-header img{
 width: 20px;
}
/* NEW */
#notice{
float:right;
color:red;
font-size: small;
font-weight:600;
}

</style>
