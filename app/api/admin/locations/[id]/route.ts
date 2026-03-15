import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/middleware";
import { z } from "zod";

const locationUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(2).optional(),
  zipCode: z.string().min(5).optional(),
  phone: z.string().min(10).optional(),
  isActive: z.boolean().optional(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
  timezone: z.string().optional(),
});

export const PATCH = withAdmin(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = locationUpdateSchema.parse(body);

    const location = await prisma.location.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({ location });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});

export const DELETE = withAdmin(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;

    await prisma.location.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Location deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});
