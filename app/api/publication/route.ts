// app/api/publication/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Publication } from '@/lib/models/Publication';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const filter = category ? { category } : {};
    const publications = await Publication.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: publications });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newPub = await Publication.create(body);
    return NextResponse.json({ success: true, data: newPub }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}