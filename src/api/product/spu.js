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
  }
}
