require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const app = express();
app.use(express.json());
app.use(cors());

// auth auprès de mailersend
const mailersend = new MailerSend({
  apiKey: process.env.API_KEY,
});

const sentFrom = new Sender(process.env.DOMAIN, "Ga Ga");

app.get("/", (req, res) => {
  res.status(200).json("Server is up !");
});

app.post("/form", async (req, res) => {
  try {
    // console.log(req.body);

    const { firstname, lastname, email, subject, message } = req.body;

    const recipient = [new Recipient(email, `${firstname} ${lastname}`)];

    const newEmail = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipient)
      .setReplyTo(sentFrom)
      .setSubject(subject)
      .setHtml(`<p>${message}</p>`)
      .setText(message);

    // on l'envoie
    const result = await mailersend.email.send(newEmail);

    res.json(result);
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(3000, () => {
  console.log("Server is started ! 📧");
});
