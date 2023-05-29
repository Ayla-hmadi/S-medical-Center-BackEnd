const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByPatientId,
  getAppointmentsByDoctorId,
} = require("../controllers/appointmentsController");

router.route("/").get(getAppointments).post(createAppointment);
router
  .route("/:id")
  .get(getAppointmentById)
  .put(updateAppointment)
  .delete(deleteAppointment);
router.route("/patient/:patientId").get(getAppointmentsByPatientId);
router.route("/doctor/:doctorId").get(getAppointmentsByDoctorId);

module.exports = router;
