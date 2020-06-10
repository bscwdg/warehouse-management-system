<template>
  <div class="goods-leave">
    <el-card class="box-card">
      <div slot="header">
        <h1>货物出库</h1>
      </div>
      <div>
        <!-- 添加货物表单 -->
        <el-form
          size="small"
          :model="leaveStoreForm"
          style="width: 560px;"
          ref="leaveStoreForm"
          label-width="160px"
        >
          <!-- 名称 -->
          <el-form-item label="出库货物名称">
            <el-input v-model="leaveStoreForm.goodsname"></el-input>
          </el-form-item>

          <!-- 货物数量 -->
          <el-form-item label="货物出库数量">
            <el-input v-model="leaveStoreForm.leavequantity"></el-input>
          </el-form-item>

          <!-- 添加按钮 -->
          <el-form-item>
            <el-button type="primary" @click="submitForm">立即出库</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { leaveStore } from "@/api/store";

export default {
  data() {
    return {
      // 货物表格
      leaveStoreForm: {
        goodsname: "", // 货物名称
        leavequantity: "", //货物数量
      },
      formLabelWidth: "120px", // 标签宽度
    };
  },
  methods: {
    // 提交添加表单
    async submitForm() {
      // 获取值
      let { goodsname, leavequantity } = this.leaveStoreForm;
      // 准备参数对象
      let params = {
        goodsname,
        leavequantity,
      };
      let { code, msg } = await leaveStore(params);
      // console.log(code);
      // 发送添加货物的请求
      if (code === 0) {
        this.$router.push("/home/goodslist");
      } else if (code === 5001) {
        // 失败提示
        this.$message.error(msg);
      }
    },
  },
};
</script>

<style lang="less"></style>
