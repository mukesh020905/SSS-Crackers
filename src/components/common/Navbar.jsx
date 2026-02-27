import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { HiOutlineShoppingCart, HiOutlineSearch, HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { useCart } from "../../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
    const { cartCount } = useCart();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">🧨</span>
                    <span className="logo-text">
                        SSS<span className="logo-highlight"> Crackers</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className={`navbar-nav ${mobileOpen ? "nav-open" : ""}`}>
                    <NavLink to="/" className="nav-link" onClick={() => setMobileOpen(false)}>
                        Home
                    </NavLink>
                    <NavLink to="/products" className="nav-link" onClick={() => setMobileOpen(false)}>
                        Shop
                    </NavLink>
                    <NavLink to="/products?category=combo-packs" className="nav-link" onClick={() => setMobileOpen(false)}>
                        Combos
                    </NavLink>
                    <NavLink to="/admin" className="nav-link nav-link-admin" onClick={() => setMobileOpen(false)}>
                        Admin
                    </NavLink>
                </nav>

                {/* Right Actions */}
                <div className="navbar-actions">
                    <Link to="/products" className="nav-action-btn search-btn" aria-label="Search">
                        <HiOutlineSearch />
                    </Link>
                    <Link to="/cart" className="nav-action-btn cart-btn" aria-label="Cart">
                        <HiOutlineShoppingCart />
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </Link>
                    <button
                        className="nav-action-btn mobile-toggle"
                        aria-label="Toggle menu"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <HiOutlineX /> : <HiOutlineMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile overlay */}
            {mobileOpen && <div className="nav-overlay" onClick={() => setMobileOpen(false)} />}
        </header>
    );
}
