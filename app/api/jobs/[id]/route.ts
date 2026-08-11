import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Job from '@/lib/models/Job';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params; // Next.js 15+ Async params
    const body = await req.json();
    const updatedJob = await Job.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updatedJob, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating job' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params; // Next.js 15+ Async params
    await Job.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Job deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting job' }, { status: 500 });
  }
}