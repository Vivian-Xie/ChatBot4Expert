<template>
  <div class="chat-window" ref="chatWindow">
    <template v-if="selectedChat && Array.isArray(processedMessages)">
      <div class="expert_welcome" v-if="showExpertWelcome">
        <div>专家已真身介入</div>
      </div>
      <div v-for="(message, index) in processedMessages" :key="index" :class="{'message-wrapper-expert': message.sender_type === 'expert'|| message.sender_type === 'bot', 'message-wrapper-parent': message.sender_type === 'parent'}" @pop="showt(e,index)"  @mouseenter="chow(index)">
        <div class="chat-content" >
          <div :class="{'avatar-expert': message.sender_type === 'expert'|| message.sender_type === 'bot', 'avatar-parent': message.sender_type === 'parent'}">
            <img :src="require('../assets/'+message.sender_type+'.png')"/>
          </div>
          <div :class="{'speech-expert': message.sender_type === 'bot'||message.sender_type === 'expert', 'speech-parent': message.sender_type === 'parent'}" ></div>
          <div  @pop="showt(item)" :class="{'parent-message': message.sender_type === 'parent', 'expert-message': message.sender_type === 'expert'|| message.sender_type === 'bot', 'pre-wrap': true}" v-contextmenu="{menuList, onShow}" :style="colorStyle" >
            {{ message.content }}
          </div>
          <div class="score">
            <span style="display: inline">打分：</span>
            <el-rate v-model="value1"></el-rate>
           
          </div>
        </div>
        
        </div>
        <!-- <div style="height:100px;background-color:blue"  >
            <el-rate  value="3" v-model="value1"></el-rate>
          </div> -->
    </template>
 
  </div> 
</template>

<script>
// import {StarRating} from 'vue-rate-it';
// import {HeartRating}  from 'vue-star-rating';
// import HeartRating from 'vue-rate-it';
// import Reta from "@/components/StarRate.vue"

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
    },
    
  },
  // components: {
  //   HeartRating
  // },
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
            this.showt();
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
      nowindex:0,
      curScore: '',
      width:'',
      welcome_expert:false,
      value1: null,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      // showRate:false,
      // parent:require("@/assets/user2.png"),
      // bot:require("@/assets/gpt.png"),
      // expert:require("@/assets/advisor.png")
     
    }
  },
  methods: {
    chow(index){
      console.log(index);
      this.$data.nowindex=index
    },
    scrollToBottom() {
      const chatWindow = this.$refs.chatWindow;
      chatWindow.scrollTop = chatWindow.scrollHeight;
    },
    onShow(){
      console.log('显示菜单');
      
    },
    showt(){
      // console.log(this.$el.children[this.$data.nowindex].style);
      // this.display='block';
      // this.color='red';
      this.$el.children[this.$data.nowindex].children[0].children[3].style="display:block;"
      // this.colorStyle.color='red';
      // this.colorStyle.display='block';
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

.score{
  display:none;
  height:30px;
  padding-bottom: 10px;
  position:relative;
  left:50;
}

.el-rate{
  display:inline-block;
}

</style>