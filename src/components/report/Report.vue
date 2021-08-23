<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width: 700px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import _ from 'lodash'
import api from '../../net_work/api'
export default {
  data() {
    return {}
  },
  mounted() {
    var myChart = echarts.init(document.getElementById('main'))
    this.$http.get(api.charts).then(
      (res) => {
        // const result = _.merge(res.data.data, this.originOption)
        myChart.setOption(res.data.data)
      },
      (err) => {}
    )
  },
  methods: {},
}
</script>

<style lang="less" scoped>
</style>