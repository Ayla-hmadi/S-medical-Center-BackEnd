const pool = require("../config/db");

const createAppointment = async (req, res) => {
  const { patient_id, doctor_id, appointment_date, appointment_time } =
    req.body;

  try {
    const insertAppointmentQuery =
      "INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time) VALUES ($1, $2, $3, $4) RETURNING *";
    const newAppointment = await pool.query(insertAppointmentQuery, [
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
    ]);
    res.status(201).json(newAppointment.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating appointment" });
  }
  
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await pool.query("SELECT * FROM appointments");
    res.status(200).json(appointments.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting appointments" });
  }
  
};

const getAppointmentById = async (req, res) => {
  const id = req.params.id;

  try {
    const appointment = await pool.query(
      "SELECT * FROM appointments WHERE id = $1",
      [id]
    );
    if (appointment.rowCount === 0) {
      res.status(404).json({ message: `Appointment with ID ${id} not found` });
    } else {
      res.status(200).json(appointment.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting appointment" });
  }
  
};

const updateAppointment = async (req, res) => {
  const id = req.params.id;
  const { patient_id, doctor_id, appointment_date, appointment_time } =
    req.body;

  try {
    const updateAppointmentQuery =
      "UPDATE appointments SET patient_id = $1, doctor_id = $2, appointment_date = $3, appointment_time = $4 WHERE id = $5 RETURNING *";
    const updatedAppointment = await pool.query(updateAppointmentQuery, [
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      id,
    ]);
    if (updatedAppointment.rowCount === 0) {
      res.status(404).json({ message: `Appointment with ID ${id} not found` });
    } else {
      res.status(200).json(updatedAppointment.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: `Error updating appointment with ID ${id}` });
  }
  
};

const deleteAppointment = async (req, res) => {
  const appointmentId = req.params.id;

  try {
    await pool.query("BEGIN");

    // Delete the appointment from the appointments table
    const deleteAppointmentQuery = "DELETE FROM appointments WHERE id = $1";
    await pool.query(deleteAppointmentQuery, [appointmentId]);

    await pool.query("COMMIT");

    res.status(200).send(`Appointment with ID ${appointmentId} deleted`);
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    res.status(500).send(`Error deleting appointment with ID ${appointmentId}`);
  }
  
};

const getAppointmentsByPatientId = async (req, res) => {
  const patientId = req.params.patientId;

  try {
    const appointments = await pool.query(
      "SELECT * FROM appointments WHERE patient_id = $1",
      [patientId]
    );
    res.status(200).json(appointments.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
 
};

const getAppointmentsByDoctorId = async (req, res) => {
  const doctorId = req.params.doctorId;

  try {
    const appointments = await pool.query(
      "SELECT * FROM appointments WHERE doctor_id = $1",
      [doctorId]
    );
    res.status(200).json(appointments.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
  
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByPatientId,
  getAppointmentsByDoctorId,
};
