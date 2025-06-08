const ShopifyAPI = require('shopify-api-node');
require('dotenv').config();

/**
 * Shopify Platform Integration Service
 */
class ShopifyService {
  /**
   * Initialize Shopify client for a specific store
   * @param {Object} platformData - Platform connection data
   * @returns {Object} - Shopify client instance
   */
  initializeClient(platformData) {
    try {
      return new ShopifyAPI({
        shopName: this.extractShopName(platformData.url),
        accessToken: platformData.accessToken,
        apiVersion: '2023-10' // Update as needed
      });
    } catch (error) {
      console.error('Error initializing Shopify client:', error);
      throw new Error(`Failed to initialize Shopify client: ${error.message}`);
    }
  }

  /**
   * Extract shop name from Shopify URL
   * @param {string} url - Shopify store URL
   * @returns {string} - Shop name
   */
  extractShopName(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.split('.')[0];
    } catch (error) {
      throw new Error(`Invalid Shopify URL: ${error.message}`);
    }
  }

  /**
   * Get store information
   * @param {Object} platformData - Platform connection data
   * @returns {Promise<Object>} - Store information
   */
  async getStoreInfo(platformData) {
    try {
      const shopify = this.initializeClient(platformData);
      const shop = await shopify.shop.get();
      return shop;
    } catch (error) {
      console.error('Error fetching Shopify store info:', error);
      throw new Error(`Failed to fetch store info: ${error.message}`);
    }
  }

  /**
   * Get products from store
   * @param {Object} platformData - Platform connection data
   * @param {Object} options - Query options
   * @returns {Promise<Array>} - List of products
   */
  async getProducts(platformData, options = {}) {
    try {
      const shopify = this.initializeClient(platformData);
      const products = await shopify.product.list(options);
      return products;
    } catch (error) {
      console.error('Error fetching Shopify products:', error);
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  }

  /**
   * Update product description
   * @param {Object} platformData - Platform connection data
   * @param {string} productId - Product ID
   * @param {string} description - New product description
   * @returns {Promise<Object>} - Updated product
   */
  async updateProductDescription(platformData, productId, description) {
    try {
      const shopify = this.initializeClient(platformData);
      const product = await shopify.product.update(productId, {
        body_html: description
      });
      return product;
    } catch (error) {
      console.error('Error updating Shopify product description:', error);
      throw new Error(`Failed to update product description: ${error.message}`);
    }
  }

  /**
   * Create a blog post
   * @param {Object} platformData - Platform connection data
   * @param {Object} blogData - Blog post data
   * @returns {Promise<Object>} - Created blog post
   */
  async createBlogPost(platformData, blogData) {
    try {
      const shopify = this.initializeClient(platformData);
      
      // Get the first blog
      const blogs = await shopify.blog.list();
      if (blogs.length === 0) {
        throw new Error('No blog found in the store');
      }
      
      const blogId = blogs[0].id;
      
      const article = await shopify.article.create(blogId, {
        title: blogData.title,
        author: blogData.author || 'Store Owner',
        body_html: blogData.content,
        published: blogData.published || false,
        tags: blogData.tags || []
      });
      
      return article;
    } catch (error) {
      console.error('Error creating Shopify blog post:', error);
      throw new Error(`Failed to create blog post: ${error.message}`);
    }
  }

  /**
   * Create or update a discount
   * @param {Object} platformData - Platform connection data
   * @param {Object} discountData - Discount data
   * @returns {Promise<Object>} - Created/updated discount
   */
  async createDiscount(platformData, discountData) {
    try {
      const shopify = this.initializeClient(platformData);
      
      const priceRule = await shopify.priceRule.create({
        title: discountData.title,
        target_type: discountData.targetType || 'line_item',
        target_selection: discountData.targetSelection || 'all',
        allocation_method: discountData.allocationType || 'across',
        value_type: discountData.valueType || 'percentage',
        value: discountData.value,
        customer_selection: 'all',
        starts_at: discountData.startsAt || new Date().toISOString(),
        ends_at: discountData.endsAt || null
      });
      
      // Create discount code for the price rule
      const discountCode = await shopify.discountCode.create(priceRule.id, {
        code: discountData.code
      });
      
      return {
        priceRule,
        discountCode
      };
    } catch (error) {
      console.error('Error creating Shopify discount:', error);
      throw new Error(`Failed to create discount: ${error.message}`);
    }
  }

  /**
   * Update product pricing
   * @param {Object} platformData - Platform connection data
   * @param {string} productId - Product ID
   * @param {Object} pricingData - Pricing data
   * @returns {Promise<Object>} - Updated product
   */
  async updateProductPricing(platformData, productId, pricingData) {
    try {
      const shopify = this.initializeClient(platformData);
      
      // Get product variants
      const product = await shopify.product.get(productId);
      const variantId = product.variants[0].id;
      
      // Update variant price
      const updatedVariant = await shopify.productVariant.update(variantId, {
        price: pricingData.price,
        compare_at_price: pricingData.compareAtPrice || null
      });
      
      return updatedVariant;
    } catch (error) {
      console.error('Error updating Shopify product pricing:', error);
      throw new Error(`Failed to update product pricing: ${error.message}`);
    }
  }

  /**
   * Get store theme data
   * @param {Object} platformData - Platform connection data
   * @returns {Promise<Object>} - Theme data
   */
  async getThemeData(platformData) {
    try {
      const shopify = this.initializeClient(platformData);
      
      // Get main theme
      const themes = await shopify.theme.list();
      const mainTheme = themes.find(theme => theme.role === 'main');
      
      if (!mainTheme) {
        throw new Error('No main theme found');
      }
      
      return mainTheme;
    } catch (error) {
      console.error('Error fetching Shopify theme data:', error);
      throw new Error(`Failed to fetch theme data: ${error.message}`);
    }
  }
}

module.exports = new ShopifyService();
