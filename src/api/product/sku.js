import request from '@/utils/request'

const api_name = '/admin/product'
export default {
  getSpuSaleAttrList(spuId) {
    return request({
      method: 'GET',
      url: `${api_name}/spuSaleAttrList/${spuId}`
    })
  },
  saveSkuInfo(data) {
    return request({
      method: 'POST',
      url: `${api_name}/saveSkuInfo`,
      data
    })
  },
  // 获取SPU对应的SKU列表
  getSkuList(spuId) {
    return request({
      method: 'GET',
      url: `${api_name}/findBySpuId/${spuId}`
    })
  },
  // 获取SKU全部列表
  getSkuAllList(page, limit) {
    return request({
      method: 'GET',
      url: `${api_name}/list/${page}/${limit}`
    })
  },
  // 删除SKU
  deleteSku(skuId) {
    return request({
      method: 'DELETE',
      url: `${api_name}/deleteSku/${skuId}`
    })
  },
  // 获取单个SKU项全部信息
  getSkuById(skuId) {
    return request({
      method: 'GET',
      url: `${api_name}/getSkuById/${skuId}`
    })
  },
  // 上架
  onSale(skuId) {
    return request({
      method: 'GET',
      url: `${api_name}/onSale/${skuId}`
    })
  },
  // 下架
  cancelSale(skuId) {
    return request({
      method: 'GET',
      url: `${api_name}/cancelSale/${skuId}`
    })
  }
}
