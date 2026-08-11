import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb'; // Apnar database connection helper
import About from '@/lib/models/About';

// GET: Data fetching for frontend & admin
export async function GET() {
  try {
    await connectDB();
    const data = await About.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST / PUT: Data Save or Update from Admin Panel
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Exist korle update korbe, na thakle క్రিয়েট korbe
    const existing = await About.findOne();
    if (existing) {
      const updated = await About.findByIdAndUpdate(existing._id, body, { new: true });
      return NextResponse.json({ success: true, data: updated }, { status: 200 });
    }

    const newData = await About.create(body);
    return NextResponse.json({ success: true, data: newData }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}