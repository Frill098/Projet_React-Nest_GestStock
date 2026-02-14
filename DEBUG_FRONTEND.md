# 🐛 Debug Frontend - GestStock

## 🔍 Problèmes Identifiés

### 1.   Serveur Backend Non Démarré

**Symptôme** : Le frontend ne peut pas charger les données car le backend n'est pas accessible.

**Solution** :
```bash
cd backend
npm run start:dev
```

### 2. ⚠️ API Endpoints Manquants

Le fichier `src/services/api.js` utilise des endpoints qui n'existent pas exactement comme définis :

**Problème** :
```javascript
getRecent: (limit = 10) => api.get(`/movements?limit=${limit}`)
```

**Correction** : L'API backend ne supporte pas le paramètre `limit` directement.

**Solution** : Modifier `src/services/api.js`

## 🔧 Corrections à Appliquer

### Correction 1 : Mettre à Jour l'API Service

Fichier : `src/services/api.js`

```javascript
// Mouvements
export const movementsAPI = {
  getAll: () => api.get('/movements'),
  getById: (id) => api.get(`/movements/${id}`),
  create: (data) => api.post('/movements', data),
  getRecent: (limit = 10) => api.get('/movements/stats'), // Utiliser stats au lieu de limit
  getByProduct: (productId) => api.get(`/movements/product/${productId}`),
  getStats: () => api.get('/movements/stats'),
};
```

### Correction 2 : Mettre à Jour le Dashboard

Fichier : `src/pages/Dashboard.jsx`

```javascript
const loadStats = async () => {
  try {
    const [productsRes, statsRes, alertsRes] = await Promise.all([
      productsAPI.getAll(),
      movementsAPI.getStats(), // Utiliser getStats au lieu de getRecent
      alertsAPI.getActive(),
    ]);

    setStats([
      { 
        icon: Package, 
        label: 'Produits', 
        value: productsRes.data.length.toString(), 
        change: '+12%', 
        trend: 'up', 
        color: '#667eea' 
      },
      { 
        icon: TrendingUp, 
        label: 'Mouvements', 
        value: (statsRes.data.total_entrees + statsRes.data.total_sorties).toString(), 
        change: '+8%', 
        trend: 'up', 
        color: '#10b981' 
      },
      { 
        icon: AlertTriangle, 
        label: 'Alertes', 
        value: alertsRes.data.length.toString(), 
        change: '-5%', 
        trend: 'down', 
        color: '#f59e0b' 
      },
      { 
        icon: Users, 
        label: 'Catégories', 
        value: '12', 
        change: '+2', 
        trend: 'up', 
        color: '#8b5cf6' 
      },
    ]);

    // Utiliser les mouvements récents depuis stats
    setRecentMovements(statsRes.data.mouvements_recents || []);
  } catch (error) {
    console.error('Erreur chargement stats:', error);
  }
};
```

### Correction 3 : Ajouter la Gestion des Erreurs

Ajouter un état pour gérer les erreurs de chargement :

```javascript
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

const loadStats = async () => {
  try {
    setLoading(true);
    setError(null);
    // ... code existant ...
  } catch (error) {
    console.error('Erreur chargement stats:', error);
    setError('Impossible de charger les données. Vérifiez que le serveur backend est démarré.');
  } finally {
    setLoading(false);
  }
};

// Dans le JSX
if (loading) return <div>Chargement...</div>;
if (error) return <div className="error-message">{error}</div>;
```

## 📋 Checklist de Débogage

### Étape 1 : Vérifier le Backend

```bash
# 1. Aller dans le dossier backend
cd backend

# 2. Vérifier que PostgreSQL est démarré
psql -U postgres -d geststock_db -c "SELECT 1;"

# 3. Démarrer le serveur backend
npm run start:dev

# 4. Vérifier que le serveur répond
curl http://localhost:3000/api/products
```

   Le backend doit être accessible sur http://localhost:3000

### Étape 2 : Vérifier le Frontend

```bash
# 1. Retourner à la racine
cd ..

# 2. Installer les dépendances si nécessaire
npm install

# 3. Démarrer le frontend
npm run dev
```

   Le frontend doit être accessible sur http://localhost:5173

### Étape 3 : Tester la Connexion

1. Ouvrir http://localhost:5173
2. Se connecter avec : `admin@geststock.com` / `admin123`
3. Vérifier que le dashboard charge les données

### Étape 4 : Vérifier la Console

Ouvrir les DevTools (F12) et vérifier :
-    Pas d'erreurs CORS
-    Pas d'erreurs 404 sur les endpoints
-    Pas d'erreurs de connexion

## 🔍 Erreurs Courantes

### Erreur : "Network Error" ou "ERR_CONNECTION_REFUSED"

**Cause** : Le backend n'est pas démarré

**Solution** :
```bash
cd backend
npm run start:dev
```

### Erreur : "401 Unauthorized"

**Cause** : Session expirée ou cookies non configurés

**Solution** :
1. Se déconnecter
2. Se reconnecter
3. Vérifier que `withCredentials: true` est dans axios

### Erreur : "404 Not Found" sur /movements?limit=10

**Cause** : L'endpoint n'existe pas avec ce paramètre

**Solution** : Utiliser `/movements/stats` à la place

### Erreur : CORS

**Cause** : Le backend n'accepte pas les requêtes depuis le frontend

**Solution** : Vérifier dans `backend/src/main.ts` :
```typescript
app.enableCors({
  origin: 'http://localhost:5173',
  credentials: true,
});
```

##   Script de Démarrage Rapide

Créer un fichier `start.bat` (Windows) ou `start.sh` (Linux/Mac) :

### Windows (start.bat)
```batch
@echo off
echo Démarrage de GestStock...

start cmd /k "cd backend && npm run start:dev"
timeout /t 5 /nobreak
start cmd /k "npm run dev"

echo.
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
```

### Linux/Mac (start.sh)
```bash
#!/bin/bash
echo "Démarrage de GestStock..."

# Démarrer le backend
cd backend
npm run start:dev &
BACKEND_PID=$!

# Attendre que le backend démarre
sleep 5

# Démarrer le frontend
cd ..
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Backend: http://localhost:3000 (PID: $BACKEND_PID)"
echo "Frontend: http://localhost:5173 (PID: $FRONTEND_PID)"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter"

wait
```

##   Vérification Post-Correction

### Test 1 : Backend
```bash
curl http://localhost:3000/api/products
curl http://localhost:3000/api/movements/stats
curl http://localhost:3000/api/alertes/active
```

### Test 2 : Frontend
1. Ouvrir http://localhost:5173
2. Login : `admin@geststock.com` / `admin123`
3. Vérifier que le dashboard affiche :
   - Nombre de produits
   - Nombre de mouvements
   - Nombre d'alertes
   - Activité récente

### Test 3 : Console
Ouvrir F12 → Console
-    Pas d'erreurs rouges
-    Les requêtes API retournent 200 OK

## 🎯 Résumé des Corrections

1.    Démarrer le backend : `cd backend && npm run start:dev`
2.    Corriger `movementsAPI.getRecent()` pour utiliser `/movements/stats`
3.    Mettre à jour `Dashboard.jsx` pour utiliser les bonnes données
4.    Ajouter la gestion des erreurs
5.    Vérifier CORS dans le backend

---

**Après ces corrections, le frontend devrait fonctionner correctement !  **
