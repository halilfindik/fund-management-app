import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TransactionForm from './TransactionForm';
import CsvImportForm from './CsvImportForm';
import Transactions from './Transactions';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0D3B66', // Change this to your preferred primary color
    },
    secondary: {
      main: '#BCD3F2', // Change this to your preferred secondary color (6290C8)
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
    },
    h5: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    button: {
      textTransform: 'none', // Prevent buttons from being uppercase by default
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Example: Rounded corners for all buttons
        },
      },
    },
  },
});

function App() {
  const [setTransactions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/transactions')
      .then(response => setTransactions(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, );

  return (
      <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize browser styles */}
      <div>
        <TransactionForm /> {/* The form component */}
        <CsvImportForm />    {/* CSV upload form */}
        <Transactions />     {/* Transactions table */}
      </div>
    </ThemeProvider>
    
  );
}

export default App;