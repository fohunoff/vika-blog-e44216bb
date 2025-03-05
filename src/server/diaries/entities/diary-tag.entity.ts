
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('diary_tags')
export class DiaryTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;
}
