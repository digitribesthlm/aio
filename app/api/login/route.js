import { verifyUser } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    const user = await verifyUser(email, password);

    if (!user) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Remove sensitive data
    const { password: _, ...userWithoutPassword } = user;

    return Response.json({ user: userWithoutPassword });
  } catch (error) {
    return Response.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
