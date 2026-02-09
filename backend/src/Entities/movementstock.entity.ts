import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';

/**
 * Entité MouvementStock - Représente une entrée ou sortie de stock
 * Type: 'ENTREE' ou 'SORTIE'
 */
@Entity('mouvements_stock')
export class MovementStock {
  @PrimaryGeneratedColumn('uuid')
  id_mouvement: string;

  @Column({ type: 'varchar', length: 10 })
  type: string; // 'ENTREE' ou 'SORTIE'

  @Column({ type: 'int' })
  quantite: number;

  @Column({ type: 'text', nullable: true })
  motif: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_mouvement: Date;

  // Relation: Un mouvement concerne un produit
  @ManyToOne(() => Product, (product) => product.mouvements, { eager: true })
  @JoinColumn({ name: 'id_produit' })
  produit: Product;

  // Relation: Un mouvement est effectué par un utilisateur
  @ManyToOne(() => User, (user) => user.mouvements, { eager: true })
  @JoinColumn({ name: 'id_utilisateur' })
  utilisateur: User;

  @CreateDateColumn()
  created_at: Date;
}
