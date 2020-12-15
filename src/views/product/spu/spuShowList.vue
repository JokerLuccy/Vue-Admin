<template>
  <el-card>
    <el-button
      :disabled="isShowAddBtn"
      type="primary"
      icon="el-icon-plus"
      style="margin-bottom:20px"
      @click="is_Show_Add"
    >添加SPU</el-button>
    <el-table v-loading="loading" style="width: 100%" border :data="spuList">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="SPU名称" prop="spuName" />
      <el-table-column label="SPU描述" prop="description" />

      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button size="mini" icon="el-icon-plus" type="primary" />
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="primary"
            @click="edit(row)"
          />
          <el-button size="mini" icon="el-icon-info" type="info" />
          <el-button
            size="mini"
            icon="el-icon-delete"
            type="danger"
            @click="delSpu(row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="currentPage"
      :page-sizes="[1, 3]"
      :page-size.sync="pageSize"
      layout="prev, pager, next, jumper,sizes,total"
      :total="total"
      class="trademark-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<script>
export default {
  name: 'SpuShowList',

  data() {
    return {
      isShowAddBtn: true,
      pageSize: 3,
      currentPage: 1,
      total: 0,
      loading: false,
      category: {},
      spuList: []
    }
  },
  mounted() {
    this.$bus.$on('change', this.getCategoryId)
    this.$bus.$on('clearList', this.clearList)
    this.$bus.$on('getSpuList', this.get_SpuList)
    this.$bus.$on('isShowAddBtn', this.isShow_Add_Btn)

    // showUpdataList专用
  },
  beforeDestroy() {
    this.$bus.$off('change', this.getCategoryId)
    this.$bus.$off('clearList', this.clearList)
    this.$bus.$off('getSpuList', this.get_SpuList)
    this.$bus.$off('isShowAddBtn', this.isShow_Add_Btn)
  },
  methods: {
    edit(row) {
      this.$emit('showUpdateSpu', row)
    },
    async delSpu(row) {
      await this.$API.spu.delSingleSpu(row.id)
      this.get_SpuList(row.category3Id)
    },
    getCategoryId(category) {
      this.category = category
    },
    clearList() {
      this.spuList = []
      this.category.category3Id = ''
      this.pageSize = 3
      this.currentPage = 1
      this.total = 0
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.get_SpuList(this.category.category3Id)
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.get_SpuList(this.category.category3Id)
    },
    async get_SpuList(category3Id) {
      this.loading = true
      const res = await this.$API.spu.getSpuList(
        this.currentPage,
        this.pageSize,
        category3Id
      )

      if (res.code === 200) {
        this.$message.success('获取spu列表成功')
        this.spuList = res.data.records
        this.total = res.data.total
        this.loading = false
      } else {
        this.$message.error('获取spu列表失败')
        this.loading = false
      }
    },
    isShow_Add_Btn(isShow) {
      this.isShowAddBtn = isShow
    },
    is_Show_Add() {
      this.$emit('change')
      this.$emit('getCategory3Id', this.category.category3Id)
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
