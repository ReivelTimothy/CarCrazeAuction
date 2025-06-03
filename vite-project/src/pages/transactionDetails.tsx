import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTransactionById, updateTransactionStatus } from '../services/transactionService';
import { getAuctionById } from '../services/auctionService';
import { useAuth } from '../context/AuthContext';
import '../styles/transaction.css';

const TransactionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<any>(null);
  const [auction, setAuction] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('credit_card');
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (!id || !user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch transaction details
        const transactionData = await getTransactionById(id);
        setTransaction(transactionData);
        
        // Fetch auction details
        const auctionData = await getAuctionById(transactionData.auction_id);
        setAuction(auctionData);
        
        // Ensure the current user is the one who won
        if (transactionData.user_id !== user.user_id) {
          setError("You don't have access to this transaction");
        }
      } catch (err: any) {
        console.error('Error fetching transaction details:', err);
        setError('Failed to load transaction details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactionDetails();
  }, [id, user]);

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transaction || !user) return;
    
    try {
      setPaymentProcessing(true);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update transaction status
      await updateTransactionStatus(transaction.transaction_id, 'Completed');
      
      // Refresh transaction data
      const updatedTransaction = await getTransactionById(id!);
      setTransaction(updatedTransaction);
      
      setPaymentSuccess(true);
    } catch (err: any) {
      console.error('Error processing payment:', err);
      setError('Payment processing failed. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (loading) {
    return <div className="transaction-loading">Loading transaction details...</div>;
  }

  if (error) {
    return <div className="transaction-error">{error}</div>;
  }

  if (!transaction || !auction) {
    return <div className="transaction-error">Transaction or auction details not found</div>;
  }

  return (
    <div className="transaction-container">
      <div className="transaction-header">
        <button className="back-button" onClick={() => navigate(`/auction/${auction.auction_id}`)}>
          ← Back to Auction
        </button>
        <div className="transaction-status-tag">
          <div className={`status-indicator ${transaction.status === 'Completed' ? 'completed' : 'pending'}`}></div>
          {transaction.status}
        </div>
      </div>
      
      <div className="transaction-content">
        <div className="transaction-summary">
          <h1>Transaction Details</h1>
          
          <div className="transaction-info">            <div className="info-group">
              <h3>Auction Information</h3>
              <div className="info-item">
                <span className="info-label">Auction Title:</span>
                <span className="info-value">{auction.title}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Winning User:</span>
                <span className="info-value">{transaction.user?.username || `User ${transaction.user_id}`}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Winning Bid:</span>
                <span className="info-value price">${transaction.amount.toLocaleString()}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Transaction Date:</span>
                <span className="info-value">
                  {new Date(transaction.transactionDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
          
          {paymentSuccess || transaction.status === 'Completed' ? (
            <div className="payment-success">
              <div className="success-icon">✓</div>
              <h2>Payment Successful!</h2>
              <p>Your payment has been processed successfully. Thank you for your purchase!</p>
              <button className="primary-button" onClick={() => navigate('/profile')}>
                View in My Account
              </button>
            </div>
          ) : (
            <div className="payment-section">
              <h3>Complete Your Payment</h3>
              
              <form onSubmit={handleSubmitPayment} className="payment-form">
                <div className="payment-methods">
                  <h4>Select Payment Method</h4>
                  
                  <div className="payment-option">
                    <input
                      type="radio"
                      id="credit_card"
                      name="paymentMethod"
                      value="credit_card"
                      checked={paymentMethod === 'credit_card'}
                      onChange={handlePaymentMethodChange}
                    />
                    <label htmlFor="credit_card">Credit Card</label>
                  </div>
                  
                  <div className="payment-option">
                    <input
                      type="radio"
                      id="bank_transfer"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={handlePaymentMethodChange}
                    />
                    <label htmlFor="bank_transfer">Bank Transfer</label>
                  </div>
                  
                  <div className="payment-option">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={handlePaymentMethodChange}
                    />
                    <label htmlFor="paypal">PayPal</label>
                  </div>
                </div>
                
                {paymentMethod === 'credit_card' && (
                  <div className="payment-details credit-card">
                    <div className="form-group">
                      <label htmlFor="card_number">Card Number</label>
                      <input
                        type="text"
                        id="card_number"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="expiry_date">Expiry Date</label>
                        <input
                          type="text"
                          id="expiry_date"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="cvv">CVV</label>
                        <input
                          type="text"
                          id="cvv"
                          placeholder="123"
                          maxLength={3}
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="card_name">Name on Card</label>
                      <input
                        type="text"
                        id="card_name"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'bank_transfer' && (
                  <div className="payment-details bank-transfer">
                    <div className="bank-info">
                      <p>Please transfer the amount to the following account:</p>
                      <div className="bank-details">
                        <div className="bank-detail-item">
                          <span>Bank:</span>
                          <strong>CarCraze Bank</strong>
                        </div>
                        <div className="bank-detail-item">
                          <span>Account Number:</span>
                          <strong>123456789</strong>
                        </div>
                        <div className="bank-detail-item">
                          <span>Account Name:</span>
                          <strong>CarCraze Auction</strong>
                        </div>
                        <div className="bank-detail-item">
                          <span>Reference:</span>
                          <strong>TRX-{transaction.transaction_id}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'paypal' && (
                  <div className="payment-details paypal">
                    <p>You will be redirected to PayPal to complete your payment.</p>
                  </div>
                )}
                
                <button
                  type="submit"
                  className="submit-payment-btn"
                  disabled={paymentProcessing}
                >
                  {paymentProcessing ? 'Processing...' : 'Complete Payment'}
                </button>
              </form>
            </div>
          )}
        </div>
        
        <div className="auction-preview">
          {auction.image ? (
            <img src={`http://localhost:3000/uploads/${auction.image}`} alt={auction.title} />
          ) : (
            <div className="placeholder-image">
              <span>Vehicle Image</span>
            </div>
          )}
          <h2>{auction.title}</h2>
          <div className="auction-preview-info">
            <p className="auction-preview-description">
              {auction.description.substring(0, 150)}
              {auction.description.length > 150 ? '...' : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
