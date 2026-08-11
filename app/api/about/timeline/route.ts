import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { TimelineHeader, TimelineItem } from '@/lib/models/Timeline';

export const dynamic = 'force-dynamic';

// এই GET ফাংশনটি না থাকলে 405 Error দেখায়
export async function GET() {
  try {
    await connectDB();
    const header = await TimelineHeader.findOne().sort({ createdAt: -1 });
    const items = await TimelineItem.find().sort({ createdAt: 1 });

    return NextResponse.json({
      success: true,
      data: { header: header || null, items: items || [] },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (body.type === 'header') {
      const existingHeader = await TimelineHeader.findOne();
      if (existingHeader) {
        const updated = await TimelineHeader.findByIdAndUpdate(existingHeader._id, body, { new: true });
        return NextResponse.json({ success: true, data: updated });
      } else {
        const created = await TimelineHeader.create(body);
        return NextResponse.json({ success: true, data: created });
      }
    }

    if (body.type === 'item') {
      const newItem = await TimelineItem.create({ year: body.year, title: body.title });
      return NextResponse.json({ success: true, data: newItem }, { status: 201 });
    }

    return NextResponse.json({ success: false, message: 'Invalid payload type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}