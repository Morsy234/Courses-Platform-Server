const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the "uploads" directory

const mongoose = require('mongoose');
const httpStatusText = require('./utils/httpStatusText');
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

app.use(cors())
app.use(express.json());


const coursesRoutes = require('./routes/courses-routes');
const usersRoutes = require('./routes/users-routes');

// CRUD operations route
app.use('/api/courses',coursesRoutes); 
app.use('/api/users',usersRoutes); 

//Global middleware for notfound routes
app.all('*splat', (req, res,next) => {
  res.status(404).json({ status: httpStatusText.FAIL, msg: 'Route not found'});
});

//Global error handling middleware
app.use((error, req, res, next) => {
  
  res.status(error.statusCode || 500).json({ status: error.statusText || httpStatusText.ERROR, msg: error.message ,code:error.statusCode || 500, data: error.data || null});
});

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});