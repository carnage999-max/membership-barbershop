import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/middleware";
import { z } from "zod";

const locationSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(2),
  zipCode: z.string().min(5),
  phone: z.string().min(10),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  openTime: z.string().default("09:00"),
  closeTime: z.string().default("20:00"),
  timezone: z.string().default("America/New_York"),
});

export const POST = withAdmin(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const validatedData = locationSchema.parse(body);

    const slug = validatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const location = await prisma.location.create({
      data: {
        ...validatedData,
        slug
      },
    });

    return NextResponse.json({ location }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});

export const GET = withAdmin(async () => {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ locations });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});
