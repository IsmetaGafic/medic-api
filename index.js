const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/User'); // putanja do vašeg User modela
const mysql = require('mysql2');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();
const port = 5000;
app.use(bodyParser.json());
app.use(cors());


app.use('/login', authRoutes);
app.use('/users', userRoutes);

const db = mysql.createConnection({
  host: 'localhost',
  user: 'medicuser',
  password: 'StrongPassword123!',
  database: 'mediclab'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database');
  }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM Users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ success: false, message: 'Database error' });
      } else if (results.length > 0) {
        const user = results[0];
        if (user.role === 'admin') {
          res.json({ success: true, userId: user.id });
        } else {
          res.status(403).json({ success: false, message: 'Access denied' });
        }
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    });
  });
  // Ažuriranje korisnika
app.put('/users/update/:id', async (req, res) => {
  const { id } = req.params;
  const { username, name, orders, image, dateOfBirth } = req.body;
  try {
    const user = await User.findByPk(id);
    if (user) {
      user.username = username;
      user.name = name;
      user.orders = orders;
      user.image = image;
      user.dateOfBirth = dateOfBirth;
      await user.save();
      res.json({ message: 'User updated successfully', user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM Users';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ success: false, message: 'Database error' });
    } else {
      res.json(results);
    }
  });
});
app.get('/users/details/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const user = await User.findByPk(id);
      if (user) {
          res.json(user);
      } else {
          res.status(404).json({ message: 'User not found' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});



// Routes
app.post('/register', async (req, res) => {
  try {
    const { username, password, name, orders, image, dateOfBirth } = req.body;
    const user = await User.create({ username, password, name, orders, image, dateOfBirth });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while registering the user' });
  }
});




app.post('/users/block/:id', (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE Users SET status = "blocked" WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ success: false, message: 'Database error' });
    } else {
      res.json({ success: true });
    }
  });
});
app.post('/logout', (req, res) => {
  // Implement logout logic, e.g., invalidate token on client-side
  res.json({ message: 'Logged out successfully' });
});



app.listen(5000, () => {
  console.log('Server is running on port 5000');
});


  
  