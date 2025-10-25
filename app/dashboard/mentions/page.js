'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MentionsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [allMentions, setAllMentions] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      router.push('/');
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);
    fetchAllMentions(userData);
  }, [router]);

  const fetchAllMentions = async (currentUser) => {
    try {
      const isAdmin = currentUser.role === 'admin';
      const res = await fetch(`/api/mentions?isAdmin=${isAdmin}${!isAdmin ? `&clientId=${currentUser.clientId}` : ''}`);
      const data = await res.json();
      const mentions = data.mentions || [];
      setAllMentions(mentions);
      
      const uniqueBrands = [...new Set(mentions.map(m => m.brand))].sort();
      setBrands(uniqueBrands);
      setSelectedBrands(uniqueBrands.slice(0, 3));
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch mentions:', error);
      setLoading(false);
    }
  };

  const toggleBrand = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  if (!user) return null;

  const queries = [...new Set(allMentions.map(m => m.query))];
  
  const getPositionForBrandAndQuery = (brand, query) => {
    const mention = allMentions.find(m => m.brand === brand && m.query === query);
    return mention;
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>Brand & Resource Tracking</h1>
        <p style={{ color: '#6b7280' }}>Compare brand mentions across queries</p>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600' }}>Select Brands to Compare</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {brands.map((brand) => {
            const isSelected = selectedBrands.includes(brand);
            const isYourBrand = allMentions.find(m => m.brand === brand && !m.is_competitor);
            
            return (
              <button
                key={brand}
                onClick={() => toggleBrand(brand)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: isSelected ? '2px solid #667eea' : '2px solid #e5e7eb',
                  background: isSelected ? '#667eea10' : 'white',
                  color: isSelected ? '#667eea' : '#374151',
                  fontWeight: isSelected ? '600' : '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '3px',
                  border: isSelected ? '2px solid #667eea' : '2px solid #d1d5db',
                  background: isSelected ? '#667eea' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px',
                }}>
                  {isSelected && '✓'}
                </span>
                {brand}
                {isYourBrand && (
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: '#10b98120',
                    color: '#10b981',
                  }}>
                    YOU
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {selectedBrands.length === 0 && (
          <p style={{ marginTop: '12px', color: '#ef4444', fontSize: '14px' }}>
            Please select at least one brand to compare
          </p>
        )}
      </div>

      {selectedBrands.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Brand Comparison Matrix</h3>
          {loading ? (
            <p>Loading...</p>
          ) : queries.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: '600',
                      borderBottom: '2px solid #e5e7eb',
                      position: 'sticky',
                      left: 0,
                      background: '#f9fafb',
                      minWidth: '300px',
                    }}>
                      Query
                    </th>
                    {selectedBrands.map((brand) => (
                      <th key={brand} style={{
                        padding: '12px',
                        textAlign: 'center',
                        fontWeight: '600',
                        borderBottom: '2px solid #e5e7eb',
                        minWidth: '120px',
                      }}>
                        {brand}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {queries.map((query, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{
                        padding: '12px',
                        fontWeight: '500',
                        position: 'sticky',
                        left: 0,
                        background: 'white',
                        borderRight: '1px solid #f3f4f6',
                      }}>
                        {query}
                      </td>
                      {selectedBrands.map((brand) => {
                        const mention = getPositionForBrandAndQuery(brand, query);
                        return (
                          <td key={brand} style={{
                            padding: '12px',
                            textAlign: 'center',
                          }}>
                            {mention ? (
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                <span style={{
                                  padding: '4px 12px',
                                  borderRadius: '12px',
                                  background: mention.position <= 3 ? '#10b98120' : mention.position <= 5 ? '#f59e0b20' : '#ef444420',
                                  color: mention.position <= 3 ? '#10b981' : mention.position <= 5 ? '#f59e0b' : '#ef4444',
                                  fontWeight: '600',
                                  fontSize: '14px',
                                }}>
                                  #{mention.position}
                                </span>
                                {mention.url && (
                                  <a
                                    href={mention.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      fontSize: '11px',
                                      color: '#667eea',
                                      textDecoration: 'none',
                                    }}
                                  >
                                    View
                                  </a>
                                )}
                              </div>
                            ) : (
                              <span style={{ color: '#d1d5db', fontSize: '18px' }}>—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>
              No data available
            </p>
          )}
        </div>
      )}
    </div>
  );
}

