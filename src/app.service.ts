import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { DataEmail } from './interfaces';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {

  constructor(private readonly mailerService: MailerService, private configService: ConfigService) {}
  port = parseInt(process.env.PORT || "3000", 10);
  getHello(): object {
    return {
      hola: 'mundo',
      port: this.port
    };
  }

  getWorld(): object {
    return {
      hello: 'world',
      port: this.port
    };
  }

  async sendEmail(emailInProgress: DataEmail, sender: boolean) {
    const data = {
      from: this.configService.get<string>('SMTP_USERNAME'),
      to: (sender) ? emailInProgress.email : this.configService.get<string>('SMTP_USERNAME'),
      subject: (sender) ? 'Reply: Gracias por contactar' : emailInProgress.subject,
      template: (sender) ? 'senderEmail' : 'myEmail'
    };
    if (emailInProgress.name === '') emailInProgress.name = 'Nombre no escrito';
    if (emailInProgress.subject === '') emailInProgress.name = 'Asunto no escrito';
    try {
      await this.mailerService.sendMail({
        from: data.from,
        to: data.to,
        subject: data.subject,
        template: data.template,
        context: {
          ...emailInProgress
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

}
