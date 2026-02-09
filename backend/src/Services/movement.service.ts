import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { MovementStock } from '../Entities/movementstock.entity';
import { Product } from '../Entities/product.entity';
import { User } from '../Entities/user.entity';
import { AlerteStock } from '../Entities/alertestock.entity';
import { CreateMovementDto } from '../Dto/create-movement.dto';

/**
 * Service pour la gestion des mouvements de stock
 * Utilise des transactions pour garantir l'intégrité des données
 */
@Injectable()
export class MovementService {
  constructor(
    @InjectRepository(MovementStock)
    private movementRepository: Repository<MovementStock>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(AlerteStock)
    private alerteRepository: Repository<AlerteStock>,
    private dataSource: DataSource,
  ) {}

  /**
   * Créer un mouvement de stock avec transaction
   * Garantit que le stock est mis à jour de manière atomique
   */
  async create(createMovementDto: CreateMovementDto): Promise<MovementStock> {
    // Utilisation d'une transaction pour garantir l'intégrité
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Récupérer le produit
      const product = await queryRunner.manager.findOne(Product, {
        where: { id_produit: createMovementDto.id_produit },
        relations: ['categorie'],
      });

      if (!product) {
        throw new NotFoundException('Produit non trouvé');
      }

      // Récupérer l'utilisateur
      const user = await queryRunner.manager.findOne(User, {
        where: { id_utilisateur: createMovementDto.id_utilisateur },
      });

      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      // Calculer le nouveau stock
      let newStock = product.stock_actuel;
      if (createMovementDto.type === 'ENTREE') {
        newStock += createMovementDto.quantite;
      } else if (createMovementDto.type === 'SORTIE') {
        newStock -= createMovementDto.quantite;
        
        // Vérifier que le stock ne devient pas négatif
        if (newStock < 0) {
          throw new BadRequestException('Stock insuffisant pour cette sortie');
        }
      }

      // Mettre à jour le stock du produit
      product.stock_actuel = newStock;
      await queryRunner.manager.save(Product, product);

      // Créer le mouvement
      const movement = queryRunner.manager.create(MovementStock, {
        type: createMovementDto.type,
        quantite: createMovementDto.quantite,
        motif: createMovementDto.motif,
        produit: product,
        utilisateur: user,
      });

      const savedMovement = await queryRunner.manager.save(MovementStock, movement);

      // Gérer les alertes de stock
      await this.manageStockAlerts(queryRunner, product);

      // Valider la transaction
      await queryRunner.commitTransaction();

      return savedMovement;
    } catch (error) {
      // Annuler la transaction en cas d'erreur
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Libérer le queryRunner
      await queryRunner.release();
    }
  }

  /**
   * Récupérer tous les mouvements avec filtres optionnels
   */
  async findAll(productId?: string, type?: string): Promise<MovementStock[]> {
    const query = this.movementRepository.createQueryBuilder('movement')
      .leftJoinAndSelect('movement.produit', 'produit')
      .leftJoinAndSelect('produit.categorie', 'categorie')
      .leftJoinAndSelect('movement.utilisateur', 'utilisateur')
      .orderBy('movement.date_mouvement', 'DESC');

    if (productId) {
      query.andWhere('movement.id_produit = :productId', { productId });
    }

    if (type) {
      query.andWhere('movement.type = :type', { type });
    }

    return await query.getMany();
  }

  /**
   * Récupérer un mouvement par son ID
   */
  async findOne(id: string): Promise<MovementStock> {
    const movement = await this.movementRepository.findOne({
      where: { id_mouvement: id },
      relations: ['produit', 'produit.categorie', 'utilisateur'],
    });

    if (!movement) {
      throw new NotFoundException('Mouvement non trouvé');
    }

    return movement;
  }

  /**
   * Récupérer les mouvements d'un produit spécifique
   */
  async findByProduct(productId: string): Promise<MovementStock[]> {
    return await this.movementRepository.find({
      where: { produit: { id_produit: productId } },
      relations: ['produit', 'utilisateur'],
      order: { date_mouvement: 'DESC' },
    });
  }

  /**
   * Obtenir des statistiques sur les mouvements
   */
  async getStats() {
    const totalEntrees = await this.movementRepository
      .createQueryBuilder('movement')
      .select('SUM(movement.quantite)', 'total')
      .where('movement.type = :type', { type: 'ENTREE' })
      .getRawOne();

    const totalSorties = await this.movementRepository
      .createQueryBuilder('movement')
      .select('SUM(movement.quantite)', 'total')
      .where('movement.type = :type', { type: 'SORTIE' })
      .getRawOne();

    const recentMovements = await this.movementRepository.find({
      relations: ['produit', 'utilisateur'],
      order: { date_mouvement: 'DESC' },
      take: 10,
    });

    return {
      total_entrees: parseInt(totalEntrees.total) || 0,
      total_sorties: parseInt(totalSorties.total) || 0,
      mouvements_recents: recentMovements,
    };
  }

  /**
   * Gérer les alertes de stock (créer ou résoudre)
   */
  private async manageStockAlerts(queryRunner: any, product: Product): Promise<void> {
    // Vérifier s'il y a déjà une alerte active
    const existingAlert = await queryRunner.manager.findOne(AlerteStock, {
      where: {
        produit: { id_produit: product.id_produit },
        statut: 'active',
      },
    });

    // Si le stock est bas et qu'il n'y a pas d'alerte active, créer une alerte
    if (product.stock_actuel <= product.stock_min && !existingAlert) {
      const alert = queryRunner.manager.create(AlerteStock, {
        produit: product,
        statut: 'active',
      });
      await queryRunner.manager.save(AlerteStock, alert);
    }

    // Si le stock est suffisant et qu'il y a une alerte active, la résoudre
    if (product.stock_actuel > product.stock_min && existingAlert) {
      existingAlert.statut = 'resolue';
      await queryRunner.manager.save(AlerteStock, existingAlert);
    }
  }
}
