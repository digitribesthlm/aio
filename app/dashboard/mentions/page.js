'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MentionsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mentions, setMentions] = useState([]);
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
      fetchMentions(user, selectedQuery);
    }
  }, [user, selectedQuery]);

  const fetchQueries = async (currentUser) => {
    try {
      const isAdmin = currentUser.role === 'admin';
      const res = await fetch(`/api/mentions/queries?isAdmin=${isAdmin}${!isAdmin ? `&clientId=${currentUser.clientId}` : ''}`);
      const data = await res.json();
      setQueries(data.queries || []);
      setSelectedQuery((data.queries || [])[0] || '');
      setLoadingQueries(false);
    } catch (error) {
      console.error('Failed to fetch queries:', error);
      setLoadingQueries(false);
    }
  };

  const fetchMentions = async (currentUser, q) => {
    try {
      const isAdmin = currentUser.role === 'admin';
      const res = await fetch(`/api/mentions?isAdmin=${isAdmin}${!isAdmin ? `&clientId=${currentUser.clientId}` : ''}&query=${encodeURIComponent(q)}`);
      const data = await res.json();
      setMentions(data.mentions || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch mentions:', error);
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div>
      <div className="page-header">
        <h1>Brand & Resource Tracking</h1>
        <p>Select a query to see all brands and competitors mentioned by AI</p>
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

      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Results</h4>
          <div className="value">{mentions.length}</div>
        </div>
        <div className="stat-card">
          <h4>Unique Brands</h4>
          <div className="value">{new Set(mentions.map(m => m.brand)).size}</div>
        </div>
      </div>

      <div className="card" style={{ background: 'transparent', boxShadow: 'none' }}>
        {loading ? (
          <p>Loading...</p>
        ) : mentions.length ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {mentions.map((m, i) => (
              <div key={i} className="card" style={{ borderRadius: 10 }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{m.brand}</div>
                {m.url ? (
                  <a href={m.url} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea', wordBreak: 'break-all' }}>{m.url}</a>
                ) : (
                  <div style={{ color: '#999' }}>No URL</div>
                )}
                <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 12 }}>
                  <span>#{m.position ?? '-'}</span>
                  <span>{new Date(m.date).toLocaleString()}</span>
                </div>
                <div style={{ marginTop: 10 }}>
                  <span className={`badge ${m.is_competitor ? 'badge-client' : 'badge-active'}`}>
                    {m.is_competitor ? 'Competitor' : 'Your Brand'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No mentions found for this query.</p>
        )}
      </div>
    </div>
  );
}
