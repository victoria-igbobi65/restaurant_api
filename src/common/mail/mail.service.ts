import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as path from 'path';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    context: any,
  ): Promise<void> {
    const emailTemplate = path.join(__dirname, 'templates', `${template}.hbs`);
    await this.mailerService.sendMail({
      to,
      subject,
      template: emailTemplate,
      context,
    });
  }
}
