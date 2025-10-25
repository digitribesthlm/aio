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

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchStats(JSON.parse(storedUser));
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

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  return (
    <div>
      <div className="hero">
        <h1>AI Analytics Dashboard</h1>
        <p>Track your brand visibility and keyword performance across AI platforms</p>
        <div className="pills">
          <Link href="/dashboard/mentions" className="pill">🏷 Brand Tracking</Link>
          <Link href="/dashboard/tracking" className="pill secondary">🔵 Keyword Performance</Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Queries</h4>
          <div className="value">{stats.totalQueries}</div>
        </div>
        <div className="stat-card">
          <h4>Total Keywords</h4>
          <div className="value">{stats.totalKeywords}</div>
        </div>
        <div className="stat-card">
          <h4>Tracking Records</h4>
          <div className="value">{stats.totalTracking}</div>
        </div>
        <div className="stat-card">
          <h4>Brand Mentions</h4>
          <div className="value">{stats.totalMentions}</div>
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
                {recentTracking.map((item, i) => (
                  <tr key={i}>
                    <td>{item.query}</td>
                    <td>{item.keyword}</td>
                    <td>{item.llm}</td>
                    <td>{item.position || '-'}</td>
                    <td>{new Date(item.date).toLocaleDateString()}</td>
                    <td>
                      <span className="badge badge-active">
                        {item.found ? 'Found' : 'Not Found'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No tracking data available yet.</p>
        )}
      </div>
    </div>
  );
}
