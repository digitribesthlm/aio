'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function KeywordsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [customId, setCustomId] = useState('');
  const [type, setType] = useState('brand');
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
    fetchKeywords(userData);
  }, [router]);

  const fetchKeywords = async (currentUser) => {
    try {
      const isAdmin = currentUser.role === 'admin';
      const res = await fetch(
        `/api/keywords?isAdmin=${isAdmin}${!isAdmin ? `&clientId=${currentUser.clientId}` : ''}`
      );
      const data = await res.json();
      setKeywords(data.keywords || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch keywords:', error);
      setLoading(false);
    }
  };

  const handleAddKeyword = async (e) => {
    e.preventDefault();
    if (!newKeyword || !customId) return;

    try {
      const res = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: newKeyword,
          custom_id: customId,
          type: type,
        }),
      });

      if (res.ok) {
        setNewKeyword('');
        fetchKeywords(user);
      }
    } catch (error) {
      console.error('Failed to add keyword:', error);
    }
  };

  const handleDeleteKeyword = async (id) => {
    try {
      const res = await fetch(`/api/keywords/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchKeywords(user);
      }
    } catch (error) {
      console.error('Failed to delete keyword:', error);
    }
  };

  if (!user) return null;

  return (
    <div>
      <div className="page-header">
        <h1>Keywords</h1>
        <p>Manage brand names and keywords to track</p>
      </div>

      <div className="card">
        <h3>Add New Keyword</h3>
        <form onSubmit={handleAddKeyword} className="form-container">
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
            placeholder="Keyword"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            required
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="brand">Brand</option>
            <option value="competitor">Competitor</option>
          </select>
          <button type="submit">Add Keyword</button>
        </form>
      </div>

      <div className="card">
        <h3>Keywords</h3>
        {loading ? (
          <p>Loading...</p>
        ) : keywords.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Keyword</th>
                  <th>Type</th>
                  <th>Client ID</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((k) => (
                  <tr key={k._id?.toString()}>
                    <td>{k.keyword}</td>
                    <td>
                      <span className={`badge badge-${k.type}`}>
                        {k.type}
                      </span>
                    </td>
                    <td>{k.customer_domain || k.custom_id}</td>
                    <td>{new Date(k.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteKeyword(k._id?.toString())}
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
          <p>No keywords found.</p>
        )}
      </div>
    </div>
  );
}
