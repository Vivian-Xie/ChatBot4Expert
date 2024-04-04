<template>
  <div class="chat-window" ref="chatWindow">
    <template v-if="selectedChat && Array.isArray(processedMessages)">
      <div v-for="(message, index) in processedMessages" :key="index" :class="{'message-wrapper-expert': message.sender_type === 'expert'|| message.sender_type === 'bot', 'message-wrapper-parent': message.sender_type === 'parent'}">
        <div :class="{'avatar-expert': message.sender_type === 'expert'|| message.sender_type === 'bot', 'avatar-parent': message.sender_type === 'parent'}">
          <img :src="require('../assets/'+message.sender_type+'.png')"/>
        </div>
        <div :class="{'speech-expert': message.sender_type === 'bot'||message.sender_type === 'expert', 'speech-parent': message.sender_type === 'parent'}"></div>
        <div :class="{'parent-message': message.sender_type === 'parent', 'expert-message': message.sender_type === 'expert'|| message.sender_type === 'bot', 'pre-wrap': true}">
          {{ message.content }}
        </div>
      </div>
    </template>
    <div class="expert_welcome">
      <div>专家已真身介入</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ChatWindow',
  props: ['chats','selectedChat'],
  watch: {
    'selectedChat.messages': function() {
      // use Vue.nextTick to ensure scrolling after the update of DOM
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    }
  },
  computed: {
    processedMessages() {
      if (!this.selectedChat || !Array.isArray(this.selectedChat.messages)) {
        return [];
      }
      const filteredMessages = this.selectedChat.messages.filter(message => message.score >= 0.5);
      const processedMessages = filteredMessages.map(message => ({
        ...message,
        content: message.content.split('\n\n').filter(part => part.trim() !== '')
      }));
      const flatMessages = [];
      processedMessages.forEach(message => {
        message.content.forEach(contentPart => {
          flatMessages.push({
            ...message,
            content: contentPart
          });
        });
      });
      return flatMessages;
    },

  },
  data(){
    return{
      // parent:require("@/assets/user2.png"),
      // bot:require("@/assets/gpt.png"),
      // expert:require("@/assets/advisor.png")
    }
  },
  methods: {
    scrollToBottom() {
      const chatWindow = this.$refs.chatWindow;
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  },
  mounted() {
    this.scrollToBottom();
  },
  updated() {
    this.scrollToBottom();
  }
}
</script>

<style>
.message-wrapper-parent {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.message-wrapper-expert {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
}

.avatar-expert img{
  width:30px;
}

.avatar-parent img{
  width:30px;
}

.parent-message {
  background-color: #e9ecef;
  /* color: white; */
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  max-width: 70%;
  display: inline-block;
  word-wrap: break-word;
}

.expert-message {
  background-color: #87CEEB;
  color:white;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  max-width: 70%;
  display: inline-block;
  word-wrap: break-word;
  align-self: flex-start;
}

.speech-expert{
  margin-top:8px;
  width:0;
  height:0;
  /* border:10px; */
  border-left:6px solid #87CEEB;
  border-right:6px solid transparent;
  border-bottom:6px solid transparent;
  border-top:6px solid transparent;
}

.speech-parent{
  margin-top:8px;
  width:0;
  height:0;
  /* border:10px; */
  border-right:6px solid #e9ecef;
  border-left:6px solid transparent;
  border-bottom:6px solid transparent;
  border-top:6px solid transparent;
}


.expert_welcome{
  width:100%;
  height:25px;
  display:flex;
  justify-content: center;
}
.expert_welcome div{
  padding-left:5px;
  padding-right:5px;
  background-color:grey;
  border-radius:10px;
  opacity:0.5;
  text-indent:3px;
  color:white;
  width:130px;

}


.chat-window {
  margin-top: 10px;
  max-height: 90vh;
  overflow-y: auto;
}


.pre-wrap {
  white-space: pre-wrap;
}
</style>