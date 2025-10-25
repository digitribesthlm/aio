'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TrackingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tracking, setTracking] = useState([]);
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingQueries, setLoadingQueries] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      router.push('/');
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);
    fetchQueries(userData);
  }, [router]);

  useEffect(() => {
    if (user && selectedQuery) {
      fetchTracking(user, selectedQuery);
    }
  }, [user, selectedQuery]);

  const fetchQueries = async (currentUser) => {
    try {
      const isAdmin = currentUser.role === 'admin';
      const res = await fetch(`/api/tracking/queries?isAdmin=${isAdmin}${!isAdmin ? `&clientId=${currentUser.clientId}` : ''}`);
      const data = await res.json();
      setQueries(data.queries || []);
      setSelectedQuery((data.queries || [])[0] || '');
      setLoadingQueries(false);
    } catch (error) {
      console.error('Failed to fetch queries:', error);
      setLoadingQueries(false);
    }
  };

  const fetchTracking = async (currentUser, q) => {
    try {
      const isAdmin = currentUser.role === 'admin';
      const res = await fetch(
        `/api/tracking?isAdmin=${isAdmin}${!isAdmin ? `&clientId=${currentUser.clientId}` : ''}&query=${encodeURIComponent(q)}`
      );
      const data = await res.json();
      setTracking(data.tracking || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch tracking:', error);
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div>
      <div className="page-header">
        <h1>Keyword Performance</h1>
        <p>Question: {selectedQuery || '—'}</p>
      </div>

      <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <select
          value={selectedQuery}
          onChange={(e) => setSelectedQuery(e.target.value)}
          style={{ flex: 1, padding: 10, border: '1px solid #ddd', borderRadius: 6 }}
        >
          {loadingQueries ? (
            <option>Loading queries...</option>
          ) : queries.length ? (
            queries.map((q, i) => (
              <option key={i} value={q}>{q}</option>
            ))
          ) : (
            <option>No queries found</option>
          )}
        </select>
      </div>

      <div className="card">
        <h3>Tracked Keywords</h3>
        {loading ? (
          <p>Loading...</p>
        ) : tracking.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Keyword</th>
                  <th>LLM Model</th>
                  <th>Position</th>
                  <th>Found</th>
                  <th>Date</th>
                  <th>URL</th>
                </tr>
              </thead>
              <tbody>
                {tracking.map((t, i) => (
                  <tr key={i}>
                    <td>{t.keyword}</td>
                    <td>{t.llm}</td>
                    <td>{t.position || '-'}</td>
                    <td>
                      <span className={`badge ${t.found ? 'badge-active' : 'badge-client'}`}>
                        {t.found ? 'Found' : 'Not Found'}
                      </span>
                    </td>
                    <td>{new Date(t.date).toLocaleDateString()}</td>
                    <td>
                      {t.url ? (
                        <a href={t.url} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
                          View
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No tracked keywords found for this question.</p>
        )}
      </div>
    </div>
  );
}
