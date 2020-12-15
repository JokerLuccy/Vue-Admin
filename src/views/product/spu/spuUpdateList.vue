/* eslint-disable vue/no-dupe-keys */ /* eslint-disable vue/require-default-prop
*/
<template>
  <el-card>
    <el-form
      ref="spuForm"
      label-width="100px"
      class="demo-ruleForm"
      :model="spuForm"
    >
      <el-form-item label="SPU名称">
        <el-input v-model.trim="spuForm.spuName" placeholder="SPU名称" />
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
          <el-option
            v-for="tradeMark in tradeMarkList"
            :key="tradeMark.id"
            :label="tradeMark.tmName"
            :value="tradeMark.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="spu描述">
        <el-input
          v-model.trim="spuForm.description"
          type="textarea"
          placeholder="SPU描述"
        />
      </el-form-item>
      <el-form-item label="spu图片">
        <el-upload
          :action="`${$BASE_API}/admin/product/fileUpload`"
          list-type="picture-card"
          :file-list="spuForm.spuImageList || []"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
        >
          <i class="el-icon-plus" />
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="spuImg">
          </el-dialog>
        </el-upload>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          v-model="spuForm.saleAttrId"
          :placeholder="
            filterBaseSaleAttrList.length
              ? `还有${filterBaseSaleAttrList.length}可选择`
              : '没有了'
          "
          @change="isShowAttrBtn = false"
        >
          <el-option
            v-for="baseSaleAttr in filterBaseSaleAttrList"
            :key="baseSaleAttr.id"
            :label="baseSaleAttr.name"
            :value="baseSaleAttr.id"
          />
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="isShowAttrBtn"
          @click="addToSpuSaleAttrList(spuForm.saleAttrId)"
        >添加销售属性</el-button>
        <el-table
          style="width: 100%;margin-top:20px"
          border
          :data="spuForm.spuSaleAttrList"
        >
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column label="属性名" width="150" prop="saleAttrName" />
          <el-table-column label="属性值名列表" prop="spuSaleAttrList">
            <template v-slot="scope">
              <el-tag
                v-for="spuSaleAttrValue in scope.row.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
                :disable-transitions="false"
                closable
              >
                {{ spuSaleAttrValue.saleAttrValueName }}
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
            <template slot-scope="scope">
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
          @click="updateSpuInfo"
        >保存</el-button>
        <el-button style="margin-top:20px" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'SpuUpdateList',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    rowSpu: Object,
    // eslint-disable-next-line vue/require-default-prop
    count: Number,
    // eslint-disable-next-line vue/require-default-prop
    category3id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      spuForm: this.rowSpu,
      tradeMarkList: [],
      baseSaleAttrList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      isShowAttrBtn: true
      // category3Id: this.category3Id || 0
    }
  },
  computed: {
    filterBaseSaleAttrList() {
      return this.baseSaleAttrList.filter(item => {
        return this.spuForm.spuSaleAttrList
          ? !this.spuForm.spuSaleAttrList.find(
            i => i.baseSaleAttrId === item.id
          )
          : []
      })
    }
  },
  async mounted() {
    if (this.count) {
      this.get_TBSI_List('getTradeMarkList')
      this.get_TBSI_List('getBaseSaleAttrList')
      this.get_TBSI_List('getSpuById', this.spuForm.id)
      this.get_TBSI_List('getSpuImageList', this.spuForm.id)
    } else {
      // this.$bus.$on('getCategory3Id', this.getCategory3Id)
      this.get_TBSI_List('getTradeMarkList')
      this.get_TBSI_List('getBaseSaleAttrList')
      this.$set(this.spuForm, 'spuImageList', [])
      this.$set(this.spuForm, 'spuSaleAttrList', [])
    }
  },
  methods: {
    // 清空supForm
    clearSpuForm() {
      this.spuForm.category3Id = ''
      this.spuForm.description = ''
      this.spuForm.id = ''
      this.spuForm.spuImageList = []
      this.spuForm.spuName = ''
      this.spuForm.spuSaleAttrList = []
      this.spuForm.tmId = ''
    },
    // 取消
    cancel() {
      this.clearSpuForm()
      this.$emit('cancel')
    },
    // 更新Spu
    async updateSpuInfo() {
      const imageList = []
      this.spuForm.spuImageList
        ? this.spuForm.spuImageList.forEach(image => {
          imageList.push({
            id: 0,
            imgName: image.name,
            imgUrl: image.url
          })
        })
        : []

      const data = {
        category3Id: this.spuForm.category3Id || this.category3id,
        description: this.spuForm.description,
        id: this.spuForm.id,
        spuImageList: imageList,
        spuName: this.spuForm.spuName,
        spuSaleAttrList: this.spuForm.spuSaleAttrList,
        tmId: this.spuForm.tmId
      }
      if (this.count) {
        await this.$API.spu.updateSpuInfo(data)
      } else {
        await this.$API.spu.saveSpuInfo(data)
      }

      this.clearSpuForm()
      this.$emit('cancel')
    },
    // 删除添加的销售属性
    delSelectedAttr(index) {
      this.spuForm.spuSaleAttrList.splice(index, 1)
    },
    // 把新增的Tag标签添加到对应数组中
    addToTagList(row, index) {
      const { spuTagName, spuSaleAttrValueList } = row
      const tagMes = {
        saleAttrValueName: spuTagName,
        baseSaleAttrId: row.baseSaleAttrId,
        saleAttrName: row.saleAttrName,
        spuId: row.spuId
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
    // 显示input输入框
    addSpuAttrValue(row) {
      this.$set(row, 'edit', true)
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    addToSpuSaleAttrList(saleAttrId) {
      const res = this.baseSaleAttrList.find(item => item.id === saleAttrId)

      const obj = {}
      this.$set(obj, 'baseSaleAttrId', res.id)
      this.$set(obj, 'saleAttrName', res.name)
      this.$set(obj, 'spuId', this.spuForm.id)
      this.$set(obj, 'spuSaleAttrValueList', [])
      this.spuForm.spuSaleAttrList.push(obj)
      this.baseSaleAttrList = this.baseSaleAttrList.filter(
        item => item.id !== saleAttrId
      )
      this.spuForm.saleAttrId = ''
    },
    handleAvatarSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.spuForm.spuImageList.push({
          uid: file.uid,
          name: file.name,
          url: file.response.data
        })
      } else {
        this.$message.error('图片上传失败')
      }
    },
    handleRemove(file) {
      this.spuForm.spuImageList = this.spuForm.spuImageList.filter(
        item => item.id !== file.id
      )
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    async get_TBSI_List(fnName, id = '') {
      const res = await this.$API.spu[`${fnName}`](id)
      if (fnName === 'getTradeMarkList') {
        res.code === 200
          ? (this.tradeMarkList = res.data)
          : this.$message.error('品牌列表获取失败')
      }
      if (fnName === 'getBaseSaleAttrList') {
        res.code === 200
          ? (this.baseSaleAttrList = res.data)
          : this.$message.error('销售列表获取失败')
      }
      if (fnName === 'getSpuById') {
        res.code === 200
          ? (this.spuForm.spuSaleAttrList = res.data.spuSaleAttrList)
          : this.$message.error('销售品牌列表获取失败')
      }
      if (fnName === 'getSpuImageList') {
        if (res.code === 200) {
          if (res.data.length) {
            this.spuForm.spuImageList = res.data.map(image => {
              return {
                id: image.id,
                name: image.imgName,
                url: image.imgUrl
              }
            })
          } else {
            this.$set(this.spuForm, 'spuImageList', [])
          }
        } else {
          this.$message.error('图片列表获取失败')
        }
      }
    }
  }
}
</script>

<style></style>
