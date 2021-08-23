<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="6">
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
      </el-row>
      <el-table :data="dataArray" border stripe>
        <el-table-column type="index" label="#" :index="indexMethod">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格(元)" width="120">
        </el-table-column>
        <el-table-column label="是否付款" width="100">
          <template v-slot="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'"
              >未付款
            </el-tag>
            <el-tag type="success" v-else>已付款 </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100">
        </el-table-column>
        <el-table-column label="下单时间" width="180">
          <template v-slot="scope">
            {{ (scope.row.create_time * 1000) | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="editOrder(scope.row)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="small"
              @click="wuliuInfo(scope.row)"
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

    <el-dialog
      title="修改地址"
      :visible.sync="editAddressDialog"
      width="50%"
      @close="editAddressDialogClose"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-input v-model="addressForm.address1"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddressDialog = false">取 消</el-button>
        <el-button type="primary" @click="editAddressDialog = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog title="物流信息" :visible.sync="wuliuDialog" width="50%">
    </el-dialog>
  </div>
</template>

<script>
import api from '../../net_work/api'
export default {
  data() {
    return {
      queryInfo: { query: '', pagenum: 1, pagesize: 10 },
      totalNum: 0,
      dataArray: [''],
      editAddressDialog: false,
      wuliuDialog: false,
      addressForm: { address1: '', address2: '' },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' },
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.$http.get(api.order, { params: this.queryInfo }).then(
        (res) => {
          this.dataArray = res.data.data.goods
          this.totalNum = res.data.data.total
        },
        (err) => {}
      )
    },
    indexMethod(index) {
      return (this.queryInfo.pagenum - 1) * this.queryInfo.pagesize + index + 1
    },
    handleSizeChange(size) {
      this.queryInfo.pagesize = size
      this.loadData()
    },
    handleCurrentChange(page) {
      this.queryInfo.pagenum = page
      this.loadData()
    },
    editOrder(order) {
      this.editAddressDialog = true
    },
    wuliuInfo() {
      this.wuliuDialog = true
      this.$http.get(api.wuliu('804909574412544580')).then(
        (res) => {
          console.log(res)
        },
        (err) => {
          console.log(err)
        }
      )
    },
    editAddressDialogClose() {
      this.$refs.addressFormRef.resetFields()
    },
  },
}
</script>

<style lang="less" scoped>
.el-table {
  margin: 20px 0;
}
</style>