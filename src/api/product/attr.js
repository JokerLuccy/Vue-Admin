import request from '@/utils/request'
const api_name = '/admin/product'
export default {
  // 获取一级分类列表
  getCategory1() {
    return request({
      method: 'GET',
      url: `${api_name}/getCategory1`
    })
  },
  /**
   * @param {Number} category1Id 一级分类ID
   */
  getCategory2(category1Id) {
    return request({
      method: 'GET',
      url: `${api_name}/getCategory2/${category1Id}`
    })
  },
  /**
   *
   * @param {Number} category2Id 二级分类ID
   */
  getCategory3(category2Id) {
    return request({
      method: 'GET',
      url: `${api_name}/getCategory3/${category2Id}`
    })
  },
  /**
   *
   * @param {Number} category1Id  一级分类列表ID
   * @param {Number} category2Id  二级分类列表ID
   * @param {Number} category3Id  三级分类列表ID
   */
  getAttrInfoList(category1Id, category2Id, category3Id) {
    return request({
      method: 'GET',
      url: `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
    })
  },
  /**
   *
   * @param {Number} attrId  属性ID
   */
  deleteAttr(attrId) {
    return request({
      method: 'DELETE',
      url: `${api_name}/deleteAttr/${attrId}`
    })
  },
  /**
   *
   * @param {Object} data 修改后的数据
   */
  saveAttrInfo(data) {
    return request({
      method: 'POST',
      url: `${api_name}/saveAttrInfo`,
      data
    })
  }
}
