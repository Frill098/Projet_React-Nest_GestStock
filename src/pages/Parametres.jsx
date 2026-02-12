import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Bell, Shield, Save } from 'lucide-react';
import '../styles/Modal.css';

function Parametres() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    lowStockThreshold: 10,
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    alert('Paramètres sauvegardés avec succès !');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="page-header">
        <div>
          <h1>Paramètres</h1>
          <p>Configurez votre application</p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <motion.div
          className="content-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              background: '#667eea15', 
              color: '#667eea',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={20} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1a202c' }}>Profil utilisateur</h2>
          </div>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                Nom
              </label>
              <input
                type="text"
                value={user?.nom || ''}
                readOnly
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  color: '#94a3b8'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  color: '#94a3b8'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                Rôle
              </label>
              <input
                type="text"
                value={user?.role || ''}
                readOnly
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  color: '#94a3b8'
                }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="content-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              background: '#10b98115', 
              color: '#10b981',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bell size={20} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1a202c' }}>Notifications</h2>
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: '500', color: '#1a202c' }}>Notifications push</p>
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Recevoir des notifications dans l'app</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: '500', color: '#1a202c' }}>Alertes par email</p>
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Recevoir des emails pour les alertes</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailAlerts}
                  onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                  Seuil d'alerte par défaut
                </label>
                <input
                  type="number"
                  value={settings.lowStockThreshold}
                  onChange={(e) => setSettings({ ...settings, lowStockThreshold: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    background: '#f8fafc'
                  }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                <Save size={20} />
                Sauvegarder les paramètres
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Parametres;
