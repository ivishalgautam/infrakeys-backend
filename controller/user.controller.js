const { pool } = require("../config/db");

async function getUsers(req, res) {
  try {
    const { rows } = await pool.query(`SELECT * FROM users`);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function getUserById(req, res) {
  const userId = parseInt(req.params.userId);
  try {
    const { rows, rowCount } = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [userId]
    );

    if (rowCount === 0)
      return res.status(404).json({ message: "User not found!" });

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function updateUserById(req, res) {
  const userId = parseInt(req.params.userId);

  const { ...data } = req.body;
  const updateColumns = Object.keys(data)
    .map((column, key) => `${column} = $${key + 1}`)
    .join(", ");
  const updateValues = Object.values(data);

  try {
    const { rows, rowCount } = await pool.query(
      `UPDATE users SET ${updateColumns} WHERE id = $${
        updateValues.length + 1
      } returning *`,
      [...updateValues, userId]
    );

    if (rowCount === 0)
      return res.status(404).json({ message: "User not found!" });

    res.json({ message: "Update successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function deleteUserById(req, res) {
  const userId = parseInt(req.params.userId);
  try {
    const { rows, rowCount } = await pool.query(
      `DELETE FROM users WHERE id = $1`,
      [userId]
    );

    if (rowCount === 0)
      return res.status(404).json({ message: "User not found!" });

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getUsers, getUserById, updateUserById, deleteUserById };
