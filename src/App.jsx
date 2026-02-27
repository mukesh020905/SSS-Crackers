import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AdminDataProvider } from "./context/AdminDataContext";

// Customer layout & pages
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import HomePage from "./pages/customer/HomePage";
import ProductsPage from "./pages/customer/ProductsPage";
import ProductDetailPage from "./pages/customer/ProductDetailPage";
import CartPage from "./pages/customer/CartPage";
import CheckoutPage from "./pages/customer/CheckoutPage";

// Admin layout & pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";

function App() {
    return (
        <CartProvider>
            <AdminDataProvider>
                <Router>
                    <Routes>
                        {/* ── Customer routes — with Navbar + Footer ── */}
                        <Route
                            path="/*"
                            element={
                                <div className="page-wrapper">
                                    <Navbar />
                                    <main className="page-content">
                                        <Routes>
                                            <Route path="/" element={<HomePage />} />
                                            <Route path="/products" element={<ProductsPage />} />
                                            <Route path="/products/:id" element={<ProductDetailPage />} />
                                            <Route path="/cart" element={<CartPage />} />
                                            <Route path="/checkout" element={<CheckoutPage />} />
                                        </Routes>
                                    </main>
                                    <Footer />
                                </div>
                            }
                        />

                        {/* ── Admin routes — own sidebar layout, no Navbar/Footer ── */}
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="products" element={<AdminProducts />} />
                            <Route path="orders" element={<AdminOrders />} />
                        </Route>
                    </Routes>
                </Router>
            </AdminDataProvider>
        </CartProvider>
    );
}

export default App;
