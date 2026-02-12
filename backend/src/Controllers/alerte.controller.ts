import {
  Controller,
  Get,
  Put,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AlerteService } from '../Services/alerte.service';

/**
 * Controller pour la gestion des alertes de stock
 */
@Controller('api/alertes')
export class AlerteController {
  constructor(private readonly alerteService: AlerteService) {}

  /**
   * Récupérer toutes les alertes actives
   */
  @Get('active')
  async findActiveAlerts() {
    return await this.alerteService.findActiveAlerts();
  }

  /**
   * Récupérer toutes les alertes
   */
  @Get()
  async findAll() {
    return await this.alerteService.findAll();
  }

  /**
   * Récupérer le nombre d'alertes actives
   */
  @Get('count')
  async getActiveAlertsCount() {
    const count = await this.alerteService.getActiveAlertsCount();
    return { count };
  }

  /**
   * Récupérer une alerte par son ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.alerteService.findOne(id);
  }

  /**
   * Résoudre une alerte
   */
  @Put(':id/resolve')
  @HttpCode(HttpStatus.OK)
  async resolve(@Param('id') id: string) {
    return await this.alerteService.resolve(id);
  }
}
