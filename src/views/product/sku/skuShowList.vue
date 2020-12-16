<template>
  <el-dialog title="提示" :visible.sync="visible" width="60%">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="名称" align="center" />
      <el-table-column prop="name" label="价格(元)" align="center" />
      <el-table-column prop="address" label="重量(KG)" align="center" />
      <el-table-column prop="address" label="默认图片" align="center" />
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
      ]
    }
  },
  mounted() {
    this.$bus.$on('isVisible', this.isVisible)
  },
  methods: {
    isVisible() {
      this.visible = true
    }
  }
}
</script>

<style></style>
