import request from '@/utils/request'

const api_name = '/admin/product/baseTrademark'

export default {
  /*
  获取订单分页列表(带搜索)
  */
  getTradeMarkList(page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get'
    })
  },
  // 添加品牌
  addTradeMark(data) {
    return request({
      url: `${api_name}/save`,
      method: 'POST',
      data
    })
  },
  // 删除品牌
  removeTradeMark(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'DELETE'
    })
  },
  // 修改品牌
  updateTradeMark(data) {
    return request({
      url: `${api_name}/update`,
      method: 'PUT',
      data
    })
  }
}
