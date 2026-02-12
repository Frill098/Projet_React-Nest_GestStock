<<<<<<< HEAD
import { useEffect, useState } from "react";
import { getMouvements } from "../services/mouvementService";
import TableMouvements from "../components/TableMouvements";

export default function Mouvements() {
  const [mouvements, setMouvements] = useState([]);

  useEffect(() => {
    getMouvements().then(setMouvements);
  }, []);

  return (
    <div>
      <h1>Historique des mouvements</h1>
      <TableMouvements mouvements={mouvements} />
    </div>
  );
}
=======
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Plus, ArrowUpCircle, ArrowDownCircle, X } from 'lucide-react';
import { movementsAPI, productsAPI } from '../services/api';
import Toast from '../components/Toast';
import '../styles/Products.css';
import '../styles/Modal.css';

function Mouvements() {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    id_produit: '',
    type_mouvement: 'entree',
    quantite: '',
    motif: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [movementsRes, productsRes] = await Promise.all([
        movementsAPI.getAll(),
        productsAPI.getAll(),
      ]);
      setMovements(movementsRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const data = {
        id_produit: formData.id_produit,
        type: formData.type_mouvement.toUpperCase(),
        quantite: parseInt(formData.quantite),
        motif: formData.motif || '',
        id_utilisateur: user.id_utilisateur,
      };
      
      await movementsAPI.create(data);
      setToast({ show: true, message: 'Mouvement créé avec succès !', type: 'success' });
      
      // Rafraîchir les alertes dans le header
      window.dispatchEvent(new Event('refreshAlerts'));
      
      loadData();
      closeModal();
    } catch (error) {
      console.error('Erreur création mouvement:', error);
      setToast({ 
        show: true, 
        message: 'Erreur: ' + (error.response?.data?.message || error.message), 
        type: 'error' 
      });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      id_produit: '',
      type_mouvement: 'entree',
      quantite: '',
      motif: '',
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMovementType = (type) => {
    return type?.toUpperCase() === 'ENTREE' || type?.toLowerCase() === 'entree' ? 'entree' : 'sortie';
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
          <h1>Mouvements de stock</h1>
          <p>Suivez les entrées et sorties de stock</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Nouveau mouvement
        </button>
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Motif</th>
              <th>Utilisateur</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => (
              <tr key={movement.id_mouvement}>
                <td>{formatDate(movement.date_mouvement)}</td>
                <td>
                  <span className={`stock-badge ${getMovementType(movement.type) === 'entree' ? 'high' : 'low'}`}>
                    {getMovementType(movement.type) === 'entree' ? (
                      <><ArrowUpCircle size={14} /> Entrée</>
                    ) : (
                      <><ArrowDownCircle size={14} /> Sortie</>
                    )}
                  </span>
                </td>
                <td>
                  <div className="product-name">{movement.produit?.nom}</div>
                  <div className="product-ref">ID: {movement.produit?.id_produit?.substring(0, 8)}</div>
                </td>
                <td><strong>{movement.quantite}</strong></td>
                <td>{movement.motif || '-'}</td>
                <td>{movement.utilisateur?.nom || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {movements.length === 0 && (
          <div className="empty-state">
            <TrendingUp size={48} />
            <p>Aucun mouvement enregistré</p>
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
              <h2>Nouveau mouvement</h2>
              <button onClick={closeModal} className="btn-close">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Produit *</label>
                <select
                  value={formData.id_produit}
                  onChange={(e) => setFormData({ ...formData, id_produit: e.target.value })}
                  required
                >
                  <option value="">Sélectionner un produit</option>
                  {products.map((product) => (
                    <option key={product.id_produit} value={product.id_produit}>
                      {product.nom} (Stock: {product.stock_actuel || 0})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Type de mouvement *</label>
                <select
                  value={formData.type_mouvement}
                  onChange={(e) => setFormData({ ...formData, type_mouvement: e.target.value })}
                  required
                >
                  <option value="entree">Entrée</option>
                  <option value="sortie">Sortie</option>
                </select>
              </div>
              <div className="form-group">
                <label>Quantité *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantite}
                  onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Motif</label>
                <textarea
                  value={formData.motif}
                  onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                  rows="3"
                  placeholder="Raison du mouvement..."
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Créer
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

export default Mouvements;
>>>>>>> main
