import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import nodemailer from "nodemailer";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import "./db/sequelize.js";
const app = express();

// const { UKR_NET_EMAIL, UKR_NET_PASSWORD } = process.env;

// const nodemailerCnfig = nodemailer.createTransport({
//   host: "smtp.ukr_net",
//   port: 465,
//   secure: false,
//   auth: {
//     user: UKR_NET_EMAIL,
//     pass: UKR_NET_PASSWORD,
//   },
// });

// const transport = nodemailer.createTransport(nodemailerCnfig)

// const email = {
//   from: UKR_NET_EMAIL,
//   to: "alchynskairyna@gmail.com",
//   subject: 'Email Verification',
//   text: `Please verify your email by clicking on the following link: `,
//   html: `<p>Please verify your email by clicking on the following link:</p> `,
// }
// transport.sendMail(email)
//   .then(msg => console.log("Email sent successfully:", msg))
//   .catch(err => console.error("Error sending email:", err));

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
