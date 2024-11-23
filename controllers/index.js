const { register, login, currentUser , loginGoogle} = require("./auth-controller");
const { createCategory , removeCategory, listCategory } = require("./category-controller");
const { createProduct, listProduct, listbyProduct, removeProduct, searchFilters, updateProduct, readProduct, uploadImages, removeImages } = require("./product-controller")
const { listUser, saveAddress ,saveOrder , userCart , getOrder , getUserCart ,emptyCart,changeRole,changeStatus, updateAddress} = require("./user-controller")
const {changeOrderStatus,getOrderAdmin} = require("./admin-controller")
const {getConfig, createPayment} = require("./stripe-controller")

module.exports = {
  register,
  login,
  currentUser,
  createCategory,
  removeCategory,
  listCategory,
  createProduct,
  listProduct,
  listbyProduct,
  removeProduct,
  searchFilters,
  updateProduct,
  readProduct,
  listUser,
  updateAddress,
  saveOrder,
  userCart,
  getOrder,
  getUserCart,
  emptyCart,
  changeRole,
  changeStatus,
  changeOrderStatus,
  getOrderAdmin,
  uploadImages,
  removeImages,
  getConfig,
  createPayment,
  loginGoogle
};
