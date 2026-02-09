import { Controller, Get, Post, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from '../Services/user.service';
import { CreateUserDto } from '../Dto/create-user.dto';

/**
 * Controller pour la gestion des utilisateurs
 */
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Créer un nouvel utilisateur
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  /**
   * Récupérer tous les utilisateurs
   */
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  /**
   * Récupérer un utilisateur par son ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  /**
   * Supprimer un utilisateur
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.userService.remove(id);
  }
}
