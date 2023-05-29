const express = require("express");
const router = express.Router();

const { getPatients , getPatientById } = require("../controllers/patientController");

router.route("/").get(getPatients);

router.route("/:id").get(getPatientById);


module.exports = router;
