import { getDatabase } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const db = await getDatabase();
    const users = await db.collection('users').find({}).toArray();
    
    // Remove passwords from response
    const safeUsers = users.map(u => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });

    return Response.json({ users: safeUsers });
  } catch (error) {
    console.error('Users error:', error);
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { email, password, name, role, clientId } = await request.json();

    if (!email || !password || !name) {
      return Response.json(
        { error: 'Email, password, and name required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    // Check if user exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return Response.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const result = await db.collection('users').insertOne({
      email,
      password,
      name,
      role: role || 'client',
      clientId: role === 'client' ? clientId : null,
      status: 'active',
      created_at: new Date(),
      last_login: null,
    });

    return Response.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Users error:', error);
    return Response.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
