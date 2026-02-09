import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { Category } from './Entities/category.entity';
import { Product } from './Entities/product.entity';
import { User } from './Entities/user.entity';
import { MovementStock } from './Entities/movementstock.entity';
import { AlerteStock } from './Entities/alertestock.entity';

// Charger les variables d'environnement
dotenv.config();

/**
 * Script de seed pour initialiser la base de données avec des données de test
 */
async function seed() {
  // Configuration de la connexion
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'geststock_db',
    entities: [Category, Product, User, MovementStock, AlerteStock],
    synchronize: false, // Ne pas recréer les tables
  });

  try {
    await dataSource.initialize();
    console.log('✅ Connexion à la base de données établie');

    // Créer des utilisateurs
    const userRepository = dataSource.getRepository(User);
    
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = userRepository.create({
      nom: 'Administrateur',
      email: 'admin@geststock.com',
      mot_de_passe: adminPassword,
      role: 'admin',
    });
    await userRepository.save(admin);
    console.log('✅ Utilisateur admin créé');

    const gestionnairePassword = await bcrypt.hash('gestionnaire123', 10);
    const gestionnaire = userRepository.create({
      nom: 'Gestionnaire Stock',
      email: 'gestionnaire@geststock.com',
      mot_de_passe: gestionnairePassword,
      role: 'gestionnaire',
    });
    await userRepository.save(gestionnaire);
    console.log('✅ Utilisateur gestionnaire créé');

    // Créer des catégories
    const categoryRepository = dataSource.getRepository(Category);
    
    const categories = [
      { nom: 'Électronique', description: 'Appareils et composants électroniques' },
      { nom: 'Alimentaire', description: 'Produits alimentaires et boissons' },
      { nom: 'Vêtements', description: 'Vêtements et accessoires' },
      { nom: 'Mobilier', description: 'Meubles et équipements' },
      { nom: 'Papeterie', description: 'Fournitures de bureau' },
    ];

    const savedCategories: Category[] = [];
    for (const cat of categories) {
      const category = categoryRepository.create(cat);
      const saved = await categoryRepository.save(category);
      savedCategories.push(saved);
    }
    console.log('✅ Catégories créées');

    // Créer des produits
    const productRepository = dataSource.getRepository(Product);
    
    const products = [
      {
        nom: 'Ordinateur portable HP',
        description: 'Ordinateur portable 15 pouces, 8GB RAM',
        stock_actuel: 15,
        stock_min: 5,
        prix_unitaire: 599.99,
        categorie: savedCategories[0],
      },
      {
        nom: 'Souris sans fil',
        description: 'Souris ergonomique sans fil',
        stock_actuel: 3,
        stock_min: 10,
        prix_unitaire: 19.99,
        categorie: savedCategories[0],
      },
      {
        nom: 'Café en grains 1kg',
        description: 'Café arabica premium',
        stock_actuel: 50,
        stock_min: 20,
        prix_unitaire: 12.50,
        categorie: savedCategories[1],
      },
      {
        nom: 'Eau minérale 1.5L',
        description: 'Pack de 6 bouteilles',
        stock_actuel: 8,
        stock_min: 15,
        prix_unitaire: 3.99,
        categorie: savedCategories[1],
      },
      {
        nom: 'T-shirt coton',
        description: 'T-shirt 100% coton, taille M',
        stock_actuel: 25,
        stock_min: 10,
        prix_unitaire: 15.00,
        categorie: savedCategories[2],
      },
      {
        nom: 'Jean slim',
        description: 'Jean slim fit, taille 32',
        stock_actuel: 0,
        stock_min: 5,
        prix_unitaire: 45.00,
        categorie: savedCategories[2],
      },
      {
        nom: 'Chaise de bureau',
        description: 'Chaise ergonomique avec accoudoirs',
        stock_actuel: 12,
        stock_min: 5,
        prix_unitaire: 89.99,
        categorie: savedCategories[3],
      },
      {
        nom: 'Stylo à bille',
        description: 'Boîte de 50 stylos bleus',
        stock_actuel: 100,
        stock_min: 30,
        prix_unitaire: 8.50,
        categorie: savedCategories[4],
      },
      {
        nom: 'Ramette papier A4',
        description: '500 feuilles blanches',
        stock_actuel: 5,
        stock_min: 10,
        prix_unitaire: 4.99,
        categorie: savedCategories[4],
      },
    ];

    for (const prod of products) {
      const product = productRepository.create(prod);
      await productRepository.save(product);
    }
    console.log('✅ Produits créés');

    console.log('\n🎉 Seed terminé avec succès!');
    console.log('\n📝 Credentials de test:');
    console.log('   Admin: admin@geststock.com / admin123');
    console.log('   Gestionnaire: gestionnaire@geststock.com / gestionnaire123');

    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
}

seed();
