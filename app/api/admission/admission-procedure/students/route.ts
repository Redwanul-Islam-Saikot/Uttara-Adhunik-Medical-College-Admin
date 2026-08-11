import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Students from '@/lib/models/Students';

// GET ALL
export async function GET() {
  try {
    await connectDB();
    const studentsData = await Students.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: studentsData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST NEW
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newData = await Students.create(body);
    return NextResponse.json({ success: true, data: newData }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}