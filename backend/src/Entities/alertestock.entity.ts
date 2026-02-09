import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Product } from './product.entity';

/**
 * Entité AlerteStock - Représente une alerte de stock bas
 * Statut: 'active' ou 'resolue'
 */
@Entity('alertes_stock')
export class AlerteStock {
  @PrimaryGeneratedColumn('uuid')
  id_alerte: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_alerte: Date;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  statut: string; // 'active' ou 'resolue'

  // Relation: Une alerte concerne un produit
  @ManyToOne(() => Product, (product) => product.alertes, { eager: true })
  @JoinColumn({ name: 'id_produit' })
  produit: Product;

  @CreateDateColumn()
  created_at: Date;
}
