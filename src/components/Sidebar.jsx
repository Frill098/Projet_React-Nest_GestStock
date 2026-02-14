import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  TrendingUp, 
  AlertTriangle,
  BarChart3,
  Settings
} from 'lucide-react';
import '../styles/Sidebar.css';

function Sidebar({ isOpen, onClose, isMobile }) {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Package, label: 'Produits', path: '/produits' },
    { icon: FolderTree, label: 'Catégories', path: '/categories' },
    { icon: TrendingUp, label: 'Mouvements', path: '/mouvements' },
    { icon: AlertTriangle, label: 'Alertes', path: '/alertes' },
    { icon: BarChart3, label: 'Rapports', path: '/rapports' },
    { icon: Settings, label: 'Paramètres', path: '/parametres' },
  ];

  const handleNavClick = () => {
    if (isMobile && isOpen) {
      onClose();
    }
  };

  return (
    <>
      {isMobile && isOpen && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}
      <motion.aside 
        className={`sidebar ${isOpen ? 'open' : 'closed'}`}
        animate={{ width: isMobile ? (isOpen ? 260 : 0) : (isOpen ? 260 : 80) }}
        transition={{ duration: 0.3 }}
      >
        <div className="sidebar-header">
          <div className="logo">
            <Package size={28} />
            {isOpen && <span>StockFlow</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title={item.label}
              onClick={handleNavClick}
            >
              <item.icon size={22} />
              {isOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </motion.aside>
    </>
  );
}

export default Sidebar;
