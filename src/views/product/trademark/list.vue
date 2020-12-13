<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin-bottom: 20px"
      @click="showAdd"
    >添加</el-button>
    <el-table v-loading="loading" :data="tradeMarkList" style="width: 100%">
      <el-table-column type="index" :index="1" label="序号" />
      <el-table-column prop="tmName" label="品牌名称" />

      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" alt="logo" style="width: 130px">
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="warning"
            icon="el-icon-edit "
            @click="updateTradeMark(scope.row)"
          >修改</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="removeTradeMark(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page.sync="currentPage"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="pageSize"
      layout="  prev, pager, next, jumper,sizes,total"
      :total="total"
      class="trademark-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog
      :title="tradeMarkForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form
        ref="tradeMarkForm"
        :model="tradeMarkForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="tradeMarkForm.tmName" />
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
          >
            <img
              v-if="tradeMarkForm.logoUrl"
              :src="tradeMarkForm.logoUrl"
              class="avatar"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('tradeMarkForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TrademarkList',
  data() {
    return {
      tradeMarkList: [],
      pageSize: 3, // 每页显示的个数
      currentPage: 1, // 当前的页码
      total: 0,
      dialogVisible: false,
      tradeMarkForm: {
        tmName: '',
        logoUrl: ''
      },
      loading: false,
      rules: {
        tmName: [
          {
            required: true,
            message: '请输入品牌名称',
            trigger: 'blur'
          }
        ],
        logoUrl: [
          {
            required: true,
            message: '请上传品牌图片'
          }
        ]
      }
    }
  },
  async mounted() {
    this.saveTradeMarkList()
  },
  methods: {
    async handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.saveTradeMarkList()
    },
    async handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      // console.log(currentPage)
      this.saveTradeMarkList()
    },
    async saveTradeMarkList() {
      this.loading = true
      try {
        const tradeMarkList = await this.$API.trademark.getTradeMarkList(
          this.currentPage,
          this.pageSize
        )

        if (tradeMarkList.code === 200) {
          this.tradeMarkList = tradeMarkList.data.records
          this.total = tradeMarkList.data.total
          this.$message.success('获取品牌列表成功')
        } else {
          this.$message.error('获取品牌列表失败')
        }
      } catch (error) {
        this.$message.error('获取品牌列表失败')
      }
      this.loading = false
    },
    beforeAvatarUpload(file) {
      const fileTypes = ['image/jpeg', 'image/png', 'image/jpg']
      const isJPG = fileTypes.includes(file.type)
      const isLt2M = file.size / 1024 < 50

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或 png 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 50kb!')
      }
      return isJPG && isLt2M
    },
    handleAvatarSuccess(res) {
      this.tradeMarkForm.logoUrl = res.data
    },
    // 修改或提交品牌数据
    submitForm(tradeMarkForm) {
      this.$refs[tradeMarkForm].validate(async valid => {
        if (valid) {
          let res
          if (this.tradeMarkForm.id) {
            const tradeMark = this.tradeMarkList.find(
              item => item.id === this.tradeMarkForm.id
            )
            if (
              tradeMark.tmName === this.tradeMarkForm.tmName &&
              tradeMark.logoUrl === this.tradeMarkForm.logoUrl
            ) {
              this.$message.warning('请修改数据')
              return
            }
            res = await this.$API.trademark.updateTradeMark(this.tradeMarkForm)
          } else {
            res = await this.$API.trademark.addTradeMark(this.tradeMarkForm)
          }
          if (res.code === 200) {
            this.$message.success(
              `${this.tradeMarkForm.id ? '修改' : '添加'}品牌成功`
            )
            this.dialogVisible = false
            this.saveTradeMarkList()
          } else {
            this.$message.error(
              `${this.tradeMarkForm.id ? '修改' : '添加'}品牌失败`
            )
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除品牌数据
    async removeTradeMark(id) {
      await this.$API.trademark.removeTradeMark(id)
      await this.saveTradeMarkList()
    },

    updateTradeMark(row) {
      this.$refs.tradeMarkForm && this.$refs.tradeMarkForm.clearValidate()
      this.tradeMarkForm = {
        ...row
      }
      this.dialogVisible = true
    },
    showAdd() {
      this.$refs.tradeMarkForm && this.$refs.tradeMarkForm.clearValidate()
      this.tradeMarkForm = {
        tmName: '',
        logoUrl: ''
      }
      this.dialogVisible = true
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
