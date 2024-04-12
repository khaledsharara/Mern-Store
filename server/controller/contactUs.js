const nodemailer = require("nodemailer");
const express = require("express");
const bodyParser = require("body-parser");

class ContactUs {
  constructor() {
    this.app = express();

    this.app.use(bodyParser.json());

    // Define Nodemailer transporter
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Bind the handleSendEmail method to the current instance
    this.handleSendEmail = this.handleSendEmail.bind(this);

    // API endpoint to handle email sending
    this.app.post("/send-email", this.handleSendEmail);
  }

  handleSendEmail(req, res) {
    const { name, email, message } = req.body;

    const htmlFile = `
      <div style="width: 100%; background-color: #f2f2f2; padding: 50px 0;">
        <div style="width: 80%; margin: auto; background-color: #fff; padding: 50px 0;">
          <div style="width: 80%; margin: auto;">
            <div style="text-align: center;">
              <h2 style="color: #ff4d4d;">New Contact Form Submission</h2>
              <p style="color: #000;">A new contact form has been submitted. Details are below:</p>
            </div>
            <div style="margin-top: 50px;">
              <table style="width: 100%;">
                <thead>
                  <tr>
                    <th style="text-align: left;">Name</th>
                    <th style="text-align: left;">Email</th>
                    <th style="text-align: left;">Message</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${name}</td>
                    <td>${email}</td>
                    <td>${message}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>`;

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: process.env.AUTH_EMAIL,
      subject: "New Contact Form Submission",
      html: htmlFile,
    };

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      res.status(200).send("Email sent: " + info.response);
    });
  }
}

const contactUsController = new ContactUs();
module.exports = contactUsController;
