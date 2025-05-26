import { Injectable } from '@nestjs/common';
import { MailerService } from '@modules/mailer/mailer.service';
import * as dayjs from 'dayjs';
import { WelcomeMailDTO } from './dto/create-mailler.dto';
import * as path from 'path';

@Injectable()
export class MaillerService {
  constructor(private readonly mailerService: MailerService) {}

  sendMailWelcome(welcomeMailDto: WelcomeMailDTO): void {
    try {
      void this.mailerService.sendMail({
        to: welcomeMailDto.email,
        subject: `Welcome to BoilerDay, ${welcomeMailDto.username}!`,
        templatePath: path.join(
          process.cwd(),
          'src',
          'modules',
          'mail',
          'templates',
          'welcome.hbs',
        ),
        context: {
          username: welcomeMailDto.username,
          email: welcomeMailDto.email,
          url: 'https://boilerday.ai/start',
          dateTime: dayjs().format('HH:mm - DD/MM/YYYY'),
          year: dayjs().format('YYYY'),
        },
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw error;
    }
  }
}
