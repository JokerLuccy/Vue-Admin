/*
 * @Author: your name
 * @Date: 2020-11-27 09:00:51
 * @LastEditTime: 2020-12-11 15:11:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \shop-admin_base\src\api\index.js
 */
export { default as login } from './acl/login' // {default: {}}
export { default as user } from './acl/user'
export { default as role } from './acl/role'
export { default as permission } from './acl/permission'
export { default as category } from './category'
export { default as clientUser } from './clientUser'
export { default as order } from './order'
export { default as trademark } from './product/trademark'
export { default as attr } from './product/attr'
export { default as spu } from './product/spu'
export { default as sku } from './product/sku'
