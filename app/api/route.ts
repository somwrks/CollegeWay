import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json("hello");
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
