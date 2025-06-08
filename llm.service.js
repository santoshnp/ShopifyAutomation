const OpenAI = require('openai');
require('dotenv').config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key',
});

/**
 * LLM Service for generating content using OpenAI
 */
class LLMService {
  /**
   * Generate content based on prompt and content type
   * @param {string} prompt - User prompt for content generation
   * @param {string} contentType - Type of content to generate
   * @param {object} metadata - Additional context for content generation
   * @returns {Promise<string>} - Generated content
   */
  async generateContent(prompt, contentType, metadata = {}) {
    try {
      // Construct system message based on content type
      const systemMessage = this.getSystemMessageForContentType(contentType);
      
      // Construct user message with enhanced prompt
      const enhancedPrompt = this.enhancePrompt(prompt, contentType, metadata);
      
      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: enhancedPrompt }
        ],
        temperature: this.getTemperatureForContentType(contentType),
        max_tokens: this.getMaxTokensForContentType(contentType),
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating content with LLM:', error);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }
  
  /**
   * Get system message based on content type
   * @param {string} contentType - Type of content to generate
   * @returns {string} - System message
   */
  getSystemMessageForContentType(contentType) {
    const systemMessages = {
      product_description: "You are an expert e-commerce copywriter specializing in compelling product descriptions that drive sales. Create engaging, SEO-friendly content that highlights benefits and features.",
      blog_post: "You are a professional blog writer with expertise in creating engaging, informative content that ranks well in search engines. Create content that provides value to readers while incorporating relevant keywords naturally.",
      store_layout: "You are an e-commerce UX expert specializing in store layouts that maximize conversions. Provide detailed layout suggestions with clear section organization.",
      theme_customization: "You are a web design expert specializing in e-commerce themes. Provide specific customization recommendations that enhance brand identity and user experience.",
      pricing: "You are a pricing strategy expert for e-commerce. Provide strategic pricing recommendations that maximize profit while remaining competitive.",
      discount: "You are a marketing expert specializing in e-commerce promotions. Create compelling discount offers that drive sales without sacrificing profit margins.",
      seasonal_offer: "You are a seasonal marketing specialist. Create timely, relevant seasonal promotions that capitalize on holidays or events to drive sales.",
      referral_code: "You are a referral marketing expert. Design referral programs that incentivize existing customers to bring in new customers."
    };
    
    return systemMessages[contentType] || "You are an expert e-commerce content creator. Create high-quality, engaging content based on the user's requirements.";
  }
  
  /**
   * Enhance user prompt with additional context based on content type
   * @param {string} prompt - Original user prompt
   * @param {string} contentType - Type of content to generate
   * @param {object} metadata - Additional context for content generation
   * @returns {string} - Enhanced prompt
   */
  enhancePrompt(prompt, contentType, metadata) {
    let enhancedPrompt = prompt;
    
    // Add content type specific enhancements
    switch (contentType) {
      case 'product_description':
        enhancedPrompt += `\n\nCreate a compelling product description that highlights the key benefits and features. `;
        if (metadata.productName) enhancedPrompt += `Product name: ${metadata.productName}. `;
        if (metadata.category) enhancedPrompt += `Category: ${metadata.category}. `;
        if (metadata.targetAudience) enhancedPrompt += `Target audience: ${metadata.targetAudience}. `;
        break;
        
      case 'blog_post':
        enhancedPrompt += `\n\nCreate an engaging blog post with the following structure:
        - Attention-grabbing introduction
        - 3-5 main sections with subheadings
        - Actionable conclusion
        - Include a call-to-action at the end`;
        break;
        
      case 'pricing':
        enhancedPrompt += `\n\nProvide pricing recommendations with justification. Consider:
        - Market positioning
        - Competitor pricing
        - Value perception
        - Psychological pricing strategies`;
        break;
        
      // Add more content type specific enhancements as needed
    }
    
    // Add business context if available
    if (metadata.businessName) enhancedPrompt += `\n\nBusiness name: ${metadata.businessName}. `;
    if (metadata.businessType) enhancedPrompt += `Business type: ${metadata.businessType}. `;
    if (metadata.brandVoice) enhancedPrompt += `Brand voice: ${metadata.brandVoice}. `;
    
    return enhancedPrompt;
  }
  
  /**
   * Get appropriate temperature setting based on content type
   * @param {string} contentType - Type of content to generate
   * @returns {number} - Temperature value (0-1)
   */
  getTemperatureForContentType(contentType) {
    const temperatures = {
      product_description: 0.7,
      blog_post: 0.8,
      store_layout: 0.4,
      theme_customization: 0.5,
      pricing: 0.3,
      discount: 0.6,
      seasonal_offer: 0.7,
      referral_code: 0.6
    };
    
    return temperatures[contentType] || 0.7;
  }
  
  /**
   * Get appropriate max tokens based on content type
   * @param {string} contentType - Type of content to generate
   * @returns {number} - Max tokens value
   */
  getMaxTokensForContentType(contentType) {
    const maxTokens = {
      product_description: 500,
      blog_post: 2000,
      store_layout: 1000,
      theme_customization: 1000,
      pricing: 800,
      discount: 500,
      seasonal_offer: 800,
      referral_code: 600
    };
    
    return maxTokens[contentType] || 1000;
  }
}

module.exports = new LLMService();
