
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiariesController } from './diaries.controller';
import { DiariesService } from './diaries.service';
import { DiaryEntry } from './entities/diary-entry.entity';
import { DiaryMood } from './entities/diary-mood.entity';
import { DiaryTag } from './entities/diary-tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DiaryEntry, DiaryMood, DiaryTag])],
  controllers: [DiariesController],
  providers: [DiariesService],
  exports: [DiariesService],
})
export class DiariesModule {}
