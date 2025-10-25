import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('isAdmin') === 'true';
    const clientId = searchParams.get('clientId');
    const query = searchParams.get('query');

    const client = await clientPromise;
    const db = client.db();

    let filter = {};
    if (!isAdmin && clientId) {
      filter.custom_id = clientId;
    }
    if (query) {
      filter.query = query;
    }

    const entities = await db
      .collection('LLMEntityExtraction')
      .find(filter)
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json({ entities });
  } catch (error) {
    console.error('Error fetching entities:', error);
    return NextResponse.json({ error: 'Failed to fetch entities' }, { status: 500 });
  }
}

