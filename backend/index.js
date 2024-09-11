const multer = require('multer');
const csv = require('csv-parser'); // To parse CSV files
const fs = require('fs');
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.send('Test route working!');
});

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// CSV upload route
app.post('/api/upload-csv', upload.single('csvFile'), (req, res) => {
  if (!req.file) {
    console.error('No file received');
    return res.status(400).send('No file uploaded');
  }
  const filePath = req.file.path;
  console.log('File received at:', filePath);

  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      console.log('CSV row parsed:', data);
      results.push(data);
    })
    .on('end', () => {
      console.log('CSV parsing completed. Inserting into the database...');

      // Insert CSV data into MySQL
      results.forEach(row => {




        const { id, fund_code, date, price } = row; // Ensure column names match your CSV
        
        

        
        const sql = 'INSERT INTO fund_prices (id, fund_code, date, price) VALUES (?, ?, ?, ?)';
        
        db.query(sql, [id, fund_code, date, price], (err, result) => {
          if (err) {
            console.error('Error inserting data into MySQL:', err);
            return res.status(500).send('Error inserting data');
          }
          console.log('Row inserted:', result);
        });
      });

      // Deletes the file after processing
      fs.unlinkSync(filePath);
      console.log('File deleted after processing');
      res.send('CSV processed and data inserted successfully');
    })
    .on('error', (err) => {
      console.error('Error processing CSV:', err);
      res.status(500).send('Error processing CSV');
    });
});

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'halilfindik',
  password: 'City_Database2024',
  database: 'fund_management'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Basic route
app.get('/', (req, res) => {
  res.send('New API is running again');
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port: 5000`);
});

app.post('/api/transactions', (req, res) => {
  const { fund_code, transaction_type, transaction_date, nominal_quantity, price, amount } = req.body;

  const sql = `INSERT INTO transactions (fund_code, transaction_type, transaction_date, nominal_quantity, price, amount) VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [fund_code, transaction_type, transaction_date, nominal_quantity, price, amount], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error inserting transaction');
    }
    res.status(201).send('Transaction added');
  });
});

app.get('/api/transactions', (req, res) => {
  const sql = `SELECT * FROM transactions`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching transactions');
    }
    res.json(results);
  });
});

app.put('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  const { fund_code, transaction_type, transaction_date, nominal_quantity, price, amount } = req.body;

  const sql = `UPDATE transactions SET fund_code = ?, transaction_type = ?, transaction_date = ?, nominal_quantity = ?, price = ?, amount = ? WHERE id = ?`;

  db.query(sql, [fund_code, transaction_type, transaction_date, nominal_quantity, price, amount, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error updating transaction');
    }
    res.send('Transaction updated');
  });
});

app.delete('/api/transactions/:id', (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM transactions WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting transaction');
    }
    res.send('Transaction deleted');
  });
});

