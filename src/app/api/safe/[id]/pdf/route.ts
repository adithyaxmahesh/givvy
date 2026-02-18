import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  return new NextResponse(
    'PDF generation is available in the production deployment.',
    {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    }
  );
}
