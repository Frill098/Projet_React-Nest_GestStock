# Tests API - GestStock

Collection de requêtes pour tester l'API avec curl ou un client HTTP.

## 🔐 Authentification

### Connexion Admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@geststock.com",
    "mot_de_passe": "admin123"
  }' \
  -c cookies.txt
```

### Connexion Gestionnaire
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gestionnaire@geststock.com",
    "mot_de_passe": "gestionnaire123"
  }' \
  -c cookies.txt
```

### Déconnexion
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

## 📦 Catégories

### Lister toutes les catégories
```bash
curl http://localhost:3000/api/categories
```

### Créer une catégorie
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Informatique",
    "description": "Matériel informatique et accessoires"
  }'
```

### Modifier une catégorie
```bash
curl -X PUT http://localhost:3000/api/categories/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Informatique Pro",
    "description": "Matériel informatique professionnel"
  }'
```

### Supprimer une catégorie
```bash
curl -X DELETE http://localhost:3000/api/categories/{id}
```

## 🏷️ Produits

### Lister tous les produits
```bash
curl http://localhost:3000/api/products
```

### Filtrer par catégorie
```bash
curl "http://localhost:3000/api/products?categoryId={id_categorie}"
```

### Produits en stock bas
```bash
curl http://localhost:3000/api/products/low-stock
```

### Créer un produit
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Clavier mécanique",
    "description": "Clavier gaming RGB",
    "stock_actuel": 20,
    "stock_min": 5,
    "prix_unitaire": 79.99,
    "id_categorie": "{id_categorie}"
  }'
```

### Modifier un produit
```bash
curl -X PUT http://localhost:3000/api/products/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "stock_actuel": 25,
    "prix_unitaire": 69.99
  }'
```

### Supprimer un produit
```bash
curl -X DELETE http://localhost:3000/api/products/{id}
```

## 📊 Mouvements de Stock

### Lister tous les mouvements
```bash
curl http://localhost:3000/api/movements
```

### Filtrer par produit
```bash
curl "http://localhost:3000/api/movements?productId={id_produit}"
```

### Filtrer par type
```bash
curl "http://localhost:3000/api/movements?type=ENTREE"
curl "http://localhost:3000/api/movements?type=SORTIE"
```

### Statistiques
```bash
curl http://localhost:3000/api/movements/stats
```

### Créer une entrée de stock
```bash
curl -X POST http://localhost:3000/api/movements \
  -H "Content-Type: application/json" \
  -d '{
    "type": "ENTREE",
    "quantite": 50,
    "motif": "Réception commande fournisseur",
    "id_produit": "{id_produit}",
    "id_utilisateur": "{id_utilisateur}"
  }'
```

### Créer une sortie de stock
```bash
curl -X POST http://localhost:3000/api/movements \
  -H "Content-Type: application/json" \
  -d '{
    "type": "SORTIE",
    "quantite": 10,
    "motif": "Vente client",
    "id_produit": "{id_produit}",
    "id_utilisateur": "{id_utilisateur}"
  }'
```

### Mouvements d'un produit spécifique
```bash
curl http://localhost:3000/api/movements/product/{id_produit}
```

## 🚨 Alertes

### Alertes actives
```bash
curl http://localhost:3000/api/alertes/active
```

### Toutes les alertes
```bash
curl http://localhost:3000/api/alertes
```

### Nombre d'alertes actives
```bash
curl http://localhost:3000/api/alertes/count
```

### Résoudre une alerte
```bash
curl -X PUT http://localhost:3000/api/alertes/{id}/resolve
```

## 👥 Utilisateurs

### Lister tous les utilisateurs
```bash
curl http://localhost:3000/api/users
```

### Créer un utilisateur
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Jean Dupont",
    "email": "jean.dupont@geststock.com",
    "mot_de_passe": "password123",
    "role": "gestionnaire"
  }'
```

### Supprimer un utilisateur
```bash
curl -X DELETE http://localhost:3000/api/users/{id}
```

## 📝 Scénarios de Test

### Scénario 1: Créer un produit et enregistrer des mouvements

1. Créer une catégorie
2. Créer un produit avec stock initial
3. Enregistrer une entrée de stock
4. Enregistrer une sortie de stock
5. Vérifier le stock actuel
6. Vérifier l'historique des mouvements

### Scénario 2: Tester les alertes de stock bas

1. Créer un produit avec stock_actuel = 5 et stock_min = 10
2. Vérifier qu'une alerte est créée automatiquement
3. Enregistrer une entrée pour augmenter le stock au-dessus du minimum
4. Vérifier que l'alerte est résolue automatiquement

### Scénario 3: Tester les transactions

1. Créer un produit avec stock_actuel = 5
2. Tenter une sortie de 10 unités (doit échouer)
3. Vérifier que le stock n'a pas changé
4. Enregistrer une sortie de 3 unités (doit réussir)
5. Vérifier que le stock est maintenant à 2

## 🔍 Codes de Réponse HTTP

- `200 OK` - Requête réussie
- `201 Created` - Ressource créée
- `204 No Content` - Suppression réussie
- `400 Bad Request` - Données invalides
- `401 Unauthorized` - Non authentifié
- `404 Not Found` - Ressource non trouvée
- `409 Conflict` - Conflit (ex: email déjà utilisé)
- `500 Internal Server Error` - Erreur serveur
