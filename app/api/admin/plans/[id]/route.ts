import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdmin, apiResponse, apiError } from '@/lib/middleware';
import { z } from 'zod';

const updatePlanSchema = z.object({
  price: z.number().positive(),
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
});

export const PATCH = withAdmin(async (req, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;

    if (!id) {
      return apiError('Missing plan ID', 400);
    }

    const body = await req.json();
    const validatedData = updatePlanSchema.parse(body);

    const updatedPlan = await prisma.membershipPlan.update({
      where: { id },
      data: validatedData,
    });

    return apiResponse({ plan: updatedPlan, message: 'Plan updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(`Validation error: ${error.issues.map(e => e.message).join(', ')}`, 400);
    }
    console.error('Admin Plan Update Error:', error);
    return apiError('Failed to update plan', 500);
  }
});

export const DELETE = withAdmin(async (req, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    if (!id) return apiError('Missing plan ID', 400);

    await prisma.membershipPlan.delete({
      where: { id },
    });

    return apiResponse({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Admin Plan Delete Error:', error);
    return apiError('Failed to delete plan', 500);
  }
});
