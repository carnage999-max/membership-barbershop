import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse, apiError } from '@/lib/middleware';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const location = await prisma.location.findFirst({
      where: {
        OR: [
          { id: id },
          { slug: id }
        ] as any
      },
      include: {
        stylists: {
          where: { onShift: true },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photoUrl: true,
            specialties: true,
            avgCutTime: true,
            rating: true,
            totalReviews: true,
            onShift: true,
            onBreak: true,
          },
        },
        queue: {
          where: {
            status: {
              in: ['WAITING', 'CALLED'],
            },
          },
        },
        membershipPlans: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
        },
      },
    }) as any;

    if (!location) {
      return apiError('Location not found', 404);
    }

    const queueLength = location.queue.length;
    const stylistCount = location.stylists.length;
    const avgCutTime = 20;

    let currentWaitTime = 0;
    if (stylistCount > 0) {
      currentWaitTime = Math.ceil((queueLength * avgCutTime) / stylistCount);
    }

    const confidenceBand: [number, number] = [
      Math.max(0, currentWaitTime - 3),
      currentWaitTime + 5
    ];

    const { queue, ...locationData } = location;

    return apiResponse({
      location: {
        ...locationData,
        currentWaitTime,
        confidenceBand,
        queueLength,
        stylistsOnShift: stylistCount,
      },
    });
  } catch (error) {
    console.error('Error fetching location:', error);
    return apiError('Failed to fetch location', 500);
  }
}
