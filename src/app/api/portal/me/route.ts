import { NextRequest, NextResponse } from 'next/server';
import { requirePortalUser } from '@/lib/portal/guard';

export async function GET(request: NextRequest) {
  const { user, error } = requirePortalUser(request);
  if (error) return error;
  return NextResponse.json({ user });
}
