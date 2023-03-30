import { MaxFileSizeValidator as DefaultMaxFileSizeValidator } from '@nestjs/common';

export class MaxFileSizeValidator extends DefaultMaxFileSizeValidator {
  isValid(fileOrFiles: Express.Multer.File | Express.Multer.File[]): boolean {
    if (Array.isArray(fileOrFiles)) {
      const files = fileOrFiles;
      return files.every((file) => super.isValid(file));
    }

    const file = fileOrFiles;
    return super.isValid(file);
  }
}
