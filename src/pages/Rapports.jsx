import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Package, DollarSign, PieChart, Activity } from 'lucide-react';
import { productsAPI, movementsAPI, categoriesAPI } from '../services/api';
import { BarChart, Bar, PieChart as RechartsPie, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.css';
import '../styles/Rapports.css';

function Rapports() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    totalMovements: 0,
    lowStockCount: 0,
  });
  const [categoryData, setCategoryData] = useState([]);
  const [movementData, setMovementData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [productsRes, movementsRes, categoriesRes] = await Promise.all([
        productsAPI.getAll(),
        movementsAPI.getAll(),
        categoriesAPI.getAll(),
      ]);

      const products = productsRes.data;
      const movements = movementsRes.data;
      const categories = categoriesRes.data;

      const totalValue = products.reduce((sum, p) => {
        const prix = parseFloat(p.prix_unitaire) || 0;
        const stock = parseInt(p.stock_actuel) || 0;
        return sum + (prix * stock);
      }, 0);
      
      const lowStockCount = products.filter(p => {
        const stock = parseInt(p.stock_actuel) || 0;
        const min = parseInt(p.stock_min) || 0;
        return stock <= min;
      }).length;

      setStats({
        totalProducts: products.length,
        totalValue: totalValue,
        totalMovements: movements.length,
        lowStockCount: lowStockCount,
      });

      // Données par catégorie
      const catData = categories.map(cat => ({
        name: cat.nom,
        produits: products.filter(p => p.categorie?.id_categorie === cat.id_categorie).length,
        valeur: products
          .filter(p => p.categorie?.id_categorie === cat.id_categorie)
          .reduce((sum, p) => sum + (parseFloat(p.prix_unitaire || 0) * parseInt(p.stock_actuel || 0)), 0),
      })).filter(cat => cat.produits > 0);
      setCategoryData(catData);

      // Données des mouvements (7 derniers jours)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const movData = last7Days.map(date => {
        const dayMovements = movements.filter(m => 
          m.date_mouvement?.split('T')[0] === date
        );
        return {
          date: new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
          entrees: dayMovements.filter(m => m.type?.toUpperCase() === 'ENTREE').length,
          sorties: dayMovements.filter(m => m.type?.toUpperCase() === 'SORTIE').length,
        };
      });
      setMovementData(movData);

      // Top 10 produits par stock
      const topProducts = [...products]
        .sort((a, b) => (b.stock_actuel || 0) - (a.stock_actuel || 0))
        .slice(0, 10)
        .map(p => ({
          name: p.nom.length > 15 ? p.nom.substring(0, 15) + '...' : p.nom,
          stock: p.stock_actuel || 0,
          seuil: p.stock_min || 0,
        }));
      setStockData(topProducts);

    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  const reportCards = [
    {
      icon: Package,
      label: 'Total Produits',
      value: stats.totalProducts,
      color: '#667eea',
      description: 'Produits en catalogue',
    },
    {
      icon: DollarSign,
      label: 'Valeur du Stock',
      value: `${stats.totalValue.toFixed(0)} FCFA`,
      color: '#10b981',
      description: 'Valeur totale estimée',
    },
    {
      icon: TrendingUp,
      label: 'Mouvements',
      value: stats.totalMovements,
      color: '#8b5cf6',
      description: 'Entrées et sorties',
    },
    {
      icon: TrendingDown,
      label: 'Alertes Stock',
      value: stats.lowStockCount,
      color: '#ef4444',
      description: 'Produits en stock bas',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="page-header">
        <div>
          <h1>Rapports</h1>
          <p>Statistiques et analyses de votre inventaire</p>
        </div>
      </div>

      <div className="stats-grid">
        {reportCards.map((card, index) => (
          <motion.div
            key={index}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="stat-icon" style={{ background: `${card.color}15`, color: card.color }}>
              <card.icon size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">{card.label}</p>
              <h3 className="stat-value">{card.value}</h3>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                {card.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="charts-grid">
          {/* Graphique des catégories */}
          <motion.div
            className="content-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2><PieChart size={20} /> Répartition par Catégorie</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="produits"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
          </motion.div>

          {/* Graphique des mouvements */}
          <motion.div
            className="content-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2><Activity size={20} /> Mouvements (7 derniers jours)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={movementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="entrees" stroke="#10b981" strokeWidth={2} name="Entrées" />
                <Line type="monotone" dataKey="sorties" stroke="#ef4444" strokeWidth={2} name="Sorties" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Graphique des stocks */}
        <motion.div
          className="content-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2><BarChart3 size={20} /> Top 10 Produits par Stock</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stock" fill="#667eea" name="Stock actuel" />
              <Bar dataKey="seuil" fill="#f59e0b" name="Seuil d'alerte" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
}

const COLORS = ['#667eea', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export default Rapports;
