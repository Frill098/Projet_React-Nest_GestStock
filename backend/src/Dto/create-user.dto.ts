import { IsString, IsNotEmpty, IsEmail, MinLength, MaxLength, IsIn, IsOptional } from 'class-validator';

/**
 * DTO pour la création d'un utilisateur
 */
export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  @MaxLength(100, { message: 'Le nom ne peut pas dépasser 100 caractères' })
  nom: string;

  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: "L'email est obligatoire" })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  mot_de_passe: string;

  @IsString()
  @IsOptional()
  @IsIn(['admin', 'gestionnaire'], { message: 'Le rôle doit être admin ou gestionnaire' })
  role?: string;
}
