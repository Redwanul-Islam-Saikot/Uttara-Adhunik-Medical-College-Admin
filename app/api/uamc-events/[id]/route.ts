import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import UAMCEvent from '@/lib/models/UAMCEvents';

// GET SINGLE EVENT
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const event = await UAMCEvent.findById(id);
    if (!event) return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching event' }, { status: 500 });
  }
}

// UPDATE EVENT (EDIT)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    
    const updatedEvent = await UAMCEvent.findByIdAndUpdate(id, body, { new: true });
    if (!updatedEvent) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: updatedEvent });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update event' }, { status: 400 });
  }
}

// DELETE EVENT
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const deletedEvent = await UAMCEvent.findByIdAndDelete(id);
    if (!deletedEvent) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete event' }, { status: 400 });
  }
}