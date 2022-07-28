var product = require("../models/product");

var productService = {

  /**
   * Gets product by id.
   *
   * @since 1.0.0
   * @param {string} productId id of the product.
   * @return {object} productData
   */
  getProductById: async function(productId) {
    var productData;
    if(productId){
      productData = await product.getProductById(productId);
    }
    return productData;
  },

  /**
   * Returns products.
   *
   * @since 1.0.0
   * @param {int} nProducts number of products.
   * @param {string} cursor current cursor.
   * @param {string} search query
   * @return {Array}
   */
  getProducts: async function (nProducts, cursor, searchQuery) {
    const products = await product.getProducts(nProducts, cursor, searchQuery);
    return products;
  },

};



module.exports = productService;
