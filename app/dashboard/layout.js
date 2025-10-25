'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(storedUser));
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    router.push('/');
  };

  if (loading) return null;
  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const isActive = (path) => pathname === path;

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h2>AIO</h2>
        <div className="navbar-right">
          <span>{user.name}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <aside className="sidebar">
        <Link
          href="/dashboard/overview"
          className={`sidebar-item ${isActive('/dashboard/overview') ? 'active' : ''}`}
        >
          📊 Overview
        </Link>
        
        <Link
          href="/dashboard/quickwins"
          className={`sidebar-item ${isActive('/dashboard/quickwins') ? 'active' : ''}`}
        >
          🎯 Quick Wins
        </Link>

        <Link
          href="/dashboard/entities"
          className={`sidebar-item ${isActive('/dashboard/entities') ? 'active' : ''}`}
        >
          🔍 Entity Extraction
        </Link>

        <Link
          href="/dashboard/tracking"
          className={`sidebar-item ${isActive('/dashboard/tracking') ? 'active' : ''}`}
        >
          📈 Tracking Results
        </Link>

        <Link
          href="/dashboard/mentions"
          className={`sidebar-item ${isActive('/dashboard/mentions') ? 'active' : ''}`}
        >
          🏷️ Brand Mentions
        </Link>

        <div style={{ margin: '16px 0', borderTop: '1px solid #e5e7eb' }}></div>

        <Link
          href="/dashboard/queries"
          className={`sidebar-item ${isActive('/dashboard/queries') ? 'active' : ''}`}
        >
          📝 Queries
        </Link>

        {isAdmin && (
          <>
            <Link
              href="/dashboard/keywords"
              className={`sidebar-item ${isActive('/dashboard/keywords') ? 'active' : ''}`}
            >
              🔑 Keywords
            </Link>
            <Link
              href="/dashboard/users"
              className={`sidebar-item ${isActive('/dashboard/users') ? 'active' : ''}`}
            >
              👥 Users
            </Link>
          </>
        )}
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

