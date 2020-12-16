<template>
  <div>
    <el-card class="box-card">
      <el-table v-loading="loading" :data="skuAllList" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="skuName" label="名称" />
        <el-table-column prop="skuDesc" label="描述" />
        <el-table-column label="默认图片">
          <template slot-scope="{ row }">
            <img
              :src="row.skuDefaultImg"
              alt="skuDefaultImg"
              style="width:80px"
            >
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量(KG)" />
        <el-table-column prop="price" label="价格(元)" />
        <el-table-column label="操作" width="300px">
          <template slot-scope="{ row }">
            <el-tooltip
              v-if="row.isSale"
              class="item"
              effect="dark"
              content="下架"
              placement="bottom-start"
            >
              <el-button
                type="success"
                icon="el-icon-bottom"
                size="mini"
                @click="isOnSale(row)"
              />
            </el-tooltip>
            <el-tooltip
              v-else
              class="item"
              effect="dark"
              content="下架"
              placement="bottom-start"
            >
              <el-button
                type="info"
                icon="el-icon-top"
                size="mini"
                @click="isOnSale(row)"
              />
            </el-tooltip>

            <el-button type="primary" icon="el-icon-edit" size="mini" />
            <el-button
              type="info"
              icon="el-icon-info"
              size="mini"
              @click="getSkuInfo(row)"
            />
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="del(row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="currentPage"
        :page-sizes="[5, 10, 20, 30, 40]"
        :page-size.sync="pageSize"
        layout="prev, pager, next, jumper,sizes,total"
        :total="total"
        class="trademark-pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      :with-header="false"
      width="50%"
    >
      <el-row>
        <el-col :span="5"><span>名称</span></el-col>
        <el-col
          :span="16"
        ><span>{{ skuInfo.skuName }}</span></el-col>
      </el-row>
      <el-row>
        <el-col :span="5"><span>描述</span></el-col>
        <el-col
          :span="16"
        ><span>{{ skuInfo.skuDesc }}</span></el-col>
      </el-row>
      <el-row>
        <el-col :span="5"><span>价格</span></el-col>
        <el-col
          :span="16"
        ><span>{{ skuInfo.price }}</span></el-col>
      </el-row>
      <el-row>
        <el-col :span="5"><span>平台属性</span></el-col>
        <el-col :span="16">
          <el-tag
            v-for="skuAttrValue in skuInfo.skuAttrValueList"
            :key="skuAttrValue.id"
            type="info"
            style="margin-left:10px"
          >{{ skuAttrValue.attrId }}-{{ skuAttrValue.valueId }}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5"><span>销售属性</span></el-col>
        <el-col :span="16">
          <el-tag
            v-for="skuSaleAttrValue in skuInfo.skuSaleAttrValueList"
            :key="skuSaleAttrValue.id"
            type="info"
            style="margin-left:10px"
          >{{ skuSaleAttrValue.id }}-{{
            skuSaleAttrValue.saleAttrValueId
          }}</el-tag>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5"><span>商品图片</span></el-col>
        <el-col :span="16">
          <el-carousel trigger="click" style="width:300px;height:300px">
            <el-carousel-item
              v-for="skuImage in skuInfo.skuImageList"
              :key="skuImage.id"
            >
              <img
                :src="skuImage.imgUrl"
                :alt="skuImage.imgName"
                style="width:100%;height:100%"
              >
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'SkuList',
  data() {
    return {
      skuAllList: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loading: false,
      drawer: false,
      skuInfo: {},
      isSale: true
    }
  },
  mounted() {
    this.getSkuAllLit()
  },
  methods: {
    async isOnSale(row) {
      if (row.isSale) {
        // 下架
        await this.$API.sku.cancelSale(row.id)
      }
      if (!row.isSale) {
        await this.$API.sku.onSale(row.id)
      }

      this.getSkuAllLit()
    },
    async getSkuInfo(row) {
      this.drawer = true
      const res = await this.$API.sku.getSkuById(row.id)
      if (res.code === 200) {
        this.$message.success('获取数据成功')
        this.skuInfo = JSON.parse(JSON.stringify(res.data))
      } else {
        this.$message.error('获取列表失败')
      }
    },
    async del(row) {
      const res = await this.$API.sku.deleteSku(row.id)
      if (res.code === 200) {
        this.$message.success('删除成功')
        this.getSkuAllLit()
      } else {
        this.$message.error('删除失败')
      }
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getSkuAllLit()
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.getSkuAllLit()
    },
    async getSkuAllLit() {
      this.loading = true
      const res = await this.$API.sku.getSkuAllList(
        this.currentPage,
        this.pageSize
      )
      this.total = res.data.total
      if (res.code === 200) {
        this.skuAllList = res.data.records
      } else {
        this.$message.error('获取SKU列表失败')
      }
      this.loading = false
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
>>>.el-row
    height: 40px;
>>>.el-col
  line-height: 40px;
  &.el-col-5
  font-size: 18px;
  font-weight: bold;
  text-align: right;
  margin-right: 20px;
>>>.el-carousel__item
</style>
