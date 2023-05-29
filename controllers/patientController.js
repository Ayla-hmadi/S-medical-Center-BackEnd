const pool = require("../config/db");
const bcrypt = require("bcrypt");

const getPatients = async (req, res) => {
  try {
    const patients = await pool.query("SELECT * FROM patients");
    res.status(200).json(patients.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
  
};

const getPatientById = async (req, res) => {
  const id = req.params.id; // Get the ID from the request parameters

  try {
    // Query to join users table and patients table on the condition that users.id = patients.user_id
    const getPatientQuery =
      "SELECT * FROM users WHERE users.id = $1";
    const patientResult = await pool.query(getPatientQuery, [id]);
    const patient = patientResult.rows[0];

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
  
};


module.exports = { getPatients, getPatientById };
