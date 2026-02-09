# Spécifications - Application de Gestion d'Inventaire Local

## Vue d'ensemble
Application de gestion d'inventaire locale, simple et fonctionnelle pour suivre les produits, les mouvements de stock et les alertes de stock bas.

## Stack Technique

### Frontend
- **Framework**: React (JSX)
- **Styling**: Tailwind CSS
- **Approche**: Fonctionnelle avec hooks
- **Session**: Cookies simples

### Backend
- **Langage**: TypeScript
- **Framework**: NestJS (déjà configuré)
- **ORM**: TypeORM
- **Base de données**: PostgreSQL
- **Transactions**: TypeORM transactions pour l'intégrité des mouvements

## Règles de Structure de Fichiers
- **Dossiers**: Première lettre en MAJUSCULE (ex: `Components/`, `Services/`, `Entities/`)
- **Fichiers**: tout en minuscules (ex: `product.entity.ts`, `stock.service.ts`)
- **Commentaires**: En français pour expliquer les étapes clés

## Fonctionnalités Principales

### 1. Gestion des Produits
- Créer, modifier, supprimer des produits
- Champs: nom, description, catégorie, quantité actuelle, seuil d'alerte, prix unitaire
- Catégorisation des produits

### 2. Gestion des Catégories
- Créer, modifier, supprimer des catégories
- Associer des produits aux catégories
- Filtrage par catégorie

### 3. Mouvements de Stock
- **Entrées**: Ajout de stock (réception, achat)
- **Sorties**: Retrait de stock (vente, utilisation)
- Historique complet des mouvements
- Champs: produit, type (entrée/sortie), quantité, date, motif/commentaire
- **Transactions**: Utilisation de transactions TypeORM pour garantir l'intégrité

### 4. Système d'Alertes Visuelles
- Indicateur visuel pour les produits en stock bas
- Seuil d'alerte configurable par produit
- Tableau de bord avec alertes prioritaires
- Codes couleur: vert (stock OK), orange (stock bas), rouge (rupture)

### 5. Authentification Simple
- Session basée sur cookies simples
- Pas de complexité excessive
- Protection des routes backend

## Architecture Backend

### Entities (backend/src/Entities/)
1. **category.entity.ts** - Catégories de produits
2. **product.entity.ts** - Produits avec relations
3. **movement.entity.ts** - Mouvements de stock (entrées/sorties)
4. **user.entity.ts** - Utilisateurs (simple)

### Services (backend/src/Services/)
1. **category.service.ts** - Logique métier catégories
2. **product.service.ts** - Logique métier produits
3. **movement.service.ts** - Logique métier mouvements avec transactions
4. **auth.service.ts** - Authentification simple

### Controllers (backend/src/Controllers/)
1. **category.controller.ts** - Routes API catégories
2. **product.controller.ts** - Routes API produits
3. **movement.controller.ts** - Routes API mouvements
4. **auth.controller.ts** - Routes API authentification

### DTOs (backend/src/Dto/)
- Validation des données entrantes
- DTOs pour chaque entité (create, update)

## Architecture Frontend

### Components (src/Components/)
1. **Layout/** - Structure de base
   - `header.jsx` - En-tête avec navigation
   - `sidebar.jsx` - Menu latéral
   - `layout.jsx` - Wrapper principal

2. **Products/** - Gestion produits
   - `productlist.jsx` - Liste des produits avec filtres
   - `productform.jsx` - Formulaire création/édition
   - `productcard.jsx` - Carte produit avec indicateur stock

3. **Categories/** - Gestion catégories
   - `categorylist.jsx` - Liste des catégories
   - `categoryform.jsx` - Formulaire catégorie

4. **Movements/** - Mouvements de stock
   - `movementform.jsx` - Formulaire entrée/sortie
   - `movementhistory.jsx` - Historique des mouvements
   - `movementtable.jsx` - Tableau des mouvements

5. **Dashboard/** - Tableau de bord
   - `dashboard.jsx` - Vue d'ensemble
   - `alertpanel.jsx` - Panneau d'alertes stock bas
   - `statscard.jsx` - Cartes statistiques

6. **Auth/** - Authentification
   - `login.jsx` - Formulaire de connexion
   - `protectedroute.jsx` - Protection des routes

### Services (src/Services/)
1. **api.js** - Configuration Axios
2. **product.service.js** - Appels API produits
3. **category.service.js** - Appels API catégories
4. **movement.service.js** - Appels API mouvements
5. **auth.service.js** - Appels API authentification

### Hooks (src/Hooks/)
1. **useauth.js** - Hook authentification
2. **useproducts.js** - Hook gestion produits
3. **usecategories.js** - Hook gestion catégories
4. **usemovements.js** - Hook gestion mouvements

## Design UI/UX

### Palette de Couleurs (Tailwind)
- **Principal**: blue-600
- **Succès**: green-500
- **Alerte**: orange-500
- **Danger**: red-500
- **Neutre**: gray-100, gray-800

### Indicateurs Visuels Stock
- **Stock OK** (> seuil): Badge vert
- **Stock bas** (≤ seuil, > 0): Badge orange + icône warning
- **Rupture** (= 0): Badge rouge + icône alert

### Responsive
- Mobile-first avec Tailwind
- Grilles adaptatives
- Menu hamburger sur mobile

## Base de Données PostgreSQL

### Configuration
- Host: localhost
- Port: 5432
- Database: inventory_db
- User: postgres
- Password: à configurer

### Relations
- Category 1:N Product
- Product 1:N Movement
- Cascade sur suppression (configurable)

## API Endpoints

### Authentification
- POST `/api/auth/login` - Connexion
- POST `/api/auth/logout` - Déconnexion
- GET `/api/auth/me` - Utilisateur actuel

### Catégories
- GET `/api/categories` - Liste toutes
- GET `/api/categories/:id` - Une catégorie
- POST `/api/categories` - Créer
- PUT `/api/categories/:id` - Modifier
- DELETE `/api/categories/:id` - Supprimer

### Produits
- GET `/api/products` - Liste tous (avec filtres)
- GET `/api/products/:id` - Un produit
- GET `/api/products/low-stock` - Produits en stock bas
- POST `/api/products` - Créer
- PUT `/api/products/:id` - Modifier
- DELETE `/api/products/:id` - Supprimer

### Mouvements
- GET `/api/movements` - Liste tous (avec filtres)
- GET `/api/movements/product/:id` - Mouvements d'un produit
- POST `/api/movements` - Créer mouvement (avec transaction)
- GET `/api/movements/stats` - Statistiques

## Principes de Développement

1. **Code complet**: Pas de placeholders, code fonctionnel
2. **Simplicité**: Éviter la complexité inutile
3. **Modularité**: Composants réutilisables
4. **Commentaires**: En français pour les étapes clés
5. **Transactions**: Garantir l'intégrité des données
6. **Validation**: DTOs et validation côté backend
7. **Expérience développeur**: Code clair et maintenable

## Étapes de Développement

### Phase 1: Configuration Base
- ✓ Structure projet existante
- Configuration PostgreSQL
- Configuration TypeORM
- Configuration Tailwind CSS

### Phase 2: Backend - Entities & Database
- Création des entities
- Configuration des relations
- Migrations

### Phase 3: Backend - Services & Controllers
- Services avec logique métier
- Controllers avec routes API
- DTOs et validation

### Phase 4: Frontend - Structure & Auth
- Configuration Tailwind
- Composants Layout
- Système d'authentification

### Phase 5: Frontend - Fonctionnalités Core
- Gestion catégories
- Gestion produits
- Mouvements de stock

### Phase 6: Frontend - Dashboard & Alertes
- Tableau de bord
- Système d'alertes visuelles
- Statistiques

### Phase 7: Tests & Finalisation
- Tests fonctionnels
- Corrections bugs
- Documentation

## Notes Importantes

- **Développement local**: Pas besoin de déploiement cloud
- **Sécurité basique**: Cookies simples, pas de JWT complexe
- **Performance**: Requêtes optimisées, indexes sur colonnes clés
- **Évolutivité**: Architecture permettant l'ajout de fonctionnalités

---

**Prêt à commencer le développement étape par étape selon vos demandes.**
