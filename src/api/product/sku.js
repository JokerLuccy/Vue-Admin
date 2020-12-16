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
  }
}
