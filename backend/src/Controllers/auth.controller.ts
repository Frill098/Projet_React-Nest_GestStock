import { Controller, Post, Body, Res, HttpCode, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from '../Services/auth.service';
import { LoginDto } from '../Dto/login.dto';

/**
 * Controller pour l'authentification
 */
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Connexion - Crée un cookie de session
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(loginDto);

    // Créer un cookie de session simple
    response.cookie('user_session', JSON.stringify(result.user), {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 heures
      sameSite: 'strict',
    });

    return result;
  }

  /**
   * Déconnexion - Supprime le cookie de session
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('user_session');
    return { message: 'Déconnexion réussie' };
  }
}
