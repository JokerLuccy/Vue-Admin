<template>
  <div>
    <el-card class="box-card">
      <CategorySelector />
    </el-card>
    <el-card class="box-card" />
  </div>
</template>

<script>
import CategorySelector from '@/components/CategorySelector'
export default {
  name: 'AttrList',
  components: {
    CategorySelector
  }
}
</script>
