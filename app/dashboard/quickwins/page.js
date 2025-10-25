'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuickWinsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [quickWins, setQuickWins] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchQuickWins(JSON.parse(storedUser));
  }, [router]);

  const fetchQuickWins = async (currentUser) => {
    try {
      const isAdmin = currentUser.role === 'admin';
      const res = await fetch(
        `/api/quickwins?isAdmin=${isAdmin}${!isAdmin ? `&clientId=${currentUser.clientId}` : ''}`
      );
      const data = await res.json();
      setQuickWins(data.quickWins || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch quick wins:', error);
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch('/api/quickwins', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      fetchQuickWins(user);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (!user || loading) return null;

  const filteredWins = quickWins.filter((win) => {
    if (filter === 'all') return true;
    if (filter === 'priority') return win.priority === 'high';
    return win.status === filter;
  });

  const priorityOrder = { high: 1, medium: 2, low: 3 };
  const sortedWins = [...filteredWins].sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getImpactStars = (impact) => {
    const count = impact === 'high' ? 3 : impact === 'medium' ? 2 : 1;
    return '⭐'.repeat(count);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>Quick Wins</h1>
        <p style={{ color: '#6b7280' }}>Actionable SEO opportunities prioritized by impact</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            background: filter === 'all' ? '#667eea' : 'white',
            color: filter === 'all' ? 'white' : '#374151',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          All ({quickWins.length})
        </button>
        <button
          onClick={() => setFilter('priority')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            background: filter === 'priority' ? '#667eea' : 'white',
            color: filter === 'priority' ? 'white' : '#374151',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          High Priority ({quickWins.filter((w) => w.priority === 'high').length})
        </button>
        <button
          onClick={() => setFilter('new')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            background: filter === 'new' ? '#667eea' : 'white',
            color: filter === 'new' ? 'white' : '#374151',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          New ({quickWins.filter((w) => w.status === 'new').length})
        </button>
        <button
          onClick={() => setFilter('in-progress')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            background: filter === 'in-progress' ? '#667eea' : 'white',
            color: filter === 'in-progress' ? 'white' : '#374151',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          In Progress ({quickWins.filter((w) => w.status === 'in-progress').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            background: filter === 'completed' ? '#667eea' : 'white',
            color: filter === 'completed' ? 'white' : '#374151',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          Completed ({quickWins.filter((w) => w.status === 'completed').length})
        </button>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {sortedWins.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
            <p style={{ color: '#6b7280' }}>No quick wins found. Add data to see opportunities.</p>
          </div>
        ) : (
          sortedWins.map((win) => (
            <div
              key={win._id}
              className="card"
              style={{
                borderLeft: `4px solid ${getPriorityColor(win.priority)}`,
                opacity: win.status === 'completed' ? 0.6 : 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>
                      {win.category === 'low-hanging-fruit' ? '🎯' : win.category === 'content-gap' ? '🔍' : '⚡'}
                    </span>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>{win.query}</h3>
                  </div>
                  <p style={{ color: '#6b7280', marginBottom: '12px' }}>{win.opportunity_description}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: getPriorityColor(win.priority) + '20',
                      color: getPriorityColor(win.priority),
                    }}
                  >
                    {win.priority.toUpperCase()}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px', padding: '12px', background: '#f9fafb', borderRadius: '6px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Your Position</div>
                  <div style={{ fontSize: '18px', fontWeight: '600' }}>
                    {win.your_position ? `#${win.your_position}` : 'Not Found'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Competitor</div>
                  <div style={{ fontSize: '18px', fontWeight: '600' }}>#{win.competitor_position}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{win.competitor_name}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Gap</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: win.gap < 0 ? '#ef4444' : '#10b981' }}>
                    {win.gap > 0 ? '+' : ''}{win.gap === -999 ? 'N/A' : win.gap}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Impact</div>
                  <div style={{ fontSize: '18px' }}>{getImpactStars(win.estimated_impact)}</div>
                </div>
              </div>

              {win.action_items && win.action_items.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Action Items:</div>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {win.action_items.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: '4px', color: '#374151' }}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {win.competitor_url && (
                <div style={{ marginBottom: '16px' }}>
                  <a
                    href={win.competitor_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px' }}
                  >
                    🔗 View Competitor Page →
                  </a>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                {win.status !== 'in-progress' && win.status !== 'completed' && (
                  <button
                    onClick={() => updateStatus(win._id, 'in-progress')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: '1px solid #667eea',
                      background: 'white',
                      color: '#667eea',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    Start Working
                  </button>
                )}
                {win.status === 'in-progress' && (
                  <button
                    onClick={() => updateStatus(win._id, 'completed')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      background: '#10b981',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    Mark Complete
                  </button>
                )}
                {win.status !== 'dismissed' && (
                  <button
                    onClick={() => updateStatus(win._id, 'dismissed')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb',
                      background: 'white',
                      color: '#6b7280',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

