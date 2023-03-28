import { SetMetadata } from '@nestjs/common';
import { FormType } from 'src/forms/entities/form.entity';

export const Forms = (form: FormType) => SetMetadata('form', form);
