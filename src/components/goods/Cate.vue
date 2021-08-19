<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addCate">添加分类</el-button>
      <tree-table
        class="table"
        :data="dataArray"
        :columns="columns"
        show-index
        index-text="#"
        border
        :selection-type="false"
        :expand-type="false"
      >
        <template slot="isOK" scope="scope">
          <i
            class="el-icon-success"
            v-if="!scope.row.cat_deleted"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="sort" scope="scope">
          <el-tag v-if="scope.row.cat_level === 0"> 一级 </el-tag>
          <el-tag v-if="scope.row.cat_level === 1" type="success">
            二级
          </el-tag>
          <el-tag v-if="scope.row.cat_level === 2" type="warning">
            三级
          </el-tag>
        </template>
        <template slot="caozuo" scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="handlerEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="handlerDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialog"
      width="50%"
      @close="addCateDialogClose"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
      >
        <el-form-item label="分类名称" prop="cat_name" label-width="80px">
          <el-input v-model="addCateForm.cat_name"> </el-input>
        </el-form-item>
        <el-form-item label="父级分类" label-width="80px">
          <el-cascader
            style="width: 100%"
            v-model="selectParentCates"
            :options="parentCates"
            :props="{
              expandTrigger: 'hover',
              label: 'cat_name',
              value: 'cat_id',
              checkStrictly: 'true',
            }"
            clearable
            @change="parentCateChanged"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCateAction">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../net_work/api'
export default {
  data() {
    return {
      addCateDialog: false,
      queryInfo: {
        pagenum: 1,
        pagesize: 5,
      },
      totalNum: 0,
      dataArray: [''],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isOK',
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'sort',
        },
        {
          label: '操作',
          width: '185px',
          type: 'template',
          template: 'caozuo',
        },
      ],
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0,
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            min: 4,
            max: 20,
            message: '长度在 4 到 20 个字符',
            trigger: 'blur',
          },
        ],
      },
      parentCates: [],
      selectParentCates: [],
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    handleSizeChange(size) {
      this.queryInfo.pagesize = size
      this.loadData()
    },
    handleCurrentChange(page) {
      this.queryInfo.pagenum = page
      this.loadData()
    },
    loadData() {
      this.$http.get(api.cates, { params: this.queryInfo }).then(
        (res) => {
          this.dataArray = res.data.data.result
          this.totalNum = res.data.data.total
        },
        (err) => {}
      )
    },
    // 获取父级分类
    getParentCate() {
      this.$http.get(api.cates, { params: { type: 2 } }).then(
        (res) => {
          this.parentCates = res.data.data
        },
        (err) => {}
      )
    },
    // 添加分类
    addCate() {
      this.getParentCate()
      this.addCateDialog = true
    },
    // 编辑
    handlerEdit() {},
    // 删除
    handlerDelete() {},
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields()
      this.selectParentCates = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    addCateAction() {
      this.$refs.addCateFormRef.validate((valid) => {
        if (!valid) return
        this.$http.post(api.addCate, this.addCateForm).then(
          (res) => {
            this.addCateDialog = false
            this.$message.success('分类添加成功')
            this.loadData()
          },
          (error) => {}
        )
      })
    },
    parentCateChanged() {
      if (this.selectParentCates.length > 0) {
        this.addCateForm.cat_pid =
          this.selectParentCates[this.selectParentCates.length - 1]
      } else {
        this.addCateForm.cat_pid = 0
      }
      this.addCateForm.cat_level = this.selectParentCates.length
    },
  },
}
</script>

<style lang="less" scoped>
.table {
  margin: 20px 0;
}
</style>