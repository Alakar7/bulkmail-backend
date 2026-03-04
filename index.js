const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors({
  origin: "https://bulkmail-frontend-murex.vercel.app/"
}));
app.use(express.json());

// ✅ Use ENV variables (IMPORTANT)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const emailTemplate = (msg, recipient) => ({
  from: process.env.EMAIL,
  to: recipient,
  subject: "You get Text Message from Your App!",
  text: msg,
});

const sendMails = async ({ msg, emailList }) => {
  for (const recipient of emailList) {
    const mailOptions = emailTemplate(msg, recipient);
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${recipient}`);
  }
};

app.post("/sendemail", async (req, res) => {
  try {
     console.log("BODY RECEIVED:", req.body);
    await sendMails(req.body);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// ✅ Health check (VERY IMPORTANT)
app.get("/", (req, res) => {
  res.send("Mail server running");
});

// ✅ Use Render PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
