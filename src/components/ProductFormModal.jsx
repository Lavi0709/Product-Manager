import React, { useEffect, useState } from "react";
import Modal from "./Modal";

export default function ProductFormModal({ open, onClose, onSave, editing }) {
  const empty = {
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    tags: "",
  };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || "",
        price: editing.price !== undefined ? String(editing.price) : "",
        category: editing.category || "",
        stock: editing.stock !== undefined ? String(editing.stock) : "",
        description: editing.description || "",
        tags: (editing.tags || []).join(", "),
      });
      setErrors({});
    } else {
      setForm(empty);
      setErrors({});
    }
  }, [editing, open]);

  if (!open) return null;

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (form.price === "" || Number.isNaN(Number(form.price)))
      e.price = "Valid price is required";
    if (!form.category.trim()) e.category = "Category is required";
    if (
      form.stock !== "" &&
      (Number.isNaN(Number(form.stock)) || Number(form.stock) < 0)
    )
      e.stock = "Stock must be 0 or more";
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    const payload = {
      id: editing?.id || Date.now(),
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      stock: form.stock === "" ? 0 : Number(form.stock),
      description: form.description.trim(),
      tags: form.tags
        ? form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      createdAt: editing?.createdAt || new Date().toISOString(),
      isActive: editing?.isActive !== undefined ? editing.isActive : true,
    };
    onSave(payload);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2 style={{ marginTop: 0 }}>
        {editing ? "Edit Product" : "Add Product"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label className="label">
            Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>

        <div className="form-row">
          <div className="form-col">
            <label className="label">
              Price <span style={{ color: "red" }}>*</span>
            </label>
            <input
              className="input"
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            {errors.price && <div className="error">{errors.price}</div>}
          </div>
          <div className="form-col">
            <label className="label">
              Category <span style={{ color: "red" }}>*</span>
            </label>
            <input
              className="input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            {errors.category && <div className="error">{errors.category}</div>}
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          <label className="label">Stock</label>
          <input
            className="input"
            type="number"
            min="1"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          {errors.stock && <div className="error">{errors.stock}</div>}
        </div>

        <div style={{ marginTop: 8 }}>
          <label className="label">Tags (comma separated)</label>
          <input
            className="input"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </div>

        <div style={{ marginTop: 8 }}>
          <label className="label">Description</label>
          <textarea
            className="input"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div style={{ marginTop: 12, textAlign: "right" }}>
          <button
            type="button"
            className="btn"
            onClick={onClose}
            style={{ marginRight: 8 }}
          >
            Cancel
          </button>
          <button type="submit" className="btn primary">
            {editing ? "Save" : "Add"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
