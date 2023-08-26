const bcrypt = require("bcrypt");
const { pool } = require("../config/db");
const jwtGenerator = require("../utils/jwtGenerator");

async function register(req, res) {
  const { fullname, email, password, city, state } = req.body;
  try {
    const userExist = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (userExist.rowCount > 0)
      return res
        .status(400)
        .json({ message: "User already exist with this email!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // console.log(hashedPassword);

    const { rows, rowCount } = await pool.query(
      `INSERT INTO users (fullname, email, password, city, state) VALUES($1, $2, $3, $4, $5) returning *`,
      [fullname, email, hashedPassword, city, state]
    );

    const jwtToken = jwtGenerator({
      id: rows[0].id,
      fullname: rows[0].fullname,
      email: rows[0].email,
    });

    res.json({ access_token: jwtToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const { rows, rowCount } = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (rowCount === 0)
      return res.status(404).json({ message: "User not found!" });

    const validPassword = await bcrypt.compare(password, rows[0].password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid credentials!" });

    const jwtToken = jwtGenerator({
      user: {
        id: rows[0].id,
        fullname: rows[0].fullname,
        email: rows[0].email,
        role: rows[0].role,
      },
    });
    // console.log(jwt.verify(jwtToken, process.env.JWT_SEC));
    res.json({ user: rows[0], access_token: jwtToken });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

module.exports = { register, login };
