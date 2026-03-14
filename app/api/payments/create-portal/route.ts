import { NextRequest } from 'next/server';
import { apiResponse, apiError, withAuth } from '@/lib/middleware';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16' as any,
});

export const POST = withAuth(async (req) => {
  try {
    if (!req.user) {
      return apiError('Unauthorized', 401);
    }

    // Since we are mocking user's Stripe IDs right now, 
    // real implementation points to customer ID saved in User table.
    // For demo using test keys, we'll create a new ephemeral customer to show the portal logic, 
    // or return a mock URL.
    
    // Check if the user has an existing test customer, if not create one just to test portal routing.
    // In production, you would fetch req.user.stripeCustomerId from DB.
    // Or fetch User firstName/lastName using Prisma
    const customer = await stripe.customers.create({
      email: req.user.email,
    });

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
    });

    return apiResponse({
      url: session.url,
      message: 'Portal session initialized successfully',
    });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return apiError('Failed to create billing portal session. Please check your Stripe keys.', 500);
  }
});
