<template>
  <div class="account-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>员工列表</span>
      </div>
      <div>
        <!-- 表格 -->
        <el-table
          @selection-change="handleSelectionChange"
          :data="tableData"
          ref="personalTable"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <!-- 选择框 -->
          <el-table-column type="selection" width="55"></el-table-column>

          <!-- ID -->
          <el-table-column
            prop="id"
            label="员工ID"
            width="160"
          ></el-table-column>
          <!-- 姓名 -->
          <el-table-column
            prop="personalname"
            label="员工姓名"
            width="160"
          ></el-table-column>

          <!-- 等级 -->
          <el-table-column
            prop="personalclass"
            label="员工等级"
            width="160"
          ></el-table-column>

          <!-- 入职时间 -->
          <el-table-column label="入职时间" width="200">
            <template slot-scope="scope">{{ scope.row.ctime }}</template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.row)"
                type="primary"
                >编辑</el-button
              >
              <el-button size="mini" @click="handleDel(scope.row)" type="danger"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <!-- 编辑的模态框 -->
        <el-dialog
          width="460px"
          title="员工编辑"
          :visible.sync="dialogFormVisible"
        >
          <!-- 表单 -->
          <el-form style="width: 337px;" :model="editForm">
            <!-- 名字 -->
            <el-form-item label="员工姓名" label-width="120px">
              <el-input
                v-model="editForm.personalname"
                autocomplete="off"
              ></el-input>
            </el-form-item>

            <!-- 员工等级 -->
            <el-form-item item label="员工等级" label-width="120px">
              <el-select
                v-model="editForm.personalclass"
                placeholder="请选择员工等级"
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
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveEdit">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 分页 -->
        <div style="margin-top: 20px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[1, 3, 5, 10, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>

        <!-- 批量删除 & 取消选择 -->
        <div style="margin-top: 20px;">
          <el-button @click="batchDel" size="small" type="danger"
            >批量删除</el-button
          >
          <el-button @click="cancelSelect" size="small" type="primary"
            >取消选择</el-button
          >
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入时间处理模块
import moment from "moment";

// 引入请求函数
import {
  getPersonalList,
  delPersonal,
  batchdel,
  editPersonal,
} from "@/api/personal";

export default {
  data() {
    return {
      // 表格数据
      tableData: [],
      total: 0, // 数据总条数
      currentPage: 1, // 当前页
      pageSize: 3, // 每页条数
      ids: [], // 被选中的数据的id们
      // 编辑表单数据
      editForm: {
        personalname: "",
        personalclass: "",
      },
      dialogFormVisible: false, // 控制编辑模态框的显示和隐藏
    };
  },
  methods: {
    // 取消选择
    cancelSelect() {
      this.$refs.personalTable.clearSelection();
    },
    // 请求员工列表
    async getPersonalList() {
      // 请求账号列表
      let { total, data } = await getPersonalList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      });
      // 如果当前页没有数据 且 当前页码不是第一页
      if (!data.length && this.currentPage !== 1) {
        this.currentPage -= 1; // 当前页码减去1
        this.getPersonalList(); // 再次请求数据
      }
      // 对时间形成格式化处理
      data.forEach(
        (v) => (v.ctime = moment(v.ctime).format("YYYY-MM-DD hh:mm:ss"))
      );

      // 赋值
      this.total = total;
      this.tableData = data;
    },
    // 每页条数改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPersonalList();
    },
    // 当前页码改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPersonalList();
    },
    // 删除
    handleDel(row) {
      this.$confirm("你确定要删除吗?删除后无法恢复", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        // 确定
        .then(async () => {
          let { code } = await delPersonal({ id: row.id }); // 发送删除请求
          // 成功
          if (code === 0) {
            // 刷新列表（重新请求列表数据）
            this.getPersonalList();
          }
        })
        // 取消
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 当选中状态改变
    handleSelectionChange(rows) {
      this.ids = rows.map((row) => row.id);
    },
    // 批量删除
    batchDel() {
      // 如果用户没有选中任何数据 不需要发送请求

      if (!this.ids.length) {
        this.$message.error("请选择以后再操作");
        return;
      }

      this.$confirm("你确定要删除吗？删除后无法恢复！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 发送请求 把选中的id数组发送给后端
          let { code } = await batchdel({ ids: JSON.stringify(this.ids) });
          if (code === 0) {
            this.getPersonalList(); // 刷新列表
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 编辑
    handleEdit(row) {
      // this.editForm = Object.assign({}, row);
      this.editForm = { ...row }; // 赋值给编辑表单 回填数据
      // 显示模态框
      this.dialogFormVisible = true;
    },
    // 确定修改
    async saveEdit() {
      this.dialogFormVisible = false; // 隐藏模态框
      // 结构出参数
      let { id, personalname, personalclass } = this.editForm;
      let { code } = await editPersonal({ id, personalname, personalclass });
      // 成功
      if (code === 0) {
        // 刷新列表
        this.getPersonalList();
      }
    },
  },
  created() {
    this.getPersonalList(); // 进入页面 自动调用请求账号列表接口
  },
};
</script>

<style lang="less" scoped>
.el-button {
  margin-left: 0;
  margin-right: 10px;
}
</style>
