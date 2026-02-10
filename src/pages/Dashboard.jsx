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
      const [productsRes, movementsRes, alertsRes] = await Promise.all([
        productsAPI.getAll(),
        movementsAPI.getRecent(5),
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
          value: movementsRes.data.length.toString(), 
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

      setRecentMovements(movementsRes.data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

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
