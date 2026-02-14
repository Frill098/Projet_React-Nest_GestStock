# Structure du Backend - GestStock

## 📁 Architecture des Dossiers

```
backend/
├── src/
│   ├── Controllers/              # Controllers REST API
│   │   ├── alerte.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── category.controller.ts
│   │   ├── movement.controller.ts
│   │   ├── product.controller.ts
│   │   └── user.controller.ts
│   │
│   ├── Services/                 # Logique métier
│   │   ├── alerte.service.ts
│   │   ├── auth.service.ts
│   │   ├── category.service.ts
│   │   ├── movement.service.ts    # Avec transactions TypeORM
│   │   ├── product.service.ts
│   │   └── user.service.ts
│   │
│   ├── Entities/                 # Entities TypeORM (modèles DB)
│   │   ├── alertestock.entity.ts
│   │   ├── category.entity.ts
│   │   ├── movementstock.entity.ts
│   │   ├── product.entity.ts
│   │   └── user.entity.ts
│   │
│   ├── Dto/                      # Data Transfer Objects (validation)
│   │   ├── create-category.dto.ts
│   │   ├── update-category.dto.ts
│   │   ├── create-product.dto.ts
│   │   ├── update-product.dto.ts
│   │   ├── create-movement.dto.ts
│   │   ├── create-user.dto.ts
│   │   └── login.dto.ts
│   │
│   ├── app.module.ts             # Module principal (configuration)
│   ├── main.ts                   # Point d'entrée
│   └── seed.ts                   # Script d'initialisation DB
│
├── .env                          # Variables d'environnement
├── package.json
├── tsconfig.json
├── README.md                     # Documentation principale
├── API_TESTS.md                  # Tests et exemples d'API
└── STRUCTURE.md                  # Ce fichier

```

## 🗄️ Schéma de Base de Données

### Tables

#### categories
- `id_categorie` (UUID, PK)
- `nom` (VARCHAR, UNIQUE)
- `description` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### produits
- `id_produit` (UUID, PK)
- `nom` (VARCHAR)
- `description` (TEXT)
- `stock_actuel` (INT)
- `stock_min` (INT)
- `prix_unitaire` (DECIMAL)
- `id_categorie` (UUID, FK → categories)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### utilisateurs
- `id_utilisateur` (UUID, PK)
- `nom` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `mot_de_passe` (VARCHAR, hashed)
- `role` (VARCHAR: 'admin' | 'gestionnaire')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### mouvements_stock
- `id_mouvement` (UUID, PK)
- `type` (VARCHAR: 'ENTREE' | 'SORTIE')
- `quantite` (INT)
- `motif` (TEXT)
- `date_mouvement` (TIMESTAMP)
- `id_produit` (UUID, FK → produits)
- `id_utilisateur` (UUID, FK → utilisateurs)
- `created_at` (TIMESTAMP)

#### alertes_stock
- `id_alerte` (UUID, PK)
- `date_alerte` (TIMESTAMP)
- `statut` (VARCHAR: 'active' | 'resolue')
- `id_produit` (UUID, FK → produits)
- `created_at` (TIMESTAMP)

### Relations

```
Category (1) ──────< (N) Product
Product (1) ──────< (N) MovementStock
Product (1) ──────< (N) AlerteStock
User (1) ──────< (N) MovementStock
```

## 🔄 Flux de Données

### Création d'un Mouvement de Stock

1. **Requête HTTP** → `MovementController.create()`
2. **Validation** → `CreateMovementDto` (class-validator)
3. **Service** → `MovementService.create()`
4. **Transaction** → Début de transaction TypeORM
5. **Vérifications**:
   - Produit existe ?
   - Utilisateur existe ?
   - Stock suffisant (si SORTIE) ?
6. **Mise à jour** → Stock du produit
7. **Création** → Enregistrement du mouvement
8. **Gestion alertes** → Création/résolution automatique
9. **Commit** → Validation de la transaction
10. **Réponse** → Retour du mouvement créé

### Gestion Automatique des Alertes

Les alertes sont gérées automatiquement dans 3 cas:

1. **Création de produit**: Si `stock_actuel <= stock_min` → Alerte créée
2. **Mise à jour de produit**: Vérification et création/résolution d'alerte
3. **Mouvement de stock**: Après chaque mouvement, vérification du seuil

## 🛡️ Sécurité

### Authentification
- Cookies HTTP-only pour les sessions
- Pas de JWT (simplicité pour usage local)
- Mots de passe hashés avec bcrypt (10 rounds)

### Validation
- DTOs avec class-validator
- Validation automatique via `ValidationPipe`
- Whitelist activée (propriétés non définies supprimées)

### Transactions
- Utilisation de `QueryRunner` pour les transactions
- Rollback automatique en cas d'erreur
- Garantit l'intégrité des données

##   Endpoints par Fonctionnalité

### Gestion des Catégories
- CRUD complet
- Vérification unicité du nom
- Cascade sur les produits (configurable)

### Gestion des Produits
- CRUD complet
- Filtrage par catégorie
- Liste des produits en stock bas
- Gestion automatique des alertes

### Gestion des Mouvements
- Création avec transaction
- Historique complet
- Filtrage par produit/type
- Statistiques (entrées/sorties)

### Gestion des Alertes
- Liste des alertes actives
- Résolution manuelle
- Compteur d'alertes
- Résolution automatique

### Gestion des Utilisateurs
- Création avec hashage du mot de passe
- Liste sans les mots de passe
- Rôles: admin / gestionnaire

### Authentification
- Login avec création de cookie
- Logout avec suppression de cookie
- Validation des credentials

## 🔧 Configuration

### Variables d'Environnement (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=geststock_db
PORT=3000
```

### TypeORM Configuration (app.module.ts)
- `synchronize: true` → Création automatique des tables (dev only)
- `logging: true` → Logs SQL pour debug
- `entities` → Liste des entities à charger

### CORS
- Origin: `http://localhost:5173` (frontend React)
- Credentials: `true` (pour les cookies)

##   Conventions de Code

### Nommage
- **Dossiers**: Première lettre majuscule (Controllers/, Services/, Entities/)
- **Fichiers**: Tout en minuscules (category.service.ts, product.entity.ts)
- **Classes**: PascalCase (CategoryService, Product)
- **Méthodes**: camelCase (findAll, create)
- **Commentaires**: En français

### Structure des Services
```typescript
@Injectable()
export class XxxService {
  constructor(
    @InjectRepository(Entity)
    private repository: Repository<Entity>,
  ) {}

  async create() { }
  async findAll() { }
  async findOne() { }
  async update() { }
  async remove() { }
}
```

### Structure des Controllers
```typescript
@Controller('api/xxx')
export class XxxController {
  constructor(private readonly service: XxxService) {}

  @Post()
  async create(@Body() dto: CreateDto) { }

  @Get()
  async findAll() { }

  @Get(':id')
  async findOne(@Param('id') id: string) { }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateDto) { }

  @Delete(':id')
  async remove(@Param('id') id: string) { }
}
```

##   Commandes Utiles

```bash
# Installation
npm install

# Développement
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Seed DB
npm run seed

# Linting
npm run lint

# Tests
npm run test
```

## 📦 Dépendances Principales

- `@nestjs/core` - Framework NestJS
- `@nestjs/typeorm` - Intégration TypeORM
- `typeorm` - ORM pour PostgreSQL
- `pg` - Driver PostgreSQL
- `class-validator` - Validation des DTOs
- `class-transformer` - Transformation des données
- `bcrypt` - Hashage des mots de passe
- `cookie-parser` - Gestion des cookies
- `@nestjs/config` - Variables d'environnement
