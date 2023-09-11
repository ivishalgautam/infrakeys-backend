require("dotenv").config();
const router = require("express").Router();
const { default: axios } = require("axios");
const { generateRandomOTP } = require("../utils/otp");

router.get("/", (req, res) => {
  const { phone, name } = req.body;
  const otp = generateRandomOTP();
  console.log(name, phone);
  try {
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
    axios(config).then(function (response) {
      res.json(response.data);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
