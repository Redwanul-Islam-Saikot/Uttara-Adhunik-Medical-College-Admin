import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { FooterSettings, RecentPost } from '@/lib/models/Footer';

export async function GET() {
  try {
    await connectDB();
    const settings = await FooterSettings.findOne({});
    const posts = await RecentPost.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, settings, posts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (body.type === 'settings') {
      let settings = await FooterSettings.findOne({});
      if (settings) {
        settings = await FooterSettings.findByIdAndUpdate(settings._id, body.data, { new: true });
      } else {
        settings = await FooterSettings.create(body.data);
      }
      return NextResponse.json({ success: true, data: settings, message: 'Settings saved!' });
    }

    if (body.type === 'post') {
      const newPost = await RecentPost.create(body.data);
      return NextResponse.json({ success: true, data: newPost, message: 'Post created!' });
    }

    return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}