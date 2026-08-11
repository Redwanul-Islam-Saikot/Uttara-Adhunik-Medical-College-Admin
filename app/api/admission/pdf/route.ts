import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb'; // Your MongoDB connection logic
import PDF from '@/lib/models/PDF';

// GET: Fetch PDF section data by category query ?category=papers
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const query = category ? { category } : {};
    const pdfData = await PDF.find(query);

    return NextResponse.json({ success: true, data: pdfData });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

// POST: Create or Update section
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { category } = body;

    const existingData = await PDF.findOne({ category });

    if (existingData) {
      const updatedData = await PDF.findOneAndUpdate({ category }, body, {
        new: true,
      });
      return NextResponse.json({ success: true, data: updatedData });
    }

    const newData = await PDF.create(body);
    return NextResponse.json({ success: true, data: newData });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to save data' },
      { status: 500 }
    );
  }
}