import { SetMetadata } from '@nestjs/common';
import { FormType } from 'src/types/form.entity';

export const Forms = (form: FormType) => SetMetadata('form', form);
