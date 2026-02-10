import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../services/api';
import Toast from '../components/Toast';
import '../styles/Products.css';
import '../styles/Modal.css';

function Produits() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix_unitaire: '',
    stock_actuel: '',
    stock_min: '',
    id_categorie: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll(),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        nom: formData.nom,
        description: formData.description,
        prix_unitaire: parseFloat(formData.prix_unitaire),
        stock_actuel: parseInt(formData.stock_actuel),
        stock_min: parseInt(formData.stock_min),
        id_categorie: formData.id_categorie,
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct.id_produit, data);
        setToast({ show: true, message: 'Produit modifié avec succès !', type: 'success' });
      } else {
        await productsAPI.create(data);
        setToast({ show: true, message: 'Produit créé avec succès !', type: 'success' });
      }
      
      // Rafraîchir les alertes dans le header
      window.dispatchEvent(new Event('refreshAlerts'));
      
      loadData();
      closeModal();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      setToast({ 
        show: true, 
        message: 'Erreur: ' + (error.response?.data?.message || error.message), 
        type: 'error' 
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce produit ?')) {
      try {
        await productsAPI.delete(id);
        setToast({ show: true, message: 'Produit supprimé avec succès !', type: 'success' });
        loadData();
      } catch (error) {
        console.error('Erreur suppression:', error);
        setToast({ show: true, message: 'Erreur lors de la suppression', type: 'error' });
      }
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nom: product.nom,
        description: product.description || '',
        prix_unitaire: product.prix_unitaire,
        stock_actuel: product.stock_actuel,
        stock_min: product.stock_min,
        id_categorie: product.categorie?.id_categorie || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nom: '',
        description: '',
        prix_unitaire: '',
        stock_actuel: '',
        stock_min: '',
        id_categorie: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const getStockStatus = (quantity, threshold) => {
    const qty = parseInt(quantity) || 0;
    const thresh = parseInt(threshold) || 0;
    if (qty <= thresh) return 'low';
    if (qty <= thresh * 2) return 'medium';
    return 'high';
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.categorie?.id_categorie === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="page-header">
        <div>
          <h1>Produits</h1>
          <p>Gérez votre catalogue de produits</p>
        </div>
        <button className="btn-primary" onClick={() => openModal()}>
          <Plus size={20} />
          Nouveau produit
        </button>
      </div>

      <div className="products-table-container">
        <div className="table-header">
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat.id_categorie} value={cat.id_categorie}>
                {cat.nom}
              </option>
            ))}
          </select>
        </div>

        <table className="products-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Seuil</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id_produit}>
                <td>
                  <div className="product-name">{product.nom}</div>
                  <div className="product-ref">ID: {product.id_produit.substring(0, 8)}</div>
                </td>
                <td>{product.categorie?.nom || 'Sans catégorie'}</td>
                <td>{parseFloat(product.prix_unitaire || 0).toFixed(0)} FCFA</td>
                <td><strong>{product.stock_actuel || 0}</strong></td>
                <td><span style={{ color: '#f59e0b', fontWeight: '600' }}>{product.stock_min || 0}</span></td>
                <td>
                  <span className={`stock-badge ${getStockStatus(product.stock_actuel, product.stock_min)}`}>
                    {product.stock_actuel <= product.stock_min && <AlertCircle size={14} />}
                    {getStockStatus(product.stock_actuel, product.stock_min) === 'low' ? 'Stock bas' :
                     getStockStatus(product.stock_actuel, product.stock_min) === 'medium' ? 'Stock moyen' : 'Stock OK'}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button 
                      onClick={() => openModal(product)} 
                      className="btn-icon"
                      title="Modifier"
                      type="button"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id_produit)} 
                      className="btn-icon danger"
                      title="Supprimer"
                      type="button"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="empty-state">
            <Package size={48} />
            <p>Aucun produit trouvé</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <motion.div
            className="modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{editingProduct ? 'Modifier' : 'Nouveau'} produit</h2>
              <button onClick={closeModal} className="btn-close">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom *</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Catégorie</label>
                <select
                  value={formData.id_categorie}
                  onChange={(e) => setFormData({ ...formData, id_categorie: e.target.value })}
                >
                  <option value="">Sans catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id_categorie} value={cat.id_categorie}>
                      {cat.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Prix unitaire (FCFA) *</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={formData.prix_unitaire}
                  onChange={(e) => setFormData({ ...formData, prix_unitaire: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Quantité en stock *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock_actuel}
                  onChange={(e) => setFormData({ ...formData, stock_actuel: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Seuil d'alerte *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock_min}
                  onChange={(e) => setFormData({ ...formData, stock_min: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </motion.div>
  );
}

export default Produits;
