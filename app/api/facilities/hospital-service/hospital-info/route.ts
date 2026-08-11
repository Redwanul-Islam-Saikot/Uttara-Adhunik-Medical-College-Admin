import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import HospitalInfo from '@/lib/models/Hospitalinfo';

export async function GET() {
  try {
    await connectDB();
    const data = await HospitalInfo.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newRecord = await HospitalInfo.create(body);
    return NextResponse.json({ success: true, data: newRecord }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}