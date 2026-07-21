import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/admin/mechanics/pending - list mechanics awaiting verification
router.get('/pending', async (req, res) => {
  try {
    const mechanics = await prisma.mechanic.findMany({
      where: { isVerified: false },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
    res.json(mechanics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch pending mechanics' });
  }
});

// GET /api/admin/mechanics - list all mechanics (verified + pending)
router.get('/', async (req, res) => {
  try {
    const mechanics = await prisma.mechanic.findMany({
      include: { user: true, garage: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(mechanics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch mechanics' });
  }
});

// PATCH /api/admin/mechanics/:id/verify - approve certification + assign to a garage
router.patch('/:id/verify', async (req, res) => {
  const { id } = req.params;
  const { garageId } = req.body;
  if (!garageId) {
    return res.status(400).json({ error: 'garageId is required to assign the mechanic' });
  }
  try {
    const garage = await prisma.garage.findFirst({
      where: { id: garageId, isActive: true },
    });

    if (!garage) {
      return res.status(400).json({ error: 'Choose an active garage before verifying' });
    }

    const mechanic = await prisma.mechanic.update({
      where: { id },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
        garageId,
      },
      include: { user: true, garage: true },
    });
    res.json(mechanic);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: 'Mechanic not found' });
  }
});

export default router;
