import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from '../Dto/login.dto';

/**
 * Service d'authentification simple avec cookies
 */
@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  /**
   * Valider les credentials et retourner l'utilisateur
   */
  async validateUser(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const isPasswordValid = await this.userService.validatePassword(
      loginDto.mot_de_passe,
      user.mot_de_passe,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Retourner l'utilisateur sans le mot de passe
    const { mot_de_passe, ...result } = user;
    return result;
  }

  /**
   * Connexion
   */
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    return {
      message: 'Connexion réussie',
      user,
    };
  }
}
