import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderTree, Plus, Edit2, Trash2, X, Eye, Package } from 'lucide-react';
import { categoriesAPI, productsAPI } from '../services/api';
import Toast from '../components/Toast';
import '../styles/Categories.css';
import '../styles/Modal.css';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewingCategory, setViewingCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({ nom: '', description: '' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id_categorie, formData);
        setToast({ show: true, message: 'Catégorie modifiée avec succès !', type: 'success' });
      } else {
        await categoriesAPI.create(formData);
        setToast({ show: true, message: 'Catégorie créée avec succès !', type: 'success' });
      }
      loadCategories();
      closeModal();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      setToast({ show: true, message: 'Erreur lors de la sauvegarde', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cette catégorie ?')) {
      try {
        await categoriesAPI.delete(id);
        setToast({ show: true, message: 'Catégorie supprimée avec succès !', type: 'success' });
        loadCategories();
      } catch (error) {
        console.error('Erreur suppression:', error);
        setToast({ show: true, message: 'Erreur lors de la suppression', type: 'error' });
      }
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ nom: category.nom, description: category.description || '' });
    } else {
      setEditingCategory(null);
      setFormData({ nom: '', description: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ nom: '', description: '' });
  };

  const handleViewProducts = async (category) => {
    setViewingCategory(category);
    setShowProductsModal(true);
    setLoadingProducts(true);
    
    try {
      const response = await productsAPI.getAll();
      // Filtrer les produits de cette catégorie
      const filtered = response.data.filter(
        product => product.categorie?.id_categorie === category.id_categorie
      );
      setCategoryProducts(filtered);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
      setToast({ show: true, message: 'Erreur lors du chargement des produits', type: 'error' });
    } finally {
      setLoadingProducts(false);
    }
  };

  const closeProductsModal = () => {
    setShowProductsModal(false);
    setViewingCategory(null);
    setCategoryProducts([]);
  };

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
          <h1>Catégories</h1>
          <p>Organisez vos produits par catégories</p>
        </div>
        <button className="btn-primary" onClick={() => openModal()}>
          <Plus size={20} />
          Nouvelle catégorie
        </button>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <motion.div
            key={category.id_categorie}
            className="category-card"
            whileHover={{ y: -4 }}
          >
            <div className="category-icon">
              <FolderTree size={24} />
            </div>
            <h3>{category.nom}</h3>
            <p>{category.description || 'Aucune description'}</p>
            <div className="category-stats">
              <span>{category.produits?.length || 0} produits</span>
            </div>
            <div className="category-actions">
              <button 
                onClick={() => handleViewProducts(category)} 
                className="btn-icon view"
                title="Voir les produits"
                type="button"
              >
                <Eye size={18} />
              </button>
              <button 
                onClick={() => openModal(category)} 
                className="btn-icon"
                title="Modifier"
                type="button"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => handleDelete(category.id_categorie)} 
                className="btn-icon danger"
                title="Supprimer"
                type="button"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
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
              <h2>{editingCategory ? 'Modifier' : 'Nouvelle'} catégorie</h2>
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
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  {editingCategory ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal Produits de la Catégorie */}
      {showProductsModal && (
        <div className="modal-overlay" onClick={closeProductsModal}>
          <motion.div
            className="modal modal-large"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Produits - {viewingCategory?.nom}</h2>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>
                  {viewingCategory?.description || 'Aucune description'}
                </p>
              </div>
              <button onClick={closeProductsModal} className="btn-close">
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {loadingProducts ? (
                <div className="loading">Chargement des produits...</div>
              ) : categoryProducts.length === 0 ? (
                <div className="empty-state">
                  <Package size={48} />
                  <h3>Aucun produit</h3>
                  <p>Cette catégorie ne contient aucun produit pour le moment</p>
                </div>
              ) : (
                <div className="products-list">
                  {categoryProducts.map((product) => (
                    <motion.div
                      key={product.id_produit}
                      className="product-item"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="product-icon">
                        <Package size={20} />
                      </div>
                      <div className="product-details">
                        <h4>{product.nom}</h4>
                        <p>{product.description || 'Aucune description'}</p>
                        <div className="product-meta">
                          <span className="meta-item">
                            <strong>Prix:</strong> {parseFloat(product.prix_unitaire || 0).toFixed(0)} FCFA
                          </span>
                          <span className="meta-item">
                            <strong>Stock:</strong> {product.stock_actuel || 0}
                          </span>
                          <span className="meta-item">
                            <strong>Seuil:</strong> {product.stock_min || 0}
                          </span>
                        </div>
                      </div>
                      <div className="product-status">
                        <span className={`stock-badge ${
                          product.stock_actuel <= product.stock_min ? 'low' :
                          product.stock_actuel <= product.stock_min * 2 ? 'medium' : 'high'
                        }`}>
                          {product.stock_actuel <= product.stock_min ? 'Stock bas' :
                           product.stock_actuel <= product.stock_min * 2 ? 'Stock moyen' : 'Stock OK'}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={closeProductsModal} className="btn-secondary">
                Fermer
              </button>
            </div>
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

export default Categories;
