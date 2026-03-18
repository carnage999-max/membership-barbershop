import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { apiResponse, apiError, withAuth } from '@/lib/middleware';
import { sendEmail, membershipActivatedEmail } from '@/lib/email';

const subscribeSchema = z.object({
  planId: z.string().uuid(),
  paymentMethodId: z.string(), // Stripe payment method ID
});

export const POST = withAuth(async (req) => {
  try {
    if (!req.user) {
      return apiError('Unauthorized', 401);
    }

    const body = await req.json();
    const validatedData = subscribeSchema.parse(body);

    // Check if user already has an active membership
    const existingMembership = await prisma.userMembership.findFirst({
      where: {
        userId: req.user.userId,
        status: 'ACTIVE',
      },
    });

    if (existingMembership) {
      return apiError('You already have an active membership', 400);
    }

    // Get plan details
    const plan = await prisma.membershipPlan.findUnique({
      where: { id: validatedData.planId },
      include: {
        location: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!plan || !plan.isActive) {
      return apiError('Membership plan not found or inactive', 404);
    }

    // TODO: Process payment with Stripe
    // For now, we'll simulate a successful payment
    // In production, you would:
    // 1. Create a Stripe customer if not exists
    // 2. Attach payment method to customer
    // 3. Create a subscription in Stripe
    // 4. Handle webhook for confirmation

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: req.user.userId,
        amount: plan.price,
        currency: 'usd',
        status: 'SUCCEEDED',
        paymentMethod: validatedData.paymentMethodId,
        description: `${plan.name} Membership - ${plan.location.name}`,
        metadata: {
          planId: plan.id,
          planName: plan.name,
        },
      },
    });

    // Create membership
    const membership = await prisma.userMembership.create({
      data: {
        userId: req.user.userId,
        planId: plan.id,
        status: 'ACTIVE',
        startDate: new Date(),
        cutsRemaining: plan.visitsPerMonth,
        billingCycle: 'monthly',
        autoRenew: true,
      },
      include: {
        plan: {
          include: {
            location: true,
          },
        },
      },
    });

    // Get user details for email
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { firstName: true, email: true },
    });

    // Send activation email
    if (user) {
      await sendEmail({
        to: user.email,
        subject: 'Welcome to Man Cave Barber Shop!',
        html: membershipActivatedEmail(
          user.firstName,
          plan.name,
          plan.visitsPerMonth
        ),
      });
    }

    // Create notification record
    await prisma.notification.create({
      data: {
        userId: req.user.userId,
        type: 'MEMBERSHIP_ACTIVATED',
        channel: 'EMAIL',
        recipient: user?.email || '',
        subject: 'Welcome to Man Cave Barber Shop!',
        message: `Your ${plan.name} grade is now active.`,
        status: 'SENT',
        sentAt: new Date(),
      },
    });

    return apiResponse({
      membership,
      payment,
      message: 'Membership activated successfully',
    }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(`Validation error: ${error.issues.map(e => e.message).join(', ')}`, 400);
    }

    console.error('Error creating membership:', error);
    return apiError('Failed to create membership', 500);
  }
});
