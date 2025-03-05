
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { DiaryEntry } from './entities/diary-entry.entity';
import { DiaryMood } from './entities/diary-mood.entity';
import { DiaryTag } from './entities/diary-tag.entity';
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto';
import { CreateDiaryMoodDto } from './dto/create-diary-mood.dto';
import { CreateDiaryTagDto } from './dto/create-diary-tag.dto';

@Injectable()
export class DiariesService {
  constructor(
    @InjectRepository(DiaryEntry)
    private diaryEntriesRepository: Repository<DiaryEntry>,
    @InjectRepository(DiaryMood)
    private diaryMoodsRepository: Repository<DiaryMood>,
    @InjectRepository(DiaryTag)
    private diaryTagsRepository: Repository<DiaryTag>,
  ) {}

  async findAll(search?: string, moodId?: string): Promise<DiaryEntry[]> {
    const queryBuilder = this.diaryEntriesRepository
      .createQueryBuilder('entry')
      .leftJoinAndSelect('entry.mood', 'mood')
      .leftJoinAndSelect('entry.tags', 'tag');

    if (search) {
      queryBuilder.andWhere('(entry.title LIKE :search OR entry.content LIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (moodId) {
      queryBuilder.andWhere('mood.id = :moodId', { moodId });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<DiaryEntry> {
    const entry = await this.diaryEntriesRepository.findOne({
      where: { id },
      relations: ['mood', 'tags'],
    });

    if (!entry) {
      throw new NotFoundException(`Diary entry with ID ${id} not found`);
    }

    return entry;
  }

  async create(createDiaryEntryDto: CreateDiaryEntryDto): Promise<DiaryEntry> {
    const { moodId, tagIds, ...entryData } = createDiaryEntryDto;

    const mood = await this.diaryMoodsRepository.findOne({
      where: { id: moodId },
    });

    if (!mood) {
      throw new NotFoundException(`Mood with ID ${moodId} not found`);
    }

    const tags = await this.diaryTagsRepository.findByIds(tagIds);

    if (tags.length !== tagIds.length) {
      throw new NotFoundException('Some tags were not found');
    }

    const entry = this.diaryEntriesRepository.create({
      ...entryData,
      mood,
      tags,
    });

    return this.diaryEntriesRepository.save(entry);
  }

  async findAllMoods(): Promise<DiaryMood[]> {
    return this.diaryMoodsRepository.find();
  }

  async createMood(createDiaryMoodDto: CreateDiaryMoodDto): Promise<DiaryMood> {
    const mood = this.diaryMoodsRepository.create(createDiaryMoodDto);
    return this.diaryMoodsRepository.save(mood);
  }

  async findAllTags(): Promise<DiaryTag[]> {
    return this.diaryTagsRepository.find();
  }

  async createTag(createDiaryTagDto: CreateDiaryTagDto): Promise<DiaryTag> {
    const tag = this.diaryTagsRepository.create(createDiaryTagDto);
    return this.diaryTagsRepository.save(tag);
  }
}
