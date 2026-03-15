import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/middleware";
import { z } from "zod";

const stylistUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  locationId: z.string().uuid().optional(),
  bio: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  avgCutTime: z.number().int().positive().optional(),
  onShift: z.boolean().optional(),
  onBreak: z.boolean().optional(),
});

export const PATCH = withAdmin(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = stylistUpdateSchema.parse(body);

    const stylist = await prisma.stylist.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({ stylist });
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

    await prisma.stylist.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Stylist deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});
