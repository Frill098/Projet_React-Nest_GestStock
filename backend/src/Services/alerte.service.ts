import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlerteStock } from '../Entities/alertestock.entity';

/**
 * Service pour la gestion des alertes de stock
 */
@Injectable()
export class AlerteService {
  constructor(
    @InjectRepository(AlerteStock)
    private alerteRepository: Repository<AlerteStock>,
  ) {}

  /**
   * Récupérer toutes les alertes actives
   */
  async findActiveAlerts(): Promise<AlerteStock[]> {
    return await this.alerteRepository.find({
      where: { statut: 'active' },
      relations: ['produit', 'produit.categorie'],
      order: { date_alerte: 'DESC' },
    });
  }

  /**
   * Récupérer toutes les alertes (actives et résolues)
   */
  async findAll(): Promise<AlerteStock[]> {
    return await this.alerteRepository.find({
      relations: ['produit', 'produit.categorie'],
      order: { date_alerte: 'DESC' },
    });
  }

  /**
   * Récupérer une alerte par son ID
   */
  async findOne(id: string): Promise<AlerteStock> {
    const alerte = await this.alerteRepository.findOne({
      where: { id_alerte: id },
      relations: ['produit', 'produit.categorie'],
    });

    if (!alerte) {
      throw new NotFoundException('Alerte non trouvée');
    }

    return alerte;
  }

  /**
   * Résoudre une alerte manuellement
   */
  async resolve(id: string): Promise<AlerteStock> {
    const alerte = await this.findOne(id);
    alerte.statut = 'resolue';
    return await this.alerteRepository.save(alerte);
  }

  /**
   * Obtenir le nombre d'alertes actives
   */
  async getActiveAlertsCount(): Promise<number> {
    return await this.alerteRepository.count({
      where: { statut: 'active' },
    });
  }
}
