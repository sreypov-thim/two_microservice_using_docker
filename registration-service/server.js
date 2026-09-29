const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB (Registration Service)'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Registration Service is running');
});

app.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      const user = new User({ username, password, email });
      await user.save();
      return res.status(201).json({ message: 'User registered successfully', user: { id: user._id, username, email } });
    } else {
      return res.status(201).json({ message: 'User registered (In-Memory mode)', user: { username, email } });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const users = await User.find({}, '-password');
      return res.json(users);
    }
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Registration Service listening on port ${PORT}`);
});

