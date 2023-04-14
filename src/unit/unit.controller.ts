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
  Query,
} from '@nestjs/common';
import { UnitService } from './unit.service';
import { UpdateUnitDto, CreateUnitDto, UnitFilterDto } from './dto';
import { JwtGuard, RolesGuard } from '../auth/guards';
import { ApiRes, Role } from '../types';
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
import { Unit } from '../entities';
import { Roles } from '../decorators';

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
  findAll(@Query() filterDto: UnitFilterDto): Promise<Unit[]> {
    return this.unitService.findAll(filterDto);
  }

  @ApiOkResponse({ type: Unit })
  @ApiBadRequestResponse({ type: ApiRes })
  @ApiNotFoundResponse({ type: ApiRes })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Unit> {
    return this.unitService.findOne(+id);
  }

  @ApiOkResponse({ type: Unit })
  @ApiBadRequestResponse({ type: ApiRes })
  @ApiNotFoundResponse({ type: ApiRes })
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUnitDto: UpdateUnitDto,
  ): Promise<Unit> {
    return this.unitService.update(+id, updateUnitDto);
  }

  @ApiOkResponse({ type: Unit })
  @ApiBadRequestResponse({ type: ApiRes })
  @ApiNotFoundResponse({ type: ApiRes })
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Unit> {
    return this.unitService.remove(+id);
  }
}
