import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  StreamableFile,
  Res,
} from '@nestjs/common';
import { FormsService } from './forms.service';

import {
  CreateAdvanceFormDto,
  CreateRetirementFormDto,
  UpdateAdvanceFormDto,
  UpdateRetirementFormDto,
} from './dto';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorators';
import { User } from 'src/entities';
import { JwtGuard } from 'src/auth/guards';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BodyInterceptor } from 'src/utils/body-interceptor';
import { Readable } from 'stream';

@UseGuards(JwtGuard)
@ApiTags('Forms')
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post('advance')
  createAdvanceForm(
    @Body() createAdvanceFormDto: CreateAdvanceFormDto,
    @GetUser() user: User,
  ) {
    console.log(user);

    return this.formsService.createAdvanceForm(createAdvanceFormDto, user);
  }

  @UseInterceptors(FilesInterceptor('files'), BodyInterceptor)
  @Post('retirement')
  createRetirementForm(
    @Body() createRetirementFormDto: CreateRetirementFormDto,
    @GetUser() user: User,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.formsService.createRetirementForm(
      createRetirementFormDto,
      user,
      files,
    );
  }

  @Get('advance')
  findAllAdvanceForms() {
    return this.formsService.findAllAdvanceForms();
  }

  @Get('retirement')
  findAllRetirementForms() {
    return this.formsService.findAllRetirementForms();
  }

  @Get('advance/:id')
  findOneAdvanceForm(@Param('id') id: string) {
    return this.formsService.findOneAdvanceForm(+id);
  }

  @Get('retirement/:id')
  async findOneRetirementForm(
    // @Res({ passthrough: true }) response,
    @Param('id') id: string,
  ) {
    return this.formsService.findOneRetirementForm(+id);
    // console.log(file);

    // const stream = Readable.from(file);
    // response.set({
    //   'Content-Disposition': 'attachment; filename="image.png"',
    //   'Content-Type': 'image',
    // });
    // console.log('mike');

    // return new StreamableFile(stream);
  }

  @Patch('advance/:id')
  editAdvanceForm(
    @Param('id') id: string,
    @Body() updateAdvanceFormDto: UpdateAdvanceFormDto,
  ) {
    return this.formsService.updateAdvanceForm(+id, updateAdvanceFormDto);
  }

  @Patch('retirement/:id')
  editRetirementForm(
    @Param('id') id: string,
    @Body() updateRetirementFormDto: UpdateRetirementFormDto,
  ) {
    return this.formsService.updateRetirementForm(+id, updateRetirementFormDto);
  }

  @Delete('advance/:id')
  removeAdvanceForm(@Param('id', ParseIntPipe) id: number) {
    return this.formsService.removeAdvanceForm(+id);
  }

  @Delete('retirement/:id')
  removeRetirementForm(@Param('id', ParseIntPipe) id: number) {
    return this.formsService.removeRetirementForm(+id);
  }

  @Post('advance/:id/retire')
  retireAdvanceForm(
    @Param('id', ParseIntPipe) id: number,
    @Body() createRetirementFormDto: CreateRetirementFormDto,
  ) {
    return this.formsService.retireAdvancedForm(id, createRetirementFormDto);
  }
}
