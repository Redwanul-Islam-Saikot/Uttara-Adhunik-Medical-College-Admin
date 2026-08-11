import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import MedicalEducationUnit from '@/lib/models/MU';

export async function GET() {
  try {
    await connectDB();
    const data = await MedicalEducationUnit.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newFacility = await MedicalEducationUnit.create(body);
    return NextResponse.json({ success: true, data: newFacility }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}