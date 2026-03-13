import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse, apiError } from '@/lib/middleware';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const locationId = searchParams.get('locationId');

    const where = locationId
      ? { locationId, isActive: true }
      : { isActive: true };

    const plans = await prisma.membershipPlan.findMany({
      where,
      include: {
        location: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true,
          },
        },
      },
      orderBy: {
        price: 'asc',
      },
    });

    return apiResponse({ plans });
  } catch (error) {
    console.error('Error fetching membership plans:', error);
    return apiError('Failed to fetch membership plans', 500);
  }
}
