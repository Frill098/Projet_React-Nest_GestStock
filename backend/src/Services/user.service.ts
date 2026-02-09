import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../Entities/user.entity';
import { CreateUserDto } from '../Dto/create-user.dto';

/**
 * Service pour la gestion des utilisateurs
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Créer un nouvel utilisateur
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Vérifier si un utilisateur avec cet email existe déjà
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(createUserDto.mot_de_passe, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      mot_de_passe: hashedPassword,
      role: createUserDto.role || 'gestionnaire',
    });

    return await this.userRepository.save(user);
  }

  /**
   * Récupérer tous les utilisateurs
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id_utilisateur', 'nom', 'email', 'role', 'created_at'],
      order: { nom: 'ASC' },
    });
  }

  /**
   * Récupérer un utilisateur par son ID
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id_utilisateur: id },
      select: ['id_utilisateur', 'nom', 'email', 'role', 'created_at'],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  /**
   * Récupérer un utilisateur par son email (pour l'authentification)
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  /**
   * Supprimer un utilisateur
   */
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  /**
   * Vérifier le mot de passe
   */
  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
