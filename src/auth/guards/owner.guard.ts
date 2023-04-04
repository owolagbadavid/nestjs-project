import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Form, FormType } from '../../types/form.entity';
import { FormsService } from '../../forms/forms.service';

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

    let formId: number;
    try {
      formId = parseInt(request.params.id);
      if (formId % 1 !== 0) throw new Error();
      request.params.id = formId;
    } catch (error) {
      throw new BadRequestException(
        'Validation failed (numeric string is expected)',
      );
    }

    const { user } = request;
    if (!user) return false;

    if (requiredForm === FormType.ADVANCE) {
      form = await this.formsService.findOneAdvanceForm(formId, {});
    } else if (requiredForm === FormType.RETIREMENT) {
      form = await this.formsService.findOneRetirementForm(formId, {});
    }

    if (!(Number(request.user.id) === form.userId)) return false;

    // const form = this.formsService
    request.form = form;
    return true;
  }
}
