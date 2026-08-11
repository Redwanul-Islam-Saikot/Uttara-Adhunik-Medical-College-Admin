import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PrincipalMessage from '@/lib/models/PrincipalMessage';

export async function GET() {
  try {
    await connectDB();
    const data = await PrincipalMessage.findOne().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newMessage = await PrincipalMessage.create(body);
    return NextResponse.json({ success: true, data: newMessage }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}