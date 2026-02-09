import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';

/**
 * Entité Catégorie - Représente une catégorie de produits
 */
@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id_categorie: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  nom: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Relation: Une catégorie peut avoir plusieurs produits
  @OneToMany(() => Product, (product) => product.categorie)
  produits: Product[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
