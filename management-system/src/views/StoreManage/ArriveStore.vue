<template>
  <div class="goods-add">
    <el-card class="box-card">
      <div slot="header">
        <h1>货物入库</h1>
      </div>
      <div>
        <!-- 添加货物表单 -->
        <el-form
          size="small"
          :model="arriveStoreForm"
          style="width: 560px;"
          ref="arriveStoreForm"
          label-width="80px"
        >
          <!-- 名称 -->
          <el-form-item label="货物码">
            <el-input v-model="arriveStoreForm.goodscoding"></el-input>
          </el-form-item>
          <!-- 名称 -->
          <el-form-item label="货物名称">
            <el-input v-model="arriveStoreForm.goodsname"></el-input>
          </el-form-item>
          <!-- 分类 -->
          <el-form-item label="货物分类">
            <el-select
              v-model="arriveStoreForm.goodscategory"
              placeholder="请选择货物分类"
            >
              <el-option label="酒水" value="酒水"></el-option>
              <el-option label="食品" value="食品"></el-option>
              <el-option label="日用品" value="日用品"></el-option>
              <el-option label="衣服" value="衣服"></el-option>
              <el-option label="器材" value="器材"></el-option>
              <el-option label="图书" value="图书"></el-option>
            </el-select>
          </el-form-item>

          <!-- 货物图片 -->
          <el-form-item label="货物图片">
            <el-upload
              class="avatar-uploader"
              action="http://127.0.0.1:5000/store/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="arriveStoreForm.imgUrl"
                :src="serverApi + arriveStoreForm.imgUrl"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <!-- 货物描述 -->
          <el-form-item label="货物描述">
            <el-input
              type="textarea"
              v-model="arriveStoreForm.goodsdesc"
            ></el-input>
          </el-form-item>
          <!-- 货物数量 -->
          <el-form-item label="货物数量">
            <el-input v-model="arriveStoreForm.goodsquantity"></el-input>
          </el-form-item>

          <!-- 添加按钮 -->
          <el-form-item>
            <el-button type="primary" @click="submitForm">立即添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { arriveStore } from "@/api/store";

export default {
  data() {
    return {
      serverApi: "http://127.0.0.1:5000/upload/goods/", // 货物图片服务器地址
      // 货物表格
      arriveStoreForm: {
        goodscoding: "", //货物码
        goodsname: "", // 货物名称
        goodscategory: "", // 货物分类
        imgUrl: "", // 货物图片地址
        goodsdesc: "", // 货物描述
        goodsquantity: "", //货物数量
      },

      formLabelWidth: "120px", // 标签宽度
    };
  },
  methods: {
    // 提交添加表单
    async submitForm() {
      // 获取值
      let {
        goodscoding,
        goodsname,
        goodscategory,
        imgUrl,
        goodsdesc,
        goodsquantity,
      } = this.arriveStoreForm;

      // 准备参数对象
      let params = {
        goodscoding,
        goodsname,
        goodscategory,
        imgUrl,
        goodsdesc,
        goodsquantity,
      };
      let { code } = await arriveStore(params); // 发送添加货物的请求
      if (code === 0) {
        this.$router.push("/home/goodslist");
      }
    },

    // 上传图片成功的回调
    handleAvatarSuccess(res, file) {
      let { code, imgUrl } = res;
      if (code === 0) {
        this.arriveStoreForm.imgUrl = imgUrl;
      }
    },
    // 图片上传之前的处理函数
    beforeAvatarUpload(file) {
      const isPNG = file.type === "image/png";
      const isJPG = file.type === "image/jpeg";
      const isLt4M = file.size / 1024 / 1024 < 4;

      if (!(isPNG || isJPG)) {
        this.$message.error("上传头像图片只支持 JPG/PNG 格式!");
      }
      if (!isLt4M) {
        this.$message.error("请选择大小小于4MB的图片上传！");
      }
      return (isPNG || isJPG) && isLt4M;
    },
  },
};
</script>

<style lang="less">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.el-form-item__label {
  text-align: left;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
