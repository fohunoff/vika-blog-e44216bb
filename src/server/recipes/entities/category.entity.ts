
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  displayName: string;

  @OneToMany(() => Recipe, recipe => recipe.category)
  recipes: Recipe[];
}
