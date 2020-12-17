<template>
  <el-dialog
    :title="`${skuInfo.spuName}==>SKU列表`"
    :visible.sync="visible"
    width="60%"
  >
    <el-table :data="skuList" style="width: 100%">
      <el-table-column prop="skuName" label="名称" align="center" />
      <el-table-column prop="price" label="价格(元)" align="center" />
      <el-table-column prop="weight" label="重量(KG)" align="center" />
      <el-table-column label="默认图片" align="center">
        <template slot-scope="scope">
          <img
            :src="scope.row.skuDefaultImg"
            alt="skuDefaultImg"
            style="width: 130px"
          >
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  name: 'SkuShowList',

  data() {
    return {
      visible: false,
      skuInfo: {},
      skuList: []
    }
  },
  mounted() {
    this.$bus.$on('isVisible', this.isVisible)
    this.$bus.$on('getSkuList', this.getSkuList)
  },
  beforeDestroy() {
    this.$bus.$off('getSkuList')
  },

  methods: {
    isVisible() {
      this.visible = true
    },
    async getSkuList(row) {
      this.skuInfo = {
        ...row
      }
      const res = await this.$API.sku.getSkuList(row.id)
      res.code === 200
        ? (this.skuList = res.data)
        : this.$message.error('获取SKU列表失败')
    }
  }
}
</script>

<style></style>
