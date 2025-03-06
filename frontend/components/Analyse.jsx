import React, { useState } from 'react';
import axios from 'axios';

function PlantAnalysis() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:5000/analyze-plant', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'Analysis failed' });
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Plant Disease Analyzer</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit" disabled={!file || loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      {result && (
        <div>
          {result.error ? (
            <p>Error: {result.error}</p>
          ) : (
            <>
              <h2>Analysis Results:</h2>
              <h3>Disease: {result.disease}</h3>
              
              <h4>Precautions:</h4>
              <ul>
                {result.precautions?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <h4>Prevention:</h4>
              <ul>
                {result.prevention?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <h4>Pesticides:</h4>
              <ul>
                {result.pesticides?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default PlantAnalysis;