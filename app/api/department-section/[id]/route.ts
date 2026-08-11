import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import DepartmentSection from '@/lib/models/DepartmentSection';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // params কে Promise হিসেবে টাইপ করা হয়েছে
) {
  try {
    await connectDB();
    const body = await req.json();
    
    // 1. Next.js App Router-এ params-কে await করতে হবে
    const { id } = await params; 

    // 2. ID Validation
    if (!id || id === 'undefined') {
      return NextResponse.json(
        { success: false, message: 'Invalid or Missing ID' },
        { status: 400 }
      );
    }

    // 3. Database Update
    const updatedSection = await DepartmentSection.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedSection) {
      return NextResponse.json(
        { success: false, message: 'Section not found in Database' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedSection });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id || id === 'undefined') {
      return NextResponse.json(
        { success: false, message: 'Invalid or Missing ID' },
        { status: 400 }
      );
    }

    const deleted = await DepartmentSection.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}