import { getDatabase } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const isAdmin = url.searchParams.get('isAdmin') === 'true';
    const clientId = url.searchParams.get('clientId');
    const queryText = url.searchParams.get('query');
    const keyword = url.searchParams.get('keyword');

    const db = await getDatabase();
    let filter = {};

    if (!isAdmin && clientId) {
      filter = {
        $or: [
          { custom_id: clientId },
          { customer_domain: clientId },
        ],
      };
    }

    if (queryText) {
      filter.query = queryText;
    }

    if (keyword) {
      filter.keyword = keyword;
    }

    const tracking = await db
      .collection('LLMKeywordsTracking')
      .find(filter)
      .sort({ date: -1, position: 1 })
      .limit(200)
      .toArray();

    return Response.json({ tracking });
  } catch (error) {
    console.error('Tracking error:', error);
    return Response.json({ error: 'Failed to fetch tracking data' }, { status: 500 });
  }
}
