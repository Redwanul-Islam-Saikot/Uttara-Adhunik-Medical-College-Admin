import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb'; // আপনার MongoDB কানেকশন హెల్পার
import Job from '@/lib/models/Job';

export async function GET() {
  try {
    await connectDB();
    const jobs = await Job.find({}).sort({ createdAt: 1 });
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching jobs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newJob = await Job.create(body);
    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating job' }, { status: 500 });
  }
}