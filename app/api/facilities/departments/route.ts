import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Department from '@/lib/models/Department';

export async function GET() {
  try {
    await connectDB();
    
    // sort() বাদ দেওয়া হয়েছে যেন মেমোরি লিমিট ওভারফ্লো না হয়
    const departments = await Department.find({}).lean();
    
    return NextResponse.json(
      { success: true, data: departments },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { title, establishedDate, image, btnLink } = body;

    if (!title || !establishedDate || !image) {
      return NextResponse.json(
        { success: false, error: 'Required fields missing' },
        { status: 400 }
      );
    }

    const newDepartment = await Department.create({
      title,
      establishedDate,
      image,
      btnLink: btnLink || '#',
    });

    return NextResponse.json({ success: true, data: newDepartment }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}