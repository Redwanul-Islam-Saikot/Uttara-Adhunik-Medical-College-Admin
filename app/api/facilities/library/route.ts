import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Library from '@/lib/models/Library';

export async function GET() {
  try {
    await connectDB();
    const data = await Library.find({}).lean();
    return NextResponse.json(
      { success: true, data },
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

    if (!body.logo || !body.image || !body.boldDescription || !body.normalDescription) {
      return NextResponse.json(
        { success: false, error: 'Logo, Image and Descriptions are required!' },
        { status: 400 }
      );
    }

    const newLibrary = await Library.create(body);
    return NextResponse.json({ success: true, data: newLibrary }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}