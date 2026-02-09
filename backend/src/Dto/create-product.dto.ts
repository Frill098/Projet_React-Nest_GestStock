import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID, Min, MaxLength } from 'class-validator';

/**
 * DTO pour la création d'un produit
 */
export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  @MaxLength(200, { message: 'Le nom ne peut pas dépasser 200 caractères' })
  nom: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0, { message: 'Le stock actuel ne peut pas être négatif' })
  stock_actuel: number;

  @IsNumber()
  @Min(0, { message: 'Le stock minimum ne peut pas être négatif' })
  stock_min: number;

  @IsNumber()
  @Min(0, { message: 'Le prix unitaire ne peut pas être négatif' })
  prix_unitaire: number;

  @IsUUID('4', { message: 'ID de catégorie invalide' })
  @IsNotEmpty({ message: 'La catégorie est obligatoire' })
  id_categorie: string;
}
