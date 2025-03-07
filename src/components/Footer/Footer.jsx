import "./Footer.scss";
import { CreditCard, Building, DollarSign, Smartphone, Wallet, Banknote, PiggyBank } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer fixed-footer">
      <div className="footer-top">
        <div className="footer-column">
          <h3>Customer Care</h3>
          <ul>
            <li>Help Center</li>
            <li>Shopping Guide</li>
            <li>Warranty Policy</li>
            <li>Return & Refund</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>About Us</h3>
          <ul>
            <li>Company Info</li>
            <li>Careers</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Follow Us</h3>
          <ul>
            <li>Facebook</li>
            <li>Instagram</li>
            <li>TikTok</li>
            <li>Twitter</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Payment Methods</h3>
          <div className="payment-icons">
            <span><CreditCard size={20} /> </span>
            <span><Building size={20} /> </span>
            <span><DollarSign size={20} /></span>
            <span><Smartphone size={20} /></span>
            <span><Wallet size={20} /> </span>
            <span><Banknote size={20} /></span>
            <span><PiggyBank size={20} /> </span>
          </div>
        </div>
        <div className="footer-column">
          <h3>Contact Us</h3>
          <ul>
            <li>Email: support@classyshop.com</li>
            <li>Phone: +123 456 7890</li>
            <li>Live Chat</li>
            <li>FAQ</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 ClassyShop. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
