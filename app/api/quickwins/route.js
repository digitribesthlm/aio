import { getDatabase } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('isAdmin') === 'true';
    const clientId = searchParams.get('clientId');

    const db = await getDatabase();

    let filter = {};
    if (!isAdmin && clientId) {
      filter.custom_id = clientId;
    }

    const quickWins = await db
      .collection('LLMQuickWins')
      .find(filter)
      .sort({ created_at: -1 })
      .toArray();

    return Response.json({ quickWins });
  } catch (error) {
    console.error('Error fetching quick wins:', error);
    return Response.json({ error: 'Failed to fetch quick wins' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, status } = await request.json();
    
    const db = await getDatabase();
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
      return Response.json({ error: 'Quick win not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error updating quick win:', error);
    return Response.json({ error: 'Failed to update quick win' }, { status: 500 });
  }
}

