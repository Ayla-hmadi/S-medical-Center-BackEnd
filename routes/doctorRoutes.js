const express = require("express");
const router = express.Router();

const { getDoctors ,getDoctorById } = require("../controllers/doctorController");

router.route("/").get(getDoctors);

router.route("/:id").get(getDoctorById);

module.exports = router;
