import { NextResponse } from 'next/server';
import { connectDB} from '@/lib/mongodb'; // Apnar dbConnect helper
import FacilityService from '@/lib/models/FacilityService';

export async function GET() {
  try {
    await connectDB();
    const services = await FacilityService.find({}).sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ success: true, data: services });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newService = await FacilityService.create(body);
    return NextResponse.json({ success: true, data: newService }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}