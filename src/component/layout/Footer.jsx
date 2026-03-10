import { FaFacebook, FaTwitter, FaYoutube, FaMedium, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <img src="/images/hh.png" alt="SkillHub" width="150px" height="120px" />
            <p className="footer-text">
              Empowering learners worldwide with expert-led courses, hands-on projects, and a thriving community.
            </p>
            <div className="social-icons">
              <a href="#" className="social-icon"><FaFacebook /></a>
              <a href="#" className="social-icon"><FaTwitter /></a>
              <a href="#" className="social-icon"><FaYoutube /></a>
              <a href="#" className="social-icon"><FaMedium /></a>
              <a href="#" className="social-icon"><FaGithub /></a>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Navigate</h3>
            <ul className="footer-links">
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/">Courses</Link></li>
              <li><Link to="/cart">My Cart</Link></li>
              <li><Link to="/myOrders">My Orders</Link></li>
              <li><Link to="/become-instructor">Become Instructor</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Account</h3>
            <ul className="footer-links">
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signUp">Sign Up</Link></li>
              <li><Link to="/my-courses">My Courses</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Legal</h3>
            <ul className="footer-links">
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Refund Policy</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-txt">
            <span className="footer-circle">C</span>
            {new Date().getFullYear()} All rights reserved to <strong className="footer-strong">SkillHub</strong>
          </p>
        </div>
      </div>
      <div className="footer-divider"></div>
    </footer>
  );
}

export default Footer;