<template>
  <el-dialog title="提示" :visible.sync="visible" width="60%">
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
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
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
    async getSkuList(spuId) {
      const res = await this.$API.sku.getSkuList(spuId)

      res.code === 200
        ? (this.skuList = res.data)
        : this.$message.error('获取SKU列表失败')
    }
  }
}
</script>

<style></style>
