<template>
  <div class="goods-manage">
    <el-form
      style="margin-bottom: 20px;"
      size="small"
      :inline="true"
      :model="searchForm"
      class="demo-form-inline"
    >
      <!-- 货物码 -->
      <el-form-item label="货物码">
        <el-input
          v-model="searchForm.goodsCoding"
          placeholder="货物码"
        ></el-input>
      </el-form-item>

      <!-- 货物名称 -->
      <el-form-item label="货物名称">
        <el-input
          v-model="searchForm.goodsName"
          placeholder="货物名称"
        ></el-input>
      </el-form-item>

      <!-- 清除按钮和查询按钮 -->
      <el-form-item style="margin-left: 30px;">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="clear">清除</el-button>
      </el-form-item>
    </el-form>
    <el-divider></el-divider>

    <el-table :data="tableData" style="width: 100%">
      <!-- 下拉框 可以展开 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="货物ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="货物码">
              <span>{{ props.row.goodscoding }}</span>
            </el-form-item>
            <el-form-item label="货物图片">
              <span>
                <img
                  width="100"
                  height="100"
                  style="border-radius: 4px"
                  :src="serveApi + props.row.imgUrl"
                />
              </span>
            </el-form-item>
            <el-form-item label="货物名称">
              <span>{{ props.row.goodsname }}</span>
            </el-form-item>
            <el-form-item label="货物分类">
              <span>{{ props.row.goodscategory }}</span>
            </el-form-item>

            <el-form-item label="货物描述">
              <span>{{ props.row.goodsdesc }}</span>
            </el-form-item>
            <el-form-item label="货物数量">
              <span>{{ props.row.goodsquantity }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <!-- 详情 -->
      <el-table-column label="货物 ID" prop="id"></el-table-column>
      <el-table-column label="货物码" prop="goodscoding"></el-table-column>
      <el-table-column label="货物名称" prop="goodsname"></el-table-column>
      <el-table-column label="描述" prop="goodsdesc"></el-table-column>
      <el-table-column label="库存数量" prop="goodsquantity"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDel(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div style="margin-top: 20px; padding: 10px;">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        layout="total, prev, pager, next, jumper"
        :page-size="pageSize"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getGoodsList, goodsDel } from "@/api/store";

export default {
  data() {
    return {
      serveApi: "http://127.0.0.1:5000/upload/goods/",
      // 搜索表格
      searchForm: {
        goodsCoding: "",
        goodsName: "",
      },
      // 表格数据
      currentPage: 1,
      total: 0,
      pageSize: 5,
      tableData: [],
    };
  },
  methods: {
    // 查询
    search() {
      this.currentPage = 1;
      this.getGoods(); // 调用获取列表函数
    },
    // 清除
    clear() {
      // 清空整个搜索表单
      this.searchForm = {
        goodsCoding: "",
        goodsName: "",
      };
      // 请求所有数据
      this.getGoods();
    },
    // 当前页码改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getGoods();
    },

    // 获取货物列表
    async getGoods() {
      // 参数
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        goodsCoding: this.searchForm.goodsCoding,
        goodsName: this.searchForm.goodsName,
      };
      // 发送获取货物列表的请求
      let { total, data } = await getGoodsList(params);

      // 赋值渲染
      this.total = total;
      // 数据
      this.tableData = data;
      // console.log(data);
    },
    // 编辑货物
    handleEdit(row) {
      // 把要编辑的货物出存入会话存储
      window.sessionStorage.setItem("goods", JSON.stringify(row));
      // 跳转到货物编辑页面
      this.$router.push("/home/goodsedit");
    },
    // 删除
    handleDel(row) {
      this.$confirm("你确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        // 确定
        .then(async () => {
          let { code, msg } = await goodsDel({ id: row.id }); // 发送删除请求
          // 成功
          if (code === 0) {
            // 刷新列表（重新请求列表数据）
            this.getGoods();
          }
          // 失败，响应拦截
        })
        // 取消
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  created() {
    this.getGoods();
  },
};
</script>

<style lang="less" scoped>
.goods-manage {
  width: 100%;
  height: 100%;
  .el-form {
    padding-top: 20px;
  }
  background-color: #ffffff;
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
    .el-form-item__content {
      span {
        color: brown;
        text-decoration: underline;
      }
    }
  }
  .el-button {
    margin: 0;
    margin-right: 10px;
  }
}
</style>
