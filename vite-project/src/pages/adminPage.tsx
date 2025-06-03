import React from 'react';
import '../styles/App.css';
import '../styles/profile.css';

const AdminPage: React.FC = () => {
  return (
    <div className="profile-container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div className="profile-header">
        <h1>Admin Menu</h1>
      </div>
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        <button
          className="btn btn-gradient-primary"
          style={{ minWidth: 220, minHeight: 120, fontSize: '1.2rem', borderRadius: 16, boxShadow: 'var(--shadow-lg)' }}
          onClick={() => window.location.href = '/create-auction'}
        >
          Create Auction
        </button>
        <button
          className="btn btn-gradient-secondary"
          style={{ minWidth: 220, minHeight: 120, fontSize: '1.2rem', borderRadius: 16, boxShadow: 'var(--shadow-lg)' }}
          onClick={() => window.location.href = '/winner-list'}
        >
          Lihat Pemenang Lelang
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
