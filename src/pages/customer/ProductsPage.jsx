import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { HiOutlineSearch, HiOutlineAdjustments, HiOutlineX } from "react-icons/hi";
import ProductCard from "../../components/common/ProductCard";
import products, { categories } from "../../data/products";
import "./ProductsPage.css";

const SORT_OPTIONS = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Top Rated" },
    { value: "name", label: "Name: A to Z" },
];

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryParam = searchParams.get("category") || "";

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(categoryParam);
    const [sortBy, setSortBy] = useState("featured");
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Search
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q)
            );
        }

        // Category
        if (selectedCategory) {
            result = result.filter((p) => p.categorySlug === selectedCategory);
        }

        // Sort
        switch (sortBy) {
            case "price-low":
                result.sort((a, b) => a.discountPrice - b.discountPrice);
                break;
            case "price-high":
                result.sort((a, b) => b.discountPrice - a.discountPrice);
                break;
            case "rating":
                result.sort((a, b) => b.rating - a.rating);
                break;
            case "name":
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        }

        return result;
    }, [search, selectedCategory, sortBy]);

    const handleCategoryChange = (slug) => {
        setSelectedCategory(slug);
        if (slug) {
            setSearchParams({ category: slug });
        } else {
            setSearchParams({});
        }
    };

    const clearFilters = () => {
        setSearch("");
        setSelectedCategory("");
        setSortBy("featured");
        setSearchParams({});
    };

    const hasActiveFilters = search || selectedCategory;

    return (
        <div className="products-page">
            {/* Page Header */}
            <div className="products-page-header">
                <div className="products-header-container">
                    <h1 className="products-page-title">
                        {selectedCategory
                            ? categories.find((c) => c.slug === selectedCategory)?.name || "Products"
                            : "All Products"}
                    </h1>
                    <p className="products-page-count">
                        Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
                    </p>
                </div>
            </div>

            <div className="products-layout">
                {/* Mobile filter toggle */}
                <button
                    className="mobile-filter-toggle"
                    onClick={() => setMobileFiltersOpen(true)}
                >
                    <HiOutlineAdjustments />
                    Filters
                </button>

                {/* Sidebar Filters */}
                <aside className={`products-sidebar ${mobileFiltersOpen ? "sidebar-open" : ""}`}>
                    <div className="sidebar-header">
                        <h3>Filters</h3>
                        <button
                            className="sidebar-close"
                            onClick={() => setMobileFiltersOpen(false)}
                        >
                            <HiOutlineX />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="filter-group">
                        <label className="filter-label">Search</label>
                        <div className="search-input-wrapper">
                            <HiOutlineSearch className="search-input-icon" />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search crackers..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                id="search-input"
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="filter-group">
                        <label className="filter-label">Category</label>
                        <div className="filter-options">
                            <button
                                className={`filter-option ${!selectedCategory ? "active" : ""}`}
                                onClick={() => handleCategoryChange("")}
                            >
                                All Categories
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.slug}
                                    className={`filter-option ${selectedCategory === cat.slug ? "active" : ""}`}
                                    onClick={() => handleCategoryChange(cat.slug)}
                                >
                                    <span>{cat.icon}</span> {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {hasActiveFilters && (
                        <button className="clear-filters-btn" onClick={clearFilters}>
                            Clear all filters
                        </button>
                    )}
                </aside>

                {/* Mobile overlay */}
                {mobileFiltersOpen && (
                    <div className="sidebar-overlay" onClick={() => setMobileFiltersOpen(false)} />
                )}

                {/* Products Grid */}
                <main className="products-main">
                    {/* Sort bar */}
                    <div className="sort-bar">
                        <div className="sort-bar-left">
                            {hasActiveFilters && (
                                <div className="active-filters">
                                    {selectedCategory && (
                                        <span className="filter-chip">
                                            {categories.find((c) => c.slug === selectedCategory)?.name}
                                            <button onClick={() => handleCategoryChange("")}>
                                                <HiOutlineX />
                                            </button>
                                        </span>
                                    )}
                                    {search && (
                                        <span className="filter-chip">
                                            "{search}"
                                            <button onClick={() => setSearch("")}>
                                                <HiOutlineX />
                                            </button>
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="sort-select-wrapper">
                            <label className="sort-label">Sort by:</label>
                            <select
                                className="sort-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                id="sort-select"
                            >
                                {SORT_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="products-grid-page">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="products-empty">
                            <span className="empty-emoji">🔍</span>
                            <h3>No products found</h3>
                            <p>Try a different search or clear your filters.</p>
                            <button className="btn btn-outline" onClick={clearFilters}>
                                Clear Filters
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
