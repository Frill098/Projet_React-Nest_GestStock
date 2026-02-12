import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Bell, Search, User, LogOut, Settings, ChevronDown, Package, FolderOpen } from 'lucide-react';
import axios from 'axios';
import { alertsAPI, productsAPI, categoriesAPI } from '../services/api';
import NotificationPanel from './NotificationPanel';
import '../styles/Header.css';

function Header({ sidebarOpen, setSidebarOpen }) {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ products: [], categories: [] });
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadAlerts();
    
    // Rafraîchir les alertes toutes les 15 secondes
    const interval = setInterval(loadAlerts, 15000);
    
    // Écouter l'événement de rafraîchissement manuel
    window.addEventListener('refreshAlerts', loadAlerts);
    
    // Fermer la recherche si on clique ailleurs
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('refreshAlerts', loadAlerts);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      performSearch(searchQuery);
    } else {
      setSearchResults({ products: [], categories: [] });
      setSearchOpen(false);
    }
  }, [searchQuery]);

  const loadAlerts = async () => {
    try {
      const response = await alertsAPI.getActive();
      setAlerts(response.data);
      
      // Vérifier les alertes non lues dans localStorage
      const readAlerts = JSON.parse(localStorage.getItem('readAlerts') || '[]');
      const unread = response.data.filter(alert => !readAlerts.includes(alert.id_alerte));
      setUnreadCount(unread.length);
    } catch (error) {
      console.error('Erreur chargement alertes:', error);
    }
  };

  const performSearch = async (query) => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll(),
      ]);

      const lowerQuery = query.toLowerCase();
      
      const filteredProducts = productsRes.data
        .filter(p => 
          p.nom?.toLowerCase().includes(lowerQuery) || 
          p.description?.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 5);

      const filteredCategories = categoriesRes.data
        .filter(c => 
          c.nom?.toLowerCase().includes(lowerQuery) || 
          c.description?.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 3);

      setSearchResults({
        products: filteredProducts,
        categories: filteredCategories,
      });
      setSearchOpen(true);
    } catch (error) {
      console.error('Erreur recherche:', error);
    }
  };

  const handleSearchResultClick = (type, id) => {
    setSearchQuery('');
    setSearchOpen(false);
    if (type === 'product') {
      navigate('/produits');
    } else if (type === 'category') {
      navigate('/categories');
    }
  };

  const handleNotificationClick = () => {
    setNotificationOpen(!notificationOpen);
    if (!notificationOpen) {
      // Marquer toutes les alertes comme lues
      const alertIds = alerts.map(a => a.id_alerte);
      localStorage.setItem('readAlerts', JSON.stringify(alertIds));
      setUnreadCount(0);
    }
  };

  const handleAlertClick = (alert) => {
    setNotificationOpen(false);
    navigate('/alertes');
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/api/auth/logout', {}, {
        withCredentials: true,
      });
      localStorage.removeItem('user');
      localStorage.removeItem('readAlerts');
      navigate('/login');
    } catch (err) {
      console.error('Erreur lors de la déconnexion', err);
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <button 
            className="menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Menu"
          >
            <Menu size={22} />
          </button>
          
          <div className="search-container" ref={searchRef}>
            <div className="search-bar">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Rechercher un produit, catégorie..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {searchOpen && (searchResults.products.length > 0 || searchResults.categories.length > 0) && (
              <motion.div 
                className="search-results"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {searchResults.products.length > 0 && (
                  <div className="search-section">
                    <div className="search-section-title">
                      <Package size={16} />
                      <span>Produits</span>
                    </div>
                    {searchResults.products.map(product => (
                      <button
                        key={product.id_produit}
                        className="search-item"
                        onClick={() => handleSearchResultClick('product', product.id_produit)}
                      >
                        <Package size={16} />
                        <div className="search-item-content">
                          <span className="search-item-name">{product.nom}</span>
                          <span className="search-item-desc">
                            Stock: {product.stock_actuel || 0} • {product.prix_unitaire} FCFA
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.categories.length > 0 && (
                  <div className="search-section">
                    <div className="search-section-title">
                      <FolderOpen size={16} />
                      <span>Catégories</span>
                    </div>
                    {searchResults.categories.map(category => (
                      <button
                        key={category.id_categorie}
                        className="search-item"
                        onClick={() => handleSearchResultClick('category', category.id_categorie)}
                      >
                        <FolderOpen size={16} />
                        <div className="search-item-content">
                          <span className="search-item-name">{category.nom}</span>
                          {category.description && (
                            <span className="search-item-desc">{category.description}</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        <div className="header-right">
          <button 
            className="icon-btn" 
            title="Notifications"
            onClick={handleNotificationClick}
            type="button"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          <div className="user-menu">
            <button 
              className="user-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              title="Menu utilisateur"
            >
              <div className="user-avatar">
                <User size={18} />
              </div>
              <div className="user-info">
                <span className="user-name">{user?.nom || 'Utilisateur'}</span>
                <span className="user-role">{user?.role || 'Rôle'}</span>
              </div>
              <ChevronDown size={18} />
            </button>

            {dropdownOpen && (
              <motion.div 
                className="dropdown-menu"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <button className="dropdown-item" onClick={() => { navigate('/profil'); setDropdownOpen(false); }}>
                  <User size={18} />
                  <span>Mon profil</span>
                </button>
                <button className="dropdown-item" onClick={() => { navigate('/parametres'); setDropdownOpen(false); }}>
                  <Settings size={18} />
                  <span>Paramètres</span>
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <LogOut size={18} />
                  <span>Déconnexion</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      <NotificationPanel
        alerts={alerts}
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        onAlertClick={handleAlertClick}
      />
    </>
  );
}

export default Header;
