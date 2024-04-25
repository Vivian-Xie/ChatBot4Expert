<template>
  <div v-show="visible" class="context-menu">
      <div
          v-for="(item, index) in list"
          :key="index"
          class="context-menu-item"
          @click.stop="clickHandler(item)"
      >
          {{ item.text }}
      </div>
  </div>
</template>

<script>
  export default {
      name: "ContextMenu",
      props: {
          visible: {
              type: Boolean,
              default: false,
          },
          list: {
              type: Array,
              default: () => {
                  return [];
              },
          },
      },
      methods: {
          close() {
              this.$emit("hide");

          },
          clickHandler(item) {
              if (typeof item.onClick === "function") {
                  item.onClick();
                  console.log('this is from the context menu'+item);
                  this.$emit("pop",item);
                  
              }
              this.close();
          },
      },
  };
</script>

<style>
  .context-menu {
  position: absolute;
  z-index: 999;
  background-color: #ecf0f1;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 6px 0 rgba(51, 51, 51, 0.2);
}

.context-menu-item {
  line-height: 40px;
  padding: 0 10px;
  font-size: 14px;
}

.context-menu-item:hover {
  background-color: #1296db;
  color: #fff;
  cursor: pointer;
}

</style>