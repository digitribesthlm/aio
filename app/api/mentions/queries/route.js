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

    const queries = await db.collection('LLMBrandMentions').distinct('query', filter);

    return Response.json({ queries });
  } catch (error) {
    console.error('Mentions queries error:', error);
    return Response.json({ error: 'Failed to fetch mention queries' }, { status: 500 });
  }
}
