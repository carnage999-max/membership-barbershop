import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse, apiError } from '@/lib/middleware';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const locationId = searchParams.get('locationId');
    const onShift = searchParams.get('onShift');

    // Try to get user ID from token (optional)
    const authHeader = req.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    const userPayload = token ? verifyToken(token) : null;

    const where: any = {};
    if (locationId) where.locationId = locationId;
    if (onShift !== null) where.onShift = onShift === 'true';

    const stylists = await prisma.stylist.findMany({
      where,
      include: {
        location: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
          },
        },
        followers: userPayload
          ? {
              where: { userId: userPayload.userId },
              select: { id: true },
            }
          : false,
      },
      orderBy: [
        { onShift: 'desc' },
        { rating: 'desc' },
      ],
    });

    const stylistsWithFollowStatus = stylists.map((stylist: any) => {
      const { followers, ...stylistData } = stylist;
      return {
        ...stylistData,
        isFollowing: userPayload ? (followers as any[]).length > 0 : false,
      };
    });

    return apiResponse({ stylists: stylistsWithFollowStatus });
  } catch (error) {
    console.error('Error fetching stylists:', error);
    return apiError('Failed to fetch stylists', 500);
  }
}
