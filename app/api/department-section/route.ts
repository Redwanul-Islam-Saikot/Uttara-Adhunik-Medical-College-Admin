import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb'; // আপনার DB Connection Path অনুযায়ী ঠিক করুন
import DepartmentSection from '@/lib/models/DepartmentSection';

export async function GET() {
  try {
    await connectDB();
    const data = await DepartmentSection.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newSection = await DepartmentSection.create(body);

    return NextResponse.json({ success: true, data: newSection }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}