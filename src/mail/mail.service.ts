import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../entities';
import { Form, FormType } from 'src/types';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string, origin: string) {
    const url = `${origin}/resetPass?email=${user.email}&token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Set new password',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.firstName,
        url,
      },
    });
  }
  async sendSupervisorToken(
    user: User,
    staffName: string,
    form: Form,
    formType: FormType,
    origin: string,
  ) {
    const url = `${origin}/forms/approval/advance/?id=${form.id}&type=${formType}&approval=yes&token=${form.supervisorToken}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Token for Direct Report Form',
      template: './supervisor-token', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.firstName,
        url,
        staffName,
        token: form.supervisorToken,
      },
    });
  }
}
