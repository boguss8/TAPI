import { Router } from 'express';
import {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
} from '../controllers/reviews.controller';

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Returns all reviews
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *   post:
 *     summary: Create a new review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Created review
 * 
 * /reviews/{id}:
 *   get:
 *     summary: Get a review by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review found
 *       404:
 *         description: Review not found
 *   put:
 *     summary: Update a review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       404:
 *         description: Review not found
 *   delete:
 *     summary: Delete a review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 * 
 * @swagger
 * components:
 *   schemas:
 *     Reviewer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         purchaseHistory:
 *           type: number
 *     Ratings:
 *       type: object
 *       properties:
 *         flavor:
 *           type: number
 *         texture:
 *           type: number
 *         value:
 *           type: number
 *         packaging:
 *           type: number
 *         overall:
 *           type: number
 *     Review:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         cheeseId:
 *           type: string
 *         reviewer:
 *           $ref: '#/components/schemas/Reviewer'
 *         ratings:
 *           $ref: '#/components/schemas/Ratings'
 *         comment:
 *           type: string
 *         verifiedPurchase:
 *           type: boolean
 *         datePosted:
 *           type: string
 *         helpfulVotes:
 *           type: number
 *         wouldRecommend:
 *           type: boolean
 */

const router = Router();

router.get('/', getReviews, (req, res) => res.status(200).json(res.locals.data));
router.get('/:id', getReviewById, (req, res) => res.status(res.locals.data ? 200 : 404).json(res.locals.data || { error: 'Review not found' }));
router.post('/', createReview, (req, res) => res.status(201).json(res.locals.data));
router.put('/:id', updateReview, (req, res) => res.status(res.locals.data ? 200 : 404).json(res.locals.data || { error: 'Review not found' }));
router.delete('/:id', deleteReview, (req, res) => res.status(res.locals.data ? 204 : 404).send());

export default router;
