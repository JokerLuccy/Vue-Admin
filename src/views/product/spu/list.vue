<template>
  <div>
    <Category
      v-if="isShow || isShowSku"
      :disabled="!isShow"
      @getCategoryId="getCategoryId"
      @update_IsShowAddBtn="update_IsShowAddBtn"
    />
    <SpuShowList
      v-if="isShow"
      :is-show-add-btn="isShowAddBtn"
      @change="isShowAdd"
      @showUpdateSpu="showUpdateSpu"
      @getCategory3Id="getCategory3Id"
      @changeIsShowSku="changeIsShowSku"
    />
    <SpuUpdateList
      v-else-if="isShow || isShowSku"
      :row-spu="rowSpu"
      :count="count"
      :category3id="category3Id"
      @cancel="cancelShow"
      @update_IsShowAddBtn="update_IsShowAddBtn"
    />
    <AddSku
      v-else
      :row-sku="rowSku"
      :category="category"
      @showSpu="showSpu"
      @cancel="cancelShow"
    />
  </div>
</template>

<script>
import Category from '@/components/Category'
import SpuShowList from './spuShowList'
import SpuUpdateList from './spuUpdateList'
import AddSku from '../sku/addSku'

export default {
  name: 'SpuList',
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
    AddSku
  },
  data() {
    return {
      isShow: true,
      isShowSku: true,
      isShowAddBtn: true,
      rowSpu: {},
      count: 0,
      category3Id: 0,
      rowSku: {},
      category: {}
    }
  },

  methods: {
    getCategoryId(category) {
      this.category = category
    },
    // SKU点击取消,回到SPU界面
    showSpu() {
      this.isShow = true
    },
    changeIsShowSku(row) {
      this.isShowSku = false
      this.isShow = false
      this.rowSku = {
        ...row
      }
    },
    getCategory3Id(category3Id) {
      this.category3Id = category3Id
    },
    showUpdateSpu(row) {
      this.count = 1
      this.isShow = false
      this.isShowSku = true
      this.rowSpu = {
        ...row
      }
    },
    isShowAdd() {
      this.isShow = false
      this.isShowSku = true
    },
    cancelShow(category3Id) {
      this.isShow = true
      this.count = 0
      this.$nextTick(() => {
        this.$bus.$emit('getSpuList', this.category.category3Id)
      })
    },
    update_IsShowAddBtn() {
      this.isShowAddBtn = false
    }
  }
}
</script>

<style></style>
