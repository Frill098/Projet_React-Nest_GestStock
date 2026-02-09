import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Entities
import { Category } from './Entities/category.entity';
import { Product } from './Entities/product.entity';
import { User } from './Entities/user.entity';
import { MovementStock } from './Entities/movementstock.entity';
import { AlerteStock } from './Entities/alertestock.entity';

// Services
import { CategoryService } from './Services/category.service';
import { ProductService } from './Services/product.service';
import { UserService } from './Services/user.service';
import { MovementService } from './Services/movement.service';
import { AuthService } from './Services/auth.service';
import { AlerteService } from './Services/alerte.service';

// Controllers
import { CategoryController } from './Controllers/category.controller';
import { ProductController } from './Controllers/product.controller';
import { UserController } from './Controllers/user.controller';
import { MovementController } from './Controllers/movement.controller';
import { AuthController } from './Controllers/auth.controller';
import { AlerteController } from './Controllers/alerte.controller';

/**
 * Module principal de l'application
 * Configure TypeORM, les entities, services et controllers
 */
@Module({
  imports: [
    // Configuration des variables d'environnement
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Configuration de TypeORM avec PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'geststock_db',
      entities: [Category, Product, User, MovementStock, AlerteStock],
      synchronize: true, // À désactiver en production
      logging: true,
    }),
    
    // Enregistrement des repositories
    TypeOrmModule.forFeature([
      Category,
      Product,
      User,
      MovementStock,
      AlerteStock,
    ]),
  ],
  controllers: [
    AppController,
    CategoryController,
    ProductController,
    UserController,
    MovementController,
    AuthController,
    AlerteController,
  ],
  providers: [
    AppService,
    CategoryService,
    ProductService,
    UserService,
    MovementService,
    AuthService,
    AlerteService,
  ],
})
export class AppModule {}
