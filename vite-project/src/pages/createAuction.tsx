import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createVehicle } from '../services/vehicleService';
import { createAuction } from '../services/auctionService';
import '../styles/createAuction.css';

const CreateAuction: React.FC = () => {
  const navigate = useNavigate();

  // Vehicle form state
  const [vehicleData, setVehicleData] = useState({
    type: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    mileage: 0,
    transmissionType: 'Automatic',
    fuelType: 'Gasoline',
    condition: 'Used',
    documents: '',
    name: '',
    price: 0
  });

  // Auction form state
  const [auctionData, setAuctionData] = useState({
    title: '',
    description: '',
    startingPrice: 0,
    status: 'pending' as 'pending' | 'active' | 'closed',
    category: 'Cars',
    image: '' as string | File
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1 for vehicle info, 2 for auction info

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVehicleData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'mileage' || name === 'price' ? Number(value) : value
    }));
  };

const handleAuctionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  const { name, value, type } = e.target;
  if (type === 'file' && name === 'image') {
    const fileInput = e.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      setAuctionData(prev => ({
        ...prev,
        image: fileInput.files![0] 
      }));
    }
  } else {
    setAuctionData(prev => ({
      ...prev,
      [name]: name === 'startingPrice' ? Number(value) : value
    }));
  }
};

  const handleNextStep = () => {
    // Validate vehicle data
    if (!vehicleData.brand || !vehicleData.model || !vehicleData.type) {
      setError('Please fill all required vehicle fields');
      return;
    }
    console.log(auctionData);

    // Proceed to next step
    setStep(2);
    setError(null);

    // Pre-fill auction title
    setAuctionData(prev => ({
      ...prev,
      title: `${vehicleData.year} ${vehicleData.brand} ${vehicleData.model}`,
      startingPrice: vehicleData.price
    }));
  };

  const handlePreviousStep = () => {
    setStep(1);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  // Validate auction data
  if (!auctionData.title || !auctionData.description || auctionData.startingPrice <= 0) {
    setError('Please fill all required auction fields');
    return;
  }

  try {
    setLoading(true);

    // Create the vehicle first
    const newVehicle = await createVehicle(vehicleData);

    // Siapkan data untuk FormData (perhatikan field startPrice dan image)
  
    const auctionPayload: any = {
      title: auctionData.title,
      description: auctionData.description,
      startingPrice: auctionData.startingPrice,
      status: auctionData.status,
      category: auctionData.category,
      image: auctionData.image ,
      vehicle_id: newVehicle.vehicle_id,
    };

    // Kirim ke service
    const newAuction = await createAuction(auctionPayload);

    navigate(`/auction/${newAuction.auction_id}`);
  } catch (err: any) {
    console.error('Error creating auction:', err);
    setError(err.message || 'Failed to create auction. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="create-auction-container">
      <h1 className="page-title">Create New Auction</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="steps-indicator">
        <div className={`step ${step === 1 ? 'active' : (step > 1 ? 'completed' : '')}`}>
          <div className="step-number">1</div>
          <div className="step-label">Vehicle Details</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${step === 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Auction Details</div>
        </div>
      </div>

      {step === 1 ? (
        <div className="form-section">
          <h2>Vehicle Information</h2>
          <form className="vehicle-form">
            <div className="form-group">
              <label htmlFor="brand">Brand *</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={vehicleData.brand}
                onChange={handleVehicleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="model">Model *</label>
              <input
                type="text"
                id="model"
                name="model"
                value={vehicleData.model}
                onChange={handleVehicleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="type">Vehicle Type *</label>
                <select
                  id="type"
                  name="type"
                  value={vehicleData.type}
                  onChange={handleVehicleChange}
                  required
                >
                  <option value="">Select type</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Truck">Truck</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Van">Van</option>
                  <option value="Wagon">Wagon</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="year">Year</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={vehicleData.year}
                  onChange={handleVehicleChange}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="color">Color</label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={vehicleData.color}
                  onChange={handleVehicleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="mileage">Mileage (km)</label>
                <input
                  type="number"
                  id="mileage"
                  name="mileage"
                  value={vehicleData.mileage}
                  onChange={handleVehicleChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="transmissionType">Transmission</label>
                <select
                  id="transmissionType"
                  name="transmissionType"
                  value={vehicleData.transmissionType}
                  onChange={handleVehicleChange}
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="CVT">CVT</option>
                  <option value="Semi-automatic">Semi-automatic</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="fuelType">Fuel Type</label>
                <select
                  id="fuelType"
                  name="fuelType"
                  value={vehicleData.fuelType}
                  onChange={handleVehicleChange}
                >
                  <option value="Gasoline">Gasoline</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="condition">Condition</label>
                <select
                  id="condition"
                  name="condition"
                  value={vehicleData.condition}
                  onChange={handleVehicleChange}
                >
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                  <option value="Certified Pre-owned">Certified Pre-owned</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="price">Base Price ($)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={vehicleData.price}
                  onChange={handleVehicleChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="documents">Documents</label>
              <textarea
                id="documents"
                name="documents"
                value={vehicleData.documents}
                onChange={handleVehicleChange}
                placeholder="List all available documents (e.g., service history, ownership papers, etc.)"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="name">Vehicle Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={vehicleData.name}
                onChange={handleVehicleChange}
                placeholder="Custom name for this vehicle (optional)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Vehicle Image</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleAuctionChange}
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNextStep}
              >
                Next: Auction Details
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="form-section">
          <h2>Auction Information</h2>
          <form onSubmit={handleSubmit} className="auction-form">
            <div className="form-group">
              <label htmlFor="title">Auction Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={auctionData.title}
                onChange={handleAuctionChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={auctionData.description}
                onChange={handleAuctionChange}
                placeholder="Provide a detailed description of the vehicle and auction terms"
                required
                rows={5}
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startingPrice">Starting Price ($) *</label>
                <input
                  type="number"
                  id="startingPrice"
                  name="startingPrice"
                  value={auctionData.startingPrice}
                  onChange={handleAuctionChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={auctionData.category}
                  onChange={handleAuctionChange}
                >
                  <option value="Cars">Cars</option>
                  <option value="SUVs">SUVs</option>
                  <option value="Trucks">Trucks</option>
                  <option value="Luxury">Luxury Vehicles</option>
                  <option value="Classics">Classic Cars</option>
                  <option value="Electric">Electric Vehicles</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handlePreviousStep}
                disabled={loading}
              >
                Back: Vehicle Details
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating Auction...' : 'Create Auction'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateAuction;