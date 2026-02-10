import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Package, TrendingDown } from 'lucide-react';
import { alertsAPI } from '../services/api';
import '../styles/Categories.css';

function Alertes() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
    
    // Rafraîchir les alertes toutes les 15 secondes
    const interval = setInterval(loadAlerts, 15000);
    
    // Écouter l'événement de rafraîchissement manuel
    window.addEventListener('refreshAlerts', loadAlerts);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('refreshAlerts', loadAlerts);
    };
  }, []);

  const loadAlerts = async () => {
    try {
      // Utiliser getActive() pour n'afficher que les alertes actives
      const response = await alertsAPI.getActive();
      setAlerts(response.data);
    } catch (error) {
      console.error('Erreur chargement alertes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
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
          <h1>Alertes de stock</h1>
          <p>Produits nécessitant un réapprovisionnement</p>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="page-content">
          <div className="empty-state">
            <AlertTriangle size={64} />
            <h3>Aucune alerte active</h3>
            <p>Tous vos stocks sont au-dessus du seuil d'alerte</p>
          </div>
        </div>
      ) : (
        <div className="categories-grid">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id_alerte}
              className="category-card"
              whileHover={{ y: -4 }}
              style={{ borderLeft: '4px solid #ef4444' }}
            >
              <div className="category-icon" style={{ background: '#fee2e2', color: '#ef4444' }}>
                <TrendingDown size={24} />
              </div>
              <h3>{alert.produit?.nom}</h3>
              <p>ID: {alert.produit?.id_produit?.substring(0, 8)}</p>
              <div className="category-stats">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Stock actuel:</span>
                  <strong style={{ color: '#ef4444', fontSize: '1.1rem' }}>{alert.produit?.stock_actuel || 0}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Seuil d'alerte:</span>
                  <strong style={{ color: '#f59e0b', fontSize: '1.1rem' }}>{alert.produit?.stock_min || 0}</strong>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #e2e8f0'
                }}>
                  <span>Manquant:</span>
                  <strong style={{ color: '#991b1b' }}>
                    {Math.max(0, (alert.produit?.stock_min || 0) - (alert.produit?.stock_actuel || 0))}
                  </strong>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.75rem' }}>
                  Alerte créée le {formatDate(alert.date_alerte)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default Alertes;
