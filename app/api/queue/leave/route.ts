import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse, apiError, withAuth } from '@/lib/middleware';

export const DELETE = withAuth(async (req) => {
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
    });

    if (!queueEntry) {
      return apiError('You are not in a queue', 404);
    }

    // Update status to cancelled
    await prisma.queueEntry.update({
      where: { id: queueEntry.id },
      data: {
        status: 'CANCELLED',
        completedAt: new Date(),
      },
    });

    return apiResponse({
      message: 'Successfully left the queue',
    });
  } catch (error) {
    console.error('Error leaving queue:', error);
    return apiError('Failed to leave queue', 500);
  }
});
