'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OverviewPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalQueries: 0,
    totalKeywords: 0,
    totalTracking: 0,
    totalMentions: 0,
  });
  const [recentTracking, setRecentTracking] = useState([]);
  const [quickWinsCount, setQuickWinsCount] = useState(0);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchStats(JSON.parse(storedUser));
    fetchQuickWins(JSON.parse(storedUser));
  }, [router]);

  const fetchStats = async (currentUser) => {
    try {
      const isAdmin = currentUser.role === 'admin';
      const res = await fetch(
        `/api/stats?isAdmin=${isAdmin}${!isAdmin ? `&clientId=${currentUser.clientId}` : ''}`
      );
      const data = await res.json();
      setStats(data.stats || {});
      setRecentTracking(data.recentTracking || []);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchQuickWins = async (currentUser) => {
    try {
      const isAdmin = currentUser.role === 'admin';
      const res = await fetch(
        `/api/quickwins?isAdmin=${isAdmin}${!isAdmin ? `&clientId=${currentUser.clientId}` : ''}`
      );
      const data = await res.json();
      const highPriority = (data.quickWins || []).filter(
        (w) => w.priority === 'high' && w.status !== 'completed' && w.status !== 'dismissed'
      );
      setQuickWinsCount(highPriority.length);
    } catch (error) {
      console.error('Failed to fetch quick wins:', error);
    }
  };

  if (!user) return null;

  const calculateVisibility = () => {
    if (stats.totalTracking === 0) return 0;
    const foundCount = recentTracking.filter((t) => t.found).length;
    return Math.round((foundCount / stats.totalTracking) * 100);
  };

  const calculateAvgPosition = () => {
    const positions = recentTracking.filter((t) => t.found && t.position).map((t) => t.position);
    if (positions.length === 0) return 0;
    return (positions.reduce((a, b) => a + b, 0) / positions.length).toFixed(1);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>Overview</h1>
        <p style={{ color: '#6b7280' }}>Track your brand visibility and keyword performance</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h4>Brand Visibility</h4>
          <div className="value">{calculateVisibility()}%</div>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
            Queries where you appear
          </p>
        </div>
        <div className="stat-card">
          <h4>Avg Position</h4>
          <div className="value">{calculateAvgPosition()}</div>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
            Across all LLMs
          </p>
        </div>
        <div className="stat-card">
          <h4>Quick Wins</h4>
          <div className="value" style={{ color: quickWinsCount > 0 ? '#ef4444' : '#667eea' }}>
            {quickWinsCount}
          </div>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
            High priority opportunities
          </p>
        </div>
        <div className="stat-card">
          <h4>Total Queries</h4>
          <div className="value">{stats.totalQueries}</div>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
            Being monitored
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Performance Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f9fafb', borderRadius: '6px' }}>
              <span style={{ color: '#6b7280' }}>Tracking Records</span>
              <span style={{ fontWeight: '600' }}>{stats.totalTracking}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f9fafb', borderRadius: '6px' }}>
              <span style={{ color: '#6b7280' }}>Brand Mentions</span>
              <span style={{ fontWeight: '600' }}>{stats.totalMentions}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f9fafb', borderRadius: '6px' }}>
              <span style={{ color: '#6b7280' }}>Keywords</span>
              <span style={{ fontWeight: '600' }}>{stats.totalKeywords}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link
              href="/dashboard/quickwins"
              style={{
                padding: '12px',
                background: '#667eea',
                color: 'white',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: '500',
                textAlign: 'center',
              }}
            >
              View Quick Wins →
            </Link>
            <Link
              href="/dashboard/entities"
              style={{
                padding: '12px',
                background: 'white',
                color: '#667eea',
                border: '1px solid #667eea',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: '500',
                textAlign: 'center',
              }}
            >
              Explore Entities →
            </Link>
            <Link
              href="/dashboard/queries"
              style={{
                padding: '12px',
                background: 'white',
                color: '#6b7280',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: '500',
                textAlign: 'center',
              }}
            >
              Manage Queries →
            </Link>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Recent Tracking Activity</h3>
        {recentTracking.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Query</th>
                  <th>Keyword</th>
                  <th>LLM</th>
                  <th>Position</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTracking.slice(0, 10).map((item, i) => (
                  <tr key={i}>
                    <td>{item.query}</td>
                    <td>{item.keyword}</td>
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
                        {item.llm}
                      </span>
                    </td>
                    <td>
                      {item.position ? (
                        <span
                          style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            background: item.position <= 3 ? '#10b98120' : '#f59e0b20',
                            color: item.position <= 3 ? '#10b981' : '#f59e0b',
                            fontWeight: '600',
                          }}
                        >
                          #{item.position}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{new Date(item.date).toLocaleDateString()}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: item.found ? '#10b98120' : '#ef444420',
                          color: item.found ? '#10b981' : '#ef4444',
                        }}
                      >
                        {item.found ? 'Found' : 'Not Found'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>
            No tracking data available yet. Add queries and keywords to start monitoring.
          </p>
        )}
      </div>
    </div>
  );
}

