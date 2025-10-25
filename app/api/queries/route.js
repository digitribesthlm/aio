import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const isAdmin = url.searchParams.get('isAdmin') === 'true';
    const clientId = url.searchParams.get('clientId');

    const db = await getDatabase();
    const filter = {};

    if (!isAdmin && clientId) {
      filter.custom_id = clientId;
    }

    const queries = await db
      .collection('LLMQueries')
      .find(filter)
      .toArray();

    return Response.json({ queries });
  } catch (error) {
    console.error('Query error:', error);
    return Response.json({ error: 'Failed to fetch queries' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { query, custom_id } = await request.json();

    if (!query || !custom_id) {
      return Response.json(
        { error: 'Query and client ID required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const result = await db.collection('LLMQueries').insertOne({
      query,
      custom_id,
      created_at: new Date(),
    });

    return Response.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Query error:', error);
    return Response.json({ error: 'Failed to create query' }, { status: 500 });
  }
}
