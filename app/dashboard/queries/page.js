'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QueriesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [queries, setQueries] = useState([]);
  const [newQuery, setNewQuery] = useState('');
  const [customId, setCustomId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      router.push('/');
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);
    setCustomId(userData.role === 'admin' ? '' : userData.clientId);
    fetchQueries(userData);
  }, [router]);

  const fetchQueries = async (currentUser) => {
    try {
      const isAdmin = currentUser.role === 'admin';
      const res = await fetch(
        `/api/queries?isAdmin=${isAdmin}${!isAdmin ? `&clientId=${currentUser.clientId}` : ''}`
      );
      const data = await res.json();
      setQueries(data.queries || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch queries:', error);
      setLoading(false);
    }
  };

  const handleAddQuery = async (e) => {
    e.preventDefault();
    if (!newQuery || !customId) return;

    try {
      const res = await fetch('/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: newQuery, custom_id: customId }),
      });

      if (res.ok) {
        setNewQuery('');
        fetchQueries(user);
      }
    } catch (error) {
      console.error('Failed to add query:', error);
    }
  };

  const handleDeleteQuery = async (id) => {
    try {
      const res = await fetch(`/api/queries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchQueries(user);
      }
    } catch (error) {
      console.error('Failed to delete query:', error);
    }
  };

  if (!user) return null;

  return (
    <div>
      <div className="page-header">
        <h1>LLM Queries</h1>
        <p>Manage queries to monitor in AI models</p>
      </div>

      <div className="card">
        <h3>Add New Query</h3>
        <form onSubmit={handleAddQuery} className="form-container">
          {user.role === 'admin' && (
            <input
              type="text"
              placeholder="Client ID"
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              required
            />
          )}
          <input
            type="text"
            placeholder="Enter query..."
            value={newQuery}
            onChange={(e) => setNewQuery(e.target.value)}
            required
          />
          <button type="submit">Add Query</button>
        </form>
      </div>

      <div className="card">
        <h3>Queries</h3>
        {loading ? (
          <p>Loading...</p>
        ) : queries.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Query</th>
                  <th>Client ID</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {queries.map((q) => (
                  <tr key={q._id?.toString()}>
                    <td>{q.query}</td>
                    <td>{q.customer_domain || q.custom_id}</td>
                    <td>{new Date(q.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteQuery(q._id?.toString())}
                        style={{
                          background: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No queries found.</p>
        )}
      </div>
    </div>
  );
}
