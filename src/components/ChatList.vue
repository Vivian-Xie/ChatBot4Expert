<template>
  <div class="chat-list">
    <div>专家界面demo</div>
    <div v-if="chatsUrgent.length > 0">
      <div class="chat-date-header">
        <img src="../assets/up.png" alt="">
        可信度不高，待真身解答
      </div>
      <div v-for="chat in chatsUrgent" :key="chat.id"
          :class="{ 'selected': chat.id === selectedChatId }"
          class="chat-item"
          @click="selectChat(chat)">
        {{ chat.title }}
        <span id="notice">NEW</span>
      </div>
    </div>

    <div v-if="chatsPending.length > 0">
      <div class="chat-date-header">分身回复待确认</div>
      <div v-for="chat in chatsPending" :key="chat.id"
          :class="{ 'selected': chat.id === selectedChatId }"
          class="chat-item"
          @click="selectChat(chat)">
        {{ chat.title }}
        <el-button type="text" @click="open">
          <img class="rank-icon" src="../assets/rank.png" alt="rankAll" @click="rankAll(chat)">
        </el-button>
      </div>
    </div>


    <div v-if="chatsAuto.length > 0">
      <div class="chat-date-header">已自动托管</div>
      <div v-for="chat in chatsAuto" :key="chat.id"
          :class="{ 'selected': chat.id === selectedChatId }"
          class="chat-item"
          @click="selectChat(chat)">
        {{ chat.title }}
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'ChatList',
  props: ['chats', 'selectedChatId'],
  methods: {
    selectChat(chat) {
      this.$emit('chatSelected', chat);
    },
    rankAll(chat){
      console.log(chat);
      
    },
    open() {
        this.$prompt('请对此次对话做出评价', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern:/\S/,
          inputErrorMessage: '输入内容为空'
        }).then(({ value }) => {
          api.setChatExpertFeedback(this.selectedChatId, value).then(response => {
              console.log('Expert feedback sent:', response.data);
              if (response.data.success) {
                this.$message({
                  type: 'success',
                  message: '反馈成功'
                });
              }
              else {
                console.error('Fail to send feedback');
                this.$message({
                  type: 'error',
                  message: '反馈失败'
                });
              }
            })
            .catch(error => {
              console.error('Error sending feedback:', error);
              this.$message({
                type: 'error',
                message: '反馈出错'
              });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
      }
  },
  computed: {
    chatsUrgent() {
      return this.chats.filter(chat => chat.status==0);
    },
    chatsPending() {
      return this.chats.filter(chat => chat.status==1);
    },
    chatsAuto() {
     return this.chats.filter(chat => chat.status==2);
    },
  }
}
</script>

<style>
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
  position:relative;
}
.chat-item:hover{
  background-color: rgb(211,211,211,0.7);
}

.selected {
  background-color:rgb(229, 245, 255); /* 淡天蓝色 */
}
.chat-date-header img{
 width: 20px;
}
.chat-item button{
  padding:0px;
  position:absolute;
  top:30;
  right:0;
}
/* NEW */
#notice{
float:right;
color:red;
font-size: small;
font-weight:600;
}

.rank-icon{
  width:25px;
  position:absolute;
  right:-50px;
  transition: left 0.3s ease;
}

.chat-item:hover .rank-icon{
  right:10px;
}
</style>
