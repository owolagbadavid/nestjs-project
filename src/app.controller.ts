import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  // Req,
  // UploadedFile,
  // Patch,
  // StreamableFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiExcludeController } from '@nestjs/swagger';
// import { Readable } from 'stream';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('home')
  @Redirect('/redirect', 301)
  getHello() {
    // return this.appService.getHello();
    console.log('mikey rewached here');
    return { url: '/redirect' };
  }

  @Get('redirect')
  redirect() {
    // console.log(file);

    // const stream = Readable.from(file);
    // response.set({
    //   'Content-Disposition': 'attachment; filename="image.png"',
    //   'Content-Type': 'image',
    // });
    // console.log('mike');

    // return new StreamableFile(stream);

    return 'thh.redirected()';
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  fileUpload(@UploadedFiles() files: Express.Multer.File[], @Body() body) {
    console.log('------>', files);
    console.log(body);
    console.log(body.Acom);

    return this.appService.fileUpload();
  }

  @Get('seed')
  create() {
    return this.appService.seed();
  }
}
