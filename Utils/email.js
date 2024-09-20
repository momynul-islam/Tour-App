const nodemailer = require("nodemailer");
const mailjet = require("node-mailjet");
const pug = require("pug");
const { convert } = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Tour App <no-reply@islammomynul.cod@gmail.com}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // Mailjet // my sendgrid account not working
      return nodemailer.createTransport({
        host: process.env.MAILJET_HOST,
        port: process.env.MAILJET_PORT, // Use 587 for TLS
        secure: false, // Set to true if you're using port 465
        auth: {
          user: process.env.MAILJET_API_KEY,
          pass: process.env.MAILJET_SECRET_KEY,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the Tour-App Family!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
};
