<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="loadData"
          >
            <el-button slot="append" icon="el-icon-search" @click="loadData">
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods"> 添加商品 </el-button>
        </el-col>
      </el-row>

      <el-table :data="dataArray" border stripe>
        <el-table-column type="index" label="#" :index="indexMethod">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="170">
          <template v-slot="scope">
            {{ (scope.row.add_time * 1000) | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="editGoods(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteGoods(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import api from '../../net_work/api'
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      totalNum: 0,
      dataArray: []
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      this.$http.get(api.goodsList, { params: this.queryInfo }).then(
        (res) => {
          this.dataArray = res.data.data.goods
          this.totalNum = res.data.data.total
        },
        (err) => {}
      )
    },
    indexMethod (index) {
      return (this.queryInfo.pagenum - 1) * this.queryInfo.pagesize + index + 1
    },
    handleSizeChange (size) {
      this.queryInfo.pagesize = size
      this.loadData()
    },
    handleCurrentChange (page) {
      this.queryInfo.pagenum = page
      this.loadData()
    },
    addGoods () {
      this.$router.push('/goods/add')
    },
    editGoods (goods) {},
    deleteGoods (goods) {
      this.$http.delete(api.deleteGoods(goods.goods_id)).then(
        (res) => {
          this.$message.success('删除成功')
          this.loadData()
        },
        (err) => {}
      )
    }
  }
}
</script>

<style lang="less" scoped>
.el-pagination {
  margin-top: 20px;
}
</style>
