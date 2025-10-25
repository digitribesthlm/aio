import { getDatabase } from '@/lib/mongodb';

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

    const keywords = await db
      .collection('LLMKeywords')
      .find(filter)
      .toArray();

    return Response.json({ keywords });
  } catch (error) {
    console.error('Keyword error:', error);
    return Response.json({ error: 'Failed to fetch keywords' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { keyword, custom_id, type } = await request.json();

    if (!keyword || !custom_id) {
      return Response.json(
        { error: 'Keyword and client ID required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const result = await db.collection('LLMKeywords').insertOne({
      keyword,
      custom_id,
      type: type || 'brand',
      created_at: new Date(),
    });

    return Response.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Keyword error:', error);
    return Response.json({ error: 'Failed to create keyword' }, { status: 500 });
  }
}
