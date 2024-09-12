import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from '@mui/material';

// Function to format the date in dd.mm.yyyy format
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR').format(date); // Using 'tr-TR' locale for dd.mm.yyyy format
  };
  
  // Function to format prices with the correct separators
  const formatPrice = (number) => {
    return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 6 }).format(number);
  };

  // Function to format amounts with the correct separators
  const formatAmount = (number) => {
    return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(number);
  };

  // Function to format quantities with the correct separators
  const formatQuantity = (number) => {
    return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0 }).format(number);
  };

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch the transactions from the API
    axios.get('http://localhost:5000/api/transactions')
      .then(response => {
        setTransactions(response.data);
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
      });
  }, []);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h5" gutterBottom align="center">İşlemler</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center"><strong>Kod</strong></TableCell>
              <TableCell align="center"><strong>İşlem</strong></TableCell>
              <TableCell align="center"><strong>Tarihi</strong></TableCell>
              <TableCell align="center"><strong>Adet</strong></TableCell>
              <TableCell align="center"><strong>Fiyat</strong></TableCell>
              <TableCell align="center"><strong>Tutar</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map(transaction => (
              <TableRow key={transaction.id}>
                <TableCell align="center">{transaction.fund_code}</TableCell>
                <TableCell align="center">{transaction.transaction_type}</TableCell>
                <TableCell align="center">{formatDate(transaction.transaction_date)}</TableCell>
                <TableCell align="center">{formatQuantity(transaction.nominal_quantity)}</TableCell>
                <TableCell align="center">{formatPrice(transaction.price)}</TableCell>
                <TableCell align="right">{formatAmount(transaction.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Transactions;
