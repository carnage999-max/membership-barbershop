import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { apiResponse, apiError, withAuth } from '@/lib/middleware';

const checkInSchema = z.object({
  locationId: z.string().uuid(),
  stylistId: z.string().uuid().optional(),
  services: z.array(z.string()).min(1),
});

export const POST = withAuth(async (req) => {
  try {
    if (!req.user) {
      return apiError('Unauthorized', 401);
    }

    const body = await req.json();
    const validatedData = checkInSchema.parse(body);

    // Check if user has active membership
    const membership = await prisma.userMembership.findFirst({
      where: {
        userId: req.user.userId,
        status: 'ACTIVE',
      },
      include: {
        plan: true,
      },
    });

    if (!membership) {
      return apiError('Active membership required to check in', 403);
    }

    if (membership.cutsRemaining <= 0) {
      return apiError('No cuts remaining in your membership', 403);
    }

    // Check if user already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingCheckIn = await prisma.checkIn.findFirst({
      where: {
        userId: req.user.userId,
        checkInTime: {
          gte: today,
        },
        status: {
          in: ['CHECKED_IN', 'IN_PROGRESS'],
        },
      },
    });

    if (existingCheckIn) {
      return apiError('You already have an active check-in today', 400);
    }

    // Create check-in
    const checkIn = await prisma.checkIn.create({
      data: {
        userId: req.user.userId,
        locationId: validatedData.locationId,
        stylistId: validatedData.stylistId,
        services: validatedData.services,
        status: 'CHECKED_IN',
      },
      include: {
        location: {
          select: {
            name: true,
            address: true,
          },
        },
        stylist: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return apiResponse({
      checkIn,
      message: 'Checked in successfully',
    }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(`Validation error: ${error.issues.map(e => e.message).join(', ')}`, 400);
    }

    console.error('Error creating check-in:', error);
    return apiError('Failed to check in', 500);
  }
});

export const GET = withAuth(async (req) => {
  try {
    if (!req.user) {
      return apiError('Unauthorized', 401);
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const checkIns = await prisma.checkIn.findMany({
      where: {
        userId: req.user.userId,
      },
      include: {
        location: {
          select: {
            name: true,
            address: true,
            city: true,
            state: true,
          },
        },
        stylist: {
          select: {
            firstName: true,
            lastName: true,
            photoUrl: true,
          },
        },
      },
      orderBy: {
        checkInTime: 'desc',
      },
      take: limit,
    });

    return apiResponse({
      checkIns,
    });
  } catch (error) {
    console.error('Error fetching check-ins:', error);
    return apiError('Failed to fetch check-ins', 500);
  }
});
