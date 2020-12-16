<template>
  <el-card class="box-card">
    <el-form
      ref="skuForm"
      label-width="100px"
      class="demo-ruleForm"
      :model="skuForm"
    >
      <el-form-item label="SPU名称">
        <span>{{ skuForm.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称" prop="skuName">
        <el-input v-model="skuName" placeholder="SKU名称" />
      </el-form-item>
      <el-form-item label="价格(元)" prop="price">
        <el-input-number
          v-model="price"
          controls-position="right"
          :min="1"
          placeholder="SKU价格"
        />
      </el-form-item>
      <el-form-item label="重量(千克)" prop="weight">
        <el-input-number
          v-model="weight"
          controls-position="right"
          :min="1"
          placeholder="SKU重量"
        />
      </el-form-item>
      <el-form-item label="规格描述" prop="description">
        <el-input
          v-model="skuDesc"
          type="textarea"
          :rows="2"
          placeholder="SKU规格描述"
        />
      </el-form-item>
      <el-form-item label="平台属性" prop="attrInfoList">
        <el-form label-width="100px" inline>
          <el-form-item
            v-for="attrInfo in attrInfoList"
            :key="attrInfo.id"
            :label="attrInfo.attrName"
          >
            <el-select v-model="attrInfo.attrValueId" placeholder="请选择">
              <el-option
                v-for="attrValue in attrInfo.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
                :value="attrValue.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性" prop="skuSaleAttrList">
        <el-form label-width="100px" inline>
          <el-form-item
            v-for="spuSaleAttr in spuSaleAttrList"
            :key="spuSaleAttr.id"
            :label="spuSaleAttr.saleAttrName"
          >
            <el-select v-model="spuSaleAttr.saleAttrId" placeholder="请选择">
              <el-option
                v-for="spuSaleAttrValue in spuSaleAttr.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
                :label="spuSaleAttrValue.saleAttrValueName"
                :value="spuSaleAttrValue.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表" prop="skuImageList">
        <el-table
          ref="multipleTable"
          :data="spuImageList"
          tooltip-effect="dark"
          style="width: 100%"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="图片" prop="imgUrl">
            <template slot-scope="{ row }">
              <img
                :src="row.imgUrl"
                :alt="row.imgName"
                style="width:100px;height:100px"
              >
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" />
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button
                v-if="row.isDefault === '0'"
                type="primary"
                size="mini"
                @click="setDefalut(row)"
              >设为默认值</el-button>
              <el-button v-else type="success" disabled>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveSku">保存</el-button>
        <el-button @click="cancelSku">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'AddSku',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    rowSku: Object,
    // eslint-disable-next-line vue/require-default-prop
    category: Object
  },
  data() {
    return {
      skuForm: this.rowSku,
      spuSaleAttrList: [], // 销售属性列表
      spuImageList: [], // spu图片列表
      attrInfoList: [], // 商品基础属性列表
      skuAttrValueList: [],
      skuSaleAttrValueList: [],
      selectedImageList: [],
      skuImageList: [],
      skuDefaultImg: '',
      price: '',
      skuName: '',
      skuDesc: '',
      weight: ''
      /*
        rules: {
          skuName: [{ required: true, message: '请输入SKU名称' }],
          price: [
            {
              required: true,
              message: '请选择价格,最少大于2',
              min: 2
            }
          ],
          weight: [
            {
              required: true,
              message: '请选择重量,最少大于2',
              min: 2
            }
          ],
          description: [{ required: true, message: '请输入规格描述' }],
          attrInfoList: [
            { required: true, validator: this.validateAttrInfoList }
          ],
          skuSaleAttrList: [
            { required: true, validator: this.validateSkuSaleAttrList }
          ],
          skuImageList: [{ required: true, validator: this.validateSkuImageList }]
        }
      */
    }
  },
  async mounted() {
    const { category1Id, category2Id, category3Id } = this.category
    const spuSaleAttrList = await this.$API.sku.getSpuSaleAttrList(
      this.skuForm.id
    )

    spuSaleAttrList.code === 200
      ? (this.spuSaleAttrList = spuSaleAttrList.data)
      : this.$message.error('获取销售属性列表失败')

    const spuImageList = await this.$API.spu.getSpuImageList(this.skuForm.id)
    spuImageList.code === 200
      ? (this.spuImageList = spuImageList.data)
      : this.$message.error('获取SPU图片列表失败')
    this.spuImageList.forEach(spuImage => this.$set(spuImage, 'isDefault', '0'))

    const attrInfoList = await this.$API.attr.getAttrInfoList(
      category1Id,
      category2Id,
      category3Id
    )
    attrInfoList.code === 200
      ? (this.attrInfoList = attrInfoList.data)
      : this.$message.error('获取商品基础属性列表失败')
  },
  methods: {
    // 校验图片列表
    validateSkuImageList(rule, value, callback) {
      if (!this.skuImageList.length) {
        callback(new Error('请选择图片'))
        return
      }
      const res = this.skuImageList.every(item => item.isDefault === '0')
      if (res) {
        callback(new Error('请选择默认图片'))
        return
      }
      callback()
    },
    // 校验销售属性列表
    validateSkuSaleAttrList(rule, value, callback) {
      if (this.skuSaleAttrValueList.length < 2) {
        callback(new Error('销售属性每一项都要选择哟!!!'))
        return
      }
      callback()
    },
    // 校验平台属性列表
    validateAttrInfoList(rule, value, callback) {
      if (this.skuAttrValueList.length < 3) {
        callback(new Error('平台属性每项都要选择'))
        return
      }
      callback()
    },
    saveSku() {
      this.$refs.skuForm.validate(async valid => {
        if (valid) {
          const { category3Id, id: spuId, tmId } = this.skuForm
          const {
            price,
            skuName,
            skuDesc,
            weight,
            skuAttrValueList,
            skuSaleAttrValueList,
            skuDefaultImg
          } = this
          this.attrInfoList.forEach(item => {
            if (item.attrValueId) {
              this.skuAttrValueList.push({
                attrId: item.id,
                valueId: item.attrValueId
              })
            }
          })
          this.spuSaleAttrList.forEach(item => {
            if (item.saleAttrId) {
              this.skuSaleAttrValueList.push({
                saleAttrValueId: item.saleAttrId
              })
            }
          })
          this.skuImageList = this.selectedImageList.map(item => ({
            imgName: item.imgName,
            imgUrl: item.imgUrl,
            spuImgId: item.id,
            isDefault: item.isDefault
          }))
          const skuData = {
            category3Id,
            spuId,
            tmId,
            price,
            skuName,
            skuDesc,
            weight,
            skuAttrValueList,
            skuSaleAttrValueList,
            skuDefaultImg
          }
          await this.$API.sku.saveSkuInfo(skuData)
          this.$emit('cancel')
        }
      })
    },
    // 设置默认值
    setDefalut(row) {
      this.spuImageList.forEach(item => (item.isDefault = '0'))
      row.isDefault = '1'
      this.skuDefaultImg = row.imgUrl
    },
    handleSelectionChange(val) {
      this.selectedImageList = val
    },
    /* async saveSku() {
      const { category3Id, id: spuId, tmId } = this.skuForm
      const {
        price,
        skuName,
        skuDesc,
        weight,
        skuAttrValueList,
        skuSaleAttrValueList,
        skuDefaultImg
      } = this
      this.attrInfoList.forEach(item => {
        if (item.attrValueId) {
          this.skuAttrValueList.push({
            attrId: item.id,
            valueId: item.attrValueId
          })
        }
      })
      this.spuSaleAttrList.forEach(item => {
        if (item.saleAttrId) {
          this.skuSaleAttrValueList.push({
            saleAttrValueId: item.saleAttrId
          })
        }
      })
      this.skuImageList = this.selectedImageList.map(item => ({
        imgName: item.imgName,
        imgUrl: item.imgUrl,
        spuImgId: item.id,
        isDefault: item.isDefault
      }))
      const skuData = {
        category3Id,
        spuId,
        tmId,
        price,
        skuName,
        skuDesc,
        weight,
        skuAttrValueList,
        skuSaleAttrValueList,
        skuDefaultImg
      }
      await this.$API.sku.saveSkuInfo(skuData)
      this.$emit('cancel')
    }, */
    cancelSku() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="sass" scoped></style>
