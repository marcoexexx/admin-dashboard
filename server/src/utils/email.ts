import { User } from "@prisma/client";
import { convert } from "html-to-text";
import nodemailer from "nodemailer";
import pug from "pug";
import logging from "../middleware/logging/logging";
import getConfig from "./getConfig";

const smtp = getConfig("smtp");

export default class Email {
  username: string;
  to: string;
  from: string;

  constructor(public user: User, public url: string) {
    this.username = user.name;
    this.to = user.email;
    // this.from = `${getConfig('appName')} ${getConfig('emailFrom')}`
    this.from = smtp.user;
  }

  private newTransport() {
    return nodemailer.createTransport({
      // @ts-ignore
      host: smtp.host,
      service: "gmail",
      port: smtp.port,
      secure: true,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    });
  }

  private async send(template: string, subject: string) {
    // const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
    const html = pug.renderFile(`src/views/${template}.pug`, {
      username: this.username,
      subject,
      url: this.url,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: convert(html),
      html,
    };

    const info = await this.newTransport().sendMail(mailOptions);
    logging.info(nodemailer.getTestMessageUrl(info));
  }

  async sendVerificationCode() {
    await this.send("verificationCode", "Your account verification code");
  }

  async sendPasswordResetToken() {
    await this.send("resetPassword", "Your password reset token (valid for only 10 minutes)");
  }
}
