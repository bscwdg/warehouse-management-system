<template>
  <div class="login">
    <el-container>
      <el-header>
        <h1>
          仓库管理系统
          <span>登录</span>
        </h1>
      </el-header>
      <el-main>
        <!-- 登录表单 -->
        <el-form
          status-icon
          :model="loginForm"
          :rules="loginRules"
          ref="loginForm"
          class="login-form"
        >
          <div class="title">
            <h1>
              系统登录
            </h1>
          </div>
          <!-- 账号 -->
          <el-form-item prop="account">
            <el-input
              v-model="loginForm.account"
              prefix-icon="iconfont icon-zhanghao1"
              type="account"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              @click.native="changeType"
              prefix-icon="iconfont icon-mima"
              :suffix-icon="
                isShow
                  ? 'iconfont isShow icon-xianshi'
                  : 'iconfont isShow icon-yincang'
              "
              :type="isShow ? 'text' : 'password'"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <!-- 按钮 -->
          <el-form-item>
            <el-button class="login-button" type="primary" @click="submitForm"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </el-main>
      <el-footer
        ><div class="copyright">
          <h1>
            &copy;毕业设计&nbsp;版权所有：四川师范大学&nbsp;物理与电子工程学院&nbsp;2016级&nbsp;顾郑凯
          </h1>
        </div></el-footer
      >
    </el-container>
  </div>
</template>

<script>
// 引入工具函数
import { pwdReg } from "../utils/reg";
// 引入请求接口的函数
import { checkLogin } from "@/api/account";
// 引入本地存储工具函数
import local from "@/utils/session";
export default {
  data() {
    // 自定义验证密码
    const validatePwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!rule.regular.test(value)) {
        callback(new Error("密码由数字和字母组成，长度6-12位"));
      } else {
        callback();
      }
    };
    return {
      // 登录表单
      loginForm: {
        account: "",
        password: "",
      },
      // 显示隐藏
      isShow: false,
      // 验证规则对象
      loginRules: {
        account: [
          // 非空验证
          { required: true, message: "账号不能为空", trigger: "blur" },
          // 长度
          { min: 5, max: 12, message: "账号长度为5-12位", trigger: "blur" },
        ],
        password: [
          // 非空验证
          // { required: true, message: "请输入密码", trigger: "blur" },
          // 自定义验证
          {
            validator: validatePwd,
            regular: pwdReg(),
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    changeType(e) {
      if (e.target.className.includes("isShow")) {
        this.isShow = !this.isShow;
      }
    },
    // 登录
    submitForm() {
      // console.log(this.$refs.loginForm.validate);
      this.$refs.loginForm.validate(async (valid) => {
        // console.log(valid);
        if (valid) {
          // 发送登录请求
          let { code, token, role } = await checkLogin(this.loginForm);

          // 如果登录成功  跳转到后端首页
          if (code === 0) {
            // 把token存入本地存储
            local.set("token", token);
            local.set("role", role);

            // 跳转到首页
            this.$router.push("/home");
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less">
.login {
  width: 100%;
  height: 100%;
  // background: #f5f5f6;
  .el-container {
    width: 100%;
    height: 100%;
    .el-header {
      color: #333;
      text-align: left;
      line-height: 60px;
      h1 {
        color: #ff6a00;
        font-size: 24px;
        margin: 0 auto;
        max-width: 1200px;
        span {
          font-size: 24px;
          color: #181818;
          letter-spacing: 0;
          height: 30px;
          margin-left: 10px;
          padding: 0 10px;
          vertical-align: bottom;
          border-left: 1px solid #999;
        }
      }
    }
    .el-main {
      background-color: #e9eef3;
      color: #333;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      text-align: center;
      line-height: 160px;
      .login-form {
        width: 400px;
        .title {
          h1 {
            text-align: center;
            font-size: 30px;
            color: #ff6a00;
            line-height: 50px;
            margin-bottom: 30px;
          }
        }
        .el-input__icon {
          color: #000;
        }
        .el-form-item.is-error .el-input__validateIcon {
          color: #f56c6c;
        }
        .login-button {
          width: 100%;
        }
      }
    }
    .el-footer {
      background-color: #e9eef3;

      .copyright {
        font-size: 12px;
        text-align: center;
        line-height: 60px;
        color: #73777a;
      }
    }
  }
}
</style>
