import { getDatabase } from './mongodb';
import { ObjectId } from 'mongodb';

export async function verifyUser(email, password) {
  const db = await getDatabase();
  const collectionName = process.env.MONGODB_LOGIN_COLLECTION || 'users';
  const user = await db.collection(collectionName).findOne({ email });
  
  if (!user) return null;
  
  // Simple string comparison as per requirements
  if (user.password === password) {
    return user;
  }
  
  return null;
}

export function isAdmin(user) {
  return user && user.role === 'admin';
}

export function isClient(user) {
  return user && user.role === 'client';
}
