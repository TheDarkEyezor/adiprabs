import { NextResponse } from 'next/server';
import { getSession, isAuthenticated } from '@/utils/auth';

export async function GET() {
  const session = await getSession();
  const authenticated = isAuthenticated(session);
  
  return NextResponse.json({ authenticated });
}


