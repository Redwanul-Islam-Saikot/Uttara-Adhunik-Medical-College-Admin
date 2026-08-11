import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'members.json');

function readData() {
  try {
    if (!fs.existsSync(filePath)) return [];
    const fileData = fs.readFileSync(filePath, 'utf8').trim();
    if (!fileData) return [];
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading json file:', error);
    return [];
  }
}

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

async function getIdFromParams(params: any): Promise<string | null> {
  const resolvedParams = await params;
  return resolvedParams?.id || null;
}

// PUT: Member Edit/Update
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const id = await getIdFromParams(params);
    const body = await request.json();
    const { name, designation, description, image, category, order } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Member ID is required' },
        { status: 400 }
      );
    }

    let allMembers = readData();
    const index = allMembers.findIndex(
      (m: any) => String(m._id || m.id) === String(id)
    );

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Member not found' },
        { status: 404 }
      );
    }

    allMembers[index] = {
      ...allMembers[index],
      _id: allMembers[index]._id || allMembers[index].id || id,
      name: name ?? allMembers[index].name,
      designation: designation ?? allMembers[index].designation,
      description: description ?? allMembers[index].description,
      image: image ?? allMembers[index].image,
      category: category ?? allMembers[index].category,
      order: order !== undefined ? order : allMembers[index].order,
    };

    writeData(allMembers);

    return NextResponse.json({
      success: true,
      message: 'Member updated successfully',
      data: allMembers[index],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update member' },
      { status: 500 }
    );
  }
}

// DELETE: Member Remove
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const id = await getIdFromParams(params);

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Member ID is required' },
        { status: 400 }
      );
    }

    let allMembers = readData();
    const initialLength = allMembers.length;

    allMembers = allMembers.filter(
      (m: any) => String(m._id || m.id) !== String(id)
    );

    if (allMembers.length === initialLength) {
      return NextResponse.json(
        { success: false, message: 'Member not found' },
        { status: 404 }
      );
    }

    writeData(allMembers);

    return NextResponse.json({
      success: true,
      message: 'Member deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete member' },
      { status: 500 }
    );
  }
}