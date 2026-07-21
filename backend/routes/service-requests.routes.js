import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const requests = await prisma.serviceRequest.findMany({
      include: {
        customer: { select: { id: true, name: true, email: true } },
        vehicle: true,
        quotes: { include: { garage: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch service requests' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const request = await prisma.serviceRequest.findUnique({
      where: { id: req.params.id },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        vehicle: true,
        quotes: { include: { garage: true } },
      },
    });
    if (!request) return res.status(404).json({ error: 'Service request not found' });
    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch service request' });
  }
});

router.post('/', async (req, res) => {
  const { customerId, vehicleId, description, photoUrl } = req.body;
  if (!customerId || !vehicleId || !description) {
    return res.status(400).json({ error: 'customerId, vehicleId, and description are required' });
  }
  try {
    const request = await prisma.serviceRequest.create({
      data: { customerId, vehicleId, description, photoUrl },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        vehicle: true,
      },
    });
    res.status(201).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create service request' });
  }
});

router.post('/:id/quotes', async (req, res) => {
  const { garageId, price, notes } = req.body;
  if (!garageId || price === undefined) {
    return res.status(400).json({ error: 'garageId and price are required' });
  }
  try {
    const request = await prisma.serviceRequest.findUnique({
      where: { id: req.params.id },
    });
    if (!request) return res.status(404).json({ error: 'Service request not found' });

    const quote = await prisma.quote.create({
      data: {
        serviceRequestId: request.id,
        garageId,
        price: parseFloat(price),
        notes,
      },
      include: { garage: true },
    });
    res.status(201).json(quote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create quote' });
  }
});

router.patch('/quotes/:quoteId/accept', async (req, res) => {
  try {
    const quote = await prisma.quote.update({
      where: { id: req.params.quoteId },
      data: { status: 'ACCEPTED' },
      include: { garage: true, serviceRequest: true },
    });
    res.json(quote);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: 'Quote not found' });
  }
});

export default router;
