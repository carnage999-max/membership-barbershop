import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { apiResponse, apiError, withAuth } from '@/lib/middleware';
import { sendEmail, queueUpdateEmail } from '@/lib/email';

const joinQueueSchema = z.object({
  locationId: z.string().uuid(),
  stylistId: z.string().uuid().optional(),
});

export const POST = withAuth(async (req) => {
  try {
    if (!req.user) {
      return apiError('Unauthorized', 401);
    }

    const body = await req.json();
    const validatedData = joinQueueSchema.parse(body);

    // Check if user already in queue
    const existingQueue = await prisma.queueEntry.findFirst({
      where: {
        userId: req.user.userId,
        status: {
          in: ['WAITING', 'CALLED'],
        },
      },
    });

    if (existingQueue) {
      return apiError('You are already in a queue', 400);
    }

    // Get current queue position
    const currentQueueCount = await prisma.queueEntry.count({
      where: {
        locationId: validatedData.locationId,
        status: {
          in: ['WAITING', 'CALLED'],
        },
      },
    });

    const position = currentQueueCount + 1;

    // Calculate estimated wait time
    const stylistCount = await prisma.stylist.count({
      where: {
        locationId: validatedData.locationId,
        onShift: true,
      },
    });

    const avgCutTime = 20;
    const estimatedWait = stylistCount > 0
      ? Math.ceil((position * avgCutTime) / stylistCount)
      : 0;

    const confidenceBandMin = Math.max(0, estimatedWait - 3);
    const confidenceBandMax = estimatedWait + 5;

    // Create queue entry
    const queueEntry = await prisma.queueEntry.create({
      data: {
        locationId: validatedData.locationId,
        userId: req.user.userId,
        position,
        estimatedWait,
        confidenceBandMin,
        confidenceBandMax,
        stylistId: validatedData.stylistId,
        status: 'WAITING',
      },
      include: {
        location: {
          select: {
            name: true,
          },
        },
      },
    });

    // Get user details for email
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { firstName: true, email: true },
    });

    // Send confirmation email
    if (user) {
      await sendEmail({
        to: user.email,
        subject: 'You\'re in the queue!',
        html: queueUpdateEmail(
          user.firstName,
          position,
          estimatedWait,
          queueEntry.location.name
        ),
      });
    }

    return apiResponse({
      queueEntry: {
        id: queueEntry.id,
        position: queueEntry.position,
        estimatedWait: queueEntry.estimatedWait,
        confidenceBand: [confidenceBandMin, confidenceBandMax],
        status: queueEntry.status,
        locationName: queueEntry.location.name,
      },
      message: 'Successfully joined the queue',
    }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(`Validation error: ${error.errors.map(e => e.message).join(', ')}`, 400);
    }

    console.error('Error joining queue:', error);
    return apiError('Failed to join queue', 500);
  }
});
