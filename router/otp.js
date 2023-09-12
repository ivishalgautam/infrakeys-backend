const router = require("express").Router();
const { default: axios } = require("axios");
const { generateRandomOTP } = require("../utils/otp");
const { pool } = require("../config/db");

router.post("/send-otp", async (req, res) => {
  const { phone, name } = req.body;
  const otp = generateRandomOTP();
  console.log(req.body);
  try {
    await pool.query(`INSERT INTO user_otps (phone, otp) VALUES ($1, $2);`, [
      phone,
      otp,
    ]);
    res.cookie("otp", otp, { maxAge: 300000 });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.interakt.ai/v1/public/message/",
      headers: {
        Authorization: `Basic ${process.env.INTERACT_API_KEY}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        countryCode: "+91",
        phoneNumber: phone,
        callbackData: "Otp sent successfully.",
        type: "Template",
        template: {
          name: "send_otp",
          languageCode: "en",
          bodyValues: [name, "OTP", otp],
        },
      }),
    };

    axios(config)
      .then(function (response) {
        res.json(response.data);
      })
      .catch((error) => {
        res.status(400).json(error);
        console.log(error);
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { userId, otp } = req.body;
  let phoneVerified = false;
  try {
    const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      userId,
    ]);
    if (user.rowCount === 0)
      return res.status(404).json({ message: "User not exist!" });

    const userOtp = await pool.query(
      `SELECT otp from user_otps WHERE phone = $1 ORDER BY created_at DESC LIMIT 1`,
      [user.rows[0].phone]
    );

    if (userOtp.rows[0].otp === otp) {
      phoneVerified = true;
      await pool.query(`UPDATE users SET verified = $1 WHERE id = $2`, [
        true,
        userId,
      ]);
      return res.json({ message: "OTP verified successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status.json({ message: error.message });
  }
});

module.exports = router;
