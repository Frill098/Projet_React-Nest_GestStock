import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoryService } from '../Services/category.service';
import { CreateCategoryDto } from '../Dto/create-category.dto';
import { UpdateCategoryDto } from '../Dto/update-category.dto';

/**
 * Controller pour la gestion des catégories
 */
@Controller('api/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * Créer une nouvelle catégorie
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  /**
   * Récupérer toutes les catégories
   */
  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }

  /**
   * Récupérer une catégorie par son ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.categoryService.findOne(id);
  }

  /**
   * Mettre à jour une catégorie
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryService.update(id, updateCategoryDto);
  }

  /**
   * Supprimer une catégorie
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.categoryService.remove(id);
  }
}
