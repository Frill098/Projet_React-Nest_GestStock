import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import '../styles/NotificationPanel.css';

function NotificationPanel({ alerts, isOpen, onClose, onAlertClick }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="notification-overlay" onClick={onClose} />
          <motion.div
            className="notification-panel"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <div className="notification-header">
              <h3>Notifications</h3>
              <button onClick={onClose} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="notification-content">
              {alerts.length === 0 ? (
                <div className="no-notifications">
                  <CheckCircle size={48} />
                  <p>Aucune alerte active</p>
                  <span>Tous vos stocks sont OK</span>
                </div>
              ) : (
                <div className="notification-list">
                  {alerts.map((alert) => (
                    <motion.div
                      key={alert.id_alerte}
                      className="notification-item"
                      onClick={() => onAlertClick(alert)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="notification-icon">
                        <AlertTriangle size={20} />
                      </div>
                      <div className="notification-body">
                        <h4>{alert.produit?.nom}</h4>
                        <p>
                          Stock: <strong>{alert.produit?.stock_actuel}</strong> / 
                          Seuil: <strong>{alert.produit?.stock_min}</strong>
                        </p>
                        <span className="notification-time">
                          {new Date(alert.date_alerte).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default NotificationPanel;
