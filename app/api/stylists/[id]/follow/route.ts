import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse, apiError, withAuth } from '@/lib/middleware';

export const POST = withAuth(async (req) => {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const stylistId = pathParts[pathParts.length - 2];

    if (!req.user) {
      return apiError('Unauthorized', 401);
    }

    // Check if stylist exists
    const stylist = await prisma.stylist.findUnique({
      where: { id: stylistId },
    });

    if (!stylist) {
      return apiError('Stylist not found', 404);
    }

    // Check if already following
    const existingFollow = await prisma.stylistFollow.findUnique({
      where: {
        userId_stylistId: {
          userId: req.user.userId,
          stylistId,
        },
      },
    });

    if (existingFollow) {
      return apiError('Already following this stylist', 400);
    }

    // Create follow
    await prisma.stylistFollow.create({
      data: {
        userId: req.user.userId,
        stylistId,
      },
    });

    return apiResponse({
      message: 'Successfully followed stylist',
      isFollowing: true,
    });
  } catch (error) {
    console.error('Error following stylist:', error);
    return apiError('Failed to follow stylist', 500);
  }
});

export const DELETE = withAuth(async (req) => {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const stylistId = pathParts[pathParts.length - 2];

    if (!req.user) {
      return apiError('Unauthorized', 401);
    }

    await prisma.stylistFollow.delete({
      where: {
        userId_stylistId: {
          userId: req.user.userId,
          stylistId,
        },
      },
    });

    return apiResponse({
      message: 'Successfully unfollowed stylist',
      isFollowing: false,
    });
  } catch (error) {
    console.error('Error unfollowing stylist:', error);
    return apiError('Failed to unfollow stylist', 500);
  }
});
