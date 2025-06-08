const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');
const Platform = require('./platform.model');

const Content = sequelize.define('Content', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  platformId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Platform,
      key: 'id',
    },
  },
  contentType: {
    type: DataTypes.ENUM('product_description', 'blog_post', 'store_layout', 'theme_customization', 'pricing', 'discount', 'seasonal_offer', 'referral_code'),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  prompt: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft',
  },
  platformContentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  platformContentUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  scheduledFor: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

// Associations
User.hasMany(Content, { foreignKey: 'userId' });
Content.belongsTo(User, { foreignKey: 'userId' });

Platform.hasMany(Content, { foreignKey: 'platformId' });
Content.belongsTo(Platform, { foreignKey: 'platformId' });

module.exports = Content;
