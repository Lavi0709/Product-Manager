import React from "react";
import { formatPrice } from "../utils/format";
export default function ProductCard({ product, onEdit }) {
  return (
    <div className="card">
      <h3>{product.name}</h3>
      <div className="small">
        {product.category} • {product.isActive ? "Active" : "Inactive"}
      </div>
      <div style={{ marginTop: 8 }}>{product.description}</div>
      <div
        style={{
          marginTop: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: 700 }}>{formatPrice(product.price)}</div>
        <div>
          <button className="btn" onClick={() => onEdit(product)}>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
