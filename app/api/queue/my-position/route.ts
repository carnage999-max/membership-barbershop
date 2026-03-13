import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse, apiError, withAuth } from '@/lib/middleware';

export const GET = withAuth(async (req) => {
  try {
    if (!req.user) {
      return apiError('Unauthorized', 401);
    }

    const queueEntry = await prisma.queueEntry.findFirst({
      where: {
        userId: req.user.userId,
        status: {
          in: ['WAITING', 'CALLED'],
        },
      },
      include: {
        location: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!queueEntry) {
      return apiResponse({
        queueEntry: null,
        message: 'You are not currently in a queue'
      });
    }

    // Recalculate position based on current queue
    const currentPosition = await prisma.queueEntry.count({
      where: {
        locationId: queueEntry.locationId,
        status: {
          in: ['WAITING', 'CALLED'],
        },
        createdAt: {
          lte: queueEntry.createdAt,
        },
      },
    });

    // Update estimated wait time
    const stylistCount = await prisma.stylist.count({
      where: {
        locationId: queueEntry.locationId,
        onShift: true,
      },
    });

    const avgCutTime = 20;
    const estimatedWait = stylistCount > 0
      ? Math.ceil((currentPosition * avgCutTime) / stylistCount)
      : 0;

    return apiResponse({
      queueEntry: {
        id: queueEntry.id,
        position: currentPosition,
        estimatedWait,
        confidenceBand: [
          Math.max(0, estimatedWait - 3),
          estimatedWait + 5
        ],
        status: queueEntry.status,
        location: queueEntry.location,
        createdAt: queueEntry.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching queue position:', error);
    return apiError('Failed to fetch queue position', 500);
  }
});
