import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/admin/garages - list all garages (with their mechanics)
router.get('/', async (req, res) => {
  try {
    const garages = await prisma.garage.findMany({
      include: { mechanics: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(garages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch garages' });
  }
});

// POST /api/admin/garages - create a garage
router.post('/', async (req, res) => {
  const { name, address, phone } = req.body;
  if (!name || !address || !phone) {
    return res.status(400).json({ error: 'name, address, and phone are required' });
  }
  try {
    const garage = await prisma.garage.create({ data: { name, address, phone } });
    res.status(201).json(garage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create garage' });
  }
});

// PATCH /api/admin/garages/:id - update a garage
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, address, phone, isActive } = req.body;
  try {
    const garage = await prisma.garage.update({
      where: { id },
      data: { name, address, phone, isActive },
    });
    res.json(garage);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: 'Garage not found' });
  }
});

// DELETE /api/admin/garages/:id - deactivate (soft delete) a garage
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const garage = await prisma.garage.update({
      where: { id },
      data: { isActive: false },
    });
    res.json(garage);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: 'Garage not found' });
  }
});

export default router;
