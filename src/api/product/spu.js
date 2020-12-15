import request from '@/utils/request'

const api_name = '/admin/product'
export default {
  // 获取SPU列表
  getSpuList(page, limit, category3Id) {
    return request({
      method: 'GET',
      url: `${api_name}/${page}/${limit}`,
      params: {
        category3Id
      }
    })
  },
  // 获取销售属性列表
  getBaseSaleAttrList() {
    return request({
      method: 'GET',
      url: `${api_name}/baseSaleAttrList`
    })
  },
  // 获取品牌列表
  getTradeMarkList() {
    return request({
      methods: 'GET',
      url: `${api_name}/baseTrademark/getTrademarkList`
    })
  },
  // 保存信息
  saveSpuInfo(data) {
    return request({
      method: 'POST',
      url: `${api_name}/saveSpuInfo`,
      data
    })
  },
  // 删除单行SPU
  delSingleSpu(spuId) {
    return request({
      method: 'DELETE',
      url: `${api_name}/deleteSpu/${spuId}`
    })
  },
  // 获取单行SPU详细信息
  getSpuById(spuId) {
    return request({
      method: 'GET',
      url: `${api_name}/getSpuById/${spuId}`
    })
  },
  // 获取图片列表
  getSpuImageList(spuId) {
    return request({
      method: 'GET',
      url: `${api_name}/spuImageList/${spuId}`
    })
  },
  // 更新SPU
  updateSpuInfo(data) {
    return request({
      method: 'POST',
      url: `${api_name}/updateSpuInfo`,
      data
    })
  }
}
