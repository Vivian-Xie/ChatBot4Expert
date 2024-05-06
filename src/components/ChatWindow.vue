<template>
  <div class="chat-window" ref="chatWindow">
    <template v-if="selectedChat && Array.isArray(processedMessages)">
      <div class="expert_welcome" v-if="showExpertWelcome">
        <div>专家已真身介入</div>
      </div>
      <div v-for="(message, index) in processedMessages" :key="index" :class="{'message-wrapper-expert': message.sender_type === 'expert'|| message.sender_type === 'bot', 'message-wrapper-parent': message.sender_type === 'parent'}"   @mouseenter="getChatBoxIndex(index)">
        <div class="chat-content" >
          <div :class="{'avatar-expert': message.sender_type === 'expert'|| message.sender_type === 'bot', 'avatar-parent': message.sender_type === 'parent'}">
            <img :src="require('../assets/'+message.sender_type+'.png')"/>
          </div>
          <div :class="{'speech-expert': message.sender_type === 'bot'||message.sender_type === 'expert', 'speech-parent': message.sender_type === 'parent'}" ></div>
          <div class="messageInnerWrapper">
            <div class="messageInnerWrapper2">

              <div  @pop="showStar(item)" :class="{'parent-message': message.sender_type === 'parent', 'expert-message': message.sender_type === 'expert'|| message.sender_type === 'bot', 'pre-wrap': true}" v-contextmenu="{menuList, onShow}" >
              <div style=""></div>
                <div class="botText"> {{ message.content }}</div>
               
              </div>
              <div class="score">
                <span style="display: inline">打分：</span>
                <el-rate v-model="value1"></el-rate>
              </div>
            </div>
            
          </div>
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
    },
    
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
      const filteredMessages = this.selectedChat.messages.filter(message => message.machine_score >= 0.5);
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

    return false;
  
  },
  
    menuList() {
      return [
        {
          text: '打分',
          onClick: () => {
            this.showStar();
          }
        },
        {
          text: '反馈', onClick: () => {
            console.log(2);
            this.$prompt('请对这句回答做出评价', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern:/\S/,
          inputErrorMessage: '输入内容为空'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '反馈成功'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
          }
        },
        {
          text: '修改',
          onClick: () => {
            this.showChangeText();
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
      editAllowed: true,
    }
  },
  methods: {
    getChatBoxIndex(index){
      // console.log(index);
      this.$data.nowindex=index
    },
    scrollToBottom() {
      const chatWindow = this.$refs.chatWindow;
      chatWindow.scrollTop = chatWindow.scrollHeight;
    },
    onShow(){
      console.log('显示菜单');
      
    },
    showChangeText(){
      console.log("显示修改");
      if(this.editAllowed){
        // if ()s
        this.editAllowed=false;
        let targetElement = this.$el.children[this.$data.nowindex].children[0].children[2].children[0].children[0].textContent;

        this.$el.children[this.$data.nowindex].children[0].children[2].children[0].children[0].textContent=targetElement+'\n--------------------------------------------------\n';
        let messageElement = this.$el.children[this.$data.nowindex].children[0].children[2].children[0].children[0];
        console.log(this.$el.children[this.$data.nowindex].children[0].children[2].children[0].children[0])
      // 创建一个新的 input 元素
      let input = document.createElement('p');
      input.className='editBox'
      input.textContent  = targetElement // 设置初始值为当前文本内容
      input.setAttribute('contenteditable', 'true'); 
      // input.rows = '3';
      input.style.width = '100%';  // 根据需要调整样式
  
      // 替换当前元素的内容为输入框
      // messageElement.innerHTML = '';
      messageElement.appendChild(input);
      input.focus();
  
      // 监听键盘事件处理提交
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          // 划线
          // console.log(messageElement.children[0])
          messageElement.style.textDecoration='line-through';
          messageElement.children[0].style.fontWeight='bold';
          // messageElement.children[0].style.textDecoration='none';
          // 移除输入框
          input.setAttribute('contenteditable', 'false'); 
          this.editAllowed=true;
        }
      });
      }
    },
    showStar(){
      //message wrapper->chat-content->
      this.$el.children[this.$data.nowindex].children[0].children[2].children[0].children[1].style="display:block;"
      // console.log(this.$el)
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
  max-width: 77%;
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
  /* display: inline-block; */
  word-wrap: break-word;
  align-self: flex-end;
}

.expert-message .botText{
  margin-bottom:0px;
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

.messageInnerWrapper{
  position: relative;
  right:0;
  display:flex;
  justify-content:flex-end;
}
.messageInnerWrapper2{
  display: flex;
  position: relative;
  right:0;
  flex-direction: column;
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
  margin-bottom: 8px;
  position:relative;
  left:50;
  float:right;
}

.el-rate{
  display:inline-block;
}

.editBox{
  background-color: #87CEEB;
  border:none;
  color:white;
  outline:none;
  width:100%;
  display:inline-block;
  /* height:auto; */
  /* white-space:nowrap; */
  overflow:auto;
  resize:none;
  /* text-overflow:ellipsis;  */
}

</style>