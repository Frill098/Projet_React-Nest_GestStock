import { Heart } from 'lucide-react';
import '../styles/Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          © {currentYear} StockFlow. Tous droits réservés.
        </p>
        <p className="footer-love">
          Fait avec <Heart size={14} fill="#ef4444" color="#ef4444" /> pour une gestion optimale
        </p>
      </div>
    </footer>
  );
}

export default Footer;
