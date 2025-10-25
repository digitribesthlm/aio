import { getDatabase } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const isAdmin = url.searchParams.get('isAdmin') === 'true';
    const clientId = url.searchParams.get('clientId');
    const queryText = url.searchParams.get('query');

    const db = await getDatabase();
    const filter = {};

    if (!isAdmin && clientId) {
      filter.custom_id = clientId;
    }

    if (queryText) {
      filter.query = queryText;
    }

    const mentions = await db
      .collection('LLMBrandMentions')
      .find(filter)
      .sort({ position: 1, date: -1 })
      .limit(200)
      .toArray();

    return Response.json({ mentions });
  } catch (error) {
    console.error('Mentions error:', error);
    return Response.json({ error: 'Failed to fetch mentions' }, { status: 500 });
  }
}
