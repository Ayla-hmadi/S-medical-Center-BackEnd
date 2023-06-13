const pool = require("../config/db");

const getChat = async (req, res) => {
    const userId = req.params.userId;
    const doctorId = req.params.doctorId;

    const query = `
        SELECT * FROM messages
        WHERE (fromID = $1 AND toID = $2) OR (fromID = $2 AND toID = $1)
        ORDER BY date ASC
    `;

    try {
        const result = await pool.query(query, [userId, doctorId]);
        res.status(200).json(result.rows);
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
}

const createChat = async (req, res) => {
    const { fromID, toID,date, message } = req.body;

    const query = `
        INSERT INTO messages (fromID, toID, date, message)
        VALUES ($1, $2, $3, $4)
    `;

    try {
        await pool.query(query, [fromID, toID,date, message]);
        res.status(201).json({ message: 'Chat created' });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { getChat, createChat };
