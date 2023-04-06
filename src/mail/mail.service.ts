import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../entities';
import { Form, FormType } from 'src/types';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `localhost:3000/auth/verifyemail?email=${user.email}&verificationToken=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Your Account has been created! Confirm your Email',
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
  ) {
    const url = `localhost:3000/forms/${formType}/${form.id}`;

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
