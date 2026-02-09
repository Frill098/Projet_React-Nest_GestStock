import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from './category.entity';
import { MovementStock } from './movementstock.entity';
import { AlerteStock } from './alertestock.entity';

/**
 * Entité Produit - Représente un produit dans l'inventaire
 */
@Entity('produits')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id_produit: string;

  @Column({ type: 'varchar', length: 200 })
  nom: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  stock_actuel: number;

  @Column({ type: 'int', default: 10 })
  stock_min: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  prix_unitaire: number;

  // Relation: Un produit appartient à une catégorie
  @ManyToOne(() => Category, (category) => category.produits, { eager: true })
  @JoinColumn({ name: 'id_categorie' })
  categorie: Category;

  // Relation: Un produit peut avoir plusieurs mouvements de stock
  @OneToMany(() => MovementStock, (movement) => movement.produit)
  mouvements: MovementStock[];

  // Relation: Un produit peut générer plusieurs alertes
  @OneToMany(() => AlerteStock, (alerte) => alerte.produit)
  alertes: AlerteStock[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
