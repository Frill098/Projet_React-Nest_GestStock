import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { MovementStock } from './movementstock.entity';

/**
 * Entité Utilisateur - Représente un utilisateur du système
 * Rôles: 'admin' ou 'gestionnaire'
 */
@Entity('utilisateurs')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id_utilisateur: string;

  @Column({ type: 'varchar', length: 100 })
  nom: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  mot_de_passe: string;

  @Column({ type: 'varchar', length: 20, default: 'gestionnaire' })
  role: string; // 'admin' ou 'gestionnaire'

  // Relation: Un utilisateur peut effectuer plusieurs mouvements
  @OneToMany(() => MovementStock, (movement) => movement.utilisateur)
  mouvements: MovementStock[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
