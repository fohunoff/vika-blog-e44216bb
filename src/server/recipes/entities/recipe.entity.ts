
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from './category.entity';
import { Tag } from './tag.entity';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('text', { nullable: true })
  content: string;

  @Column({ nullable: true })
  time: string;

  @Column({ 
    type: 'enum',
    enum: ['Легко', 'Средне', 'Сложно'],
    default: 'Средне'
  })
  difficulty: 'Легко' | 'Средне' | 'Сложно';

  @Column()
  imageSrc: string;

  @Column({ nullable: true })
  servings: number;

  @ManyToOne(() => Category, category => category.recipes)
  category: Category;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
