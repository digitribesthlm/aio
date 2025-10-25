'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EntitiesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [entities, setEntities] = useState([]);
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState('');
  const [activeTab, setActiveTab] = useState('brands');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchData(JSON.parse(storedUser));
  }, [router]);

  const fetchData = async (currentUser) => {
    try {
      const isAdmin = currentUser.role === 'admin';
      const res = await fetch(
        `/api/entities?isAdmin=${isAdmin}${!isAdmin ? `&clientId=${currentUser.clientId}` : ''}`
      );
      const data = await res.json();
      setEntities(data.entities || []);
      
      const uniqueQueries = [...new Set(data.entities.map((e) => e.query))];
      setQueries(uniqueQueries);
      if (uniqueQueries.length > 0) {
        setSelectedQuery(uniqueQueries[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch entities:', error);
      setLoading(false);
    }
  };

  if (!user || loading) return null;

  const currentEntity = entities.find((e) => e.query === selectedQuery);

  const renderBrands = () => {
    if (!currentEntity || !currentEntity.brands) return <p>No brand data available.</p>;

    return (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Brand</th>
              <th>Position</th>
              <th>Frequency</th>
            </tr>
          </thead>
          <tbody>
            {currentEntity.brands.map((brand, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: '600' }}>{brand.name}</td>
                <td>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      background: brand.position <= 3 ? '#10b98120' : '#f59e0b20',
                      color: brand.position <= 3 ? '#10b981' : '#f59e0b',
                      fontWeight: '600',
                    }}
                  >
                    #{brand.position}
                  </span>
                </td>
                <td>{brand.frequency}x</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderUrls = () => {
    if (!currentEntity || !currentEntity.urls) return <p>No URL data available.</p>;

    return (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Domain</th>
              <th>Position</th>
            </tr>
          </thead>
          <tbody>
            {currentEntity.urls.map((url, idx) => (
              <tr key={idx}>
                <td>
                  <a
                    href={url.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#667eea', textDecoration: 'none' }}
                  >
                    {url.url.length > 50 ? url.url.substring(0, 50) + '...' : url.url}
                  </a>
                </td>
                <td>{url.domain}</td>
                <td>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      background: url.position <= 3 ? '#10b98120' : '#f59e0b20',
                      color: url.position <= 3 ? '#10b981' : '#f59e0b',
                      fontWeight: '600',
                    }}
                  >
                    #{url.position}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>Entity Extraction</h1>
        <p style={{ color: '#6b7280' }}>Brands and URLs extracted from LLM responses</p>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Select Query</label>
        <select
          value={selectedQuery}
          onChange={(e) => setSelectedQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            fontSize: '14px',
          }}
        >
          {queries.map((query, idx) => (
            <option key={idx} value={query}>
              {query}
            </option>
          ))}
        </select>
        {currentEntity && (
          <div style={{ marginTop: '12px', padding: '12px', background: '#f9fafb', borderRadius: '6px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>LLM Model</div>
            <div style={{ fontWeight: '600' }}>{currentEntity.llm}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>Date</div>
            <div style={{ fontWeight: '600' }}>{new Date(currentEntity.date).toLocaleString()}</div>
          </div>
        )}
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '16px', borderBottom: '2px solid #e5e7eb', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('brands')}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'brands' ? '2px solid #667eea' : 'none',
              color: activeTab === 'brands' ? '#667eea' : '#6b7280',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '-2px',
            }}
          >
            Brands
          </button>
          <button
            onClick={() => setActiveTab('urls')}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'urls' ? '2px solid #667eea' : 'none',
              color: activeTab === 'urls' ? '#667eea' : '#6b7280',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '-2px',
            }}
          >
            URLs
          </button>
        </div>

        {activeTab === 'brands' && renderBrands()}
        {activeTab === 'urls' && renderUrls()}
      </div>
    </div>
  );
}

