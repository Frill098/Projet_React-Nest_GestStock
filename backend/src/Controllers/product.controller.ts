import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from '../Services/product.service';
import { CreateProductDto } from '../Dto/create-product.dto';
import { UpdateProductDto } from '../Dto/update-product.dto';

/**
 * Controller pour la gestion des produits
 */
@Controller('api/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Créer un nouveau produit
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  /**
   * Récupérer tous les produits (avec filtre optionnel par catégorie)
   */
  @Get()
  async findAll(@Query('categoryId') categoryId?: string) {
    return await this.productService.findAll(categoryId);
  }

  /**
   * Récupérer les produits en stock bas
   */
  @Get('low-stock')
  async findLowStock() {
    return await this.productService.findLowStock();
  }

  /**
   * Récupérer un produit par son ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(id);
  }

  /**
   * Mettre à jour un produit
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.update(id, updateProductDto);
  }

  /**
   * Supprimer un produit
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.productService.remove(id);
  }
}
