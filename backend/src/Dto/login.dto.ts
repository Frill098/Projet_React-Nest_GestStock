import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO pour la connexion
 */
export class LoginDto {
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: "L'email est obligatoire" })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
  mot_de_passe: string;
}
