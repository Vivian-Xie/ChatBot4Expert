<template>
  <div class="chat-window" ref="chatWindow">
    <template v-if="selectedChat && Array.isArray(processedMessages)">
      <div class="expert_welcome" v-if="showExpertWelcome">
        <div>专家已真身介入</div>
      </div>
      <div v-for="(message, index) in processedMessages" :key="index" :class="{'message-wrapper-expert': message.sender_type === 'expert'|| message.sender_type === 'bot', 'message-wrapper-parent': message.sender_type === 'parent'}" >
        <div class="chat-content">
          <div :class="{'avatar-expert': message.sender_type === 'expert'|| message.sender_type === 'bot', 'avatar-parent': message.sender_type === 'parent'}">
            <img :src="require('../assets/'+message.sender_type+'.png')"/>
          </div>
          <div :class="{'speech-expert': message.sender_type === 'bot'||message.sender_type === 'expert', 'speech-parent': message.sender_type === 'parent'}" ></div>
          <div :class="{'parent-message': message.sender_type === 'parent', 'expert-message': message.sender_type === 'expert'|| message.sender_type === 'bot', 'pre-wrap': true}" v-contextmenu="{menuList, onShow}" >
            {{ message.content }}
          </div>
        </div>
        <div style="height:100px;background-color:blue"  v-if="message.showRate">
          <span class="rate" :class="{'disabled':disabled}" style="cursor: pointer">
            <i v-for="i in 5" class="iconfont" :key="`outer-${i}`" @mouseenter="disabled?'':curScore=i" @mouseleave="disabled?'':curScore=''" @click="disabled?'':setScore(i)" :class="getClass(i)">
              <i v-if="disabled&&i==Math.floor(score)+1" class="iconfont icon-star" :style="'width:'+width"></i>
            </i>
          <span v-if="showText" class="text">{{curScore||score}}分</span>
          </span>
        </div>
      </div>
    </template>
 
  </div> 

</template>

<script>

export default {
  name: 'ChatWindow',
  props: {
    chats: Array,
    selectedChat: Object,
    score: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showText: {
      type: Boolean,
      default: false
    }
  },
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
            showRate: false,  // Add a showRate flag to each message
            content: contentPart
          });
        });
      });
      return flatMessages;
    },
    showExpertWelcome() {
    if (!this.selectedChat || !Array.isArray(this.selectedChat.messages) || this.selectedChat.messages.length < 2) {
      return false;
    }
    // console.log("what is"+this.selectedChat.messages[0]);

    return false;
  
  },
    menuList() {
      console.log(1);
      return [
        {
          text: '打分',
          onClick: () => {
            console.log(1);
            // console.log(message);
            // this.toggleRate(message);
          }
        },
        {
          text: '反馈', onClick: () => {
            console.log(2)
          }
        }
      ]
    },
  },
  data(){
    return{
      curScore: '',
      width:'',
      welcome_expert:false,
      showRate:false,
      // parent:require("@/assets/user2.png"),
      // bot:require("@/assets/gpt.png"),
      // expert:require("@/assets/advisor.png")
    }
  },
  methods: {
    scrollToBottom() {
      const chatWindow = this.$refs.chatWindow;
      chatWindow.scrollTop = chatWindow.scrollHeight;
    },
    onShow(){
      console.log('显示菜单');
      
    },
    toggleRate(message) {
    message.showRate = !message.showRate; // Toggle the specific message's rate visibility
  },
    getClass(i) {
                if (this.curScore === '') {
                    return i <= this.score ?  'aid aid-star gold' : 'aid aid-star-outline'
                } else {
                    return i <= this.curScore ? 'aid aid-star gold' : 'aid aid-star-outline'
                }
            },
            getDecimal() {
                this.width=Number(this.score * 100 - Math.floor(this.score) * 100)+'%';
            },
            setScore(i){
                this.$emit('update:score',i);//使用`.sync`修饰符，对score 进行“双向绑定
            }
        
  },
  mounted() {
    // console.log(this.menuList);
    this.scrollToBottom();
  },
  updated() {
    this.scrollToBottom();
  },
}
</script>

<style>
.message-wrapper-parent .chat-content{
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.message-wrapper-expert .chat-content{
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