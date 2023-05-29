const express = require("express");
const router = express.Router();

const {
    createRequest,
    getRequests,
    getRequestById,
    updateRequest,
    deleteRequest,
    getRequestsByPatientId,
    getRequestsByDoctorId,
  } = require("../controllers/requestsController");

  
  router.route("/").post(createRequest).get(getRequests);

  router.route("/:id").get(getRequestById).put(updateRequest).delete( deleteRequest);

  router.route("/patient/:patientId").get(getRequestsByPatientId);

  router.route("/doctor/:doctorId").get(getRequestsByDoctorId);
  
  
  module.exports = router;
  