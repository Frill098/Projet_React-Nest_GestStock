import { IsString, IsNotEmpty, IsNumber, IsUUID, IsIn, Min, IsOptional } from 'class-validator';

/**
 * DTO pour la création d'un mouvement de stock
 */
export class CreateMovementDto {
  @IsString()
  @IsNotEmpty({ message: 'Le type est obligatoire' })
  @IsIn(['ENTREE', 'SORTIE'], { message: 'Le type doit être ENTREE ou SORTIE' })
  type: string;

  @IsNumber()
  @Min(1, { message: 'La quantité doit être supérieure à 0' })
  quantite: number;

  @IsString()
  @IsOptional()
  motif?: string;

  @IsUUID('4', { message: 'ID de produit invalide' })
  @IsNotEmpty({ message: 'Le produit est obligatoire' })
  id_produit: string;

  @IsUUID('4', { message: 'ID utilisateur invalide' })
  @IsNotEmpty({ message: "L'utilisateur est obligatoire" })
  id_utilisateur: string;
}
