import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Box, Typography, Container, CssBaseline } from '@mui/material';
import axios from 'axios';
import logo from './logo.png';


const TransactionForm = () => {
  const [transactionData, setTransactionData] = useState({
    fund_code: '',
    transaction_type: '',
    transaction_date: '',
    nominal_quantity: '',
    price: '',
    amount: '' // Otomatik hesaplanacak
  });

  const [errors, setErrors] = useState({}); // To track validation errors

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update state
    setTransactionData({ ...transactionData, [name]: value });
  };

  // Automatically calculate the "Amount" field when "Nominal Quantity" or "Price" changes
  useEffect(() => {
    setTransactionData(prevData => {
      const { nominal_quantity, price } = prevData;
      
      if (nominal_quantity && price) {
        const calculatedAmount = parseFloat(nominal_quantity) * parseFloat(price);
        return { ...prevData, amount: calculatedAmount.toFixed(2) };
      }
      
      return { ...prevData, amount: '' }; // Reset amount if inputs are invalid
    });
  }, [transactionData.nominal_quantity, transactionData.price]);

  // Validate the form before submission
  const validateForm = () => {
    let formErrors = {};

    // Check if fund code is selected
    if (!transactionData.fund_code) {
      formErrors.fund_code = 'Lütfen fon kodunu seçiniz.';
    }

    // Check if transaction type is selected
    if (!transactionData.transaction_type) {
      formErrors.transaction_type = 'Lütfen işlem türünü seçiniz.';
    }

    // Check if transaction date is filled
    if (!transactionData.transaction_date) {
      formErrors.transaction_date = 'Lütfen işlem tarihini giriniz.';
    }

    // Check if nominal quantity is a positive number
    if (!transactionData.nominal_quantity || parseFloat(transactionData.nominal_quantity) <= 0) {
      formErrors.nominal_quantity = 'Lütfen geçerli bir miktar giriniz.';
    }

    // Check if price is a positive number
    if (!transactionData.price || parseFloat(transactionData.price) <= 0) {
      formErrors.price = 'Lütfen geçerli birim fiyat giriniz.';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; // Return true if no errors
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      axios.post('http://localhost:5000/api/transactions', transactionData)
        .then(response => {
          alert('İşlem Başarıyla Eklendi'); 
          setTransactionData({
            fund_code: '',
            transaction_type: '',
            transaction_date: '',
            nominal_quantity: '',
            price: '',
            amount: ''
          });
        })
        .catch(error => {
          console.error('İşlem ekleme hatası :', error);
        });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={logo} alt="Logo" style={{ width: '200px', marginBottom: '20px' }} />              
              <Typography variant="h5" gutterBottom align="center">Fund Transaction Form</Typography>

              <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Fon Kodu</InputLabel>
                  <Select name="fund_code" value={transactionData.fund_code} onChange={handleChange}>
                    <MenuItem value=""><em>İlgili Fonu Seçin</em></MenuItem>
                    <MenuItem value="PVK">PVK</MenuItem>
                    <MenuItem value="RBV">RBV</MenuItem>
                    <MenuItem value="RTI">RTI</MenuItem>
                    <MenuItem value="RPU">RPU</MenuItem>
                  </Select>
                  {errors.fund_code && <Typography color="error">{errors.fund_code}</Typography>}
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>İşlem Türü</InputLabel>
                  <Select name="transaction_type" value={transactionData.transaction_type} onChange={handleChange}>
                    <MenuItem value=""><em>İşlem Seçin</em></MenuItem>
                    <MenuItem value="buy">Alış</MenuItem>
                    <MenuItem value="sell">Satış</MenuItem>
                  </Select>
                  {errors.transaction_type && <Typography color="error">{errors.transaction_type}</Typography>}
                </FormControl>

                <TextField
                  fullWidth
                  label="İşlem Tarihi"
                  name="transaction_date"
                  type="date"
                  value={transactionData.transaction_date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  error={Boolean(errors.transaction_date)}
                  helperText={errors.transaction_date}
                />

                <TextField
                  fullWidth
                  label="Nominal Adet"
                  name="nominal_quantity"
                  type="number"
                  value={transactionData.nominal_quantity}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  error={Boolean(errors.nominal_quantity)}
                  helperText={errors.nominal_quantity}
                />

                <TextField
                  fullWidth
                  label="Birim Fiyat"
                  name="price"
                  type="number"
                  value={transactionData.price}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  error={Boolean(errors.price)}
                  helperText={errors.price}
                />

                <TextField
                  fullWidth
                  label="Tutar (Otomatik Hesaplanır)"
                  name="amount"
                  type="text"
                  value={transactionData.amount}
                  readOnly
                  margin="normal"
                />

                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                  İşlemi Gönder
                </Button>
              </form>
            </Box>
    </Container>
  );
};

export default TransactionForm;