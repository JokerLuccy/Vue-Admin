<template>
  <div>
    <Category />
    <SpuShowList
      v-if="isShow"
      @change="isShowAdd"
      @showUpdateSpu="showUpdateSpu"
      @getCategory3Id="getCategory3Id"
    />
    <SpuUpdateList
      v-else
      :row-spu="rowSpu"
      :count="count"
      :category3id="category3Id"
      @cancel="cancelShow"
    />
  </div>
</template>

<script>
import Category from '@/components/Category'
import SpuShowList from './spuShowList'
import SpuUpdateList from './spuUpdateList'
export default {
  name: 'SpuList',
  components: {
    Category,
    SpuShowList,
    SpuUpdateList
  },
  data() {
    return {
      isShow: true,
      rowSpu: {},
      count: 0,
      category3Id: 0
    }
  },

  methods: {
    getCategory3Id(category3Id) {
      this.category3Id = category3Id
    },
    showUpdateSpu(row) {
      this.count = 1
      this.isShow = false
      this.rowSpu = {
        ...row
      }
    },
    isShowAdd() {
      this.isShow = false
    },
    cancelShow() {
      this.isShow = true
      this.count = 0
    }
  }
}
</script>

<style></style>
