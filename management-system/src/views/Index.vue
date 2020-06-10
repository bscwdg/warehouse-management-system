<template>
  <div class="index">
    <div id="myChart" :style="{ width: '100%', height: '80%' }"></div>
  </div>
</template>

<script>
// 引入时间处理模块
import moment from "moment";
import echarts from "echarts";

export default {
  methods: {
    // 画线
    drawLine(xArr, data) {
      // 初始化dom
      var salesCharts = echarts.init(document.getElementById("myChart"));
      // 准备配置
      var option = {
        title: {
          text: "系统使用详情",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["管理员数量", "系统访问量"],
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
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "管理员上线数量",
            type: "line",
            stack: "总量",
            data: [30, 10, 21, 5, 25, 10, 19],
          },
          {
            name: "访问系统量",
            type: "line",
            stack: "总量",
            data: [230, 105, 151, 68, 179, 99, 165],
          },
        ],
      };
      // 生成报表
      salesCharts.setOption(option);
    },
  },
  mounted() {
    this.drawLine();
  },
};
</script>

<style lang="less" scoped>
.index {
  height: 100%;
}
</style>
