'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TrackingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tracking, setTracking] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      router.push('/');
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);
    fetchKeywords(userData);
  }, [router]);

  useEffect(() => {
    if (user && selectedKeyword) {
      fetchTracking(user, selectedKeyword);
    }
  }, [user, selectedKeyword]);

  const fetchKeywords = async (currentUser) => {
    try {
      const isAdmin = currentUser.role === 'admin';
      const res = await fetch(`/api/keywords?isAdmin=${isAdmin}${!isAdmin ? `&clientId=${currentUser.clientId}` : ''}`);
      const data = await res.json();
      const keywordList = (data.keywords || []).map(k => k.keyword);
      setKeywords(keywordList);
      setSelectedKeyword(keywordList[0] || '');
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch keywords:', error);
      setLoading(false);
    }
  };

  const fetchTracking = async (currentUser, keyword) => {
    try {
      const isAdmin = currentUser.role === 'admin';
      const res = await fetch(
        `/api/tracking?isAdmin=${isAdmin}${!isAdmin ? `&clientId=${currentUser.clientId}` : ''}&keyword=${encodeURIComponent(keyword)}`
      );
      const data = await res.json();
      setTracking(data.tracking || []);
    } catch (error) {
      console.error('Failed to fetch tracking:', error);
    }
  };

  if (!user) return null;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>Keyword Performance</h1>
        <p style={{ color: '#6b7280' }}>Track how your keywords perform across different queries</p>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Select Keyword</label>
        <select
          value={selectedKeyword}
          onChange={(e) => setSelectedKeyword(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            fontSize: '14px',
          }}
        >
          {loading ? (
            <option>Loading keywords...</option>
          ) : keywords.length ? (
            keywords.map((k, i) => (
              <option key={i} value={k}>{k}</option>
            ))
          ) : (
            <option>No keywords found</option>
          )}
        </select>
        {selectedKeyword && (
          <div style={{ marginTop: '12px', padding: '12px', background: '#f9fafb', borderRadius: '6px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Tracking Keyword</div>
            <div style={{ fontWeight: '600', fontSize: '16px' }}>{selectedKeyword}</div>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Queries Where This Keyword Appears</h3>
        {loading ? (
          <p>Loading...</p>
        ) : tracking.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Query</th>
                  <th>LLM Model</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>URL</th>
                </tr>
              </thead>
              <tbody>
                {tracking.map((t, i) => (
                  <tr key={i}>
                    <td>{t.query}</td>
                    <td>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          background: '#f3f4f6',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}
                      >
                        {t.llm}
                      </span>
                    </td>
                    <td>
                      {t.position ? (
                        <span
                          style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            background: t.position <= 3 ? '#10b98120' : '#f59e0b20',
                            color: t.position <= 3 ? '#10b981' : '#f59e0b',
                            fontWeight: '600',
                          }}
                        >
                          #{t.position}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: t.found ? '#10b98120' : '#ef444420',
                          color: t.found ? '#10b981' : '#ef4444',
                        }}
                      >
                        {t.found ? 'Found' : 'Not Found'}
                      </span>
                    </td>
                    <td>{new Date(t.date).toLocaleDateString()}</td>
                    <td>
                      {t.url ? (
                        <a href={t.url} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea', textDecoration: 'none' }}>
                          View →
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
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>
            No tracking data found for this keyword.
          </p>
        )}
      </div>
    </div>
  );
}

