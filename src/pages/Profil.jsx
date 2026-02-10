import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Calendar, Edit2, Save, X } from 'lucide-react';
import Toast from '../components/Toast';
import '../styles/Profil.css';

function Profil() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        nom: parsedUser.nom,
        email: parsedUser.email,
      });
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      nom: user.nom,
      email: user.email,
    });
  };

  const handleSave = () => {
    // Mettre à jour le localStorage
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    setToast({ show: true, message: 'Profil mis à jour avec succès !', type: 'success' });
  };

  if (!user) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="page-header">
        <div>
          <h1>Mon Profil</h1>
          <p>Gérez vos informations personnelles</p>
        </div>
        {!isEditing ? (
          <button className="btn-primary" onClick={handleEdit}>
            <Edit2 size={20} />
            Modifier
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-secondary" onClick={handleCancel}>
              <X size={20} />
              Annuler
            </button>
            <button className="btn-primary" onClick={handleSave}>
              <Save size={20} />
              Enregistrer
            </button>
          </div>
        )}
      </div>

      <div className="profil-container">
        <div className="profil-card">
          <div className="profil-avatar">
            <div className="avatar-circle">
              <User size={48} />
            </div>
            <div className="avatar-info">
              <h2>{user.nom}</h2>
              <span className="role-badge">{user.role}</span>
            </div>
          </div>

          <div className="profil-details">
            <div className="detail-group">
              <div className="detail-icon">
                <User size={20} />
              </div>
              <div className="detail-content">
                <label>Nom complet</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="detail-input"
                  />
                ) : (
                  <p>{user.nom}</p>
                )}
              </div>
            </div>

            <div className="detail-group">
              <div className="detail-icon">
                <Mail size={20} />
              </div>
              <div className="detail-content">
                <label>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="detail-input"
                  />
                ) : (
                  <p>{user.email}</p>
                )}
              </div>
            </div>

            <div className="detail-group">
              <div className="detail-icon">
                <Shield size={20} />
              </div>
              <div className="detail-content">
                <label>Rôle</label>
                <p className="role-text">{user.role}</p>
              </div>
            </div>

            <div className="detail-group">
              <div className="detail-icon">
                <Calendar size={20} />
              </div>
              <div className="detail-content">
                <label>Membre depuis</label>
                <p>{new Date(user.created_at || Date.now()).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="profil-stats">
          <h3>Statistiques</h3>
          <div className="stats-list">
            <div className="stat-item">
              <span className="stat-label">Connexions</span>
              <span className="stat-value">-</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Dernière connexion</span>
              <span className="stat-value">Aujourd'hui</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Actions effectuées</span>
              <span className="stat-value">-</span>
            </div>
          </div>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </motion.div>
  );
}

export default Profil;
