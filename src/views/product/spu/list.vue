<template>
  <div>
    <Category @spuList="getSpuList" />
    <el-card>
      <el-button
        :disabled="!category3Id"
        type="primary"
        icon="el-icon-plus"
        style="margin-bottom:20px"
        @click="trademarkAndBaseSaleList"
      >添加SPU</el-button>
      <el-table v-show="isShow" style="width: 100%" border :data="spuList">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column label="SPU名称" prop="spuName" />
        <el-table-column label="SPU描述" prop="description" />

        <el-table-column label="操作">
          <el-button size="mini" icon="el-icon-plus" type="primary" />
          <el-button size="mini" icon="el-icon-edit" type="primary" />
          <el-button size="mini" icon="el-icon-info" type="info" />
          <el-button size="mini" icon="el-icon-delete" type="danger" />
        </el-table-column>
      </el-table>
      <el-pagination
        v-show="isShow"
        :current-page.sync="currentPage"
        :page-sizes="[1, 3]"
        :page-size.sync="pageSize"
        layout="prev, pager, next, jumper,sizes,total"
        :total="total"
        class="trademark-pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <!-- Form表单 -->
      <el-form
        v-show="!isShow"
        ref="spuForm"
        :model="spuForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="SPU名称" prop="spuName">
          <el-input v-model="spuForm.spuName" placeholder="SPU名称" />
        </el-form-item>
        <el-form-item label="品牌" prop="tradeMarkId">
          <template v-slot="scope">
            <el-select
              v-model="spuForm.tradeMarkId"
              placeholder="请选择品牌"
              @change="selectTradeMark(scope.row)"
            >
              <el-option
                v-for="tradeMark in tradeMarkList"
                :key="tradeMark.id"
                :label="tradeMark.tmName"
                :value="tradeMark.id"
              />
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="spu描述" prop="description">
          <el-input
            v-model="spuForm.description"
            type="textarea"
            :rows="2"
            placeholder="SPU描述"
          />
        </el-form-item>
        <el-form-item label="spu图片" prop="spuImg">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <img
              v-show="spuForm.spuImg"
              width="100%"
              :src="spuForm.spuImg"
              alt="spuImg"
            >
            <i v-show="!spuForm.spuImg" class="el-icon-plus" />
          </el-upload>
        </el-form-item>
        <el-form-item label="销售属性" prop="baseSaleAttr">
          <el-select
            v-model="spuForm.baseSaleAttr"
            :placeholder="`还有${baseSaleAttrList.length}个未选择`"
            @change="setBaseSale"
          >
            <el-option
              v-for="baseSaleAttr in baseSaleAttrList"
              :key="baseSaleAttr.id"
              :label="baseSaleAttr.name"
              :value="baseSaleAttr.id"
            />
          </el-select>
          <el-button
            type="primary"
            icon="el-icon-plus"
            :disabled="!isShowSaleBtn"
          >添加销售属性</el-button>
          <el-table style="width: 100%;margin-top:20px" border>
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column label="属性名" width="150" />
            <el-table-column label="属性值名列表" />
            <el-table-column label="操作" width="300" />
          </el-table>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Category from '@/components/Category'
export default {
  name: 'SpuList',
  components: {
    Category
  },
  data() {
    return {
      category3Id: '',
      currentPage: 1,
      pageSize: 3,
      total: 0,
      spuList: [],
      tradeMarkList: [],
      baseSaleAttrList: [],
      isShow: true,
      isShowSaleBtn: false,
      spuForm: {
        spuName: '',
        description: '',
        tradeMarkId: '',
        spuImg: '',
        dialogVisible: true,
        baseSaleAttr: ''
      },
      rules: {
        spuName: [
          { required: true, message: '请输入SPU名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入SPU描述', trigger: 'blur' }
        ],
        tradeMarkVal: [
          { required: true, message: '请选择SPU品牌', trigger: 'change' }
        ],
        spuImg: [{ required: true, message: '请上传图相关图片' }],
        saleAttr: [
          { required: true, message: '请选择销售属性', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 设置销售属性列表
    setBaseSale() {
      this.isShowSaleBtn = true
    },
    // 获取品牌或销售属性列表
    async getTradeOrBaseSaleList(fnName) {
      const res = await this.$API.spu[`${fnName}`]()
      if (res.code === 200) {
        if (fnName === 'getBaseSaleAttrList') {
          this.baseSaleAttrList = res.data
        } else if (fnName === 'getTradeMarkList') {
          this.tradeMarkList = res.data
        }
      } else {
        this.$message.error('获取品牌或销售列表失败')
      }
    },
    // 获取品牌列表和销售属性列表
    async trademarkAndBaseSaleList() {
      this.getTradeOrBaseSaleList('getBaseSaleAttrList')
      this.getTradeOrBaseSaleList('getTradeMarkList')
      this.isShow = false
    },
    selectTradeMark(row) {
      console.log(row)
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.get_SpuList(this.category3Id)
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      // console.log(this.currentPage)
      this.get_SpuList(this.category3Id)
    },
    handlePictureCardPreview() {
      console.log(1)
    },
    handleRemove() {
      console.log(2)
    },
    async get_SpuList(category3Id) {
      const res = await this.$API.spu.getSpuList(
        this.currentPage,
        this.pageSize,
        category3Id
      )
      if (res.code === 200) {
        this.$message.success('获取spu列表成功')
        this.spuList = res.data.records
        this.total = res.data.total
      } else {
        this.$message.error('获取spu列表失败')
      }
    },
    getSpuList(category3Id) {
      this.category3Id = category3Id
      this.get_SpuList(this.category3Id)
    }
  }
}
</script>
<style lang="sass" scoped>
.trademark-pagination
  text-align: right
>>>.el-pagination__sizes
  margin-left: 331px
>>>.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden
  &:hover
    border-color: #409EFF

>>>.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center

>>>.avatar
  width: 178px
  height: 178px
  display: block
</style>
