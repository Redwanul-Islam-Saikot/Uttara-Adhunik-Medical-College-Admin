import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// JSON ফাইলের পাথ (প্রজেক্টের ভেতর data/members.json ফাইলে ডাটা সেভ থাকবে)
const filePath = path.join(process.cwd(), 'data', 'members.json');

// ডাটা পড়ার জন্য নিরাপদ হেল্পার ফাংশন
function readData() {
  try {
    if (!fs.existsSync(filePath)) {
      const dirPath = path.dirname(filePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify([]));
      return [];
    }
    const fileData = fs.readFileSync(filePath, 'utf8').trim();
    if (!fileData) return [];
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading json file:', error);
    return [];
  }
}

// ডাটা সেভ করার হেল্পার ফাংশন
function writeData(data: any[]) {
  try {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing json file:', error);
  }
}

// GET: ক্যাটাগরি অনুযায়ী ডাটা ফেচ করা
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const allMembers = readData();

    const filtered = category
      ? allMembers.filter((m: any) => m.category === category)
      : allMembers;

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

// POST: নতুন মেম্বার সেভ করা
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, designation, description, image, category, order } = body;

    if (!name || !designation || !image || !category) {
      return NextResponse.json(
        { success: false, message: 'Required fields missing' },
        { status: 400 }
      );
    }

    const allMembers = readData();

    const newMember = {
      _id: Date.now().toString(),
      name,
      designation,
      description: description || '',
      image,
      category,
      order: order || 0,
    };

    allMembers.push(newMember);
    writeData(allMembers);

    return NextResponse.json(
      { success: true, message: 'Member added successfully', data: newMember },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to save member' },
      { status: 500 }
    );
  }
}