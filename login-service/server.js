const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: String
});

const User = mongoose.model('User', userSchema);

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB (Login Service)'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Login Service is running');
});

app.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ name, password });
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      return res.json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email } });
    } else {
      return res.json({ message: 'Login successful (In-Memory mode)', user: { name } });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Login Service listening on port ${PORT}`);
});

