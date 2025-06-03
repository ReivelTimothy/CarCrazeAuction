import React from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionHistory from '../components/TransactionHistory';
import { useAuth } from '../context/AuthContext';

const TransactionHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <button 
          className="back-button"
          onClick={() => navigate('/profile')}
        >
          ← Back to Profile
        </button>
        <h1>My Transaction History</h1>
        <p>View and manage all your auction transactions</p>
      </div>
      <TransactionHistory />
    </div>
  );
};

export default TransactionHistoryPage;
