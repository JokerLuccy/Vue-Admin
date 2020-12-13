<template>
  <div>
    <Category @spuList="getSpuList" />
    <el-card v-show="isShow">
      <el-button
        :disabled="!category3Id"
        type="primary"
        icon="el-icon-plus"
        style="margin-bottom:20px"
        @click="trademarkAndBaseSaleList"
      >添加SPU</el-button>
      <el-table style="width: 100%" border :data="spuList">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column label="SPU名称" prop="spuName" />
        <el-table-column label="SPU描述" prop="description" />

        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button size="mini" icon="el-icon-plus" type="primary" />
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="modifySpu(scope.row)"
            />
            <el-button size="mini" icon="el-icon-info" type="info" />
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="delSingleSpu(scope.row)"
            />
          </template>
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
    </el-card>
    <el-card v-show="!isShow">
      <el-form
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
          <el-select v-model="spuForm.tradeMarkId" placeholder="请选择品牌">
            <el-option
              v-for="tradeMark in tradeMarkList"
              :key="tradeMark.id"
              :label="tradeMark.tmName"
              :value="tradeMark.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="spu描述" prop="description">
          <el-input
            v-model="spuForm.description"
            type="textarea"
            :rows="2"
            placeholder="SPU描述"
          />
        </el-form-item>
        <el-form-item label="spu图片">
          <el-upload
            :action="`${$BASE_API}/admin/product/fileUpload`"
            list-type="picture-card"
            :file-list="spuForm.spuImgList"
            :on-preview="handlePictureCardPreview"
            :on-success="handleAvatarSuccess"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus" />
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="spuImg">
            </el-dialog>
          </el-upload>
        </el-form-item>
        <el-form-item label="销售属性" prop="baseSaleAttr">
          <el-select
            v-model="spuForm.baseSaleAttr"
            :placeholder="
              baseSaleAttrList.length
                ? `还有${baseSaleAttrList.length}个未选择`
                : '没有了'
            "
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
            @click="addAttr(spuForm.baseSaleAttr)"
          >添加销售属性</el-button>
          <el-table
            style="width: 100%;margin-top:20px"
            border
            :data="addSaleAttr"
          >
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column label="属性名" width="150" prop="saleAttrName" />
            <el-table-column label="属性值名列表">
              <template v-slot="scope">
                <el-tag
                  v-for="tag in scope.row.spuSaleAttrValueList"
                  :key="tag.id"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(scope.row, tag.id)"
                >
                  {{ tag.saleAttrValueName }}
                </el-tag>
                <el-input
                  v-if="scope.row.edit"
                  ref="input"
                  v-model.trim="scope.row.spuTagName"
                  placeholder="名称"
                  @blur="addToTagList(scope.row, scope.$index)"
                  @keyup.enter.native="addToTagList(scope.row, scope.$index)"
                />

                <el-button
                  v-else
                  size="mini"
                  @click="addSpuAttrValue(scope.row)"
                >+添加</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
              <template v-slot="scope">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="delSelectedAttr(scope.$index)"
                />
              </template>
            </el-table-column>
          </el-table>
          <el-button
            type="primary"
            style="margin-top:20px"
            @click="saveSpuInfo"
          >保存</el-button>
          <el-button
            style="margin-top:20px"
            @click="isShow = true"
          >取消</el-button>
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
      addSaleAttr: [],
      isShow: true,
      isShowSaleBtn: false,
      dialogImageUrl: '',
      dialogVisible: false,
      spuForm: {
        spuName: '',
        description: '',
        tradeMarkId: '',
        spuImgList: [],
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
    // 修改单行SPU
    async modifySpu(row) {
      const res = await this.$API.spu.getSpuById(row.id)
      const imgList = await this.$API.spu.getSpuImageList(row.id)

      if (res.code === 200) {
        this.spuForm.spuName = res.data.spuName
        this.spuForm.description = res.data.description
        this.spuForm.tradeMarkId = res.data.tmId
        this.spuForm.spuImgList = []
        imgList.data.forEach(item => {
          this.spuForm.spuImgList.push({
            name: item.imgName,
            url: item.imgUrl
          })
        })
        this.addSaleAttr = res.data.spuSaleAttrList
        this.trademarkAndBaseSaleList(this.addSaleAttr)
        this.isShow = false
      } else {
        this.$message.error('获取单行SPU数据失败')
      }
    },
    // 删除单行SPU
    async delSingleSpu(row) {
      await this.$API.spu.delSingleSpu(row.id)
      await this.getSpuList(this.category3Id)
    },
    // 保存数据
    async saveSpuInfo() {
      const spuImageList = []
      const spuSaleAttrList = []
      const { addSaleAttr, category3Id, $message } = this
      const { spuImgList, spuName, description, tradeMarkId } = this.spuForm
      spuImgList.forEach(item => {
        spuImageList.push({
          imgName: item.name,
          imgUrl: item.response.data
        })
      })
      // 修正id
      addSaleAttr.forEach(item => {
        item.spuTagList.forEach(i => (i.baseSaleAttrId = item.id))
        spuSaleAttrList.push({
          baseSaleAttrId: item.id,
          saleAttrName: item.name,
          spuSaleAttrValueList: item.spuTagList
        })
      })
      const data = {
        category3Id,
        spuName,
        description,
        spuImageList,
        tmId: tradeMarkId,
        spuSaleAttrList
      }
      const res = await this.$API.spu.saveSpuInfo(data)
      res.code === 200 ? (this.isShow = true) : $message.error('保存失败')
      await this.getSpuList(category3Id)
    },
    // 移除图片
    handleRemove(file, fileList) {
      this.spuForm.spuImgList = {
        ...fileList
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 图片上传成功
    handleAvatarSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.spuForm.spuImgList = fileList
      } else {
        this.$message.error('图片上传失败')
      }
    },
    // 移除标签
    handleClose(row, id) {
      const { spuSaleAttrValueList } = row

      spuSaleAttrValueList.splice(spuSaleAttrValueList.indexOf(id), 1)
    },
    // 把新增的Tag标签添加到对应数组中
    addToTagList(row, index) {
      const { spuTagName, spuSaleAttrValueList } = row
      const tagMes = {
        saleAttrValueName: spuTagName,
        baseSaleAttrId: index
      }
      // 如果没有输入，则不添加到数组中
      if (!spuTagName) {
        row.edit = false
        return
      }
      spuSaleAttrValueList.push(tagMes)
      row.spuTagName = ''
      row.edit = false
    },
    addSpuAttrValue(row) {
      this.$set(row, 'edit', true)
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    // 删除添加的销售属性
    delSelectedAttr(index) {
      this.addSaleAttr.splice(index, 1)
    },
    // 将选中过的属性添加到table中
    addAttr(id) {
      const res = this.baseSaleAttrList.find(item => item.id === id)

      // 添加保存Tag的数组
      this.$set(res, 'spuSaleAttrValueList', [])
      this.$set(res, 'spuTagName', '')
      this.$set(res, 'saleAttrName', '')
      res.saleAttrName = res.name

      this.addSaleAttr.push(res)
      this.baseSaleAttrList = this.baseSaleAttrList.filter(
        item => item.id !== id
      )
      if (this.spuForm.baseSaleAttr) this.isShowSaleBtn = false
      if (!this.baseSaleAttrList.length) this.isShowSaleBtn = false

      this.spuForm.baseSaleAttr = ''
    },
    // 设置销售属性列表
    setBaseSale() {
      this.isShowSaleBtn = true
    },
    // 获取品牌或销售属性列表
    async getTradeOrBaseSaleList(fnName, addSaleAttr = []) {
      const res = await this.$API.spu[`${fnName}`]()
      if (res.code === 200) {
        if (fnName === 'getBaseSaleAttrList') {
          this.baseSaleAttrList = res.data
          console.log(addSaleAttr)
          console.log(this.baseSaleAttrList)
        } else if (fnName === 'getTradeMarkList') {
          this.tradeMarkList = res.data
        }
      } else {
        this.$message.error('获取品牌或销售列表失败')
      }
    },
    // 获取品牌列表和销售属性列表
    async trademarkAndBaseSaleList(addSaleAttr = []) {
      this.getTradeOrBaseSaleList('getBaseSaleAttrList', addSaleAttr)
      this.getTradeOrBaseSaleList('getTradeMarkList')
      this.isShow = false
    },

    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.get_SpuList(this.category3Id)
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.get_SpuList(this.category3Id)
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
