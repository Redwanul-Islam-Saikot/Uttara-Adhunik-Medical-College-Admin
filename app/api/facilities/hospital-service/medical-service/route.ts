import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb'; // আপনার DB Connection ফাইল
import MedicalService from '@/lib/models/MedicalService';

export async function GET() {
  try {
    await connectDB();
    const data = await MedicalService.find({}).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newService = await MedicalService.create(body);
    return NextResponse.json({ success: true, data: newService }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}