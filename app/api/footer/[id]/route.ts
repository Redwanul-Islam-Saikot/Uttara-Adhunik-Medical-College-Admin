import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { RecentPost } from '@/lib/models/Footer';

// ১. PUT: বিদ্যমান পোস্ট এডিট/আপডেট করা
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const updatedPost = await RecentPost.findByIdAndUpdate(id, body, { new: true });
    
    return NextResponse.json({ success: true, data: updatedPost, message: 'Post updated successfully!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ২. DELETE: পোস্ট ডিলিট করা
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    await RecentPost.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true, message: 'Post deleted successfully!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}