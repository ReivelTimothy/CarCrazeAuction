import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserTransactionHistory } from '../services/transactionService';
import '../styles/transactionHistory.css';

interface Transaction {
  transaction_id: string;
  auction_id: string;
  amount: number;
  transactionDate: string;
  paymentMethod: string;
  status: string;
  vehicleInfo: string;
  statusColor: string;
  formattedDate: string;
  formattedAmount: string;
  auction: {
    auction_id: string;
    title: string;
    description: string;
    vehicle: {
      vehicle_id: string;
      make: string;
      model: string;
      year: number;
      color: string;
      image?: string;
    };
  };
}

interface TransactionHistoryData {
  count: number;
  transactions: Transaction[];
}

const TransactionHistory: React.FC = () => {
  const [transactionData, setTransactionData] = useState<TransactionHistoryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all'); // 'all', 'completed', 'pending'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCurrentUserTransactionHistory();
        setTransactionData(data);
      } catch (err) {
        console.error('Error fetching transaction history:', err);
        setError('Failed to load transaction history. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionHistory();
  }, []);

  const filteredTransactions = transactionData?.transactions.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'completed') return transaction.status === 'Completed';
    if (filter === 'pending') return transaction.status === 'Pending';
    return true;
  }) || [];

  const getStatusIcon = (status: string) => {
    return status === 'Completed' ? '✓' : '⏳';
  };

  if (loading) {
    return (
      <div className="transaction-history-loading">
        <div className="loading-spinner"></div>
        <p>Loading transaction history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transaction-history-error">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="transaction-history">
      <div className="transaction-history-header">
        <h2>Transaction History</h2>
        <div className="transaction-summary">
          <div className="summary-item">
            <span className="summary-label">Total Transactions:</span>
            <span className="summary-value">{transactionData?.count || 0}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Completed:</span>
            <span className="summary-value completed">
              {transactionData?.transactions.filter(t => t.status === 'Completed').length || 0}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Pending:</span>
            <span className="summary-value pending">
              {transactionData?.transactions.filter(t => t.status === 'Pending').length || 0}
            </span>
          </div>
        </div>
      </div>

      <div className="transaction-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({transactionData?.count || 0})
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed ({transactionData?.transactions.filter(t => t.status === 'Completed').length || 0})
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({transactionData?.transactions.filter(t => t.status === 'Pending').length || 0})
        </button>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="no-transactions">
          <div className="no-transactions-icon">💳</div>
          <h3>No transactions found</h3>
          <p>
            {filter === 'all' 
              ? "You haven't completed any transactions yet." 
              : `No ${filter} transactions found.`
            }
          </p>
          <button 
            onClick={() => navigate('/')} 
            className="btn btn-primary"
          >
            Browse Auctions
          </button>
        </div>
      ) : (
        <div className="transaction-list">
          {filteredTransactions.map(transaction => (
            <div 
              key={transaction.transaction_id} 
              className={`transaction-item ${transaction.statusColor}`}
              onClick={() => navigate(`/transaction/${transaction.transaction_id}`)}
            >
              <div className="transaction-image">
                {transaction.auction.vehicle.image ? (
                  <img 
                    src={`http://localhost:3000/uploads/${transaction.auction.vehicle.image}`} 
                    alt={transaction.vehicleInfo}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const placeholder = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                      if (placeholder) placeholder.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="image-placeholder" style={{ display: transaction.auction.vehicle.image ? 'none' : 'flex' }}>
                  🚗
                </div>
              </div>

              <div className="transaction-details">
                <div className="transaction-main-info">
                  <h3 className="auction-title">{transaction.auction.title}</h3>
                  <p className="vehicle-info">{transaction.vehicleInfo}</p>
                  <p className="vehicle-color">Color: {transaction.auction.vehicle.color}</p>
                </div>

                <div className="transaction-meta">
                  <div className="transaction-amount">
                    <span className="amount-label">Amount:</span>
                    <span className="amount-value">{transaction.formattedAmount}</span>
                  </div>
                  <div className="transaction-date">
                    <span className="date-label">Date:</span>
                    <span className="date-value">{transaction.formattedDate}</span>
                  </div>
                  <div className="payment-method">
                    <span className="method-label">Payment:</span>
                    <span className="method-value">{transaction.paymentMethod}</span>
                  </div>
                </div>
              </div>

              <div className="transaction-status">
                <div className={`status-badge ${transaction.status.toLowerCase()}`}>
                  <span className="status-icon">{getStatusIcon(transaction.status)}</span>
                  <span className="status-text">{transaction.status}</span>
                </div>
                <div className="transaction-actions">
                  <button 
                    className="view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/transaction/${transaction.transaction_id}`);
                    }}
                  >
                    View Details
                  </button>
                  <button 
                    className="auction-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/auction/${transaction.auction_id}`);
                    }}
                  >
                    View Auction
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
