const pool = require("../config/db");


const addUser = async (req, res) => {
    const { username, password, email, user_type, name, address, phone, specialty, calendly } = req.body;
  
    try {
      await pool.query("BEGIN");

      const checkUserQuery = "SELECT * FROM users WHERE username = $1 OR email = $2";
      const ucheckUserResult = await pool.query(checkUserQuery, [username, email]);

      if (ucheckUserResult.rows.length > 0) {
        for (let i = 0; i < ucheckUserResult.rows.length; i++) {
          if (ucheckUserResult.rows[i].username === username) {
            return res.status(409).send("Username already exists");
          }
          if (ucheckUserResult.rows[i].email === email) {
            return res.status(409).send("Email already exists");
          }
        }
      }
  
      const insertUserQuery = "INSERT INTO users (username, password, email, user_type) VALUES ($1, $2, $3, $4) RETURNING id";
      const userResult = await pool.query(insertUserQuery, [username, password, email, user_type]);
      const userId = userResult.rows[0].id;
  
      let insertAdditionalInfoQuery = "";
      if (user_type === "patient") {
        insertAdditionalInfoQuery = "INSERT INTO patients (user_id, name, address, phone) VALUES ($1, $2, $3, $4)";
        await pool.query(insertAdditionalInfoQuery, [userId, username, address, phone]);
      } else if (user_type === "doctor") {
        insertAdditionalInfoQuery = "INSERT INTO doctors (user_id, name, address, phone, specialty, calendly) VALUES ($1, $2, $3, $4, $5, $6)";
        await pool.query(insertAdditionalInfoQuery, [userId, name, address, phone, specialty, calendly]);
      }
  
      await pool.query("COMMIT");
  
      res.status(201).send(`User added with ID: ${userId}`);
    } catch (err) {
      await pool.query("ROLLBACK");
      console.error(err);
      res.status(500).send("Error adding user to database");
    } 
  };

  const getUsers = async (req, res) => {
    try {
      const users = await pool.query('SELECT * FROM users');
      res.status(200).json(users.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const getUserByID = async (req, res) => {
    const id = req.params.id; // Get the ID from the request parameters
  
    try {
      // Query to join users table and patients table on the condition that users.id = patients.user_id
      const getPatientQuery =
        "SELECT * FROM patients WHERE patients.id = $1";
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

  const getUserID = async (req, res) => {
    const id = req.params.id; // Get the ID from the request parameters
  
    try {
      // Query to join users table and patients table on the condition that users.id = patients.user_id
      const getPatientQuery =
        "SELECT * FROM users WHERE users.id = $1";
      const patientResult = await pool.query(getPatientQuery, [id]);
      const patient = patientResult.rows[0];
  
      if (!patient) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(patient);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

  
  const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { username, password, email, user_type, name, address, phone, specialty } = req.body;
  
    try {
      await pool.query("BEGIN");
  
      // Check if the username or email already exists
      const checkUserQuery = "SELECT * FROM users WHERE username = $1 OR email = $2";
      const existingUser = await pool.query(checkUserQuery, [username, email]);
  
      if (existingUser.rows.length > 0 && existingUser.rows[0].id != userId) {
        await pool.query("ROLLBACK");
        return res.status(400).send(`Username or email already exists`);
      }
  
      // Update the user in the users table
      const updateUserQuery = "UPDATE users SET username = $1, password = $2, email = $3, user_type = $4 WHERE id = $5";
      await pool.query(updateUserQuery, [username, password, email, user_type, userId]);
  
      // Update additional information based on the user type
      let updateAdditionalInfoQuery = "";
      if (user_type === "patient") {
        if (name && address && phone) {
          updateAdditionalInfoQuery = "UPDATE patients SET name = $1, address = $2, phone = $3 WHERE user_id = $4";
          await pool.query(updateAdditionalInfoQuery, [name, address, phone, userId]);
        }
      } else if (user_type === "doctor") {
        if (name && address && phone && specialty) {
          updateAdditionalInfoQuery = "UPDATE doctors SET name = $1, address = $2, phone = $3, specialty = $4 WHERE user_id = $5";
          await pool.query(updateAdditionalInfoQuery, [name, address, phone, specialty, userId]);
        }
      }
  
      await pool.query("COMMIT");
  
      res.status(200).send(`User with ID ${userId} updated`);
    } catch (err) {
      await pool.query("ROLLBACK");
      console.error(err);
      res.status(500).send(`Error updating user with ID ${userId}`);
    }
  };
  

  const deleteUser = async (req, res) => {
    const userId = req.params.id;
    
    try {
      await pool.query("BEGIN");
  
      // Delete the user from the users table
      const deleteUserQuery = "DELETE FROM users WHERE id = $1";
      await pool.query(deleteUserQuery, [userId]);
  
      
  
      await pool.query("COMMIT");
  
      res.status(200).send(`User with ID ${userId} deleted`);
    } catch (err) {
      await pool.query("ROLLBACK");
      console.error(err);
      res.status(500).send(`Error deleting user with ID ${userId}`);
    }
  };
  


  module.exports = { addUser , getUsers ,updateUser,deleteUser,getUserByID,getUserID };