import { IsString, IsOptional, IsNumber, IsUUID, Min, MaxLength } from 'class-validator';

/**
 * DTO pour la mise à jour d'un produit
 */
export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @MaxLength(200, { message: 'Le nom ne peut pas dépasser 200 caractères' })
  nom?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Le stock actuel ne peut pas être négatif' })
  stock_actuel?: number;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Le stock minimum ne peut pas être négatif' })
  stock_min?: number;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Le prix unitaire ne peut pas être négatif' })
  prix_unitaire?: number;

  @IsUUID('4', { message: 'ID de catégorie invalide' })
  @IsOptional()
  id_categorie?: string;
}
