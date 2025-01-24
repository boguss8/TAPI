import { Router } from 'express';
import {
  getManufacturers,
  getManufacturerById,
  createManufacturer,
  updateManufacturer,
  deleteManufacturer,
} from '../controllers/manufacturers.controller';

const router = Router();

/**
 * @swagger
 * /manufacturers:
 *   get:
 *     summary: Returns all manufacturers
 *     responses:
 *       200:
 *         description: List of manufacturers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Manufacturer'
 *   post:
 *     summary: Create a new manufacturer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Manufacturer'
 *     responses:
 *       201:
 *         description: Created manufacturer
 *
 * /manufacturers/{id}:
 *   get:
 *     summary: Get a manufacturer by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Manufacturer found
 *       404:
 *         description: Manufacturer not found
 *   put:
 *     summary: Update a manufacturer
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
 *             $ref: '#/components/schemas/Manufacturer'
 *     responses:
 *       200:
 *         description: Manufacturer updated successfully
 *       404:
 *         description: Manufacturer not found
 *   delete:
 *     summary: Delete a manufacturer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Manufacturer deleted successfully
 *       404:
 *         description: Manufacturer not found
 *
 * @swagger
 * components:
 *   schemas:
 *     Certificate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         issueDate:
 *           type: string
 *         expiryDate:
 *           type: string
 *         issuingBody:
 *           type: string
 *         certificationNumber:
 *           type: string
 *     Headquarters:
 *       type: object
 *       properties:
 *         city:
 *           type: string
 *         address:
 *           type: string
 *         postalCode:
 *           type: string
 *         country:
 *           type: string
 *     Manufacturer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         country:
 *           type: string
 *         foundedYear:
 *           type: number
 *         website:
 *           type: string
 *         employeeCount:
 *           type: number
 *         isOrganic:
 *           type: boolean
 *         headquarters:
 *           $ref: '#/components/schemas/Headquarters'
 *         certificates:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Certificate'
 *         producedCheeses:
 *           type: array
 *           items:
 *             type: string
 */

router.get('/', getManufacturers, (req, res) =>
  res.status(200).json(res.locals.data)
);
router.get('/:id', getManufacturerById, (req, res) =>
  res
    .status(res.locals.data ? 200 : 404)
    .json(res.locals.data || { error: 'Manufacturer not found' })
);
router.post('/', createManufacturer, (req, res) =>
  res.status(201).json(res.locals.data)
);
router.put('/:id', updateManufacturer, (req, res) =>
  res
    .status(res.locals.data ? 200 : 404)
    .json(res.locals.data || { error: 'Manufacturer not found' })
);
router.delete('/:id', deleteManufacturer, (req, res) =>
  res.status(res.locals.data ? 204 : 404).send()
);

export default router;
