<template>
  <el-aside width="200px">
    <p>仓库管理系统</p>
    <el-menu
      :default-active="path"
      background-color="#282C34"
      text-color="#fff"
      active-text-color="#ff6a00"
      unique-opened
      router
    >
      <template v-for="(item, index) in menus">
        <el-menu-item v-if="!item.children" :index="item.path" :key="index">
          <i class="iconfont" :class="item.icon"></i>
          <span slot="title">{{ item.title }}</span>
        </el-menu-item>

        <el-submenu v-else :index="item.path" :key="index">
          <template slot="title">
            <i class="iconfont" :class="item.icon"></i>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item
            v-for="(v, index) in item.children"
            :key="index"
            :index="v.path"
            >{{ v.title }}</el-menu-item
          >
        </el-submenu>
      </template>
    </el-menu>
  </el-aside>
</template>

<script>
import local from "@/utils/session";
export default {
  data() {
    return {
      //导航菜单
      menus: [],
    };
  },
  computed: {
    path() {
      // 导航激活高亮
      if (this.$route.path.includes("order")) {
        return "/home/ordermanage";
      } else if (this.$route.path.includes("goodsedit")) {
        return "/home/arrivestore";
      }
      return this.$route.path;
    },
  },
  created() {
    let role = local.get("role");
    // 权限菜单
    let limitsMenus = [
      // 首页
      {
        path: "/home",
        icon: "icon-shouye",
        title: "后台首页",
        meta: {
          roles: ["super", "general"],
        },
      },
      // 订单管理
      {
        path: "/home/ordermanage",
        icon: "icon-dingdan",
        title: "订单管理",
        meta: {
          roles: ["super", "general"],
        },
      },
      // 仓库管理
      {
        path: "/home/storemanage",
        icon: "icon-cangku",
        title: "仓库管理",
        children: [
          { path: "/home/goodslist", title: "货物列表" },
          { path: "/home/leavestore", title: "货物出库" },
          { path: "/home/arrivestore", title: "货物入库" },
        ],
        meta: {
          roles: ["super", "general"],
        },
      },
      // 人事管理
      {
        path: "/home/personalmanage",
        icon: "icon-renyuan",
        title: "人事管理",
        children: [
          { path: "/home/personallist", title: "人员列表" },
          { path: "/home/personaladd", title: "人员增加" },
        ],
        meta: {
          roles: ["super"],
        },
      },
      // 账号管理
      {
        path: "/home/accountmanage",
        icon: "icon-zhanghao",
        title: "账号管理",
        children: [
          { path: "/home/accountlist", title: "账号列表" },
          { path: "/home/accountadd", title: "账号增加" },
          { path: "/home/changepassword", title: "修改密码" },
        ],
        meta: {
          roles: ["super"],
        },
      },
      // 数据统计
      {
        path: "/home/datastatistics",
        icon: "icon-tongji",
        title: "数据统计",
        children: [{ path: "/home/storestatistics", title: "仓库统计" }],
        meta: {
          roles: ["super", "general"],
        },
      },
    ];
    // 根据后端返回的角色 计算出权限菜单
    let accessMenu = limitsMenus.filter(
      (item) => item.meta && item.meta.roles.includes(role)
    );

    // 赋值
    this.menus = accessMenu;
  },
};
</script>

<style lang="less" scoped>
.el-aside {
  height: 100%;
  color: #fff;
  background-color: #282c34;
  text-align: center;
  p {
    background-color: #ff6a00;
    font-size: 16px;
    height: 60px;
    line-height: 60px;
    color: #fff;
    padding-left: 6px;
  }
  .el-menu {
    border: none;
    .iconfont {
      color: #fff;
      font-size: 18px;
      margin-right: 5px;
    }
  }
}
</style>
