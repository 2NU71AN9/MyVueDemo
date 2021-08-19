<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="警告提示的文案"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row class="cate-row">
        <el-col>
          <span>选择商品分类: </span>
          <el-cascader
            v-model="selectCates"
            :options="cateArray"
            :props="{
              expandTrigger: 'hover',
              label: 'cat_name',
              value: 'cat_id',
            }"
            clearable
            @change="cateChanged"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" @click="addParam" :disabled="isBtnDisabled"
            >添加参数</el-button
          >
          <el-table :data="paramArray" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(val, index) in scope.row.attr_vals"
                  :key="index"
                  closable=""
                  >{{ val }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="handlerEdit(scope.row)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  @click="handlerDelete(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" @click="addParam" :disabled="isBtnDisabled"
            >添加属性</el-button
          >
          <el-table :data="paramArray" border stripe>
            <el-table-column type="expand"> </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="handlerEdit(scope.row)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  @click="handlerDelete(scope.row.id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      :title="
        (isAddParam ? '添加' : '修改') + (isMany ? '动态参数' : '静态属性')
      "
      :visible.sync="editParamDialog"
      width="50%"
      @close="editParamDialogClose"
    >
      <el-form
        :model="addParamForm"
        :rules="addParamFormRules"
        ref="addParamFormRef"
      >
        <el-form-item
          :label="isMany ? '参数名' : '属性名'"
          prop="attr_name"
          label-width="70px"
        >
          <el-input v-model="addParamForm.attr_name"> </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamDialog = false">取 消</el-button>
        <el-button type="primary" @click="editParamAction">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../net_work/api'
export default {
  data() {
    return {
      editParamDialog: false,
      cateArray: [],
      selectCates: [],
      activeName: 'many',
      paramArray: [],
      isAddParam: true,
      editParam: {},
      addParamForm: {
        attr_name: '',
      },
      addParamFormRules: {
        attr_name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur',
          },
        ],
      },
      inputVisible: false,
      inputValue: '',
    }
  },
  created() {
    this.loadCates()
  },
  methods: {
    loadCates() {
      this.$http.get(api.cates).then(
        (res) => {
          this.cateArray = res.data.data
        },
        (err) => {}
      )
    },
    loadParams() {
      if (this.selectCates.length != 3) return
      this.$http
        .get(api.params(this.cateId), { params: { sel: this.activeName } })
        .then(
          (res) => {
            res.data.data.forEach((item) => {
              item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            })
            this.paramArray = res.data.data
          },
          (err) => {}
        )
    },
    cateChanged() {
      if (this.selectCates.length != 3) return (this.selectCates = [])
      this.loadParams()
    },
    tabClick() {
      this.loadParams()
    },

    addParam() {
      this.isAddParam = true
      this.editParamDialog = true
    },
    editParamDialogClose() {
      this.$refs.addParamFormRef.resetFields()
      this.editParam = {}
      this.addParamForm.attr_name = ''
    },
    editParamAction() {
      this.$refs.addParamFormRef.validate((valid) => {
        if (!valid) return
        if (this.isAddParam) {
          this.$http
            .post(api.addParam(this.selectCates[2]), {
              attr_name: this.addParamForm.attr_name,
              attr_sel: this.activeName,
            })
            .then(
              (res) => {
                this.editParamDialog = false
                this.$message.success('添加成功')
                this.loadParams()
              },
              (error) => {}
            )
        } else {
          this.$http
            .put(api.editParam(this.selectCates[2], this.editParam.attr_id), {
              attr_name: this.addParamForm.attr_name,
              attr_sel: this.activeName,
            })
            .then(
              (res) => {
                console.log(res)
                this.editParamDialog = false
                this.$message.success('修改成功')
                this.loadParams()
              },
              (error) => {}
            )
        }
      })
    },
    handlerEdit(param) {
      this.isAddParam = false
      this.editParam = { ...param }
      this.addParamForm.attr_name = this.editParam.attr_name
      this.editParamDialog = true
    },
    handlerDelete(param) {
      this.$http.delete(api.editParam(this.selectCates[2], param.attr_id)).then(
        (res) => {
          this.$message.success('删除成功')
          this.loadParams()
        },
        (error) => {}
      )
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
      }
      this.inputVisible = false
      this.inputValue = ''
    },
  },
  computed: {
    isBtnDisabled() {
      return this.selectCates.length != 3
    },
    cateId() {
      return this.selectCates.length === 3 ? this.selectCates[2] : null
    },
    /// 是否是动态参数
    isMany() {
      return this.activeName === 'many'
    },
  },
}
</script>

<style lang="less" scoped>
.cate-row {
  margin: 15px 0;
  span {
    font-size: 15px;
  }
}
.el-tag {
  margin: 10px;
}
</style>