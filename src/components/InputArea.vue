<template>
  <div class="input-area d-flex justify-content-center align-items-center">
    <input
      v-model="input"
      ref="input"
      type="text"
      placeholder="请输入您的回答"
      class="input-message"
      @keyup.enter="send"
    >
    <button @click="send" class="send-button">发送</button>
  </div>
</template>

<script>
export default {
  name: 'InputArea',
  data() {
    return {
      input: ''
    }
  },
  methods: {
    send() {
      this.$emit('messageSent', this.input);
      this.input = '';
      // this.$refs.input.blur();
    }
  }
}
</script>

<style>
.input-area {
  padding: 10px;
  width: 100%;
  height: 10vh;
}

.input-message {
  flex: 1 0 50%; /* 宽度为InputArea的50% */
  margin-right: 10px; /* 与按钮之间的间隙 */
  border-radius: 20px; /* 圆角 */
  border: 1px solid #ced4da; /* 边框颜色 */
  padding: 5px 15px; /* 内边距 */
}

.send-button {
  padding: 5px 15px;
  border-radius: 20px; /* 圆角 */
  border: none;
  background-color: #87CEEB;
  color: white;
  cursor: pointer;
}

/* 使输入框和按钮在InputArea中居中 */
.input-area {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>