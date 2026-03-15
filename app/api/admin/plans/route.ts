import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/middleware";
import { z } from "zod";

const planSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  visitsPerMonth: z.number().int().nonnegative(),
  isUnlimited: z.boolean().default(false),
  includesBackShave: z.boolean().default(false),
  includesMassage: z.boolean().default(false),
  includesHotTowel: z.boolean().default(false),
  queuePriorityLevel: z.number().int().default(1),
  maxVisitsPerDay: z.number().int().default(1),
  mvpAccess: z.boolean().default(false),
  isActive: z.boolean().default(true),
  locationId: z.string().optional(),
});

export const POST = withAdmin(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const validatedData = planSchema.parse(body);

    const slug = validatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const plan = await prisma.membershipPlan.create({
      data: {
        ...validatedData,
        slug
      } as any,
    });

    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});
