'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState('');
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
        {isAdmin && (
          <>
            <Link
              href="/dashboard/overview"
              className={`sidebar-item ${activeMenu === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveMenu('overview')}
            >
              Overview
            </Link>
            <Link
              href="/dashboard/queries"
              className={`sidebar-item ${activeMenu === 'queries' ? 'active' : ''}`}
              onClick={() => setActiveMenu('queries')}
            >
              LLM Queries
            </Link>
            <Link
              href="/dashboard/keywords"
              className={`sidebar-item ${activeMenu === 'keywords' ? 'active' : ''}`}
              onClick={() => setActiveMenu('keywords')}
            >
              Keywords
            </Link>
            <Link
              href="/dashboard/tracking"
              className={`sidebar-item ${activeMenu === 'tracking' ? 'active' : ''}`}
              onClick={() => setActiveMenu('tracking')}
            >
              Tracking Data
            </Link>
            <Link
              href="/dashboard/mentions"
              className={`sidebar-item ${activeMenu === 'mentions' ? 'active' : ''}`}
              onClick={() => setActiveMenu('mentions')}
            >
              Brand Mentions
            </Link>
            <Link
              href="/dashboard/users"
              className={`sidebar-item ${activeMenu === 'users' ? 'active' : ''}`}
              onClick={() => setActiveMenu('users')}
            >
              Users
            </Link>
          </>
        )}

        {!isAdmin && (
          <>
            <Link
              href="/dashboard/overview"
              className={`sidebar-item ${activeMenu === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveMenu('overview')}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/queries"
              className={`sidebar-item ${activeMenu === 'queries' ? 'active' : ''}`}
              onClick={() => setActiveMenu('queries')}
            >
              My Queries
            </Link>
            <Link
              href="/dashboard/tracking"
              className={`sidebar-item ${activeMenu === 'tracking' ? 'active' : ''}`}
              onClick={() => setActiveMenu('tracking')}
            >
              Tracking Results
            </Link>
            <Link
              href="/dashboard/mentions"
              className={`sidebar-item ${activeMenu === 'mentions' ? 'active' : ''}`}
              onClick={() => setActiveMenu('mentions')}
            >
              Mentions
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
