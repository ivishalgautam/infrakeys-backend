const bcrypt = require("bcrypt");
const { pool } = require("../config/db");
const jwtGenerator = require("../utils/jwtGenerator");

async function register(req, res) {
  const { fullname, email, phone, password, city, state, otp } = req.body;
  const storedOTP = res.cookies.otp;
  console.log("user otp", otp, "stored otp", storedOTP);
  console.log(storedOTP);
  let phoneVerified = false;
  try {
    const emailExist = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (emailExist.rowCount > 0)
      return res
        .status(400)
        .json({ message: "User already exist with this email!" });

    const phoneExist = await pool.query(
      `SELECT * FROM users WHERE phone = $1`,
      [phone]
    );

    if (phoneExist.rowCount > 0)
      return res
        .status(400)
        .json({ message: "User already exist with this phone!" });

    if (storedOTP === otp) phoneVerified = true;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("phone verified", phoneVerified);

    const { rows, rowCount } = await pool.query(
      `INSERT INTO users (fullname, email, phone, password, city, state, verified) VALUES($1, $2, $3, $4, $5, $6, $7) returning *`,
      [fullname, email, phone, hashedPassword, city, state, phoneVerified]
    );

    const jwtToken = jwtGenerator({
      id: rows[0].id,
      fullname: rows[0].fullname,
      email: rows[0].email,
      phone: rows[0].phone,
    });

    res.json({ user: rows[0], access_token: jwtToken });
  } catch (error) {
    console.error(error);
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
    console.error(error);
    res.status(500).json({ message: error });
  }
}

module.exports = { register, login };
