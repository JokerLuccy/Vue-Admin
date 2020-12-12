<template>
  <div>
    <Category :disabled="!isShow" @change="getAttrInfoList" />
    <el-card v-show="isShow">
      <el-button
        type="primary"
        :disabled="!category.category3Id"
        icon="el-icon-plus"
        style="margin-bottom:20px"
        @click="showAddAttr"
      >添加属性</el-button>

      <el-table v-show="isShow" style="width: 100%" border :data="attrList">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="attrName" label="属性名称" width="150" />
        <el-table-column prop="attrValueList" label="属性值列表" width="850">
          <template slot-scope="scope">
            <el-tag
              v-for="attrValue in scope.row.attrValueList"
              :key="attrValue.id"
              type="info"
              style="margin-right:5px"
            >{{ attrValue.valueName }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="goToModify(scope.row)"
            />
            <el-popconfirm title="确定要删除吗" @onConfirm="delAttr(scope.row)">
              <el-button slot="reference" type="danger" icon="el-icon-delete" />
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 修改界面 -->
    <el-card v-show="!isShow" style="margin-top: 20px">
      <el-form :model="attrInfo" :inline="true">
        <el-form-item label="属性名">
          <el-input v-model="attrInfo.attrName" />
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin-bottom:20px"
        @click="addAttr"
      >添加属性值</el-button>
      <el-button
        type="primary"
        style="margin-bottom:20px"
        @click="isShow = true"
      >取消</el-button>
      <el-table style="width: 100%" border :data="attrInfo.attrValueList">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column label="属性值名称" width="850">
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.edit"
              ref="input"
              v-model="scope.row.valueName"
              @blur="editCompelete(scope.row, scope.$index)"
              @keyup.enter.native="editCompelete(scope.row, scope.$index)"
            />
            <span
              v-else
              style="display: block; width: 100%"
              @click="showInput(scope.row)"
            >{{ scope.row.valueName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template v-slot="scope">
            <el-popconfirm title="确定要删除吗" @onConfirm="del(scope.$index)">
              <el-button slot="reference" type="danger" icon="el-icon-delete" />
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        type="primary"
        style="margin-top:20px"
        @click="saveModify"
      >保存</el-button>
      <el-button
        type="primary"
        style="margin-top:20px"
        @click="isShow = true"
      >取消</el-button>
    </el-card>
  </div>
</template>

<script>
import Category from '@/components/Category'

export default {
  name: 'AttrList',
  components: {
    Category
  },
  data() {
    return {
      attrList: [],
      category: {},
      isShow: true,

      attrInfo: {
        attrName: '',
        attrValueList: []
      }
    }
  },

  methods: {
    // 获取对应属性列表
    async getAttrInfoList(category) {
      this.category = {
        ...category
      }
      const { category1Id, category2Id, category3Id } = category
      const res = await this.$API.attr.getAttrInfoList(
        category1Id,
        category2Id,
        category3Id
      )
      res.code === 200
        ? (this.attrList = res.data)
        : this.$message.error('获取数据失败')
    },
    async delAttr(row) {
      const { id } = row
      await this.$API.attr.deleteAttr(id)
      await this.getAttrInfoList(this.category)
    },
    // 修改界面
    goToModify(row) {
      this.attrInfo = JSON.parse(JSON.stringify(row))
      this.isShow = false
    },
    // 显示输入框
    showInput(row) {
      this.$set(row, 'edit', true)
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    editCompelete(row, index) {
      if (!row.valueName) {
        this.attrInfo.attrValueList.splice(index, 1)
        return
      }
      row.edit = false
    },
    addAttr() {
      this.attrInfo.attrValueList.push({ edit: true })
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    del(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    async saveModify() {
      const res = await this.$API.attr.saveAttrInfo(this.attrInfo)
      console.log(res)
      if (res.code === 200) {
        this.$message.success('修改成功')
        this.isShow = true
        console.log(this.category)
        this.getAttrInfoList(this.category)
      } else {
        this.$message.error('修改失败')
      }
    },
    showAddAttr() {
      this.attrInfo = {
        attrName: '',
        attrValueList: [],
        categoryId: this.category.category3Id,
        categoryLevel: 3
      }
      this.isShow = false
    }
  }
}
</script>
<style lang="sass" scoped></style>
