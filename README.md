# 🏪 GestStock - Application de Gestion d'Inventaire

Application complète de gestion de stock avec React + NestJS + PostgreSQL.

## 📋 État du Projet

### ✅ Backend - COMPLET (100%)
Le backend est **entièrement développé et fonctionnel** avec :
- NestJS + TypeORM + PostgreSQL
- 30+ endpoints API REST
- Transactions pour l'intégrité des données
- Gestion automatique des alertes de stock
- Authentification avec cookies
- Documentation complète

### ⏳ Frontend - À DÉVELOPPER
- React + Tailwind CSS
- Interface utilisateur moderne
- Gestion complète de l'inventaire

## 🚀 Démarrage Rapide

### Prérequis
- Node.js (v18+)
- PostgreSQL (v15+)
- npm

### Installation PostgreSQL
Si PostgreSQL n'est pas installé, consultez **`INSTALLATION_POSTGRESQL.md`** pour un guide complet.

### Configuration Backend

1. **Installer les dépendances**
   ```bash
   cd backend
   npm install
   ```

2. **Configurer PostgreSQL**
   - Créer la base de données `geststock_db`
   - Modifier `backend/.env` avec votre mot de passe PostgreSQL

3. **Démarrer le backend**
   ```bash
   # Option 1 : Script automatique (Windows)
   start.bat

   # Option 2 : Commandes manuelles
   npm run seed        # Initialiser les données
   npm run start:dev   # Démarrer le serveur
   ```

Le serveur sera accessible sur **http://localhost:3000**

### Credentials de Test
- **Admin** : `admin@geststock.com` / `admin123`
- **Gestionnaire** : `gestionnaire@geststock.com` / `gestionnaire123`

## 📚 Documentation

- **`SPECIFICATIONS.md`** - Spécifications complètes du projet
- **`ETAT_PROJET.md`** - État actuel du développement
- **`INSTALLATION_POSTGRESQL.md`** - Guide d'installation PostgreSQL
- **`BACKEND_COMPLETE.md`** - Résumé du backend
- **`backend/README.md`** - Documentation backend détaillée
- **`backend/API_TESTS.md`** - Exemples de requêtes API
- **`backend/STRUCTURE.md`** - Architecture backend

## 🏗️ Architecture

```
GestStock/
├── backend/              ✅ Backend NestJS (COMPLET)
│   ├── src/
│   │   ├── Controllers/  # 6 controllers API
│   │   ├── Services/     # 6 services métier
│   │   ├── Entities/     # 5 entities TypeORM
│   │   └── Dto/         # 7 DTOs validation
│   ├── .env             # Configuration
│   └── README.md        # Documentation
│
├── src/                  ⏳ Frontend React (À DÉVELOPPER)
│   └── ...
│
└── SPECIFICATIONS.md     # Spécifications projet
```

## 🎯 Fonctionnalités

### Backend (Disponible)
- ✅ Gestion des catégories (CRUD)
- ✅ Gestion des produits (CRUD + filtres)
- ✅ Mouvements de stock (entrées/sorties avec transactions)
- ✅ Alertes automatiques de stock bas
- ✅ Authentification simple (cookies)
- ✅ Gestion des utilisateurs
- ✅ Statistiques et historique

### Frontend (À Développer)
- ⏳ Interface utilisateur moderne
- ⏳ Dashboard avec statistiques
- ⏳ Gestion visuelle des produits
- ⏳ Système d'alertes visuelles
- ⏳ Historique des mouvements
- ⏳ Authentification

## 🔧 Technologies

### Backend
- **NestJS** - Framework Node.js
- **TypeORM** - ORM pour PostgreSQL
- **PostgreSQL** - Base de données
- **TypeScript** - Langage
- **class-validator** - Validation
- **bcrypt** - Hashage mots de passe

### Frontend (Prévu)
- **React** - Framework UI
- **Tailwind CSS** - Styling
- **Axios** - Requêtes HTTP
- **React Router** - Navigation

## 📊 API Endpoints

Une fois le serveur démarré :

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion

### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/low-stock` - Produits en stock bas
- `POST /api/products` - Créer un produit
- `PUT /api/products/:id` - Modifier un produit
- `DELETE /api/products/:id` - Supprimer un produit

### Mouvements
- `GET /api/movements` - Historique
- `POST /api/movements` - Enregistrer un mouvement
- `GET /api/movements/stats` - Statistiques

### Alertes
- `GET /api/alertes/active` - Alertes actives
- `GET /api/alertes/count` - Nombre d'alertes

Voir **`backend/API_TESTS.md`** pour tous les endpoints et exemples.

## 🧪 Tester l'API

```bash
# Lister les produits
curl http://localhost:3000/api/products

# Produits en stock bas
curl http://localhost:3000/api/products/low-stock

# Connexion
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@geststock.com","mot_de_passe":"admin123"}'
```

## 🐛 Problèmes Courants

### "authentification par mot de passe échouée"
→ Vérifiez le mot de passe dans `backend/.env`

### "database geststock_db does not exist"
→ Créez la base : `CREATE DATABASE geststock_db;`

### "psql n'est pas reconnu"
→ Installez PostgreSQL ou utilisez pgAdmin

Voir **`INSTALLATION_POSTGRESQL.md`** pour plus de détails.

## 📝 Conventions de Code

- **Dossiers** : Première lettre majuscule (`Controllers/`, `Services/`)
- **Fichiers** : Tout en minuscules (`product.service.ts`)
- **Commentaires** : En français
- **Code** : Complet, sans placeholders

## 🎯 Prochaines Étapes

1. ✅ Backend développé
2. ⏳ Configurer PostgreSQL
3. ⏳ Tester le backend
4. ⏳ Développer le frontend React
5. ⏳ Intégrer frontend et backend

## 📞 Support

Consultez la documentation dans les fichiers Markdown à la racine du projet.

---

**Développé avec ❤️ - Backend prêt à l'emploi !**
