import { Link, useNavigate } from "react-router-dom";
import {
    HiOutlineTrash,
    HiOutlineShoppingCart,
    HiOutlineArrowRight,
    HiOutlineChevronLeft,
    HiPlus,
    HiMinus,
} from "react-icons/hi";
import { useCart } from "../../context/CartContext";
import { formatPrice, getDiscount } from "../../utils/helpers";
import "./CartPage.css";

const COLORS = [
    ["#ff6a00", "#ee0979"],
    ["#f7971e", "#ffd200"],
    ["#00c6ff", "#0072ff"],
    ["#11998e", "#38ef7d"],
    ["#fc5c7d", "#6a82fb"],
    ["#f953c6", "#b91d73"],
    ["#9b59b6", "#3498db"],
    ["#e44d26", "#f16529"],
];

const CATEGORY_EMOJIS = {
    "aerial-shots": "🎆",
    "ground-spinners": "🌀",
    rockets: "🚀",
    fountains: "⛲",
    sparklers: "✨",
    "sound-crackers": "💥",
    novelty: "🎭",
    "combo-packs": "📦",
};

function getGradient(id) {
    const pair = COLORS[id % COLORS.length];
    return `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`;
}

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, cartSavings } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="cart-empty">
                <div className="cart-empty-inner">
                    <span className="cart-empty-icon">🛒</span>
                    <h2>Your Cart is Empty</h2>
                    <p>Looks like you haven't added any crackers yet. Start shopping and light up your celebrations!</p>
                    <Link to="/products" className="btn btn-primary btn-lg">
                        <HiOutlineShoppingCart /> Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            {/* Header */}
            <div className="cart-header">
                <div className="cart-header-container">
                    <Link to="/products" className="breadcrumb-back">
                        <HiOutlineChevronLeft /> Continue Shopping
                    </Link>
                    <h1 className="cart-title">
                        Shopping Cart
                        <span className="cart-title-count">({cartItems.length} {cartItems.length === 1 ? "item" : "items"})</span>
                    </h1>
                </div>
            </div>

            <div className="cart-layout">
                {/* Cart Items */}
                <div className="cart-items">
                    {cartItems.map((item) => {
                        const emoji = CATEGORY_EMOJIS[item.categorySlug] || "🧨";
                        const discount = getDiscount(item.price, item.discountPrice);
                        return (
                            <div className="cart-item" key={item.id} id={`cart-item-${item.id}`}>
                                {/* Item Image */}
                                <Link to={`/products/${item.id}`} className="cart-item-image" style={{ background: getGradient(item.id) }}>
                                    <span className="cart-item-emoji">{emoji}</span>
                                </Link>

                                {/* Item Info */}
                                <div className="cart-item-info">
                                    <div className="cart-item-top">
                                        <div>
                                            <span className="cart-item-category">{item.category}</span>
                                            <Link to={`/products/${item.id}`} className="cart-item-name">{item.name}</Link>
                                        </div>
                                        <button
                                            className="cart-item-remove"
                                            onClick={() => removeFromCart(item.id)}
                                            aria-label="Remove item"
                                        >
                                            <HiOutlineTrash />
                                        </button>
                                    </div>

                                    <div className="cart-item-bottom">
                                        {/* Quantity */}
                                        <div className="qty-control">
                                            <button
                                                className="qty-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                aria-label="Decrease"
                                            >
                                                <HiMinus />
                                            </button>
                                            <span className="qty-value">{item.quantity}</span>
                                            <button
                                                className="qty-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                disabled={item.quantity >= item.stock}
                                                aria-label="Increase"
                                            >
                                                <HiPlus />
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <div className="cart-item-pricing">
                                            <span className="cart-item-price">{formatPrice(item.discountPrice * item.quantity)}</span>
                                            {discount > 0 && (
                                                <span className="cart-item-original">{formatPrice(item.price * item.quantity)}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <button className="clear-cart-btn" onClick={clearCart}>
                        <HiOutlineTrash /> Clear Cart
                    </button>
                </div>

                {/* Order Summary */}
                <div className="cart-summary">
                    <div className="summary-card">
                        <h3 className="summary-title">Order Summary</h3>

                        <div className="summary-rows">
                            <div className="summary-row">
                                <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                                <span>{formatPrice(cartTotal + cartSavings)}</span>
                            </div>
                            {cartSavings > 0 && (
                                <div className="summary-row savings">
                                    <span>Discount</span>
                                    <span>- {formatPrice(cartSavings)}</span>
                                </div>
                            )}
                            <div className="summary-row">
                                <span>Delivery</span>
                                <span className={cartTotal >= 999 ? "free-delivery" : ""}>
                                    {cartTotal >= 999 ? "FREE" : formatPrice(99)}
                                </span>
                            </div>
                        </div>

                        <div className="summary-total">
                            <span>Total</span>
                            <span className="total-amount">
                                {formatPrice(cartTotal + (cartTotal >= 999 ? 0 : 99))}
                            </span>
                        </div>

                        {cartSavings > 0 && (
                            <div className="summary-savings-badge">
                                🎉 You're saving {formatPrice(cartSavings)} on this order!
                            </div>
                        )}

                        {cartTotal < 999 && (
                            <div className="summary-free-delivery-hint">
                                Add {formatPrice(999 - cartTotal)} more for free delivery!
                            </div>
                        )}

                        <button
                            className="btn btn-primary btn-lg summary-checkout-btn"
                            id="checkout-btn"
                            onClick={() => navigate("/checkout")}
                        >
                            Proceed to Checkout <HiOutlineArrowRight />
                        </button>

                        <p className="summary-secure">🔒 Secure checkout powered by Razorpay</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
