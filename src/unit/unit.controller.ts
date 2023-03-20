import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { JwtGuard, RolesGuard } from 'src/auth/guards';
import { ApiRes } from 'src/types/api-response';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role, Unit } from 'src/entities';
import { Roles } from 'src/decorators';

@ApiTags('Unit')
@ApiCookieAuth('cookie')
@ApiUnauthorizedResponse({ type: ApiRes })
@ApiForbiddenResponse({ type: ApiRes })
@UseGuards(JwtGuard)
@Roles(Role.Admin)
@Controller('unit')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @ApiCreatedResponse({ type: Unit })
  @ApiBadRequestResponse({ type: ApiRes })
  @ApiNotFoundResponse({ type: ApiRes })
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createUnitDto: CreateUnitDto): Promise<Unit> {
    return this.unitService.create(createUnitDto);
  }

  @ApiOkResponse({ type: Unit, isArray: true })
  @Get()
  findAll(): Promise<Unit[]> {
    return this.unitService.findAll();
  }

  @ApiOkResponse({ type: Unit })
  @ApiBadRequestResponse({ type: ApiRes })
  @ApiNotFoundResponse({ type: ApiRes })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string): Promise<Unit> {
    return this.unitService.findOne(+id);
  }

  @ApiOkResponse({ type: Unit })
  @ApiBadRequestResponse({ type: ApiRes })
  @ApiNotFoundResponse({ type: ApiRes })
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ): Promise<Unit> {
    return this.unitService.update(+id, updateUnitDto);
  }

  @ApiOkResponse({ type: Unit })
  @ApiBadRequestResponse({ type: ApiRes })
  @ApiNotFoundResponse({ type: ApiRes })
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string): Promise<Unit> {
    return this.unitService.remove(+id);
  }
}
