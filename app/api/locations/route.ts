import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse, apiError } from '@/lib/middleware';

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    const locations = await prisma.location.findMany({
      where: { isActive: true },
      include: {
        queue: {
          where: {
            status: {
              in: ['WAITING', 'CALLED'],
            },
          },
        },
        stylists: {
          where: { onShift: true },
        },
      },
    });

    // Calculate wait times and distances
    const locationsWithData = locations.map((location: any) => {
      const queueLength = location.queue.length;
      const stylistCount = location.stylists.length;
      const avgCutTime = 20; // Average cut time in minutes

      let currentWaitTime = 0;
      let status: 'available' | 'limited' | 'high' | 'closed' = 'available';

      if (stylistCount === 0) {
        status = 'closed';
        currentWaitTime = 0;
      } else {
        currentWaitTime = Math.ceil((queueLength * avgCutTime) / stylistCount);

        if (currentWaitTime > 45) status = 'high';
        else if (currentWaitTime > 20) status = 'limited';
        else status = 'available';
      }

      const confidenceBand: [number, number] = [
        Math.max(0, currentWaitTime - 3),
        currentWaitTime + 5
      ];

      let distance: number | undefined;
      if (lat && lng && location.latitude && location.longitude) {
        distance = calculateDistance(
          parseFloat(lat),
          parseFloat(lng),
          location.latitude,
          location.longitude
        );
      }

      const { queue, stylists, ...locationData } = location;

      return {
        ...locationData,
        currentWaitTime,
        confidenceBand,
        status,
        queueLength,
        stylistsOnShift: stylistCount,
        distance,
      };
    });

    // Sort by distance if coordinates provided
    if (lat && lng) {
      locationsWithData.sort((a, b) => {
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      });
    }

    return apiResponse({ locations: locationsWithData });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return apiError('Failed to fetch locations', 500);
  }
}
