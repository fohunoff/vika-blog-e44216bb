
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('diary_moods')
export class DiaryMood {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;
}
