<template>
  <div class="home">
    <el-container>
      <!-- 左侧 -->
      <LeftNav />
      <!-- 右侧 -->
      <RightBox />
    </el-container>
  </div>
</template>

<script>
// 引入组件
import LeftNav from "@/components/Layout/LeftNav.vue";
import RightBox from "@/components/Layout/RightBox.vue";
export default {
  components: {
    LeftNav,
    RightBox,
  },
};
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  .el-container {
    height: 100%;
  }
}
</style>
