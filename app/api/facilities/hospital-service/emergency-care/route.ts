import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import HospitalService from '@/lib/models/HospitalService';

export async function GET() {
  try {
    await connectDB();
    const services = await HospitalService.find().sort({ createdAt: 1 });
    return NextResponse.json({ success: true, data: services });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const service = await HospitalService.create(body);
    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}