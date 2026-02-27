import { Link } from "react-router-dom";
import {
    HiOutlinePhone,
    HiOutlineMail,
    HiOutlineLocationMarker,
} from "react-icons/hi";
import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-glow" />
            <div className="footer-container">
                <div className="footer-grid">
                    {/* Brand */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <span className="logo-icon">🧨</span>
                            <span className="logo-text">
                                SSS<span className="logo-highlight"> Crackers</span>
                            </span>
                        </Link>
                        <p className="footer-tagline">
                            Light up your celebrations with premium quality crackers. Trusted
                            by thousands of families across India.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h4 className="footer-heading">Quick Links</h4>
                        <ul className="footer-links">
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/products">All Products</Link>
                            </li>
                            <li>
                                <Link to="/products?category=combo-packs">Combo Packs</Link>
                            </li>
                            <li>
                                <Link to="/cart">My Cart</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="footer-section">
                        <h4 className="footer-heading">Categories</h4>
                        <ul className="footer-links">
                            <li>
                                <Link to="/products?category=aerial-shots">Aerial Shots</Link>
                            </li>
                            <li>
                                <Link to="/products?category=rockets">Rockets</Link>
                            </li>
                            <li>
                                <Link to="/products?category=sparklers">Sparklers</Link>
                            </li>
                            <li>
                                <Link to="/products?category=fountains">Fountains</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer-section">
                        <h4 className="footer-heading">Contact Us</h4>
                        <ul className="footer-contact">
                            <li>
                                <HiOutlineLocationMarker className="contact-icon" />
                                <span>Sivakasi, Tamil Nadu, India</span>
                            </li>
                            <li>
                                <HiOutlinePhone className="contact-icon" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li>
                                <HiOutlineMail className="contact-icon" />
                                <span>hello@crackershub.in</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2026 SSS Crackers. All rights reserved.</p>
                    <p className="footer-credit">Made with 🧡 in India</p>
                </div>
            </div>
        </footer>
    );
}
