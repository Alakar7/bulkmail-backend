const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors({
  origin: "https://bulkmail-frontend-murex.vercel.app"
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
  if (!emailList || !Array.isArray(emailList)) {
    throw new Error("Invalid or missing emailList");
  }

  const promises = emailList.map((recipient) => {
    const mailOptions = emailTemplate(msg, recipient);
    return transporter.sendMail(mailOptions);
  });

  await Promise.all(promises);
};

app.post("/sendemail", async (req, res) => {
  console.log("Request received");

  try {
    await sendMails(req.body);
    console.log("Emails sent successfully");
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Health check (VERY IMPORTANT)
app.get("/", (req, res) => {
  res.send("Mail server running");
});

// ✅ Use Render PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});
