
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { DiaryTag } from './diary-tag.entity';
import { DiaryMood } from './diary-mood.entity';

@Entity('diary_entries')
export class DiaryEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToMany(() => DiaryMood)
  @JoinTable({
    name: 'diary_entries_moods',
    joinColumn: { name: 'entry_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'mood_id', referencedColumnName: 'id' }
  })
  mood: DiaryMood;

  @ManyToMany(() => DiaryTag)
  @JoinTable({
    name: 'diary_entries_tags',
    joinColumn: { name: 'entry_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' }
  })
  tags: DiaryTag[];

  @Column({ nullable: true })
  imageSrc?: string;
}
