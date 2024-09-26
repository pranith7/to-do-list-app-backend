import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from 'path';

dotenv.config({
    path: path.resolve(__dirname, '../../.env')
});

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use TLS
    auth: {
      user: process.env.APPLICATION_USER_FOR_NODEMAILER,
      pass: process.env.APPLICATION_PASSWORD_FOR_NODEMAILER,
    },
  });

export default transporter;
