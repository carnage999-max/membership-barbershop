import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader, JWTPayload } from './auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export function withAuth(
  handler: (req: AuthenticatedRequest, context: any) => Promise<NextResponse>
) {
  return async (req: AuthenticatedRequest, context: any) => {
    const authHeader = req.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    req.user = payload;
    return handler(req, context);
  };
}

export function withAdmin(
  handler: (req: AuthenticatedRequest, context: any) => Promise<NextResponse>
) {
  return withAuth(async (req: AuthenticatedRequest, context: any) => {
    if (req.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }
    return handler(req, context);
  });
}

export function apiResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}

export function apiError(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}
