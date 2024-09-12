import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import axios from 'axios';

const CsvImportForm = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    console.log('Dosya seçildi:', e.target.files[0]);
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
        console.log("Dosya seçilmedi.");
        setMessage('Lütfen bir dosya seçiniz.');
        return;
      }  

    const formData = new FormData();
    formData.append('csvFile', file);

    console.log('Form verisi yüklendi:', formData);

    axios.post('http://localhost:5000/api/upload-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        console.log('Server yanıtı:', response.data);
        alert('CSV yüklendi ve başarılı bir şekilde işlendi.');
      })
      .catch(error => {
        console.error('CSV yükleme hatası:', error);
        setMessage('CSV yükleme hatası');
      });
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 3, border: '1px solid #cddd', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom align="center">Fon Fiyatları Yükleme</Typography>
      <form onSubmit={handleSubmit}>
        <Button
          variant="contained"
          component="label"
          color="secondary"
          fullWidth
          sx={{ mb: 2 }}
        >
          Dosya Seç 
          <input type="file" accept=".csv" hidden onChange={handleFileChange} />
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          CSV Yükle
        </Button>

        {message && (
          <Typography variant="body2" color={message.includes('Error') ? 'error' : 'success'} sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </form>
    </Box>
  );
};

export default CsvImportForm;
