const pool = require("../config/db");

const createRequest = async (req, res) => {
  const { patient_id, doctor_id, request_date, status } = req.body;

  try {
    const insertRequestQuery =
      "INSERT INTO requests (patient_id, doctor_id, request_date, status) VALUES ($1, $2, $3, $4) RETURNING *";
    const newRequest = await pool.query(insertRequestQuery, [
      patient_id,
      doctor_id,
      request_date,
      status,
    ]);
    res.status(201).json(newRequest.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating request" });
  }
  
};

const getRequests = async (req, res) => {
  try {
    const requests = await pool.query("SELECT * FROM requests");
    res.status(200).json(requests.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting requests" });
  }
  
};

const getRequestById = async (req, res) => {
  const id = req.params.id;

  try {
    const request = await pool.query("SELECT * FROM requests WHERE id = $1", [
      id,
    ]);
    if (request.rowCount === 0) {
      res.status(404).json({ message: `Request with ID ${id} not found` });
    } else {
      res.status(200).json(request.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting request" });
  }
  
};

const updateRequest = async (req, res) => {
  const id = req.params.id;
  const { patient_id, doctor_id, request_date, status } = req.body;

  try {
    const updateRequestQuery =
      "UPDATE requests SET patient_id = $1, doctor_id = $2, request_date = $3, status = $4 WHERE id = $5 RETURNING *";
    const updatedRequest = await pool.query(updateRequestQuery, [
      patient_id,
      doctor_id,
      request_date,
      status,
      id,
    ]);
    if (updatedRequest.rowCount === 0) {
      res.status(404).json({ message: `Request with ID ${id} not found` });
    } else {
      res.status(200).json(updatedRequest.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error updating request with ID ${id}` });
  }
  
};

const deleteRequest = async (req, res) => {
  const requestId = req.params.id;

  try {
    await pool.query("BEGIN");

    // Delete the request from the requests table
    const deleteRequestQuery = "DELETE FROM requests WHERE id = $1";
    await pool.query(deleteRequestQuery, [requestId]);

    await pool.query("COMMIT");

    res.status(200).send(`Request with ID ${requestId} deleted`);
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    res.status(500).send(`Error deleting request with ID ${requestId}`);
  }
  
};

// Get requests by patient ID
const getRequestsByPatientId = async (req, res) => {
  const patientId = req.params.patientId;

  try {
    const requests = await pool.query(
      "SELECT * FROM requests WHERE patient_id = $1",
      [patientId]
    );
    res.status(200).json(requests.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
  
};

// Get requests by doctor ID
const getRequestsByDoctorId = async (req, res) => {
  const doctorId = req.params.doctorId;

  try {
    const requests = await pool.query(
      "SELECT * FROM requests WHERE doctor_id = $1",
      [doctorId]
    );
    res.status(200).json(requests.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
  
};

module.exports = {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  getRequestsByPatientId,
  getRequestsByDoctorId,
};
