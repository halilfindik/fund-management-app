import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TransactionForm from './TransactionForm';
import CsvImportForm from './CsvImportForm';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1d3557', // Change this to your preferred primary color
    },
    secondary: {
      main: '#f1faee', // Change this to your preferred secondary color
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
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/transactions')
      .then(response => setTransactions(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize browser styles */}
      <div>
        <TransactionForm /> {/* The form component */}
      </div>
    </ThemeProvider>
      <h1>Gerçekleşmiş İşlemler</h1>
      <ul>
        {transactions.map(transaction => (
          <li key={transaction.id}>
            {transaction.transaction_date} - {transaction.fund_code} - {transaction.transaction_type} - {transaction.amount} - {transaction.price}
          </li>
        ))}
      </ul>
      <CsvImportForm />
    </div>
    
  );
}

export default App;