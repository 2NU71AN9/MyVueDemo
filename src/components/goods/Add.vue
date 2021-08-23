<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>

      <el-steps :active="active - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addGoodsForm"
        :rules="addGoodsFormRules"
        ref="addGoodsFormRef"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="active"
          :before-leave="beforeLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addGoodsForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addGoodsForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addGoodsForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="cateArray"
                :props="{
                  expandTrigger: 'hover',
                  label: 'cat_name',
                  value: 'cat_id',
                }"
                clearable
                @change="cateChanged"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTabData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="val in item.attr_vals"
                  :key="val"
                  :label="val"
                  border
                  >{{ val }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTabData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              class="editor"
              ref="quillEditorRef"
              v-model="addGoodsForm.introduce"
              :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @ready="onEditorReady($event)"
            >
            </quill-editor>
            <el-button type="primary" @click="addGoodsAction"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import api from '../../net_work/api'
import _ from 'lodash'
export default {
  data() {
    return {
      active: '0',
      addGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        cat_id: null,
        goods_cat: [],
        introduce: '',
        attrs: [],
      },
      manyTabData: [],
      onlyTabData: [],

      editorOption: {
        theme: 'snow',
      },
      cateArray: [],
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
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
    cateChanged() {
      if (this.addGoodsForm.goods_cat.length != 3) {
        this.addGoodsForm.goods_cat = []
        this.addGoodsForm.cat_id = null
        return
      }
      this.addGoodsForm.cat_id = this.addGoodsForm.goods_cat[2]
    },
    beforeLeave(newTab, oldTab) {
      if (oldTab === '0' && this.addGoodsForm.goods_cat.length != 3) {
        this.$message.error('请先选择分类')
        return false
      }
      return true
    },
    tabClick() {
      if (this.active == '1') {
        this.$http
          .get(api.params(this.addGoodsForm.cat_id), {
            params: { sel: 'many' },
          })
          .then(
            (res) => {
              res.data.data.forEach((item) => {
                item.attr_vals =
                  item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
              })
              this.manyTabData = res.data.data
            },
            (err) => {}
          )
      } else if (this.active == '2') {
        this.$http
          .get(api.params(this.addGoodsForm.cat_id), {
            params: { sel: 'only' },
          })
          .then(
            (res) => {
              this.onlyTabData = res.data.data
            },
            (err) => {}
          )
      }
    },
    // 图片预览
    handlePreview() {},
    // 图片删除
    handleRemove() {},
    onEditorBlur(quill) {},
    onEditorFocus(quill) {},
    onEditorReady(quill) {},
    // 添加商品
    addGoodsAction() {
      this.addGoodsForm.attrs = []
      this.$refs.addGoodsFormRef.validate((valid) => {
        if (!valid) {
          return this.$message.error('请补全信息')
        }
        const form = _.cloneDeep(this.addGoodsForm)
        form.goods_cat = form.goods_cat.join(',')
        this.manyTabData.forEach((item) => {
          this.addGoodsForm.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          })
        })
        this.onlyTabData.forEach((item) => {
          this.addGoodsForm.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          })
        })
        form.attrs = this.addGoodsForm.attrs
        this.$http.post(api.goodsList, form).then(
          (res) => {
            this.$message.success('添加成功')
            this.$router.push('/goods')
          },
          (err) => {}
        )
      })
    },
  },
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 20px 0;
}
.editor {
  height: 300px;
  margin-bottom: 60px;
}
</style>
