import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, TrendingUp, AlertTriangle, Users, ArrowUp, ArrowDown } from 'lucide-react';
import { productsAPI, movementsAPI, alertsAPI } from '../services/api';
import '../styles/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [recentMovements, setRecentMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      loadStats();
    }
  }, [navigate]);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [productsRes, statsRes, alertsRes] = await Promise.all([
        productsAPI.getAll(),
        movementsAPI.getStats(),
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

      setRecentMovements(statsRes.data.mouvements_recents || []);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      setError('Impossible de charger les données. Vérifiez que le serveur backend est démarré sur http://localhost:3000');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#64748b' }}>Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px', padding: '2rem', background: '#fee2e2', borderRadius: '12px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
          <p style={{ color: '#dc2626', fontWeight: '600', marginBottom: '1rem' }}>{error}</p>
          <button 
            onClick={loadStats}
            style={{ 
              padding: '0.75rem 1.5rem', 
              background: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Tableau de bord</h1>
          <p>Vue d'ensemble de votre inventaire</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <h3 className="stat-value">{stat.value}</h3>
              <div className={`stat-change ${stat.trend}`}>
                {stat.trend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                <span>{stat.change}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-content">
        <motion.div 
          className="content-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2>Activité récente</h2>
          <div className="activity-list">
            {recentMovements.map((movement, index) => (
              <div key={index} className="activity-item">
                <div 
                  className="activity-icon" 
                  style={{ 
                    background: movement.type?.toUpperCase() === 'ENTREE' ? '#10b98115' : '#f59e0b15', 
                    color: movement.type?.toUpperCase() === 'ENTREE' ? '#10b981' : '#f59e0b' 
                  }}
                >
                  <TrendingUp size={18} />
                </div>
                <div className="activity-content">
                  <p className="activity-title">
                    {movement.type?.toUpperCase() === 'ENTREE' ? 'Entrée' : 'Sortie'} de stock
                  </p>
                  <p className="activity-desc">
                    {movement.quantite} unités de {movement.produit?.nom}
                  </p>
                </div>
                <span className="activity-time">
                  {new Date(movement.date_mouvement).toLocaleDateString('fr-FR')}
                </span>
              </div>
            ))}
            {recentMovements.length === 0 && (
              <p style={{ textAlign: 'center', color: '#94a3b8' }}>Aucune activité récente</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
