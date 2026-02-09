import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../Entities/product.entity';
import { Category } from '../Entities/category.entity';
import { AlerteStock } from '../Entities/alertestock.entity';
import { CreateProductDto } from '../Dto/create-product.dto';
import { UpdateProductDto } from '../Dto/update-product.dto';

/**
 * Service pour la gestion des produits
 */
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(AlerteStock)
    private alerteRepository: Repository<AlerteStock>,
  ) {}

  /**
   * Créer un nouveau produit
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Vérifier que la catégorie existe
    const category = await this.categoryRepository.findOne({
      where: { id_categorie: createProductDto.id_categorie },
    });

    if (!category) {
      throw new NotFoundException('Catégorie non trouvée');
    }

    const product = this.productRepository.create({
      ...createProductDto,
      categorie: category,
    });

    const savedProduct = await this.productRepository.save(product);

    // Vérifier si une alerte doit être créée
    await this.checkAndCreateAlert(savedProduct);

    return savedProduct;
  }

  /**
   * Récupérer tous les produits avec filtres optionnels
   */
  async findAll(categoryId?: string): Promise<Product[]> {
    const query = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.categorie', 'categorie')
      .orderBy('product.nom', 'ASC');

    if (categoryId) {
      query.where('product.id_categorie = :categoryId', { categoryId });
    }

    return await query.getMany();
  }

  /**
   * Récupérer un produit par son ID
   */
  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id_produit: id },
      relations: ['categorie', 'mouvements', 'alertes'],
    });

    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    return product;
  }

  /**
   * Récupérer les produits en stock bas
   */
  async findLowStock(): Promise<Product[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categorie', 'categorie')
      .where('product.stock_actuel <= product.stock_min')
      .orderBy('product.stock_actuel', 'ASC')
      .getMany();
  }

  /**
   * Mettre à jour un produit
   */
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    // Si la catégorie est modifiée, vérifier qu'elle existe
    if (updateProductDto.id_categorie) {
      const category = await this.categoryRepository.findOne({
        where: { id_categorie: updateProductDto.id_categorie },
      });

      if (!category) {
        throw new NotFoundException('Catégorie non trouvée');
      }

      product.categorie = category;
    }

    Object.assign(product, updateProductDto);
    const updatedProduct = await this.productRepository.save(product);

    // Vérifier si une alerte doit être créée ou résolue
    await this.checkAndCreateAlert(updatedProduct);

    return updatedProduct;
  }

  /**
   * Supprimer un produit
   */
  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  /**
   * Vérifier et créer une alerte si le stock est bas
   */
  private async checkAndCreateAlert(product: Product): Promise<void> {
    // Vérifier s'il y a déjà une alerte active pour ce produit
    const existingAlert = await this.alerteRepository.findOne({
      where: {
        produit: { id_produit: product.id_produit },
        statut: 'active',
      },
    });

    // Si le stock est bas et qu'il n'y a pas d'alerte active, créer une alerte
    if (product.stock_actuel <= product.stock_min && !existingAlert) {
      const alert = this.alerteRepository.create({
        produit: product,
        statut: 'active',
      });
      await this.alerteRepository.save(alert);
    }

    // Si le stock est suffisant et qu'il y a une alerte active, la résoudre
    if (product.stock_actuel > product.stock_min && existingAlert) {
      existingAlert.statut = 'resolue';
      await this.alerteRepository.save(existingAlert);
    }
  }
}
