const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { subscriptionMiddleware } = require('../middleware/subscription.middleware');

/**
 * @swagger
 * /api/content:
 *   get:
 *     summary: Get all content for a user
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: platformId
 *         schema:
 *           type: string
 *         description: Filter by platform ID
 *       - in: query
 *         name: contentType
 *         schema:
 *           type: string
 *         description: Filter by content type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of content items
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, contentController.getAllContent);

/**
 * @swagger
 * /api/content/{id}:
 *   get:
 *     summary: Get content by ID
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Content ID
 *     responses:
 *       200:
 *         description: Content details
 *       404:
 *         description: Content not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', authMiddleware, contentController.getContentById);

/**
 * @swagger
 * /api/content/generate:
 *   post:
 *     summary: Generate content using LLM
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - platformId
 *               - contentType
 *               - prompt
 *             properties:
 *               platformId:
 *                 type: string
 *               contentType:
 *                 type: string
 *               prompt:
 *                 type: string
 *               title:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Content generated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       402:
 *         description: Subscription limit reached
 */
router.post('/generate', authMiddleware, subscriptionMiddleware, contentController.generateContent);

/**
 * @swagger
 * /api/content/{id}/publish:
 *   post:
 *     summary: Publish content to platform
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Content ID
 *     responses:
 *       200:
 *         description: Content published successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Content not found
 */
router.post('/:id/publish', authMiddleware, subscriptionMiddleware, contentController.publishContent);

/**
 * @swagger
 * /api/content/{id}:
 *   put:
 *     summary: Update content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Content ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               status:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Content updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Content not found
 */
router.put('/:id', authMiddleware, contentController.updateContent);

/**
 * @swagger
 * /api/content/{id}:
 *   delete:
 *     summary: Delete content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Content ID
 *     responses:
 *       200:
 *         description: Content deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Content not found
 */
router.delete('/:id', authMiddleware, contentController.deleteContent);

module.exports = router;
