import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';
import { apiResponse, apiError } from '@/lib/middleware';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = loginSchema.parse(body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: {
        memberships: {
          where: {
            status: 'ACTIVE',
          },
          include: {
            plan: true,
          },
        },
      },
    });

    if (!user) {
      return apiError('Invalid email or password', 401);
    }

    // Verify password
    const isValidPassword = await verifyPassword(
      validatedData.password,
      user.passwordHash
    );

    if (!isValidPassword) {
      return apiError('Invalid email or password', 401);
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Remove password hash from response
    const { passwordHash, ...userWithoutPassword } = user;

    return apiResponse({
      user: userWithoutPassword,
      token,
      message: 'Login successful',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(`Validation error: ${error.issues.map(e => e.message).join(', ')}`, 400);
    }

    console.error('Login error:', error);
    return apiError('Login failed', 500);
  }
}
