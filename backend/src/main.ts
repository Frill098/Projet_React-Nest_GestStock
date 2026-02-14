import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

/**
 * Fonction de démarrage de l'application
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activer la validation globale des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés non définies dans les DTOs
      forbidNonWhitelisted: true, // Rejette les requêtes avec des propriétés non autorisées
      transform: true, // Transforme automatiquement les types
    }),
  );

  // Activer le support des cookies
  app.use(cookieParser());

  // Activer CORS pour le frontend
  app.enableCors({
    origin: 'http://localhost:5173', // URL du frontend React
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`  Application démarrée sur http://localhost:${port}`);
  console.log(`  Base de données: ${process.env.DB_DATABASE}`);
}

bootstrap();
