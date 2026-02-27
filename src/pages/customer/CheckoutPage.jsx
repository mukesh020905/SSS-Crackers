import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    HiOutlineChevronLeft,
    HiOutlineLockClosed,
    HiOutlineTruck,
    HiOutlineShieldCheck,
    HiOutlineUser,
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineLocationMarker,
    HiOutlineOfficeBuilding,
    HiOutlineMap,
} from "react-icons/hi";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/helpers";
import { initRazorpayPayment } from "../../utils/razorpay";
import { toast } from "react-toastify";
import "./CheckoutPage.css";

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

const initialForm = {
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
};

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { cartItems, cartTotal, cartSavings, clearCart } = useCart();

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null); // null | "success" | "failed"
    const [paymentDetails, setPaymentDetails] = useState(null);

    const delivery = cartTotal >= 999 ? 0 : 99;
    const grandTotal = cartTotal + delivery;

    // ── Redirect if cart empty ──────────────────────────────────────────────
    if (cartItems.length === 0 && paymentStatus !== "success") {
        return (
            <div className="checkout-empty">
                <div className="checkout-empty-inner">
                    <span className="checkout-empty-icon">🛒</span>
                    <h2>Your cart is empty</h2>
                    <p>Add some products before checking out.</p>
                    <Link to="/products" className="btn btn-primary btn-lg">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    // ── Success screen ──────────────────────────────────────────────────────
    if (paymentStatus === "success") {
        return (
            <div className="checkout-success">
                <div className="checkout-success-inner">
                    <div className="success-animation">
                        <div className="success-ring" />
                        <span className="success-icon-emoji">🎉</span>
                    </div>
                    <h1 className="success-title">Payment Successful!</h1>
                    <p className="success-subtitle">
                        Your order has been placed. Get ready for a spectacular celebration! 🧨
                    </p>
                    {paymentDetails && (
                        <div className="success-details">
                            <div className="success-detail-row">
                                <span>Order ID</span>
                                <span className="success-detail-value">{paymentDetails.orderId}</span>
                            </div>
                            <div className="success-detail-row">
                                <span>Payment ID</span>
                                <span className="success-detail-value">{paymentDetails.paymentId}</span>
                            </div>
                            <div className="success-detail-row">
                                <span>Amount Paid</span>
                                <span className="success-detail-value success-amount">{formatPrice(grandTotal)}</span>
                            </div>
                        </div>
                    )}
                    <div className="success-actions">
                        <Link to="/" className="btn btn-primary btn-lg">
                            Back to Home
                        </Link>
                        <Link to="/products" className="btn btn-outline btn-lg">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ── Validation ──────────────────────────────────────────────────────────
    function validate() {
        const errs = {};
        if (!form.name.trim()) errs.name = "Full name is required.";
        if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email.";
        if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = "Enter a valid 10-digit mobile number.";
        if (!form.address.trim()) errs.address = "Address is required.";
        if (!form.city.trim()) errs.city = "City is required.";
        if (!form.state.trim()) errs.state = "State is required.";
        if (!/^\d{6}$/.test(form.pincode)) errs.pincode = "Enter a valid 6-digit PIN code.";
        return errs;
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // ── Pay button handler ──────────────────────────────────────────────────
    async function handlePay(e) {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            // Scroll to first error
            const firstErr = document.querySelector(".field-error");
            firstErr?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        setIsProcessing(true);
        setPaymentStatus(null);

        const receipt = `rcpt_${Date.now()}`;

        try {
            const result = await initRazorpayPayment({
                amountInPaise: grandTotal * 100, // convert ₹ → paise
                receipt,
                prefill: {
                    name: form.name,
                    email: form.email,
                    contact: form.phone,
                },
                notes: {
                    address: `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
                },
                keyId: RAZORPAY_KEY_ID,
                onSuccess: (details) => {
                    setPaymentDetails(details);
                    setPaymentStatus("success");
                    clearCart();
                    toast.success("🎉 Payment successful! Your order is confirmed.");
                },
                onFailure: (msg) => {
                    setPaymentStatus("failed");
                    if (msg !== "Payment cancelled by user.") {
                        toast.error("❌ " + msg);
                    }
                    console.error("Payment failed:", msg);
                },
            });

            if (result) {
                setPaymentDetails(result);
                setPaymentStatus("success");
                clearCart();
            }
        } catch (err) {
            if (err.message !== "Payment cancelled.") {
                setPaymentStatus("failed");
            }
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <div className="checkout-page">
            {/* Header */}
            <div className="checkout-header">
                <div className="checkout-header-container">
                    <Link to="/cart" className="breadcrumb-back">
                        <HiOutlineChevronLeft /> Back to Cart
                    </Link>
                    <h1 className="checkout-title">
                        <HiOutlineLockClosed className="checkout-title-icon" />
                        Secure Checkout
                    </h1>
                </div>
            </div>

            <div className="checkout-layout">
                {/* ── LEFT: Address Form ─────────────────────────────────── */}
                <form className="checkout-form" onSubmit={handlePay} noValidate>
                    <div className="form-section">
                        <h2 className="form-section-title">
                            <HiOutlineUser className="form-section-icon" />
                            Contact Information
                        </h2>

                        <div className="form-grid">
                            {/* Full Name */}
                            <div className="form-field">
                                <label htmlFor="name" className="form-label">
                                    Full Name
                                </label>
                                <div className={`input-wrapper ${errors.name ? "input-error" : ""}`}>
                                    <HiOutlineUser className="input-icon" />
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Ravi Kumar"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="form-input"
                                        autoComplete="name"
                                    />
                                </div>
                                {errors.name && <p className="field-error">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div className="form-field">
                                <label htmlFor="email" className="form-label">
                                    Email Address
                                </label>
                                <div className={`input-wrapper ${errors.email ? "input-error" : ""}`}>
                                    <HiOutlineMail className="input-icon" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="ravi@example.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="form-input"
                                        autoComplete="email"
                                    />
                                </div>
                                {errors.email && <p className="field-error">{errors.email}</p>}
                            </div>

                            {/* Phone */}
                            <div className="form-field">
                                <label htmlFor="phone" className="form-label">
                                    Mobile Number
                                </label>
                                <div className={`input-wrapper ${errors.phone ? "input-error" : ""}`}>
                                    <HiOutlinePhone className="input-icon" />
                                    <span className="input-prefix">+91</span>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="9876543210"
                                        value={form.phone}
                                        onChange={handleChange}
                                        className="form-input input-with-prefix"
                                        maxLength={10}
                                        autoComplete="tel"
                                    />
                                </div>
                                {errors.phone && <p className="field-error">{errors.phone}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h2 className="form-section-title">
                            <HiOutlineLocationMarker className="form-section-icon" />
                            Delivery Address
                        </h2>

                        <div className="form-grid">
                            {/* Street Address */}
                            <div className="form-field form-field-full">
                                <label htmlFor="address" className="form-label">
                                    Street Address
                                </label>
                                <div className={`input-wrapper ${errors.address ? "input-error" : ""}`}>
                                    <HiOutlineLocationMarker className="input-icon" />
                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        placeholder="House No., Street, Area"
                                        value={form.address}
                                        onChange={handleChange}
                                        className="form-input"
                                        autoComplete="street-address"
                                    />
                                </div>
                                {errors.address && <p className="field-error">{errors.address}</p>}
                            </div>

                            {/* City */}
                            <div className="form-field">
                                <label htmlFor="city" className="form-label">
                                    City
                                </label>
                                <div className={`input-wrapper ${errors.city ? "input-error" : ""}`}>
                                    <HiOutlineOfficeBuilding className="input-icon" />
                                    <input
                                        id="city"
                                        name="city"
                                        type="text"
                                        placeholder="Chennai"
                                        value={form.city}
                                        onChange={handleChange}
                                        className="form-input"
                                        autoComplete="address-level2"
                                    />
                                </div>
                                {errors.city && <p className="field-error">{errors.city}</p>}
                            </div>

                            {/* State */}
                            <div className="form-field">
                                <label htmlFor="state" className="form-label">
                                    State
                                </label>
                                <div className={`input-wrapper ${errors.state ? "input-error" : ""}`}>
                                    <HiOutlineMap className="input-icon" />
                                    <select
                                        id="state"
                                        name="state"
                                        value={form.state}
                                        onChange={handleChange}
                                        className="form-input form-select"
                                        autoComplete="address-level1"
                                    >
                                        <option value="">Select State</option>
                                        {INDIAN_STATES.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                                {errors.state && <p className="field-error">{errors.state}</p>}
                            </div>

                            {/* Pincode */}
                            <div className="form-field">
                                <label htmlFor="pincode" className="form-label">
                                    PIN Code
                                </label>
                                <div className={`input-wrapper ${errors.pincode ? "input-error" : ""}`}>
                                    <HiOutlineLocationMarker className="input-icon" />
                                    <input
                                        id="pincode"
                                        name="pincode"
                                        type="text"
                                        placeholder="600001"
                                        value={form.pincode}
                                        onChange={handleChange}
                                        className="form-input"
                                        maxLength={6}
                                        autoComplete="postal-code"
                                    />
                                </div>
                                {errors.pincode && <p className="field-error">{errors.pincode}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Payment failed banner */}
                    {paymentStatus === "failed" && (
                        <div className="payment-error-banner">
                            ❌ Payment failed or was cancelled. Please try again.
                        </div>
                    )}

                    {/* Pay button */}
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg checkout-pay-btn"
                        id="pay-now-btn"
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <span className="pay-spinner" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <HiOutlineLockClosed />
                                Pay {formatPrice(grandTotal)} Securely
                            </>
                        )}
                    </button>

                    <p className="checkout-razorpay-note">
                        🔒 Powered by{" "}
                        <span className="razorpay-brand">Razorpay</span> — UPI, Cards,
                        Netbanking, Wallets accepted
                    </p>
                </form>

                {/* ── RIGHT: Order Summary ───────────────────────────────── */}
                <aside className="checkout-summary">
                    <div className="checkout-summary-card">
                        <h3 className="checkout-summary-title">Order Summary</h3>

                        {/* Items */}
                        <div className="checkout-items">
                            {cartItems.map((item) => (
                                <div className="checkout-item" key={item.id}>
                                    <div className="checkout-item-name">
                                        <span className="checkout-item-qty-badge">{item.quantity}×</span>
                                        {item.name}
                                    </div>
                                    <span className="checkout-item-price">
                                        {formatPrice(item.discountPrice * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="checkout-summary-divider" />

                        {/* Totals */}
                        <div className="checkout-summary-rows">
                            <div className="checkout-summary-row">
                                <span>Subtotal</span>
                                <span>{formatPrice(cartTotal + cartSavings)}</span>
                            </div>
                            {cartSavings > 0 && (
                                <div className="checkout-summary-row savings">
                                    <span>Discount</span>
                                    <span>- {formatPrice(cartSavings)}</span>
                                </div>
                            )}
                            <div className="checkout-summary-row">
                                <span>Delivery</span>
                                <span className={delivery === 0 ? "free-delivery" : ""}>
                                    {delivery === 0 ? "FREE" : formatPrice(delivery)}
                                </span>
                            </div>
                        </div>

                        <div className="checkout-summary-divider" />

                        <div className="checkout-total-row">
                            <span>Grand Total</span>
                            <span className="checkout-total-amount">{formatPrice(grandTotal)}</span>
                        </div>

                        {cartSavings > 0 && (
                            <div className="checkout-savings-badge">
                                🎉 Saving {formatPrice(cartSavings)}
                            </div>
                        )}

                        {/* Trust signals */}
                        <div className="checkout-trust">
                            <div className="checkout-trust-item">
                                <HiOutlineShieldCheck className="checkout-trust-icon" />
                                <span>100% Secure Payment</span>
                            </div>
                            <div className="checkout-trust-item">
                                <HiOutlineTruck className="checkout-trust-icon" />
                                <span>Fast Delivery from Sivakasi</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

// Full list of Indian states & UTs
const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
    "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
    "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    // Union Territories
    "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh",
    "Lakshadweep", "Puducherry",
];
