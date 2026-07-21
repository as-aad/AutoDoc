import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/admin/garages - list all garages (with their mechanics)
router.get('/', async (req, res) => {
  try {
    const garages = await prisma.garage.findMany({
      include: { mechanics: { include: { user: true } } },
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
  const name = req.body.name?.trim();
  const address = req.body.address?.trim();
  const phone = req.body.phone?.trim();
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
  const data = {};
  if (typeof req.body.name === 'string') data.name = req.body.name.trim();
  if (typeof req.body.address === 'string') data.address = req.body.address.trim();
  if (typeof req.body.phone === 'string') data.phone = req.body.phone.trim();
  if (typeof req.body.isActive === 'boolean') data.isActive = req.body.isActive;

  if ('name' in data && !data.name) return res.status(400).json({ error: 'name cannot be empty' });
  if ('address' in data && !data.address) return res.status(400).json({ error: 'address cannot be empty' });
  if ('phone' in data && !data.phone) return res.status(400).json({ error: 'phone cannot be empty' });

  try {
    const garage = await prisma.garage.update({
      where: { id },
      data,
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
