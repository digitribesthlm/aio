import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('isAdmin') === 'true';
    const clientId = searchParams.get('clientId');

    const client = await clientPromise;
    const db = client.db();

    let filter = {};
    if (!isAdmin && clientId) {
      filter.custom_id = clientId;
    }

    const quickWins = await db
      .collection('LLMQuickWins')
      .find(filter)
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json({ quickWins });
  } catch (error) {
    console.error('Error fetching quick wins:', error);
    return NextResponse.json({ error: 'Failed to fetch quick wins' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, status } = await request.json();
    
    const client = await clientPromise;
    const db = client.db();
    const { ObjectId } = require('mongodb');

    const result = await db.collection('LLMQuickWins').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status,
          updated_at: new Date()
        } 
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Quick win not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating quick win:', error);
    return NextResponse.json({ error: 'Failed to update quick win' }, { status: 500 });
  }
}

