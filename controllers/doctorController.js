const pool = require("../config/db");
const bcrypt = require("bcrypt");


  const getDoctors = async (req, res) => {
    try {
      const doctors = await pool.query('SELECT * FROM doctors');
      res.status(200).json(doctors.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const getDoctorById = async (req, res) => {
    const doctorId = req.params.id;
  
    try {
      // Retrieve the doctor from the users table
      const getDoctorQuery = "SELECT * FROM users JOIN doctors ON users.id = doctors.user_id WHERE doctors.user_id = $1";
      const doctorResult = await pool.query(getDoctorQuery, [doctorId]);
      const doctor = doctorResult.rows[0];
  
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
  
      res.status(200).json(doctor);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
    
  };
  
  
  module.exports = {getDoctors , getDoctorById };