# Backend - Système de Gestion de Stock

Backend NestJS avec TypeORM et PostgreSQL pour l'application de gestion d'inventaire.

##   Installation

```bash
npm install
```

## 📦 Configuration

1. Assurez-vous que PostgreSQL est installé et en cours d'exécution
2. Créez la base de données:

```bash
psql -U postgres
CREATE DATABASE geststock_db;
\q
```

3. Configurez les variables d'environnement dans `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=geststock_db
PORT=3000
```

## 🌱 Initialisation des données

Pour créer des données de test (utilisateurs, catégories, produits):

```bash
npm run seed
```

**Credentials de test:**
- Admin: `admin@geststock.com` / `admin123`
- Gestionnaire: `gestionnaire@geststock.com` / `gestionnaire123`

## 🏃 Démarrage

### Mode développement
```bash
npm run start:dev
```

### Mode production
```bash
npm run build
npm run start:prod
```

L'API sera accessible sur `http://localhost:3000`

## 📚 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion

### Catégories
- `GET /api/categories` - Liste toutes les catégories
- `GET /api/categories/:id` - Une catégorie
- `POST /api/categories` - Créer une catégorie
- `PUT /api/categories/:id` - Modifier une catégorie
- `DELETE /api/categories/:id` - Supprimer une catégorie

### Produits
- `GET /api/products` - Liste tous les produits
- `GET /api/products?categoryId=xxx` - Filtrer par catégorie
- `GET /api/products/low-stock` - Produits en stock bas
- `GET /api/products/:id` - Un produit
- `POST /api/products` - Créer un produit
- `PUT /api/products/:id` - Modifier un produit
- `DELETE /api/products/:id` - Supprimer un produit

### Mouvements de Stock
- `GET /api/movements` - Liste tous les mouvements
- `GET /api/movements?productId=xxx&type=ENTREE` - Filtrer
- `GET /api/movements/stats` - Statistiques
- `GET /api/movements/:id` - Un mouvement
- `GET /api/movements/product/:productId` - Mouvements d'un produit
- `POST /api/movements` - Créer un mouvement (avec transaction)

### Alertes
- `GET /api/alertes` - Toutes les alertes
- `GET /api/alertes/active` - Alertes actives
- `GET /api/alertes/count` - Nombre d'alertes actives
- `GET /api/alertes/:id` - Une alerte
- `PUT /api/alertes/:id/resolve` - Résoudre une alerte

### Utilisateurs
- `GET /api/users` - Liste tous les utilisateurs
- `GET /api/users/:id` - Un utilisateur
- `POST /api/users` - Créer un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur

## 🏗️ Structure du Projet

```
backend/
├── src/
│   ├── Controllers/     # Controllers API
│   ├── Services/        # Logique métier
│   ├── Entities/        # Entities TypeORM
│   ├── Dto/            # Data Transfer Objects
│   ├── app.module.ts   # Module principal
│   ├── main.ts         # Point d'entrée
│   └── seed.ts         # Script d'initialisation
├── .env                # Variables d'environnement
└── package.json
```

## 🔒 Sécurité

- Mots de passe hashés avec bcrypt
- Validation des données avec class-validator
- Cookies HTTP-only pour les sessions
- Transactions TypeORM pour l'intégrité des données

##   Notes

- `synchronize: true` est activé pour le développement (crée automatiquement les tables)
- En production, désactiver `synchronize` et utiliser des migrations
- Les alertes de stock sont créées/résolues automatiquement lors des mouvements
