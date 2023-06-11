const express = require("express");
const router = express.Router();

const  { getChat, createChat }= require("../controllers/messageController");
router.get('/:userId/:doctorId', getChat);

router.post('/', createChat);

module.exports = router;