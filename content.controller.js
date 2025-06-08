const llmService = require('../services/llm.service');
const Content = require('../models/content.model');
const Platform = require('../models/platform.model');
const shopifyService = require('../services/platforms/shopify.service');

/**
 * Content controller for handling content-related operations
 */
class ContentController {
  /**
   * Get all content for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllContent(req, res) {
    try {
      const { platformId, contentType, status } = req.query;
      const userId = req.user.id;
      
      // Build query filters
      const filters = { userId };
      if (platformId) filters.platformId = platformId;
      if (contentType) filters.contentType = contentType;
      if (status) filters.status = status;
      
      const content = await Content.findAll({
        where: filters,
        include: [{ model: Platform }],
        order: [['createdAt', 'DESC']]
      });
      
      return res.status(200).json({
        status: 'success',
        data: content
      });
    } catch (error) {
      console.error('Error fetching content:', error);
      return res.status(500).json({
        status: 'error',
        message: `Failed to fetch content: ${error.message}`
      });
    }
  }
  
  /**
   * Get content by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getContentById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const content = await Content.findOne({
        where: { id, userId },
        include: [{ model: Platform }]
      });
      
      if (!content) {
        return res.status(404).json({
          status: 'error',
          message: 'Content not found'
        });
      }
      
      return res.status(200).json({
        status: 'success',
        data: content
      });
    } catch (error) {
      console.error('Error fetching content by ID:', error);
      return res.status(500).json({
        status: 'error',
        message: `Failed to fetch content: ${error.message}`
      });
    }
  }
  
  /**
   * Generate content using LLM
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async generateContent(req, res) {
    try {
      const { platformId, contentType, prompt, title, metadata = {} } = req.body;
      const userId = req.user.id;
      
      // Validate required fields
      if (!platformId || !contentType || !prompt) {
        return res.status(400).json({
          status: 'error',
          message: 'Platform ID, content type, and prompt are required'
        });
      }
      
      // Check if platform exists and belongs to user
      const platform = await Platform.findOne({
        where: { id: platformId, userId }
      });
      
      if (!platform) {
        return res.status(404).json({
          status: 'error',
          message: 'Platform not found'
        });
      }
      
      // Add business context to metadata
      const enhancedMetadata = {
        ...metadata,
        businessName: req.user.businessName,
        businessType: req.user.businessType
      };
      
      // Generate content using LLM service
      const generatedContent = await llmService.generateContent(prompt, contentType, enhancedMetadata);
      
      // Create content record
      const content = await Content.create({
        userId,
        platformId,
        contentType,
        title: title || `Generated ${contentType.replace('_', ' ')}`,
        content: generatedContent,
        prompt,
        status: 'draft',
        metadata: enhancedMetadata
      });
      
      return res.status(201).json({
        status: 'success',
        message: 'Content generated successfully',
        data: content
      });
    } catch (error) {
      console.error('Error generating content:', error);
      return res.status(500).json({
        status: 'error',
        message: `Failed to generate content: ${error.message}`
      });
    }
  }
  
  /**
   * Publish content to platform
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async publishContent(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      // Find content
      const content = await Content.findOne({
        where: { id, userId },
        include: [{ model: Platform }]
      });
      
      if (!content) {
        return res.status(404).json({
          status: 'error',
          message: 'Content not found'
        });
      }
      
      // Get platform data
      const platform = content.Platform;
      
      // Handle different platform types
      let publishResult;
      switch (platform.platformType) {
        case 'shopify':
          publishResult = await this.publishToShopify(content, platform);
          break;
        case 'wordpress':
          // TODO: Implement WordPress publishing
          return res.status(501).json({
            status: 'error',
            message: 'WordPress publishing not implemented yet'
          });
        case 'wix':
          // TODO: Implement Wix publishing
          return res.status(501).json({
            status: 'error',
            message: 'Wix publishing not implemented yet'
          });
        case 'squarespace':
          // TODO: Implement Squarespace publishing
          return res.status(501).json({
            status: 'error',
            message: 'Squarespace publishing not implemented yet'
          });
        default:
          return res.status(400).json({
            status: 'error',
            message: `Unsupported platform type: ${platform.platformType}`
          });
      }
      
      // Update content status and platform-specific IDs
      await content.update({
        status: 'published',
        publishedAt: new Date(),
        platformContentId: publishResult.id || publishResult.platformContentId,
        platformContentUrl: publishResult.url || publishResult.platformContentUrl
      });
      
      return res.status(200).json({
        status: 'success',
        message: 'Content published successfully',
        data: {
          content: await Content.findByPk(id),
          publishResult
        }
      });
    } catch (error) {
      console.error('Error publishing content:', error);
      return res.status(500).json({
        status: 'error',
        message: `Failed to publish content: ${error.message}`
      });
    }
  }
  
  /**
   * Publish content to Shopify
   * @param {Object} content - Content object
   * @param {Object} platform - Platform object
   * @returns {Promise<Object>} - Publish result
   */
  async publishToShopify(content, platform) {
    const platformData = {
      url: platform.url,
      accessToken: platform.accessToken
    };
    
    switch (content.contentType) {
      case 'product_description':
        // Extract product ID from metadata
        const productId = content.metadata.productId;
        if (!productId) {
          throw new Error('Product ID is required in metadata');
        }
        return await shopifyService.updateProductDescription(platformData, productId, content.content);
        
      case 'blog_post':
        return await shopifyService.createBlogPost(platformData, {
          title: content.title,
          content: content.content,
          author: content.metadata.author,
          tags: content.metadata.tags,
          published: true
        });
        
      case 'pricing':
        const pricingProductId = content.metadata.productId;
        if (!pricingProductId) {
          throw new Error('Product ID is required in metadata');
        }
        return await shopifyService.updateProductPricing(platformData, pricingProductId, {
          price: content.metadata.price,
          compareAtPrice: content.metadata.compareAtPrice
        });
        
      case 'discount':
        return await shopifyService.createDiscount(platformData, {
          title: content.title,
          code: content.metadata.code || content.title.replace(/\s+/g, '_').toUpperCase(),
          value: content.metadata.value,
          valueType: content.metadata.valueType || 'percentage',
          startsAt: content.metadata.startsAt,
          endsAt: content.metadata.endsAt
        });
        
      default:
        throw new Error(`Content type ${content.contentType} not supported for Shopify publishing`);
    }
  }
  
  /**
   * Update content
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateContent(req, res) {
    try {
      const { id } = req.params;
      const { title, content, status, metadata } = req.body;
      const userId = req.user.id;
      
      // Find content
      const contentRecord = await Content.findOne({
        where: { id, userId }
      });
      
      if (!contentRecord) {
        return res.status(404).json({
          status: 'error',
          message: 'Content not found'
        });
      }
      
      // Update content
      const updateData = {};
      if (title) updateData.title = title;
      if (content) updateData.content = content;
      if (status) updateData.status = status;
      if (metadata) updateData.metadata = { ...contentRecord.metadata, ...metadata };
      
      await contentRecord.update(updateData);
      
      return res.status(200).json({
        status: 'success',
        message: 'Content updated successfully',
        data: await Content.findByPk(id)
      });
    } catch (error) {
      console.error('Error updating content:', error);
      return res.status(500).json({
        status: 'error',
        message: `Failed to update content: ${error.message}`
      });
    }
  }
  
  /**
   * Delete content
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteContent(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      // Find content
      const content = await Content.findOne({
        where: { id, userId }
      });
      
      if (!content) {
        return res.status(404).json({
          status: 'error',
          message: 'Content not found'
        });
      }
      
      // Delete content
      await content.destroy();
      
      return res.status(200).json({
        status: 'success',
        message: 'Content deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting content:', error);
      return res.status(500).json({
        status: 'error',
        message: `Failed to delete content: ${error.message}`
      });
    }
  }
}

module.exports = new ContentController();
