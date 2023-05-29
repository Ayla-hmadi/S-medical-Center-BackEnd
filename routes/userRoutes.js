const express = require("express");
const router = express.Router();

const { addUser, getUsers, updateUser, deleteUser,getUserByID ,getUserID} = require("../controllers/userController");

router.route("/").get(getUsers).post(addUser);
router.route("/:id").get(getUserByID);
router.route("/ID/:id").get(getUserID);

router.route("/:username").get(getUsers).put(updateUser).delete(deleteUser);;

module.exports = router;
