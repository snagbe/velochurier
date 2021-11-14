import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  nodemailer: any;
  transporter: any;

  /**
   * receives permission for the transport
   * @param host the email web hosting
   * @param port the email port
   */
  public transport(host, port) {
    //this.nodemailer  = require('nodemailer');
    this.transporter = this.nodemailer.createTransport({
      host: host,
      port: port,
      auth: {
        user: 'nagbe.samuel@gmail.com', // Enter here email address from which you want to send emails
        pass: 'Sam1357' // Enter here password for email account from which you want to send emails
      }
    });
  }

  /**
   * sends an email
   * @param from the sender email address
   * @param to the recipient email address
   * @param subject the subject of the email
   * @param html the HTML page of the email
   */
  async sendEmail(from, to, subject, html) {
    await this.transporter.sendMail({
      from: from,
      to: to, //'',
      subject: subject,
      html: html
    });
  }

}
