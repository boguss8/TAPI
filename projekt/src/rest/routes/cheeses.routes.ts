import { Router } from 'express';
import {
  getCheeses,
  getCheeseById,
  createCheese,
  updateCheese,
  deleteCheese
} from '../controllers/cheeses.controller';

const router = Router();

/**
 * @swagger
 * /cheeses:
 *   get:
 *     summary: Returns all cheeses
 *     responses:
 *       200:
 *         description: List of cheeses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cheese'
 *   post:
 *     summary: Create a new cheese
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cheese'
 *     responses:
 *       201:
 *         description: Cheese created successfully
 * 
 * /cheeses/{id}:
 *   get:
 *     summary: Get a cheese by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cheese found
 *       404:
 *         description: Cheese not found
 *   put:
 *     summary: Update a cheese
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
 *             $ref: '#/components/schemas/Cheese'
 *     responses:
 *       200:
 *         description: Cheese updated successfully
 *       404:
 *         description: Cheese not found
 *   delete:
 *     summary: Delete a cheese
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Cheese deleted successfully
 *       404:
 *         description: Cheese not found
 */
router.get('/', getCheeses, (req, res) => res.status(200).json(res.locals.data));

/**
 * @swagger
 * components:
 *   schemas:
 *     Cheese:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         type:
 *           type: string
 *         ageInMonths:
 *           type: number
 *         price:
 *           type: number
 */
router.get('/:id', getCheeseById, (req, res) => res.status(res.locals.data ? 200 : 404).json(res.locals.data || { error: 'Cheese not found' }));
router.post('/', createCheese, (req, res) => res.status(201).json(res.locals.data));
router.put('/:id', updateCheese, (req, res) => res.status(res.locals.data ? 200 : 404).json(res.locals.data || { error: 'Cheese not found' }));
router.delete('/:id', deleteCheese, (req, res) => res.status(res.locals.data ? 204 : 404).send());

export default router;
