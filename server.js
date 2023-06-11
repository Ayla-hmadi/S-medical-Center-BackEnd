const express = require("express");
const pool = require("./config/db");
const cors = require('cors');
const app = express();

app.use(cors());

// Middleware
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const requestRoutes = require('./routes/requestRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const messageRoutes = require('./routes/messageRoutes');


app.use('/users', userRoutes);
app.use('/patients', patientRoutes);
app.use('/doctors', doctorRoutes);
app.use('/requests', requestRoutes);
app.use('/appointments' , appointmentRoutes);
app.use('/messages' , messageRoutes);



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = server;
