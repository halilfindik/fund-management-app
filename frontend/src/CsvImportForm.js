import React, { useState } from 'react';
import axios from 'axios';

const CsvImportForm = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    console.log('File selected:', e.target.files[0]);
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
        console.log("Dosya secilmedi");
        setMessage('Please select a file first.');
        return;
      }  

    const formData = new FormData();
    formData.append('csvFile', file);

    console.log('Form data is being submitted:', formData);

    axios.post('http://localhost:5000/api/upload-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        console.log('Response from server:', response.data);
        alert('CSV uploaded and processed successfully');
      })
      .catch(error => {
        console.error('Error uploading CSV:', error);
        setMessage('Error uploading CSV');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Upload CSV for Daily Fund Prices:</label>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button type="submit">Upload</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default CsvImportForm;
