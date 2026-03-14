import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { apiResponse, apiError } from '@/lib/middleware';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return apiError('User with this email already exists', 409);
    }

    // Hash password
    const passwordHash = await hashPassword(validatedData.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: 'USER',
    });

    return apiResponse({
      user,
      token,
      message: 'Account created successfully',
    }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(`Validation error: ${error.issues.map(e => e.message).join(', ')}`, 400);
    }

    console.error('Registration error:', error);
    return apiError('Failed to create account', 500);
  }
}
