const User = require('../models/user.model');

/**
 * Subscription middleware to check user's subscription status and limits
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const subscriptionMiddleware = async (req, res, next) => {
  try {
    const user = req.user;
    
    // Check if subscription is active
    if (user.subscriptionStatus !== 'active' && user.subscriptionStatus !== 'trial') {
      return res.status(402).json({
        status: 'error',
        message: 'Your subscription is inactive. Please upgrade your plan to continue.'
      });
    }
    
    // Check if trial has expired
    if (user.subscriptionStatus === 'trial' && user.trialEndsAt && new Date(user.trialEndsAt) < new Date()) {
      return res.status(402).json({
        status: 'error',
        message: 'Your trial period has expired. Please upgrade to a paid plan to continue.'
      });
    }
    
    // Check usage limits based on subscription tier
    if (user.subscriptionTier === 'basic' || user.subscriptionTier === 'free') {
      // For basic tier, check monthly content generation limit
      // This would typically query a usage tracking table to count this month's usage
      // For MVP, we'll implement a simplified version
      
      // TODO: Implement actual usage tracking
      // For now, we'll just let it pass
    }
    
    // All checks passed, proceed
    next();
  } catch (error) {
    console.error('Subscription middleware error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error checking subscription status.'
    });
  }
};

module.exports = {
  subscriptionMiddleware
};
