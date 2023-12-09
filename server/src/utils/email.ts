import { User } from "@prisma/client"
import nodemailer from 'nodemailer'
import getConfig from "./getConfig"
import pug from "pug"
import { convert } from "html-to-text"
import logging from "../middleware/logging/logging"


const smtp = getConfig("smtp")
console.log({ smtp })

export default class Email {
  username: string
  to: string
  from: string

  constructor(public user: User, public url: string) {
    this.username = user.name
    this.to = user.email
    // this.from = `${getConfig('appName')} ${getConfig('emailFrom')}`
    this.from = smtp.user
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
        pass: smtp.pass
      }
    })
  }

  private async send(template: string, subject: string) {
    // TODO: make html template
    // const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
    //   username: this.username,
    //   subject,
    //   url: this.url,
    // })

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: this.url,
      // text: convert(html),
      // html
    }
    console.log({ mailOptions, smtp })

    const info = await this.newTransport().sendMail(mailOptions)
    logging.info(nodemailer.getTestMessageUrl(info))
  }

  async sendVerificationCode() {
    await this.send("verificationCode", "Your account verification code")
  }

  async sendPasswordResetToken() {
    await this.send("resetPassword", "Your password reset token (valid for only 10 minutes)"
    )
  }
}
