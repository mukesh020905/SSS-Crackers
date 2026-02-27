import { Link } from "react-router-dom";
import { HiOutlineStar, HiStar, HiOutlineShoppingCart } from "react-icons/hi";
import { useCart } from "../../context/CartContext";
import { formatPrice, getDiscount, getStarArray } from "../../utils/helpers";
import "./ProductCard.css";

// Simple hash-based color palette for product placeholder thumbnails
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

function getGradient(id) {
    const pair = COLORS[id % COLORS.length];
    return `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`;
}

// Map category slugs to emojis for the placeholder images
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

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const discount = getDiscount(product.price, product.discountPrice);
    const stars = getStarArray(product.rating);
    const emoji = CATEGORY_EMOJIS[product.categorySlug] || "🧨";

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };

    return (
        <Link to={`/products/${product.id}`} className="product-card" id={`product-${product.id}`}>
            {/* Image / Placeholder */}
            <div className="product-card-image" style={{ background: getGradient(product.id) }}>
                <span className="product-card-emoji">{emoji}</span>
                {discount > 0 && <span className="product-card-badge">-{discount}%</span>}
                {product.isBestseller && (
                    <span className="product-card-tag">🔥 Bestseller</span>
                )}
            </div>

            {/* Info */}
            <div className="product-card-body">
                <p className="product-card-category">{product.category}</p>
                <h3 className="product-card-title">{product.name}</h3>

                {/* Rating */}
                <div className="product-card-rating">
                    <div className="stars">
                        {Array(stars.full)
                            .fill(0)
                            .map((_, i) => (
                                <HiStar key={`f-${i}`} className="star filled" />
                            ))}
                        {Array(stars.empty + stars.half)
                            .fill(0)
                            .map((_, i) => (
                                <HiOutlineStar key={`e-${i}`} className="star" />
                            ))}
                    </div>
                    <span className="rating-count">({product.numReviews})</span>
                </div>

                {/* Price */}
                <div className="product-card-pricing">
                    <span className="price-current">{formatPrice(product.discountPrice)}</span>
                    {discount > 0 && (
                        <span className="price-original">{formatPrice(product.price)}</span>
                    )}
                </div>

                {/* Add to Cart */}
                <button className="product-card-cart-btn" onClick={handleAddToCart} aria-label="Add to cart">
                    <HiOutlineShoppingCart />
                    <span>Add to Cart</span>
                </button>
            </div>
        </Link>
    );
}
