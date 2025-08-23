import React, { useEffect, useMemo, useState } from "react";
import SEED_PRODUCTS from "../data/products.json";
import useDebounce from "../hooks/useDebounce";
import ProductTable from "../components/ProductTable";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import ProductFormModal from "../components/ProductFormModal";
import EmptyState from "../components/EmptyState";

export default function ProductManager() {
  const [products, setProducts] = useState(() => {
    // normalize dataset
    return SEED_PRODUCTS.map((p) => ({
      ...p,
      price: Number(p.price),
      stock: p.stock === undefined ? 0 : Number(p.stock),
      tags: Array.isArray(p.tags) ? p.tags : [],
      createdAt: p.createdAt || new Date().toISOString(),
    }));
  });

  const [view, setView] = useState("grid"); // 'grid' or 'table'
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, pageSize]);

  const filtered = useMemo(() => {
    const q = String(debouncedQuery || "")
      .trim()
      .toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }, [products, debouncedQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(item) {
    setEditing(item);
    setModalOpen(true);
  }
  function handleSave(product) {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists)
        return prev.map((p) =>
          p.id === product.id ? { ...p, ...product } : p
        );
      return [product, ...prev];
    });
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Product Manager</h1>
      </header>

      <div className="toolbar">
        <div style={{ display: "flex", gap: 6 }}>
          <button
            className="btn"
            onClick={() => setView("grid")}
            style={{ fontWeight: view === "grid" ? 700 : 400 }}
          >
            Grid
          </button>
          <button
            className="btn"
            onClick={() => setView("table")}
            style={{ fontWeight: view === "table" ? 700 : 400 }}
          >
            List
          </button>
        </div>

        <div className="search">
          <SearchBar value={query} onChange={setQuery} />
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label className="small">Page size:</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="input"
            style={{ width: 90 }}
          >
            {[4, 8, 12, 16].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <button className="btn primary" onClick={openAdd}>
            Add Product
          </button>
        </div>
      </div>

      <main>
        {pageItems.length === 0 ? (
          <EmptyState
            title="No products"
            description="No products match your search."
          />
        ) : view === "grid" ? (
          <div className="grid">
            {pageItems.map((p) => (
              <ProductCard key={p.id} product={p} onEdit={openEdit} />
            ))}
          </div>
        ) : (
          <ProductTable products={pageItems} onEdit={openEdit} />
        )}

        <div
          style={{
            marginTop: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="small">
            Showing {pageItems.length} of {filtered.length} result
            {filtered.length === 1 ? "" : "s"}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </main>

      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editing={editing}
      />
    </div>
  );
}
