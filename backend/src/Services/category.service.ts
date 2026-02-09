import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../Entities/category.entity';
import { CreateCategoryDto } from '../Dto/create-category.dto';
import { UpdateCategoryDto } from '../Dto/update-category.dto';

/**
 * Service pour la gestion des catégories
 */
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  /**
   * Créer une nouvelle catégorie
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Vérifier si une catégorie avec ce nom existe déjà
    const existingCategory = await this.categoryRepository.findOne({
      where: { nom: createCategoryDto.nom },
    });

    if (existingCategory) {
      throw new ConflictException('Une catégorie avec ce nom existe déjà');
    }

    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  /**
   * Récupérer toutes les catégories
   */
  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      relations: ['produits'],
      order: { nom: 'ASC' },
    });
  }

  /**
   * Récupérer une catégorie par son ID
   */
  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id_categorie: id },
      relations: ['produits'],
    });

    if (!category) {
      throw new NotFoundException('Catégorie non trouvée');
    }

    return category;
  }

  /**
   * Mettre à jour une catégorie
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    // Vérifier si le nouveau nom existe déjà (si le nom est modifié)
    if (updateCategoryDto.nom && updateCategoryDto.nom !== category.nom) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { nom: updateCategoryDto.nom },
      });

      if (existingCategory) {
        throw new ConflictException('Une catégorie avec ce nom existe déjà');
      }
    }

    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  /**
   * Supprimer une catégorie
   */
  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}
