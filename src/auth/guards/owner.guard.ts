import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Form, FormType } from '../../types/form.entity';
import { FormsService } from '../../forms/forms.service';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { FormRelationDto } from '../../forms/dto';

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

    // get query params
    const { query } = request;
    let formRelationDto: FormRelationDto = {};

    if (query) {
      // transform query params using class-transformer with class
      formRelationDto = plainToInstance(FormRelationDto, query);

      // validate query params with class-validator
      const errors = await validate(formRelationDto, {
        validationError: { target: false, value: false },
      });
      console.log(errors);
      if (errors.length > 0) {
        throw new BadRequestException(
          errors.map((e) => Object.values(e.constraints).toString()),
        );
      }
    }

    if (requiredForm === FormType.ADVANCE) {
      form = await this.formsService.findOneAdvanceForm(formId, {
        ...formRelationDto,
      });
    } else if (requiredForm === FormType.RETIREMENT) {
      form = await this.formsService.findOneRetirementForm(formId, {
        ...formRelationDto,
      });
    }

    if (!(Number(request.user.id) === form.userId)) return false;

    // const form = this.formsService
    request.form = form;
    return true;
  }
}
