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
      </div>
    </footer>
  );
}

export default Footer;
