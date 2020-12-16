<template>
  <div>
    <el-card class="box-card" style="margin-bottom:30px">
      <el-form inline class="demo-form-inline" :model="category">
        <el-form-item label="一级分类">
          <el-select
            v-model="category.category1Id"
            :disabled="disabled"
            placeholder="请选择"
            @change="getCategoryList(2, $event)"
          >
            <el-option
              v-for="category1 in category1List"
              :key="category1.id"
              :label="category1.name"
              :value="category1.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            v-model="category.category2Id"
            :disabled="disabled"
            placeholder="请选择"
            @change="getCategoryList(3, $event)"
          >
            <el-option
              v-for="category2 in category2List"
              :key="category2.id"
              :label="category2.name"
              :value="category2.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            v-model="category.category3Id"
            :disabled="disabled"
            placeholder="请选择"
            @change="getAttrInfoList(category)"
          >
            <el-option
              v-for="category3 in category3List"
              :key="category3.id"
              :label="category3.name"
              :value="category3.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Category',
  props: {
    disabled: Boolean
  },
  data() {
    return {
      isShow: true,
      category: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      },
      category1List: [],
      category2List: [],
      category3List: []
    }
  },
  async mounted() {
    this.getCategoryList()
  },
  methods: {
    async getCategoryList(num = 1, id = '') {
      if (num === 2) {
        this.category.category2Id = ''
        this.category.category3Id = ''
        this.category2List = []
        this.category3List = []
        this.$emit('clearList')
        this.$bus.$emit('clearList')
      }
      if (num === 3) {
        this.category.category3Id = ''
        this.category3List = []
        this.$emit('clearList')
        this.$bus.$emit('clearList')
      }
      const res = await this.$API.attr[`getCategory${num}`](id)
      res.code === 200
        ? (this[`category${num}List`] = res.data)
        : this.$message.error(`${num}级列表获取失败`)
    },
    getAttrInfoList(category) {
      this.isShow = false
      this.$emit('change', this.category)
      this.$emit('update_IsShowAddBtn')
      this.$emit('getCategoryId', category)
      // this.$bus.$emit('change', category)
      this.$bus.$emit('getSpuList', category.category3Id)
    }
  }
}
</script>

<style></style>
