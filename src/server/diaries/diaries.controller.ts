
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { DiariesService } from './diaries.service';
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto';
import { CreateDiaryMoodDto } from './dto/create-diary-mood.dto';
import { CreateDiaryTagDto } from './dto/create-diary-tag.dto';

@Controller('diaries')
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  @Get()
  async findAll(@Query('search') search?: string, @Query('mood') mood?: string) {
    return this.diariesService.findAll(search, mood);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.diariesService.findOne(id);
  }

  @Post()
  async create(@Body() createDiaryEntryDto: CreateDiaryEntryDto) {
    return this.diariesService.create(createDiaryEntryDto);
  }

  @Get('moods')
  async findAllMoods() {
    return this.diariesService.findAllMoods();
  }

  @Post('moods')
  async createMood(@Body() createDiaryMoodDto: CreateDiaryMoodDto) {
    return this.diariesService.createMood(createDiaryMoodDto);
  }

  @Get('tags')
  async findAllTags() {
    return this.diariesService.findAllTags();
  }

  @Post('tags')
  async createTag(@Body() createDiaryTagDto: CreateDiaryTagDto) {
    return this.diariesService.createTag(createDiaryTagDto);
  }
}
