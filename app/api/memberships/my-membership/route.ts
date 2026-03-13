import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse, apiError, withAuth } from '@/lib/middleware';

export const GET = withAuth(async (req) => {
  try {
    if (!req.user) {
      return apiError('Unauthorized', 401);
    }

    const membership = await prisma.userMembership.findFirst({
      where: {
        userId: req.user.userId,
        status: 'ACTIVE',
      },
      include: {
        plan: {
          include: {
            location: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!membership) {
      return apiResponse({
        membership: null,
        message: 'No active membership found',
      });
    }

    return apiResponse({
      membership,
    });
  } catch (error) {
    console.error('Error fetching membership:', error);
    return apiError('Failed to fetch membership', 500);
  }
});
