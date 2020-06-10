<template>
  <div class="index">
    <div style="height:'80px'">
      <h1>仓库数据统计</h1>
    </div>
    <div id="myChart" :style="{ width: '100%', height: '80%' }"></div>
  </div>
</template>

<script>
// 引入时间处理模块
import moment from "moment";
import echarts from "echarts";
import { getArriveStoreInfo, getLeaveStoreInfo } from "@/api/store";

export default {
  methods: {
    // 画线
    drawLine(date, leaveData, arriveData) {
      // 初始化dom
      var salesCharts = echarts.init(document.getElementById("myChart"));
      // 准备配置
      var option = {
        title: {
          text: "出入库统计",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["出库数", "入库数"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: date,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "入库",
            type: "line",
            data: arriveData,
          },
          {
            name: "出库",
            type: "line",
            data: leaveData,
          },
        ],
      };
      // 生成报表
      salesCharts.setOption(option);
    },
    // 获取数据画图
    async getData() {
      // 这是后端数据 直
      let { arrivedata } = await getArriveStoreInfo();
      let { leavedata } = await getLeaveStoreInfo();
      // 处理
      // 循环后端返回的数据 对时间形成格式化处理
      arrivedata.forEach(
        (v) => (v.ctime = moment(v.ctime).format("YYYY-MM-DD hh:mm:ss"))
      );
      leavedata.forEach(
        (v) => (v.ctime = moment(v.ctime).format("YYYY-MM-DD hh:mm:ss"))
      );
      let date = [];
      let leaveData = [];
      for (var i of leavedata) {
        date.push(i.ctime);
        leaveData.push(i.leavequantity);
      }
      let arriveData = [];
      for (var i of arrivedata) {
        arriveData.push(i.goodsquantity);
      }

      this.drawLine(date, leaveData, arriveData);
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style lang="less" scoped>
.index {
  height: 100%;
}
</style>
