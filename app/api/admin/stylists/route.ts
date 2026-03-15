import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/middleware";
import { z } from "zod";

const stylistSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  locationId: z.string().uuid(),
  bio: z.string().optional(),
  specialties: z.array(z.string()).default([]),
  avgCutTime: z.number().int().positive().default(30),
  rating: z.number().min(0).max(5).default(5.0),
});

export const POST = withAdmin(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const validatedData = stylistSchema.parse(body);

    const stylist = await prisma.stylist.create({
      data: validatedData,
    });

    return NextResponse.json({ stylist }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});

export const GET = withAdmin(async () => {
  try {
    const stylists = await prisma.stylist.findMany({
      include: { location: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ stylists });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});
