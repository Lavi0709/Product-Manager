import React from "react";
import { formatPrice } from "../utils/format";
export default function ProductTable({ products, onEdit }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Tags</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id}>
            <td>{p.name}</td>
            <td>{p.category}</td>
            <td>{formatPrice(p.price)}</td>
            <td>
              {typeof p.stock === "number" ? p.stock : Number(p.stock) || 0}
            </td>
            <td>{(p.tags || []).join(", ")}</td>
            <td>
              <button className="btn" onClick={() => onEdit(p)}>
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
