import React, { useState } from 'react';
import axios from 'axios';

const DiseaseDetector = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select an image first!');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/predict', formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Plant Disease Detection</h1>
      
      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          id="file-input"
        />
        <label htmlFor="file-input" className="upload-btn">
          Choose Image
        </label>

        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Plant preview" />
          </div>
        )}
      </div>

      <button 
        onClick={handleSubmit}
        disabled={!file || loading}
        className="submit-btn"
      >
        {loading ? 'Analyzing...' : 'Detect Disease'}
      </button>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="results">
          <h2>Detection Results</h2>
          <div className="result-item">
            <span>Disease:</span>
            <strong>{result.disease}</strong>
          </div>
          <div className="result-item">
            <span>Confidence:</span>
            <strong>{(result.confidence * 100).toFixed(2)}%</strong>
          </div>
          <div className="result-item">
            <span>Recommended Treatment:</span>
            <p>{result.treatment}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseDetector;