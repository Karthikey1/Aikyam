import React, { useState } from 'react';
import axios from 'axios';
import './AnalysePlant.css'; // Import the updated CSS file

const apiKey = import.meta.env.VITE_PLANT_API_KEY;

const PlantDiseaseIdentifier = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null); // Clear any previous errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file first!');
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://api.plant.id/v2/identify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Api-Key': apiKey,
        },
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error identifying plant disease:', error.response?.data || error.message);
      setError('Failed to identify plant disease. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="plant-disease-container">
      <h1 className="header">Plant Disease Identifier</h1>
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="file-input-container">
          <label htmlFor="file-upload" className="file-label">
            {file ? file.name : 'Choose an image'}
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="file-input"
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Identifying...' : 'Identify Disease'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {result && (
        <div className="results-container">
          <h2>Results</h2>
          <div className="result-section">
            <p>
              <strong>Is Plant:</strong> {result.is_plant ? 'Yes' : 'No'} (
              {(result.is_plant_probability * 100).toFixed(2)}% confidence)
            </p>
          </div>

          <div className="suggestions-section">
            <h3>Top Suggestions</h3>
            <ul className="suggestions-list">
              {result.suggestions.map((suggestion, index) => (
                <li key={suggestion.id} className="suggestion-item">
                  <strong>{index + 1}. {suggestion.plant_name}</strong>
                  <p>Scientific Name: {suggestion.plant_details.scientific_name}</p>
                  <p>Confidence: {(suggestion.probability * 100).toFixed(2)}%</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="image-section">
            <h3>Uploaded Image</h3>
            <img
              src={result.images[0].url}
              alt="Uploaded Plant"
              className="uploaded-image"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantDiseaseIdentifier;