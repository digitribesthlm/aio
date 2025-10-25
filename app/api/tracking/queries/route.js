import { getDatabase } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const isAdmin = url.searchParams.get('isAdmin') === 'true';
    const clientId = url.searchParams.get('clientId');

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

    const queries = await db.collection('LLMKeywordsTracking').distinct('query', filter);

    return Response.json({ queries });
  } catch (error) {
    console.error('Tracking queries error:', error);
    return Response.json({ error: 'Failed to fetch tracking queries' }, { status: 500 });
  }
}
