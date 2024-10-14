const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
require('dotenv').config();


//object for express
const app = express();

//server port
const PORT = process.env.PORT || 3000;

//midlware
app.use(express.json());
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));



//listen incoming request
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
