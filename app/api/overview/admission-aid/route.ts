import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AdmissionAid from '@/lib/models/AdmissionAid';

export async function GET() {
  try {
    await connectDB();
    const data = await AdmissionAid.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newData = await AdmissionAid.create(body);
    return NextResponse.json({ success: true, data: newData }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}