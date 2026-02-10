import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MovementService } from '../Services/movement.service';
import { CreateMovementDto } from '../Dto/create-movement.dto';

/**
 * Controller pour la gestion des mouvements de stock
 */
@Controller('api/movements')
export class MovementController {
  constructor(private readonly movementService: MovementService) {}

  /**
   * Créer un nouveau mouvement de stock
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMovementDto: CreateMovementDto) {
    return await this.movementService.create(createMovementDto);
  }

  /**
   * Récupérer tous les mouvements (avec filtres optionnels)
   */
  @Get()
  async findAll(
    @Query('productId') productId?: string,
    @Query('type') type?: string,
  ) {
    return await this.movementService.findAll(productId, type);
  }

  /**
   * Récupérer les statistiques des mouvements
   */
  @Get('stats')
  async getStats() {
    return await this.movementService.getStats();
  }

  /**
   * Récupérer un mouvement par son ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.movementService.findOne(id);
  }

  /**
   * Récupérer les mouvements d'un produit spécifique
   */
  @Get('product/:productId')
  async findByProduct(@Param('productId') productId: string) {
    return await this.movementService.findByProduct(productId);
  }
}
