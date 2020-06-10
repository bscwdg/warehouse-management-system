<template>
  <el-container class="RighBox">
    <!-- 头部 -->
    <RightHeader />
    <!-- 内容 -->
    <el-main>
      <!-- 路由出口 -->
      <router-view></router-view>
    </el-main>
    <el-footer
      ><div class="copyright">
        <h1>
          &copy;毕业设计&nbsp;版权所有：四川师范大学&nbsp;物理与电子工程学院&nbsp;2016级&nbsp;顾郑凯
        </h1>
      </div></el-footer
    >
  </el-container>
</template>

<script>
// 引入头部组件
import RightHeader from "./RightHeader";
export default {
  // 注册组件
  components: {
    RightHeader,
  },
};
</script>

<style lang="less" scoped>
.el-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 850px;
  .el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
  }
  .el-footer {
    height: 30px !important;
    background-color: #e9eef3;
    .copyright {
      h1 {
        font-size: 12px;
        text-align: center;
        line-height: 30px;
        color: #73777a;
      }
    }
  }
}
</style>
