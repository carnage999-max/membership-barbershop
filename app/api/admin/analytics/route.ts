import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/middleware";

export const GET = withAdmin(async () => {
  try {
    const [totalUsers, totalMemberships, activeQueue, totalLocations] = await Promise.all([
      prisma.user.count(),
      prisma.userMembership.count({ where: { status: "ACTIVE" } }),
      prisma.queueEntry.count({ where: { status: "WAITING" } }),
      prisma.location.count({ where: { isActive: true } }),
    ]);

    // Simple revenue estimate (this is very basic, just for demonstration)
    const activePlans = await prisma.userMembership.findMany({
      where: { status: "ACTIVE" },
      include: { plan: { select: { price: true } } }
    });
    
    const monthlyRevenue = activePlans.reduce((sum, m) => sum + m.plan.price, 0);

    return NextResponse.json({
      stats: {
        totalUsers,
        activeMemberships: totalMemberships,
        activeQueue,
        totalLocations,
        monthlyRevenue
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});
