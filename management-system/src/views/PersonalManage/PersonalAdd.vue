<template>
  <div>
    <el-card class="box-card">
      <!-- 面包头部 -->
      <div slot="header" class="clearfix">
        <span>添加员工</span>
      </div>
      <el-form
        :model="personalAddForm"
        :rules="rules"
        status-icon
        ref="personalAddForm"
        class="demo-ruleForm"
        style="width: 315px;"
        label-width="100px"
      >
        <el-form-item label="员工名字" prop="personalname">
          <el-input v-model="personalAddForm.personalname"></el-input>
        </el-form-item>
        <el-form-item label="员工等级" prop="personalclass">
          <el-select
            v-model="personalAddForm.personalclass"
            placeholder="选择等级"
          >
            <el-option label="p1" value="p1"></el-option>
            <el-option label="p2" value="p2"></el-option>
            <el-option label="p3" value="p3"></el-option>
            <el-option label="p4" value="p4"></el-option>
            <el-option label="p5" value="p5"></el-option>
            <el-option label="p6" value="p6"></el-option>
            <el-option label="p7" value="p7"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">添加</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 引入接口请求方法
import { addPersonal } from "@/api/personal";
export default {
  data() {
    return {
      personalAddForm: {
        personalname: "",
        personalclass: "",
      },
      rules: {
        personalname: [
          { required: true, message: "请输入名字", trigger: "blur" },
          { min: 1, max: 5, message: "长度在 1 到 5 个字符", trigger: "blur" },
        ],
        personalclass: [
          { required: true, message: "请选择员工等级", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    submitForm() {
      this.$refs.personalAddForm.validate(async (valid) => {
        if (valid) {
          let { code, msg } = await addPersonal(this.personalAddForm);
          // 成功
          if (code === 0) {
            // 路由跳转
            this.$router.push("/home/personallist");
          } else {
            // 失败提示
            this.$message.error(msg);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.personalAddForm.resetFields();
    },
  },
};
</script>

<style lang="less" scoped></style>
