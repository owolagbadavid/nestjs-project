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
  Put,
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
  async createAdvanceForm(
    @Body() createAdvanceFormDto: CreateAdvanceFormDto,
    @GetUser() user: User,
  ) {
    await this.formsService.createAdvanceForm(createAdvanceFormDto, user);

    return {
      statusCode: 201,
      message: 'Form created successfully',
    };
  }

  @UseInterceptors(FilesInterceptor('files'), BodyInterceptor)
  @Post('retirement')
  async createRetirementForm(
    @Body() createRetirementFormDto: CreateRetirementFormDto,
    @GetUser() user: User,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    await this.formsService.createRetirementForm(
      createRetirementFormDto,
      user,
      files,
    );
    return {
      statusCode: 201,
      message: 'Form created successfully',
    };
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

  @Put('advance/:id')
  async editAdvanceForm(
    @Param('id') id: string,
    @Body() updateAdvanceFormDto: UpdateAdvanceFormDto,
    @GetUser() user: User,
  ) {
    await this.formsService.updateAdvanceForm(+id, updateAdvanceFormDto, user);
    return {
      statusCode: 200,
      message: 'Form updated successfully',
    };
  }

  @UseInterceptors(FilesInterceptor('files'), BodyInterceptor)
  @Put('retirement/:id')
  async editRetirementForm(
    @Param('id') id: string,
    @Body() updateRetirementFormDto: UpdateRetirementFormDto,
    @UploadedFiles() files: Express.Multer.File[],
    @GetUser() user: User,
  ) {
    await this.formsService.updateRetirementForm(
      +id,
      updateRetirementFormDto,
      files,
      user,
    );
    return {
      statusCode: 200,
      message: 'Form updated successfully',
    };
  }

  @Delete('advance/:id')
  removeAdvanceForm(@Param('id', ParseIntPipe) id: number) {
    return this.formsService.removeAdvanceForm(+id);
  }

  @Delete('retirement/:id')
  removeRetirementForm(@Param('id', ParseIntPipe) id: number) {
    return this.formsService.removeRetirementForm(+id);
  }

  @UseInterceptors(FilesInterceptor('files'), BodyInterceptor)
  @Post('advance/:id/retire')
  retireAdvanceForm(
    @Param('id', ParseIntPipe) id: number,
    @Body() createRetirementFormDto: CreateRetirementFormDto,
    @GetUser() user: User,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.formsService.retireAdvancedForm(
      id,
      createRetirementFormDto,
      user,
      files,
    );
  }
}
