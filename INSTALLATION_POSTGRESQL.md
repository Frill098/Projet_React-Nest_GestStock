# 🐘 Installation et Configuration de PostgreSQL

## 📥 Installation de PostgreSQL sur Windows

### Option 1 : Téléchargement Direct (Recommandé)

1. **Télécharger PostgreSQL** :
   - Visitez : https://www.postgresql.org/download/windows/
   - Téléchargez la dernière version (PostgreSQL 16 ou 15)
   - Lancez l'installeur

2. **Installation** :
   - Suivez l'assistant d'installation
   - **IMPORTANT** : Notez le mot de passe que vous définissez pour l'utilisateur `postgres`
   - Port par défaut : `5432` (gardez-le)
   - Installez tous les composants (PostgreSQL Server, pgAdmin, Command Line Tools)

3. **Vérification** :
   ```bash
   # Ouvrir un nouveau terminal PowerShell
   psql --version
   ```

### Option 2 : Via Chocolatey

```bash
choco install postgresql
```

## 🔧 Configuration pour GestStock

### Étape 1 : Créer la Base de Données

Ouvrez **pgAdmin** (installé avec PostgreSQL) ou utilisez la ligne de commande :

#### Via pgAdmin (Interface Graphique)
1. Ouvrez pgAdmin
2. Connectez-vous avec le mot de passe défini lors de l'installation
3. Clic droit sur "Databases" → "Create" → "Database"
4. Nom : `geststock_db`
5. Cliquez sur "Save"

#### Via Ligne de Commande
```bash
# Ouvrir PowerShell en tant qu'administrateur
psql -U postgres

# Dans psql, tapez :
CREATE DATABASE geststock_db;
\q
```

### Étape 2 : Configurer le fichier .env

Modifiez le fichier `backend/.env` avec vos informations :

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=VOTRE_MOT_DE_PASSE_ICI
DB_DATABASE=geststock_db
PORT=3000
```

**⚠️ IMPORTANT** : Remplacez `VOTRE_MOT_DE_PASSE_ICI` par le mot de passe que vous avez défini lors de l'installation de PostgreSQL.

### Étape 3 : Vérifier la Connexion

```bash
# Tester la connexion
psql -U postgres -d geststock_db

# Si ça fonctionne, vous verrez :
# geststock_db=#

# Tapez \q pour quitter
\q
```

## 🚀 Démarrage du Backend

Une fois PostgreSQL configuré :

```bash
cd backend

# 1. Initialiser les données de test
npm run seed

# 2. Démarrer le serveur
npm run start:dev
```

Vous devriez voir :
```
🚀 Application démarrée sur http://localhost:3000
📊 Base de données: geststock_db
```

## 🔍 Vérification que tout fonctionne

### Test 1 : Vérifier que le serveur répond
```bash
curl http://localhost:3000/api/categories
```

### Test 2 : Se connecter
```bash
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@geststock.com\",\"mot_de_passe\":\"admin123\"}"
```

### Test 3 : Lister les produits
```bash
curl http://localhost:3000/api/products
```

## ❌ Problèmes Courants

### Erreur : "authentification par mot de passe échouée"
**Solution** : Le mot de passe dans `.env` ne correspond pas au mot de passe PostgreSQL
- Vérifiez le fichier `backend/.env`
- Assurez-vous que `DB_PASSWORD` correspond au mot de passe défini lors de l'installation

### Erreur : "psql n'est pas reconnu"
**Solution** : PostgreSQL n'est pas dans le PATH
- Ajoutez PostgreSQL au PATH : `C:\Program Files\PostgreSQL\16\bin`
- OU utilisez pgAdmin pour créer la base de données

### Erreur : "database geststock_db does not exist"
**Solution** : La base de données n'a pas été créée
- Créez-la avec pgAdmin ou la commande `CREATE DATABASE geststock_db;`

### Erreur : "port 5432 already in use"
**Solution** : PostgreSQL utilise déjà le port
- C'est normal ! Cela signifie que PostgreSQL est déjà en cours d'exécution
- Continuez avec la création de la base de données

### Erreur : "connection refused"
**Solution** : PostgreSQL n'est pas démarré
- Windows : Ouvrez "Services" → Cherchez "PostgreSQL" → Démarrez le service
- OU redémarrez votre ordinateur

## 🎯 Résumé Rapide

Si vous avez déjà PostgreSQL installé :

1. **Créer la DB** :
   ```sql
   CREATE DATABASE geststock_db;
   ```

2. **Configurer .env** :
   ```env
   DB_PASSWORD=votre_mot_de_passe
   ```

3. **Lancer** :
   ```bash
   cd backend
   npm run seed
   npm run start:dev
   ```

## 📞 Besoin d'Aide ?

Si vous rencontrez des problèmes :
1. Vérifiez que PostgreSQL est bien installé : `psql --version`
2. Vérifiez que le service PostgreSQL est démarré (Services Windows)
3. Vérifiez le mot de passe dans `.env`
4. Vérifiez que la base `geststock_db` existe dans pgAdmin

---

**Une fois PostgreSQL configuré, le backend fonctionnera parfaitement !** 🎉
