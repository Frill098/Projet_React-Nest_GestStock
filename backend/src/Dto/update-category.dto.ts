import { IsString, IsOptional, MaxLength } from 'class-validator';

/**
 * DTO pour la mise à jour d'une catégorie
 */
export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Le nom ne peut pas dépasser 100 caractères' })
  nom?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
