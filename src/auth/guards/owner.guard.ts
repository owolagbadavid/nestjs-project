import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Form, FormType } from 'src/entities/form.entity';
import { FormsService } from 'src/forms/forms.service';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    private formsService: FormsService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // @required form type

    const requiredForm = this.reflector.getAllAndOverride<FormType>('form', [
      context.getHandler(),
      context.getClass(),
    ]);

    let form: Form;
    const request = context.switchToHttp().getRequest();

    const { user } = request;
    if (!user) return false;

    if (requiredForm === FormType.ADVANCE) {
      form = await this.formsService.findOneAdvanceForm(request.params.id, {});
    } else if (requiredForm === FormType.RETIREMENT) {
      form = await this.formsService.findOneRetirementForm(
        request.params.id,
        {},
      );
    }

    if (!(Number(request.user.id) === form.userId)) return false;

    // const form = this.formsService
    return true;
  }
}
