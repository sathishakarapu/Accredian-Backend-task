const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const ReferralModel = require("./db");
const nodemailer = require("nodemailer");

dotenv.config();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/referral", async (req, res) => {
  const { email, name, course } = req.body;

  if (!email || !name || !course) {
    return res.status(400).json({
      message: "All Fields Are Required",
    });
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    return res.status(401).json({
      message: "Invalid email Id",
    });
  }

  const referedUser = new ReferralModel({ email, name, course });
  await referedUser.save();

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Referral Submission Confirmation",
      html: `
        <h3>Dear ${name},</h3>
        <p>Thank you for referring ${course}. We have received your submission with the following details:</p>
        <ul>
          <li>Email: ${email}</li>
          <li>Name: ${name}</li>
          <li>Course: ${course}</li>
        </ul>
        <p>We will get back to you shortly.</p>
      `,
    });

    res.status(201).json({
      message: "Referred Successfully",
      referedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Error",
      error: error.message,
    });
  }
});

mongoose
  .connect(
    "mongodb+srv://sathish:Swathi%40123@cluster0.fygopsn.mongodb.net/referral?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected To MongoDB");
  })
  .catch((err) => {
    console.log(err, "Failed To connect to MongoDB");
  });

app.listen(process.env.PORT, () =>
  console.log(`Server Started At ${process.env.PORT}`)
);
