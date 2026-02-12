import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Produits from './pages/Produits';
import Categories from './pages/Categories';
import Mouvements from './pages/Mouvements';
import Alertes from './pages/Alertes';
import Rapports from './pages/Rapports';
import Parametres from './pages/Parametres';
import Profil from './pages/Profil';
import './App.css';
import './styles/Common.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="produits" element={<Produits />} />
          <Route path="categories" element={<Categories />} />
          <Route path="mouvements" element={<Mouvements />} />
          <Route path="alertes" element={<Alertes />} />
          <Route path="rapports" element={<Rapports />} />
          <Route path="parametres" element={<Parametres />} />
          <Route path="profil" element={<Profil />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App; 